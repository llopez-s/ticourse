/**
 * s04-arp «Una pregunta en voz alta» — on-screen strings and the art of the warehouse. Addresses come from case.ts.
 * Never show: the server's IP as the ARP question; a label naming which device the gateway is.
 */
import { BROADCAST_MAC, GATEWAY, HOST, SERVER } from './case';

export const ART_YARD = 'art/s04-almacen.png';
export const ART_YARD_END = 'art/s04-almacen-fin.png';
/** 97 frames at 24 fps (4.04 s) = 121 composition frames: 120 is safely inside it. */
export const CLIP_YARD = { src: 'art/clips/s04-almacen.mp4', frames: 120 } as const;
/**
 * In the clip the box sits still for ~45 frames, crosses into the white van between ~45 and ~90 and rests inside it
 * from ~90 on (measured on stills at 0.5 s steps).
 */
export const CLIP_MOVE_FROM = 45;

/** The half-written frame (top of the stage). */
export const CARD = {
  frame: ['trama', 'Ethernet II'],
  dst: 'MAC de destino',
  src: 'MAC de origen',
  srcValue: HOST.mac,
  dstValue: GATEWAY.mac,
  dstWho: 'la puerta de enlace',
  ipDst: 'IP de destino',
  ipValue: SERVER.ip,
  ipWho: 'el servidor',
} as const;

export const LABELS = {
  subnet: `${HOST.subnet} · subred: los equipos de su misma red`,
  host: `${HOST.label} · ${HOST.ip}`,
  askHead: `petición · destino ${BROADCAST_MAC}`,
  askAny: '¿quién tiene 10.20.10.x?',
  askGw: `¿quién tiene ${GATEWAY.ip}?`,
  arpHead: 'ARP · RFC 826',
  arpLines: ['petición por difusión,', 'respuesta unidifusión', 'EtherType 0x0806,', 'sin cabecera IP'],
  layer3: 'capa 3',
  gw: ['puerta de enlace · capa 3', 'quien lo saca de su subred'],
  cpd: [`${SERVER.where} · ${SERVER.subnet}`, 'otra subred'],
  server: SERVER.ip,
  replyHead: `respuesta · para ${HOST.mac}`,
  replyBody: `${GATEWAY.ip} está en ${GATEWAY.mac}`,
  nat: 'red interna, sin traducción de direcciones (NAT)',
} as const;

/** The analogy read back in the course's words (right of the art). */
export const ANALOGY = {
  van: ['furgoneta', 'trama · solo su barrio'],
  box: ['caja', 'paquete · misma dirección'],
} as const;

/** The hop at the gateway. */
export const HOP = {
  gw: 'puerta de enlace · capa 3',
  packet: 'paquete · IP',
  ipSrc: `IP de origen ${HOST.ip}`,
  ipDst: `IP de destino ${SERVER.ip}`,
  ttl: 'TTL −1',
  dropped: ['la trama que llegó', 'se descarta'],
  fresh: 'trama nueva',
  freshLines: ['MAC de origen:', 'la de la puerta de enlace', 'MAC de destino:', 'la del siguiente salto'],
  same: 'las mismas IP',
} as const;
