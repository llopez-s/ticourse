/**
 * Canon strings of «Quién puede hacer qué» (F3). Everything the scenes write on screen lives here, so the half-B scenes
 * and the half-A scenes can never drift. Fictional training case («imagina»): no dates, no IPs, no domains, no people
 * with a name. Names of Windows permissions are in Spanish and still to be checked on a real machine (F.4 of the card).
 */

/** The case stamp (the engine draws «Simulación educativa · datos ficticios» on its own). */
export const STAMP_PARTS = ['Autoridad Portuaria de Halden', 'imagina', 'caso de entrenamiento', 'sin fecha'];

export const SERVER = 'srv-fich02';
export const FOLDER_NAME = 'Partes de avería';
export const REPORTS_NAME = 'Informes';
export const SUBFOLDER_NAME = '2026';
export const ACCOUNT_LABEL = 'tu cuenta';

/** Row ids of the canonical list: scenes address rows by name, never by index. */
export type AclId = 'staff' | 'maint' | 'ops' | 'svc';
export type ReportsId = 'boss' | 'svcw';

/** What a row grants, in the two vocabularies. */
export type Perm = 'read' | 'rw' | 'write' | 'deny';

export interface AclEntry<I extends string = AclId> {
  id: I;
  /** Group or account, as written on screen. */
  who: string;
  /** `group` draws the users icon, `service` the gear. */
  kind: 'group' | 'service';
  perm: Perm;
  /** s04 «para qué» column. */
  why?: string;
}

/** «Partes de avería» · the thread of the video. Same rows, same order, in every scene. */
export const PARTES: readonly AclEntry[] = [
  { id: 'staff', who: 'Personal del taller', kind: 'group', perm: 'read', why: 'por eso la abriste' },
  { id: 'maint', who: 'Mantenimiento', kind: 'group', perm: 'rw', why: 'redacta los partes' },
  { id: 'ops', who: 'Operaciones', kind: 'group', perm: 'read', why: 'planifica los turnos' },
  { id: 'svc', who: 'svc_resumen', kind: 'service', perm: 'read', why: 'lo verás enseguida' },
];

/**
 * «Informes» (only from s06). `svcw` (svc_resumen · escribir) does NOT exist until `answer` of s07: draw it with
 * `missing` (ghost) before that and as a green row after.
 */
export const INFORMES: readonly AclEntry<ReportsId>[] = [
  { id: 'boss', who: 'Jefatura del taller', kind: 'group', perm: 'read' },
  { id: 'svcw', who: 'svc_resumen', kind: 'service', perm: 'write' },
];

/** Plain words for s03–s07 and s10; Windows names only in s08. */
export const PERM_PLAIN: Record<Perm, string> = { read: 'leer', rw: 'leer y escribir', write: 'escribir', deny: 'denegar' };
export const PERM_WINDOWS: Record<Perm, string> = { read: 'Lectura', rw: 'Modificar', write: 'Escritura', deny: 'Denegar' };

/** The grey row at the bottom of the list. */
export const REST_LABEL = 'nadie más';
export const REST_PORT = 'el resto del puerto';
export const REST_NOTE = 'no aparece = no entra';

/** The process of s06 (the style of the EDR tree of V1, none of its data). */
export const PROCESS_ROW = {
  host: SERVER,
  name: 'resumen.exe',
  pid: '4120',
  account: 'svc_resumen',
  parent: 'programador de tareas',
} as const;

export const SERVICE_ACCOUNT = { name: 'svc_resumen', note: 'no es de una persona', login: 'sin inicio de sesión interactivo', owner: 'responsable: Sistemas' } as const;

/** Linux copy (s09). `file`/`dir` are the exact lines of the canon; `LINUX_PARTS` is the same text cut in its blocks. */
export const LINUX = {
  file: '-rw-r----- 1 mant mantenimiento grua-04.txt',
  dir: 'drwxr-x--- 2 mant mantenimiento partes/',
} as const;

/** A `ls -l` line cut in its pieces: type character, owner / group / rest blocks of three letters, and the tail. */
export interface LsParts {
  type: string;
  owner: string;
  group: string;
  rest: string;
  tail: string;
}

export const LINUX_PARTS: { file: LsParts; dir: LsParts; counter: LsParts } = {
  file: { type: '-', owner: 'rw-', group: 'r--', rest: '---', tail: ' 1 mant mantenimiento grua-04.txt' },
  dir: { type: 'd', owner: 'rwx', group: 'r-x', rest: '---', tail: ' 2 mant mantenimiento partes/' },
  /** s09 `counter`: the owner has `---`, the group `r--`, and the owner is also in the group (and still cannot read). */
  counter: { type: '-', owner: '---', group: 'r--', rest: '---', tail: ' 1 mant mantenimiento grua-04.txt' },
};

/** The three classes of Linux, in the order of the line. */
export const LINUX_CLASSES = [
  { id: 'owner', word: 'dueño', sub: 'mant' },
  { id: 'group', word: 'grupo', sub: 'mantenimiento' },
  { id: 'rest', word: 'resto', sub: 'todos los demás' },
] as const;

/**
 * The account walked through the three questions of s09 (it is neither the owner nor in the group). It is NOT called
 * «Operaciones»: Operaciones does read the folder (s04, s10), and here the walk ends in `---`.
 */
export const OPS_GROUP = 'otra cuenta del puerto';

/** Image of the airport (s02 only, always tagged «imagen · no es del puerto»). Flight labels belong to the image. */
export const FLIGHTS = ['vuelo 21', 'vuelo 34', 'vuelo 58'] as const;
export const WRITE_GATE = `${FOLDER_NAME} · escribir`;

/** Shared geometry of the thread: the folder and its list always sit here (stage-local px). */
export const THREAD = { x: 0, y: 84, width: 800 } as const;
