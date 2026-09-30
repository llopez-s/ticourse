#!/usr/bin/env node
// Renders only the video's program audio (narration + adversary voice + sound effects, as Remotion mixes them)
// to a WAV, to try out master_mix.py's beds without rendering the frames:
//
//   node video/engine/scripts/render-audio.mjs --video <slug> [--out <file.wav>]
//   -> video/<slug>/out/<output>-program.wav by default (the file render.mjs --master writes too)
//
// Same freshness check as render.mjs (audio-mode timeline, current sourceHash, every clip present).
import path from 'node:path';
import { parseArgs } from 'node:util';
import { checkTimelineFresh } from './lib/freshness.mjs';
import { COMPOSITION, PATHS, isMainModule } from './lib/paths.mjs';
import { bundleVideo, runRemotion } from './lib/remotion.mjs';
import { masterPaths } from './render.mjs';

if (isMainModule(import.meta.url)) {
  const { values } = parseArgs({ options: { video: { type: 'string' }, out: { type: 'string' } } });
  const fresh = checkTimelineFresh();
  if (!fresh.ok) {
    console.error('render-audio: refusing to render:');
    for (const p of fresh.problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  const out = path.resolve(values.out ?? masterPaths(PATHS.video).program);
  const t0 = Date.now();
  const bundle = bundleVideo();
  const res = runRemotion(['render', bundle.dir, COMPOSITION, out, '--codec=wav', '--enforce-audio-track']);
  if (res.status !== 0) {
    console.error(`render-audio: failed (exit ${res.status}) ${String(res.stderr ?? '').trim().slice(-400)}`);
    process.exit(1);
  }
  console.log(`render-audio: ${out} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
