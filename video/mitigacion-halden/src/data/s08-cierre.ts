/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Sub lines ≤ 26 characters at 32 px (the card is ~560 px
 * wide). Exam terms in English, as in the rest of the video.
 */

export type RuleArt = 'plant' | 'coat' | 'gym';

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
  // «Busca qué falló, y si hay dos fallos, manda el de la pregunta.»
  {
    art: 'plant',
    seg: 's08-01',
    title: 'Busca qué falló',
    sub: [
      { text: 'cada técnica responde', word: 'busca' },
      { text: 'a un verbo', word: 'busca' },
      { text: 'si el caso trae dos,', word: 'dos', strong: true },
      { text: 'manda el de la pregunta', word: 'manda', strong: true },
    ],
  },
  // «Lejos de la red, te protege lo que va en el equipo.»
  {
    art: 'coat',
    seg: 's08-02',
    title: 'Lejos de la red',
    sub: [
      { text: 'te protege lo que va', word: 'protege', strong: true },
      { text: 'en el equipo', word: 'equipo', strong: true },
    ],
  },
  // «Y si sobra, no se parchea, se quita.»
  {
    art: 'gym',
    seg: 's08-03',
    title: 'Si sobra, se quita',
    sub: [
      { text: 'lo que hace falta', word: 'si' },
      { text: 'se parchea', word: 'si' },
      { text: 'lo que sobra, se quita', word: 'quita', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`, in two lines, each lit on its words. */
export const PHRASE = {
  lead: { text: 'Antes de contestar, pregúntate', word: 'contestar' },
  ask: { text: 'qué falló, dónde y si hace falta', word: 'falló' },
} as const;

/** The one next step (the voice says «vamos a por las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Mitigación y hardening', 'la técnica que ataca la causa'],
  objective: 'Security+ SY0-701 · objetivo 2.5',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
