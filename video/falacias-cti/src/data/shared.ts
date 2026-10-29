/** Strings shared by several scenes. Exact canon: see out/scene-brief.md «Canon». Never add a date, host, IP or real name. */

/** The desk label of G02, V22, V23 and V27, verbatim (niveles-audiencia/src/data/niveles.ts). */
export const CONTEXT = ['Meridian Dynamics', 'aeroespacial', 'tú, su analista de inteligencia'] as const;

/** Fixed note of s03-s05: the sentences on screen are the lesson's, not the campaign's (same as G04). */
export const EXAMPLE_NOTE = 'Frases de ejemplo de la lección · no son el caso de Meridian';

/** PAPER CRANE's card (V9, V23; src/data/course-gcti.ts:74-76). */
export const CRANE_CARD = { name: 'PAPER CRANE', role: 'célula de engaño', does: 'siembra pistas falsas' } as const;

/** The draft report of s01: every line is a bar, only these labels are words. */
export const DRAFT = {
  title: 'Borrador de informe · ejemplo',
  notice: 'Borrador de ejemplo · no es un informe de Meridian',
  proofs: ['prueba 1', 'prueba 2', 'prueba 3'],
  ok: 'parecen en orden',
  conclusion: 'conclusión',
} as const;

/** The video's title, in two lines for the hook, the end card and the poster. */
export const TITLE = { lead: 'Falacias lógicas', rest: 'en CTI', sub: 'el paso que no se sostiene' } as const;

/** Names of the three fallacies the video tells (English: they are the exam's terms). */
export const NAMES = {
  authority: 'APPEAL TO AUTHORITY',
  hominem: 'AD HOMINEM',
  circular: 'CIRCULAR REASONING',
  circularEs: 'RAZONAMIENTO CIRCULAR',
} as const;
