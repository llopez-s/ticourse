/**
 * s02-toma «Una toma en la sala de formación» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * Monday 23-11 in the training room: a free wall socket, the test laptop plugged in, its console, the analyst's
 * own note, the floor of the office building, and where the laptop landed (Oficinas, which the plan will turn
 * into the internal zone — drawn as plan: it is not running yet). Only THIS socket did not ask: nothing here
 * generalises about the port's sockets or its network access control.
 */
import type { IconName } from '../../../engine/src/ui';

/** «23-11 · lunes · 09:40 · sala de formación, planta de oficinas». */
export const STAMP = { day: '23-11', weekday: 'lunes', time: '09:40', where: 'sala de formación, planta de oficinas' } as const;

/** The test laptop (screen only: the voice never reads it). */
export const HOST = 'ptl-pruebas-02';

/** Console output on the laptop's screen. */
export const CONSOLE = { link: 'enlace: arriba', dhcp: 'DHCP: 10.20.6.140 · 3 s' } as const;

/** The analyst's handwritten note (not console output: a laptop does not see its VLAN), on two lines. */
export const NOTE = ['VLAN', 'Oficinas'] as const;

/** s02-03, on `nobody` (two lines). */
export const NOBODY = ['nadie ha preguntado', 'quién es'] as const;

/** s02-04: what the floor has, each on its word (legend chips under the floor plan). */
export const FLOOR_LEGEND: { text: string; word: string; icon: IconName }[] = [
  { text: 'salas de reuniones', word: 'Salas', icon: 'users' },
  { text: 'visitas', word: 'visitas', icon: 'user' },
  { text: 'tomas libres', word: 'tomas', icon: 'plug' },
];

/** s02-05, on `inside`: lead in white, the rest in amber. */
export const INSIDE = { lead: 'estar dentro del edificio ', rest: 'no dice quién eres' } as const;

/** s02-06: today's office network (V16's VLAN name) and what the plan will make of it. */
export const OFFICES = 'Oficinas';
export const PLAN_CAPTION = 'la que el plan convertirá en zona interna';
