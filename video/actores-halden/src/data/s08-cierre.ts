/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Sub lines ≤ 27 characters at 30 px (the card is ~560 px
 * wide). Exam terms in English, as in the rest of the video.
 */

export type RuleArt = 'graffiti' | 'thief-mic' | 'kitchen';

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
  title: string;
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Fuera y con poco, la causa separa al hacktivist del que presume.»
  {
    art: 'graffiti',
    seg: 's08-01',
    title: 'Fuera y con poco',
    sub: [
      { text: 'firma una causa: hacktivist', word: 'causa', strong: true },
      { text: 'ver si puede, presumir:', word: 'presume' },
      { text: 'unskilled attacker', word: 'presume', strong: true },
    ],
  },
  // «Fuera y con mucho, cobrar es organized crime, y quedarse, nation-state.»
  {
    art: 'thief-mic',
    seg: 's08-02',
    title: 'Fuera y con mucho',
    sub: [
      { text: 'cobrar: organized crime', word: 'cobrar', strong: true },
      { text: 'quedarse: nation-state', word: 'quedarse', strong: true },
      { text: 'un zero-day no decide', word: 'quedarse' },
    ],
  },
  // «Y si ya estaba dentro, es insider aunque busque dinero.»
  {
    art: 'kitchen',
    seg: 's08-03',
    title: 'Ya dentro',
    sub: [
      { text: 'insider: a propósito', word: 'insider', strong: true },
      { text: 'o por error', word: 'insider' },
      { text: 'aunque busque dinero', word: 'dinero' },
      { text: 'sin Sistemas: shadow IT', word: 'dinero', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`: the pair (sky), then who it is (amber, the motive). */
export const PHRASE = {
  pair: 'Primero, dónde está y con qué cuenta: eso te da la pareja.',
  who: 'Después, qué quiere: eso te dice quién es.',
} as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Seis actores, tres parejas', 'el porqué decide'],
  objective: 'Security+ SY0-701 · objetivo 2.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
