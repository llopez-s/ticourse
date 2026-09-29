// Content-addressed cache for `remotion bundle` (used by bundleVideo in remotion.mjs).
//
// A bundle only depends on the video's src/, the engine's src/, the tsconfig files, the
// installed Remotion/React versions and the files of the video's public dir (copied in).
// The key hashes the CONTENTS of the sources, but only the public dir's LISTING (path, size,
// mtime): the voice MP3s can be large and a changed clip always changes its size or mtime.
// No side effects at import: qa-frames.test.mjs imports this through remotion.mjs.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/** Bump when what goes into the key (or how the bundle is built) changes: old entries stop matching. */
export const BUNDLE_CACHE_FORMAT = 1;

/** Top-level lockfile/package.json entries whose versions end up in the bundle. */
const BUNDLED_PACKAGE = /^(remotion|@remotion\/[^/]+|react|react-dom)$/;

const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const byRel = (a, b) => byName(a.rel, b.rel);

/**
 * The cache key (64 hex chars). Pure: the same inputs give the same key, whatever their order.
 * @param {{
 *   sources: {rel: string, sha256: string}[],            // files whose contents go into the bundle
 *   publicFiles: {rel: string, size: number, mtimeMs: number}[], // the public dir's listing
 *   versions: Record<string, string>,                    // package -> version (lockfile / package.json)
 *   args?: string[],                                     // anything else that shapes the bundle (entry, public dir)
 * }} inputs
 */
export function bundleKey({ sources, publicFiles, versions, args = [] }) {
  const h = createHash('sha256');
  const line = (...parts) => h.update(`${parts.join('\t')}\n`);
  line('format', BUNDLE_CACHE_FORMAT);
  for (const arg of args) line('arg', arg);
  for (const name of Object.keys(versions).sort(byName)) line('pkg', name, versions[name]);
  for (const s of [...sources].sort(byRel)) line('src', s.rel, s.sha256);
  for (const f of [...publicFiles].sort(byRel)) line('pub', f.rel, f.size, Math.round(f.mtimeMs));
  return h.digest('hex');
}

/** Every file under `dir` (recursive), as { rel: '<prefix>/a/b.ts', abs }, '/'-separated. */
function walk(dir, prefix) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) out.push(...walk(abs, rel));
    else if (entry.isFile()) out.push({ rel, abs });
  }
  return out;
}

const sha256File = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

/** Versions of the bundled packages: the lockfile's installed version, else package.json's range. */
export function bundledVersions(repoRoot) {
  const versions = {};
  const pkgFile = path.join(repoRoot, 'package.json');
  if (existsSync(pkgFile)) {
    const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
    for (const deps of [pkg.dependencies, pkg.devDependencies]) {
      for (const [name, range] of Object.entries(deps ?? {})) if (BUNDLED_PACKAGE.test(name)) versions[`package.json:${name}`] = range;
    }
  }
  const lockFile = path.join(repoRoot, 'package-lock.json');
  if (existsSync(lockFile)) {
    const lock = JSON.parse(readFileSync(lockFile, 'utf8'));
    for (const [key, entry] of Object.entries(lock.packages ?? {})) {
      const name = key.startsWith('node_modules/') ? key.slice('node_modules/'.length) : null;
      if (name && BUNDLED_PACKAGE.test(name) && entry?.version) versions[`lock:${name}`] = entry.version;
    }
  }
  return versions;
}

/**
 * Reads everything bundleKey needs from disk. The video's out/ (where the cache lives),
 * tts/ and the JSON sources next to src/ are deliberately NOT inputs: they are not bundled.
 */
export function collectBundleInputs({ videoDir, engineDir, repoRoot }) {
  const sources = [...walk(path.join(videoDir, 'src'), 'video/src'), ...walk(path.join(engineDir, 'src'), 'engine/src')];
  const configs = [
    ['video/tsconfig.json', path.join(videoDir, 'tsconfig.json')],
    ['engine/tsconfig.json', path.join(engineDir, 'tsconfig.json')],
    ['root/tsconfig.json', path.join(repoRoot, 'tsconfig.json')],
    // The Remotion CLI runs from the repo root and would pick up a config file there.
    ...['remotion.config.ts', 'remotion.config.js', 'remotion.config.mjs'].map((f) => [`root/${f}`, path.join(repoRoot, f)]),
  ];
  for (const [rel, abs] of configs) if (existsSync(abs)) sources.push({ rel, abs });
  const publicFiles = walk(path.join(videoDir, 'public'), 'public').map(({ rel, abs }) => {
    const st = statSync(abs);
    return { rel, size: st.size, mtimeMs: st.mtimeMs };
  });
  return {
    sources: sources.map(({ rel, abs }) => ({ rel, sha256: sha256File(abs) })),
    publicFiles,
    versions: bundledVersions(repoRoot),
  };
}

/** True while process `pid` exists (EPERM: exists, owned by someone else). */
export function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === 'EPERM';
  }
}

/** Written last into a finished bundle; a folder without it is not used. */
export const BUNDLE_MANIFEST = 'cache.json';
const IN_USE = /^\.inuse-(\d+)$/;
const BUILDING = /\.building-(\d+)$/;

/** True when `dir` holds a finished bundle for `key`. */
export function isCompleteBundle(dir, key) {
  const file = path.join(dir, BUNDLE_MANIFEST);
  if (!existsSync(file) || !existsSync(path.join(dir, 'index.html'))) return false;
  try {
    return JSON.parse(readFileSync(file, 'utf8')).key === key;
  } catch {
    return false;
  }
}

/**
 * Marks `dir` as used by this process (a `.inuse-<pid>` file that goes stale when the process exits),
 * so a concurrent run that builds a newer bundle does not delete this one mid-render.
 */
export function markInUse(dir, pid = process.pid) {
  for (const f of readdirSync(dir)) {
    const m = IN_USE.exec(f);
    if (m && Number(m[1]) !== pid && !pidAlive(Number(m[1]))) rmSync(path.join(dir, f), { force: true });
  }
  writeFileSync(path.join(dir, `.inuse-${pid}`), '');
}

/**
 * Keeps only `keepKey` in the cache root: deletes older bundles and abandoned partial builds,
 * except those a live process is using or still building. Returns the names it removed.
 */
export function pruneBundleCache(root, keepKey, { alive = pidAlive, log = console } = {}) {
  const removed = [];
  if (!existsSync(root)) return removed;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === keepKey) continue;
    const abs = path.join(root, entry.name);
    const building = BUILDING.exec(entry.name);
    if (building && alive(Number(building[1]))) continue;
    if (entry.isDirectory() && !building) {
      const users = readdirSync(abs)
        .map((f) => IN_USE.exec(f))
        .filter(Boolean)
        .map((m) => Number(m[1]));
      if (users.some((pid) => pid !== process.pid && alive(pid))) continue;
    }
    try {
      rmSync(abs, { recursive: true, force: true });
      removed.push(entry.name);
    } catch (err) {
      log.warn?.(`bundle: could not remove old ${entry.name} (${err.code ?? err.message}); next run retries`);
    }
  }
  return removed;
}
