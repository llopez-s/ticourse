// Reading sheets built from storyboard.json + narration.json (+ video.json), for
// script-sheets.mjs. Pure: every function takes parsed JSON and returns Markdown.
//
//   recordingSheet  -> out/guion-grabacion.md    the script as the narrator reads it
//   rerecordSheet   -> out/guion-regrabacion.md  only the segments to record again
//   voiceStudioSheet-> out/guion-voice-studio.md Voice Studio markup ([voice:…], [pause …ms])
import { DEFAULT_PAUSE_MS, isRecordingVoice } from './narration.mjs';
import { parsePieces } from './text.mjs';

/** A segment's pauseAfterMs from which the reading sheet asks for a long pause. */
export const LONG_PAUSE_MS = 550;
/** The narrator's voice name in Voice Studio. */
export const STUDIO_VOICE = 'Narradora';
/** Silence between two segments of a scene in Voice Studio: gives import-recording a place to cut. */
export const STUDIO_PAUSE_MS = 400;
/** Silence after an intercepted message in Voice Studio. */
export const STUDIO_INTERCEPT_PAUSE_MS = 600;

const collapse = (s) => s.replace(/\s+/g, ' ').trim();
const lower = (s) => s.toLocaleLowerCase('es');

/**
 * How the reading sheet names each emotion tag of the vocabulary (moods.mjs), in Spanish: the
 * narrator reads the sheet, not the tags. A tag outside the table is shown as it is.
 */
export const TONE_ES = Object.freeze({
  calm: 'tranquila',
  serious: 'seria',
  steady: 'pausada',
  grave: 'grave',
  focused: 'concentrada',
  firm: 'firme',
  concerned: 'preocupada',
  warning: 'de aviso',
  ominous: 'inquietante',
  tired: 'cansada',
  sighs: 'con un suspiro',
  clear: 'clara',
  thoughtful: 'pensativa',
  curious: 'con curiosidad',
  intrigued: 'intrigada',
  confident: 'segura',
  warm: 'cercana',
  warmly: 'con cariño',
  satisfied: 'satisfecha',
  relieved: 'aliviada',
  reassuring: 'tranquilizadora',
  casual: 'desenfadada',
  engaging: 'animada',
  enthusiastic: 'entusiasta',
  cheerful: 'alegre',
  mischievously: 'pícara',
  sarcastic: 'irónica',
  urgent: 'con urgencia',
  suspicious: 'suspicaz',
  emphatic: 'enfática',
  tense: 'tensa',
});

/** "curious, warm" -> "con curiosidad, cercana" (see TONE_ES). */
export function toneLabel(mood) {
  return mood
    .split(',')
    .map((m) => m.trim())
    .map((m) => TONE_ES[m.toLowerCase()] ?? m)
    .join(', ');
}

/** Leading performance direction(s) of a segment ("<intrigued> Tienes…" -> "intrigued"), or null. */
export function segmentMood(text) {
  const moods = [];
  for (const piece of parsePieces(text)) {
    if (piece.type === 'direction') moods.push(piece.value);
    else if (piece.type === 'text' && !piece.value.trim()) continue;
    else if (piece.type !== 'cue') break;
  }
  return moods.length ? moods.join(', ') : null;
}

/**
 * The text as the narrator reads it: cues dropped, the leading direction dropped (it is the
 * segment's mood), later directions kept as *(direction)*, and "[shown|spoken]" shown with a
 * pronunciation hint — "shown *(lee: «spoken»)*" — unless both sides only differ in case.
 */
export function readingText(text) {
  let out = '';
  let started = false;
  for (const piece of parsePieces(text)) {
    if (piece.type === 'text') {
      out += piece.value;
      if (piece.value.trim()) started = true;
    } else if (piece.type === 'group') {
      out += lower(piece.display) === lower(piece.spoken) ? piece.display : `${piece.display} *(lee: «${piece.spoken}»)*`;
      started = true;
    } else if (piece.type === 'direction' && started) {
      out += ` *(${piece.value})* `;
    }
  }
  return collapse(out);
}

