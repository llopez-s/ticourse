/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha
 * (the voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`;
 * lines the voice does not say light with the card). Lines ≤ 29 characters at 32 px (the card is 560 px wide).
 */

export type RuleArt = 'request' | 'service' | 'closed';

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
  // Voice: «Tres reglas. Una, antes de que firme el comité hacen falta impacto, pruebas y plan de vuelta atrás.»
  {
    art: 'request',
    seg: 's08-01',
    title: 'Antes',
    sub: [
      { text: 'Antes de que el comité firme', word: 'comité', strong: true },
      { text: 'hacen falta tres cosas. El', word: 'hacen', strong: true },
      { text: 'análisis de impacto, las', word: 'impacto' },
      { text: 'pruebas y el plan de vuelta', word: 'pruebas' },
      { text: 'atrás. Y si algo falla en la', word: 'atrás' },
      { text: 'ventana, se vuelve atrás' },
      { text: 'antes que retocar.' },
    ],
  },
  // Voice: «Dos, pregunta quién más lo usa, y a las listas entra solo lo que el cambio necesita.»
  {
    art: 'service',
    seg: 's08-02',
    title: 'Al tocar',
    sub: [
      { text: 'Un cambio toca más de lo que' },
      { text: 'parece, así que pregunta', word: 'pregunta', strong: true },
      { text: 'quién más lo usa. Y a las', word: 'usa', strong: true },
      { text: 'listas entra solo lo que el', word: 'listas' },
      { text: 'cambio necesita.', word: 'necesita', strong: true },
    ],
  },
  // Voice: «Y tres, un cambio no se cierra hasta que lo escrito dice lo que hay.»
  {
    art: 'closed',
    seg: 's08-03',
    title: 'Al acabar',
    sub: [
      { text: 'Un cambio no se cierra hasta', word: 'cierra', strong: true },
      { text: 'que lo escrito dice lo que', word: 'escrito', strong: true },
      { text: 'hay. Diagramas,', word: 'hay' },
      { text: 'procedimientos y la' },
      { text: 'versión guardada.' },
    ],
  },
];

/** The exam phrase on `phrase`, in three beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Antes de tocar, tres cosas.', word: 'Antes', nth: 0, tone: 'cyan' },
  { text: 'Al tocar, lo necesario.', word: 'tocar', nth: 1, tone: 'amber' },
  { text: 'Al acabar, todo al día.', word: 'acabar', nth: 0, tone: 'emerald' },
] as const;

/** The one next step (the voice says «Tu turno»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  objective: 'Security+ SY0-701 · objetivo 1.3',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
