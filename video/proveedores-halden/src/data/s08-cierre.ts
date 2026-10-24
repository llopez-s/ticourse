/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the storyboard
 * (the voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`; `lag`
 * frames later for lines the voice does not say). Lines ≤ 31 characters at 27 px (the card is 560 px wide).
 */

export type RuleArt = 'nursery' | 'timeline' | 'papers';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  lag?: number;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: string;
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // Voice: «Tres reglas. Lo que comprueba alguien de fuera pesa más que lo que dice el proveedor.»
  {
    art: 'nursery',
    seg: 's08-01',
    title: 'Quién la ha hecho',
    sub: [
      { text: 'Lo que dice el proveedor', word: 'dice', strong: true },
      { text: 'de sí mismo informa; lo', word: 'proveedor' },
      { text: 'que hace alguien de fuera', word: 'fuera', strong: true },
      { text: 'pesa más, y se mira qué', word: 'pesa', strong: true },
      { text: 'cubre y qué meses.', word: 'más', lag: 8 },
    ],
  },
  // Voice: «Antes de firmar, due diligence. Después, vendor monitoring.»
  {
    art: 'timeline',
    seg: 's08-02',
    title: 'Antes y después',
    sub: [
      { text: 'Antes de firmar,', word: 'Antes', strong: true },
      { text: 'due diligence, y se pide', word: 'diligence', strong: true },
      { text: 'todo lo que luego', word: 'diligence', lag: 10 },
      { text: 'querrás; después,', word: 'Después', strong: true },
      { text: 'vendor monitoring.', word: 'monitoring', strong: true },
    ],
  },
  // Voice: «Y cada papel fija lo suyo. Confidencialidad, relación, encargo o medida.»
  {
    art: 'papers',
    seg: 's08-03',
    title: 'Qué fija cada papel',
    sub: [
      { text: 'NDA para lo que vas', word: 'Confidencialidad', strong: true },
      { text: 'a enseñar, MSA para la', word: 'Confidencialidad', lag: 10 },
      { text: 'relación, SOW para cada', word: 'relación', strong: true },
      { text: 'encargo, SLA para lo', word: 'encargo', strong: true },
      { text: 'que se mide; entre', word: 'medida', strong: true },
      { text: 'quienes colaboran, MOU', word: 'medida', lag: 14 },
      { text: 'si es intención y MOA', word: 'medida', lag: 26 },
      { text: 'si son compromisos.', word: 'medida', lag: 38, strong: true },
    ],
  },
];

/** The exam phrase on `phrase`, in three beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Mira quién ha hecho la prueba,', word: 'quién', tone: 'violet' },
  { text: 'mira si ya has firmado', word: 'si', tone: 'cyan' },
  { text: 'y mira qué tiene que fijar el papel', word: 'qué', tone: 'violet' },
] as const;

/** The one next step (the voice says «Te toca a ti. A por las preguntas de la lección.»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  objective: 'Security+ SY0-701 · objetivo 5.3',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