/**
 * The spoken side of "[shown|spoken]" for a TTS voice: spoken words that are shown words in
 * lower case get the shown capital back ("[Lab 3A|lab tres a]" -> "Lab tres a"), and a group that
 * opens a sentence starts with a capital. All-caps shown words are not copied (they would be spelled).
 */
function studioGroup(display, spoken, sentenceStart) {
  const shownCap = new Map();
  for (const w of display.split(/\s+/)) {
    if (/^\p{Lu}/u.test(w) && w !== w.toLocaleUpperCase('es')) shownCap.set(lower(w), w);
  }
  let words = spoken.split(/\s+/).map((w) => (w === lower(w) && shownCap.has(w) ? shownCap.get(w) : w));
  if (sentenceStart && words.length) words[0] = words[0].charAt(0).toLocaleUpperCase('es') + words[0].slice(1);
  return words.join(' ');
}

/** The text for a TTS voice in Voice Studio: cues and directions dropped, [shown|spoken] -> spoken. */
export function studioText(text) {
  let out = '';
  for (const piece of parsePieces(text)) {
    if (piece.type === 'text') out += piece.value;
    else if (piece.type === 'group') out += studioGroup(piece.display, piece.spoken, !out.trim() || /[.!?…]\s*$/.test(out));
  }
  return collapse(out);
}

/** Applies exact [find, replace] pairs in order; each find must match exactly once. */
export function applyStudioMarks(text, marks, label) {
  let s = text;
  for (const [find, replace] of marks) {
    const hits = s.split(find).length - 1;
    if (hits !== 1) throw new Error(`narration.json studio.${label}: "${find}" found ${hits} times in: ${s}`);
    s = s.replace(find, () => replace);
  }
  return s;
}

/**
 * Checks narration.json "studio": { "<segment id>" | "<segment id>-intercept": [["find", "replace"], …] }.
 * Returns it as a Map (empty when absent).
 */
export function studioMarks(narration) {
  const studio = narration.studio;
  const marks = new Map();
  if (studio === undefined) return marks;
  if (!studio || typeof studio !== 'object' || Array.isArray(studio)) throw new Error('narration.json "studio" must be an object');
  const known = new Set();
  for (const seg of narration.segments) {
    known.add(seg.id);
    if (seg.intercept) known.add(`${seg.id}-intercept`);
  }
  for (const [key, pairs] of Object.entries(studio)) {
    if (!known.has(key)) throw new Error(`narration.json studio.${key}: no such segment${key.endsWith('-intercept') ? ' with an intercepted message' : ''}`);
    const ok = Array.isArray(pairs) && pairs.every((p) => Array.isArray(p) && p.length === 2 && p.every((x) => typeof x === 'string') && p[0]);
    if (!ok) throw new Error(`narration.json studio.${key}: must be a list of ["find", "replace"] pairs with a non-empty find`);
    marks.set(key, pairs);
  }
  return marks;
}

