// Loads and validates storyboard.json + narration.json + lexicon.json, and
// computes the hashes that tie generated files back to their sources.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { PATHS } from './paths.mjs';
import { MarkupError, parseSegmentText, pronunciationRisks } from './text.mjs';

export const SEGMENT_ID = /^s\d\d-\d\d$/;
export const DEFAULT_PAUSE_MS = 330;
export const EXAM_TEXT_MAX = 58;
export const THINK_Q_MAX = 48;
/** Symbols the style guide bans from anything that reaches the screen or the voice. */
export const FORBIDDEN_SYMBOLS = /[→←↑↓↔⇒⇐⇔➔➜≠≈≤≥✓✔✗✘★☆•]|\p{Extended_Pictographic}/u;

const stripBom = (s) => s.replace(/^\uFEFF/, '');

export function readSource(path, label, { optional = false } = {}) {
  if (!existsSync(path)) {
    if (optional) return null;
    throw new Error(`${label} not found: ${path}`);
  }
  return readFileSync(path, 'utf8');
}

export function parseJsonText(text, path) {
  try {
    return JSON.parse(stripBom(text));
  } catch (err) {
    throw new Error(`${path}: invalid JSON — ${err.message}`);
  }
}

/** Reads the three source files. A missing lexicon is allowed (empty, with a warning). */
export const EDGE_VOICE = /^[a-z]{2}-[A-Z]{2}-\w+Neural$/;
export const ELEVEN_VOICE = /^elevenlabs\/[a-z0-9_]+\/[A-Za-z0-9]{10,40}$/;

/** True when the narration is voiced with ElevenLabs (voice "elevenlabs/<model>/<voice_id>"). */
export function isElevenLabsVoice(voice) {
  return typeof voice === 'string' && ELEVEN_VOICE.test(voice);
}

/**
 * The text a segment is synthesised from (and keyed on): ElevenLabs gets the
 * voice-only <directions> as [audio tags]; edge-tts gets plain spoken text.
 */
export function spokenForVoice(voice, parsed) {
  return isElevenLabsVoice(voice) ? parsed.directedSpoken : parsed.spoken;
}

export function loadSources({ storyboard, narration, lexicon }) {
  const storyboardText = readSource(storyboard, 'storyboard.json');
  const narrationText = readSource(narration, 'narration.json');
  // narration.json may name its own lexicon ("lexicon": "lexicon.elevenlabs.json",
  // relative to narration.json); it wins over the default lexicon path only.
  const narrationJson = parseJsonText(narrationText, narration);
  if (lexicon === PATHS.lexicon && typeof narrationJson?.lexicon === 'string') {
    lexicon = path.resolve(path.dirname(narration), narrationJson.lexicon);
  }
  const lexiconRaw = readSource(lexicon, 'lexicon.json', { optional: true });
  return {
    paths: { storyboard, narration, lexicon },
    storyboardText,
    narrationText,
    lexiconText: lexiconRaw ?? '',
    lexiconMissing: lexiconRaw === null,
    storyboard: parseJsonText(storyboardText, storyboard),
    narration: parseJsonText(narrationText, narration),
    lexicon: lexiconRaw === null ? {} : parseJsonText(lexiconRaw, lexicon),
  };
}

/** Cache key of one synthesised segment. Python's tts.py computes the same string. */
export function ttsKey(voice, rate, pitch, spoken) {
  return createHash('sha256').update(`${voice}\n${rate}\n${pitch}\n${spoken}`, 'utf8').digest('hex');
}

/**
 * sha256 over the exact source bytes (storyboard, narration, lexicon) and, in
 * audio mode, the per-segment TTS keys ([id, key] pairs in narration order).
 */
