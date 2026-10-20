/** s06-sobra «Un servidor recién montado» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

export const SERVER_LABEL = ['servidor nuevo', 'antes de ponerlo', 'en marcha'] as const;
export const LIST_HEAD = 'trae de fábrica';
export const PATCH_BOX = 'parches pendientes';

/**
 * What the new server brings from the factory. `fate`: `gone` leaves on the `gone` cue (the whoosh), `remove` leaves
 * when the list shrinks, `close` / `change` stay with a small emerald tag on their verb's word.
 */
export const ITEMS: { text: string; fate: 'gone' | 'remove' | 'close' | 'change'; tag?: string }[] = [
  { text: 'un navegador', fate: 'gone' },
  { text: 'un paquete ofimático', fate: 'remove' },
  { text: 'herramientas de ejemplo', fate: 'remove' },
  { text: 'servicios escuchando', fate: 'close', tag: 'cerrados los que sobran' },
  { text: 'la contraseña de la consola', fate: 'change', tag: 'cambiada' },
];

/** The three verbs, each lit on its word (`seg`, `word`). The first one carries its exam name. */
export const VERBS: { verb: string; what: string; seg: string; word: string; icon: IconName; term?: string; termWord?: string }[] = [
  { verb: 'quitar', what: 'lo que no se usa', seg: 's06-02', word: 'quitar', icon: 'x', term: 'Removal of unnecessary software', termWord: 'removal' },
  { verb: 'cerrar', what: 'lo que escucha sin uso', seg: 's06-03', word: 'cierras', icon: 'power' },
  { verb: 'cambiar', what: 'lo que viene de fábrica', seg: 's06-03', word: 'cambias', icon: 'key' },
];

export const HARDENING = 'Hardening';
export const SURFACE = 'Attack surface';
export const SURFACE_NOTE = 'ya la conoces';

/** The gym fee, in miniature. */
export const GYM_LINE = 'pagar otra vez no te hace ir';

/** The rule: the main line in two parts, and under it the other half, so it is never read backwards. */
export const RULE = {
  main: ['el parche arregla el fallo de hoy;', 'quitar lo que sobra quita la pregunta'],
  other: 'lo que hace falta, se parchea',
} as const;
