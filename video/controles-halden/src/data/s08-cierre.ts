/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Titles are one line (≤ 14 characters), sub lines
 * ≤ 24 characters at 32 px (the card is 560 px wide). Exam terms in English, capitalised as in the rest of the video.
 */

export type RuleArt = 'tag' | 'camera' | 'recipe';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  nth?: number;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: string;
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «La primera, la categoría es quién o qué lo hace funcionar.»
  {
    art: 'tag',
    seg: 's08-01',
    title: 'La categoría',
    sub: [
      { text: 'quién o qué', word: 'quién', strong: true },
      { text: 'lo hace funcionar', word: 'funcionar', strong: true },
    ],
  },
  // «La segunda, el tipo es lo que hace en ese caso.»
  {
    art: 'camera',
    seg: 's08-02',
    title: 'El tipo',
    sub: [
      { text: 'lo que hace', word: 'hace', strong: true },
      { text: 'en ese caso', word: 'caso', strong: true },
    ],
  },
  // «Y la tercera, compensating va en lugar de lo que no se puede poner.»
  {
    art: 'recipe',
    seg: 's08-03',
    title: 'Compensating',
    sub: [
      { text: 'en lugar de lo que', word: 'lugar', strong: true },
      { text: 'no se puede poner', word: 'poner', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`: lead (white), the category question (cyan), the joiner, the type question (violet). */
export const PHRASE = {
  lead: 'Antes de contestar, pregúntate',
  who: 'quién lo hace funcionar',
  and: ' y ',
  what: 'qué hace en ese caso',
} as const;

/** The one next step (the voice says «Y ahora te toca a ti. A por las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Un control, dos etiquetas', 'categoría y tipo'],
  objective: 'Security+ SY0-701 · objetivo 1.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;

/** The lock's completed tag (as on s04's `both`), drawn on the end card and the poster. */
export const LOCK_TAG = { top: 'Physical', bottom: 'Preventive' } as const;
