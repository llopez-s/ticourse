/** s01-hook «Una recepción, muchas entradas» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** «Un camino o todos», in two lines for the right column. */
export const TITLE = ['Un camino', 'o todos'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 2.2';

/** The promise, one chip per chapter, each lit on the word that starts it (`seg`, `word`, `nth`). */
export const PROMISE: { text: string; seg: string; word: string; nth: number; icon: IconName }[] = [
  { text: 'un camino o todos', seg: 's01-02', word: 'difícil', nth: 0, icon: 'split' },
  { text: 'el camino, no el cebo', seg: 's01-02', word: 'cebo', nth: 0, icon: 'target' },
  { text: 'cuando entra un tercero', seg: 's01-02', word: 'acceso', nth: 0, icon: 'users' },
];
