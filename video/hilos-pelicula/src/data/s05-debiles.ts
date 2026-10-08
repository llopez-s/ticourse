/**
 * s05-debiles «Lo que lleva todo el mundo» — on-screen strings outside the table (canon:
 * out/scene-brief.md «Canon strings», s04–s05). Rows 4–5 and their marks live in
 * scenes/parts/CompareTable.tsx (COMPARE_TEXT).
 */

/** The lesson's list of what does not join (`src/data/s2.ts:834,842-843`), in the voice's order. */
export const WEAK_LIST = ['PowerShell', 'Cobalt Strike', 'phishing'] as const;

/** Under the list (`weak-list`). */
export const WEAK_LIST_NOTE = 'miles de actores';

/** Beside the tape on every box (`tape`). */
export const TAPE_CAPTION = 'como todas las cajas';

/**
 * The small line that links with V7 (`detect-vs-group`): «para que una detección dure: lo que le
 * cuesta cambiar · para agrupar: además, que sea raro», split in its two halves (each enters with its sentence).
 */
export const DETECT_VS_GROUP = ['para que una detección dure: lo que le cuesta cambiar ·', 'para agrupar: además, que sea raro'] as const;
