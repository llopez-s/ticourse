import type { ColumnId, ColumnState } from '../scenes/parts/Board';
import { CASE_TIMES } from '../scenes/parts/Board';
import type { WhyStepDef } from '../scenes/parts/s08-rca/WhyChain';

/** s08-rca «Despide a Lucía»: scene-only text (canon: out/scene-brief.md). */

/**
 * The board once the incident is over (s08–s10): every phase that has run is
 * ticked. Only three canon times exist (CASE_TIMES); Análisis, Erradicación and
 * Recuperación get an unlabeled tick. Preparación and Lecciones aprendidas are
 * left to the scene (s09 ticks them).
 */
export const CLOSED_BOXES: Partial<Record<ColumnId, ColumnState>> = {
  detect: { box: 'checked', time: CASE_TIMES.declared },
  analysis: { box: 'checked' },
  contain: { box: 'checked', time: CASE_TIMES.containment },
  eradicate: { box: 'checked' },
  recover: { box: 'checked' },
};

/** The closing meeting, in the body of Lecciones aprendidas (s08-01). */
export const MEETING = {
  date: '2026-09-11',
  when: 'una semana después',
  title: 'reunión de cierre',
  question: '¿sale mejor de lo que entró?',
} as const;

/** s08-02: what the meeting is not for, and what it is for. */
export const BLAME = {
  no: 'no',
  noText: '¿a quién culpar?',
  yes: 'sino',
  yesText: '¿por qué funcionó el ataque?',
} as const;

/** s08-03: the leak. */
export const LEAK_TEXT = {
  symptomTag: 'el síntoma',
  symptom: 'fregar el suelo',
  reinstall: 'reinstalar el portátil',
  causeTag: 'la causa',
  cause: 'el agujero del tejado',
} as const;

/** RCA chain 1 (exact canon text; the long steps break onto two lines). */
export const CHAIN1: WhyStepDef[] = [
  { lines: ['Lucía abrió un adjunto'], icon: 'mail' },
  { lines: ['se ejecutó la macro'], icon: 'file' },
  { lines: ['Operaciones tenía una excepción', 'a la norma de macros'], icon: 'unlock' },
  { lines: ['la excepción, de hace dos años,', 'no caducaba nunca'], icon: 'clock' },
];

export const CHAIN1_TAGS = {
  anyone: 'como cualquiera',
  retired: 'ya retirada',
  cause: 'la gotera de verdad',
  fixable: 'se puede arreglar',
} as const;

/** s08-06: the exam term, with the Spanish the voice says first. */
export const RCA_TERM = { es: 'buscar la causa de fondo', en: 'root cause analysis', label: 'en el examen' } as const;
