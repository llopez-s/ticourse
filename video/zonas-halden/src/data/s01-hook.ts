/**
 * s01-hook «El plano de la servilleta» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * The napkin draws its own labels (`NAPKIN_TEXT` in scenes/parts/Napkin.tsx); this file holds only what the
 * scene adds around it: Monday's stamp, the title with its English line, the promise chips and BLIND
 * ARCHITECT's tag (a label: no portrait, no gender mark). No other date or time anywhere.
 */
import type { IconName } from '../../../engine/src/ui';

/** «16-11 · lunes · rediseño de la red». */
export const STAMP = { day: '16-11', weekday: 'lunes', what: 'rediseño de la red' } as const;

/** «Zonas de seguridad», its first word lit. */
export const TITLE = { lead: 'Zonas', rest: ' de seguridad' } as const;
/** «security zones · device placement · failure modes» (exam terms, kept in English). */
export const SUBTITLE = ['security zones', 'device placement', 'failure modes'] as const;

/** The promise (s01-02 «Sabrás qué va junto, dónde va cada control y qué pasa cuando uno falla»), one chip per idea. */
export const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'qué va junto', word: 'junto', icon: 'layers' },
  { text: 'dónde va cada control', word: 'control', icon: 'shield' },
  { text: 'qué pasa si falla', word: 'falla', icon: 'alert' },
];

/** «BLIND ARCHITECT · sección 3» with «vive de los planos con atajos» (rose; a label only). */
export const ADVERSARY = { name: 'BLIND ARCHITECT', section: 'sección 3', line: 'vive de los planos con atajos' } as const;
