/**
 * s03-alcance «Hasta dónde llega un portátil» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * Today (the napkin): a laptop in Oficinas reaches the portal and the three other VLAN; Operaciones stays out
 * behind its internal firewall (shown, never voiced, and never called «el único»). The plan (ZoneRow): six
 * zones with their confidence and no system names; the laptop's caption lives in the shared part
 * (`REACH_TEXT`). Nothing of the plan is running yet: it is drawn as a blueprint.
 */
import type { IconName } from '../../../engine/src/ui';
import { NAPKIN_TEXT, type NapkinReachTarget } from '../scenes/parts/Napkin';

/** s03-01 «Imagina que alguien se hace con un portátil de Oficinas. ¿Hasta dónde llega desde ahí?». */
export const QUESTION = { who: 'un portátil de Oficinas', q: '¿hasta dónde llega?' } as const;

/** The tally beside the napkin while the reach lines light (the napkin's own names). */
export const REACH_LEAD = 'alcanza:';
export const REACHED: readonly { id: NapkinReachTarget; name: string }[] = [
  { id: 'portal', name: NAPKIN_TEXT.portal },
  { id: 'administracion', name: NAPKIN_TEXT.administracion },
  { id: 'produccion', name: NAPKIN_TEXT.produccion },
  { id: 'pruebas', name: NAPKIN_TEXT.pruebas },
];
export const HELD = NAPKIN_TEXT.operaciones;

/** Exam term on `surface` (kept in English). */
export const TERM = 'ATTACK SURFACE';

/** «cada servicio publicado · cada excepción · cada camino de más», each on its word in s03-05. */
export const SURFACE_CHIPS: readonly { text: string; word: string; icon: IconName }[] = [
  { text: 'cada servicio publicado', word: 'servicio', icon: 'globe' },
  { text: 'cada excepción', word: 'excepción', icon: 'unlock' },
  { text: 'cada camino de más', word: 'camino', icon: 'split' },
];
