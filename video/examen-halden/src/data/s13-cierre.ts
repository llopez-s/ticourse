/**
 * s13-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the voice's own
 * words (`word`, in the rule's segment `seg`). Titles are one line (<= 14 characters), sub lines <= 28 characters at 32 px.
 */
export type RuleArt = 'options' | 'columns' | 'crossword';

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
  // «Primero, qué te piden. Tacha lo que no responde a eso y quédate con la que encaja con todo el caso.»
  {
    art: 'options',
    seg: 's13-01',
    title: 'Qué te piden',
    sub: [
      { text: 'Tacha lo que no responde', word: 'Tacha', strong: true },
      { text: 'y quédate con la que encaja', word: 'quédate', strong: true },
      { text: 'con todo el caso', word: 'todo' },
    ],
  },
  // «Entre dos que sirven, la práctica estándar antes que la ocurrencia.»
  {
    art: 'columns',
    seg: 's13-02',
    title: 'Lo estándar',
    sub: [
      { text: 'Entre dos que sirven,', word: 'sirven', strong: true },
      { text: 'la práctica estándar', word: 'práctica', strong: true },
      { text: 'antes que la ocurrencia', word: 'antes' },
    ],
  },
  // «Marca y salta las simulaciones, y no dejes nada en blanco.»
  {
    art: 'crossword',
    seg: 's13-03',
    title: 'Marca y vuelve',
    sub: [
      { text: 'Marca y salta', word: 'salta', strong: true },
      { text: 'las simulaciones,', word: 'simulaciones', strong: true },
      { text: 'y no dejes nada en blanco', word: 'dejes' },
    ],
  },
];

/** The exam phrase on `phrase`, in three parts lit on their words of segment s13-04. */
export const PHRASE = {
  lead: 'Lee ',
  ask: 'qué te piden',
  strike: ', tacha lo que no encaja',
  end: 'y deja lo difícil para el final',
} as const;

/** The one next step (the voice says «Tu turno. Hazte un simulacro cronometrado.»; the app's /exam). */
export const NEXT = 'Tu turno: un simulacro de 90 preguntas y 90 minutos';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Del puerto al examen', 'cómo se contesta'],
  objective: 'Security+ SY0-701',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
