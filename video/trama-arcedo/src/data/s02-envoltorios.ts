/** s02-envoltorios «De dentro afuera» — on-screen strings of the wrapper stack and the three devices. */
import type { IconName } from '../../../engine/src/ui';
import { HOST, LAYER, SERVER } from './case';

export const ART = 'art/s02-envoltorios.png';

/** What each wrapper is called on screen. */
export const NAMES = {
  data: LAYER.data.name,
  segment: `${LAYER.segment.name} · ${LAYER.segment.proto} · capa ${LAYER.segment.layer}`,
  packet: `${LAYER.packet.name} · ${LAYER.packet.proto} · capa ${LAYER.packet.layer}`,
  frame: `${LAYER.frame.name} · ${LAYER.frame.proto} · capa ${LAYER.frame.layer}`,
} as const;

export const DATA_SUB = 'lo que envía la aplicación';

/** Header rows (key over value). The second row of each is the destination the devices read. */
export const SEG_HDR = [
  { k: 'puerto de origen', v: String(HOST.port) },
  { k: 'puerto de destino', v: String(SERVER.port) },
] as const;
export const PKT_HDR = [
  { k: 'IP de origen', v: HOST.ip },
  { k: 'IP de destino', v: SERVER.ip },
] as const;
/** The frame's header fields, in wire order; the first is the one the switch reads. */
export const FRAME_HDR = ['MAC de destino', 'MAC de origen', 'EtherType 0x0800'] as const;
export const FCS = 'FCS';

/** The three devices and the wrapper each decides with. */
export const DEVICES: { key: 'frame' | 'packet' | 'segment'; icon: IconName; title: string; sub: string }[] = [
  { key: 'frame', icon: 'network', title: 'conmutador · capa 2', sub: 'decide con la MAC' },
  { key: 'packet', icon: 'router', title: 'encaminador · capa 3', sub: 'decide con la IP' },
  { key: 'segment', icon: 'server', title: 'servidor · capa 4', sub: 'entrega por el puerto' },
];
