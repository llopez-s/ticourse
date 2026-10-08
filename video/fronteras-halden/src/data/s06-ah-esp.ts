import { SHIPMENT_TEXT } from '../scenes/parts/Shipment';

/**
 * s06-ah-esp «Precinto o caja cerrada» — on-screen strings (canon: out/scene-brief.md).
 * The tunnel's configuration is three console lines, gateways named only «pasarela de la sede» /
 * «pasarela de la terminal» (no hostnames). AH is never «signed» or «half-encrypted»; ESP never
 * «only encrypts»; no key types. Not canon: `consoleTitle` (the voice: «Abres la configuración del
 * túnel»).
 */

const [ahIntegrity, ahNoCipher] = SHIPMENT_TEXT.ah.split(' · ');
const [espConf, espUsed] = SHIPMENT_TEXT.esp.split(' · ');

export const S06 = {
  /** Not canon: the console's title bar. */
  consoleTitle: 'configuración del túnel',
  /** Canon «protocolo: ESP · modo: túnel · extremos: pasarela de la sede, pasarela de la terminal», one line each. */
  config: [
    { key: 'protocolo', value: 'ESP' },
    { key: 'modo', value: 'túnel' },
    { key: 'extremos', value: 'pasarela de la sede, pasarela de la terminal' },
  ],
  ipsec: { term: 'IPSec', line: 'capa de red · cualquier paquete IP' },
  /** Canon «integridad y origen · sin cifrar», revealed in two halves as the voice explains it. */
  ah: { term: 'AH', parts: [ahIntegrity, ahNoCipher] as const },
  /** Canon «además, confidencialidad · el que se usa»: the second half on «usa» (s06-07). */
  esp: { term: 'ESP', parts: [espConf, espUsed] as const },
  sep: ' · ',
} as const;
