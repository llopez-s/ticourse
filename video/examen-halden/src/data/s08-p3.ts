/** s08-p3 «Una academia pequeña» — scene-drawn strings. The question itself is the engine's (narration.json -> question). */

/** Answer (A, the phishing e-mail) and trap (B, the zero-day) as the panel marks them. */
export const ANSWER = 0;
export const TRAP = 1;
/** From `back-3`: the insider (C) and the supplier (D), struck in silence. */
export const STRUCK = [2, 3] as const;
/** On the trap: why the zero-day tempts and does not fit. */
export const TRAP_TAG = 'caro y raro';
/** On `back-3`: «lo probable no es lo mismo que lo posible». */
export const COMPARE = { likely: 'probable', possible: 'posible' } as const;
