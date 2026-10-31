// Pure pieces of prepare-voice-worktree.mjs: names, paths, the arguments of each command and the narration.json
// edit, so they can be tested without git, PowerShell or Python.
import path from 'node:path';

export const DEFAULT_BASE = 'origin/main';
export const IMPORT_LUFS = -18;

/** The branch a recording is imported on: the scripts' convention («video-<slug>-voz»). */
export const defaultBranch = (slug) => `video-${slug}-voz`;

/** Where the worktree goes when --dir is not given: the system temp folder, on NTFS (the repo's D: is exFAT). */
export const defaultDir = (slug, tmpDir) => path.join(tmpDir, 'alertopolis-voz', slug);

/** «<dir>/x.wav» -> «<dir>/x (master).wav», as master_voice.py's docs name it; a WAV already mastered is itself. */
export function masteredPath(wav) {
  if (/\(master\)\.wav$/i.test(wav)) return wav;
  const dir = path.dirname(wav);
  return path.join(dir, `${path.basename(wav).replace(/\.wav$/i, '')} (master).wav`);
}

/**
 * The links the worktree borrows from the main checkout: node_modules (Remotion, ffmpeg) and the engine's .cache
 * (Whisper models, bundle cache). Directory junctions, which a worktree on NTFS can hold (exFAT cannot).
 */
export function junctions(mainRoot, dir) {
  return ['node_modules', path.join('video', 'engine', '.cache')].map((rel) => ({ rel, path: path.join(dir, rel), target: path.join(mainRoot, rel) }));
}

/** The music track of video.json in the main checkout and in the worktree (music/library/ is outside git). */
export function musicPaths(manifest, mainRoot, dir) {
  if (!manifest?.music) return null;
  const rel = path.join('video', 'engine', 'music', 'library', manifest.music);
  return { name: manifest.music, from: path.join(mainRoot, rel), to: path.join(dir, rel) };
}

/**
 * narration.json without "recording.tempo" (her voice is imported at its own pace since 2026-10-24), edited as text so
 * the rest of the file keeps its layout. A "recording" block left empty goes too. `changed` is false when there was none.
 */
export function dropRecordingTempo(text) {
  const bom = text.startsWith('﻿') ? '﻿' : '';
  // A Windows checkout (core.autocrlf) has CRLF: edited as LF and given back its line ends.
  const crlf = text.includes('\r\n');
  const body = text.slice(bom.length).replace(/\r\n/g, '\n');
  const json = JSON.parse(body);
  if (!json.recording || !('tempo' in json.recording)) return { text, changed: false };
  const want = structuredClone(json);
  delete want.recording.tempo;
  const empty = Object.keys(want.recording).length === 0;
  if (empty) delete want.recording;
  const same = (t) => {
    try {
      return JSON.stringify(JSON.parse(t)) === JSON.stringify(want);
    } catch {
      return false;
    }
  };
  const tries = empty
    ? [
        body.replace(/\n?[ \t]*"recording"\s*:\s*\{[^{}]*\}\s*,/, ''),
        body.replace(/,\s*\n?[ \t]*"recording"\s*:\s*\{[^{}]*\}/, ''),
      ]
    : [
        body.replace(/("recording"\s*:\s*\{[^{}]*?)\n?[ \t]*"tempo"\s*:\s*-?[\d.]+\s*,/, '$1'),
        body.replace(/("recording"\s*:\s*\{[^{}]*?),\s*\n?[ \t]*"tempo"\s*:\s*-?[\d.]+/, '$1'),
      ];
  const edited = tries.find(same);
  // A layout the patterns do not know: rewrite the whole file rather than leave the tempo in.
  const out = edited ?? `${JSON.stringify(want, null, 2)}\n`;
  return { text: bom + (crlf ? out.replace(/\n/g, '\r\n') : out), changed: true };
}

/** master_voice.py on the recording (run with the main checkout's venv, from the worktree). */
export const masterArgs = (scriptsDir, wav, out) => ['-X', 'utf8', path.join(scriptsDir, 'master_voice.py'), '--in', wav, '--out', out];

/** import-recording.mjs with the full import's target loudness, written «--lufs=-18» (see joinNegativeValues). */
export const importArgs = (scriptsDir, { slug, file, name, lufs = IMPORT_LUFS }) => [path.join(scriptsDir, 'import-recording.mjs'), '--video', slug, '--file', file, '--name', name, `--lufs=${lufs}`];

/** `git worktree add`: a new branch from `base`, or the branch as it is when it already exists. */
export function worktreeArgs({ dir, branch, base, branchExists }) {
  return branchExists ? ['worktree', 'add', dir, branch] : ['worktree', 'add', '-b', branch, dir, base];
}
