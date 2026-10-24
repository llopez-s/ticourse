/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha (the
 * voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`; lines the
 * voice does not say light with the card). Lines ≤ 31 characters at 27 px (the card is 560 px wide).
 */

export type RuleArt = 'signs' | 'lifeguard' | 'oldsign';

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
  // Voice: «Tres reglas. Policy y standard obligan. Uno dice qué y por qué, y el otro, cuánto.»
  {
    art: 'signs',
    seg: 's08-01',
    title: 'Qué y cuánto',
    sub: [
      { text: 'Policy y standard obligan:', word: 'obligan', strong: true },
      { text: 'la policy dice qué y por qué,', word: 'qué' },
      { text: 'sin tecnología; el standard,', word: 'otro' },
      { text: 'cuánto exactamente.', word: 'cuánto', strong: true },
    ],
  },
  // Voice: «El procedure dice cómo y obliga, aunque sea un playbook. La guideline solo aconseja.»
  {
    art: 'lifeguard',
    seg: 's08-02',
    title: 'Cómo y consejo',
    sub: [
      { text: 'El procedure dice cómo, paso', word: 'cómo', strong: true },
      { text: 'a paso, y obliga a quien lo', word: 'obliga' },
      { text: 'hace, también si es playbook;', word: 'playbook' },
      { text: 'la guideline aconseja y no', word: 'guideline', strong: true },
      { text: 'obliga.', word: 'aconseja' },
    ],
  },
  // Voice: «Y cada papel tiene dueño y ciclo, y se revisa antes si cambia la ley.»
  {
    art: 'oldsign',
    seg: 's08-03',
    title: 'Dueño y ciclo',
    sub: [
      { text: 'Cada papel tiene dueño y', word: 'dueño', strong: true },
      { text: 'ciclo, y se revisa antes si', word: 'ciclo' },
      { text: 'cambia la ley o el servicio.', word: 'ley', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`, in two beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Primero, ¿obliga?', word: 'Primero', tone: 'violet' },
  { text: 'Después, ¿contesta al qué, al cuánto o al cómo?', word: 'Después', tone: 'cyan' },
] as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  objective: 'Security+ SY0-701 · objetivo 5.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
