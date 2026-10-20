/** s01-hook «Dos aplicaciones de oficina» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'Sistemas · propuesta · sin fecha' } as const;

/** The data centre's label. */
export const ROOM = 'centro de datos del puerto';

/** The two office apps that light on `two-apps` (host row, VM column, label). */
export const APPS = [
  { row: 0, col: 3, text: 'tablón interno de anuncios' },
  { row: 1, col: 3, text: 'expedientes de la plantilla · RR. HH.' },
] as const;

/** The chip that says which containers: software ones (the voice: «De software, nada que ver con los del muelle»). */
export const SOFTWARE = 'a contenedores de software';

/** «Contenedores, VMs y quién gestiona», in two lines for the right column. */
export const TITLE = ['Contenedores, VMs', 'y quién gestiona'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 3.1';

/** The promise, one chip per chapter, each lit on the word that names it (`seg`, `word`). */
export const PROMISE: { text: string; seg: string; word: string; icon: IconName }[] = [
  { text: 'qué se arregla dónde', seg: 's01-03', word: 'arregla', icon: 'gear' },
  { text: 'qué aísla más', seg: 's01-03', word: 'aísla', icon: 'layers' },
  { text: 'quién decide', seg: 's01-03', word: 'decide', icon: 'users' },
];