/** Segment ids of `--only a,b`, validated and in script order. */
export function parseOnly(value, segments) {
  const ids = String(value ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  if (!ids.length) throw new Error('--only: no segment ids given');
  const known = new Set(segments.map((s) => s.id));
  const unknown = ids.filter((id) => !known.has(id));
  if (unknown.length) throw new Error(`--only: unknown segment(s) ${unknown.join(', ')}`);
  const wanted = new Set(ids);
  return segments.filter((s) => wanted.has(s.id)).map((s) => s.id);
}

/** Where the narrator saves the whole recording: video/engine/voices/<slug> <name>.wav. */
export function recordingFile(slug, voice) {
  const name = isRecordingVoice(voice) ? ` ${voice.slice('recording/'.length)}` : '';
  return `video/engine/voices/${slug}${name}.wav`;
}

/** Where the narrator saves a re-recording: video/engine/voices/<slug> regrabacion <name>.wav. */
export function rerecordFile(slug, voice) {
  const name = isRecordingVoice(voice) ? ` ${voice.slice('recording/'.length)}` : '';
  return `video/engine/voices/${slug} regrabacion${name}.wav`;
}

/** Storyboard scenes in order, each with its narration segments; throws on a segment of an unknown scene. */
function scenesWithSegments(storyboard, narration) {
  const byScene = new Map(storyboard.scenes.map((s) => [s.id, []]));
  for (const seg of narration.segments) {
    if (!byScene.has(seg.scene)) throw new Error(`segment ${seg.id}: unknown scene ${JSON.stringify(seg.scene)}`);
    byScene.get(seg.scene).push(seg);
  }
  return storyboard.scenes.map((scene) => ({ scene, segments: byScene.get(scene.id) }));
}

const chapterTitle = (storyboard, n) => storyboard.chapters?.find((c) => c.n === n)?.title ?? '';

/** Chapter / scene headings and one line per segment, with on-screen notes. `ids` limits the segments. */
function readingBody(storyboard, narration, manifest, ids = null) {
  const wanted = ids ? new Set(ids) : null;
  const adversary = manifest.adversary ?? 'el adversario';
  const out = [];
  let chapter = null;
  for (const { scene, segments } of scenesWithSegments(storyboard, narration)) {
    const segs = wanted ? segments.filter((s) => wanted.has(s.id)) : segments;
    if (!segs.length) continue;
    if (scene.chapter !== chapter) {
      chapter = scene.chapter;
      out.push(`## ${chapter}. ${chapterTitle(storyboard, chapter)}`, '');
    }
    out.push(`### ${scene.title}`, '');
    for (const seg of segs) {
      if (seg.intercept) out.push(`> *(En pantalla, no se lee: mensaje de ${adversary} — «${seg.intercept.text}». Tú contestas:)*`, '');
      const mood = segmentMood(seg.text);
      const pause = (seg.pauseAfterMs ?? DEFAULT_PAUSE_MS) >= LONG_PAUSE_MS ? ' **(pausa larga)**' : '';
      out.push(`**${seg.id}**${mood ? ` · *${toneLabel(mood)}*` : ''} — ${readingText(seg.text)}${pause}`, '');
      if (seg.think) out.push(`> *(En pantalla: «${seg.think.q}». Deja un segundo de silencio.)*`, '');
    }
  }
  return out;
}

/** "×1,08" for narration.json "recording.tempo", or null when there is none (or it is 1). */
function tempoLabel(narration) {
  const tempo = Number(narration.recording?.tempo);
  return Number.isFinite(tempo) && tempo > 0 && tempo !== 1 ? `×${String(tempo).replace('.', ',')}` : null;
}

/** What the viewer sees and the narrator does not read, as a Spanish list ("A, B y C"), or null. */
function onScreenOnly(narration) {
  const kinds = [];
  if (narration.segments.some((s) => s.intercept)) kinds.push('los mensajes interceptados');
  if (narration.segments.some((s) => s.think)) kinds.push('las preguntas para pensar');
  if (narration.segments.some((s) => s.exam)) kinds.push('las tarjetas de examen');
  if (!kinds.length) return null;
  return kinds.length === 1 ? kinds[0] : `${kinds.slice(0, -1).join(', ')} y ${kinds.at(-1)}`;
}

const finish = (lines) => `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;
const cap = (s) => s.charAt(0).toLocaleUpperCase('es') + s.slice(1);

/** out/guion-grabacion.md: the whole script, in order, as the narrator reads it. */
export function recordingSheet({ storyboard, narration, manifest }) {
  const tempo = tempoLabel(narration);
  const screen = onScreenOnly(narration);
  const frozen = manifest.frozen;
  const out = [
    frozen ? `# Guion para grabar · ${storyboard.title}` : `# BORRADOR · no grabes todavía · ${storyboard.title}`,
    '',
    frozen
      ? `**Versión definitiva** · guion congelado el ${frozen}.`
      : '**Borrador:** el guion aún no está congelado (falta `"frozen"` en video.json) y puede cambiar. No lo grabes todavía.',
    '',
    'Lee de corrido y en orden, **a ritmo de conversación**: como si se lo contaras a una amiga, no como quien lee.',
    `Entre frase y frase deja un respiro corto; los silencios se recortan solos${tempo ? ` y el vídeo se acelera un poco (${tempo})` : ''} al montarlo.`,
    'Si algo sale mal, **calla un segundo y repite la oración que falló desde su principio** (no hace falta la frase entera) y sigue: el importador se queda con la última toma de cada oración.',
    'No hagas pausas largas dentro de una frase: si necesitas respirar, termina antes la oración.',
    'Al acabar la última frase, deja dos segundos de silencio antes de parar la grabación.',
    `Guárdala como \`${recordingFile(manifest.slug, narration.voice)}\`.`,
    'Lo que va entre paréntesis en cursiva es solo cómo pronunciar; la *dirección* de cada frase es orientativa.',
    screen
      ? `${cap(screen)} salen en pantalla: **no se leen**. Los dominios, IP y correos tampoco: están en pantalla.`
      : 'Los dominios, IP y correos salen en pantalla: **no se leen**.',
    '',
    ...readingBody(storyboard, narration, manifest),
  ];
  return finish(out);
}

