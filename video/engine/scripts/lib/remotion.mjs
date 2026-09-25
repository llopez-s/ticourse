// Runs the Remotion CLI bundled in node_modules (render, still, ffprobe, ffmpeg)
// with argument arrays — never through a shell — from the repo root.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PATHS, REPO_ROOT, VIDEO } from './paths.mjs';

function assertCli() {
  if (!existsSync(PATHS.remotionCli)) {
    throw new Error(`Remotion CLI not found at ${PATHS.remotionCli} — run "npm install" in ${REPO_ROOT}`);
  }
}

/** Synchronous CLI call. `capture` returns stdout/stderr instead of streaming them. */
export function runRemotion(args, { capture = false } = {}) {
  assertCli();
  const res = spawnSync(process.execPath, [PATHS.remotionCli, ...args], {
    cwd: REPO_ROOT,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    windowsHide: true,
  });
  if (res.error) throw res.error;
  return { status: res.status, stdout: res.stdout ?? '', stderr: res.stderr ?? '' };
}

/**
 * Bundles the active video (entry + its public dir) into a temporary folder and
 * returns its path; `remove()` deletes it. Rendering from a finished bundle
 * keeps webpack from blocking the event loop while the CLI waits for Chrome:
 * on a busy machine that race makes Remotion give up after 25 s with
 * "Timed out … while trying to connect to the browser".
 */
export function bundleVideo() {
  const dir = mkdtempSync(path.join(os.tmpdir(), `${VIDEO}-bundle-`));
  const res = runRemotion(['bundle', PATHS.entry, `--out-dir=${dir}`, `--public-dir=${PATHS.publicDir}`]);
  if (res.status !== 0) {
    rmSync(dir, { recursive: true, force: true });
    throw new Error(`remotion bundle failed (exit ${res.status})`);
  }
  return { dir, remove: () => rmSync(dir, { recursive: true, force: true }) };
}

/** Asynchronous CLI call with captured output (used for parallel ffprobe). */
export function runRemotionAsync(args) {
  assertCli();
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [PATHS.remotionCli, ...args], {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8').on('data', (d) => (stdout += d));
    child.stderr.setEncoding('utf8').on('data', (d) => (stderr += d));
    child.on('error', reject);
    child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
}

function parseProbe(res, file) {
  if (res.status !== 0) throw new Error(`ffprobe failed for ${file}: ${res.stderr.trim() || `exit ${res.status}`}`);
  try {
    return JSON.parse(res.stdout);
  } catch {
    throw new Error(`ffprobe returned unreadable output for ${file}: ${res.stdout.slice(0, 200)}`);
  }
}

/** Full ffprobe report (format + streams) of one media file. */
export function probeMedia(file) {
  const res = runRemotion(
    ['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels', '-of', 'json', file],
    { capture: true },
  );
  return parseProbe(res, file);
}

/**
 * Durations (ms) of many files, probed in parallel. Results are cached by
 * path + size + mtime in `cachePath`, because each CLI start costs ~3 s.
 */
export async function probeDurationsMs(files, { concurrency = 8, cachePath = null } = {}) {
  let cache = {};
  if (cachePath && existsSync(cachePath)) {
    try {
      cache = JSON.parse(readFileSync(cachePath, 'utf8'));
    } catch {
      cache = {};
    }
  }
  const out = new Map();
  const todo = [];
  for (const file of files) {
    const st = statSync(file);
    const stamp = `${st.size}:${Math.round(st.mtimeMs)}`;
    const hit = cache[file];
    if (hit && hit.stamp === stamp) out.set(file, hit.ms);
    else todo.push({ file, stamp });
  }
  let next = 0;
  const worker = async () => {
    while (next < todo.length) {
      const job = todo[next];
      next += 1;
      const res = await runRemotionAsync(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', job.file]);
      const json = parseProbe(res, job.file);
      const ms = Number(json?.format?.duration) * 1000;
      if (!Number.isFinite(ms) || ms <= 0) throw new Error(`ffprobe reported no duration for ${job.file}`);
      out.set(job.file, ms);
      cache[job.file] = { stamp: job.stamp, ms };
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, todo.length) }, worker));
  if (cachePath && todo.length) writeFileAtomic(cachePath, JSON.stringify(cache, null, 1));
  return out;
}

/** Writes a file through a temp file + rename so readers never see half a file. */
export function writeFileAtomic(file, content) {
  mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, content);
  renameSync(tmp, file);
}

/** Checks that each CLI flag is defined by the installed Remotion (options or CLI parser). */
export function assertCliFlags(flags) {
  const optionsDir = path.join(REPO_ROOT, 'node_modules', '@remotion', 'renderer', 'dist', 'options');
  const parser = path.join(REPO_ROOT, 'node_modules', '@remotion', 'cli', 'dist', 'parsed-cli.js');
  let haystack = '';
  try {
    for (const f of readdirSync(optionsDir)) if (f.endsWith('.js')) haystack += readFileSync(path.join(optionsDir, f), 'utf8');
    if (existsSync(parser)) haystack += readFileSync(parser, 'utf8');
  } catch (err) {
    throw new Error(`Cannot read Remotion option definitions: ${err.message}`);
  }
  const missing = flags.filter((flag) => !haystack.includes(`'${flag}'`) && !haystack.includes(`"${flag}"`));
  if (missing.length) throw new Error(`The installed Remotion CLI does not define: ${missing.map((f) => `--${f}`).join(', ')}`);
}

/** Runs `fn` over `items` with at most `concurrency` calls in flight. */
export async function runPool(items, concurrency, fn) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const item = items[next];
      next += 1;
      await fn(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}
