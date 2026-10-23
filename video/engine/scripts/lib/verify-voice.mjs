// Pure parts of verify-voice.mjs: what counts as a cut or a leftover take in a narration clip, and the report.
import { matchKey, similarity } from './recording.mjs';

/** Relative energies (to the played part's RMS) above which a clip edge is cut inside the voice. */
export const LIMITS = Object.freeze({
  head: 0.35,
  tail: 0.35,
  dropped: 0.15,
  similarity: 0.75,
  phraseWords: 3,
  extraWords: 2, // a leftover take adds at least this many words to what the script says
  longWordS: 1.3, // a spoken word never lasts this long: Whisper stretched it over a take it did not transcribe
  unheardS: 0.4, // voice, longer than this, that no word of the transcript covers
  figureGapS: 0.3, // …unless it starts this close to the end of a number written in figures
  figureDigitS: 0.25, // …and lasts no longer than this per digit of that figure
  percentS: 0.7, // …plus this when the figure is followed by «%» («por ciento» is spoken after it)
  gapS: 0.6, // a silence this long inside a sentence: a pause that was not cut, or two takes
});

/** Words that may last long: spelled acronyms and numbers read letter by letter or digit by digit. */
const SPELLED = /^[A-Z0-9][A-Z0-9.,\-]*$/;

// «50.000 €» in the script is heard as «50.000 euros»: compare the spoken form, or «euros al año» in two
// sentences of one clip would look like a take that slipped in.
const keys = (text) => String(text ?? '').replace(/€/g, ' euros ').split(/\s+/).map(matchKey).filter(Boolean);

/**
 * Phrases of `n` words heard more often than the script says them, at least twice: the mark of a take that
 * slipped into the clip. Mishearings replace words; they do not repeat a phrase. A slipped take also adds words,
 * so a clip heard with about as many words as the script has none, however the ASR wrote a repeated word
 * («un token de acceso… un token de renovación» heard as «un toque de… un toque de»: AP01 s08-01).
 */
export function repeatedPhrases(script, heard, n = LIMITS.phraseWords) {
  if (keys(heard).length - keys(script).length < LIMITS.extraWords) return [];
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

/**
 * The first one or two words of the script when the clip is heard from the following ones: the first word does
 * not match, and the next three heard words match the script's words after the skipped ones. That shape is a clip
 * that lost its opening («Empezamos con un caso» heard as «Con un caso…», documentos s02-01); the ASR garbling a
 * word does not shift the whole sentence by one. Needs enough words to be sure.
 * @returns {{skipped: number, words: string} | null}
 */
export function missingOpening(script, heard, { first = 0.6, rest = 0.8, minScriptWords = 6 } = {}) {
  const scriptWords = String(script ?? '').split(/\s+/).filter((w) => matchKey(w));
  const heardWords = String(heard ?? '').split(/\s+/).filter((w) => matchKey(w));
  if (scriptWords.length < minScriptWords || heardWords.length < 3) return null;
  if (similarity(heardWords[0], scriptWords[0]) >= first) return null;
  for (const skipped of [1, 2]) {
    const fits = [0, 1, 2].every((i) => similarity(heardWords[i], scriptWords[skipped + i] ?? '') >= rest);
    if (fits) return { skipped, words: scriptWords.slice(0, skipped).join(' ').replace(/[¿?¡!«»".,;:]/g, '') };
  }
  return null;
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
    // Whisper glues the two words of a name («PaperGovernor») into one token: each extra capitalised part
    // is another word, so it may last longer before it looks like a stretched half-said take.
    const caseParts = (bare.match(/[A-ZÁÉÍÓÚÑ][a-záéíóúñü]*|[a-záéíóúñü]+/g) ?? []).length;
    // …or in lower case («hash criptográfico» written «Hascriptográfico»): it is as long as the script words it glues.
    const scriptWords = String(script ?? '').split(/\s+/).filter(Boolean);
    let glued = 1;
    for (const n of [2, 3]) {
      for (let k = 0; k + n <= scriptWords.length; k++) if (similarity(scriptWords.slice(k, k + n).join(' '), bare) >= 0.85) glued = Math.max(glued, n);
    }
    const parts = Math.max(caseParts, glued);
    const allowed = limits.longWordS * (1 + 0.6 * Math.max(0, parts - 1));
    if (len > allowed && !SPELLED.test(bare) && !scriptTokens.has(bare.toUpperCase())) {
      errors.push(`${id}: «${bare}» lasts ${len.toFixed(1)} s from ${w.start.toFixed(1)} s: a half-said take is hiding in the clip (map it with recut_recording.py --map)`);
    }
  }
  for (const [at, len] of unheard) {
    if (len < limits.unheardS) continue;
    // Whisper writes a spoken number in figures («2022» for «dos mil veintidós») and ends that word early, so the
    // rest of the number shows up as voice nobody transcribed. Right after the figure and no longer than the figure
    // could take, it is the number itself: listen, do not block.
    // «95 %» or «95%»: «por ciento» is spoken after the figure, so a percent sign makes the figure last longer.
    const extra = (w) => (w.text.includes('%') ? limits.percentS : 0);
    const at_ = words.findIndex((w) => (/\d/.test(w.text) || /^%/.test(w.text)) && at >= w.end && at - w.end <= limits.figureGapS + extra(w));
    const figure = at_ >= 0 ? words[at_] : undefined;
    const digits = figure ? (/^%/.test(figure.text) ? words[at_ - 1]?.text ?? '' : figure.text).replace(/\D/g, '').length : 0;
    if (figure && len <= digits * limits.figureDigitS + extra(figure)) {
      warnings.push(`${id}: ${len.toFixed(1)} s of voice right after «${figure.text.replace(/[¿?¡!«»".,;:]/g, '')}» at ${at.toFixed(1)} s: Whisper times figures short, so it is probably the number itself (listen if in doubt)`);
      continue;
    }
    errors.push(`${id}: ${len.toFixed(1)} s of voice at ${at.toFixed(1)} s that the transcript does not cover (a leftover take or a stray remark)`);
  }
  for (const [at, len] of gaps) {
    if (len >= limits.gapS) warnings.push(`${id}: a ${len.toFixed(1)} s silence at ${at.toFixed(1)} s inside the sentence: listen, it may be two takes glued together`);
  }
  const lost = missingOpening(script, heard);
  if (lost) {
    warnings.push(`${id}: the clip seems to start at its ${lost.skipped + 1}${lost.skipped === 1 ? 'nd' : 'rd'} word, «${lost.words}» is not heard: listen; if the first words were cut, rebuild the clip from the take (recut_recording.py)`);
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
