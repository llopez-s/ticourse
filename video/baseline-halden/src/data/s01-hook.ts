/** s01-hook «Un papel, muchas máquinas» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** «Baseline y hardening», in two lines for the right column. */
export const TITLE = ['Baseline', 'y hardening'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 4.1';

/** The promise, one chip per chapter, each lit on the word that starts it (`seg`). */
export const PROMISE: { text: string; seg: string; word: string; icon: IconName }[] = [
  { text: 'escribirlo y mantenerlo', seg: 's01-02', word: 'escribe', icon: 'file' },
  { text: 'cada uno, su canal', seg: 's01-03', word: 'llega', icon: 'split' },
  { text: 'lo que no se puede parar', seg: 's01-03', word: 'haces', icon: 'power' },
];
