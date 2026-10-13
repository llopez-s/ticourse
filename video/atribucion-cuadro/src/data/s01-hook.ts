/** s01-hook «Un nombre para el informe» — on-screen strings (canon: out/scene-brief.md, storyboard goal). */

/** V13's labels beside the diamond. */
export const S01_WHERE = { org: 'Meridian Dynamics', sector: 'aeroespacial', you: 'tú, su analista de inteligencia' } as const;

export const S01_TITLE = { lead: 'Atribución:', rest: '¿quién fue?', sub: 'tres niveles, pistas falsas y cuándo vale la pena' } as const;

/** The promise as three chips; each lights on `word` of s01-02. */
export const S01_PROMISE = [
  { text: 'hasta dónde puedes llegar', word: 'hasta' },
  { text: 'qué pista pesa de verdad', word: 'qué' },
  { text: 'si hace falta un nombre', word: 'si' },
] as const;
