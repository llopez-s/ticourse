import { C } from '../../../../engine/src/theme/tokens';

export * from '../../../../engine/src/practica/bits';

/** One colour per ficha. Each keeps its engine meaning: cyan data, emerald validated, amber weak, sky links. */
export const CAND = {
  A: C.cyan,
  B: C.emerald,
  C: C.amber,
  D: C.sky,
  E: C.muted,
} as const;
