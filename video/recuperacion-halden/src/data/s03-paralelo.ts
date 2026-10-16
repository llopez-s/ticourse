/** s03-paralelo «Cuatro formas de probarlo»: strings and the shared Steps box (canon, see out/scene-brief.md). */

/**
 * Where the four steps stand on the stage (stage-local px). The same box is used by s04 so the
 * steps never jump between the two scenes. Step 4's card starts at y 180, under the think
 * prompt's card (stage-local y ≈ 10–165); the 44 px under the floor hold s03's «toca producción:
 * no» bar and s04's bottom comparison.
 */
export const STEPS_BOX = { left: 0, top: 180, width: 1728, height: 436 } as const;

/** The rising arrow over the steps (`ladder`): realism and risk go up together. */
export const RISE_LABEL = 'más real · más arriesgado';

/** The two theatres giving the same show (`parallel`). */
export const PAIR = {
  prod: { label: 'producción', sub: 'con público' },
  backup: { label: 'respaldo', sub: 'sin público' },
  same: 'la misma función, a la vez',
} as const;

/** `compare`: column by column, no figures (anti-spoilers): identical glyph pairs, a check each. */
export const COMPARE = {
  rows: ['producción', 'respaldo'],
  same: 'igual',
} as const;

/** `hidden`: the bar under steps 1–3. */
export const NO_TOUCH = 'toca producción: no';
