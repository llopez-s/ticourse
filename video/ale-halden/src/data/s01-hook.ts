/** s01-hook «Una casilla roja» — on-screen strings (canon: out/scene-brief.md, «Canon strings»). */
import type { IconName } from '../../../engine/src/ui';

/** The committee's stamp, no date: «comité de riesgos · R-014 · datos ficticios». */
export const STAMP = { what: 'comité de riesgos', id: 'R-014', seal: 'datos ficticios' } as const;

/** The one lit cell of the 3 × 3 matrix. */
export const CELL_LABEL = 'R-014 · ALTO';

/** Axis names (texture, not narrated). */
export const AXES = { x: 'probabilidad', y: 'impacto' } as const;

/** The committee's question, left without an answer. */
export const QUESTION = '¿cuánto?';

/** «El riesgo, en euros al año», broken in two lines for the right column. */
export const TITLE = ['El riesgo, en euros', 'al año'] as const;

/** The promise, one chip per idea, each lit on the word that starts it (s01-02). */
export const PROMISE: { text: string; word: string; nth: number; icon: IconName }[] = [
  { text: 'lo que cuesta un evento', word: 'lo', nth: 0, icon: 'bolt' },
  { text: 'lo que cuesta al año', word: 'lo', nth: 1, icon: 'clock' },
  { text: 'si el control sale a cuenta', word: 'si', nth: 0, icon: 'check' },
];
