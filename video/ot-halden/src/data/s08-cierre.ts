/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha (the
 * voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`; lines the
 * voice does not say light with the card). Lines ≤ 29 characters at 32 px (the card is 560 px wide).
 */

export type RuleArt = 'trucks' | 'clock' | 'part';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment); none = with the card. */
  word?: string;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: string;
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // Voice: «En lo que mueve cosas físicas, la alta disponibilidad se diseña.»
  {
    art: 'trucks',
    seg: 's08-01',
    title: 'Que no se pare',
    sub: [
      { text: 'Primero, que no se pare;' },
      { text: 'después, que nadie cambie' },
      { text: 'una orden; al final, el secreto' },
      { text: 'La alta disponibilidad se', word: 'alta', strong: true },
      { text: 'diseña duplicando lo que', word: 'diseña', strong: true },
      { text: 'no puede fallar', strong: true },
    ],
  },
  // Voice: «Estar en marcha es availability, y llegar a tiempo, responsiveness.»
  {
    art: 'clock',
    seg: 's08-02',
    title: 'A tiempo',
    sub: [
      { text: 'Estar en marcha es', word: 'marcha' },
      { text: 'availability;', word: 'availability', strong: true },
      { text: 'responder a tiempo es', word: 'tiempo' },
      { text: 'responsiveness', word: 'responsiveness', strong: true },
      { text: 'Lo que cabe en el aparato:' },
      { text: 'compute y power' },
    ],
  },
  // Voice: «Y lo que no se puede parchear, se compensa.»
  {
    art: 'part',
    seg: 's08-03',
    title: 'Hay parche, se puede',
    sub: [
      { text: 'Patch availability pregunta' },
      { text: 'si hay parches;' },
      { text: 'inability to patch, si se' },
      { text: 'pueden poner' },
      { text: 'Lo que no se puede parchear,', word: 'parchear' },
      { text: 'se compensa', word: 'compensa', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`, in three beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Primero, que no se pare;', word: 'Primero', tone: 'cyan' },
  { text: 'después, que llegue a tiempo;', word: 'Después', tone: 'amber' },
  { text: 'y al parche, dos preguntas: ¿hay? ¿se puede poner?', word: 'parche', tone: 'violet' },
] as const;

/** The one next step (the voice says «Y ahora, tu turno, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['En marcha, a tiempo', 'y con parche'],
  objective: 'Security+ SY0-701 · objetivo 3.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
