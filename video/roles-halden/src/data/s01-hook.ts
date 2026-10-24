/** s01-hook «Una lista, muchas manos» — on-screen strings (canon: out/scene-brief.md). */

/** The case stamp: a proposal, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'lista de pasajeros · propuesta · sin fecha' } as const;

/** «Quién decide»: the second word in sky. */
export const TITLE = ['Quién ', 'decide'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 5.1';

/** The promise: three heights, one chip each, lit on the word of s01-02 that names it. */
export const PROMISE = [
  { text: 'dentro de la casa', word: 'Dentro', icon: 'users' },
  { text: 'con la ley', word: 'con', icon: 'shield' },
  { text: 'arriba', word: 'arriba', icon: 'flag' },
] as const;
