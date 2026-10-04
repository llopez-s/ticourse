/**
 * The lesson's ACH extract (src/data/s4.ts:420-437), as data. It is the only
 * matrix this video shows: three hypotheses, four pieces of evidence, twelve
 * cells. Every on-screen string here is canon (scene brief «Canon»), except
 * the C-count row label (MATRIX_TEXT.countC), which the lesson does not have.
 */

export type HypId = 'H1' | 'H2' | 'H3';
export type EvId = 'E1' | 'E2' | 'E3' | 'E4';
/** C = encaja · I = choca · N = no dice nada. */
export type Mark = 'C' | 'I' | 'N';
/** One cell: evidence row × hypothesis column, e.g. 'E2-H2'. */
export type CellId = `${EvId}-${HypId}`;
export type Diag = 'NULA' | 'ALTA';

export interface Hypothesis {
  id: HypId;
  /** Full label, as the lesson writes it. */
  label: string;
  /** The same label hard-broken into two lines (column headers, sheet slots). */
  lines: readonly [string, string];
}

export interface Evidence {
  id: EvId;
  /** Row text, as the lesson writes it. */
  text: string;
  /** The same text hard-broken for the row-label column (one or two lines). */
  lines: readonly string[];
  /** Marks for H1, H2, H3. */
  marks: readonly [Mark, Mark, Mark];
  diag: Diag;
}

export const HYP_IDS: readonly HypId[] = ['H1', 'H2', 'H3'];
export const EV_IDS: readonly EvId[] = ['E1', 'E2', 'E3', 'E4'];

export const HYPOTHESES: readonly Hypothesis[] = [
  { id: 'H1', label: 'espionaje estatal-industrial', lines: ['espionaje', 'estatal-industrial'] },
  { id: 'H2', label: 'ransomware / crimen financiero', lines: ['ransomware /', 'crimen financiero'] },
  { id: 'H3', label: 'hacktivismo / insider', lines: ['hacktivismo /', 'insider'] },
];

export const EVIDENCE: readonly Evidence[] = [
  { id: 'E1', text: 'Entrada por spearphishing', lines: ['Entrada por spearphishing'], marks: ['C', 'C', 'C'], diag: 'NULA' },
  {
    id: 'E2',
    text: '6 meses de acceso, cero cifrado/extorsión',
    lines: ['6 meses de acceso,', 'cero cifrado/extorsión'],
    marks: ['C', 'I', 'N'],
    diag: 'ALTA',
  },
  {
    id: 'E3',
    text: 'Exfil selectiva de diseños de propulsión',
    lines: ['Exfil selectiva de', 'diseños de propulsión'],
    marks: ['C', 'I', 'I'],
    diag: 'ALTA',
  },
  {
    id: 'E4',
    text: 'Cert TLS compartido con campaña de espionaje reportada por el ISAC',
    lines: ['Cert TLS compartido con', 'campaña de espionaje', 'reportada por el ISAC'],
    marks: ['C', 'I', 'I'],
    diag: 'ALTA',
  },
];

/** On-screen strings of the matrix and its counts. */
export const MATRIX_TEXT = {
  title: 'Extracto de matriz ACH · VELVET CICADA (ficticio)',
  legend: 'C = encaja · I = choca · N = no dice nada',
  /** Legend pieces, for drawing the letters as cell tiles (joined they are `legend`). */
  legendParts: [
    { mark: 'C', text: 'encaja' },
    { mark: 'I', text: 'choca' },
    { mark: 'N', text: 'no dice nada' },
  ] as const,
  /** Diagnosticity column header, as in the lesson's extract (the exam term DIAGNOSTICITY is s06's name card). */
  diagHeader: 'Diagnosticidad',
  strongLink: 'strong link',
  /** C-count row label. Invented (the lesson has no such row): mirrors the voice, «si cuentas las C». */
  countC: 'cuenta de C',
  /** I-count row label, the lesson's «Inconsistencias:». */
  countI: 'Inconsistencias',
  winner: 'la menos inconsistente',
  /** Tag on the I-count row once E4 is pulled (s08). */
  withoutE4: 'sin E4',
  /** s08 note on E4 (amber, never rose: nobody is said to have planted it). */
  plantNote: 'justo lo que alguien podría plantar',
  /** s05 note on cell E2-H2. */
  ransomNote: 'el ransomware cobra rápido',
} as const;

export const cellId = (ev: EvId, hyp: HypId): CellId => `${ev}-${hyp}`;

/** Mark of one cell. */
export function markOf(cell: CellId): Mark {
  const [ev, hyp] = cell.split('-') as [EvId, HypId];
  const row = EVIDENCE.find((e) => e.id === ev)!;
  return row.marks[HYP_IDS.indexOf(hyp)];
}

/** Every cell id, row by row (E1-H1, E1-H2, …, E4-H3). */
export const CELL_IDS: readonly CellId[] = EVIDENCE.flatMap((e) => HYP_IDS.map((h) => cellId(e.id, h)));

/** How many cells of `mark` each hypothesis gets, leaving out the `without` rows. */
export function countMarks(mark: Mark, without: readonly EvId[] = []): Record<HypId, number> {
  const out: Record<HypId, number> = { H1: 0, H2: 0, H3: 0 };
  for (const e of EVIDENCE) {
    if (without.includes(e.id)) continue;
    e.marks.forEach((m, i) => {
      if (m === mark) out[HYP_IDS[i]] += 1;
    });
  }
  return out;
}

/** Canon counts (asserted against the data below). */
export const COUNTS = {
  /** C per column, s07 (struck out): 4 · 1 · 1. */
  C: { H1: 4, H2: 1, H3: 1 },
  /** «Inconsistencias», s07: 0 · 3 · 2. */
  I: { H1: 0, H2: 3, H3: 2 },
  /** «Inconsistencias» without E4, s08: 0 · 2 · 1. */
  IWithoutE4: { H1: 0, H2: 2, H3: 1 },
} as const satisfies Record<string, Record<HypId, number>>;

// The canon numbers must follow from the cells; fail loudly at bundle time if someone edits one and not the other.
(() => {
  const same = (a: Record<HypId, number>, b: Record<HypId, number>) => HYP_IDS.every((h) => a[h] === b[h]);
  if (!same(countMarks('C'), COUNTS.C) || !same(countMarks('I'), COUNTS.I) || !same(countMarks('I', ['E4']), COUNTS.IWithoutE4)) {
    throw new Error('data/matrix.ts: COUNTS do not match the cells');
  }
})();
