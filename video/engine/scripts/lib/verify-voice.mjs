// Pure parts of verify-voice.mjs: what counts as a cut or a leftover take in a narration clip, and the report.
import { matchKey, similarity } from './recording.mjs';

/** Relative energies (to the played part's RMS) above which a clip edge is cut inside the voice. */
export const LIMITS = Object.freeze({
  head: 0.35,
  tail: 0.35,
  dropped: 0.15,
  similarity: 0.75,
  phraseWords: 3,
  longWordS: 1.3, // a spoken word never lasts this long: Whisper stretched it over a take it did not transcribe
  unheardS: 0.4, // voice, longer than this, that no word of the transcript covers
  figureGapS: 0.3, // …unless it starts this close to the end of a number written in figures
  figureDigitS: 0.25, // …and lasts no longer than this per digit of that figure
  gapS: 0.6, // a silence this long inside a sentence: a pause that was not cut, or two takes
});

/** Words that may last long: spelled acronyms and numbers read letter by letter or digit by digit. */
const SPELLED = /^[A-Z0-9][A-Z0-9.,\-]*$/;

const keys = (text) => String(text ?? '').split(/\s+/).map(matchKey).filter(Boolean);

/**
 * Phrases of `n` words heard more often than the script says them, at least twice: the mark of a take that
 * slipped into the clip. Mishearings replace words; they do not repeat a phrase.
 */
export function repeatedPhrases(script, heard, n = LIMITS.phraseWords) {
  const count = (ws) => {
    const m = new Map();
    for (let k = 0; k + n <= ws.length; k++) {
      const g = ws.slice(k, k + n).join(' ');
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const want = count(keys(script));
  const got = count(keys(heard));
  return [...got].filter(([g, c]) => c >= 2 && c > (want.get(g) ?? 0)).map(([g]) => g);
}

/** Errors (cuts, leftover takes) and warnings (differs from the script: listen) for one measured clip. */
export function clipFindings({ id, script, heard, head, tail, dropped, words = [], unheard = [], gaps = [] }, limits = LIMITS) {
  const errors = [];
  const warnings = [];
  if (head > limits.head) errors.push(`${id}: starts inside a word (edge energy ${head.toFixed(2)})`);
  if (tail > limits.tail) errors.push(`${id}: stops inside a word (edge energy ${tail.toFixed(2)})`);
  if (dropped > limits.dropped) errors.push(`${id}: voice goes on after the part the video plays (${dropped.toFixed(2)})`);
  const repeats = repeatedPhrases(script, heard, limits.phraseWords);
  if (repeats.length) errors.push(`${id}: a take slipped in, «${repeats[0]}» is heard ${repeats.length > 1 ? 'several phrases ' : ''}twice`);
  // Voice the script does not account for: a half-said sentence glued to its retake (the import cannot tell,
  // because Whisper skipped it), found by the energy that no word covers and by words stretched over it.
  const scriptTokens = new Set(String(script ?? '').split(/\s+/).map((t) => t.replace(/[¿?¡!«»".,;:]/g, '')).filter((t) => SPELLED.test(t)));
  for (const w of words) {
    const len = w.end - w.start;
    const bare = w.text.replace(/[¿?¡!«»".,;:]/g, '');
    if (len > limits.longWordS && !SPELLED.test(bare) && !scriptTokens.has(bare.toUpperCase())) {
      errors.push(`${id}: «${bare}» lasts ${len.toFixed(1)} s from ${w.start.toFixed(1)} s: a half-said take is hiding in the clip (map it with recut_recording.py --map)`);
    }
  }
  for (const [at, len] of unheard) {
    if (len < limits.unheardS) continue;
    // Whisper writes a spoken number in figures («2022» for «dos mil veintidós») and ends that word early, so the
    // rest of the number shows up as voice nobody transcribed. Right after the figure and no longer than the figure
    // could take, it is the number itself: listen, do not block.
    const figure = words.find((w) => /\d/.test(w.text) && at >= w.end && at - w.end <= limits.figureGapS);
    const digits = figure ? figure.text.replace(/\D/g, '').length : 0;
    if (figure && len <= digits * limits.figureDigitS) {
      warnings.push(`${id}: ${len.toFixed(1)} s of voice right after «${figure.text.replace(/[¿?¡!«»".,;:]/g, '')}» at ${at.toFixed(1)} s: Whisper times figures short, so it is probably the number itself (listen if in doubt)`);
      continue;
    }
    errors.push(`${id}: ${len.toFixed(1)} s of voice at ${at.toFixed(1)} s that the transcript does not cover (a leftover take or a stray remark)`);
  }
  for (const [at, len] of gaps) {
    if (len >= limits.gapS) warnings.push(`${id}: a ${len.toFixed(1)} s silence at ${at.toFixed(1)} s inside the sentence: listen, it may be two takes glued together`);
  }
  const sim = similarity(script, heard);
  if (sim < limits.similarity) warnings.push(`${id}: heard «${heard}» (similarity ${sim.toFixed(2)}): listen, it may only be the ASR`);
  return { errors, warnings, similarity: Math.round(sim * 100) / 100 };
}

/** Whether a saved report still describes this timeline (the check must run again after any audio change). */
export function reportIsCurrent(report, timeline) {
  return Boolean(report) && report.sourceHash === timeline.sourceHash;
}

/** Markdown report. */
export function voiceReport({ slug, rows, errors, warnings }) {
  const lines = [
    `# Comprobación de la voz · ${slug}`,
    '',
    'Cada clip se transcribe tal como suena en el vídeo (solo la parte que se reproduce) y se mide la energía en sus bordes.',
    `Errores: ${errors.length} · avisos: ${warnings.length}.`,
    '',
    ...(errors.length ? ['## Errores (escuchar y arreglar antes del render)', '', ...errors.map((e) => `- ${e}`), ''] : []),
    ...(warnings.length ? ['## Avisos (probablemente solo el reconocimiento de voz)', '', ...warnings.map((w) => `- ${w}`), ''] : []),
    '## Clips',
    '',
    '| Clip | Similitud | Inicio | Final | Tras el corte | Oído |',
    '|---|---|---|---|---|---|',
    ...rows.map((r) => `| ${r.id} | ${r.similarity.toFixed(2)} | ${r.head.toFixed(2)} | ${r.tail.toFixed(2)} | ${r.dropped.toFixed(2)} | ${r.heard} |`),
    '',
  ];
  return lines.join('\n');
}
