/**
 * s01-hook «¿Qué le damos al SOC?» — on-screen strings (canon: out/scene-brief.md › Canon › s01).
 * The indicator cards carry NO value: only what kind of indicator they are, and an expiry clock.
 */

/** Context strip: who and where. */
export const CONTEXT = ['Meridian Dynamics', 'aeroespacial', 'tú, su analista de inteligencia'] as const;

/** The three loose indicators, each lit on its own word of s01-01. */
export const INDICATORS = [
  { label: 'un dominio', glyph: 'globe', word: 'dominio' },
  { label: 'una dirección IP', glyph: 'network', word: 'dirección' },
  { label: 'un hash', glyph: 'hash', word: 'hash' },
] as const;

/** The SOC's ask. */
export const SOC = { who: 'el SOC:', ask: '¿y qué le damos que dure?' } as const;

export const TITLE = { main: 'YARA y Sigma', sub: 'del indicador a la regla' } as const;

/** The promise, each chip on its own word of s01-02. */
export const PROMISE = [
  { text: 'qué mira cada una', word: 'mira' },
  { text: 'cuándo salta de más', word: 'salta' },
  { text: 'qué rompe cada regla', word: 'rompe' },
] as const;
