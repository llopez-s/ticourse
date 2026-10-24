/**
 * On-screen strings shared by several scenes (the brief's «Canon»). Exam terms stay in English; everything else is
 * Spanish. No names, dates, hosts or people: the time-clock system is a proposal of RR. HH. «sin fecha», the record's
 * name, full DNI and hours are always redacted bars, and the only readable DNI is the invented masked fragment of s04.
 */

/** The proposal stamp (s01). */
export const STAMP = ['Autoridad Portuaria de Halden', 'control de horario', 'propuesta · sin fecha'] as const;

/** s01's title is the first two lines; the poster and the end card add the third. */
export const TITLE = ['Dónde está', 'el dato', 'y qué lo protege'] as const;
export const PLAQUE = 'SY0-701 · 3.3';

/** Drawn by the question scenes: the engine's panel only prints «EXAMEN · SY0-701 · 3.3». */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';

/** Under both images of the video (the piggy bank, the storage room). */
export const IMAGE_TAG = 'imagen · no es del puerto';

/** The record's chip: what the data is, never who classified it. */
export const RECORD_CHIP = 'datos de la plantilla · private';

/** s04: the invented masked fragment (screen only, never said). */
export const MASKED_ID = '*****678Z';

/** s04: synthetic tokens of the report (obviously meaningless, not number-like). */
export const TOKENS = ['tk·Q7XM', 'tk·RW2B', 'tk·HN5C'] as const;
