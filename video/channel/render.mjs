// Renders the YouTube channel art (avatar + banner) to video/channel/out/.
//   node video/channel/render.mjs
// Bundles first, then renders both stills from the bundle (see the engine's
// remotion.mjs for why), and checks YouTube's upload limits.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(DIR, '..', '..');
const CLI = path.join(REPO_ROOT, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const OUT = path.join(DIR, 'out');

/** YouTube Studio limits for each upload. */
const STILLS = [
  { id: 'ChannelAvatar', file: 'alertopolis-avatar-800.png', maxBytes: 4 * 1024 * 1024 },
  { id: 'ChannelBanner', file: 'alertopolis-banner-2560x1440.png', maxBytes: 6 * 1024 * 1024 },
];

function remotion(args) {
  const res = spawnSync(process.execPath, [CLI, ...args], { cwd: REPO_ROOT, stdio: 'inherit', windowsHide: true });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`remotion ${args[0]} failed (exit ${res.status})`);
}

if (!existsSync(CLI)) throw new Error(`Remotion CLI not found at ${CLI} — run "npm install" in ${REPO_ROOT}`);
mkdirSync(OUT, { recursive: true });
const bundle = mkdtempSync(path.join(os.tmpdir(), 'channel-bundle-'));
try {
  remotion(['bundle', path.join(DIR, 'src', 'index.ts'), `--out-dir=${bundle}`]);
  for (const still of STILLS) {
    const file = path.join(OUT, still.file);
    remotion(['still', bundle, still.id, file, '--image-format=png']);
    const bytes = statSync(file).size;
    if (bytes > still.maxBytes) throw new Error(`${still.file} is ${bytes} bytes; YouTube accepts up to ${still.maxBytes}`);
    console.log(`${still.file}: ${(bytes / 1024).toFixed(0)} KB (limit ${still.maxBytes / 1024 / 1024} MB)`);
  }
} finally {
  rmSync(bundle, { recursive: true, force: true });
}
