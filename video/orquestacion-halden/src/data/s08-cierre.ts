/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Titles are one line (≤ 14 characters), sub lines
 * ≤ 26 characters at 32 px (the card is 560 px wide). Exam terms in English, as in the rest of the video.
 */

export type RuleArt = 'lights' | 'bell' | 'central';

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
  // «Una tarea sola es automation, y el flujo, orchestration.»
  {
    art: 'lights',
    seg: 's08-01',
    title: 'Tarea o flujo',
    sub: [
      { text: 'una tarea: automation', word: 'automation', strong: true },
      { text: 'el flujo: orchestration', word: 'orchestration', strong: true },
    ],
  },
  // «Ticket creation apunta, y escalation sube lo que nadie coge.»
  {
    art: 'bell',
    seg: 's08-02',
    title: 'Apunta o sube',
    sub: [
      { text: 'ticket creation apunta', word: 'apunta', strong: true },
      { text: 'escalation sube', word: 'sube', strong: true },
      { text: 'lo que nadie coge', word: 'coge' },
    ],
  },
  // «La plataforma es un single point of failure. Y complexity no es abandono.»
  {
    art: 'central',
    seg: 's08-03',
    title: 'La plataforma',
    sub: [
      { text: 'single point of failure', word: 'single', strong: true },
      { text: 'complexity no es abandono', word: 'abandono', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`: lead (white), the task-or-flow question (violet), the step question (cyan). */
export const PHRASE = {
  lead: 'Antes de contestar, pregúntate',
  flow: 'si es una tarea o un flujo,',
  step: 'y qué hace ese paso en ese momento',
} as const;

/** The one next step (the voice says «Ahora te toca a ti. A por las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Una tarea o un flujo', 'automatizar y orquestar'],
  objective: 'Security+ SY0-701 · objetivo 4.7',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
