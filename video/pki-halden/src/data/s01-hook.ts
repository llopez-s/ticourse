/**
 * s01-hook «No encuentro al emisor» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * The line is V11's, as curl printed it (curl's order, one mono row, verbatim — never V11's re-sorted chips).
 * Only `id-ecPublicKey` may brighten. No issuer / verify rows here: the issuer arrives in s02 as the `i:` line.
 * The shipping company stays unnamed and its message carries no address. Date-led strips stay lower case (V11's
 * idiom); the message body, a written sentence, gets its first letter capitalised.
 */
import type { IconName } from '../../../engine/src/ui';

/** V11's line (curl's order), split so its last piece can brighten on «clave pública». */
export const TLS_LINE = {
  lead: 'SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / ',
  key: 'id-ecPublicKey',
} as const;

/** The bridge question (s01-01), with the words that light as the voice says them. */
export const BRIDGE = {
  before: '¿Cómo sabes que esa ',
  key: 'clave pública',
  middle: ' es ',
  port: 'del puerto',
  after: '?',
} as const;

export const TITLE = { lead: 'PKI:', rest: ' la cadena y la revocación' } as const;

/** The promise (s01-02 «Lo abrimos en una consola, vemos qué falla y si sigue valiendo»), one chip per idea. */
export const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'leer la cadena', word: 'abrimos', icon: 'link' },
  { text: 'arreglarla', word: 'falla', icon: 'gear' },
  { text: 'saber si sigue valiendo', word: 'sigue', icon: 'clock' },
];

/** Monday 9-11: the portal's new certificate (s01-03 «El lunes, el portal estrena certificado»). */
export const RENEWAL = {
  day: 'lunes 9-11',
  when: 'por la tarde',
  what: 'certificado nuevo en el portal',
  before: 'el anterior caducaba el 11-11',
} as const;

/** Tuesday 10-11, 08:15: the shipping company's message (s01-03 «El martes, una naviera avisa de que no conecta»). */
export const MESSAGE = {
  who: 'una naviera',
  stamp: 'martes 10-11 · 08:15',
  body: ['Desde ayer por la tarde nuestra integración', 'no conecta con vuestro portal:'],
  error: 'unable to get local issuer certificate',
} as const;
