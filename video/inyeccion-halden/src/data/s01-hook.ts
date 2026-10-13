/**
 * s01-hook «Tres cajas de texto» — on-screen strings (storyboard `goal`; canon from the ficha). The copy is a TEST
 * copy of the truck-appointment portal with fictitious data: no domain, no place in the network, never the booking
 * portal. Date-led strip in lower case, as the other videos' strips.
 */
import type { IconName } from '../../../engine/src/ui';
import type { MiniScreenDef } from '../scenes/parts/Login';

export const DATE = { day: '05-11', weekday: 'jueves', time: '10:00', what: 'revisión antes de publicar' } as const;

export const APP = { name: 'Citas de camiones', rest: 'entorno de pruebas · datos ficticios' } as const;

/** The title (s01-02 «Vas a ver cómo un texto se vuelve orden»); `hot` is the word that lights. */
export const TITLE = { before: 'Cuando un ', hot: 'texto', after: ' se vuelve orden' } as const;

/** The three boxes (s01-01 «las tres cajas donde la gente escribe»), in the order the voice walks them. */
export const SCREENS: readonly MiniScreenDef[] = [
  { kind: 'login', name: 'el login', title: 'Acceso' },
  { kind: 'search', name: 'el buscador de citas', title: 'Buscar cita' },
  { kind: 'notes', name: 'las observaciones', title: 'Observaciones' },
];

/** The promise: one chip per box (storyboard `promise`). */
export const PROMISE: readonly { text: string; icon: IconName }[] = [
  { text: 'el login', icon: 'lock' },
  { text: 'la búsqueda', icon: 'search' },
  { text: 'las observaciones', icon: 'file' },
];
