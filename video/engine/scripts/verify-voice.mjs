#!/usr/bin/env node
// Checks the narrator's recorded clips as the video will play them, before a render:
//
//   node video/engine/scripts/verify-voice.mjs --video <slug> [--warn-only] [--force]
//
// For every segment of the audio-mode timeline, verify_voice.py (faster-whisper in the Chatterbox venv)
// transcribes the part the video plays and measures the energy at its edges; lib/verify-voice.mjs turns
// that into errors (a clip that starts or stops inside a word, voice after the played part, a phrase heard
// twice = a take that slipped in) and warnings (far from the script: listen, often just the ASR). Writes
// out/verify-voice.md and out/verify-voice.json (with the timeline's sourceHash: render.mjs refuses a
// recording whose report is missing, stale or has errors). Unchanged clips are not transcribed again
// (out/verify-voice-cache.json, keyed on the clip's bytes and played length). audio.mjs runs it after
// build-timeline for "recording/<name>" voices.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { acquireHeavyLock } from './lib/heavy-lock.mjs';
import { ENGINE_DIR, PATHS, REPO_ROOT, SCRIPTS_DIR, VIDEO, isMainModule } from './lib/paths.mjs';
import { writeFileAtomic } from './lib/remotion.mjs';
import { clipFindings, voiceReport } from './lib/verify-voice.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

export const REPORT_JSON = path.join(PATHS.outDir, 'verify-voice.json');
const REPORT_MD = path.join(PATHS.outDir, 'verify-voice.md');
const CACHE = path.join(PATHS.outDir, 'verify-voice-cache.json');

export function verifyVoice({ warnOnly = false, force = false, log = console } = {}) {
  const timeline = JSON.parse(readFileSync(PATHS.timeline, 'utf8'));
  if (timeline.mode !== 'audio') throw new Error('the timeline is in estimate mode: run audio.mjs first');
  const jobs = timeline.segments.map((seg) => {
    const file = path.join(PATHS.publicDir, seg.audio);
    const playMs = Math.round(((seg.audioFrames + 2) / timeline.fps) * 1000);
    const key = createHash('sha256').update(readFileSync(file)).update(`:${playMs}`).digest('hex');
    return { id: seg.id, path: file, playMs, key, script: seg.text };
  });

  const cache = !force && existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  const todo = jobs.filter((j) => cache[j.id]?.key !== j.key || cache[j.id]?.v !== 2); // v2: words, unheard, gaps
  if (todo.length) {
    log.log(`verify-voice: transcribing ${todo.length}/${jobs.length} clips (the others are cached)`);
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'verify-voice-'));
    // Whisper on the CPU is a heavy job: wait for any render to finish instead of slowing both (lib/heavy-lock.mjs).
    const releaseLock = acquireHeavyLock(`verify-voice ${VIDEO}`);
    try {
      const jobFile = path.join(tmp, 'jobs.json');
      const outFile = path.join(tmp, 'results.json');
      writeFileSync(jobFile, JSON.stringify(todo.map(({ id, path: p, playMs }) => ({ id, path: p, playMs }))));
      const res = spawnSync(VENV_PYTHON, ['-X', 'utf8', path.join(SCRIPTS_DIR, 'verify_voice.py'), '--jobs', jobFile, '--out', outFile], {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        windowsHide: true,
        env: { ...process.env, HF_HOME: process.env.HF_HOME ?? path.join(ENGINE_DIR, '.cache', 'huggingface'), HF_HUB_DISABLE_SYMLINKS_WARNING: '1' },
      });
      if (res.error) throw new Error(`cannot run verify_voice.py: ${res.error.message}`);
      if (res.status !== 0) throw new Error(`verify_voice.py failed (exit ${res.status})`);
      const byId = new Map(todo.map((j) => [j.id, j]));
      for (const r of JSON.parse(readFileSync(outFile, 'utf8'))) cache[r.id] = { key: byId.get(r.id).key, ...r };
    } finally {
      releaseLock();
      rmSync(tmp, { recursive: true, force: true });
    }
    writeFileAtomic(CACHE, `${JSON.stringify(cache, null, 1)}\n`);
  } else {
    log.log(`verify-voice: all ${jobs.length} clips cached`);
  }

  const rows = [];
  const errors = [];
  const warnings = [];
  for (const j of jobs) {
    const m = cache[j.id];
    const f = clipFindings({ id: j.id, script: j.script, heard: m.heard, head: m.head, tail: m.tail, dropped: m.dropped, words: m.words, unheard: m.unheard, gaps: m.gaps });
    errors.push(...f.errors);
    warnings.push(...f.warnings);
    rows.push({ id: j.id, similarity: f.similarity, head: m.head, tail: m.tail, dropped: m.dropped, heard: m.heard });
  }
  writeFileAtomic(REPORT_MD, voiceReport({ slug: VIDEO, rows, errors, warnings }));
  writeFileAtomic(REPORT_JSON, `${JSON.stringify({ sourceHash: timeline.sourceHash, errors, warnings }, null, 1)}\n`);
  for (const w of warnings) log.warn(`  aviso: ${w}`);
  for (const e of errors) log.error(`  error: ${e}`);
  log.log(`verify-voice: ${errors.length} error(s), ${warnings.length} warning(s) -> ${REPORT_MD}`);
  if (errors.length && !warnOnly) {
    const err = new Error(`${errors.length} clip(s) cut or with a leftover take: listen to them (see ${REPORT_MD}), fix the import, and run it again`);
    err.validation = true;
    throw err;
  }
  return { errors, warnings };
}

if (isMainModule(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: { video: { type: 'string' }, 'warn-only': { type: 'boolean', default: false }, force: { type: 'boolean', default: false } } });
    verifyVoice({ warnOnly: values['warn-only'], force: values.force });
  } catch (error) {
    console.error(`verify-voice: ${error.message}`);
    process.exit(1);
  }
}
