import type { CellId } from './matrix';

/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md, «Other canon strings» › s06).
 * Each card is one rule, hard-broken to the card's width. Each line lights on its own word of the
 * voice (`word`, spoken in the rule's segment); a line without `word` lights with its card.
 *
 * `tint` colours a piece of a line with this video's meanings: cyan = looking (Discover, Detect),
 * emerald = stopping that works, amber = cost and risk.
 */

export type RecapTone = 'cyan' | 'emerald' | 'amber';

export interface RecapLine {
  text: string;
  /** 'if' = the condition, 'then' = the rule (big), 'sub' = small print. */
  kind: 'if' | 'then' | 'sub';
  tint?: readonly (readonly [string, RecapTone])[];
  /** The line lights when the voice says this word (in the rule's segment)… */
  word?: string;
  /** …the `nth` time it says it (0-based). */
  nth?: number;
}

export interface RecapRule {
  seg: string;
  lines: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Discover mira atrás y Detect, hacia delante. Deny impide que funcione, y Disrupt interrumpe lo que ya está en marcha.»
  // Canon: «Discover mira atrás · Detect, hacia delante». The second sentence is small print only, and it
  // says «Disrupt interrumpe» (never «corta»): plain rule text, not s03's DISRUPT label, which s06 never shows.
  {
    seg: 's06-01',
    lines: [
      { text: 'Discover mira atrás', kind: 'then', tint: [['Discover', 'cyan']] },
      { text: 'Detect, hacia delante', kind: 'then', tint: [['Detect', 'cyan']], word: 'Detect' },
      { text: 'Deny impide', kind: 'sub', tint: [['Deny', 'emerald']], word: 'Deny' },
      { text: 'Disrupt interrumpe', kind: 'sub', tint: [['Disrupt', 'emerald']], word: 'Disrupt' },
    ],
  },
  // «Una fase con una sola celda es un punto único de fallo. Pon varias.»
  // Canon: «una fase con una sola celda: punto único de fallo»; the last line is s04's «varias celdas por fase».
  {
    seg: 's06-02',
    lines: [
      { text: 'Una fase con', kind: 'if' },
      { text: 'una sola celda:', kind: 'if', word: 'sola' },
      { text: 'punto único de fallo', kind: 'then', tint: [['punto único de fallo', 'amber']], word: 'punto' },
      { text: 'varias celdas por fase', kind: 'sub', tint: [['varias celdas', 'emerald']], word: 'Pon' },
    ],
  },
  // «Lo que el atacante ve tiene un precio. Y si ya se llevan lo crítico, corta primero y mira después.»
  // Canon: «lo que el atacante ve tiene un precio»; the small print is s05's `flip` label.
  {
    seg: 's06-03',
    lines: [
      { text: 'Lo que el atacante ve', kind: 'then' },
      { text: 'tiene un precio', kind: 'then', tint: [['precio', 'amber']], word: 'tiene' },
      { text: 'si ya se llevan lo crítico:', kind: 'sub', word: 'si' },
      { text: 'contener ahora,', kind: 'sub', word: 'corta' },
      { text: 'recoger después', kind: 'sub', word: 'después' },
    ],
  },
];

/** Words the three drawings move on (each in its rule's segment). */
export const ART_WORDS = {
  /** Rule 1: the tape rewinds on «atrás»; the alarm rings on «Detect». */
  rewind: 'atrás',
  ring: 'Detect',
  /** Rule 2: the row's other cells come back on «Pon varias». */
  several: 'Pon',
  /** Rule 3: the [!] mark glows on «ve»; nobody answers the walkie from «corta». */
  seen: 've',
  cut: 'corta',
} as const;

/** Rule 2's row, and rule 3's cell with its label (the sinkhole is DENY: it always carries it). */
export const SINGLE = { phase: 'delivery', keep: 'delivery-deny' as CellId, back: ['delivery-detect', 'delivery-deceive'] as CellId[] } as const;
export const SINKHOLE = { cell: 'c2-deny' as CellId, label: 'DENY' } as const;

/** The mini time line of rule 1 (s02's «hoy»). */
export const TODAY = 'hoy';

/** The one next step (s06-04 «Ahora clasifica tú, en el Lab 2C»). */
export const NEXT = 'Tu turno: Lab 2C · Courses of Action';

export const END = {
  /** The video's title, in two lines; the first in violet (an exam name). */
  title: ['Courses of Action:', '¿cortas o miras?'],
  objective: 'GIAC GCTI · Intrusion Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
