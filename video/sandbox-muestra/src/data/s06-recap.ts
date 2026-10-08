/**
 * s06-recap «Tres reglas»: on-screen text (canon: out/scene-brief.md, «Canon strings» → s06). Each rule is the brief's
 * string split at its « · »: the part before is the card title (hard-broken into two lines), the part after is the
 * subtitle. The words are the narration's.
 */
export const S06_RULES = [
  // «no se sube a la ligera · primero, su hash»
  { title: ['no se sube', 'a la ligera'] as const, sub: 'primero, su hash' },
  // «lo que Windows hace solo es ruido · sepáralo antes de bloquear»
  { title: ['lo que Windows', 'hace solo es ruido'] as const, sub: 'sepáralo antes de bloquear' },
  // «parientes: imphash, ssdeep y la ruta del PDB · la fecha de compilación, no»
  { title: ['parientes: imphash,', 'ssdeep y la ruta del PDB'] as const, sub: 'la fecha de compilación, no' },
] as const;

/** The one next action: the lesson's questions (no lab: none of S3 practises s3m2). */
export const S06_NEXT = { text: 'Tu turno: las preguntas de la lección', chip: 's3m2 · 10 preguntas' } as const;

export const S06_END = {
  title: 'Lo que cuenta una muestra',
  sub: 'triaje de malware en sandbox',
  objective: 'GIAC GCTI · Collection',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
