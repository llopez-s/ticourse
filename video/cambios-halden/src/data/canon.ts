/**
 * On-screen strings shared by several scenes (the brief's «Canon»). Exam terms stay in English; everything else is
 * Spanish. No names, dates, hosts, products or people: the request is an example «sin fecha».
 */

/** The case stamp (s01). */
export const STAMP = ['Autoridad Portuaria de Halden', 'petición de ejemplo', 'sin fecha'] as const;

export const TITLE = ['Antes, durante', 'y después', 'de un cambio'] as const;
export const PLAQUE = 'SY0-701 · 1.3';

/** Drawn by the question scenes: the engine's panel only prints «EXAMEN · SY0-701 · 1.3». */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';

/** The change request (the video's thread, s01–s08). */
export const REQUEST = {
  kicker: 'PETICIÓN DE CAMBIO',
  title: ['Poner al día las carpetas', 'compartidas de las oficinas'],
  owner: 'dueño del cambio',
  ownerArea: 'Sistemas',
} as const;

/** The three boxes that must be ticked before the committee signs (s02, s03, s08). */
export const CHECKS = [
  { term: 'IMPACT ANALYSIS', gloss: ['qué toca y a quién'] },
  { term: 'PRUEBAS', gloss: ['en un entorno de prueba,', 'no en producción'] },
  { term: 'BACKOUT PLAN', gloss: ['cómo se deshace ·', 'escrito antes de tocar'] },
] as const;

/** The request's stamp, in the order it changes. */
export type StampKind = 'unsigned' | 'cab' | 'verified' | 'closed';
export const STAMP_TEXT: Record<StampKind, string> = {
  unsigned: 'sin firmar',
  cab: 'CAB · firmado',
  verified: 'comprobado',
  closed: 'cerrado',
};

/** The site-list image (s04, s05, s08). */
export const SITE_LABEL = 'imagen · no es del puerto';

/** The five silent chips of s04. */
export const RESTART_CHIPS = [
  ['SERVICE RESTART', 'APPLICATION RESTART', 'DOWNTIME'],
  ['RESTRICTED ACTIVITIES', 'LEGACY APPLICATIONS'],
] as const;
