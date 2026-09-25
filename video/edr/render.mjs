import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const cli = join(repoRoot, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const entry = join(repoRoot, 'video', 'edr', 'index.ts');
const video = join(repoRoot, 'public', 'videos', 'edr-blue-team.mp4');
const poster = join(repoRoot, 'public', 'videos', 'edr-blue-team-poster.png');

const configuredBrowser = process.env.REMOTION_BROWSER_EXECUTABLE;
const browser = configuredBrowser && existsSync(configuredBrowser) ? configuredBrowser : null;
const browserArg = browser ? [`--browser-executable=${browser}`] : [];

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args, ...browserArg], {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run([
  'render', entry, 'EDRBlueTeam', video,
  '--codec=h264', '--crf=22', '--audio-bitrate=128K', '--pixel-format=yuv420p',
  '--concurrency=4',
]);
run(['still', entry, 'EDRBlueTeam', poster, '--frame=230']);
