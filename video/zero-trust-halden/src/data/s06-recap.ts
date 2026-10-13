/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md, «Canon strings» › s06).
 * The rules follow the frozen voice (s06-01..03): the first line of a card is the rule as the voice
 * starts it, the others follow, and each lights on its own word (`word`, in the rule's segment).
 * `exam` marks the exam name inside a line (violet). Each card carries the video's own drawing:
 * the vest, the oficina + the administrativo + the mozo, and the order with its clock.
 */

export type RuleArtKind = 'vest' | 'trio' | 'order';

export interface RecapLine {
  /** One line, or two hard-broken lines (only the first line of a card is big enough to need it). */
  text: string | readonly [string, string];
  /** The exam name inside `text`, drawn violet. */
  exam?: string;
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  /** 0-based match of `word` in the segment (when it is said more than once). */
  nth?: number;
}

export interface RecapRule {
  art: RuleArtKind;
  seg: string;
  /** The first line is the rule itself (big, bright); the rest are its other halves. */
  lines: readonly RecapLine[];
  /** Small print at the foot of the card: on screen only, the voice does not say it. */
  note?: string;
}

export const RULES: readonly RecapRule[] = [
  // «Dentro no es de fiar, y verificar no es negar.»
  {
    art: 'vest',
    seg: 's06-01',
    lines: [
      { text: ['Dentro no es', 'de fiar'], word: 'Dentro' },
      { text: 'verificar no es negar', word: 'verificar' },
    ],
  },
  // «Decide el engine, comunica el administrator y aplica el PEP.»
  {
    art: 'trio',
    seg: 's06-02',
    lines: [
      { text: 'Decide el engine', exam: 'engine', word: 'Decide' },
      { text: 'comunica el administrator', exam: 'administrator', word: 'comunica' },
      { text: 'aplica el PEP', exam: 'PEP', word: 'aplica' },
    ],
  },
  // «Y la tercera, sesión corta, alcance mínimo y revocable.»
  {
    art: 'order',
    seg: 's06-03',
    lines: [
      { text: 'Sesión corta', word: 'sesión' },
      { text: 'alcance mínimo', word: 'alcance' },
      { text: 'revocable', word: 'revocable' },
    ],
    note: 'Zero Trust no es una caja que se compra: un proveedor puede vender un PEP o un PDP, pero la política y las señales las diseña tu organización',
  },
];

/** The one next step (s06-04 «Te toca a ti, con las preguntas de la lección»), as the end card's «Tu turno». */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** «Zero Trust:» (cyan) / «quién decide, quién comunica y quién aplica», broken in two for its size. */
  title: ['Zero Trust:', 'quién decide, quién comunica', 'y quién aplica'],
  /** The remate (s06-04 «Y que ninguna petición pase solo por llevar chaleco»), exactly so. */
  remate: 'Que ninguna petición pase solo por llevar chaleco',
  objective: 'Security+ SY0-701 · objetivo 1.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
