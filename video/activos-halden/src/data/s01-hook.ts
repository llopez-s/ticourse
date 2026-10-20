/** s01-hook «Un aparato que nadie apuntó» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** The port's list of equipment, where the disk does not appear. */
export const LIST_TITLE = 'lista de equipos';
export const MISSING = 'no aparece';

/** «De la lista al desguace», in two lines for the right column. */
export const TITLE = ['De la lista', 'al desguace'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 4.2';

/** The promise, one chip per chapter, each lit on the word that starts it (`seg`, `word`, `nth`). */
export const PROMISE: { text: string; seg: string; word: string; nth: number; icon: IconName }[] = [
  { text: 'la lista y quien mira', seg: 's01-03', word: 'encontrarlo', nth: 0, icon: 'search' },
  { text: 'de quién es y qué trato', seg: 's01-03', word: 'quién', nth: 0, icon: 'user' },
  { text: 'cómo se va', seg: 's01-03', word: 'va', nth: 0, icon: 'power' },
];
