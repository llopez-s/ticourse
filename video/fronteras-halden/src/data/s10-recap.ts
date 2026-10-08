/**
 * s10-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md). The rules follow the frozen voice
 * (s10-01..03), shortened to fit a card: a two-line title (≤ 16 characters a line, so RuleCards keeps it at
 * 54 px), then three lines (≤ 28 characters at 32 px), each lit on its own word (`word`, in segment `seg`).
 * Exam terms in capitals (and 802.1X) are drawn violet. Each card carries the video's own drawing: the
 * compound's entrance gate (802.1X), the container (site-to-site, ESP, tunnel mode) with the launch (one person,
 * with a client) and the customs office (full tunnel).
 */

export type RuleArt = 'gate' | 'corridor' | 'customs';

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
  // «Una toma no se abre hasta que alguien decide quién eres. El switch transmite, y RADIUS decide.»
  {
    art: 'gate',
    seg: 's10-01',
    title: ['Una toma', 'no se abre'],
    sub: [
      { text: 'hasta decidir quién eres', word: 'hasta', strong: true },
      { text: 'el switch transmite', word: 'switch' },
      { text: 'y RADIUS decide · 802.1X', word: 'RADIUS' },
    ],
  },
  // «Dos sedes se unen una vez, entre pasarelas, con ESP y en modo túnel. Una persona entra con su cliente,
  //  y por TLS si la red solo deja web.»
  {
    art: 'corridor',
    seg: 's10-02',
    title: ['Dos sedes se', 'unen una vez'],
    sub: [
      { text: 'pasarelas, ESP, modo túnel', word: 'pasarelas', strong: true },
      { text: 'una persona, con su cliente', word: 'persona' },
      { text: 'por TLS, si solo deja web', word: 'TLS' },
    ],
  },
  // «Y si todo tiene que pasar por tu inspección, túnel completo. El dividido deja el portátil con un pie a
  //  cada lado.»
  {
    art: 'customs',
    seg: 's10-03',
    title: ['Todo por tu', 'inspección'],
    sub: [
      { text: 'túnel completo: FULL TUNNEL', word: 'completo', strong: true },
      { text: 'SPLIT TUNNEL: el portátil', word: 'dividido' },
      { text: 'con un pie a cada lado', word: 'pie' },
    ],
  },
];

/** The one next step (s10-04 «Ahora te tocan las ocho preguntas de la lección»): canon, never the lesson id. */
export const NEXT = 'Tu turno: las preguntas de la lección';
export const QUESTIONS = '8 preguntas';

export const END = {
  title: ['Por dónde se entra:', '802.1X, VPN e IPSec'],
  /**
   * The remate (s10-04 «Y la próxima toma libre que veas, mira a ver si te pregunta quién eres»), shortened;
   * not in the brief's canon list.
   */
  remate: ['La próxima toma libre:', '¿te pregunta quién eres?'],
  objective: 'Security+ SY0-701 · objetivo 3.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
