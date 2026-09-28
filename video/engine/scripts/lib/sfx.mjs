// Sound effects of a lesson video: where each one plays (build-timeline writes them to timeline.sfx) and the
// files the composition needs in the video's public/sfx/. The sounds themselves come from
// scripts/sfx_generate.py (video/engine/sfx/<name>.mp3 + sfx.json).
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import INTERCEPT_TIMING from '../../src/overlay/intercept-timing.json' with { type: 'json' };
import { VENV_PYTHON } from '../tts-chatterbox.mjs';

export { INTERCEPT_TIMING };
/** Frames of silence kept after the adversary's voice, before the narrator answers. */
export const VOICE_MARGIN_FRAMES = 10;
/** Sounds placed without being named in narration.json "sfx". */
export const AUTO_SOUNDS = Object.freeze(['glitch', 'typing', 'ding', 'whoosh']);
/** Regenerates the sound library (video/engine/sfx/): needs the Chatterbox venv's python (numpy, scipy, soundfile). */
export const SFX_GENERATE_CMD = `${VENV_PYTHON} video/engine/scripts/sfx_generate.py`;

/** The silent lead before an intercept's answer: the written hold, or longer if the adversary's voice needs it. */
export function voicedHoldFrames(holdFrames, voiceFrames) {
  return Math.max(holdFrames, INTERCEPT_TIMING.typeStart + voiceFrames + VOICE_MARGIN_FRAMES);
}

export function readSfxLibrary(dir) {
  const file = path.join(dir, 'sfx.json');
  if (!existsSync(file)) throw new Error(`no sound library at ${file} — run: ${SFX_GENERATE_CMD}`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

/**
 * Problems with narration.json "sfx" ({cue id: sound}) against the video's cues and the library.
 * `cues` are the timeline's {scene, id, frame} entries: a mapped id known in the narration but reachable
 * from more than one scene is also an error, named with its scenes — the map is keyed by cue id alone, so
 * it would play the sound in every scene that has that cue. `dir`, when given, is also checked for the MP3
 * of every sound actually in use (mapped or automatic), so a library entry with no file on disk fails here
 * too, before anything is written — the same check `--check` runs.
 */
export function sfxMapErrors(map, cues, library, dir) {
  if (map === null || typeof map !== 'object' || Array.isArray(map)) return ['narration.sfx must be an object of cue id -> sound name'];
  const errors = [];
  const sounds = library.sounds ?? {};
  const soundNames = Object.keys(sounds);
  const scenesOf = new Map();
  for (const c of cues) {
    if (!scenesOf.has(c.id)) scenesOf.set(c.id, new Set());
    scenesOf.get(c.id).add(c.scene);
  }
  const validIds = [...scenesOf.keys()].sort();
  for (const [id, sound] of Object.entries(map)) {
    const scenes = scenesOf.get(id);
    if (!scenes) errors.push(`sfx: no cue {${id}} in the narration (have: ${validIds.join(', ')})`);
    else if (scenes.size > 1) errors.push(`sfx: cue {${id}} is in more than one scene (${[...scenes].sort().join(', ')}) — sfx is keyed by cue id, so it would play in all of them`);
    if (!soundNames.includes(sound)) errors.push(`sfx: unknown sound "${sound}" for {${id}} (have: ${soundNames.join(', ')})`);
  }
  const missingSounds = AUTO_SOUNDS.filter((s) => !soundNames.includes(s));
  if (missingSounds.length) errors.push(`sfx: the library has no ${missingSounds.join(', ')} — run: ${SFX_GENERATE_CMD}`);
  if (dir) {
    const used = new Set([...Object.values(map).filter((s) => soundNames.includes(s)), ...AUTO_SOUNDS.filter((s) => soundNames.includes(s))]);
    for (const name of used) {
      const file = path.join(dir, sounds[name].file);
      if (!existsSync(file)) errors.push(`sfx: sound "${name}" has no MP3 at ${file} — run: ${SFX_GENERATE_CMD}`);
    }
  }
  return errors;
}

/**
 * Every sound effect of the video, in frame order: a glitch and the typing when an intercepted message
 * appears, a ding on each exam card, a whoosh on each chapter wipe, and narration.json "sfx" on its cues.
 */
export function placeSfx({ scenes, cues, exam, intercept, map, library, fps, transitionFrames }) {
  const frames = (ms) => Math.ceil((ms * fps) / 1000);
  const cue = (sound, from, maxFrames = Infinity) => {
    const s = library.sounds[sound];
    return { from, sound, src: `sfx/${s.file}`, durationInFrames: Math.max(1, Math.min(frames(s.durationMs), maxFrames)), volume: s.volume };
  };
  const out = [];
  for (const i of intercept) {
    out.push(cue('glitch', i.from));
    out.push(cue('typing', i.from + INTERCEPT_TIMING.typeStart, i.text.length * INTERCEPT_TIMING.typeRate));
  }
  for (const e of exam) out.push(cue('ding', e.from));
  scenes.forEach((s, k) => {
    if (k > 0 && s.chapter !== scenes[k - 1].chapter) out.push(cue('whoosh', s.from - transitionFrames));
  });
  for (const [id, sound] of Object.entries(map)) for (const c of cues.filter((x) => x.id === id)) out.push(cue(sound, c.frame));
  return out.sort((a, b) => a.from - b.from || a.sound.localeCompare(b.sound));
}

/** Copies the sounds `sfx` uses from the library into the video's public/sfx/ and removes the rest there. */
export function syncSfxFiles(sfx, library, fromDir, toDir) {
  mkdirSync(toDir, { recursive: true });
  const used = new Set(sfx.map((s) => library.sounds[s.sound].file));
  for (const file of used) copyFileSync(path.join(fromDir, file), path.join(toDir, file));
  for (const file of readdirSync(toDir)) if (file.endsWith('.mp3') && !used.has(file)) rmSync(path.join(toDir, file));
}
