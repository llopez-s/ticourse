import { C } from '../../../../engine/src/theme/tokens';

export * from '../../../../engine/src/practica/bits';

/** One colour per part of a rule (each accent keeps its engine meaning where it has one). */
export const PART = {
  meta: 'sky',
  strings: C.cyan,
  condition: '#fb923c',
} as const;

/** Corpus colours: the three variants we want, and the look-alike controls we do not. */
export const KIND = {
  target: C.cyan,
  control: C.muted,
} as const;
