/** On-screen text of s03-naviera «Solo para la naviera» (storyboard goal). */

/** «Oferta comercial 2027 · para una naviera» come from Fingerprint.tsx's OfferSheet; this tag rides on it. */
export const CONFIDENTIAL = 'confidencial';

export const COMPETITION = 'la competencia no debe verlos';

export const TILES = {
  navieraPublic: { title: 'pública', sub: 'de la naviera' },
  portPrivate: { title: 'privada', sub: 'del puerto' },
  portPublic: { title: 'pública', sub: 'del puerto' },
} as const;

export const QUESTION = '¿con cuál la cierras?';

/** Over the port's private-key tile while NULL CIPHER's message is up. */
export const PROPOSAL = 'lo que propone NULL CIPHER';
/** «Y en algo acierta, que nadie más tiene la privada del puerto.» */
export const TRUE_HALF = 'nadie más la tiene: es verdad';

export const WRONG = {
  closedWith: 'cerrada con la privada del puerto',
  anyone: 'la abre cualquiera',
  panel: 'así no',
} as const;

export const RIGHT = {
  letter: 'la oferta',
  slot: 'su pública',
  key: 'su privada',
} as const;

export const RULE = { before: 'cifras con ', strong: 'SU', after: ' pública' } as const;
export const TERM = 'CONFIDENTIALITY';
/** Small, on screen only. */
export const NOTE = ['TLS protege el camino', 'esto protege el documento, esté donde esté'] as const;
export const LATER = 'tu privada sirve para otra cosa · capítulo IV';
