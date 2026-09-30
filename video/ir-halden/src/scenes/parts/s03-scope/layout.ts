import { mix } from '../../../../../engine/src/ui';

/**
 * Layout shared by s03-scope and s04-key (s04 opens exactly where s03 ends).
 * `main`: the compact board at the top of the stage with the host rows under
 * it; `think`: strip and rows lowered so the think prompt (stage-local
 * y ≈ 10–165, top centre) covers nothing.
 */
export const SCOPE_LAYOUT = {
  stripTop: { main: 0, think: 184 },
  rows: { main: { top: 222, step: 108 }, think: { top: 352, step: 102 } },
  headerTop: 164,
  ramTop: 552,
} as const;

/** Frames before the end of s03-05 at which the think prompt lands (its 4.5 s hold + the pause after the speech). */
export const S03_THINK_LEAD = 145;

/** Top of host row `i` between the main (0) and the think (1) layout. */
export function scopeRowTop(i: number, lower: number): number {
  const { main, think } = SCOPE_LAYOUT.rows;
  return mix(main.top + i * main.step, think.top + i * think.step, lower);
}
