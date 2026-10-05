/**
 * s01-hook «Tres rastros de una noche» — on-screen strings (canon: out/scene-brief.md). The queue and its
 * three rows live in the shared part `scenes/parts/TrailRow.tsx` (TRAILS, QUEUE).
 */
import type { Accent } from '../../../engine/src/theme/tokens';
import type { IconName } from '../../../engine/src/ui';
import type { TrailKind } from '../scenes/parts/TrailRow';

export const TITLE = { lead: 'Ataques en los ', accent: 'logs' } as const;

/** The promise (s01-02 «a verla, a ponerle nombre y a decidir qué hacer»), one chip per word the voice says. */
export const PROMISE: { text: string; word: string; icon: IconName; accent: Accent }[] = [
  { text: 'la forma', word: 'verla', icon: 'eye', accent: 'cyan' },
  { text: 'el nombre', word: 'nombre', icon: 'mortarboard', accent: 'violet' },
  { text: 'qué hacer', word: 'decidir', icon: 'shield', accent: 'emerald' },
];

/** The word of s01-03 on which each row lights («una llave…, una URL…, un chorro…»). */
export const ROW_WORDS: Record<TrailKind, string> = { key: 'llave', folder: 'URL', pipe: 'chorro' };
