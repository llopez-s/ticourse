/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Titles are one line (≤ 14 characters), sub lines
 * ≤ 24 characters at 32 px (the card is 560 px wide). Exam terms in English, as in the rest of the video.
 */

export type RuleArt = 'shop' | 'remotes' | 'plane';

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
  // «Una, el baseline se escribe, se impone y se vigila. Si algo se aparta, vuelve la máquina o cambia el papel.»
  {
    art: 'shop',
    seg: 's08-01',
    title: 'El baseline',
    sub: [
      { text: 'se escribe, se impone', word: 'escribe', strong: true },
      { text: 'y se vigila', word: 'vigila', strong: true },
      { text: 'vuelve o cambia el papel', word: 'vuelve' },
    ],
  },
  // «Dos, cada sistema obedece a su mando.»
  {
    art: 'remotes',
    seg: 's08-02',
    title: 'Su mando',
    sub: [
      { text: 'cada sistema obedece', word: 'obedece', strong: true },
      { text: 'a su mando', word: 'mando', strong: true },
    ],
  },
  // «Y tres, lo que no se puede parar se compensa mientras no se pueda parchear.»
  {
    art: 'plane',
    seg: 's08-02',
    title: 'Lo que no para',
    sub: [
      { text: 'se compensa mientras', word: 'compensa', strong: true },
      { text: 'no se pueda parchear', word: 'parchear', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`: lead (white), the verb question (violet), the joiner, the system question (cyan). */
export const PHRASE = {
  lead: 'Antes de contestar, pregúntate',
  verb: 'en qué verbo estás',
  and: ' y ',
  system: 'qué admite ese sistema',
} as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Baseline y hardening', 'imponer, mantener y compensar'],
  objective: 'Security+ SY0-701 · objetivo 4.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
