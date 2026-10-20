/** s01-hook «Seis actores, tres parejas» — on-screen strings (canon: out/scene-brief.md). */

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** «Seis actores, tres parejas», in two lines for the right column. */
export const TITLE = ['Seis actores,', 'tres parejas'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 2.1';

/** The promise, one chip per pair (and chapter), each lit on the word that names it in s01-02. */
export const PROMISE: { text: string; word: string }[] = [
  { text: 'fuera y con poco', word: 'poco' },
  { text: 'fuera y con mucho', word: 'mucho' },
  { text: 'ya dentro', word: 'dentro' },
];
