/**
 * s06-cual «¿Quién eres o qué puede hacer?» — on-screen strings (canon: scene brief «Canon» > s06).
 * OpenID Connect gets no exam card (only its name on screen).
 */

export type RowId = 'saml' | 'oauth' | 'oidc' | 'ldap';

export const ROWS: { id: RowId; phrase: string; name: string; seg: string; phraseWord: string; nameWord: string; nameNth?: number; iconWord: string }[] = [
  { id: 'saml', phrase: 'entrar en la web del socio con tu cuenta', name: 'SAML', seg: 's06-01', phraseWord: 'entrar', nameWord: 'saml', nameNth: 1, iconWord: 'pase' },
  { id: 'oauth', phrase: 'una app lee tu calendario sin tu contraseña', name: 'OAUTH', seg: 's06-02', phraseWord: 'app', nameWord: 'oauth', iconWord: 'vale' },
  { id: 'oidc', phrase: 'Iniciar sesión con…', name: 'OPENID CONNECT', seg: 's06-03', phraseWord: 'botón', nameWord: 'openid', iconWord: 'ficha' },
  { id: 'ldap', phrase: 'consultar el directorio de casa', name: 'LDAP', seg: 's06-04', phraseWord: 'consultar', nameWord: 'ldap', iconWord: 'directorio' },
];

/** s06-01 opens with «El examen mezcla SAML, OAuth y LDAP»: these names show up jumbled first. */
export const MIXED_WORDS: Partial<Record<RowId, string>> = { saml: 'saml', oauth: 'oauth', ldap: 'ldap' };

/** Chapter close (s06-05): the final row, each card on the word that names it. */
export const SUM: { lead: string; text: string; word: string }[] = [
  { lead: 'SAML:', text: 'quién eres, para entrar', word: 'saml' },
  { lead: 'OAuth:', text: 'qué puede hacer una app por ti', word: 'oauth' },
  { lead: 'OIDC:', text: 'OAuth más quién eres', word: 'openid' },
];
