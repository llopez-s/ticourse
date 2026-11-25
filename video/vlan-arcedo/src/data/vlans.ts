/**
 * Shared canon of «VLAN y 802.1Q» (see the «Canon» block of out/scene-brief.md). Every scene reads the VLANs, their
 * subnets and their colours from here: never retype them.
 * Source: src/data/opo/op1-m3.ts:159-190 and docs/superpowers/canon/arcedo.md §5.
 */
import { C } from '../../../engine/src/theme/tokens';

export type VlanId = 10 | 20 | 30 | 99;

export interface Vlan {
  id: VlanId;
  name: string;
  /** Shown only on screen: the voice never reads an address. */
  subnet: string;
  /** Only VLAN 10 and 20 have a gateway written in the lesson (s06). */
  gateway?: string;
  /** The colour of this VLAN in every scene (decided for this video: cyan / emerald / amber / slate). */
  tone: string;
}

/** The four VLANs of the headquarters that have devices, in the order the screen lists them. */
export const VLANS: readonly Vlan[] = [
  { id: 10, name: 'Usuarios', subnet: '10.20.10.0/24', gateway: '10.20.10.1', tone: C.cyan },
  { id: 20, name: 'Servidores', subnet: '10.20.20.0/24', gateway: '10.20.20.1', tone: C.emerald },
  { id: 30, name: 'Voz', subnet: '10.20.30.0/24', tone: C.amber },
  { id: 99, name: 'Gestión', subnet: '10.20.99.0/24', tone: C.muted },
];

export function vlan(id: VlanId): Vlan {
  const v = VLANS.find((x) => x.id === id);
  if (!v) throw new Error(`unknown VLAN ${id}`);
  return v;
}

/** The trunks' native VLAN: empty, no access port. It first appears in s04 (`n999`), never earlier. */
export const NATIVE = { id: 999, label: 'nativa 999 · sin equipos · igual en los dos extremos', tone: C.faint } as const;

/** The case stamp (s01), no date; «datos ficticios» is the engine's own corner tag. */
export const CASE = { who: 'Consorcio Provincial de Arcedo', kind: 'caso de ejemplo' } as const;

/** The track plate, as the engine's exam cards name it («EXAMEN · REDES Y ENS · Redes»). */
export const PLAQUE = 'REDES Y ENS · Redes';
