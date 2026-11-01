/** s04-califs «Qué te piden» — on-screen strings (canon: out/scene-brief.md). The qualifiers themselves are in qualifiers.ts. */
import type { QualifierId } from './qualifiers';

/** The same four blank cards under every qualifier: no security content. */
export const OPTION_LABELS = ['opción 1', 'opción 2', 'opción 3', 'opción 4'] as const;

/** Which card lights for each qualifier (0-based) and the word of segment s04-03 that lights it. */
export const ANSWERS: { id: QualifierId; card: number; word: string }[] = [
  { id: 'best', card: 2, word: 'best' },
  { id: 'first', card: 0, word: 'first' },
  { id: 'likely', card: 3, word: 'most' },
  { id: 'least', card: 1, word: 'least' },
];

/** The fixed phrase, in two halves (the first lit on «tentar», the second on «encaja»). */
export const RULE = { tempt: 'dos tientan', fits: 'una encaja con el objetivo oficial' } as const;

/** Cards that tempt and the one that fits, once the rule is said. */
export const RULE_CARDS = { tempt: [0, 2], fits: 2 } as const;
