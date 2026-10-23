/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue with the full rule of the ficha
 * (the voice says a short version); its lines light on the voice's own words (`word`, in the rule's segment `seg`;
 * lines the voice does not say light with the card). Lines ≤ 31 characters at 27 px (the card is 560 px wide).
 */

export type RuleArt = 'piggy' | 'masked' | 'storage';

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
  // Voice: «Tres reglas. Guardado o en camino, se cifra, y en uso ya está descifrado.»
  {
    art: 'piggy',
    seg: 's08-01',
    title: 'Dónde está',
    sub: [
      { text: 'Pregúntate dónde está el dato:', strong: true },
      { text: 'guardado (at rest), cruzando', word: 'guardado' },
      { text: 'una red (in transit) o en uso', word: 'camino' },
      { text: '(in use). Los dos primeros se', word: 'camino' },
      { text: 'cifran; en uso ya está', word: 'cifra', strong: true },
      { text: 'descifrado, y lo protegen el', word: 'descifrado', strong: true },
      { text: 'mínimo privilegio y lo que' },
      { text: 'enseña la pantalla. Moverse' },
      { text: 'por la calle no es in transit.' },
    ],
  },
  // Voice: «Masking oculta una parte, tokenization deja un código que solo traduce la vault, y obfuscation, un estorbo, no una barrera.»
  {
    art: 'masked',
    seg: 's08-02',
    title: 'Qué se ve',
    sub: [
      { text: 'Masking oculta una parte y', word: 'masking', strong: true },
      { text: 'deja el original intacto;', word: 'masking' },
      { text: 'tokenization guarda un', word: 'tokenization', strong: true },
      { text: 'sustituto que solo la vault', word: 'vault' },
      { text: 'traduce; obfuscation es un', word: 'obfuscation', strong: true },
      { text: 'estorbo, no una barrera.', word: 'barrera', strong: true },
    ],
  },
  // Voice: «Y primero se mira dónde vive el dato, porque allí manda su ley.»
  {
    art: 'storage',
    seg: 's08-03',
    title: 'En qué país',
    sub: [
      { text: 'Primero se mira dónde vive el', word: 'primero', strong: true },
      { text: 'dato (geolocation). Le aplica', word: 'dato' },
      { text: 'la ley de ese país (data', word: 'ley', strong: true },
      { text: 'sovereignty), y se ata a una', word: 'ley' },
      { text: 'región con las geographic' },
      { text: 'restrictions.' },
    ],
  },
];

/** The exam phrase on `phrase`, in two beats (each lights on its word in s08-04). */
export const PHRASE = [
  { text: 'Antes de elegir un método,', word: 'Antes', tone: 'violet' },
  { text: 'pregúntate dónde está el dato ahora mismo', word: 'pregúntate', tone: 'cyan' },
] as const;

/** The one next step (the voice says «Y ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  objective: 'Security+ SY0-701 · objetivo 3.3',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
