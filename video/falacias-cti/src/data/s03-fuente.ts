/** Lesson literals (src/data/s4.ts). The vendor and group names are the lesson's own example text, on screen only. */
export const NOTE_1 = {
  /** s4.ts:206, without «caso cerrado» (the canon vetoes it). */
  sentence: 'VendorCo lo atribuye a APT-Z',
  vendor: 'VendorCo',
  /** s4.ts:205. */
  structure: ['Lo dice X,', 'luego es verdad'],
  who: 'quién lo dice',
  proofs: 'qué pruebas trae',
  whoText: 'VendorCo',
} as const;

export const NOTE_2 = {
  /** s4.ts:211. */
  sentence: ['Ese informe viene de un vendor', 'pequeño, ignóralo'],
  aside: 'la evidencia era buena',
  who: 'quién lo dice',
  proofs: 'qué pruebas trae',
  whoText: 'un vendor pequeño',
} as const;

export const SOURCE_RULE = 'la fuente no es la prueba';
export const SHEET_TAG = 'frases de ejemplo de la lección';

/** s4.ts:243, near-literal. */
export const PHRASES = {
  a: 'Viene de un vendor con historial de exageración, así que revisemos su evidencia con lupa',
  b: 'Viene de ese vendor, luego es falso',
} as const;

export const ANSWER = {
  a: ['rigor', 'revisa sus pruebas con lupa'],
  b: ['falacia', 'la identidad sustituye a la evaluación'],
} as const;
