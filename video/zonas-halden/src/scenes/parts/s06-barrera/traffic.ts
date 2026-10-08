import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { checkpointPoint } from '../Checkpoint';

/**
 * Truck motion through the shared Checkpoint (road crop), for s06 and s07. A passing truck's
 * `passing` value runs 0 (below the crop) → 1 (gone beyond it); in the road crop its nose sits at
 * y = 620 − 800·p (design units, width 600). These helpers stop a truck at the barrier, open the
 * arm for it and drop the arm once its tail is clear.
 */

const DESIGN = 600;
const STOP_NOSE = checkpointPoint(DESIGN, 'queue', { crop: 'road' }).y + 4;
const GATE_Y = checkpointPoint(DESIGN, 'gate', { crop: 'road' }).y;

/** `passing` value of a truck waiting at the barrier. */
export const STOP_P = (620 - STOP_NOSE) / 800;
/** `passing` value at which a truck's tail (150 long) is past the barrier line. */
const CLEAR_P = (620 - (GATE_Y - 150 - 8)) / 800;

const APPROACH = 34;
const INSPECT = 24;
const GO = 36;
/** Frames from a crossing's start until its truck is gone. */
export const CROSSING_FRAMES = APPROACH + INSPECT + GO;

const goP = (k: number) => STOP_P + (1 - STOP_P) * EASE.inOut(k);
/** Frames into the go phase when the tail clears the barrier. */
const CLEAR_T = (() => {
  for (let k = 0; k <= GO; k++) if (goP(k / GO) >= CLEAR_P) return k;
  return GO;
})();

/** One staffed crossing starting at `t0`: the truck pulls up, the guard looks, the arm lifts, it drives on, the arm drops. */
export function crossing(frame: number, t0: number): { p: number; barrier: number } {
  const t = frame - t0;
  let p: number;
  if (t < 0) p = 0;
  else if (t < APPROACH) p = STOP_P * EASE.out(t / APPROACH);
  else if (t < APPROACH + INSPECT) p = STOP_P;
  else if (t < CROSSING_FRAMES) p = goP((t - APPROACH - INSPECT) / GO);
  else p = 1;
  const liftAt = t0 + APPROACH + INSPECT - 12;
  const dropAt = t0 + APPROACH + INSPECT + CLEAR_T + 2;
  const barrier = progress(frame, liftAt, 12, EASE.inOut) * (1 - progress(frame, dropAt, 12, EASE.inOut));
  return { p, barrier };
}

/** Crossings every `period` frames from `start` while they finish before `until`. */
export function crossings(frame: number, start: number, until: number, period = 120): { passing: number[]; barrier: number } {
  const list: { p: number; barrier: number }[] = [];
  for (let t0 = start; t0 + CROSSING_FRAMES <= until; t0 += period) list.push(crossing(frame, t0));
  return { passing: list.map((c) => c.p), barrier: Math.max(0, ...list.map((c) => c.barrier)) };
}

/** Free-flowing trucks (arm up, nobody stops them): one every `period` frames from `start`, each `dur` frames long. */
export function freeFlow(frame: number, start: number, period = 56, dur = 76): number[] {
  const out: number[] = [];
  for (let k = 0; start + k * period <= frame; k++) {
    const p = (frame - (start + k * period)) / dur;
    if (p > 0 && p < 1) out.push(p);
  }
  return out;
}
