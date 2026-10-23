/**
 * s06-falta «Cuánto falta» — the gap-analysis table (on-screen strings). An invented norm for these sheets: the three
 * rows and their state are an example with fictitious data, NOT the port's state («llega sin firma» included). Each
 * row lights on the voice's word in s06-04 (`word`). `tone` colours the gap and the priority: emerald = nothing to do,
 * amber = halfway, rose = missing.
 */

export const TABLE_STAMP = 'gap analysis · ejemplo · datos ficticios';
export const TABLE_LEAD = 'imagina una norma para estas hojas';
export const COLUMNS = ['lo que pide', 'lo que hay', 'hueco', 'prioridad'] as const;

export type GapTone = 'emerald' | 'amber' | 'rose';

export interface GapRow {
  asks: string;
  has: string;
  gap: string;
  priority: string;
  tone: GapTone;
  word: string;
}

export const ROWS: readonly GapRow[] = [
  { asks: 'solo la leen quienes la necesitan', has: 'permisos por puesto', gap: 'ninguno', priority: 'mantener', tone: 'emerald', word: 'cumple' },
  { asks: 'queda apuntado quién la abre y quién la cambia', has: 'solo quién la cambia', gap: 'parcial', priority: 'media', tone: 'amber', word: 'medias' },
  { asks: 'quien la declara no puede negarla', has: 'llega sin firma', gap: 'total', priority: 'alta', tone: 'rose', word: 'falta' },
];

/** The plan, highest priority first: row index into ROWS. Only the first line gets «responsable · fecha». */
export const PLAN_ORDER = [2, 1] as const;

/** When a gap analysis is done (chips, no long voice); `word` lights the chip in s06-06, none = with the row. */
export const WHEN: readonly { text: string; word?: string }[] = [
  { text: 'norma nueva', word: 'nueva' },
  { text: 'fusión' },
  { text: 'antes de una auditoría', word: 'auditoría' },
  { text: 'cada cierto tiempo', word: 'tiempo' },
];
