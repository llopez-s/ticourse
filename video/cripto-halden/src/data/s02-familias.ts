/** On-screen text of s02-familias «Una llave para dos, o un buzón» (storyboard goal). */

export const PARTIES = { port: 'puerto', naviera: 'naviera' } as const;

export const SYM = {
  sameKey: 'la misma clave cierra y abre',
  fast: 'rápida: discos, bases de datos, tráfico',
  term: 'SYMMETRIC',
  algo: 'AES',
  road: '¿cómo le llega la copia sin que nadie la vea?',
} as const;

export const ASYM = {
  publicKey: 'clave pública',
  publicSub: 'la tiene cualquiera',
  privateKey: 'clave privada',
  privateSub: 'no sale de casa',
  rule: 'lo que cierra una, solo lo abre la otra',
  term: 'ASYMMETRIC',
  algo: 'RSA, ECC',
} as const;

export const SPEED = {
  aes: { name: 'AES', label: 'muy rápida' },
  rsa: { name: 'RSA', label: 'muchísimo más lenta' },
  load: 'unos gigas',
  short: 'se queda corta',
} as const;

/** Presentation label under the intercepted message (38 characters). */
export const NULL_CIPHER_INTRO = 'NULL CIPHER · célula de acceso inicial';

/** «Es verdad, no hay secreto que repartir.» */
export const TRUE_HALF = 'es verdad: no hay secreto que repartir';

export const FAMILIES = {
  sym: 'simétrica: el volumen',
  asym: 'asimétrica: acordar claves y firmar',
  roles: 'cómo se reparten el trabajo: al final',
} as const;
