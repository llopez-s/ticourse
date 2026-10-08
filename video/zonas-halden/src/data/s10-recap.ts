/**
 * s10-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md). The rules follow the frozen voice
 * (s10-01..03), shortened to fit a card: the title is the image the voice names, then three lines, each lit on
 * its own word (`word`, in segment `seg`). Titles are two hard lines ≤ 16 characters so RuleCards keeps them at
 * 54 px; sub lines ≤ 27 characters at 32 px (they are not shrunk). Words in capitals are exam terms (violet).
 * Each card carries the video's own drawing: the fence and its checkpoint, the counter window and the one door,
 * the barrier in a power cut and the fence camera.
 */

export type RuleArt = 'checkpoint' | 'counter-door' | 'barrier-camera';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  /** 0-based match of `word` in the segment (when it is said more than once). */
  nth?: number;
  /** First line of the card: the rule itself, brighter. */
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: readonly [string, string];
  sub: readonly [RecapLine, RecapLine, RecapLine];
}

export const RULES: readonly RecapRule[] = [
  // «Una zona es una valla con alguien en la garita, la misma confianza dentro y un control en cada paso.»
  {
    art: 'checkpoint',
    seg: 's10-01',
    title: ['Una zona:', 'valla y garita'],
    sub: [
      { text: 'misma confianza dentro', word: 'confianza', strong: true },
      { text: 'un control en cada paso', word: 'control' },
      { text: 'SECURITY ZONE', word: 'paso' },
    ],
  },
  // «Lo que Internet tiene que alcanzar va a la ventanilla, la DMZ, nunca dentro. Y para administrar, una sola puerta, el jump server.»
  {
    art: 'counter-door',
    seg: 's10-02',
    title: ['Lo público,', 'a la ventanilla'],
    sub: [
      { text: 'la DMZ, nunca dentro', word: 'DMZ', strong: true },
      { text: 'para administrar, una puerta', word: 'administrar' },
      { text: 'el JUMP SERVER', word: 'jump' },
    ],
  },
  // «Cada control en línea tiene decidido qué hacer al caerse, según lo que cueste más. Lo que solo mira una copia ni corta ni para.»
  {
    art: 'barrier-camera',
    seg: 's10-03',
    title: ['Al caerse,', 'ya está decidido'],
    sub: [
      { text: 'cada control en línea', word: 'control', strong: true },
      { text: 'FAIL-OPEN o FAIL-CLOSED', word: 'cueste' },
      { text: 'en un TAP, ni corta ni para', word: 'copia' },
    ],
  },
];

/** The one next step (s10-04 «Tu turno. Te espera el laboratorio Zone Defense»), canon: never the lab id on screen. */
export const NEXT = 'Tu turno: el laboratorio Zone Defense';
export const LAB = '12 sistemas · cuatro zonas';

export const END = {
  title: ['Zonas de seguridad:', 'dónde va cada cosa'],
  sub: 'y qué pasa si falla',
  /** The remate (s10-04 «Y cuando alguien te diga que menos es más, cuenta las garitas»), shortened. */
  remate: ['¿Menos es más?', 'Cuenta las garitas.'],
  lab: 'Zone Defense · 12 sistemas · cuatro zonas',
  objective: 'Security+ SY0-701 · objetivo 3.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
