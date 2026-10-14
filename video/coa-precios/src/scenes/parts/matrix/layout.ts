import { ACTION_IDS, CELL, PHASE_IDS, cellId, type ActionId, type CellId, type Line, type PhaseId } from '../../../data/matrix';

/** Design width: the matrix is laid out in these units and scaled to the `width` you pass. */
export const MATRIX_W = 1000;
export const M = {
  pad: 10,
  titleH: 38,
  headH: 36,
  labelW: 150,
  colW: 166,
  rowH: 100,
  /** Height of an enlarged row; the other four share what is left. */
  bigH: 256,
  footGap: 6,
  stripH: 30,
  stripGap: 2,
  /** Rest text (texture) and the smallest size of anything the voice points at, in SCREEN px. */
  text: 16,
  mono: 13,
  point: 32,
} as const;

const ROWS_H = M.rowH * PHASE_IDS.length;

export interface MatrixLayoutOptions {
  /** Title band (default true). */
  title?: boolean;
  /** Bottom band with the two strips / the legend (default true). */
  foot?: boolean;
  /** 0–1 per phase: that row grows (text ≥ 32 px at width ≥ 1000) and the others shrink to bars. */
  enlarge?: Partial<Record<PhaseId, number>>;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}
const mk = (x: number, y: number, w: number, h: number, s = 1): Box => ({ x: x * s, y: y * s, w: w * s, h: h * s, cx: (x + w / 2) * s, cy: (y + h / 2) * s });

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Design-unit geometry. */
export function designLayout({ title = true, foot = true, enlarge = {} }: MatrixLayoutOptions = {}) {
  // Only one row can be enlarged at a time: the strongest wins.
  const big = PHASE_IDS.reduce<{ id: PhaseId | null; e: number }>((b, id) => ((enlarge[id] ?? 0) > b.e ? { id, e: clamp01(enlarge[id] ?? 0) } : b), { id: null, e: 0 });
  const bigH = M.rowH + (M.bigH - M.rowH) * big.e;
  const restH = (ROWS_H - bigH) / (PHASE_IDS.length - 1);
  const yTitle = M.pad;
  const yHead = yTitle + (title ? M.titleH : 0);
  let y = yHead + M.headH;
  const rowY = {} as Record<PhaseId, number>;
  const rowH = {} as Record<PhaseId, number>;
  for (const id of PHASE_IDS) {
    rowY[id] = y;
    rowH[id] = big.id === null ? M.rowH : id === big.id ? bigH : restH;
    y += rowH[id];
  }
  const yFoot = y + M.footGap;
  const footH = foot ? M.footGap + 2 * M.stripH + M.stripGap : 0;
  const colX = {} as Record<ActionId, number>;
  ACTION_IDS.forEach((a, i) => (colX[a] = M.pad + M.labelW + i * M.colW));
  return { w: MATRIX_W, h: y + footH + M.pad, yTitle, yHead, rowY, rowH, yFoot, colX, gridBottom: y, big };
}

/** Size in px of a Matrix drawn `width` px wide with these options. */
export function matrixSize(opts: MatrixLayoutOptions = {}, width = MATRIX_W): { w: number; h: number; scale: number } {
  const l = designLayout(opts);
  const s = width / MATRIX_W;
  return { w: width, h: l.h * s, scale: s };
}

/** Box (px from the matrix's top-left) of a row: label + five cells. */
export function matrixRowBox(phase: PhaseId, opts: MatrixLayoutOptions = {}, width = MATRIX_W): Box {
  const l = designLayout(opts);
  return mk(M.pad, l.rowY[phase], MATRIX_W - 2 * M.pad, l.rowH[phase], width / MATRIX_W);
}

/** Box of a column: header + the five rows. */
export function matrixColBox(action: ActionId, opts: MatrixLayoutOptions = {}, width = MATRIX_W): Box {
  const l = designLayout(opts);
  return mk(l.colX[action], l.yHead, M.colW, l.gridBottom - l.yHead, width / MATRIX_W);
}

/** The populated actions of a phase, in column order. */
export const actionsOf = (phase: PhaseId): ActionId[] => ACTION_IDS.filter((a) => CELL[cellId(phase, a)]);

