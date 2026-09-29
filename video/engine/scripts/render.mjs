#!/usr/bin/env node
// Renders the final MP4 + poster with the bundled Remotion CLI, then checks the
// result (duration, codecs, size, audio/video sync).
//
//   node video/engine/scripts/render.mjs --video <slug>
//     repo profiles (principal/capsula): public/videos/<output>.mp4 + -poster.png
//     -yt profiles (principal-yt/capsula-yt): video/<slug>/out/<output>.mp4 (git-ignored,
//       uploaded to YouTube instead) + public/videos/<output>-poster.png (poster always goes there)
//   node video/engine/scripts/render.mjs --video <slug> --draft  # half scale, crf 30 -> video/<slug>/out/draft.mp4
//   node video/engine/scripts/render.mjs --video <slug> --master [--bed-db <n>]
//     also masters the audio (master_mix.py) WHILE the frames render: Remotion's audio-only render
//     (seconds) feeds master_mix's heavy stage (ambient bed, loudness) in parallel with the video render;
//     at the end only the light stage runs (limit, AAC, mux, delivered-peak check). The unmastered
//     render stays as <output>-premaster.mp4 (the sync checks run on it: the bed fills the silences
//     they look for) and the mastered one is <output>.mp4. Python: $MASTER_PYTHON, else the Chatterbox
//     venv; it needs pedalboard, pyloudnorm, soundfile and scipy, checked before anything renders.
//
// Refuses to run unless src/timeline.json is in audio mode, its sourceHash
// matches the current sources and every voice clip exists. crf and the size
// target come from the video's profile (video.json -> scripts/lib/profiles.mjs).
// The video is bundled once, then the MP4 and the poster render from that bundle.
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { checkTimelineFresh } from './lib/freshness.mjs';
import { COMPOSITION, MANIFEST, PATHS, POSTER_STILL, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import { assertCliFlags, bundleVideo, ffmpegBinary, probeMedia, runPool, runRemotion, runRemotionAsync, spawnAsync } from './lib/remotion.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

const PROFILE = profileFor(MANIFEST.profile);
const SIZE = PROFILE.size; // MB (10^6 bytes)
const SYNC_TOLERANCE_FRAMES = 2;

/** silence_end times (s) from ffmpeg's silencedetect filter. */
export function parseSilenceEnds(stderr) {
  return [...stderr.matchAll(/silence_end:\s*([\d.]+)/g)].map((m) => Number(m[1]));
}

/** Where speech becomes audible inside one clip (s): the end of its leading silence, else 0. */
export function clipOnset(stderr) {
  const start = /silence_start:\s*([\d.]+)/.exec(stderr);
  const end = /silence_end:\s*([\d.]+)/.exec(stderr);
  return start && Number(start[1]) <= 0.01 && end ? Number(end[1]) : 0;
}

/**
 * Compares where each segment becomes audible in the render (nearest
 * silence_end) with where it should: its start frame plus the clip's own onset
 * (edge-tts clips begin with ~180 ms of near-silence, ~80 ms after the first
 * word boundary). A systematic offset (median beyond tolerance) fails;
 * scattered mismatches only warn.
 * @param {Map<string, number>} [clipOnsets] seconds per segment id; falls back to the first word
 */
export function syncReport(timeline, silenceEnds, clipOnsets = new Map()) {
  const fps = timeline.fps;
  const rows = timeline.segments.map((seg) => {
    const onset = clipOnsets.has(seg.id) ? seg.from / fps + clipOnsets.get(seg.id) : seg.words[0].from / fps;
    let nearest = null;
    for (const t of silenceEnds) if (nearest === null || Math.abs(t - onset) < Math.abs(nearest - onset)) nearest = t;
    const deltaFrames = nearest === null ? null : (nearest - onset) * fps;
    return { id: seg.id, onset, nearest, deltaFrames };
  });
  const near = rows.filter((r) => r.deltaFrames !== null && Math.abs(r.deltaFrames) <= 15);
  const mismatches = near.filter((r) => Math.abs(r.deltaFrames) > SYNC_TOLERANCE_FRAMES);
  const sorted = near.map((r) => r.deltaFrames).sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
  const conclusive = near.length >= Math.ceil(rows.length / 2);
  return {
    rows,
    near: near.length,
    mismatches,
    median,
    conclusive,
    fail: conclusive && median !== null && Math.abs(median) > SYNC_TOLERANCE_FRAMES,
  };
}

/** Files of a --master render, next to the final MP4: the unmastered render, the program audio and the premaster. */
export function masterPaths(out) {
  const base = out.replace(/\.mp4$/i, '');
  return { video: `${base}-premaster.mp4`, program: `${base}-program.wav`, premaster: `${base}-premaster.wav`, final: out };
}

/** The Python that runs master_mix.py, or throws before anything renders if it lacks the audio libraries. */
function masterPython() {
  const py = process.env.MASTER_PYTHON || VENV_PYTHON;
  const probe = spawnSync(py, ['-c', 'import pedalboard, pyloudnorm, soundfile, scipy'], { encoding: 'utf8', windowsHide: true });
  if (probe.error || probe.status !== 0) {
    throw new Error(`--master needs a Python with pedalboard, pyloudnorm, soundfile and scipy (${py}): ${(probe.stderr || probe.error?.message || '').trim().split('\n').pop()} — pip install them there, or set MASTER_PYTHON`);
  }
  return py;
}

function run(label, args) {
  console.log(`\n== ${label}\nremotion ${args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')}`);
  const res = runRemotion(args);
  if (res.status !== 0) throw new Error(`${label} failed (exit ${res.status})`);
}

async function main() {
  const { values } = parseArgs({
    options: {
      draft: { type: 'boolean', default: false },
      master: { type: 'boolean', default: false },
      'bed-db': { type: 'string' },
      concurrency: { type: 'string' },
      video: { type: 'string' },
    },
  });
  const draft = values.draft;
  const master = values.master;
  if (master && draft) throw new Error('--master is for the final render, not a --draft');
  const py = master ? masterPython() : null;
  const fresh = checkTimelineFresh();
  if (!fresh.ok) {
    console.error('render.mjs: refusing to render:');
    for (const p of fresh.problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  const timeline = fresh.timeline;
  const expectedSec = timeline.durationInFrames / timeline.fps;

  const flags = ['codec', 'crf', 'x264-preset', 'pixel-format', 'audio-codec', 'audio-bitrate', 'image-format', 'jpeg-quality', 'concurrency', 'enforce-audio-track', 'scale'];
  assertCliFlags(flags);

  const paths = master ? masterPaths(PATHS.video) : null;
  // With --master the frames render to the -premaster.mp4; the mastered file takes the final name.
  const out = draft ? PATHS.draft : master ? paths.video : PATHS.video;
  // A YouTube render is 100+ MB at crf 18 and must never reach the public repo.
  if (!draft && PROFILE.host === 'youtube' && spawnSync('git', ['check-ignore', '-q', out], { cwd: REPO_ROOT }).status !== 0) {
    throw new Error(`${out} is not git-ignored: a YouTube render must stay out of the repo (see the root .gitignore)`);
  }
  mkdirSync(path.dirname(out), { recursive: true });
  const concurrency = Math.max(1, Math.min(Number(values.concurrency ?? 8), os.cpus().length));
  const args = [
    'render',
    null, // the bundle dir, set below
    COMPOSITION,
    out,
    '--codec=h264',
    `--crf=${draft ? 30 : PROFILE.crf}`,
    `--x264-preset=${draft ? 'veryfast' : PROFILE.x264Preset}`,
    '--pixel-format=yuv420p',
    '--audio-codec=aac',
    '--audio-bitrate=96K',
    '--image-format=jpeg',
    '--jpeg-quality=92',
    `--concurrency=${concurrency}`,
    '--enforce-audio-track',
    ...(draft ? ['--scale=0.5'] : []),
  ];
  const started = Date.now();
  console.log('\n== bundle');
  const bundle = bundleVideo();
  try {
    args[1] = bundle.dir;
    if (master) {
      // The audio chain (audio-only render, then master_mix's heavy stage) runs while the frames render.
      const audioChain = (async () => {
        const t0 = Date.now();
        const wav = await runRemotionAsync(['render', bundle.dir, COMPOSITION, paths.program, '--codec=wav', '--enforce-audio-track']);
        if (wav.status !== 0) throw new Error(`audio-only render failed (exit ${wav.status}): ${wav.stderr.trim().slice(-400)}`);
        console.log(`\n== audio: program rendered in ${((Date.now() - t0) / 1000).toFixed(0)} s; premastering while the frames render`);
        const pre = await spawnAsync(py, [
          path.join(SCRIPTS_DIR, 'master_mix.py'), '--audio-in', paths.program, '--timeline', PATHS.timeline,
          '--premaster-out', paths.premaster, '--ffmpeg', ffmpegBinary(), ...(values['bed-db'] ? ['--bed-db', values['bed-db']] : []),
        ]);
        if (pre.status !== 0) throw new Error(`master_mix stage 1 failed (exit ${pre.status}): ${pre.stderr.trim().slice(-600)}`);
        console.log(`\n== audio: premaster ready after ${((Date.now() - t0) / 1000).toFixed(0)} s\n${pre.stdout.trim()}`);
      })();
      console.log(`\n== render\nremotion ${args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')}`);
      const [video] = await Promise.all([runRemotionAsync(args, { inherit: true }), audioChain]);
      if (video.status !== 0) throw new Error(`render failed (exit ${video.status})`);
    } else {
      run(draft ? 'render (draft)' : 'render', args);
    }
    if (!draft) run('poster', ['still', bundle.dir, POSTER_STILL, PATHS.poster, '--image-format=png']);
  } finally {
    bundle.remove();
  }
  console.log(`\nrendered in ${((Date.now() - started) / 1000).toFixed(0)} s`);

  // Checks
  const errors = [];
  const warnings = [];
  const info = probeMedia(out);
  const duration = Number(info.format?.duration);
  const video = info.streams?.find((s) => s.codec_type === 'video');
  const audio = info.streams?.find((s) => s.codec_type === 'audio');
  const [w, h] = draft ? [timeline.width / 2, timeline.height / 2] : [timeline.width, timeline.height];
  if (!(Math.abs(duration - expectedSec) <= 0.2)) errors.push(`duration ${duration.toFixed(2)} s, timeline says ${expectedSec.toFixed(2)} s`);
  if (video?.codec_name !== 'h264') errors.push(`video codec ${video?.codec_name ?? 'missing'} (want h264)`);
  if (video && (video.width !== w || video.height !== h)) errors.push(`video ${video.width}x${video.height} (want ${w}x${h})`);
  if (video && video.r_frame_rate !== `${timeline.fps}/1`) errors.push(`frame rate ${video.r_frame_rate} (want ${timeline.fps}/1)`);
  if (audio?.codec_name !== 'aac') errors.push(`audio codec ${audio?.codec_name ?? 'missing'} (want aac)`);
  const mb = statSync(out).size / 1e6;
  console.log(`\n${out}\n  ${duration.toFixed(2)} s · ${video?.codec_name} ${video?.width}x${video?.height} @ ${video?.r_frame_rate} · ${audio?.codec_name} ${audio?.sample_rate} Hz · ${mb.toFixed(1)} MB`);
  if (!draft) {
    if (!SIZE) console.log(`  size not checked: the "${MANIFEST.profile}" profile is uploaded to YouTube, which re-encodes it`);
    else if (mb > SIZE.fail) errors.push(`file is ${mb.toFixed(1)} MB (limit ${SIZE.fail} MB)`);
    else if (mb > SIZE.warn) warnings.push(`file is ${mb.toFixed(1)} MB (warn above ${SIZE.warn} MB)`);
    else if (mb < SIZE.targetMin || mb > SIZE.targetMax) warnings.push(`file is ${mb.toFixed(1)} MB (target ${SIZE.targetMin}–${SIZE.targetMax} MB)`);
    else console.log(`  size within the ${SIZE.targetMin}–${SIZE.targetMax} MB target`);
  }

  // A/V sync: each segment should become audible at its start frame + its clip's own onset.
  const sd = runRemotion(['ffmpeg', '-hide_banner', '-nostats', '-i', out, '-vn', '-af', 'silencedetect=n=-40dB:d=0.25', '-f', 'null', '-'], { capture: true });
  const ends = parseSilenceEnds(`${sd.stderr}\n${sd.stdout}`);
  if (sd.status !== 0 || !ends.length) {
    warnings.push('A/V sync check inconclusive: silencedetect found no silence_end');
  } else {
    const onsets = new Map();
    await runPool(timeline.segments, 8, async (seg) => {
      const clip = path.join(PATHS.publicDir, seg.audio);
      const res = await runRemotionAsync(['ffmpeg', '-hide_banner', '-nostats', '-i', clip, '-af', 'silencedetect=n=-40dB:d=0.05', '-f', 'null', '-']);
      if (res.status === 0) onsets.set(seg.id, clipOnset(`${res.stderr}\n${res.stdout}`));
    });
    const rep = syncReport(timeline, ends, onsets);
    const fmt = (r) => `${r.id} (${r.deltaFrames >= 0 ? '+' : ''}${r.deltaFrames.toFixed(1)} f)`;
    console.log(`  A/V sync: ${rep.near}/${rep.rows.length} segment onsets next to a silence end, median offset ${rep.median?.toFixed(2) ?? '?'} frames`);
    if (!rep.conclusive) warnings.push(`A/V sync check inconclusive: only ${rep.near}/${rep.rows.length} onsets near a detected silence end`);
    if (rep.fail) errors.push(`A/V sync: systematic offset of ${rep.median.toFixed(1)} frames between the timeline and the audio`);
    else if (rep.mismatches.length) warnings.push(`A/V sync: onsets more than ${SYNC_TOLERANCE_FRAMES} frames from a silence end: ${rep.mismatches.map(fmt).join(', ')}`);
  }

  for (const wmsg of warnings) console.warn(`  aviso: ${wmsg}`);
  if (errors.length) {
    console.error(`render.mjs: ${errors.length} check(s) failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
    process.exit(1);
  }
  if (master) {
    // The light stage: limit, AAC next to the untouched video stream, delivered-peak check.
    console.log('\n== master (stage 2)');
    const t0 = Date.now();
    const fin = spawnSync(py, [path.join(SCRIPTS_DIR, 'master_mix.py'), '--video-in', out, '--premaster', paths.premaster, '--out', paths.final, '--ffmpeg', ffmpegBinary()], {
      cwd: REPO_ROOT, stdio: 'inherit', windowsHide: true,
    });
    if (fin.status !== 0) throw new Error(`master_mix stage 2 failed (exit ${fin.status})`);
    const finalSec = Number(probeMedia(paths.final).format?.duration);
    if (!(Math.abs(finalSec - expectedSec) <= 0.2)) throw new Error(`mastered duration ${finalSec.toFixed(2)} s, timeline says ${expectedSec.toFixed(2)} s`);
    rmSync(paths.program, { force: true });
    console.log(`  mastered in ${((Date.now() - t0) / 1000).toFixed(0)} s after the frames`);
  }
  console.log(draft ? `\ndraft ok -> ${out}` : `\nok -> ${master ? paths.final : out}\n      ${PATHS.poster}`);
}

if (isMainModule(import.meta.url)) {
  main().catch((err) => {
    console.error(`render.mjs: ${err.message}`);
    process.exit(1);
  });
}
