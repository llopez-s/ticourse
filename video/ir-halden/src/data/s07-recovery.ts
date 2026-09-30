import { CASE_TIMES, type ColumnId, type ColumnState } from '../scenes/parts/Board';

/**
 * s07-recovery: scene-only text. Every `word` is where the narration says it
 * (checked against narration.json, not only the estimate timeline).
 */

export const SERVER = { name: 'srv-tc-app03', role: 'servidor de la terminal de contenedores' } as const;

/** s07-01: memory and disk already captured. */
export const CAPTURED = [
  { text: 'memoria capturada', word: 'memoria' },
  { text: 'disco capturado', word: 'disco' },
] as const;
export const RECOVER = { text: 'toca recuperar', word: 'recuperar' } as const;

/**
 * The three backups of srv-tc-app03 (canon). Drawn on a timeline in
 * chronological order, left to right; the canon lists them newest first.
 */
export type Backup = { id: 'b1' | 'b2' | 'b3'; date: string; time: string };
export const BACKUPS: Backup[] = [
  { id: 'b1', date: '2026-09-01', time: '23:00' },
  { id: 'b2', date: '2026-09-02', time: '23:00' },
  { id: 'b3', date: '2026-09-03', time: '23:00' },
];
export const BACKUPS_TITLE = { text: 'copias de seguridad de', word: 'tres' } as const;

/** s07-02: last night's copy looks like the good one. */
export const LAST_NIGHT = { newest: 'la más reciente', newestWord: 'reciente', before: 'antes de la alerta', beforeWord: 'antes' } as const;
export const ALERT = { title: 'alerta', when: '4-9 · madrugada', word: 'alerta' } as const;

/** s07-03: what counts is when she got in. */
export const VERDICT = { stamp: 'no vale', seenWord: 'viste' } as const;
export const ENTRY = { title: 'entró · 3-9 por la tarde', mail: 'correo a Lucía', word: 'entró', nth: 0, zoneNth: 1, strikeWord: 'tarde', mailWord: 'correo' } as const;
export const ZONE = 'ella ya dentro';

/** s07-04: a photo of the warehouse taken while she was around. */
export const PHOTO = {
  host: SERVER.name,
  caption: 'copia del 3-9 · 23:00',
  line1: 'una foto con ella dentro',
  line1Word: 'fotografiar',
  line2: '¿limpia? nadie lo garantiza',
  line2Word: 'caja',
  hideWord: 'detrás',
} as const;

/** s07-05: the copy from before everything, checked twice. */
export const RESTORE = { chip: 'antes de todo el incidente', word: 'antes', flyWord: 'todo', arrow: 'restaurar' } as const;
export const CHECKS = {
  hash: { text: 'hash coincide', sub: 'integridad comprobada' },
  ops: { text: 'Operaciones: manifiestos OK', word: 'Operaciones', tickWord: 'cuadran' },
} as const;

/** s07-06: back to work, watched closely for a month. */
export const WATCH = { live: 'en producción', liveWord: 'vuelve', text: 'vigilancia reforzada', days: '30 días', word: 'vigilado', daysWord: 'mes', tickWord: 'alarma' } as const;

/** Board before this scene: Detección 16:09, Análisis and Contención 10:30 (s05), Erradicación (s06, no canon time). */
export const BOARD_BEFORE: Partial<Record<ColumnId, ColumnState>> = {
  detect: { box: 'checked', time: CASE_TIMES.declared },
  analysis: { box: 'checked' },
  contain: { box: 'checked', time: CASE_TIMES.containment },
  eradicate: { box: 'checked' },
};
