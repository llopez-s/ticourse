/** s11-p5 «Una web de clínica» — scene-drawn strings. The question itself is the engine's (narration.json -> question). */

/** Option indices (0-based, A to D) as the panel marks them. */
export const ANSWER = 2;
export const TRAP = 0;
/** From `back-5`: the options that fall (B and D), struck with a white stroke in silence. */
export const STRUCK = [1, 3] as const;

/** `back-5`: the two columns of s10 in one line. */
export const ONE_LINE = { standard: 'para el público, lo estándar', trick: 'ocurrencia' } as const;
