/**
 * s01-hook «Una línea, cuatro piezas» — on-screen strings (canon: out/scene-brief.md «Canon»). The line itself
 * (its four pieces, in canon order) lives in the shared part `scenes/parts/TlsLine.tsx`; the console prints curl's
 * own output (curl's order, `TLS_CURL_LINE`). No host name of the portal and no IP anywhere: curl's «Connected to …»
 * line, which would print the IP, is left out. The certificate lines are half-lit texture; the expiry is never lit.
 */
import type { Accent } from '../../../engine/src/theme/tokens';
import type { IconName } from '../../../engine/src/ui';
import { TLS_CURL_LINE, TLS_HOST } from '../scenes/parts/TlsLine';

export const STAMP = { day: 'martes 3-11', who: 'Autoridad Portuaria de Halden' } as const;
export const STRIP = 'portal de reservas de atraque';

export const CURL = {
  title: 'prueba de conexión · desde fuera, como una naviera',
  cmd: `curl -v https://${TLS_HOST}/`,
  /** The handshake, in grey, as it scrolls past (the five messages of the brief). */
  handshake: [
    '* TLSv1.3 (OUT), TLS handshake, Client hello (1):',
    '* TLSv1.3 (IN), TLS handshake, Server hello (2):',
    '* TLSv1.3 (IN), TLS handshake, Certificate (11):',
    '* TLSv1.3 (IN), TLS handshake, CERT verify (15):',
    '* TLSv1.3 (IN), TLS handshake, Finished (20):',
  ],
  ssl: `* ${TLS_CURL_LINE}`,
  /** Half-lit, never read; curl's order. The expiry is V12's: never highlight it. */
  cert: ['*  expire date: Nov 11 23:59:59 2026 GMT', '*  issuer: CN=Confianza Global TLS Issuing CA 3', '*  SSL certificate verify ok.'],
} as const;

export const TITLE = { lead: 'Criptografía:', rest: ' quién usa qué clave' } as const;

/** The promise (s01-03), one chip per thing the voice names: «quién usa cada clave», «un hash y una firma», «dos maneras». */
export const PROMISE: { text: string; word: string; icon: IconName; accent: Accent }[] = [
  { text: 'quién usa qué clave', word: 'quién', icon: 'key', accent: 'cyan' },
  { text: 'hash y firma', word: 'hash', icon: 'file', accent: 'cyan' },
  { text: 'por qué TLS es híbrido', word: 'maneras', icon: 'lock', accent: 'cyan' },
];

/** The note as the line parks in its corner (s01-04 «Al final vas a leer la línea entera»). */
export const LATER = 'al final, la lees entera';
