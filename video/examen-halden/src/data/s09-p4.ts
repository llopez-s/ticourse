/** s09-p4 «Un gusano en la oficina» — scene-drawn strings. The question itself is the engine's (narration.json -> question). */

/** Answer (D, a firewall only towards the internet) and trap (C, splitting the network into VLANs). */
export const ANSWER = 3;
export const TRAP = 2;
/** From `back-4`: A and B, struck in silence. */
export const STRUCK = [0, 1] as const;
/** The question as it comes back when it is asked to be read twice: `em` is underlined. */
export const STATEMENT = { pre: '¿Qué medida lo frena ', em: 'MENOS', post: '?' } as const;
/** On the trap: the textbook measure, which is exactly what is not being asked for. */
export const TRAP_TAG = 'la medida de libro';
/** On `back-4`: whoever reads in a hurry marks the best one. */
export const HURRY = 'con prisa se marca la mejor';
