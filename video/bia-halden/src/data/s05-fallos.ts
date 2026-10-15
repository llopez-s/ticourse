/** s05-fallos «Cada cuánto se cuelga»: the same console, now read as a 12-month line (no dates, no causes). */

export const HEADLINE = '4 averías en 12 meses';
export const MTBF_LABEL = 'MTBF · unos 3 meses';
/** Each gap between two marks reads like this. */
export const GAP_LABEL = '3 meses';

/** Month positions of the four faults on the 0–12 line: evenly spread, three months apart. */
export const MARK_MONTHS = [1.5, 4.5, 7.5, 10.5] as const;
export const AXIS = { start: 'hace 12 meses', end: 'ahora' } as const;

/** `side`: the two measures, one next to the other. */
export const SIDE = [
  { key: 'mttr', ask: 'cuánto tarda en volver', term: 'MTTR 80 min' },
  { key: 'mtbf', ask: 'cada cuánto falla', term: 'MTBF 3 meses' },
] as const;
export const SWAP = 'no se confunden';
