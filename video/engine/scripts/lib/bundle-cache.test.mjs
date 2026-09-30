import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { BUNDLE_MANIFEST, bundleKey, collectBundleInputs, isCompleteBundle, markInUse, pruneBundleCache } from './bundle-cache.mjs';

const BASE = {
  sources: [
    { rel: 'video/src/index.ts', sha256: 'a'.repeat(64) },
    { rel: 'engine/src/ui/Chip.tsx', sha256: 'b'.repeat(64) },
  ],
  publicFiles: [{ rel: 'public/voice/s01-01.mp3', size: 1000, mtimeMs: 1727600000000 }],
  versions: { 'lock:remotion': '4.0.527' },
  args: ['entry=video/x/src/index.ts'],
};

test('bundleKey: same inputs, same key, whatever their order', () => {
  const k = bundleKey(BASE);
  assert.match(k, /^[0-9a-f]{64}$/);
  assert.equal(bundleKey(structuredClone(BASE)), k);
  assert.equal(bundleKey({ ...BASE, sources: [...BASE.sources].reverse() }), k);
});

test('bundleKey: sources, the public listing, versions and args all change it', () => {
  const k = bundleKey(BASE);
  const changed = [
    { ...BASE, sources: [{ ...BASE.sources[0], sha256: 'c'.repeat(64) }, BASE.sources[1]] },
    { ...BASE, sources: [BASE.sources[0], { ...BASE.sources[1], rel: 'engine/src/ui/Chip2.tsx' }] },
    { ...BASE, publicFiles: [{ ...BASE.publicFiles[0], size: 1001 }] },
    { ...BASE, publicFiles: [{ ...BASE.publicFiles[0], mtimeMs: 1727600009000 }] },
    { ...BASE, publicFiles: [] },
    { ...BASE, versions: { 'lock:remotion': '4.0.528' } },
    { ...BASE, args: ['entry=video/y/src/index.ts'] },
  ];
  for (const inputs of changed) assert.notEqual(bundleKey(inputs), k);
});

/** A throwaway repo: <root>/video/<slug>/{src,public,out}, <root>/video/engine/src, tsconfigs, package files. */
function fakeRepo() {
  const root = mkdtempSync(path.join(os.tmpdir(), 'bundle-cache-test-'));
  const videoDir = path.join(root, 'video', 'demo');
  const engineDir = path.join(root, 'video', 'engine');
  const put = (rel, text) => {
    const file = path.join(root, rel);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, text);
    return file;
  };
  put('package.json', JSON.stringify({ dependencies: { remotion: '4.0.527', react: '^19.1.0', 'left-pad': '1.0.0' } }));
  put('package-lock.json', JSON.stringify({ packages: { 'node_modules/remotion': { version: '4.0.527' }, 'node_modules/left-pad': { version: '1.0.0' } } }));
  put('tsconfig.json', '{}');
  put('video/demo/tsconfig.json', '{}');
  put('video/demo/src/index.ts', 'export {};');
  put('video/demo/src/timeline.json', '{"scenes":[]}');
  put('video/demo/public/voice/s01-01.mp3', 'mp3');
  put('video/demo/out/draft.mp4', 'old render');
  put('video/demo/narration.json', '{}');
  put('video/engine/src/ui/Chip.tsx', 'export const Chip = 1;');
  const keyNow = () => bundleKey(collectBundleInputs({ videoDir, engineDir, repoRoot: root }));
  return { root, put, keyNow, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

test('collectBundleInputs: src, engine src and the public listing count; out/ and the JSON sources do not', (t) => {
  const repo = fakeRepo();
  t.after(repo.cleanup);
  const k0 = repo.keyNow();
  assert.equal(repo.keyNow(), k0, 'stable when nothing changed');

  repo.put('video/demo/out/draft.mp4', 'a newer render');
  repo.put('video/demo/out/bundle-cache/abc/index.html', '<html>');
  repo.put('video/demo/narration.json', '{"voice":"x"}');
  assert.equal(repo.keyNow(), k0, 'out/ and narration.json are not bundled');

  repo.put('video/demo/src/timeline.json', '{"scenes":[1]}');
  const k1 = repo.keyNow();
  assert.notEqual(k1, k0, 'video src change');

  repo.put('video/engine/src/ui/Chip.tsx', 'export const Chip = 2;');
  const k2 = repo.keyNow();
  assert.notEqual(k2, k1, 'engine src change');

  const mp3 = repo.put('video/demo/public/voice/s01-01.mp3', 'mp3');
  utimesSync(mp3, new Date('2026-01-01'), new Date('2026-01-01'));
  const k3 = repo.keyNow();
  assert.notEqual(k3, k2, 'same size, new mtime');
  repo.put('video/demo/public/voice/s01-02.mp3', 'mp3');
  const k4 = repo.keyNow();
  assert.notEqual(k4, k3, 'a new public file');

  repo.put('package-lock.json', JSON.stringify({ packages: { 'node_modules/remotion': { version: '4.0.528' }, 'node_modules/left-pad': { version: '1.0.0' } } }));
  const k5 = repo.keyNow();
  assert.notEqual(k5, k4, 'remotion version');
  repo.put('package-lock.json', JSON.stringify({ packages: { 'node_modules/remotion': { version: '4.0.528' }, 'node_modules/left-pad': { version: '2.0.0' } } }));
  assert.equal(repo.keyNow(), k5, 'unbundled packages do not count');

  repo.put('video/demo/tsconfig.json', '{"compilerOptions":{}}');
  assert.notEqual(repo.keyNow(), k5, 'tsconfig change');
});

test('pruneBundleCache keeps the latest, bundles in use by a live process and live builds', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'bundle-prune-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const mk = (name, files = {}) => {
    mkdirSync(path.join(root, name), { recursive: true });
    for (const [f, text] of Object.entries(files)) writeFileSync(path.join(root, name, f), text);
  };
  const LIVE = 424242;
  const DEAD = 535353;
  const alive = (pid) => pid === LIVE;
  mk('new');
  mk('old');
  mk('old-in-use', { [`.inuse-${LIVE}`]: '' });
  mk('old-stale-use', { [`.inuse-${DEAD}`]: '' });
  mk(`x.building-${LIVE}`);
  mk(`y.building-${DEAD}`);
  const removed = pruneBundleCache(root, 'new', { alive, log: { warn() {} } }).sort();
  assert.deepEqual(removed, ['old', 'old-stale-use', `y.building-${DEAD}`]);
  assert.deepEqual(readdirSync(root).sort(), ['new', 'old-in-use', `x.building-${LIVE}`]);
});

test('isCompleteBundle wants index.html and a manifest with the same key; markInUse drops stale markers', (t) => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'bundle-complete-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(path.join(dir, 'index.html'), '<html>');
  assert.equal(isCompleteBundle(dir, 'k1'), false);
  writeFileSync(path.join(dir, BUNDLE_MANIFEST), JSON.stringify({ key: 'k1' }));
  assert.equal(isCompleteBundle(dir, 'k1'), true);
  assert.equal(isCompleteBundle(dir, 'k2'), false);

  writeFileSync(path.join(dir, '.inuse-999999999'), ''); // no such process
  markInUse(dir, 4321);
  const markers = readdirSync(dir).filter((f) => f.startsWith('.inuse-'));
  assert.deepEqual(markers, ['.inuse-4321']);
});
