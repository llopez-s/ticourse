#!/usr/bin/env node
// Renders review stills at the moments that matter — each scene's start and
// end, every cue, exam card and think prompt — in ONE Remotion render call.
//
//   node video/engine/scripts/qa-frames.mjs --video <slug>                   # all scenes -> video/<slug>/out/qa/all/
//   node video/engine/scripts/qa-frames.mjs --video <slug> --scene s05-correlate
//   node video/engine/scripts/qa-frames.mjs --video <slug> --extra 1200,1350
//   node video/engine/scripts/qa-frames.mjs --video <slug> --sheet          # + out/qa/sheets/sheetNN.jpg
//
// Works in estimate and audio mode. Files are renamed to
// f<frame>_<scene>_<label>.jpeg and listed in index.json next to them. With --sheet, the stills
// are also laid out 3×4 per contact sheet (qa_sheet.py, Pillow in the Chatterbox venv).
// The bundle is reused from out/bundle-cache/ while its inputs are unchanged (--no-bundle-cache
// or BUNDLE_CACHE=0 rebuilds it in a temp folder).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { parseJsonText } from './lib/narration.mjs';
import { COMPOSITION, PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';
import { assertCliFlags, bundleVideo, runRemotion } from './lib/remotion.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

/** Frames worth looking at, with what they show. */
export function pickFrames(timeline, { scene = null, extra = [] } = {}) {
  const last = timeline.durationInFrames - 1;
  const picks = new Map(); // frame -> Set(labels)
  const add = (frame, sceneId, label) => {
    const f = Math.max(0, Math.min(last, Math.round(frame)));
    if (!picks.has(f)) picks.set(f, []);
    picks.get(f).push(`${sceneId}/${label}`);
  };
  const scenes = timeline.scenes.filter((s) => !scene || s.id === scene);
  for (const s of scenes) {
    add(s.from + 20, s.id, 'start');
    for (const c of timeline.cues.filter((x) => x.scene === s.id)) add(c.frame + 12, s.id, `cue-${c.id}`);
    for (const e of timeline.exam.filter((x) => x.scene === s.id)) add(e.from + 20, s.id, `exam-${e.objective}`);
    for (const t of timeline.think.filter((x) => x.scene === s.id)) add(t.from + 10, s.id, 'think');
    for (const i of (timeline.intercept ?? []).filter((x) => x.scene === s.id)) {
      add(i.from + 30, s.id, 'intercept-typing');
      add(i.from + i.durationInFrames - 20, s.id, 'intercept');
    }
    add(s.from + s.durationInFrames - 10, s.id, 'end');
  }
  for (const f of extra) {
    const owner = timeline.scenes.find((s) => f >= s.from && f < s.from + s.durationInFrames);
    add(f, owner?.id ?? 'video', 'extra');
  }
  return [...picks.entries()].sort((a, b) => a[0] - b[0]).map(([frame, labels]) => ({ frame, labels }));
}

/** True when the installed CLI accepts --frames=1,5,9 (non-contiguous frame lists). */
function supportsFrameLists() {
  const file = path.join(REPO_ROOT, 'node_modules', '@remotion', 'renderer', 'dist', 'options', 'frames.js');
  if (!existsSync(file)) return false;
  const src = readFileSync(file, 'utf8');
  return src.includes("includes(',')") && src.includes("type: 'frames'");
}

const slug = (s) => s.replace(/[^\w.-]+/g, '-').slice(0, 80);

/** Exit code qa_sheet.py uses when Pillow is missing. */
const NO_PILLOW = 3;

/**
 * Lays the stills of `srcDir` out as out/qa/sheets/sheetNN.jpg. The stills are already written,
 * so a missing venv or Pillow only prints how to get them; any other failure sets exit code 1.
 */
function contactSheets(srcDir) {
  const out = path.join(PATHS.qaDir, 'sheets');
  mkdirSync(out, { recursive: true });
  for (const f of readdirSync(out)) if (/^sheet\d+\.jpg$/i.test(f)) rmSync(path.join(out, f));
  const pipHint = `"${VENV_PYTHON}" -m pip install pillow`;
  if (!existsSync(VENV_PYTHON)) {
    console.warn(`qa-frames: no contact sheets — the Chatterbox venv is missing (${VENV_PYTHON}). Create it as in video/engine/README.md («Voz: Chatterbox»), then: ${pipHint}`);
    return;
  }
  const res = spawnSync(VENV_PYTHON, ['-X', 'utf8', path.join(SCRIPTS_DIR, 'qa_sheet.py'), '--src', srcDir, '--out', out], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (res.status === NO_PILLOW) {
    console.warn(`qa-frames: no contact sheets — Pillow is not installed in the venv. Install it with: ${pipHint}`);
    return;
  }
  if (res.error || res.status !== 0) {
    console.error(`qa-frames: contact sheets failed: ${res.error?.message ?? (res.stderr.trim() || `exit ${res.status}`)}`);
    process.exitCode = 1;
    return;
  }
  const sheets = res.stdout.split(/\r?\n/).filter((l) => /sheet\d+\.jpg$/i.test(l));
  console.log(`qa-frames: ${sheets.length} contact sheet(s) -> ${out}`);
}

async function main() {
  const { values } = parseArgs({
    options: {
      scene: { type: 'string' },
      extra: { type: 'string' },
      scale: { type: 'string', default: '0.5' },
      video: { type: 'string' },
      sheet: { type: 'boolean', default: false },
      'no-bundle-cache': { type: 'boolean', default: false },
    },
  });
  const timeline = parseJsonText(readFileSync(PATHS.timeline, 'utf8'), PATHS.timeline);
  if (values.scene && !timeline.scenes.some((s) => s.id === values.scene)) {
    throw new Error(`unknown scene ${values.scene} (known: ${timeline.scenes.map((s) => s.id).join(', ')})`);
  }
  const extra = (values.extra ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const n = Number(x);
      if (!Number.isInteger(n) || n < 0) throw new Error(`--extra: "${x}" is not a frame number`);
      return n;
    });
  const picks = pickFrames(timeline, { scene: values.scene ?? null, extra });
  if (!picks.length) throw new Error('no frames selected');
  const outDir = path.join(PATHS.qaDir, values.scene ?? 'all');
  mkdirSync(outDir, { recursive: true });
  for (const f of readdirSync(outDir)) if (/\.(jpe?g|json)$/i.test(f)) rmSync(path.join(outDir, f));

  const common = ['--image-format=jpeg', '--jpeg-quality=85', `--scale=${values.scale}`];
  assertCliFlags(['frames', 'sequence', 'image-format', 'jpeg-quality', 'scale', 'public-dir']);
  const frames = picks.map((p) => p.frame);
  console.log(`qa-frames: ${frames.length} frames (${timeline.mode} mode) -> ${outDir}`);
  const started = Date.now();
  const produced = new Map(); // frame -> file path

  // Bundle once, then render from the finished bundle (see bundleVideo in lib/remotion.mjs).
  const bundle = bundleVideo(values['no-bundle-cache'] ? { cache: false } : {});
  try {
    if (supportsFrameLists()) {
      const res = runRemotion(['render', bundle.dir, COMPOSITION, outDir, '--sequence', `--frames=${frames.join(',')}`, ...common]);
      if (res.status !== 0) throw new Error(`remotion render failed (exit ${res.status})`);
      for (const f of readdirSync(outDir)) {
        const m = /(\d+)\.jpe?g$/i.exec(f);
        if (m) produced.set(Number(m[1]), path.join(outDir, f));
      }
    } else {
      // Fallback: one still per frame from the same bundle.
      for (const frame of frames) {
        const file = path.join(outDir, `element-${frame}.jpeg`);
        const res = runRemotion(['still', bundle.dir, COMPOSITION, file, `--frame=${frame}`, ...common]);
        if (res.status !== 0) throw new Error(`remotion still failed at frame ${frame}`);
        produced.set(frame, file);
      }
    }
  } finally {
    bundle.remove();
  }

  const pad = String(timeline.durationInFrames).length;
  const index = [];
  const missing = [];
  for (const { frame, labels } of picks) {
    const src = produced.get(frame);
    if (!src) {
      missing.push(frame);
      continue;
    }
    const name = `f${String(frame).padStart(pad, '0')}_${slug(labels[0].replace('/', '_'))}.jpeg`;
    renameSync(src, path.join(outDir, name));
    index.push({ file: name, frame, labels });
  }
  writeFileSync(path.join(outDir, 'index.json'), `${JSON.stringify(index, null, 1)}\n`);
  const width = Math.max(...index.map((x) => x.file.length));
  for (const x of index) console.log(`${x.file.padEnd(width)}  -> ${String(x.frame).padStart(pad)}  -> ${x.labels.join(', ')}`);
  console.log(`qa-frames: ${index.length} stills in ${((Date.now() - started) / 1000).toFixed(0)} s`);
  if (missing.length) throw new Error(`frames not produced: ${missing.join(', ')}`);
  if (values.sheet) contactSheets(outDir);
}

if (isMainModule(import.meta.url)) {
  main().catch((err) => {
    console.error(`qa-frames: ${err.message}`);
    process.exit(1);
  });
}
