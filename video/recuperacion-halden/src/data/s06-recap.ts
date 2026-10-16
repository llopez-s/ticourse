/**
 * s06-recap «Tres reglas» — on-screen strings. Each rule card lights on its cue and its lines on the voice's own
 * words (`word`, in the rule's segment `seg`); titles are two hard lines (≤ 15 characters), sub lines ≤ 27
 * characters at 32 px. `{t}` in a line is replaced by its exam term (`term`), drawn in violet.
 */

export type RuleArt = 'theatre' | 'steps' | 'umbrella';

export interface RecapLine {
  text: string;
  term?: string;
  /** The line lights when the voice says this word (in the rule's segment)… */
  word?: string;
  nth?: number;
  /** …or, for a line that is on screen only, this many frames after the previous line. */
  after?: number;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: readonly [string, string];
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Eliges el sitio por lo que ya tiene montado, y lo bastante lejos.»
  {
    art: 'theatre',
    seg: 's06-01',
    title: ['Elige el sitio', 'por lo montado'],
    sub: [
      { text: '{t}', term: 'hot · warm · cold', word: 'montado' },
      { text: 'y lo bastante lejos', word: 'lejos', strong: true },
    ],
  },
  // «Segunda, cada prueba demuestra una cosa, y solo el fail over, el cambio.»
  {
    art: 'steps',
    seg: 's06-02',
    title: ['Cada prueba,', 'una cosa'],
    sub: [
      { text: 'solo el {t}', term: 'fail over', word: 'fail', strong: true },
      { text: 'prueba el cambio', word: 'cambio' },
    ],
  },
  // «Y tercera, una copia sin restaurar no es una copia.»
  {
    art: 'umbrella',
    seg: 's06-03',
    title: ['Copia sin', 'restaurar'],
    sub: [
      { text: 'no es una copia', word: 'es', strong: true },
      { text: 'se prueba antes', after: 16 },
    ],
  },
];

/** The one next step (the voice says «Tu turno, el laboratorio Continuity Ladder»). */
export const NEXT = 'Tu turno: el laboratorio Continuity Ladder';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Recuperación ante desastres', 'sitios, pruebas y copias'],
  objective: 'Security+ SY0-701 · objetivo 3.4',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
