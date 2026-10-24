/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha
 * (the voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`;
 * lines the voice does not say light with the card). Lines ≤ 28 characters at 30 px (the card is 560 px wide).
 */

export type RuleArt = 'album' | 'van' | 'club';

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
  // Voice: «Dentro de la casa, el owner decide, el custodian aplica y el steward cuida el significado.»
  {
    art: 'album',
    seg: 's08-01',
    title: 'Dentro de la casa',
    sub: [
      { text: 'El owner decide', word: 'owner', strong: true },
      { text: '(clasifica y aprueba),', word: 'decide' },
      { text: 'el custodian aplica', word: 'aplica', strong: true },
      { text: 'y el steward cuida', word: 'steward' },
      { text: 'el significado', word: 'significado', strong: true },
    ],
  },
  // Voice: «Con la ley, el controller decide para qué, y el processor trata con sus instrucciones.»
  {
    art: 'van',
    seg: 's08-02',
    title: 'Con la ley',
    sub: [
      { text: 'El controller decide para', word: 'controller', strong: true },
      { text: 'qué; el processor de fuera', word: 'processor' },
      { text: 'trata con sus instrucciones', word: 'instrucciones', strong: true },
      { text: 'y la responsabilidad no se' },
      { text: 'va con el trabajo' },
    ],
  },
  // Voice: «Arriba, el consejo responde, el comité recomienda y la autoridad gobierna desde fuera.»
  {
    art: 'club',
    seg: 's08-03',
    title: 'Arriba',
    sub: [
      { text: 'El consejo responde,', word: 'consejo', strong: true },
      { text: 'el comité recomienda', word: 'recomienda', strong: true },
      { text: 'y la autoridad gobierna', word: 'autoridad' },
      { text: 'desde fuera', word: 'fuera', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`: the first line white, the rest violet on «Saber». */
export const PHRASE = {
  lead: 'Pregunta quién decide:',
  ask: ['saber más o hacer el trabajo', 'no te da la decisión'],
} as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Quién decide, quién aplica', 'y quién responde'],
  objective: 'Security+ SY0-701 · objetivo 5.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
