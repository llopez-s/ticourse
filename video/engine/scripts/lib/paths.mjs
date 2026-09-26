// Absolute paths used by every script. Everything is resolved from this file's
// location, so the scripts work from any cwd and paths with spaces are safe.
//
// The engine serves several videos, one folder each under video/<slug>/ with a
// video.json manifest. The active video comes from `--video <slug>` (or
// `--video=<slug>`) on the command line, else $VIDEO, else "siem".
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { profileFor } from './profiles.mjs';

export const SCRIPTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ENGINE_DIR = path.resolve(SCRIPTS_DIR, '..');
export const VIDEOS_DIR = path.resolve(ENGINE_DIR, '..');
export const REPO_ROOT = path.resolve(VIDEOS_DIR, '..');

export const DEFAULT_VIDEO = 'siem';

/** Slug named by --video / --video=… in argv, else $VIDEO, else DEFAULT_VIDEO. */
export function videoSlugFrom(argv = process.argv, env = process.env) {
  for (let k = 0; k < argv.length; k += 1) {
    if (argv[k] === '--video' && argv[k + 1]) return argv[k + 1];
    if (argv[k].startsWith('--video=')) return argv[k].slice('--video='.length);
  }
  return env.VIDEO || DEFAULT_VIDEO;
}

const MANIFEST_KEYS = ['slug', 'output', 'composition', 'poster', 'profile', 'track'];

/** Reads and checks video/<slug>/video.json. */
export function readManifest(slug) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error(`invalid video slug ${JSON.stringify(slug)}`);
  const file = path.join(VIDEOS_DIR, slug, 'video.json');
  if (!existsSync(file)) throw new Error(`no video.json for "${slug}" (expected ${file})`);
  const manifest = JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));
  for (const key of MANIFEST_KEYS) {
    if (typeof manifest[key] !== 'string' || !manifest[key]) throw new Error(`${file}: "${key}" must be a non-empty string`);
  }
  if (manifest.slug !== slug) throw new Error(`${file}: slug "${manifest.slug}" does not match its folder "${slug}"`);
  return manifest;
}

/** Where the rendered MP4 goes: the app's public/videos (committed) or, for YouTube, the video's out/ (ignored). */
export function mp4PathFor(manifest, dir, publicVideos) {
  return profileFor(manifest.profile).host === 'youtube'
    ? path.join(dir, 'out', `${manifest.output}.mp4`)
    : path.join(publicVideos, `${manifest.output}.mp4`);
}

/** Every path one video's pipeline reads or writes. */
export function videoPaths(slug) {
  const manifest = readManifest(slug);
  const dir = path.join(VIDEOS_DIR, slug);
  const publicVideos = path.join(REPO_ROOT, 'public', 'videos');
  return {
    slug,
    manifest,
    dir,
    storyboard: path.join(dir, 'storyboard.json'),
    narration: path.join(dir, 'narration.json'),
    lexicon: path.join(dir, 'lexicon.json'),
    timeline: path.join(dir, 'src', 'timeline.json'),
    entry: path.join(dir, 'src', 'index.ts'),
    publicDir: path.join(dir, 'public'),
    voiceDir: path.join(dir, 'public', 'voice'),
    ttsDir: path.join(dir, 'tts'),
    outDir: path.join(dir, 'out'),
    ttsInput: path.join(dir, 'out', 'tts-input.json'),
    auditionDir: path.join(dir, '.audition'),
    transcript: path.join(publicVideos, `${manifest.output}-transcript.txt`),
    captions: path.join(publicVideos, `${manifest.output}-captions.vtt`),
    video: mp4PathFor(manifest, dir, publicVideos),
    poster: path.join(publicVideos, `${manifest.output}-poster.png`),
    draft: path.join(dir, 'out', 'draft.mp4'),
    qaDir: path.join(dir, 'out', 'qa'),
    remotionCli: path.join(REPO_ROOT, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'),
    ttsPy: path.join(SCRIPTS_DIR, 'tts.py'),
  };
}

/** The video this process works on. */
export const VIDEO = videoSlugFrom();
export const PATHS = videoPaths(VIDEO);
export const MANIFEST = PATHS.manifest;
export const VIDEO_DIR = PATHS.dir;

/** Composition ids registered in the video's src/Root.tsx. */
export const COMPOSITION = MANIFEST.composition;
export const POSTER_STILL = MANIFEST.poster;

/** Shell hint for messages: the command that rebuilds this video's audio. */
export const AUDIO_CMD = `node video/engine/scripts/audio.mjs --video ${VIDEO}`;

/** True when the module at `metaUrl` is the script node was started with. */
export function isMainModule(metaUrl) {
  if (!process.argv[1]) return false;
  const norm = (p) => (process.platform === 'win32' ? path.resolve(p).toLowerCase() : path.resolve(p));
  return norm(process.argv[1]) === norm(fileURLToPath(metaUrl));
}
