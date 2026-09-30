// Runs the Remotion CLI bundled in node_modules (render, still, ffprobe, ffmpeg)
// with argument arrays — never through a shell — from the repo root.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  BUNDLE_MANIFEST,
  TRANSIENT_RENAME_CODES,
  bundleKey,
  collectBundleInputs,
  isCompleteBundle,
  markInUse,
  pruneBundleCache,
  renameWithRetry,
} from './bundle-cache.mjs';
import { ENGINE_DIR, PATHS, REPO_ROOT, VIDEO } from './paths.mjs';

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
 * Bundles the active video (entry + its public dir) and returns `{ dir, remove }`. Rendering
 * from a finished bundle keeps webpack from blocking the event loop while the CLI waits for
 * Chrome: on a busy machine that race makes Remotion give up after 25 s with
 * "Timed out … while trying to connect to the browser".
 *
 * The bundle is cached in video/<slug>/out/bundle-cache/<key>/ (key: lib/bundle-cache.mjs) and
 * reused while its inputs are unchanged; only the latest one is kept, and `remove()` is a no-op.
 * `cache: false` (or BUNDLE_CACHE=0) bundles into a temp folder that `remove()` deletes.
 */
export function bundleVideo({ cache = process.env.BUNDLE_CACHE !== '0' } = {}) {
  const started = Date.now();
  const secs = () => `${((Date.now() - started) / 1000).toFixed(1)} s`;
  const build = (dir) => {
    const res = runRemotion(['bundle', PATHS.entry, `--out-dir=${dir}`, `--public-dir=${PATHS.publicDir}`]);
    if (res.status !== 0) {
      rmSync(dir, { recursive: true, force: true });
      throw new Error(`remotion bundle failed (exit ${res.status})`);
    }
  };
  if (!cache) {
    const dir = mkdtempSync(path.join(os.tmpdir(), `${VIDEO}-bundle-`));
    build(dir);
    console.log(`bundle: built (cache off) in ${secs()}`);
    return { dir, remove: () => rmSync(dir, { recursive: true, force: true }) };
  }

  const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join('/');
  const currentKey = () =>
    bundleKey({
      ...collectBundleInputs({ videoDir: PATHS.dir, engineDir: ENGINE_DIR, repoRoot: REPO_ROOT }),
      args: [`entry=${rel(PATHS.entry)}`, `public=${rel(PATHS.publicDir)}`],
    });
  const key = currentKey();
  const root = path.join(PATHS.outDir, 'bundle-cache');
  const dir = path.join(root, key);
  const noop = { dir, remove: () => {} };
  if (isCompleteBundle(dir, key)) {
    markInUse(dir);
    pruneBundleCache(root, key);
    console.log(`bundle: cached ${key.slice(0, 8)} (${secs()})`);
    return noop;
  }

  // Build next to the final folder, then rename: a crash never leaves a half bundle under <key>/.
  mkdirSync(root, { recursive: true });
  const tmp = path.join(root, `${key}.building-${process.pid}`);
  rmSync(tmp, { recursive: true, force: true });
  build(tmp);
  if (currentKey() !== key) {
    // A source changed while webpack ran: the bundle may hold either version, so use it once only.
    console.log(`bundle: built in ${secs()}, not cached (sources changed while bundling)`);
    return { dir: tmp, remove: () => rmSync(tmp, { recursive: true, force: true }) };
  }
  writeFileSync(path.join(tmp, BUNDLE_MANIFEST), `${JSON.stringify({ key, video: VIDEO, builtAt: new Date().toISOString(), buildMs: Date.now() - started })}\n`);
  try {
    renameWithRetry(tmp, dir);
  } catch (err) {
    if (isCompleteBundle(dir, key)) {
      rmSync(tmp, { recursive: true, force: true }); // another run finished the same bundle first: use theirs
    } else if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true }); // an unfinished leftover under the final name
      renameWithRetry(tmp, dir);
    } else if (TRANSIENT_RENAME_CODES.includes(err.code)) {
      // Something still holds the new files: the bundle is fine, it just cannot be cached this time.
      console.log(`bundle: built in ${secs()}, not cached (${err.code} renaming it)`);
      return { dir: tmp, remove: () => rmSync(tmp, { recursive: true, force: true }) };
    } else {
      throw err;
    }
  }
  markInUse(dir);
  pruneBundleCache(root, key);
  console.log(`bundle: built ${key.slice(0, 8)} in ${secs()}`);
  return noop;
}

/**
 * The ffmpeg binary Remotion ships (node_modules/@remotion/compositor-<platform>/ffmpeg). Calling
 * it directly skips starting the Remotion CLI in Node for every call, which on a busy CPU costs
 * minutes when a script runs ffmpeg dozens of times.
 */
export function ffmpegBinary() {
  const dir = path.join(REPO_ROOT, 'node_modules', '@remotion');
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  for (const name of existsSync(dir) ? readdirSync(dir) : []) {
    const candidate = path.join(dir, name, exe);
    if (name.startsWith('compositor-') && existsSync(candidate)) return candidate;
  }
  throw new Error(`Remotion's ffmpeg not found under ${dir} — run "npm install" in ${REPO_ROOT}`);
}

/** Synchronous call to ffmpegBinary() with captured output. `args` start after the program name. */
export function runFfmpeg(args) {
  const res = spawnSync(ffmpegBinary(), args, { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true });
  if (res.error) throw res.error;
  return { status: res.status, stdout: res.stdout ?? '', stderr: res.stderr ?? '' };
}

/** Asynchronous CLI call with captured output (used for parallel ffprobe). */
export function runRemotionAsync(args, { inherit = false } = {}) {
  assertCli();
  return spawnAsync(process.execPath, [PATHS.remotionCli, ...args], { inherit });
}

/**
 * A child process that does not block the event loop (unlike spawnSync), so two of them can run at once.
 * With `inherit`, its output goes straight to this console (progress bars) and is not captured.
 */
export function spawnAsync(command, args, { inherit = false, env = process.env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: REPO_ROOT,
      env,
      stdio: inherit ? ['ignore', 'inherit', 'inherit'] : ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.setEncoding('utf8').on('data', (d) => (stdout += d));
    child.stderr?.setEncoding('utf8').on('data', (d) => (stderr += d));
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
