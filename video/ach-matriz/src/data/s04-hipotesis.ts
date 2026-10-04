/**
 * s04-hipotesis «Todas a la vez» — on-screen strings (canon: out/scene-brief.md). The kitchen's texts live in
 * scenes/parts/Kitchen.tsx (KITCHEN_TEXT); the hypotheses in data/matrix.ts (HYPOTHESES).
 */

/** The three techniques this video uses, numbered in the order the voice introduces them (s02, s03, s04). */
export const S04_TECHS = ['devil', 'kac', 'ach'] as const;

/** The name (exam term) and its author (src/data/s4.ts:388-391). */
export const S04_NAME = { term: 'ANALYSIS OF COMPETING HYPOTHESES', short: '(ACH)', author: 'Richards Heuer' } as const;

/** The strip on `all-first` (canon, exact), in its two halves (they land on «Primero» and «después»). */
export const S04_STRIP = { first: 'primero todas, con el equipo;', then: 'después, las pruebas' } as const;
