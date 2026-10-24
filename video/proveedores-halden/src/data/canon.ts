/**
 * On-screen strings shared by several scenes (the brief's «Canon»). Exam terms stay in English; everything else is
 * Spanish. No names, dates, hosts or people: the translation agency is a proposal of the port, «sin fecha», its three
 * candidates have no names, nobody has signed anything, and the agency enters no system of the port. The three exam
 * questions (s03, s05, s07) are examples from outside the port and carry no port fact.
 */

/** The proposal stamp (s01). */
export const STAMP = ['Autoridad Portuaria de Halden', 'selección de un proveedor', 'propuesta · sin fecha'] as const;

/** s01's title (the voice: «Antes, al firmar y después»). */
export const TITLE = ['Antes, al firmar', 'y después'] as const;
/** The poster's and the end card's title: the lesson block's («Proveedores: antes de firmar, al firmar y después»). */
export const FULL_TITLE = ['Proveedores:', 'antes de firmar,', 'al firmar y después'] as const;
export const PLAQUE = 'SY0-701 · 5.3';

/** Drawn by the question scenes: the engine's panel only prints «EXAMEN · SY0-701 · 5.3». No «no es del puerto» (the storyboard does not ask). */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';

/** Under the everyday image of the video (the nursery). */
export const IMAGE_TAG = 'imagen · no es del puerto';

/** s02: the fixed label (no account, no access, no system). */
export const NO_ACCESS = 'no entra en ningún sistema del puerto';

/** s06: the fixed «other papers» chip, shared with s07's resolution (MOA lit). */
export const OTHERS = [
  { key: 'mou', sigla: 'MOU', text: 'intención' },
  { key: 'moa', sigla: 'MOA', text: 'compromisos repartidos' },
  { key: 'bpa', sigla: 'BPA', text: 'socios que reparten el negocio' },
] as const;
