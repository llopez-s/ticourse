import { realpath, rm } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const distRoot = resolve(repoRoot, 'dist');
const target = resolve(distRoot, 'videos/edr/voice');
function inside(base, candidate) {
  const path = relative(base, candidate);
  return path && !path.startsWith('..') && !isAbsolute(path);
}

const actualRepo = await realpath(repoRoot);
const actualDist = await realpath(distRoot);
if (!inside(actualRepo, actualDist)) throw new Error('Refusing to use dist outside the repository');
let actualTarget;
try {
  actualTarget = await realpath(target);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (actualTarget && !inside(actualDist, actualTarget)) {
  throw new Error('Refusing to remove voice assets outside dist');
}

// The lesson serves a narrated MP4; these WAVs are only inputs to Remotion.
if (actualTarget) await rm(target, { recursive: true, force: true });
console.log('Removed EDR render-only WAVs from dist.');
