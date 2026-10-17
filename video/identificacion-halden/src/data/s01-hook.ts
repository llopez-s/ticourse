/** s01-hook «Ninguno lo ve todo» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** «Qué ve cada método», broken in two lines for the right column. */
export const TITLE = ['Qué ve', 'cada método'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 4.3';

/**
 * The promise, one chip per look, each lit on the word that names it in s01-02 («en las máquinas, en las aplicaciones
 * y fuera de casa»); `sil` = the silhouette it lights (0 server, 1 application, 2 the door onto the street).
 */
export const PROMISE: { text: string; word: string; icon: IconName; sil: 0 | 1 | 2 }[] = [
  { text: 'con cuenta o sin ella', word: 'máquinas', icon: 'server', sil: 0 },
  { text: 'código o en marcha', word: 'aplicaciones', icon: 'app', sil: 1 },
  { text: 'lo que pasa fuera', word: 'fuera', icon: 'globe', sil: 2 },
];
