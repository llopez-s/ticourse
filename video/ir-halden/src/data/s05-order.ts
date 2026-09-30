import type { IconName } from '../../../engine/src/ui';
import { CASE_TIMES, type ColumnId, type ColumnState } from '../scenes/parts/Board';

/**
 * s05-order: scene-only text. Every `word` is where the narration says it
 * (checked against narration.json, not only the estimate timeline).
 */

/** The server SILENT PAGER wants formatted (canon, V5 brief). */
export const SERVER = { host: 'srv-tc-app03', role: 'servidor de la terminal de contenedores' } as const;

/** s05-01, under the intercepted message: the tempting button and who it suits. */
export const WIPE = {
  button: 'Formatear ahora',
  her: 'le conviene a ella',
  herWord: 'ella',
  you: 'a ti, no',
  youWord: 'último',
} as const;

/** s05-02 / s05-03: the two mistakes of cleaning before containing. */
export const ERRORS_TITLE = { text: 'Limpiar antes de contener', chip: 'dos errores', chipWord: 'dos' } as const;

export const ERROR_EVIDENCE = {
  title: 'borras la prueba',
  /** The two icons land on «primera», the title writes on «borras», they break on «prueba». */
  landWord: 'primera',
  titleWord: 'borras',
  breakWord: 'prueba',
  parts: [
    { label: 'memoria', word: 'memoria' },
    { label: 'disco', word: 'disco' },
  ],
} as const;

export const ERROR_KEY = {
  title: 'vuelve con su llave',
  sub: 'en cuanto el servidor arranca',
  tag: 'otra vez dentro',
  landWord: 'segunda',
  titleWord: 'llave',
  subWord: 'servidor',
  arcWord: 'arrancar',
  tagWord: 'cuela',
} as const;

/** s05-04: the order, as three steps. `word` lights the step. */
export type Step = { id: ColumnId; verb: string; sub: string; icon: IconName; word?: string };
export const STEPS: Step[] = [
  { id: 'contain', verb: 'contener', sub: 'primero cierras', icon: 'lock', word: 'cierras' },
  { id: 'eradicate', verb: 'erradicar', sub: 'después limpias', icon: 'x', word: 'limpias' },
  { id: 'recover', verb: 'recuperar', sub: 'y luego vuelves', icon: 'archive' },
];
/** «Esta mañana … se cerró todo de golpe». */
export const MORNING = { label: 'mañana del 4-9', time: CASE_TIMES.containment, word: 'mañana', slamWord: 'golpe' } as const;

/** s05-05: the morning closure (10:30), all at once on the cue; each row lights as the voice names it. */
export type ClosureRow = { icon: IconName; name: string; state: string; note?: string; word: string };
export const CLOSURE: ClosureRow[] = [
  { icon: 'lock', name: 'ADM-WS-02', state: 'aislada', note: 'estación de administración', word: 'aislaron' },
  { icon: 'lock', name: 'ADM-WS-07', state: 'aislada', note: 'estación de administración', word: 'estaciones' },
  { icon: 'shield', name: 'srv-tc-app03', state: 'en cuarentena', note: 'VLAN restringida · sin apagar', word: 'cuarentena' },
  { icon: 'key', name: 'svc_tosreport', state: 'contraseña cambiada', note: 'cuenta de servicio', word: 'contraseña' },
];
export const CLOSURE_HEAD = { time: CASE_TIMES.containment, date: '4-9', text: 'todo de golpe' } as const;

/** The transfer had already ended by itself (canon: 02:00–04:30, 38 GB). */
export const GONE = { text: 'los datos ya se habían ido', detail: '38 GB · la salida terminó a las 04:30', word: 'datos' } as const;

/** «casilla marcada»: Contención is ticked again, 10:30. */
export const TICK = { word: 'casilla', time: CASE_TIMES.containment } as const;

/**
 * Board columns before this scene's tick. Detección was ticked at 16:09 (s02).
 * Análisis is ticked (no canon time): this morning's triage (s04) found the
 * whole scope, and s08 onwards shows it ticked too (data/s08-rca CLOSED_BOXES).
 * Preparación stays empty (s09: the plan had no deputies).
 */
export const BOARD_BEFORE: Partial<Record<ColumnId, ColumnState>> = {
  detect: { box: 'checked', time: CASE_TIMES.declared },
  analysis: { box: 'checked' },
};
