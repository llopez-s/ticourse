/**
 * s01-hook «Si el centro de datos no está» — on-screen strings (canon: out/scene-brief.md «Canon strings» › s01).
 * One box «CPD» (the voice says «centro de datos»), a clock with no numbers, the title, the promise as three chips
 * lit on their own words, and BLIND ARCHITECT's tag. No date, no hour, no figure, no host.
 */
import type { IconName } from '../../../engine/src/ui';

/** The stamp of the review (no date). */
export const STAMP = 'plan de recuperación · revisión · propuesta · sin efectos';

/** The one box: the data centre, on screen only as «CPD». */
export const DC_LABEL = 'CPD';

export const TITLE = 'Recuperación ante desastres';

/** The promise (s01-02 «Qué sitio elegir, qué prueba demuestra qué, y cuándo una copia vuelve»), one chip per idea. */
export const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'qué sitio', word: 'sitio', icon: 'flag' },
  { text: 'qué prueba demuestra qué', word: 'prueba', icon: 'check' },
  { text: 'una copia que vuelve', word: 'copia', icon: 'archive' },
];

/** «BLIND ARCHITECT · sección 3» with «vive de los planos con atajos» (rose; a label only, never a portrait). */
export const ADVERSARY = { name: 'BLIND ARCHITECT', section: 'sección 3', line: 'vive de los planos con atajos' } as const;
