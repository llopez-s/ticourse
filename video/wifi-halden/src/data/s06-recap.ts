/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md, «Canon strings» › s06).
 * Each card is a rule in the mould «si… entonces…»: a condition line, the rule itself (big) and its
 * small print, hard-broken to the card's width. Each line lights on its own word of the frozen
 * voice (`word`, in the rule's segment); a line the voice does not say (`after`) follows the line
 * before it. `exam` marks the exam names inside a line (violet).
 */

export type RuleArtKind = 'floodlight' | 'padlock' | 'carnet';

export interface RecapLine {
  text: string;
  /** 'if' = the condition, 'then' = the rule (big), 'sub' = small print, 'but' = the caveat (amber). */
  kind: 'if' | 'then' | 'sub' | 'but';
  exam?: readonly string[];
  /** The line lights when the voice says this word (in the rule's segment)… */
  word?: string;
  /** …or, for a line that is on screen only, this many frames after the previous line. */
  after?: number;
}

export interface RecapRule {
  art: RuleArtKind;
  seg: string;
  lines: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Si el foco alumbra al vecino, bájalo y gíralo.» · sub «colocación y potencia»
  {
    art: 'floodlight',
    seg: 's06-01',
    lines: [
      { text: 'Si el foco alumbra', kind: 'if', word: 'Si' },
      { text: 'al vecino:', kind: 'if', word: 'vecino' },
      { text: 'bájalo y gíralo', kind: 'then', word: 'bájalo' },
      { text: 'colocación y potencia', kind: 'sub', after: 16 },
    ],
  },
  // «WPA3 personal pone SAE, que frena el ataque sin conexión y da forward secrecy, pero la clave sigue siendo de todos.»
  {
    art: 'padlock',
    seg: 's06-02',
    lines: [
      { text: 'WPA3 personal', kind: 'if', exam: ['WPA3'], word: 'WPA3' },
      { text: 'pone SAE', kind: 'then', exam: ['SAE'], word: 'pone' },
      { text: 'frena el ataque sin conexión', kind: 'sub', word: 'frena' },
      { text: 'y da forward secrecy', kind: 'sub', exam: ['forward secrecy'], word: 'forward' },
      { text: 'la clave sigue siendo de todos', kind: 'but', word: 'pero' },
    ],
  },
  // «Para un carné por tableta, enterprise con EAP-TLS, o PEAP si validas al servidor.»
  {
    art: 'carnet',
    seg: 's06-03',
    lines: [
      { text: 'Un carné por tableta:', kind: 'if', word: 'carné' },
      { text: 'enterprise', kind: 'then', exam: ['enterprise'], word: 'enterprise' },
      { text: 'EAP-TLS, o PEAP', kind: 'sub', exam: ['EAP-TLS', 'PEAP'], word: 'EAP-TLS' },
      { text: 'si validas al servidor', kind: 'sub', word: 'validas' },
    ],
  },
];

/** The one next step, as the end card's «Tu turno» (the voice does not repeat it). */
export const NEXT = 'Tu turno: termina la lección y sus preguntas';

export const END = {
  /** The video's title, broken in three for its size; the first line in cyan. */
  title: ['WPA3-Enterprise:', 'de una clave para todos', 'a una identidad para cada uno'],
  objective: 'Security+ SY0-701 · objetivo 4.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
