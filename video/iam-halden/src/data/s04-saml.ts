/**
 * s04-saml «Un pase firmado por tu casa» — on-screen strings (canon: scene brief «Canon» > s04).
 * No host or domain names anywhere; the Halden IdP lane shows ONLY «contraseña»
 * (no second factor in Halden's IdP in this video). The pass texts live in
 * parts/PassCard.tsx (PASS_TEXT).
 */
import type { LaneDef } from '../scenes/parts/Lanes';

export const LANES: LaneDef[] = [
  { title: 'navegador', sub: 'personal del puerto', tone: 'cyan', icon: 'laptop' },
  { title: 'plataforma aduanera', sub: 'el socio (SP)', tone: 'sky', icon: 'globe' },
  { title: 'IdP', sub: 'Autoridad Portuaria de Halden', tone: 'cyan', icon: 'shield' },
];

export const REDIRECT = 'no te conozco: que responda tu casa';

export const HOME = { field: 'contraseña', lock: 'no sale de casa' } as const;

export const TRUST = 'confianza acordada antes';

export const TERMS = { assertion: 'ASERCIÓN SAML', federation: 'FEDERATION', sso: 'SSO' } as const;

export const SSO = {
  line: 'una entrada en casa, muchas webs',
  rule: 'este inicio de sesión debe llevar segundo factor',
  /** The one partner web with a name (already on screen as the pass's «para»); the rest stay unnamed. */
  web: 'plataforma aduanera',
} as const;

export const DIES = {
  name: 'o.virta',
  dept: 'Importación',
  idp: 'no firma pases para esta cuenta',
  sp: 'sin pase: acceso denegado',
} as const;
