/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Titles are one line (≤ 14 characters), sub lines
 * ≤ 26 characters at 32 px (the card is 560 px wide). Exam terms in English, as in the rest of the video.
 */

export type RuleArt = 'classroom' | 'suitcase' | 'car';

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
  // «Lo que no está en la lista no se protege.»
  {
    art: 'classroom',
    seg: 's08-01',
    title: 'La lista',
    sub: [
      { text: 'lo que no está en ella', word: 'lista' },
      { text: 'no se protege', word: 'protege', strong: true },
    ],
  },
  // «Cada activo tiene quien responde de él y una clasificación que decide su trato.»
  {
    art: 'suitcase',
    seg: 's08-02',
    title: 'Quién y cómo',
    sub: [
      { text: 'owner: quien responde', word: 'responde', strong: true },
      { text: 'classification: su trato', word: 'trato', strong: true },
    ],
  },
  // «Y al retirarlo, si sigue sirviendo y se deja borrar, se borra a fondo. Si no, se destruye, siempre con su papel.»
  {
    art: 'car',
    seg: 's08-03',
    title: 'La retirada',
    sub: [
      { text: 'sirve: sanitization', word: 'sirviendo', strong: true },
      { text: 'si no: destruction', word: 'destruye', strong: true },
      { text: 'siempre con su papel', word: 'papel' },
    ],
  },
];

/** The exam phrase on `phrase`: lead (white), then the three questions, each lit on its word in s08-04. */
export const PHRASE = {
  lead: 'Para cada activo, tres preguntas:',
  questions: [
    { text: '¿está en la lista?', word: 'lista' },
    { text: '¿quién responde de él?', word: 'responde' },
    { text: '¿adónde va cuando se retira?', word: 'adónde' },
  ],
} as const;

/** The one next step (the voice says «Y ahora, a por las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['De la lista al desguace', 'la vida de un activo'],
  objective: 'Security+ SY0-701 · objetivo 4.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
