/**
 * s03-arreglo «El eslabón del medio» — on-screen strings (canon: out/scene-brief.md «Canon», s03). The same
 * `s_client -showcerts` after Infraestructura installs the intermediate at 09:10 (Halden time) on Tuesday 10-11:
 * three depths, two chain entries (the intermediate's with its own RSA signature and 2023–2033 validity) and
 * `Verify return code: 0 (ok)`. PEM blocks left out. The root card is a card, not console output (the server
 * never sends the root). No person, no change steps, no blame: «Infraestructura» is the only owner on screen.
 */
import type { ConsoleRowDef } from './s02-cadena';
import { HOST } from './s02-cadena';

export const S03 = {
  question: '¿Cómo se arregla?',
  /** The pill under NULL CIPHER's card (as V11's NULL_CIPHER_INTRO). */
  nullCipher: 'Vuelve NULL CIPHER',
  /** s03-02: the man in the middle. */
  withWhom: { yes: 'cifrado, sí', who: '¿con quién?' },
  /** s03-03 */
  rule: 'se arregla la cadena, no el aviso',
  twoFiles: { lead: 'la CA entrega dos ficheros: el certificado y la cadena', installed: 'se instaló uno' },
  files: { cert: 'el certificado', chain: 'la cadena' },
  common: 'de los despistes más comunes',
  /** s03-04: the strip, then the console (its title stamp: the day only). */
  strip: { time: '09:10', what: 'Infraestructura instala la intermedia' },
  stamp: '10-11',
  rows: [
    { id: 'd2', text: 'depth=2 CN = Confianza Global Root', tone: 'ca' },
    { id: 'r1', text: 'verify return:1', tone: 'texture' },
    { id: 'd1', text: 'depth=1 CN = Confianza Global TLS Issuing CA 3', tone: 'ca' },
    { id: 'r2', text: 'verify return:1', tone: 'texture' },
    { id: 'd0', text: `depth=0 CN = ${HOST}`, tone: 'portal' },
    { id: 'r3', text: 'verify return:1', tone: 'texture' },
    { id: 'sep1', text: '---', tone: 'texture' },
    { id: 'chain', text: 'Certificate chain', tone: 'plain' },
    { id: 's0', text: ` 0 s:CN = ${HOST}`, tone: 'portal' },
    { id: 'i0', text: '   i:CN = Confianza Global TLS Issuing CA 3', tone: 'texture' },
    { id: 'a0', text: '   a:PKEY: id-ecPublicKey, 256 (bit); sigalg: ecdsa-with-SHA384', tone: 'texture' },
    { id: 'v0', text: '   v:NotBefore: Nov  9 00:00:00 2026 GMT; NotAfter: May 27 23:59:59 2027 GMT', tone: 'texture' },
    { id: 's1', text: ' 1 s:CN = Confianza Global TLS Issuing CA 3', tone: 'ca' },
    { id: 'i1', text: '   i:CN = Confianza Global Root', tone: 'texture' },
    { id: 'a1', text: '   a:PKEY: id-ecPublicKey, 384 (bit); sigalg: RSA-SHA256', tone: 'texture' },
    { id: 'v1', text: '   v:NotBefore: Mar 14 00:00:00 2023 GMT; NotAfter: Mar 13 23:59:59 2033 GMT', tone: 'texture' },
    { id: 'sep2', text: '---', tone: 'texture' },
    { id: 'gap', text: '', tone: 'texture', gap: true },
    { id: 'code0', text: 'Verify return code: 0 (ok)', tone: 'ok' },
  ] satisfies ConsoleRowDef[],
  /** s03-05 */
  sendsTwo: 'el servidor manda dos',
  youHaveIt: 'la tienes tú',
  rootCard: {
    subject: { label: 'Subject:', value: 'CN = Confianza Global Root' },
    issuer: { label: 'Issuer:', value: 'CN = Confianza Global Root' },
    verdict: { same: 'Subject = Issuer', self: 'se firma a sí misma' },
  },
  /** s03-06 */
  noNeed: 'la raíz no hace falta mandarla: ya la tienes',
  connects: 'la naviera conecta',
} as const;
