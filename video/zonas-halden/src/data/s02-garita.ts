/**
 * s02-garita «Una valla con la garita vacía» — on-screen strings (canon: out/scene-brief.md «Canon» and the
 * storyboard goal). The port seen from above: the street, the passenger terminal, the offices, the dock and
 * Operations' control room (just one more fenced area, not s05's network control room), each with its fence
 * and a checkpoint at the gate. The napkin draws its own labels and the halt note. Nothing of the September
 * case, no contractors, no OT: Producción is only the example packet's destination.
 */
import type { IconName } from '../../../engine/src/ui';

export type PortAreaId = 'terminal' | 'oficinas' | 'muelle' | 'control';

/** The four fenced areas, left to right (each a name in one or two lines and a pictogram). */
export const PORT_AREAS: readonly { id: PortAreaId; name: readonly string[]; icon: IconName | 'containers' }[] = [
  { id: 'terminal', name: ['terminal', 'de pasajeros'], icon: 'users' },
  { id: 'oficinas', name: ['oficinas'], icon: 'desktop' },
  { id: 'muelle', name: ['muelle'], icon: 'containers' },
  { id: 'control', name: ['sala de control', 'Operaciones'], icon: 'radar' },
];

/** The public street outside every fence. */
export const STREET = 'calle';

/** «zona: misma confianza dentro · un control en cada paso». */
export const ZONE_LABEL = { lead: 'zona:', trust: 'misma confianza dentro', control: 'un control en cada paso' } as const;

/** s02-05, the answer to the intercepted message: «la VLAN aparta el tráfico; nadie decide qué cruza». */
export const ANSWER = ['la VLAN aparta el tráfico;', 'nadie decide qué cruza'] as const;

/** Exam term on `zone` (kept in English). */
export const TERM = 'SECURITY ZONE';

/** s02-08: «una VLAN sin control no es una zona», with the empty checkpoint: «una valla con la garita vacía». */
export const NOT_A_ZONE = ['una VLAN sin control', 'no es una zona'] as const;
export const EMPTY_FENCE = ['una valla con', 'la garita vacía'] as const;