/** Design box of a cell in the grid, and of its card inside an enlarged row. */
export function designCell(cell: CellId, l: ReturnType<typeof designLayout>) {
  const [phase, action] = cell.split('-') as [PhaseId, ActionId];
  const grid = mk(l.colX[action], l.rowY[phase], M.colW, l.rowH[phase]);
  const acts = actionsOf(phase);
  const n = Math.max(1, acts.length);
  const gap = 6;
  const cw = (MATRIX_W - 2 * M.pad - (n - 1) * gap) / n;
  const i = Math.max(0, acts.indexOf(action));
  const head = 36;
  const big = mk(M.pad + i * (cw + gap), l.rowY[phase] + head, cw, M.bigH - head - 6);
  return { grid, big, phase, action };
}

/**
 * Box (px from the matrix's top-left) of a cell as it is drawn with these options: its grid slot, or
 * its card when its row is enlarged (blended by the row's weight).
 */
export function matrixCellBox(cell: CellId, opts: MatrixLayoutOptions = {}, width = MATRIX_W): Box {
  const l = designLayout(opts);
  const c = designCell(cell, l);
  const e = l.big.id === c.phase ? l.big.e : 0;
  const mixv = (a: number, b: number) => a + (b - a) * e;
  return mk(mixv(c.grid.x, c.big.x), mixv(c.grid.y, c.big.y), mixv(c.grid.w, c.big.w), mixv(c.grid.h, c.big.h), width / MATRIX_W);
}

/** Estimated width (in ems of the text size) of a pre-broken line; mono tokens count at `monoRatio`. */
export function lineEms(line: Line, monoRatio = 0.86): number {
  return line.reduce<number>((w, t) => w + (typeof t === 'string' ? t.length * 0.55 : t.m.length * 0.6 * monoRatio), 0);
}

/** Font size (design units) of a lifted card or an enlarged row so that it is ≥ 32 px on screen. */
export const pointSize = (scale: number) => Math.max(30, M.point / scale);

/** Design-unit box of a cell's lifted card at screen scale `s`; `shift` in design units. */
export function designLift(cell: CellId, l: ReturnType<typeof designLayout>, s: number, shift: { x?: number; y?: number } = {}): Box & { font: number } {
  const c = designCell(cell, l);
  const def = CELL[cell];
  const f = pointSize(s);
  const lines = def?.wide ?? [];
  const noteW = def?.markNote ? (def.markNote.join(' ').length + 4) * 0.55 * f * 0.9 : 0;
  const headW = (c.phase.length + c.action.length + 12) * 0.5 * f * 0.66;
  const textW = Math.max(headW, noteW, ...lines.map((ln) => lineEms(ln) * f * 1.04));
  const w = textW + 2 * 0.5 * f + 6;
  const h = 0.66 * f + 0.95 * f + lines.length * 1.2 * f + (def?.markNote ? 1.15 * 0.9 * f : 0) + (def?.note ? 0.78 * f : 0) + 6;
  // Kept clear of the phase labels when it fits beside them.
  const minX = w <= MATRIX_W - 2 * M.pad - M.labelW ? M.pad + M.labelW : M.pad;
  const cx = Math.max(minX + w / 2, Math.min(MATRIX_W - M.pad - w / 2, c.grid.cx + (shift.x ?? 0)));
  const cy = Math.max(l.yHead + M.headH + h / 2, Math.min(l.gridBottom - h / 2, c.grid.cy + (shift.y ?? 0)));
  return { ...mk(cx - w / 2, cy - h / 2, w, h), font: f };
}

/**
 * Box (px from the matrix's top-left) of a cell's LIFTED card (`cells[id].lift`): centred on the cell,
 * moved by `shift` (px) and kept inside the grid. The card is drawn exactly this size.
 */
export function matrixLiftBox(cell: CellId, opts: MatrixLayoutOptions = {}, width = MATRIX_W, shift: { x?: number; y?: number } = {}): Box {
  const s = width / MATRIX_W;
  const b = designLift(cell, designLayout(opts), s, { x: (shift.x ?? 0) / s, y: (shift.y ?? 0) / s });
  return mk(b.x, b.y, b.w, b.h, s);
}
