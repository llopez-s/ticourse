/** s01-hook «Cinco pantallas para lo mismo» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';
import type { ToolIcon } from '../scenes/parts/Tools';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** Next to the stamp, on `night`. */
export const NIGHT = 'una noche · sin fecha';

/** «Una tarea o un flujo», in two lines for the right column. */
export const TITLE = ['Una tarea', 'o un flujo'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 4.7';

/** The five windows the on-call person copies the alert into by hand, no product names. */
export const WINDOWS: { label: string; icon: ToolIcon }[] = [
  { label: 'EDR', icon: 'shield' },
  { label: 'proveedor de identidad', icon: 'user' },
  { label: 'cola del SOC', icon: 'archive' },
  { label: 'correo', icon: 'mail' },
  { label: 'teléfono', icon: 'phone' },
];

/** The promise, one chip per chapter, each lit on the word that starts it (`seg`, `word`, `nth`). */
export const PROMISE: { text: string; seg: string; word: string; nth: number; icon: IconName }[] = [
  { text: 'una tarea', seg: 's01-02', word: 'tarea', nth: 1, icon: 'bolt' },
  { text: 'el flujo entero', seg: 's01-02', word: 'encadena', nth: 0, icon: 'link' },
  { text: 'lo que cuesta', seg: 's01-02', word: 'cuesta', nth: 0, icon: 'alert' },
];
