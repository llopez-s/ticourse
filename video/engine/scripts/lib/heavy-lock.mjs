// One heavy job at a time on this machine: Remotion renders (render.mjs, qa-frames.mjs) and Whisper
// (import-recording's transcription, verify-voice). In V5 three scene agents rendered stills while
// Whisper transcribed the narrator: everything ran 2–3× slower and a timeline build hung for 20 min.
// With the lock they queue instead. It lives in the OS temp folder, so the main checkout and every
// worktree share it. RENDER_LOCK=0 skips it (e.g. a job that is known to be alone).
import { closeSync, openSync, readFileSync, rmSync, statSync, writeSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pidAlive } from './bundle-cache.mjs';

export const HEAVY_LOCK_FILE = path.join(os.tmpdir(), 'alertopolis-heavy-job.lock');

/** A lock file this young that cannot be parsed is still being written by its owner: wait, do not steal it. */
const WRITING_GRACE_MS = 5000;

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function readOwner(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    try {
      return Date.now() - statSync(file).mtimeMs < WRITING_GRACE_MS ? { pid: null, what: 'otra tarea', since: 'ahora' } : null;
    } catch {
      return null;
    }
  }
}

/**
 * Waits until no other live process holds the lock, takes it, and returns `release()`. A lock whose
 * owner is gone (or that is unreadable and old) is taken over. Says once what it is waiting for.
 */
export function acquireHeavyLock(what, { file = HEAVY_LOCK_FILE, pid = process.pid, alive = pidAlive, sleep = sleepSync, pollMs = 2000, log = console, env = process.env } = {}) {
  if (env.RENDER_LOCK === '0') return () => {};
  let told = false;
  for (;;) {
    let fd;
    try {
      fd = openSync(file, 'wx');
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      const owner = readOwner(file);
      const live = owner && (owner.pid === null || (owner.pid !== pid && alive(Number(owner.pid))));
      if (!live) {
        rmSync(file, { force: true });
        continue;
      }
      if (!told) {
        log.log(`heavy-lock: waiting for «${owner.what}» (pid ${owner.pid ?? '?'}, since ${owner.since}) — RENDER_LOCK=0 skips the queue`);
        told = true;
      }
      sleep(pollMs);
      continue;
    }
    writeSync(fd, JSON.stringify({ pid, what, since: new Date().toISOString() }));
    closeSync(fd);
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      if (readOwner(file)?.pid === pid) rmSync(file, { force: true });
    };
    process.once('exit', release);
    return release;
  }
}
