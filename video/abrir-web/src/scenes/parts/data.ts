/**
 * Canon strings of «Qué sucede al abrir una web» (out/scene-brief.md «Canon»). Everything that appears on
 * screen as data comes from here, so the two halves of the video (and a later change of an address) edit ONE
 * file. The voice never reads an address, a mask or a domain: these strings are what the viewer sees.
 */

/** The five pieces of the ribbon, in the order the video lights them. */
export const PIECES = ['DHCP', 'DNS', 'TCP', 'TLS', 'HTTP'] as const;
export type Piece = (typeof PIECES)[number];

/** The office network (f06's worked example, `foundations.ts:28`). All new, none in the registry. */
export const NET = {
  laptop: '192.168.20.10',
  mask: '255.255.255.0',
  prefix: '/24',
  /** The gateway is also the DHCP server (the router). */
  gateway: '192.168.20.1',
  resolver: '192.168.20.2',
  leaseHours: 8,
  leaseFrom: '8:58',
  leaseTo: '16:58',
  renewAt: '12:58',
} as const;

/** Wall-clock minutes since midnight for the three times the video shows. */
export const CLOCK = { boot: 8 * 60 + 58, later: 9 * 60 + 1, twoHours: 10 * 60 + 58, lunes: 'lunes' } as const;

/** The port's reservations portal. The public addresses are constants because they may change. */
export const PORTAL = {
  host: 'reservas.haldenport.example',
  /** «ejemplo de entrenamiento»: the registry gives none. */
  ip: '192.0.2.44',
  port: '443',
  ttl: 3600,
  name: 'Autoridad Portuaria de Halden · portal de reservas',
  button: 'Reservar atraque',
  done: 'Reserva confirmada',
} as const;

/** The portal's certificate (V12's data: `video/pki-halden/src/data/s02-cadena.ts:38-41`). */
export const CERT = {
  cn: 'reservas.haldenport.example',
  issuer: 'Confianza Global TLS Issuing CA 3',
  root: 'Confianza Global Root',
  from: '9-11-2026',
  to: '27-5-2027',
} as const;

/** The connection line: style of V11's TlsLine, another connection (no date, no id-ecPublicKey). */
export const TLS_LINE = ['TLSv1.3', 'TLS_AES_256_GCM_SHA384', 'X25519'] as const;

/** The look-alike domain of s10 (a zero for the o; `reg:395`). */
export const LOOKALIKE = { host: 'haldenp0rt.example', note: 'ejemplo · no existe en el caso' } as const;

/** The permanent seal drawn by every scene from s02 on. */
export const SEAL_TEXT = 'Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto';

/** The label of the three borrowed images (book, agenda, DNI). */
export const IMAGE_TAG = 'imagen · no es del puerto';

/** Stage-local drawing room: the ribbon takes y 0–72 and the seal y 618–660 (from s02 on). */
export const STAGE_W = 1728;
export const STAGE_H = 660;
export const TOP_FREE = 96;
export const BOTTOM_FREE = 608;
