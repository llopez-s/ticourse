/**
 * s04-huella «Una huella no se descifra» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * Every hash here is INVENTED and abbreviated (4 + «…» + 4 of 64 characters); none matches the
 * campaign registry (`b41f0e7c…c7a2`, `9f2b7c…41d0`, `4e81a0…c92f`, `9f3a…e1`, `4c81…b3`). The
 * changed one differs from the first in every shown character.
 */

export const S04 = {
  machine: 'SHA-256',
  /** The offer's fingerprint (canon). */
  print: 'e3a1…9c07',
  /** After one cent changes: every character different. */
  changed: '58bd…f26e',
  price: { from: '12,40', to: '12,41' },
  sameLength: 'siempre igual de larga',
  sameLengthSub: '64 caracteres; aquí, abreviada',
  printLabel: 'la huella de la oferta',
  changeLabel: 'un céntimo: la huella cambia entera',
  integrity: 'integridad: ¿ha cambiado?',
  oneWay: 'una sola dirección · sin clave · no se descifra',
  term: 'HASH',
  termSub: 'no es cifrado',
  /** Collision: two different documents, the same line (invented). */
  collision: {
    term: 'COLLISION',
    sub: 'colisión',
    same: ['la misma', 'huella'] as const,
    value: 'a46f…0d3b',
    docs: ['documento A', 'documento B'] as const,
    via: 'MD5',
  },
  algos: {
    retired: ['MD5', 'SHA-1'] as const,
    retiredStamp: 'retirados',
    today: ['SHA-256', 'SHA-3'] as const,
    todayChip: 'hoy',
  },
} as const;
