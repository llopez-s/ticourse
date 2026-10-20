/** s01-hook «Tres decisiones antes de estrenar» — on-screen strings (canon: out/scene-brief.md). */

/** The case stamp: a proposal, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'aplicación nueva · propuesta · sin fecha' } as const;

/** «Construir en la nube»: the second half in sky (the cloud). */
export const TITLE = ['Construir ', 'en la nube'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 3.1';

/** The promise: one chip per checkbox of the window, lit on the word of s01-02 that names it. */
export const PROMISE: readonly { text: string; word: string }[] = [
  { text: 'la plantilla', word: 'plantilla' },
  { text: 'la función', word: 'función' },
  { text: 'las piezas', word: 'piezas' },
];

/** The three decisions as the window's own rows (end card and poster). */
export const DECISIONS = ['la plantilla', 'la función', 'las piezas'] as const;
