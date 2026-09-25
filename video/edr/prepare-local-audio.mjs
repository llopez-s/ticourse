import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { currentDir, loadScript, repoRoot, scriptPath } from './audio-assets.mjs';

const sourceDir = join(currentDir, 'source');
const manifest = JSON.parse(await readFile(join(sourceDir, 'manifest.json'), 'utf8'));
let clipsDir = join(currentDir, 'elevenlabs-clips');
let prepareOnly = false;
for (const arg of process.argv.slice(2)) {
  if (arg === '--prepare-only') prepareOnly = true;
  else if (arg.startsWith('--clips-dir=')) clipsDir = resolve(arg.slice('--clips-dir='.length));
  else throw new Error('Usage: npm run video:audio:prepare -- [--prepare-only] [--clips-dir=PATH]');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function verifiedSource({ file, sha256: expected }) {
  if (!/^[a-z0-9.-]+$/i.test(file) || file.includes('..') || !/^[a-f0-9]{64}$/.test(expected)) {
    throw new Error('Invalid offline narration manifest');
  }
  const value = await readFile(join(sourceDir, file));
  // Git may change JSON line endings on Windows, so hash its parsed content.
  const comparable = file.endsWith('.json') ? JSON.stringify(JSON.parse(value.toString('utf8'))) : value;
  if (sha256(comparable) !== expected) throw new Error(`Offline source hash differs: ${file}`);
  return value;
}

function mediaTools() {
  const packages = join(repoRoot, 'node_modules', '@remotion');
  const suffix = process.platform === 'win32' ? '.exe' : '';
  if (existsSync(packages)) {
    for (const name of readdirSync(packages)) {
      if (!name.startsWith('compositor-')) continue;
      const ffmpeg = join(packages, name, `ffmpeg${suffix}`);
      const ffprobe = join(packages, name, `ffprobe${suffix}`);
      if (existsSync(ffmpeg) && existsSync(ffprobe)) return { ffmpeg, ffprobe };
    }
  }
  throw new Error('Remotion ffmpeg/ffprobe were not found. Run npm install first.');
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${command} failed: ${result.error?.message ?? result.stderr ?? result.stdout}`);
  }
  return result.stdout;
}

const scriptBytes = await readFile(scriptPath);
if (sha256(JSON.stringify(JSON.parse(scriptBytes.toString('utf8')))) !== manifest.scriptSha256) {
  throw new Error('script.json changed since Bella was generated; regenerate the narration and alignment before preparing clips.');
}
const [audioBytes, alignmentBytes] = await Promise.all([
  verifiedSource(manifest.audio),
  verifiedSource(manifest.alignment),
]);
const segments = await loadScript();
const alignment = JSON.parse(alignmentBytes.toString('utf8'));
const characters = alignment.characters;
const starts = alignment.character_start_times_seconds;
const ends = alignment.character_end_times_seconds;
if (!Array.isArray(characters) || !Array.isArray(starts) || !Array.isArray(ends)
    || characters.length !== starts.length || starts.length !== ends.length) {
  throw new Error('The saved Bella character alignment is incomplete');
}

const sourceText = characters.join('');
const ranges = [];
let cursor = 0;
for (const segment of segments) {
  const start = sourceText.indexOf(segment.text, cursor);
  if (start < 0) throw new Error(`Cannot locate ${segment.id} in the saved character alignment`);
  const end = start + segment.text.length;
  ranges.push({ start, end });
  cursor = end;
}

const audioPath = join(sourceDir, manifest.audio.file);
const { ffmpeg, ffprobe } = mediaTools();
const info = JSON.parse(run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', audioPath]));
const duration = Number(info.format?.duration);
if (!Number.isFinite(duration) || duration <= 0) throw new Error('Cannot measure the saved Bella narration');

const boundaries = [0];
for (let index = 1; index < ranges.length; index++) {
  const previousEnd = ends[ranges[index - 1].end - 1];
  const nextStart = starts[ranges[index].start];
  const boundary = (previousEnd + nextStart) / 2;
  if (!Number.isFinite(boundary) || boundary <= boundaries[index - 1] || boundary >= duration) {
    throw new Error(`Invalid scene boundary before ${segments[index].id}`);
  }
  boundaries.push(boundary);
}
boundaries.push(duration);

await mkdir(clipsDir, { recursive: true });
for (let index = 0; index < segments.length; index++) {
  const { id } = segments[index];
  const start = boundaries[index];
  const length = boundaries[index + 1] - start;
  if (length < 0.5) throw new Error(`Clip ${id} would be too short`);
  const wavPath = join(clipsDir, `${id}.wav`);
  run(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', audioPath,
    '-ss', start.toFixed(6), '-t', length.toFixed(6),
    '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', wavPath,
  ]);
  const range = ranges[index];
  const localAlignment = {
    alignment: {
      characters: characters.slice(range.start, range.end),
      character_start_times_seconds: starts.slice(range.start, range.end).map((time) => Math.max(0, time - start)),
      character_end_times_seconds: ends.slice(range.start, range.end).map((time) => Math.max(0, time - start)),
    },
  };
  await writeFile(join(clipsDir, `${id}.alignment.json`), `${JSON.stringify(localAlignment)}\n`);
}

console.log(`Bella source verified: ${sha256(audioBytes).slice(0, 12)}; ${segments.length} clips in ${clipsDir}`);
if (!prepareOnly) {
  process.stdout.write(run(process.execPath, [join(currentDir, 'import-audio.mjs'), `--input=${clipsDir}`, '--pause=0']));
}
