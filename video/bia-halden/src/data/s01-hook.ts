/**
 * s01-hook «Enseguida» — on-screen strings (canon: out/scene-brief.md «Canon strings» › s01).
 * Two author-less speech globes (a question and a vague answer, neither a number), the title, the promise as
 * three chips lit on their own words, and PAPER GOVERNOR's tag. No date, no figure, no host.
 */
import type { IconName } from '../../../engine/src/ui';

/** The seal of every BIA figure in this video (the proposal, an example, invented data). */
export const SEAL = 'análisis de impacto en el negocio · propuesta · ejemplo · datos ficticios';

/** The two globes. `cue` brings the question; `word` (in s01-01) brings the answer. */
export const GLOBES: { ask: string; answer: string; cue: string; word: string }[] = [
  { ask: '¿Cuánto tarda en volver?', answer: 'Enseguida.', cue: 'ask-time', word: 'Enseguida' },
  { ask: '¿Y cuántos datos se pierden?', answer: 'Poca cosa.', cue: 'ask-data', word: 'Poca' },
];

export const TITLE = ['RTO', 'y', 'RPO'] as const;

/** The promise (s01-02 «qué se promete, cómo se mide y cómo se compara»), each chip lit on its word. */
export const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'qué se promete', word: 'promete', icon: 'flag' },
  { text: 'cómo se mide', word: 'mide', icon: 'chart' },
  { text: 'se compara', word: 'compara', icon: 'layers' },
];

/** «PAPER GOVERNOR · sección 5» with «vive en los huecos de tu gobernanza» under it (a label, never a portrait). */
export const ADVERSARY = { name: 'PAPER GOVERNOR', section: 'sección 5', line: 'vive en los huecos de tu gobernanza' } as const;
