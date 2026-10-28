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

// ---------------------------------------------------------------------------
// Added by half B (s07–s12).

/** s08: the HTTP exchange and what an observer of the network can read. */
export const HTTP = {
  get: 'GET /reservas',
  host: `Host: ${PORTAL.host}`,
  cookie: 'Cookie: sesión',
  ok: '200 OK',
  page: 'página',
  tubeLabel: 'TLS',
  httpsLabel: 'HTTPS = HTTP dentro de TLS',
  observerIp: PORTAL.ip,
  observerName: 'nombre del sitio (normalmente)',
} as const;

/** s07 / s10: the four checks of a certificate, in the order the voice says them. */
export const CHECKS = ['nombre', 'firma y cadena', 'fechas', 'no anulado'] as const;

/** s07: what each check reflects on the DNI. */
export const DNI_MIRROR = ['nombre', 'quién lo expide', 'caducidad', 'no denunciado'] as const;

/** s09: the table the ribbon turns into. Columns: first visit · 3 minutes later · 2 hours later. */
export const TABLE_COLS = ['primera vez', '3 min', '2 h'] as const;
export type CellKind = 'on' | 'half' | 'off';
export interface TableCell {
  text: string;
  kind: CellKind;
  /** The reason written next to a cell that does not repeat (secondary label). */
  note?: string;
}
export const TABLE_ROWS: Record<Piece, readonly [TableCell, TableCell, TableCell]> = {
  DHCP: [
    { text: 'sí', kind: 'on' },
    { text: 'no', kind: 'off', note: 'concesión viva' },
    { text: 'no', kind: 'off' },
  ],
  DNS: [
    { text: 'sí', kind: 'on' },
    { text: 'no (TTL)', kind: 'off', note: 'TTL vigente' },
    { text: 'sí', kind: 'on', note: 'TTL vencido' },
  ],
  TCP: [
    { text: 'sí', kind: 'on' },
    { text: 'probablemente', kind: 'half', note: 'la de antes se cerró' },
    { text: 'sí', kind: 'on' },
  ],
  TLS: [
    { text: 'completo', kind: 'on' },
    { text: 'abreviado si se retoma', kind: 'half', note: 'sesión TLS retomada' },
    { text: 'nuevo o abreviado', kind: 'on' },
  ],
  HTTP: [
    { text: 'sí', kind: 'on' },
    { text: 'sí', kind: 'on', note: 'petición nueva' },
    { text: 'sí', kind: 'on' },
  ],
};

/** s09: each piece's own clock (the «reloj propio» column). */
export const OWN_CLOCKS: Record<Piece, string> = {
  DHCP: 'la concesión · 8 h',
  DNS: 'el TTL · 1 h',
  TCP: 'cada conexión',
  TLS: 'la sesión TLS',
  HTTP: 'cada petición',
};

/** s10: the look-alike's certificate (names that already exist in the canon, no dates). */
export const COPY_CERT = { name: LOOKALIKE.host, sign: 'una CA reconocida', dates: 'dentro de fechas', revoc: 'sin anular', butWho: 'pero ¿de quién?' } as const;

/** s11: the browser's certificate warning. */
export const WARNING = {
  title: 'Problema con el certificado',
  causes: ['el nombre no cuadra', 'falta parte de la cadena', 'fuera de fecha'],
  back: 'volver',
  skip: 'continuar de todos modos',
  rule: 'quitar la comprobación = quitar la protección',
  packet: 'entrada maliciosa',
  app: 'aplicación del portal',
  protectedPath: 'el canal la trae igual de protegida',
  says: 'con quién hablas',
  doesNotSay: 'si te conviene hablar con él',
} as const;

/** s12: the three rules, the practice and the closing card. */
export const RULES = [
  { title: ['Cada pieza', 'tiene su trabajo'], sub: 'cinco piezas, cinco trabajos' },
  { title: ['No todo', 'se repite'], sub: 'cada una con su reloj' },
  { title: ['Un certificado válido', 'dice con quién hablas'], sub: 'no si es de fiar' },
] as const;
export const NEXT = 'Práctica · Diagnóstico de conectividad';
export const END = {
  title: 'Qué sucede al abrir una web',
  objective: 'Fundamentos · Security+ SY0-701',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
