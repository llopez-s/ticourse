/**
 * s08-mezcla «Pinturas en la carretera» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * Anti-spoiler: before s08-06 nothing says that the final colour does not travel, nothing names
 * the session key, and the final colour is never drawn on the road.
 */

export const S08 = {
  /** s02's question, back with its road and its shadow. */
  question: '¿cómo le llega la copia de la llave?',
  same: 'los dos llegan al mismo color',
  unmix: 'solo mezclas · una mezcla no se separa',
  answer: { lead: 'no viaja', rest: 'cada lado lo calcula' },
  dh: { term: 'DIFFIE-HELLMAN', sub: 'ECDH: la misma idea con curvas elípticas' },
  limit: 'la pintura no dice con quién has mezclado',
  sessionKey: { term: 'SESSION KEY', sub: 'la copia que nadie tuvo que llevar' },
} as const;
