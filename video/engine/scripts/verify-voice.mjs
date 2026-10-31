#!/usr/bin/env node
// Checks the narrator's recorded clips as the video will play them, before a render:
//
//   node video/engine/scripts/verify-voice.mjs --video <slug> [--warn-only] [--all]
//
// For every segment of the audio-mode timeline, verify_voice.py (faster-whisper in the Chatterbox venv)
// transcribes the part the video plays and measures the energy at its edges; lib/verify-voice.mjs turns
// that into errors (a clip that starts or stops inside a word, voice after the played part, a phrase heard
// twice = a take that slipped in) and warnings (far from the script: listen, often just the ASR). Writes
// out/verify-voice.md and out/verify-voice.json (with the timeline's sourceHash: render.mjs refuses a
// recording whose report is missing, stale or has errors). Unchanged clips are not transcribed again
// (out/verify-voice-cache.json, keyed on the clip's bytes and played length, plus the measures' version and the
// Whisper model): after `import-recording --only s06-03,s09-07` only those two go back to Whisper. Each clip is
// saved as soon as it is heard (out/verify-voice-progress.jsonl), so a run that is stopped or fails keeps them.
// --all (or --force) hears every clip again. audio.mjs runs it after build-timeline for "recording/<name>" voices.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { warnIfEngineBehind } from './lib/engine-freshness.mjs';
import { acquireHeavyLock } from './lib/heavy-lock.mjs';
import { ENGINE_DIR, PATHS, REPO_ROOT, SCRIPTS_DIR, VIDEO, isMainModule } from './lib/paths.mjs';
import { writeFileAtomic } from './lib/remotion.mjs';
import { VERIFY_MODEL, cacheLine, clipFindings, clipKey, mergeMeasures, parseProgress, staleJobs, voiceReport } from './lib/verify-voice.mjs';
import { VENV_PYTHON } from './tts-chatterbox.mjs';

export const REPORT_JSON = path.join(PATHS.outDir, 'verify-voice.json');
const REPORT_MD = path.join(PATHS.outDir, 'verify-voice.md');
const CACHE = path.join(PATHS.outDir, 'verify-voice-cache.json');
const PROGRESS = path.join(PATHS.outDir, 'verify-voice-progress.jsonl');

export function verifyVoice({ warnOnly = false, all = false, log = console } = {}) {
  const timeline = JSON.parse(readFileSync(PATHS.timeline, 'utf8'));
  if (timeline.mode !== 'audio') throw new Error('the timeline is in estimate mode: run audio.mjs first');
  warnIfEngineBehind(log, { cwd: REPO_ROOT });
  const jobs = timeline.segments.map((seg) => {
    const file = path.join(PATHS.publicDir, seg.audio);
    const playMs = Math.round(((seg.audioFrames + 2) / timeline.fps) * 1000);
    return { id: seg.id, path: file, playMs, key: clipKey(readFileSync(file), playMs), script: seg.text };
  });

  let cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  // Clips an earlier run finished before it was stopped or failed are in the progress file: keep them.
  if (existsSync(PROGRESS)) {
    const rows = parseProgress(readFileSync(PROGRESS, 'utf8'));
    if (rows.length) log.log(`verify-voice: ${rows.length} clip(s) measured by an earlier run that did not finish, kept`);
    cache = mergeMeasures(cache, rows);
    writeFileAtomic(CACHE, `${JSON.stringify(cache, null, 1)}\n`);
    rmSync(PROGRESS, { force: true });
  }
  const todo = staleJobs(jobs, cache, { all });
  log.log(cacheLine(todo, jobs.length, { all }));
  if (todo.length) {
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'verify-voice-'));
    // Whisper on the CPU is a heavy job: wait for any render to finish instead of slowing both (lib/heavy-lock.mjs).
    const releaseLock = acquireHeavyLock(`verify-voice ${VIDEO}`);
    try {
      mkdirSync(PATHS.outDir, { recursive: true });
      const jobFile = path.join(tmp, 'jobs.json');
      writeFileSync(jobFile, JSON.stringify(todo.map(({ id, path: p, playMs, key }) => ({ id, path: p, playMs, key }))));
      // verify_voice.py appends each clip to the progress file as soon as it is heard, so a run cut short keeps them.
      const res = spawnSync(VENV_PYTHON, ['-X', 'utf8', path.join(SCRIPTS_DIR, 'verify_voice.py'), '--jobs', jobFile, '--progress', PROGRESS, '--model', VERIFY_MODEL], {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        windowsHide: true,
        env: { ...process.env, HF_HOME: process.env.HF_HOME ?? path.join(ENGINE_DIR, '.cache', 'huggingface'), HF_HUB_DISABLE_SYMLINKS_WARNING: '1' },
      });
      if (existsSync(PROGRESS)) {
        cache = mergeMeasures(cache, parseProgress(readFileSync(PROGRESS, 'utf8')));
        writeFileAtomic(CACHE, `${JSON.stringify(cache, null, 1)}\n`);
        rmSync(PROGRESS, { force: true });
      }
      if (res.error) throw new Error(`cannot run verify_voice.py: ${res.error.message}`);
      if (res.status !== 0) throw new Error(`verify_voice.py failed (exit ${res.status}); the clips it finished are cached`);
    } finally {
      releaseLock();
      rmSync(tmp, { recursive: true, force: true });
    }
    const missed = staleJobs(jobs, cache);
    if (missed.length) throw new Error(`verify_voice.py left ${missed.length} clip(s) unmeasured: ${missed.map((j) => j.id).join(', ')}`);
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
    const { values } = parseArgs({ options: { video: { type: 'string' }, 'warn-only': { type: 'boolean', default: false }, all: { type: 'boolean', default: false }, force: { type: 'boolean', default: false } } });
    verifyVoice({ warnOnly: values['warn-only'], all: values.all || values.force });
  } catch (error) {
    console.error(`verify-voice: ${error.message}`);
    process.exit(1);
  }
}
