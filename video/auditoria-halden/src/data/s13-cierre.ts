/**
 * s13-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`; a line with no word of its own lights a little after the
 * previous one). Titles are one line, sub lines ≤ 28 characters at 30 px (the card is ~560 px wide).
 */

export type RuleArt = 'piles-lift' | 'bridge' | 'room-log';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment); null = right after the line above. */
  word: string | null;
  nth?: number;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: string;
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Una firma declara. La attestation compromete a la organización, y el acknowledgement, a una persona.»
  {
    art: 'piles-lift',
    seg: 's13-01',
    title: 'Una firma declara',
    sub: [
      { text: 'attestation: la organización', word: 'attestation', strong: true },
      { text: 'acknowledgement: una persona', word: 'acknowledgement', strong: true },
    ],
  },
  // «Para convencer a alguien de fuera, lo que pesa es quién comprueba. Y cumplir no dice que aguantes, ni al revés.»
  {
    art: 'bridge',
    seg: 's13-02',
    title: 'Quién comprueba',
    sub: [
      { text: 'fuera pesa quién comprueba', word: 'comprueba', strong: true },
      { text: 'cumplir no dice aguantar', word: 'cumplir', strong: true },
      { text: 'ni aguantar, cumplir', word: 'revés', strong: true },
    ],
  },
  // «En la prueba, mira qué se mide, cuánto sabe quien prueba y si se ha tocado al objetivo.»
  {
    art: 'room-log',
    seg: 's13-03',
    title: 'En la prueba',
    sub: [
      { text: 'qué se mide', word: 'mide', strong: true },
      { text: 'cuánto sabe quien prueba', word: 'sabe', strong: true },
      { text: 'si se ha tocado al objetivo', word: 'tocado', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`, in two lines: the signature (sky), the audit (cyan) and the pentest (rose). */
export const PHRASE = {
  l1: ['Una firma ', 'declara', ', una auditoría ', 'comprueba si cumples'],
  l2: ['y un pentest, ', 'si aguantas'],
} as const;

/** The one next step (the voice says «Y ahora, a practicar. A por las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Cumplir o aguantar', 'auditorías y pentest'],
  objective: 'Security+ SY0-701 · objetivo 5.5',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
