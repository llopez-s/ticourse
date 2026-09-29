// Pure parts of verify-voice.mjs: what counts as a cut or a leftover take in a narration clip, and the report.
import { matchKey, similarity } from './recording.mjs';

/** Relative energies (to the played part's RMS) above which a clip edge is cut inside the voice. */
export const LIMITS = Object.freeze({ head: 0.35, tail: 0.35, dropped: 0.15, similarity: 0.75, phraseWords: 3 });

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
export function clipFindings({ id, script, heard, head, tail, dropped }, limits = LIMITS) {
  const errors = [];
  const warnings = [];
  if (head > limits.head) errors.push(`${id}: starts inside a word (edge energy ${head.toFixed(2)})`);
  if (tail > limits.tail) errors.push(`${id}: stops inside a word (edge energy ${tail.toFixed(2)})`);
  if (dropped > limits.dropped) errors.push(`${id}: voice goes on after the part the video plays (${dropped.toFixed(2)})`);
  const repeats = repeatedPhrases(script, heard, limits.phraseWords);
  if (repeats.length) errors.push(`${id}: a take slipped in, «${repeats[0]}» is heard ${repeats.length > 1 ? 'several phrases ' : ''}twice`);
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
