/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the voice's
 * own words (`word`, in the rule's segment `seg`), or a beat after the line before when the voice does not say them.
 * Titles one line (≤ 16 characters), sub lines ≤ 30 characters at 32 px (the card is 560 px wide). Exam terms in English.
 */

export type RuleArt = 'consulta' | 'casa' | 'tienda';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment); without it, after the line before. */
  word?: string;
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
  // «Con cuenta se lee lo de dentro, y sin cuenta, lo que ve cualquiera.»
  {
    art: 'consulta',
    seg: 's08-01',
    title: 'Las máquinas',
    sub: [
      { text: 'con cuenta, lee lo de dentro', word: 'dentro', strong: true },
      { text: 'sin cuenta, lo que ve cualquiera', word: 'cualquiera', strong: true },
      { text: 'con agente, aunque esté fuera' },
    ],
  },
  // «SAST necesita el código, y DAST, solo la aplicación en marcha.»
  {
    art: 'casa',
    seg: 's08-02',
    title: 'Las aplicaciones',
    sub: [
      { text: 'SAST necesita el código', word: 'código', strong: true },
      { text: 'y llega antes' },
      { text: 'DAST, la aplicación en marcha', word: 'marcha', strong: true },
    ],
  },
  // «Y lo que pasa fuera de casa te lo cuentan otros.»
  {
    art: 'tienda',
    seg: 's08-03',
    title: 'Lo de fuera',
    sub: [
      { text: 'te lo cuentan otros', word: 'otros', strong: true },
      { text: 'el sector, en un ISAC' },
      { text: 'lo tuyo a la venta: dark web' },
    ],
  },
];

/** The exam phrase on `phrase`: lead (white), what the method can see (cyan), and what it cannot (amber). */
export const PHRASE = {
  lead: 'Antes de elegir, pregúntate',
  see: 'qué puede ver ese método',
  and: ' y ',
  not: 'qué no',
} as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Encontrar vulnerabilidades', 'qué ve cada método'],
  objective: 'Security+ SY0-701 · objetivo 4.3',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
