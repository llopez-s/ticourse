/**
 * s03-supuestos «Lo que das por hecho» — on-screen strings (canon: out/scene-brief.md). The sheet's own texts
 * live in scenes/parts/AssumptionSheet.tsx (SHEET_TEXT), the pocket's in scenes/parts/Pocket.tsx.
 */

/** PAPER CRANE's card (canon: «PAPER CRANE · célula de engaño · siembra pistas falsas», src/data/course-gcti.ts:74-76). */
export const CRANE_CARD = { name: 'PAPER CRANE', role: 'célula de engaño', does: 'siembra pistas falsas' } as const;

/**
 * s03-02 «Fíjate en lo que pide… Eso es un supuesto»: the second sentence of the intercepted message, quoted,
 * and the word the voice gives it (stamp).
 */
export const S03_ASK = { quote: 'Las pruebas nunca mienten.', stamp: 'supuesto' } as const;
