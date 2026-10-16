/**
 * s02-miradas «Un escáner y un registro» — on-screen strings (canon: out/scene-brief.md › Canon › s02).
 * One object, one function: the scanner only looks inside; Sigma is the magnifying glass that READS the
 * gate's logbook (it does not write it).
 */

export const YARA_LABEL = { name: 'YARA', text: 'mira dentro: ficheros y memoria' } as const;
export const SIGMA_LABEL = { name: 'SIGMA', text: 'lee lo que ocurre: los registros' } as const;

/** The two chips on `pair`, each lit on its own word of s02-05. */
export const PAIR = [
  { name: 'YARA', rest: ': lo que hay dentro', word: 'YARA' },
  { name: 'Sigma', rest: ': lo que ha pasado', word: 'Sigma' },
] as const;

/** What everybody carries (no 'rare' piece here: that is s03's). */
export const SUITCASE_ITEMS = ['bottle', 'umbrella', 'book'] as const;
