/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha
 * (the voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`;
 * lines the voice does not say light with the card). Lines ≤ 29 characters at 32 px (the card is 560 px wide).
 */

export type RuleArt = 'plan' | 'rooms' | 'decoys';

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
  // Voice: «Una, cada control tapa un hueco. Los bollards frenan coches y el badge apunta quién entra.»
  {
    art: 'plan',
    seg: 's08-01',
    title: 'Controles',
    sub: [
      { text: 'Cada control tapa un hueco.', strong: true },
      { text: 'Los bollards frenan', word: 'bollards' },
      { text: 'vehículos, el vestíbulo deja' },
      { text: 'pasar de uno en uno, y el' },
      { text: 'access badge decide quién', word: 'badge' },
      { text: 'abre qué y lo deja apuntado.', word: 'apunta' },
    ],
  },
  // Voice: «Dos, un sensor se elige por dónde falla. El de radio cruza tabiques y el de sonido no.»
  {
    art: 'rooms',
    seg: 's08-02',
    title: 'Sensores',
    sub: [
      { text: 'Un sensor se elige por dónde', strong: true },
      { text: 'falla. El de radio atraviesa', word: 'radio', strong: true },
      { text: 'un tabique fino y el de', word: 'tabiques' },
      { text: 'sonido no; el de calor se', word: 'sonido' },
      { text: 'confunde con el sol, y el de' },
      { text: 'peso solo cubre donde pisas.' },
    ],
  },
  // Voice: «Y tres, un cebo parte de que ya hay alguien dentro, y cualquier toque avisa.»
  {
    art: 'decoys',
    seg: 's08-03',
    title: 'Cebos',
    sub: [
      { text: 'Un cebo parte de que ya hay', strong: true },
      { text: 'alguien dentro. Se llama', word: 'dentro', strong: true },
      { text: 'por lo que ofrece, un' },
      { text: 'sistema, una red, un fichero' },
      { text: 'o un dato, y cualquier', word: 'cualquier' },
      { text: 'toque avisa.', word: 'avisa', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`, in two beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Cada cosa tapa un hueco', word: 'Cada', tone: 'cyan' },
  { text: 'y falla por algún sitio', word: 'falla', tone: 'amber' },
] as const;

/** The one next step (the voice says «Tu turno, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  objective: 'Security+ SY0-701 · objetivo 1.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
