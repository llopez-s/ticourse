/** s04-etiqueta «El sobre y la pegatina» — on-screen strings, the two switches and the art of the mail room. */
import type { IconName } from '../../../engine/src/ui';
import type { VlanId } from './vlans';

export const ART_MAIL = 'art/s04-etiqueta-mail.png';
export const ART_MAIL_END = 'art/s04-etiqueta-mail-fin.png';
/** 122 frames at 24 fps (5.08 s): 150 composition frames are safely inside it. */
export const CLIP_LIFT = { src: 'art/clips/s04-montacargas.mp4', frames: 150 } as const;

export const LABELS = {
  access: 'puerto de acceso · una sola VLAN',
  accessShort: 'puerto de acceso',
  untagged: 'sin etiqueta',
  tagged: 'con etiqueta',
  trunk: 'enlace troncal · IEEE 802.1Q',
  trunkShort: 'enlace troncal',
  /** The tray's label, one piece per line. */
  native: ['VLAN nativa', 'nombre de los fabricantes', 'en 802.1Q, el PVID del puerto'],
} as const;

/** The opened 802.1Q tag: «4 bytes: TPID 0x8100 · PCP 3 bits · DEI 1 bit · VID 12 bits (1–4094)». */
export const TAG_SIZE = '4 bytes';
export const TAG_FIELDS = [
  { name: 'TPID', value: '0x8100', flex: 1.1 },
  { name: 'PCP', value: '3 bits', flex: 0.85 },
  { name: 'DEI', value: '1 bit', flex: 0.8 },
  { name: 'VID', value: '12 bits (1–4094)', flex: 1.6, key: true },
] as const;

export interface AccessPort {
  vlan: VlanId;
  icon: IconName | 'phone';
}

/** Access ports of the switch of each floor (the trunk leaves from the switch's side). */
export const FLOOR_A: readonly AccessPort[] = [
  { vlan: 10, icon: 'desktop' },
  { vlan: 10, icon: 'desktop' },
  { vlan: 20, icon: 'server' },
  { vlan: 30, icon: 'phone' },
  { vlan: 99, icon: 'gear' },
];
export const FLOOR_B: readonly AccessPort[] = [
  { vlan: 10, icon: 'desktop' },
  { vlan: 20, icon: 'server' },
  { vlan: 20, icon: 'server' },
  { vlan: 30, icon: 'phone' },
  { vlan: 99, icon: 'gear' },
];

/** The frames that cross the trunk, one per VLAN with devices, in slot order (left to right). */
export const TRUNK_FRAMES: readonly VlanId[] = [10, 20, 30, 99];

/** Regions of the mail-room art (image fractions): the desk with its bare envelopes, the lift hatch, the tray. */
export const REGION_DESK = [0.055, 0.36, 0.46, 0.9] as const;
export const REGION_LIFT = [0.615, 0.08, 0.83, 0.75] as const;
export const REGION_TRAY = [0.82, 0.55, 0.975, 0.74] as const;
