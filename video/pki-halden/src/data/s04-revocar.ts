/**
 * s04-revocar «¿Sigue valiendo?» — on-screen strings (canon: out/scene-brief.md «Canon», s04). The
 * certificate's lines are s02's (the portal's leaf); the console is `openssl x509 -ext` with the
 * lesson's two URLs (`src/data/secplus/sp1-part4.ts:325-326`). Only the lesson's two reasons
 * (`:365`): never «la empleada deja la empresa». Nothing is revoked: REVOKE lands on a ghost copy.
 */

export const HOST = 'reservas.haldenport.example';

/** The shipping company's second question (s04-01): ship badge, no sender. */
export const QUESTION = {
  who: 'naviera',
  day: 'martes 10-11',
  text: '¿Y si un día este certificado deja de valer antes de tiempo, quién nos avisa?',
} as const;

/** The portal's certificate as s02 printed it (the real card: `NotAfter` stays readable). */
export const CERT = {
  title: 'el certificado del portal',
  subject: `CN = ${HOST}`,
  notAfter: 'NotAfter: May 27 23:59:59 2027 GMT',
} as const;

/** s04-02, the lesson's two reasons and nothing more. */
export const REASONS = {
  lead: 'un certificado puede dejar de valer antes de su fecha:',
  items: ['se filtra la clave privada', 'el dominio cambia de dueño'] as const,
} as const;

/** s04-03, the answer to «esperar a que caduque». */
export const MONTHS = 'faltan más de seis meses';
export const PRETEND = ['quien tuviera la clave podría presentarse como el portal,', 'y los clientes le creerían'] as const;

/** s04-04: the stamp goes on the ghost copy only. */
export const GHOST_TAG = 'si se filtrara la clave';
export const REVOKE = 'REVOKE';
export const REVOKED = ['se revoca ya', 'y se pide otro con una clave nueva'] as const;
export const WHERE = ['nadie avisa', 'lo comprueba el cliente'] as const;

/** s04-04 `crl-url`: the certificate says where to ask (OpenSSL's own indentation). */
export const EXT = {
  /** The console's title stamp (Halden's date, as in s02/s03). */
  day: '10-11',
  title: 'consola',
  cmd: 'openssl x509 -noout -ext crlDistributionPoints,authorityInfoAccess',
  lines: [
    'X509v3 CRL Distribution Points:',
    '    Full Name:',
    '      URI:http://crl.confianza.example/issuing3.crl',
    'Authority Information Access:',
    '    OCSP - URI:http://ocsp.confianza.example',
  ] as const,
  /** Indices in `lines` of the two URLs. */
  crl: 2,
  ocsp: 4,
} as const;

/** s04-05/06: the hotel. */
export const HOTEL = {
  police: 'la policía',
  reception: 'recepción',
  daily: 'una vez al día',
  lag: 'un DNI robado esta mañana no sale hasta mañana',
  listTab: 'hoy',
  /** Shown on `crl`: who is who. */
  policeIs: 'la CA',
  receptionIs: 'el cliente',
} as const;

export const CRL = {
  term: 'CRL',
  sub: 'lista firmada por la CA · el cliente la descarga cada cierto tiempo',
} as const;
