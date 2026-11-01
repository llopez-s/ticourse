/** s05-p1 «Doce aplicaciones» — scene-drawn strings. The question itself is the engine's (narration.json -> question). */

/** Options in the panel, A to D; the band under it mirrors the letters. */
export const LETTERS = ['A', 'B', 'C', 'D'] as const;

/** From `back-1`: the two options that solve neither the passwords nor the closing of accounts (B and C). */
export const STRUCK = [1, 2] as const;
/** Answer (D) and trap (A) as the panel marks them. */
export const ANSWER = 3;
export const TRAP = 0;
