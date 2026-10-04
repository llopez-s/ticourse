/**
 * s02-fuera «Sácalo de la cabeza» — on-screen strings (canon: out/scene-brief.md). The technique names are the
 * lesson's list (src/data/s4.ts:380-384); the exam terms stay in English.
 */

/** The two faint bias names that peek out of the head (exam terms, English). */
export const S02_BIASES = ['confirmation bias', 'anchoring'] as const;

export const S02_SHEET_TITLE = 'STRUCTURED ANALYTIC TECHNIQUES';

export type TechniqueId = 'kac' | 'devil' | 'whatif' | 'brainstorm' | 'ach';

/**
 * The five technique cards, in the lesson's order. `today` marks the three this video uses («hoy usas
 * tres»): Devil's Advocacy (s02), Key Assumptions Check (s03), ACH (s04).
 */
export const TECHNIQUES: readonly { id: TechniqueId; name: string; today: boolean }[] = [
  { id: 'kac', name: 'Key Assumptions Check', today: true },
  { id: 'devil', name: "Devil's Advocacy", today: true },
  { id: 'whatif', name: 'What-If Analysis', today: false },
  { id: 'brainstorm', name: 'brainstorming estructurado', today: false },
  { id: 'ach', name: 'ACH', today: true },
];

/** The role card the colleague receives (canon, exact: «abogada del diablo · defiende lo contrario»). */
export const S02_ROLE = { title: 'abogada del diablo', sub: 'defiende lo contrario' } as const;

/** The name, said on `advocacy` (exam term). */
export const S02_NAME = "DEVIL'S ADVOCACY";
