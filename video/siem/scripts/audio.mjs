#!/usr/bin/env node
// Full voice pipeline: prepare-tts.mjs -> tts.py -> build-timeline.mjs (audio mode).
// Stops at the first failing step.
//
//   node video/siem/scripts/audio.mjs                 # synthesise what changed, rebuild the timeline
//   node video/siem/scripts/audio.mjs --audition      # only the voice audition (.audition/*.mp3)
//   node video/siem/scripts/audio.mjs --only s08-02 --force
//
// Test overrides (forwarded to the step that uses them): --narration --lexicon --storyboard
// --tts-dir --voice-dir --out --transcript. Voice overrides --voice --rate --pitch reach both
// tts.py and build-timeline so the cache keys agree.
//
// Python comes from $PYTHON (default "python"); it needs edge-tts and network access.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { PATHS, REPO_ROOT, SCRIPTS_DIR, isMainModule } from './lib/paths.mjs';

const OPTIONS = {
  audition: { type: 'boolean', default: false },
  narration: { type: 'string' },
  lexicon: { type: 'string' },
  storyboard: { type: 'string' },
  'tts-dir': { type: 'string' },
  'voice-dir': { type: 'string' },
  voice: { type: 'string' },
  rate: { type: 'string' },
  pitch: { type: 'string' },
  only: { type: 'string' },
  force: { type: 'boolean', default: false },
  attempts: { type: 'string' },
  'full-audio': { type: 'boolean', default: false },
  'tail-ms': { type: 'string' },
  out: { type: 'string' },
  transcript: { type: 'string' },
};

/** ["--name", value] pairs for the given option names that were set. */
function pass(values, names) {
  const out = [];
  for (const name of names) {
    const v = values[name];
    if (v === undefined || v === false) continue;
    if (v === true) out.push(`--${name}`);
    else out.push(`--${name}`, /dir|narration|lexicon|storyboard|out|transcript/.test(name) ? path.resolve(v) : v);
  }
  return out;
}

function step(label, cmd, args, env = {}) {
  console.log(`\n== ${label}`);
  const res = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: 'inherit', env: { ...process.env, ...env }, windowsHide: true });
  if (res.error) {
    console.error(`audio.mjs: cannot run ${cmd}: ${res.error.message}`);
    process.exit(2);
  }
  if (res.status !== 0) {
    console.error(`audio.mjs: "${label}" failed (exit ${res.status})`);
    process.exit(res.status || 1);
  }
}

function main() {
  const { values } = parseArgs({ options: OPTIONS, allowPositionals: false });
  const python = process.env.PYTHON ?? 'python';
  const env = { NODE: process.execPath };

  if (values.audition) {
    step('voice audition', python, ['-X', 'utf8', PATHS.ttsPy, '--audition', ...pass(values, ['lexicon', 'voice', 'rate', 'pitch', 'attempts'])], env);
    console.log(`\nListen to ${PATHS.auditionDir} and pick the voice in narration.json.`);
    return;
  }

  const node = process.execPath;
  step('prepare-tts', node, [path.join(SCRIPTS_DIR, 'prepare-tts.mjs'), ...pass(values, ['narration', 'lexicon', 'storyboard']), '--out', PATHS.ttsInput]);
  step(
    'tts.py',
    python,
    ['-X', 'utf8', PATHS.ttsPy, '--input', PATHS.ttsInput, ...pass(values, ['tts-dir', 'voice-dir', 'voice', 'rate', 'pitch', 'only', 'force', 'attempts'])],
    env,
  );
  step(
    'build-timeline',
    node,
    [
      path.join(SCRIPTS_DIR, 'build-timeline.mjs'),
      ...pass(values, ['narration', 'lexicon', 'storyboard', 'tts-dir', 'voice-dir', 'voice', 'rate', 'pitch', 'full-audio', 'tail-ms', 'out', 'transcript']),
    ],
  );
}

if (isMainModule(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`audio.mjs: ${err.message}`);
    process.exit(2);
  }
}
