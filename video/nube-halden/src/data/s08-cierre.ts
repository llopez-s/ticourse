/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha
 * (the voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`;
 * lines the voice does not say light with the card). Lines ≤ 29 characters at 32 px (the card is 560 px wide).
 */

export type RuleArt = 'postit' | 'bike' | 'branch';

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
  // Voice: «La plantilla copia también lo malo, y un secreto subido se anula.»
  {
    art: 'postit',
    seg: 's08-01',
    title: 'La plantilla',
    sub: [
      { text: 'La plantilla copia', word: 'plantilla', strong: true },
      { text: 'lo bueno y lo malo,', word: 'malo,', strong: true },
      { text: 'así que se revisa,' },
      { text: 'los secretos van fuera' },
      { text: 'y, si uno se sube, se anula', word: 'anula.', strong: true },
    ],
  },
  // Voice: «En serverless, ves lo que te dan los registros del proveedor.»
  {
    art: 'bike',
    seg: 's08-02',
    title: 'La función',
    sub: [
      { text: 'En serverless no hay máquina', word: 'serverless,' },
      { text: 'que parchear ni donde mirar.' },
      { text: 'Ves lo que te dan', word: 'ves', strong: true },
      { text: 'los registros del proveedor,', word: 'registros', strong: true },
      { text: 'y dependes de él' },
    ],
  },
  // Voice: «Y con microservicios, cada pieza comprueba quién la llama.»
  {
    art: 'branch',
    seg: 's08-03',
    title: 'Las piezas',
    sub: [
      { text: 'Con microservicios, un fallo', word: 'microservicios,' },
      { text: 'hace menos daño, pero' },
      { text: 'cada pieza es una puerta,' },
      { text: 'y cada una comprueba', word: 'comprueba', strong: true },
      { text: 'quién la llama', word: 'llama.', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`: the first sentence white, the question violet on «Pregúntate». */
export const PHRASE = {
  lead: 'Lo que ganas trae su riesgo.',
  ask: ['Pregúntate qué copia la plantilla,', 'qué ves de la función y quién llama a cada pieza'],
} as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Construir en la nube', 'qué ganas y qué arriesgas'],
  objective: 'Security+ SY0-701 · objetivo 3.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
