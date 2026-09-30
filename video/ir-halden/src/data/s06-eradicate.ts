import type { IconName } from '../../../engine/src/ui';
import { CASE_TIMES, type ColumnId, type ColumnState } from '../scenes/parts/Board';

/**
 * s06-eradicate: scene-only text. Every `word` is where the narration says it
 * (checked against narration.json, not only the estimate timeline).
 */

/** The weekly scheduled task (canon: created 01:58 during the 01:52 session, «cada jueves, 23:30»). */
export const TASK = {
  title: 'tarea programada',
  created: 'creada a las 01:58, en la sesión de la 01:52',
  when: 'cada jueves · 23:30',
} as const;

export type Host = { name: string; role: string; icon: IconName };
export const SERVER: Host = { name: 'srv-tc-app03', role: 'servidor de la terminal de contenedores', icon: 'server' };
export const STATION: Host = { name: 'ADM-WS-07', role: 'estación de administración · 10.20.4.17', icon: 'desktop' };

/** s06-01 (under the intercept): what was already cleaned, and the task that is still there. */
export const CLEANED = { label: 'programa', chip: 'borrado' } as const;
export const NO_AGENT = 'sin agente EDR';
export const TASK_WORDS = { task: 'tarea', when: 'jueves' } as const;

/** s06-02: the name, and the same task on the station nobody watched. */
export const PERSIST = { label: 'persistencia', word: 'persistencia', twinWord: 'igual', noAgentWord: 'nadie' } as const;

/** s06-03: the cleaning list, struck item by item. */
export type CleanItem = { text: string; mono?: string; chip?: string; word: string; sub?: boolean; group?: boolean };
export const CLEAN_TITLE = 'Lista de limpieza';
export const CLEAN_ITEMS: CleanItem[] = [
  { text: 'el programa', word: 'programa' },
  { text: 'la tarea programada', mono: 'srv-tc-app03 · ADM-WS-07', word: 'persistencia' },
  { text: 'el agujero por el que entró', word: 'agujero', group: true },
  { text: 'permiso de macros de Operaciones', chip: 'retirado', word: 'agujero', sub: true },
  { text: 'regla 3 del cortafuegos', mono: 'ALLOW any any tcp/443', chip: 'confirmada', word: 'entró', sub: true },
];
/** «Eso es erradicar». */
export const ERADICATE = { label: 'esto es erradicar', word: 'erradicar' } as const;

/** s06-04: the port warehouse. Each action names what it stands for. */
export type NaveAction = { action: string; means: string; icon: IconName; word: string };
export const NAVE_ACTIONS: NaveAction[] = [
  { action: 'echar a la intrusa', means: 'borrar el programa', icon: 'user', word: 'intrusa' },
  { action: 'revisar cada rincón', means: 'quitar la persistencia', icon: 'search', word: 'revisar' },
  { action: 'tapiar la ventana', means: 'tapar el agujero', icon: 'firewall', word: 'tapiar' },
];
export const NAVE_LABEL = { label: 'srv-tc-app03', sub: 'la nave del puerto', word: 'nave', doneWord: 'coló' } as const;

/** s06-05: the V1 search plus the scheduled task, on every host of the port. */
export type Indicator = { label: string; value?: string; pattern?: string[]; chip?: string };
export const HUNT_TITLE = 'búsqueda en todos los equipos';
export const INDICATORS: Indicator[] = [
  { label: 'hash del documento', value: 'b41f0e7c…c7a2' },
  { label: 'dominio', value: 'cdn-halden-sync.example' },
  { label: 'patrón de procesos', pattern: ['WINWORD.EXE', 'cmd.exe', 'powershell.exe -enc'] },
  { label: 'tarea programada', value: TASK.when, chip: 'añadida' },
];
export const HUNT_WORDS = { thisOne: 'servidor', search: 'búsqueda', all: 'todos', also: 'también', unseen: 'veían', clean: 'limpia' } as const;

/**
 * The fleet: the hosts already on screen in V1/V5 plus the grey filler hosts of
 * V1; `null` = a blank tile (other hosts of the port, not named).
 */
export const FLEET: (string | null)[] = [
  'OPS-WS-14', 'OPS-WS-08', 'ADM-WS-02', 'ADM-WS-07',
  'srv-tc-app03', 'FIN-WS-05', 'LOG-WS-11', 'SALES-WS-03',
  null, null, null, null,
  null, null, null, null,
];
export const FLEET_TITLE = 'equipos del puerto';
export const UNSEEN_HOST = 'ADM-WS-07';
export const UNSEEN_TAG = { before: 'sin agente', after: 'ya con agente' } as const;
export const RESULT = { label: 'resultados' } as const;

/** Board before this scene: Detección 16:09, Análisis (s05), Contención 10:30 (s05). Preparación stays empty. */
export const BOARD_BEFORE: Partial<Record<ColumnId, ColumnState>> = {
  detect: { box: 'checked', time: CASE_TIMES.declared },
  analysis: { box: 'checked' },
  contain: { box: 'checked', time: CASE_TIMES.containment },
};
