/** s06-capa3 «La puerta» — on-screen strings and where things sit on the wall art (image fractions). */
import { vlan } from './vlans';

export const ART_WALL = 'art/s06-capa3-wall.png';

export const LABELS = {
  desk: 'puesto',
  server: 'servidor',
  /** The device at the door. */
  l3: 'capa 3 · mira direcciones IP',
  /** Prefix of each gateway; the address comes from vlan(id).gateway (only VLAN 10 and 20 have one). */
  gateway: 'puerta de enlace',
  /** In the headquarters (two parts, so the second can light on its own words). */
  sviWho: 'conmutadores de distribución',
  sviWhat: 'una interfaz virtual por VLAN (SVI, nombre de Cisco)',
  /** The small aside. */
  small: 'red pequeña: encaminador con subinterfaces, un solo troncal',
} as const;

/** «puerta de enlace · 10.20.10.1», built from the shared canon. */
export function gatewayLabel(id: 10 | 20): string {
  const gw = vlan(id).gateway;
  if (!gw) throw new Error(`VLAN ${id} has no gateway in the lesson`);
  return `${LABELS.gateway} · ${gw}`;
}

/** The two troubleshooting lines: the case, then what to look at (lit on the voice's own word). */
export const DIAG = [
  { when: 'misma VLAN, plantas distintas, y no se ven:', look: 'mira el troncal' },
  { when: 'VLAN distintas y no se ven:', look: 'mira la puerta de enlace' },
] as const;

/**
 * Anchors on the art. `server` sits on the rack that carries a pink light in the image, so the engine-drawn tile
 * covers it (no rose in this video).
 */
export const SPOT = {
  desk: { u: 0.215, v: 0.3 },
  door: { u: 0.465, v: 0.535 },
  server: { u: 0.845, v: 0.545 },
} as const;