export function sourceHash({ storyboardText, narrationText, lexiconText }, ttsKeys = null) {
  const h = createHash('sha256');
  for (const part of [storyboardText, narrationText, lexiconText]) {
    h.update(part, 'utf8');
    h.update('\u0000');
  }
  if (ttsKeys) for (const [id, key] of ttsKeys) h.update(`${id}:${key}\n`, 'utf8');
  return h.digest('hex');
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const countWords = (s) => s.split(/\s+/).filter(Boolean).length;

/**
 * Validates everything that can be checked before timing and returns the
 * parsed segments grouped by storyboard scene.
 * @returns {{errors: string[], warnings: string[], voice: {voice: string, rate: string, pitch: string},
 *   scenes: {scene: object, index: number, segments: object[]}[], segments: object[]}}
 */
export function analyzeNarration({ storyboard, narration, lexicon }, { examCards = [8, 11], thinkPrompts = 2 } = {}) {
  const errors = [];
  const warnings = [];

  // Storyboard
  if (!isObj(storyboard) || !Array.isArray(storyboard.scenes) || !storyboard.scenes.length) {
    errors.push('storyboard.json: "scenes" must be a non-empty array');
    return { errors, warnings, voice: null, scenes: [], segments: [] };
  }
  const chapters = new Map((storyboard.chapters ?? []).map((c) => [c.n, c.title]));
  storyboard.scenes.forEach((s, k) => {
    if (typeof s.id !== 'string' || !/^s\d\d-/.test(s.id)) errors.push(`storyboard scene #${k + 1}: invalid id ${JSON.stringify(s.id)}`);
    if (!chapters.has(s.chapter)) errors.push(`storyboard scene ${s.id}: chapter ${s.chapter} is not in "chapters"`);
    if (!Array.isArray(s.requiredCues)) errors.push(`storyboard scene ${s.id}: "requiredCues" must be an array`);
  });
  const sceneIndex = new Map(storyboard.scenes.map((s, k) => [s.id, k]));

  // Lexicon
  if (!isObj(lexicon)) {
    errors.push('lexicon.json must be a flat JSON object');
    lexicon = {};
  }
  for (const [key, value] of Object.entries(lexicon)) {
    if (!key || /\s/.test(key) || /[{}[\]|]/.test(key)) errors.push(`lexicon key ${JSON.stringify(key)} must be one display token without spaces or markup`);
    if (typeof value !== 'string' || !value.trim()) errors.push(`lexicon[${JSON.stringify(key)}] must be a non-empty string`);
    else if (/[{}[\]|]/.test(value)) errors.push(`lexicon[${JSON.stringify(key)}] must not contain markup characters`);
  }

  // Narration header
  if (!isObj(narration)) {
    errors.push('narration.json must be a JSON object');
    return { errors, warnings, voice: null, scenes: [], segments: [] };
  }
  const voice = { voice: narration.voice, rate: narration.rate ?? '+0%', pitch: narration.pitch ?? '+0Hz' };
  if (typeof voice.voice !== 'string' || !(EDGE_VOICE.test(voice.voice) || ELEVEN_VOICE.test(voice.voice))) {
    errors.push(`narration.voice ${JSON.stringify(voice.voice)} must be an edge-tts voice ("es-ES-ElviraNeural") or "elevenlabs/<model_id>/<voice_id>"`);
  }
  if (narration.elevenlabs !== undefined && !isObj(narration.elevenlabs)) errors.push('narration.elevenlabs must be an object of voice settings');
  if (!/^[+-]\d{1,3}%$/.test(voice.rate)) errors.push(`narration.rate ${JSON.stringify(voice.rate)} must look like "+0%"`);
  if (!/^[+-]\d{1,3}Hz$/.test(voice.pitch)) errors.push(`narration.pitch ${JSON.stringify(voice.pitch)} must look like "+0Hz"`);
  if (!Array.isArray(narration.segments) || !narration.segments.length) {
    errors.push('narration.segments must be a non-empty array');
    return { errors, warnings, voice, scenes: [], segments: [] };
  }

  // Segments
  const seen = new Set();
  const segments = [];
  const usedLexicon = new Set();
  const risks = new Map(); // token -> first segment id
  let currentScene = -1;
  let lastIndex = 0;
  narration.segments.forEach((raw, k) => {
    const label = isObj(raw) && typeof raw.id === 'string' ? raw.id : `segment #${k + 1}`;
    if (!isObj(raw)) {
      errors.push(`${label}: must be an object`);
      return;
    }
    if (!SEGMENT_ID.test(raw.id ?? '')) errors.push(`${label}: id must match sNN-NN`);
    if (seen.has(raw.id)) errors.push(`${label}: duplicate id`);
    seen.add(raw.id);
    const si = sceneIndex.get(raw.scene);
    if (si === undefined) {
      errors.push(`${label}: unknown scene ${JSON.stringify(raw.scene)}`);
      return;
    }
    if (typeof raw.id === 'string' && raw.id.slice(0, 3) !== raw.scene.slice(0, 3)) errors.push(`${label}: id prefix does not match scene ${raw.scene}`);
    const idx = Number(String(raw.id).slice(4));
    if (si < currentScene) errors.push(`${label}: scene ${raw.scene} is out of storyboard order (after ${storyboard.scenes[currentScene].id})`);
    else if (si === currentScene && !(idx > lastIndex)) errors.push(`${label}: segment index is not increasing within ${raw.scene}`);
    if (si !== currentScene) lastIndex = 0;
    currentScene = Math.max(currentScene, si);
    lastIndex = idx;

    if (typeof raw.text !== 'string' || !raw.text.trim()) {
      errors.push(`${label}: "text" must be a non-empty string`);
      return;
    }
    let parsed;
    try {
      parsed = parseSegmentText(raw.text, lexicon);
    } catch (err) {
      if (err instanceof MarkupError) {
        errors.push(`${label}: ${err.message}`);
        return;
      }
      throw err;
    }
    if (FORBIDDEN_SYMBOLS.test(parsed.display) || FORBIDDEN_SYMBOLS.test(parsed.spoken)) errors.push(`${label}: forbidden symbol or emoji in text`);
    for (const token of parsed.plainTokens) {
      const core = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
      if (Object.hasOwn(lexicon, token)) usedLexicon.add(token);
      if (Object.hasOwn(lexicon, core)) usedLexicon.add(core);
    }
    for (const r of pronunciationRisks(parsed.plainTokens, lexicon)) if (!risks.has(r)) risks.set(r, label);
    const collision = /(?<![\p{L}])(el|la|las|los)\s+(el|la|las|los)(?![\p{L}])/iu.exec(parsed.spoken);
    if (collision) warnings.push(`${label}: the voice will say "${collision[0]}" — move the article inside the [..|..] group, e.g. [a las 01:52|a la una y cincuenta y dos]`);

    const pauseMs = raw.pauseAfterMs ?? DEFAULT_PAUSE_MS;
    if (typeof pauseMs !== 'number' || !Number.isFinite(pauseMs) || pauseMs < 0 || pauseMs > 3000) errors.push(`${label}: pauseAfterMs must be a number between 0 and 3000`);

    let exam = null;
    if (raw.exam !== undefined) {
      const e = raw.exam;
      if (!isObj(e)) errors.push(`${label}: exam must be an object`);
      else {
        if (typeof e.objective !== 'string' || !/^[1-5]\.\d{1,2}$/.test(e.objective)) errors.push(`${label}: exam.objective must be an SY0-701 objective like "4.4"`);
        if (typeof e.text !== 'string' || !e.text.trim()) errors.push(`${label}: exam.text must be a non-empty string`);
        else {
          if (e.text.length > EXAM_TEXT_MAX) errors.push(`${label}: exam.text is ${e.text.length} characters (max ${EXAM_TEXT_MAX})`);
          if (FORBIDDEN_SYMBOLS.test(e.text) || /[{}[\]|<>]/.test(e.text)) errors.push(`${label}: exam.text contains a forbidden symbol (use ":" "=" or "·")`);
        }
        if (e.at !== undefined && typeof e.at !== 'string') errors.push(`${label}: exam.at must be a cue id`);
        const hold = e.holdSec ?? 5;
        if (typeof hold !== 'number' || hold < 4 || hold > 6) errors.push(`${label}: exam.holdSec must be between 4 and 6`);
        exam = { objective: e.objective, text: e.text, at: e.at ?? null, holdSec: hold };
      }
    }
    let think = null;
    if (raw.think !== undefined) {
      const t = raw.think;
      if (!isObj(t)) errors.push(`${label}: think must be an object`);
      else {
        if (typeof t.q !== 'string' || !t.q.trim()) errors.push(`${label}: think.q must be a non-empty string`);
        else {
          if (t.q.length > THINK_Q_MAX) errors.push(`${label}: think.q is ${t.q.length} characters (max ${THINK_Q_MAX})`);
          if (FORBIDDEN_SYMBOLS.test(t.q)) errors.push(`${label}: think.q contains a forbidden symbol`);
        }
        if (typeof t.holdMs !== 'number' || t.holdMs < 1800 || t.holdMs > 2500) errors.push(`${label}: think.holdMs must be between 1800 and 2500`);
        think = { q: t.q, holdMs: t.holdMs };
      }
    }

    // Style (warnings only)
    const displayWords = parsed.displayTokens.length;
    if (displayWords < 8 || displayWords > 30) warnings.push(`${label}: ${displayWords} words (style guide: about 10–26 per segment)`);
    for (const sentence of parsed.display.split(/(?<=[.!?…])\s+/)) {
      if (countWords(sentence) > 22) warnings.push(`${label}: sentence of ${countWords(sentence)} words (max 22): "${sentence.slice(0, 60)}…"`);
    }

    segments.push({ id: raw.id, scene: raw.scene, sceneIndex: si, text: raw.text, parsed, pauseMs, exam, think });
  });

  // Scenes
  const scenes = storyboard.scenes.map((scene, index) => ({ scene, index, segments: segments.filter((s) => s.sceneIndex === index) }));
  const lastScene = storyboard.scenes.at(-1).id;
  let examCount = 0;
  const thinkScenes = [];
  for (const { scene, segments: segs } of scenes) {
    if (!segs.length) {
      errors.push(`scene ${scene.id} has no segments`);
      continue;
    }
    if (segs.length < 2) warnings.push(`scene ${scene.id} has only ${segs.length} segment (style guide: at least 2)`);
    const counts = new Map();
    const order = [];
    for (const seg of segs) {
      for (const cue of seg.parsed.cues) {
        counts.set(cue.id, (counts.get(cue.id) ?? 0) + 1);
        order.push(cue.id);
      }
    }
    const required = scene.requiredCues ?? [];
    for (const id of required) {
      if (!counts.has(id)) errors.push(`scene ${scene.id}: missing cue {${id}}`);
      else if (counts.get(id) > 1) errors.push(`scene ${scene.id}: cue {${id}} appears ${counts.get(id)} times`);
    }
    for (const id of counts.keys()) if (!required.includes(id)) errors.push(`scene ${scene.id}: unknown cue {${id}} (requiredCues: ${required.join(', ')})`);
    const expected = required.filter((id) => counts.has(id)).join(' ');
    const actual = [...new Set(order)].filter((id) => required.includes(id)).join(' ');
    if (expected !== actual) warnings.push(`scene ${scene.id}: cues fire in a different order than requiredCues (${actual})`);

    const exams = segs.filter((s) => s.exam);
    examCount += exams.length;
    if (exams.length > 1) errors.push(`scene ${scene.id}: ${exams.length} exam cards (max 1 per scene)`);
    if (exams.length && scene.id === lastScene) errors.push(`scene ${scene.id}: the closing scene must not carry an exam card`);
    for (const s of exams) {
      if (s.exam.at && !counts.has(s.exam.at)) errors.push(`${s.id}: exam.at "${s.exam.at}" is not a cue of ${scene.id}`);
    }
    for (const s of segs) if (s.think) thinkScenes.push(scene.id);
  }
  if (thinkScenes.length !== thinkPrompts) warnings.push(`${thinkScenes.length} think prompts (style guide: exactly ${thinkPrompts})`);
  if (examCount && (examCount < examCards[0] || examCount > examCards[1])) warnings.push(`${examCount} exam cards (style guide: ${examCards[0]}–${examCards[1]})`);

  const unused = Object.keys(lexicon).filter((k) => !usedLexicon.has(k));
  if (unused.length) warnings.push(`lexicon entries never used outside markup: ${unused.join(', ')}`);
  if (risks.size) {
    warnings.push(
      `tokens the voice may misread (not in the lexicon, outside [..|..]): ${[...risks].map(([t, id]) => `${t} (${id})`).join(', ')}`,
    );
  }

  return { errors, warnings, voice, scenes, segments, chapters };
}

/** Throws one Error listing every problem, after printing warnings. */
export function reportOrThrow({ errors, warnings }, log = console) {
  for (const w of warnings) log.warn(`  aviso: ${w}`);
  if (errors.length) {
    const err = new Error(`${errors.length} error(s):\n${errors.map((e) => `  - ${e}`).join('\n')}`);
    err.validation = true;
    throw err;
  }
}
