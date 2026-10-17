/** s01-hook «Una cerradura, dos preguntas» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** «Un control, dos etiquetas», broken in two lines for the right column. */
export const TITLE = ['Un control,', 'dos etiquetas'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 1.1';

/**
 * The promise, one chip per idea, each lit on the word that starts it (s01-02). `box` = the tag's box the idea
 * belongs to (category up, type down; «cuándo compensa» is a type, so it lights the bottom box too).
 */
export const PROMISE: { text: string; word: string; icon: IconName; tone: 'cyan' | 'violet'; box: 'top' | 'bottom' }[] = [
  { text: 'quién lo hace funcionar', word: 'quién', icon: 'user', tone: 'cyan', box: 'top' },
  { text: 'qué hace', word: 'qué', icon: 'gear', tone: 'violet', box: 'bottom' },
  { text: 'cuándo compensa', word: 'cuándo', icon: 'split', tone: 'violet', box: 'bottom' },
];
