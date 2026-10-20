/** s01-hook «Dónde nació» — on-screen strings (canon: out/scene-brief.md). */
import type { SilKind } from '../scenes/parts/Silhouettes';

/** The case stamp, no date and no «datos ficticios» (the engine's own tag already says it). */
export const STAMP = { what: 'Autoridad Portuaria de Halden', kind: 'caso de ejemplo' } as const;

/** «Dónde nace el fallo»: the second half in rose (the crack). */
export const TITLE = ['Dónde nace ', 'el fallo'] as const;

/** The objective plate, only in this scene. */
export const PLAQUE = 'SY0-701 · 2.3';

/**
 * The three silhouettes, each brought in on the word of s01-01 that names it, and the promise chip under each, lit on
 * the word of s01-02 that names its chapter.
 */
export const THREE: { kind: SilKind; inWord: string; chip: string; chipWord: string }[] = [
  { kind: 'server', inWord: 'servidores', chip: 'la máquina compartida', chipWord: 'máquina' },
  { kind: 'cloud', inWord: 'nube', chip: 'la nube', chipWord: 'nube' },
  { kind: 'phone', inWord: 'móviles', chip: 'el bolsillo', chipWord: 'bolsillo' },
];
