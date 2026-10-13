import { MATRIX_POSE } from '../../../data/s04-fase';
import { matrixCellBox, matrixRowBox, matrixSize, type Box } from '../Matrix';

const M = MATRIX_POSE;
/** The matrix as it stands from `row-c2` on: the C2 row enlarged into three readable cards. */
export const BIG = { enlarge: { c2: 1 } } as const;

const abs = (b: Box): Box => ({ ...b, x: M.x + b.x, y: M.y + b.y, cx: M.x + b.cx, cy: M.y + b.cy });

/** Stage-local boxes of what the scene hangs things on. */
export const GEOM = {
  matrix: { ...M, h: matrixSize(BIG, M.w).h, right: M.x + M.w - 10 * (M.w / 1000) },
  c2: abs(matrixRowBox('c2', BIG, M.w)),
  aoo: abs(matrixRowBox('aoo', BIG, M.w)),
  /** The three rows above C2 («los pasos de antes»). */
  before: { top: abs(matrixRowBox('delivery', BIG, M.w)).y, bottom: abs(matrixRowBox('c2', BIG, M.w)).y },
  detect: abs(matrixCellBox('c2-detect', BIG, M.w)),
  deny: abs(matrixCellBox('c2-deny', BIG, M.w)),
  degrade: abs(matrixCellBox('c2-degrade', BIG, M.w)),
} as const;

/** Where the matrix's top fades out from `supose` on, in px from the matrix's top: [clear, solid]. */
export const MASK = { from: matrixRowBox('c2', BIG, M.w).y - 5, to: matrixRowBox('c2', BIG, M.w).y - 1 } as const;
