/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Sub lines ≤ 26 characters at 32 px (the card is ~560 px
 * wide). Exam terms in English, as in the rest of the video.
 */

export type RuleArt = 'pockets' | 'watch' | 'cloakroom';

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
  // «Un vector es un camino, y la superficie, todos.»
  {
    art: 'pockets',
    seg: 's08-01',
    title: 'Un camino o todos',
    sub: [
      { text: 'vector: un camino', word: 'camino', strong: true },
      { text: 'superficie: todos', word: 'todos', strong: true },
      { text: 'cuenta caminos, no fallos', word: 'todos' },
    ],
  },
  // «El vector se nombra por el camino, no por el cebo.»
  {
    art: 'watch',
    seg: 's08-02',
    title: 'Camino, no cebo',
    sub: [
      { text: 'se nombra por el camino', word: 'nombra', strong: true },
      { text: 'que llegó a tu equipo', word: 'camino' },
      { text: 'no por el cebo', word: 'cebo', strong: true },
    ],
  },
  // «Y si entran por un tercero de confianza que ya tenía acceso, es supply chain.»
  {
    art: 'cloakroom',
    seg: 's08-03',
    title: 'Supply chain',
    sub: [
      { text: 'tercero de confianza', word: 'tercero', strong: true },
      { text: 'que ya tenía acceso', word: 'acceso' },
      { text: 'aunque lo engañaran', word: 'supply' },
      { text: 'con un correo', word: 'supply' },
    ],
  },
];

/** The exam phrase on `phrase`: the surface (cyan), the vector (violet). */
export const PHRASE = {
  surface: 'Para la superficie, cuenta caminos;',
  vector: 'para el vector, pregúntate por dónde llegó hasta ti',
} as const;

/** The one next step (the voice says «Ahora es tu turno, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Un camino o todos', 'vector y superficie de ataque'],
  objective: 'Security+ SY0-701 · objetivo 2.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
