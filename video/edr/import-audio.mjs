import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, readFile, readdir, stat } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { currentDir, loadScript, repoRoot, writeDerivedAssets } from './audio-assets.mjs';

function optionsFromArgs(args) {
  let inputDir = join(currentDir, 'elevenlabs-clips');
  let pauseSeconds = 0.4;
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg.startsWith('--input=')) inputDir = resolve(arg.slice('--input='.length));
    else if (arg === '--input' && args[index + 1]) inputDir = resolve(args[++index]);
    else if (arg.startsWith('--pause=')) pauseSeconds = Number(arg.slice('--pause='.length));
    else throw new Error('Usage: npm run video:audio:import -- [--input=PATH] [--pause=SECONDS]');
  }
  if (!Number.isFinite(pauseSeconds) || pauseSeconds < 0 || pauseSeconds > 2) {
    throw new Error('--pause must be between 0 and 2 seconds');
  }
  return { inputDir, pauseSeconds };
}

function ffmpegExecutable() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  const packages = join(repoRoot, 'node_modules', '@remotion');
  const executable = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  if (existsSync(packages)) {
    for (const name of readdirSync(packages)) {
      if (!name.startsWith('compositor-')) continue;
      const candidate = join(packages, name, executable);
      if (existsSync(candidate)) return candidate;
    }
  }
  return executable;
}

const { inputDir, pauseSeconds } = optionsFromArgs(process.argv.slice(2));
const scriptSegments = await loadScript();
const ids = new Set(scriptSegments.map(({ id }) => id));
const files = await readdir(inputDir);
const clips = new Map();
const alignments = new Map();

for (const name of files) {
  const extension = /\.(mp3|wav)$/i.exec(name);
  if (extension) {
    const id = name.slice(0, -extension[0].length);
    if (!ids.has(id)) throw new Error(`Unexpected audio clip: ${name}`);
    if (clips.has(id)) throw new Error(`Multiple audio clips for ${id}`);
    clips.set(id, join(inputDir, name));
    continue;
  }
  if (name.endsWith('.alignment.json')) {
    const id = name.slice(0, -'.alignment.json'.length);
    if (!ids.has(id)) throw new Error(`Unexpected alignment file: ${name}`);
    alignments.set(id, JSON.parse(await readFile(join(inputDir, name), 'utf8')));
  }
}

const missing = scriptSegments.filter(({ id }) => !clips.has(id)).map(({ id }) => id);
if (missing.length) throw new Error(`Missing audio clips: ${missing.join(', ')}`);
if (alignments.size > 0 && alignments.size !== scriptSegments.length) {
  console.warn(`Character alignment supplied for ${alignments.size}/${scriptSegments.length} clips; remaining captions use proportional timing.`);
}

const hash = createHash('sha256');
for (const { id } of scriptSegments) {
  const clip = clips.get(id);
  if ((await stat(clip)).size < 1024) throw new Error(`Audio clip is too small: ${basename(clip)}`);
  hash.update(id);
  hash.update(await readFile(clip));
}
const version = hash.digest('hex').slice(0, 12);
const audioDir = join(repoRoot, 'public', 'videos', 'edr', 'voice', 'natural', version);
await mkdir(audioDir, { recursive: true });
const ffmpeg = ffmpegExecutable();

for (const { id } of scriptSegments) {
  const input = clips.get(id);
  const output = join(audioDir, `${id}.wav`);
  const result = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
    '-i', input, '-map', '0:a:0', '-vn',
    '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', output,
  ], { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1024 * 1024 });
  if (result.error || result.status !== 0) {
    throw new Error(`Could not normalize ${basename(input)} with ffmpeg:\n${result.error?.message ?? result.stderr}`);
  }
}

await writeDerivedAssets({
  audioDir,
  publicAudioPrefix: `videos/edr/voice/natural/${version}`,
  alignments,
  sourceLabel: `Imported narration (${version})`,
  pauseSeconds,
});
console.log(`Source: ${inputDir}`);
console.log(`Normalized WAVs: ${audioDir}`);
