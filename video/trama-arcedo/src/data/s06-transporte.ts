/**
 * On-screen strings of s06-transporte «Certificado o postal». Addresses and ports come from case.ts; the handshake
 * numbers are the storyboard's canon (SYN seq=1000 · SYN+ACK seq=5000 ack=1001 · ACK seq=1001 ack=5001).
 */
import { HOST, LAYER, SERVER } from './case';

export const ART_CERT = 'art/s06-certificado.png';
export const ART_POST = 'art/s06-postal.png';
/** The envelope of s02's analogy, cropped next to the stack on `inside`. */
export const ART_WRAPS = 'art/s02-envoltorios.png';

export const STACK_LABELS = {
  frame: `${LAYER.frame.name} · capa ${LAYER.frame.layer}`,
  packet: `${LAYER.packet.name} · capa ${LAYER.packet.layer}`,
  segment: `${LAYER.segment.name} · capa ${LAYER.segment.layer}`,
  data: LAYER.data.name,
  fcs: 'FCS',
} as const;

export const ENDPOINTS = {
  host: `${HOST.ip}:${HOST.port}`,
  server: `${SERVER.ip}:${SERVER.port}`,
} as const;

/** The three messages, in order; `dir` 1 = puesto to servidor, -1 = back. */
export const HANDSHAKE = [
  { text: 'SYN seq=1000', dir: 1 },
  { text: 'SYN+ACK seq=5000 ack=1001', dir: -1 },
  { text: 'ACK seq=1001 ack=5001', dir: 1 },
] as const;
export const HANDSHAKE_LABEL = 'establecimiento en tres pasos';

/** Data bytes continue the client's numbering after the handshake (first data byte = 1001). */
export const BYTES = [1001, 1002, 1003, 1004, 1005, 1006] as const;
export const SEQ_LABEL = 'número de secuencia';
export const ACK_LABEL = 'acuse = siguiente byte que se espera';
/** While 1003 is missing the receiver keeps asking for it; once it arrives, everything up to 1006 is confirmed. */
export const ACK_ALL = 'ACK ack=1007';
export const ACK_GAP = 'ACK ack=1003';
export const GAP_LABEL = 'sin acuse: se reenvía';
export const SWAP_LABEL = 'descolocados: se ordenan';
export const SIDE = { host: 'puesto', server: 'servidor' } as const;

export const TCP_LABEL = { title: 'TCP · RFC 9293', lines: ['con conexión, fiable y ordenado', 'cabecera de 20 a 60 bytes'] } as const;
export const UDP_LABEL = { title: 'UDP · RFC 768 · datagrama', lines: ['cabecera de 8 bytes', 'sin conexión ni garantías'] } as const;
export const VOICE_LABEL = 'voz en tiempo real';
