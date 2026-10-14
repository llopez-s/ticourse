/**
 * s06-recap «Tres reglas» — on-screen strings. Each rule card lights on the voice's own words (`word`, in the rule's
 * segment `seg`); titles are two hard lines (≤ 16 characters), sub lines ≤ 27 characters at 32 px.
 */

export type RuleArt = 'phone' | 'calendar' | 'bars';

export interface RecapLine {
  text: string;
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
  // «Primera, un evento no se lo lleva todo, y el EF es un porcentaje.»
  {
    art: 'phone',
    seg: 's06-01',
    title: ['Un evento no', 'se lo lleva todo'],
    sub: [
      { text: 'el EF es un porcentaje', word: 'porcentaje', strong: true },
      { text: 'SLE = AV × EF', after: 20 },
    ],
  },
  // «Segunda, al año multiplicas por el ARO, que son veces al año, y hacia atrás divides.»
  {
    art: 'calendar',
    seg: 's06-02',
    title: ['Al año,', 'por el ARO'],
    sub: [
      { text: 'ALE = SLE × ARO', word: 'multiplicas', strong: true },
      { text: 'ARO: veces al año', word: 'veces' },
      { text: 'hacia atrás, divides', word: 'atrás' },
    ],
  },
  // «Y tercera, la ALE se compara con lo que cuesta el control al año. Si no sale, hace falta otra razón.»
  {
    art: 'bars',
    seg: 's06-03',
    title: ['La ALE contra', 'el control'],
    sub: [
      { text: 'se compara cada año', word: 'compara', strong: true },
      { text: 'si no sale, otra razón', word: 'razón' },
    ],
  },
];

/** The one next step (the voice says «tu turno, el laboratorio Risk Math»). */
export const NEXT = 'Tu turno: Risk Math';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Riesgo en euros:', 'de un evento al año'],
  objective: 'Security+ SY0-701 · objetivo 5.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;

/** The ten-year calendar's five marked years (uneven, «esperados, no fijos»), as in s03. */
export const CALENDAR_MARKS = [1, 2, 5, 7, 9] as const;
