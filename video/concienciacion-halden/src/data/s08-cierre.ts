/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha
 * (the voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`;
 * lines the voice does not say light with the card). Lines ≤ 31 characters at 27 px (the card is 560 px wide).
 */

export type RuleArt = 'faces' | 'button' | 'year';

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
  // Voice: «La primera, mira la intención: si lo sabía, es risky, y si no encaja, se investiga.»
  {
    art: 'faces',
    seg: 's08-01',
    title: 'La intención',
    sub: [
      { text: 'Clasifica por la intención:', word: 'intención', strong: true },
      { text: 'si lo sabía y lo hizo, risky;', word: 'sabía' },
      { text: 'si no encaja, se investiga;', word: 'encaja' },
      { text: 'si fue un error honesto,' },
      { text: 'diseño y formación.' },
    ],
  },
  // Voice: «La segunda, avisar cuesta un clic, y se contesta siempre.»
  {
    art: 'button',
    seg: 's08-02',
    title: 'Los avisos',
    sub: [
      { text: 'Lo que hay que subir es cuánta', word: 'segunda', strong: true },
      { text: 'gente avisa: avisar tiene que', word: 'avisar' },
      { text: 'costar un clic, se contesta', word: 'clic', strong: true },
      { text: 'siempre y no se castiga a', word: 'siempre' },
      { text: 'quien pica.' },
    ],
  },
  // Voice: «Y la tercera, la formación es de todo el año.»
  {
    art: 'year',
    seg: 's08-03',
    title: 'Todo el año',
    sub: [
      { text: 'La formación es de todo el año', word: 'formación', strong: true },
      { text: 'y para cada audiencia,', word: 'año' },
      { text: 'según su riesgo.' },
    ],
  },
];

/** The exam phrase on `phrase`, in three beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Busca la intención,', word: 'Busca', tone: 'white' },
  { text: 'sube los avisos', word: 'sube', tone: 'white' },
  { text: 'y forma a cada uno en su riesgo, todo el año', word: 'forma', tone: 'cyan' },
] as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  objective: 'Security+ SY0-701 · objetivo 5.6',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
