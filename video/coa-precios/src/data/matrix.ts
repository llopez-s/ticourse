/**
 * The lesson's Courses of Action matrix (src/data/s2.ts, module s2m2, «La matriz, rellena»), cell by cell
 * and word for word. It is the analyst's working menu, never «what Meridian has deployed».
 * One retouch only: «RR. HH.» is written with its space (the brief's canon; the lesson has «RR.HH.»).
 *
 * Each cell's text comes pre-broken twice: `lines` for the grid cell and the enlarged row (≤ 17
 * characters a line), `wide` for a lifted card (two lines). A token is plain text or `{ m }` = an
 * identifier, set in mono (never spoken, never shown anywhere else).
 */
export type PhaseId = 'delivery' | 'exploitation' | 'installation' | 'c2' | 'aoo';
export type ActionId = 'detect' | 'deny' | 'disrupt' | 'degrade' | 'deceive';
export type CellId = `${PhaseId}-${ActionId}`;

export type Token = string | { m: string };
export type Line = Token[];

export interface MatrixCellDef {
  phase: PhaseId;
  action: ActionId;
  lines: Line[];
  wide: Line[];
  /** `[!]`: an action the actor can see. `markNote` is the lesson's «quema tu visibilidad». */
  mark?: boolean;
  markNote?: string[];
  /** The lesson's aside under the cell, small. */
  note?: string[];
  /** Drawn dashed grey and stepped back in every scene (the decoy mailbox). */
  alwaysDim?: boolean;
}

export const PHASES: { id: PhaseId; name: string; lines: string[]; short: string }[] = [
  { id: 'delivery', name: 'DELIVERY', lines: ['DELIVERY'], short: 'Delivery' },
  { id: 'exploitation', name: 'EXPLOITATION', lines: ['EXPLOITATION'], short: 'Exploitation' },
  { id: 'installation', name: 'INSTALLATION', lines: ['INSTALLATION'], short: 'Installation' },
  { id: 'c2', name: 'COMMAND & CONTROL', lines: ['COMMAND &', 'CONTROL'], short: 'C2' },
  { id: 'aoo', name: 'ACTIONS ON OBJECTIVES', lines: ['ACTIONS ON', 'OBJECTIVES'], short: 'Actions on Objectives' },
];
export const PHASE_IDS = PHASES.map((p) => p.id);

export const ACTIONS: { id: ActionId; name: string }[] = [
  { id: 'detect', name: 'DETECT' },
  { id: 'deny', name: 'DENY' },
  { id: 'disrupt', name: 'DISRUPT' },
  { id: 'degrade', name: 'DEGRADE' },
  { id: 'deceive', name: 'DECEIVE' },
];
export const ACTION_IDS = ACTIONS.map((a) => a.id);

const m = (s: string): Token => ({ m: s });

export const CELLS: MatrixCellDef[] = [
  { phase: 'delivery', action: 'detect', lines: [['alerta en mail'], ['gateway: ZIP con'], ['LNK interno']], wide: [['alerta en mail gateway:'], ['ZIP con LNK interno']] },
  {
    phase: 'delivery',
    action: 'deny',
    lines: [['bloquear'], [m('cdn-sync-status')], [m('.example'), ' en el'], ['gateway']],
    wide: [['bloquear ', m('cdn-sync-status.example')], ['en el gateway']],
    mark: true,
  },
  {
    phase: 'delivery',
    action: 'deceive',
    lines: [['buzón señuelo de'], ['RR. HH. que'], ['acepta y detona'], ['adjuntos']],
    wide: [['buzón señuelo de RR. HH.'], ['que acepta y detona adjuntos']],
    alwaysDim: true,
  },
  { phase: 'exploitation', action: 'detect', lines: [['regla EDR: LNK'], ['que lanza'], [m('powershell -enc')]], wide: [['regla EDR: LNK que lanza'], [m('powershell -enc')]] },
  {
    phase: 'exploitation',
    action: 'deny',
    lines: [['política ASR:'], ['explorer no puede'], ['crear procesos'], ['PowerShell']],
    wide: [['política ASR: explorer no puede'], ['crear procesos PowerShell']],
  },
  {
    phase: 'installation',
    action: 'detect',
    lines: [['alerta: ', m('schtasks')], [m('/create'), ' fuera del'], ['inventario'], ['aprobado']],
    wide: [['alerta: ', m('schtasks /create')], ['fuera del inventario aprobado']],
  },
  {
    phase: 'installation',
    action: 'disrupt',
    lines: [['aislamiento'], ['automático del'], ['host al crearse'], ['la tarea']],
    wide: [['aislamiento automático del host'], ['al crearse la tarea']],
    mark: true,
  },
  { phase: 'c2', action: 'detect', lines: [['anomalía: beacon'], ['TLS periódico'], ['hacia dominio'], ['joven']], wide: [['anomalía: beacon TLS periódico'], ['hacia dominio joven']] },
  {
    phase: 'c2',
    action: 'deny',
    lines: [['sinkhole de'], [m('update-svc-cdn.com')]],
    wide: [['sinkhole de ', m('update-svc-cdn.com')]],
    mark: true,
    markNote: ['quema tu', 'visibilidad'],
  },
  {
    phase: 'c2',
    action: 'degrade',
    lines: [['throttling del'], ['egress hacia el'], ['C2 (compra'], ['tiempo de mapeo)']],
    wide: [['throttling del egress hacia el C2'], ['(compra tiempo de mapeo)']],
  },
  { phase: 'aoo', action: 'detect', lines: [['DLP: lecturas'], ['masivas en'], ['carpetas CAD de'], ['propulsión']], wide: [['DLP: lecturas masivas en'], ['carpetas CAD de propulsión']] },
  {
    phase: 'aoo',
    action: 'degrade',
    lines: [['rate-limit de'], ['transferencias'], ['salientes no'], ['catalogadas']],
    wide: [['rate-limit de transferencias'], ['salientes no catalogadas']],
  },
  {
    phase: 'aoo',
    action: 'deceive',
    lines: [['planos CAD'], ['señuelo con'], ['canary tokens']],
    wide: [['planos CAD señuelo'], ['con canary tokens']],
    note: ['(invisible si está', 'bien hecho)'],
  },
];

export const cellId = (phase: PhaseId, action: ActionId): CellId => `${phase}-${action}`;
export const CELL: Partial<Record<CellId, MatrixCellDef>> = Object.fromEntries(CELLS.map((c) => [cellId(c.phase, c.action), c]));
/** The three `[!]` cells. */
export const MARKED: CellId[] = CELLS.filter((c) => c.mark).map((c) => cellId(c.phase, c.action));
/** Populated cells per phase (s04's `counts`). */
export const COUNTS: Record<PhaseId, number> = { delivery: 3, exploitation: 2, installation: 2, c2: 3, aoo: 3 };

export const MATRIX_TEXT = {
  title: 'Matriz Courses of Action · extracto de trabajo (ficticia)',
  mark: '[!]',
  legend: 'acción visible para el actor',
  /** The two phases the extract leaves out, and why. */
  missing: { phases: 'Reconnaissance · Weaponization', text: 'casi nunca a tu alcance' },
  noCell: 'Discover y Destroy no ocupan celda en este extracto',
} as const;
