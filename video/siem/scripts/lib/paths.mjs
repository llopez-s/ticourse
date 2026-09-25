// Absolute paths used by every script. Everything is resolved from this file's
// location, so the scripts work from any cwd and paths with spaces are safe.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCRIPTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SIEM_DIR = path.resolve(SCRIPTS_DIR, '..');
export const REPO_ROOT = path.resolve(SIEM_DIR, '..', '..');

export const PATHS = {
  storyboard: path.join(SIEM_DIR, 'storyboard.json'),
  narration: path.join(SIEM_DIR, 'narration.json'),
  lexicon: path.join(SIEM_DIR, 'lexicon.json'),
  timeline: path.join(SIEM_DIR, 'src', 'timeline.json'),
  entry: path.join(SIEM_DIR, 'src', 'index.ts'),
  publicDir: path.join(SIEM_DIR, 'public'),
  voiceDir: path.join(SIEM_DIR, 'public', 'voice'),
  ttsDir: path.join(SIEM_DIR, 'tts'),
  outDir: path.join(SIEM_DIR, 'out'),
  ttsInput: path.join(SIEM_DIR, 'out', 'tts-input.json'),
  auditionDir: path.join(SIEM_DIR, '.audition'),
  transcript: path.join(REPO_ROOT, 'public', 'videos', 'siem-blue-team-transcript.txt'),
  captions: path.join(REPO_ROOT, 'public', 'videos', 'siem-blue-team-captions.vtt'),
  video: path.join(REPO_ROOT, 'public', 'videos', 'siem-blue-team.mp4'),
  poster: path.join(REPO_ROOT, 'public', 'videos', 'siem-blue-team-poster.png'),
  draft: path.join(SIEM_DIR, 'out', 'draft.mp4'),
  qaDir: path.join(SIEM_DIR, 'out', 'qa'),
  remotionCli: path.join(REPO_ROOT, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'),
  ttsPy: path.join(SCRIPTS_DIR, 'tts.py'),
};

/** Composition ids registered in src/Root.tsx. */
export const COMPOSITION = 'SIEMBlueTeam';
export const POSTER_STILL = 'SIEMPoster';

/** True when the module at `metaUrl` is the script node was started with. */
export function isMainModule(metaUrl) {
  if (!process.argv[1]) return false;
  const norm = (p) => (process.platform === 'win32' ? path.resolve(p).toLowerCase() : path.resolve(p));
  return norm(process.argv[1]) === norm(fileURLToPath(metaUrl));
}
