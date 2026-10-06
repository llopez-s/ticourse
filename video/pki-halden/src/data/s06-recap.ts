/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md). The rules follow the frozen voice
 * (s06-01..03): the title is what the voice names first, then three lines, each lit on its own word (`word`, in
 * segment `seg`). Titles are two hard lines ≤ 15 characters so RuleCards keeps them at ~54 px; sub lines ≤ 27
 * characters at 32 px (V10's three-line recap). Words in capitals are exam terms (violet). Each card carries the
 * video's own drawing: the anchor chain, the REVOKE stamp on the ghost copy, the justificante stapled to the DNI.
 */

export type RuleArt = 'chain' | 'revoke' | 'note';

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
  // «Emisor desconocido, falta la intermedia o es autofirmado. El servidor manda la intermedia, la raíz ya la tienes.»
  {
    art: 'chain',
    seg: 's06-01',
    title: ['Emisor', 'desconocido'],
    sub: [
      { text: 'falta la intermedia', word: 'falta', strong: true },
      { text: 'o es autofirmado', word: 'autofirmado' },
      { text: 'la raíz ya la tienes', word: 'raíz' },
    ],
  },
  // «Clave filtrada, se revoca ya y se cambia, sin esperar a que caduque.»
  {
    art: 'revoke',
    seg: 's06-02',
    title: ['Clave', 'filtrada'],
    sub: [
      { text: 'se revoca ya', word: 'revoca', strong: true },
      { text: 'y se cambia', word: 'cambia' },
      { text: 'sin esperar a que caduque', word: 'esperar' },
    ],
  },
  // «La CRL puede llegar tarde, OCSP pregunta al momento, y con stapling la respuesta la trae el servidor.»
  {
    art: 'note',
    seg: 's06-03',
    title: ['La CRL puede', 'llegar tarde'],
    sub: [
      { text: 'OCSP pregunta al momento', word: 'OCSP', strong: true },
      { text: 'con STAPLING, la respuesta', word: 'stapling' },
      { text: 'la trae el servidor', word: 'trae' },
    ],
  },
];

/** The one next step (s06-04 «Termina tú la lección y sus preguntas»), as the end card's «Tu turno». */
export const NEXT = 'Tu turno: termina la lección y sus preguntas';

export const END = {
  title: ['PKI:', 'la cadena y la revocación'],
  /** The remate (s06-04 «Arregla cadenas, no avisos»), exactly so. */
  remate: 'Arregla cadenas, no avisos',
  objective: 'Security+ SY0-701 · objetivo 1.4',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
