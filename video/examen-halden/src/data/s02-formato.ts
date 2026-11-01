/** s02-formato «Lo que te espera» — on-screen strings (canon: out/scene-brief.md). Figures are the lesson's data. */
import type { IconName } from '../../../engine/src/ui';

export const SHEET_TITLE = 'Ficha del examen';

export interface SheetRow {
  id: string;
  icon: IconName | 'bar';
  text: string;
}

/** In the order the voice says them (the cue or word that lights each row is in S02Formato). */
export const ROWS: SheetRow[] = [
  { id: 'questions', icon: 'layers', text: 'hasta 90 preguntas' },
  { id: 'format', icon: 'check', text: 'test (una o varias respuestas) + simulaciones' },
  { id: 'minutes', icon: 'bar', text: '90 minutos' },
  { id: 'closed-book', icon: 'eyeOff', text: 'closed-book: sin apuntes' },
  { id: 'scale', icon: 'chart', text: 'escala de 100 a 900 · aprobado: 750' },
];

/** Under the scale row, on the word «porcentaje». */
export const SCALE_NOTE = 'una escala, no un porcentaje';

/** Fixed chip, from the `caveat` cue. */
export const CAVEAT = 'datos de la lección · compruébalos en comptia.org';
