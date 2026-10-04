/**
 * s01-hook «Todo encaja» — on-screen strings (canon: out/scene-brief.md). The whiteboard's own texts live in
 * scenes/parts/Whiteboard.tsx (WHITEBOARD_TEXT).
 */

/** The video's title (`lead` in cyan); `sub` mirrors the voice («ACH, el análisis de hipótesis en competencia»). */
export const S01_TITLE = {
  lead: 'ACH:',
  rest: 'gana la hipótesis que no puedes tumbar',
  sub: 'análisis de hipótesis en competencia',
} as const;

/**
 * The promise as the three PromiseIcons, each with a short label that mirrors the voice (invented wording, not
 * canon). `word` is the word of s01-03 the item lands on.
 */
export const S01_PROMISE = [
  { kind: 'list', text: 'escribe lo que das por hecho', word: 'Primero' },
  { kind: 'grid', text: 'hipótesis a competir en una matriz', word: 'Luego' },
  { kind: 'table', text: 'quita la prueba más fuerte', word: 'final' },
] as const;

/** The CISO strip (canon, exact). */
export const S01_CISO = {
  who: 'CISO',
  question: '¿Qué busca el intruso?',
  stakes: 'de eso depende qué se protege primero',
} as const;
