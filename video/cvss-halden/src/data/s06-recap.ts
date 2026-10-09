/**
 * s06-recap «Tres reglas» — on-screen strings. Each rule card lights on the voice's own words (word, in the rule's
 * segment seg); titles are two hard lines, sub lines ≤ 27 characters at 32 px.
 */

export type RuleArt = 'sea' | 'record' | 'bilge';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  nth?: number;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: readonly [string, string];
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «La nota dice lo grave que es el fallo, y el contexto, lo urgente.»
  {
    art: 'sea',
    seg: 's06-01',
    title: ['La nota no es', 'la prisa'],
    sub: [
      { text: 'la nota: lo grave', word: 'grave', strong: true },
      { text: 'el contexto: lo urgente', word: 'urgente' },
    ],
  },
  // «Si no hay parche, aíslas, compensas y firmas una excepción con caducidad. Un seguro no cierra el fallo.»
  {
    art: 'record',
    seg: 's06-02',
    title: ['Sin parche,', 'no a lo bruto'],
    sub: [
      { text: 'aíslas y compensas', word: 'compensas', strong: true },
      { text: 'excepción con caducidad', word: 'caducidad' },
      { text: 'un seguro no lo cierra', word: 'seguro' },
    ],
  },
  // «No está cerrado hasta que lo compruebas. Si sigue saliendo, mira qué corre de verdad.»
  {
    art: 'bilge',
    seg: 's06-03',
    title: ['Cerrado, solo', 'si se comprueba'],
    sub: [
      { text: 'hasta que lo compruebas', word: 'compruebas', strong: true },
      { text: 'si sigue saliendo,', word: 'saliendo' },
      { text: 'mira qué corre de verdad', word: 'corre' },
    ],
  },
];

/** The one next step (s06-04 «En el laboratorio lo aplicas con otros ocho hallazgos»). */
export const NEXT = 'Ahora te toca: el laboratorio de triaje';
export const LAB = 'Vulnerability Triage';

export const END = {
  title: ['Triaje de', 'vulnerabilidades'],
  /** The remate (s06-04 «Decide con contexto, no con una moneda»), exactly so. */
  remate: 'Decide con contexto, no con una moneda',
  objective: 'Security+ SY0-701 · objetivo 4.3',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
