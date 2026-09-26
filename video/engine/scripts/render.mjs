#!/usr/bin/env node
// Renders the final MP4 + poster with the bundled Remotion CLI, then checks the
// result (duration, codecs, size, audio/video sync).
//
//   node video/engine/scripts/render.mjs --video <slug>          # public/videos/<output>.mp4 + -poster.png
//   node video/engine/scripts/render.mjs --video <slug> --draft  # half scale, crf 30 -> video/<slug>/out/draft.mp4
//
// Refuses to run unless src/timeline.json is in audio mode, its sourceHash
// matches the current sources and every voice clip exists. crf and the size
// target come from the video's profile (video.json -> scripts/lib/profiles.mjs).
// The video is bundled once, then the MP4 and the poster render from that bundle.
import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { checkTimelineFresh } from './lib/freshness.mjs';
import { COMPOSITION, MANIFEST, PATHS, POSTER_STILL, REPO_ROOT, isMainModule } from './lib/paths.mjs';
import { profileFor } from './lib/profiles.mjs';
import { assertCliFlags, bundleVideo, probeMedia, runPool, runRemotion, runRemotionAsync } from './lib/remotion.mjs';

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

function run(label, args) {
  console.log(`\n== ${label}\nremotion ${args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')}`);
  const res = runRemotion(args);
  if (res.status !== 0) throw new Error(`${label} failed (exit ${res.status})`);
}

async function main() {
  const { values } = parseArgs({
    options: {
      draft: { type: 'boolean', default: false },
      concurrency: { type: 'string' },
      video: { type: 'string' },
    },
  });
  const draft = values.draft;
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

  const out = draft ? PATHS.draft : PATHS.video;
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
    `--x264-preset=${draft ? 'veryfast' : 'slow'}`,
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
    run(draft ? 'render (draft)' : 'render', args);
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
  console.log(draft ? `\ndraft ok -> ${out}` : `\nok -> ${out}\n      ${PATHS.poster}`);
}

if (isMainModule(import.meta.url)) {
  main().catch((err) => {
    console.error(`render.mjs: ${err.message}`);
    process.exit(1);
  });
}