/** out/guion-regrabacion.md: only `ids` (script order), and the file to save them in. */
export function rerecordSheet({ storyboard, narration, manifest, ids }) {
  const n = ids.length;
  const out = [
    `# Regrabación · ${storyboard.title}`,
    '',
    `Graba ${n === 1 ? 'esta frase' : `estas ${n} frases`} en un archivo aparte, en este orden y a ritmo de conversación.`,
    'Si algo sale mal, repite solo la oración que falló (o la frase entera): el importador se queda con la última toma de cada oración.',
    `Guárdalo como \`${rerecordFile(manifest.slug, narration.voice)}\`.`,
    '',
    ...readingBody(storyboard, narration, manifest, ids),
  ];
  return finish(out);
}

/**
 * out/guion-voice-studio.md: "# " per chapter, one [voice:Narradora] paragraph per scene with its
 * segments joined by [pause 400ms], and each intercepted message as a [voice:<adversary>]
 * paragraph before the segment that answers it. narration.json "studio" adds per-segment marks.
 */
export function voiceStudioSheet({ storyboard, narration, manifest }) {
  const marks = studioMarks(narration);
  const adversary = manifest.adversary ?? 'Adversario';
  const marked = (text, key) => (marks.has(key) ? applyStudioMarks(text, marks.get(key), key) : text);
  const out = [`# ${storyboard.title}`, ''];
  let chapter = null;
  for (const { scene, segments } of scenesWithSegments(storyboard, narration)) {
    if (scene.chapter !== chapter) {
      chapter = scene.chapter;
      out.push(`# Capítulo ${chapter} — ${chapterTitle(storyboard, chapter)}`, '');
    }
    let para = [];
    const flush = () => {
      if (para.length) out.push(`[voice:${STUDIO_VOICE}] ${para.join(` [pause ${STUDIO_PAUSE_MS}ms] `)}`, '');
      para = [];
    };
    for (const seg of segments) {
      if (seg.intercept) {
        flush();
        out.push(`[voice:${adversary}] ${marked(collapse(seg.intercept.text), `${seg.id}-intercept`)} [pause ${STUDIO_INTERCEPT_PAUSE_MS}ms]`, '');
      }
      para.push(marked(studioText(seg.text), seg.id));
    }
    flush();
  }
  return finish(out);
}
