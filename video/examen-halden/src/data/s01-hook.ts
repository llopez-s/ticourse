/** s01-hook «Del puerto a la pantalla» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The seal: no date and no «caso de ejemplo» (there is no case here). */
export const SEAL = { what: 'Autoridad Portuaria de Halden', kind: 'del puerto al examen' } as const;

/** The title, in two lines for the right column («Del puerto» white, «al examen» cyan). */
export const TITLE = ['Del puerto', 'al examen'] as const;

/** Scene art plate: the exam name with no objective number. */
export const PLAQUE = 'SY0-701';

/** The exam screen: question counter and timer, as data. */
export const SCREEN = { counter: '1 / 90', timer: '90:00' } as const;

/** The promise, one chip per beat, each lit on the word that starts it (`word` in segment `seg`). */
export const PROMISE: { text: string; seg: string; word: string; icon: IconName }[] = [
  { text: 'qué te piden', seg: 's01-02', word: 'piden', icon: 'search' },
  { text: 'qué descartas', seg: 's01-02', word: 'descartas', icon: 'funnel' },
  { text: 'cuánto tiempo tienes', seg: 's01-02', word: 'tiempo', icon: 'bolt' },
];
