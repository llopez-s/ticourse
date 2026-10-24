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
      { text: 'Lo que dice el proveedor de sí', word: 'dice', strong: true },
      { text: 'mismo informa; lo que hace', word: 'proveedor' },
      { text: 'alguien de fuera pesa más, y', word: 'fuera', strong: true },
      { text: 'se mira qué cubre y qué meses.', word: 'más', lag: 8 },
    ],
  },
  // Voice: «Antes de firmar, due diligence. Después, vendor monitoring.»
  {
    art: 'timeline',
    seg: 's08-02',
    title: 'Antes y después',
    sub: [
      { text: 'Antes de firmar, due diligence,', word: 'Antes', strong: true },
      { text: 'y se pide todo lo que luego', word: 'diligence' },
      { text: 'querrás; después, vendor', word: 'Después', strong: true },
      { text: 'monitoring.', word: 'monitoring', strong: true },
    ],
  },
  // Voice: «Y cada papel fija lo suyo. Confidencialidad, relación, encargo o medida.»
  {
    art: 'papers',
    seg: 's08-03',
    title: 'Qué fija cada papel',
    sub: [
      { text: 'NDA para lo que vas a enseñar,', word: 'Confidencialidad', strong: true },
      { text: 'MSA para la relación, SOW para', word: 'relación' },
      { text: 'cada encargo, SLA para lo que', word: 'encargo' },
      { text: 'se mide; entre quienes', word: 'medida' },
      { text: 'colaboran, MOU si es intención', word: 'medida', lag: 14 },
      { text: 'y MOA si son compromisos.', word: 'medida', lag: 28, strong: true },
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
