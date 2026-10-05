/**
 * s09-linea «La línea, entera» — on-screen strings (canon: out/scene-brief.md «Canon»). The line itself is the
 * shared part `scenes/parts/TlsLine.tsx` (canon order); each piece gets a card with its image, in the order the
 * voice reads them (s09-02..04). Card lines follow the voice where the storyboard's wording differs («comprueba»,
 * «mezclas con el dueño de esa clave»). Lines ≤ 21 characters at 32–34 px fit a 417-px card. The certificate
 * lines are s01's: only the issuer and «verify ok» light; the expiry is V12's and is not shown here.
 */
import type { TlsPart } from '../scenes/parts/TlsLine';

export type CardPart = Exclude<TlsPart, 'tls'>;

/** The family each piece belongs to — the HYBRID beat lights them by family. */
export type Family = 'asym' | 'sym' | 'hash';

export interface PieceCard {
  part: CardPart;
  /** The cue on which it lights. */
  cue: string;
  lines: readonly string[];
  /** A last line in emerald: what the shipping company gets out of it. */
  outcome?: readonly string[];
  family: Family;
  /** The family tag at the foot of the card (exam terms in capitals are violet). */
  tag: string;
}

export const CARDS: readonly PieceCard[] = [
  // «La primera es la pintura, el acuerdo de la clave con curvas elípticas.»
  { part: 'x25519', cue: 'x25519', lines: ['acuerdan la clave', 'de sesión'], family: 'asym', tag: 'asimétrica · ECDH' },
  // «La segunda, AES, la simétrica, que con esa clave cifra el tráfico.»
  { part: 'aes', cue: 'aes', lines: ['cifra todo el tráfico', 'con esa clave'], family: 'sym', tag: 'simétrica · AES' },
  // «La tercera es una huella, y comprueba que nadie ha tocado los primeros mensajes, el saludo.»
  { part: 'sha', cue: 'sha', lines: ['comprueba que nadie', 'ha tocado el saludo'], family: 'hash', tag: 'HASH' },
  // «Y la última, la clave pública del servidor. Con su privada, el servidor sella el saludo, y sabes que mezclas con el dueño de esa clave.»
  { part: 'eckey', cue: 'ec-key', lines: ['sella el saludo', 'con su privada'], outcome: ['mezclas con el dueño', 'de esa clave'], family: 'asym', tag: 'asimétrica · firma' },
];

/** «Vamos, que asimétrica para empezar y simétrica para todo lo demás. Así funciona TLS, y por eso decimos que es híbrido.» */
export const HYBRID = {
  name: 'HYBRID',
  start: { lead: 'asimétrica', rest: ' para empezar', word: 'asimétrica' },
  rest: { lead: 'simétrica', rest: ' para todo lo demás', word: 'simétrica' },
} as const;

/** «Y la oferta, igual. Se cifra con una clave simétrica, y esa clave viaja por el buzón de la naviera.» */
export const OFFER = {
  title: 'la oferta, igual',
  doc: ['el documento,', 'con una clave simétrica'],
  key: ['esa clave, por el buzón', 'de la naviera'],
} as const;

/** s01's certificate lines that light now (the expiry stays out: it is V12's). */
export const CERT = {
  issuer: '*  issuer: CN=Confianza Global TLS Issuing CA 3',
  verify: '*  SSL certificate verify ok.',
} as const;

/** «¿Cómo sabe la naviera que esa clave pública es de verdad del puerto? Eso, en el siguiente vídeo.» */
export const QUESTION = {
  lines: ['¿Cómo sabe la naviera que esa', 'clave pública es del puerto?'],
  next: 'siguiente vídeo',
} as const;
