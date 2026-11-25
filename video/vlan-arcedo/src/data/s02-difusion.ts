/** s02-difusion «Una pregunta en voz alta» — on-screen strings and the switch of the diagram. */
import type { IconName } from '../../../engine/src/ui';
import type { VlanId } from './vlans';

export const ART_FLOOR = 'art/s02-difusion-floor.png';
export const ART_WALLS = 'art/s02-difusion-walls.png';
/** 122 frames at 24 fps (5.08 s): 150 composition frames are safely inside it. */
export const CLIP_WALLS = { src: 'art/clips/s02-tabiques.mp4', frames: 150 } as const;

export const LABELS = {
  port: 'puerto',
  collision: 'dominio de colisión · uno por puerto',
  /** The broadcast frame: the label, then the address in mono. */
  shout: 'difusión · destino',
  broadcastMac: 'ff:ff:ff:ff:ff:ff',
  entry: 'entrada',
  broadcast: 'dominio de difusión',
  walls: 'VLAN · por configuración',
} as const;

/**
 * The six ports of the diagram's switch. Until `four` they are just ports; on `four` each takes the colour of the
 * VLAN it is configured in (the four VLANs with devices, on the same switch). `phone` draws the desk-phone glyph.
 */
export const PORTS: { vlan: VlanId; icon: IconName | 'phone' }[] = [
  { vlan: 10, icon: 'desktop' },
  { vlan: 10, icon: 'desktop' },
  { vlan: 20, icon: 'server' },
  { vlan: 20, icon: 'server' },
  { vlan: 30, icon: 'phone' },
  { vlan: 99, icon: 'gear' },
];

/** The port whose device sends the broadcast frame (it does not get its own frame back). */
export const SOURCE_PORT = 1;
/** The port the «puerto» label points at. */
export const LABELLED_PORT = 3;

/** Where the question «en voz alta» starts on the floor art (image fractions): a desk near the middle. */
export const ASK_FROM = { u: 0.59, v: 0.4 } as const;
