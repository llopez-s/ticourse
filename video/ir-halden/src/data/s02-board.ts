import type { IconName } from '../../../engine/src/ui';
import { CASE_TIMES } from '../scenes/parts/Board';

/** s02-board: scene-only text. The board's own text lives in parts/Board.tsx (COLUMNS). */

/** Preparación, lit on s02-02: the only phase before the incident. `word` is where the narration says it. */
export const PREP_TAG = 'antes del incidente';
export const PREP_ITEMS: { icon: IconName; text: string; word: string }[] = [
  { icon: 'file', text: 'el plan', word: 'plan' },
  { icon: 'users', text: 'quién hace qué', word: 'hace' },
  { icon: 'user', text: 'quién le sustituye', word: 'sustituye' },
];

/** The hasty tick of s02-03 (a box marked before its condition holds). */
export const HASTY_TAG = 'con prisa';

/** The case card that fills in the Detección column on s02-04 (canon: V5 brief). */
/** `word` (s02-04) is where the value fills in; `after` delays it by that many frames. */
export type CaseField = { label: string; kind: 'mono' | 'severity' | 'check'; value: string; word: string; after?: number };
export const CASE_FIELDS: CaseField[] = [
  { label: 'caso', kind: 'mono', value: 'IR-2026-0147', word: 'número' },
  { label: 'declarado', kind: 'mono', value: `2026-09-03 ${CASE_TIMES.declared} CEST`, word: 'hora' },
  { label: 'gravedad', kind: 'severity', value: 'ALTA', word: 'gravedad' },
  { label: 'notificado', kind: 'check', value: '', word: 'gravedad', after: 22 },
];

/** Time written next to the Detección tick. */
export const DECLARED_TIME = CASE_TIMES.declared;

/** «Desde ese momento corre el reloj» (s02-05). */
export const CLOCK_TAG = 'reloj en marcha';
