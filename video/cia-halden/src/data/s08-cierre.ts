/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha (the
 * voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`; lines the
 * voice does not say light with the card). Lines ≤ 29 characters at 32 px (the card is 560 px wide).
 */

export type RuleArt = 'sheet' | 'doors' | 'kit';

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
  // Voice: «Una, traduce el caso a lo que se rompe. Se lee, se cambia o no se puede usar.»
  {
    art: 'sheet',
    seg: 's08-01',
    title: 'Lo que se rompe',
    sub: [
      { text: 'se lee: confidentiality', word: 'lee', strong: true },
      { text: 'se cambia: integrity', word: 'cambia', strong: true },
      { text: 'no se puede usar:', word: 'usar' },
      { text: 'availability', word: 'usar', strong: true },
      { text: 'negarlo: non-repudiation' },
      { text: 'lo da la firma digital' },
    ],
  },
  // Voice: «Dos, las tres A van en orden. Quién eres, qué puedes y qué hiciste.»
  {
    art: 'doors',
    seg: 's08-02',
    title: 'Las tres A, en orden',
    sub: [
      { text: 'quién eres: authentication', word: 'eres', strong: true },
      { text: 'qué puedes: authorization', word: 'puedes', strong: true },
      { text: 'qué hiciste: accounting', word: 'hiciste', strong: true },
      { text: 'role-based: va con el puesto' },
      { text: 'attribute-based: varias' },
      { text: 'cosas a la vez' },
    ],
  },
  // Voice: «Y tres, el gap analysis compara lo que tienes con lo que pide el marco.»
  {
    art: 'kit',
    seg: 's08-03',
    title: 'Cuánto falta',
    sub: [
      { text: 'gap analysis: lo que tienes', word: 'tienes', strong: true },
      { text: 'frente a lo que pide el marco', word: 'pide', strong: true },
      { text: 'está · a medias · falta' },
      { text: 'y acaba en un plan' },
      { text: 'con prioridades' },
    ],
  },
];

/** The exam phrase on `phrase`, in three beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Busca qué se ha roto,', word: 'Busca', tone: 'cyan' },
  { text: 'qué se está preguntando', word: 'está', tone: 'amber' },
  { text: 'y cuánto falta', word: 'cuánto', tone: 'violet' },
] as const;

/** The one next step (the voice says «Ahora, tu turno, con las preguntas»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Qué se rompe, quién toca', 'y cuánto falta'],
  objective: 'Security+ SY0-701 · objetivo 1.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
