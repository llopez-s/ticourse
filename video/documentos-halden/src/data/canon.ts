/**
 * On-screen strings shared by several scenes (the brief's «Canon»). Exam terms stay in English; everything else is
 * Spanish. The four papers are a PROPOSAL of the port («propuesta · sin fecha»): no person, team, file, address or date.
 * The exchange platform has no name and no product. The pool and its signs are a picture, tagged «imagen · no es del
 * puerto», and the three exam questions happen outside the port.
 */

/** The proposal stamp of s01 (the storyboard's own words). */
export const STAMP_S01 = ['Autoridad Portuaria de Halden', 'documentación del programa', 'propuesta · sin fecha'] as const;

/** The proposal stamp of s02 and s04: the case is the rule for sending documents out. */
export const STAMP_CASE = ['Autoridad Portuaria de Halden', 'enviar documentos fuera', 'propuesta · sin fecha'] as const;

/** s01's title (two lines); the poster and the end card carry the whole sentence in three. */
export const TITLE = ['Cuatro', 'papeles'] as const;
export const POSTER_TITLE = ['Cuatro papeles', 'qué obliga y', 'qué solo aconseja'] as const;
export const PLAQUE = 'SY0-701 · 5.1';

/** Drawn by the question scenes: the engine's panel only prints «EXAMEN · SY0-701 · 5.1» (registry contradiction 17). */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo · no es del puerto';

/** Under every picture of the pool. */
export const IMAGE_TAG = 'imagen · no es del puerto';

/** The four documents, in the order of the video. */
export type DocKind = 'policy' | 'standard' | 'procedure' | 'guideline';
export const DOC_NAMES: Record<DocKind, string> = {
  policy: 'POLICY',
  standard: 'STANDARD',
  procedure: 'PROCEDURE',
  guideline: 'GUIDELINE',
};
export const DOC_ORDER: readonly DocKind[] = ['policy', 'standard', 'procedure', 'guideline'];

/** Whether each one obliges (the first of the two questions). */
export const OBLIGES: Record<DocKind, boolean> = { policy: true, standard: true, procedure: true, guideline: false };

/** The sheet text of s01: all four say «POLÍTICA» at the top and nothing else is readable. */
export const WRONG_LABEL = 'POLÍTICA';
