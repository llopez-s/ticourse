/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md «Canon strings» › s06).
 * The rules follow the voice (s06-01..03): each line lights on its own word (`word`, in the rule's segment).
 * `exam` lists the exam terms inside a line (drawn violet). Big lines are the rule itself.
 */

export type RuleArtKind = 'clockbook' | 'tech' | 'paper';

export interface RecapLine {
  /** One line, or two hard-broken lines. */
  text: string | readonly [string, string];
  /** A big line is the rule itself (54 px); the others are its other halves. */
  big?: boolean;
  /** The exam terms inside `text`, drawn violet. */
  exam?: readonly string[];
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  /** 0-based match of `word` in the segment (when it is said more than once). */
  nth?: number;
}

export interface RecapRule {
  art: RuleArtKind;
  seg: string;
  lines: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Primera, el RTO es de tiempo y el RPO, de datos.»
  {
    art: 'clockbook',
    seg: 's06-01',
    lines: [
      { text: 'RTO: de tiempo', big: true, exam: ['RTO'], word: 'RTO' },
      { text: 'cuánto sin servir', word: 'tiempo' },
      { text: 'RPO: de datos', big: true, exam: ['RPO'], word: 'RPO' },
      { text: 'ventas desde la copia', word: 'datos' },
    ],
  },
  // «Segunda, el MTTR y el MTBF se miden, no se prometen. Y el MTTR se compara con el RTO.»
  {
    art: 'tech',
    seg: 's06-02',
    lines: [
      { text: ['MTTR y MTBF:', 'se miden'], big: true, exam: ['MTTR', 'MTBF'], word: 'miden' },
      { text: 'no se prometen', word: 'prometen' },
      { text: ['el MTTR se compara', 'con el RTO'], exam: ['MTTR', 'RTO'], word: 'compara' },
    ],
  },
  // «Y tercera, si lo medido no llega a lo prometido, se mejora la recuperación, no el papel.»
  {
    art: 'paper',
    seg: 's06-03',
    lines: [
      { text: ['Se mejora la', 'recuperación'], big: true, word: 'mejora' },
      { text: 'si lo medido no llega', word: 'medido' },
      { text: 'no el papel', word: 'papel' },
    ],
  },
];

/** The one next step (s06-04 «Y para practicarlo, tu turno, las preguntas de la lección»), as the end card's «Tu turno». */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** «RTO, RPO, MTTR y MTBF» (cyan) / what is promised and what is measured, broken in three for its size. */
  title: ['RTO, RPO, MTTR y MTBF', 'lo que se promete', 'y lo que se mide'],
  objective: 'Security+ SY0-701 · objetivo 5.2',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
