/** s06-p2 «Un primer análisis» — scene-drawn strings. The question itself is the engine's (narration.json -> question). */

/** Answer (B, the asset inventory) and trap (C, listing the threats) as the panel marks them. */
export const ANSWER = 1;
export const TRAP = 2;
/** From `back-2`: «el seguro» (A) and «la pérdida anual» (D), which depend on something that does not exist yet. */
export const STRUCK = [0, 3] as const;
