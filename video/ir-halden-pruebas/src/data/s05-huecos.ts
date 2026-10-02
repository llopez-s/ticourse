/**
 * s05-huecos «Lo que deja la caza»: scene-only text (canon: out/scene-brief.md).
 * The two dark servers are a visibility gap and nothing else: never linked to
 * the exfiltration, to the attacker or to whoever installed them.
 * `at` = the narration word a beat lands on (segment, word, nth).
 */

export interface WordRef {
  seg: string;
  word: string;
  nth?: number;
}

/** s05-01: the hunt's result, 30 nights by the hour between 00:00 and 06:00. */
export const RESULT = {
  title: 'logons de cuentas de servicio · de 00:00 a 06:00',
  range: 'últimos 30 días (13-09 a 13-10)',
  legend: 'tareas conocidas, a su hora',
  legendAt: { seg: 's05-01', word: 'tareas' },
  unexplained: 'sin explicar:',
  zero: '0',
  /** 10-minute bins over six hours. */
  bins: 36,
  nights: 30,
  hours: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'],
} as const;

/**
 * Nights (of 30) with a service-account logon in each 10-minute bin: the known
 * scheduled tasks, every night at their hour (30) or weekly (4). Nothing else;
 * nothing near the hours of the September night is marked.
 */
export const HISTOGRAM: Record<number, number> = {
  1: 30, // 00:10
  4: 30, // 00:40
  9: 30, // 01:30
  14: 4, // 02:20
  18: 30, // 03:00
  25: 30, // 04:10
  29: 4, // 04:50
  34: 30, // 05:40
};

/** s05-02: the coverage map of the central log collector. */
export const COVERAGE = {
  total: '24 servidores',
  lit: '22 con registros',
  dark: '2 nunca conectados',
  cols: 4,
  rows: 6,
} as const;

/**
 * The 24 tiles, row by row. A name only on some of the lit ones (servers that
 * already send logs in the SIEM video); null = unlabeled. `dark` = never connected.
 */
export interface ServerTile {
  name: string | null;
  dark?: { desc: string };
}
export const TILES: ServerTile[] = [
  { name: 'dc-01' },
  { name: null },
  { name: 'srv-tc-app03' },
  { name: null },
  { name: null },
  { name: 'srv-fich02' },
  { name: null },
  { name: 'srv-bascula01', dark: { desc: 'báscula de camiones' } },
  { name: 'backup01' },
  { name: null },
  { name: null },
  { name: 'rdp01' },
  { name: null },
  { name: 'srv-gis01' },
  { name: null },
  { name: null },
  { name: null },
  { name: null },
  { name: 'srv-accesos01', dark: { desc: 'control de accesos · puerta de camiones' } },
  { name: null },
  { name: 'srv-tc-app01' },
  { name: null },
  { name: null },
  { name: null },
];

export const DARK_TAG = '0 registros · nunca conectados';

/** s05-02 / s05-03 beats. */
export const DARK_WORDS = {
  two: { seg: 's05-02', word: 'Dos' },
  never: { seg: 's05-02', word: 'nunca' },
  taps: { seg: 's05-02', word: 'grifos' },
  meter: { seg: 's05-02', word: 'contador' },
} as const;

/** s05-03. */
export const UNKNOWN = { text: 'ni bueno ni malo: no se ven', at: { seg: 's05-03', word: 'bueno' } } as const;

/** s05-04: the two fixes, each with owner and date (exact canon text). */
export type FixPiece = string | { mono: string };
export interface Fix {
  text: FixPiece[];
  owner: string;
  date: string;
  at: WordRef;
}
export const FIXES: Fix[] = [
  {
    text: ['conectar ', { mono: 'srv-bascula01' }, ' y ', { mono: 'srv-accesos01' }, ' a la central'],
    owner: 'Sistemas',
    date: '16-10',
    at: { seg: 's05-04', word: 'Conectas' },
  },
  {
    text: ['regla: cuenta de servicio fuera de su horario, desde cualquier equipo'],
    owner: 'SOC',
    date: '15-10',
    at: { seg: 's05-04', word: 'regla' },
  },
];
export const FIX_HEADS = { owner: 'responsable', date: 'fecha' } as const;
/** «La caza te deja dos arreglos»: the map and the meter make room. */
export const FIXES_WORD = { seg: 's05-04', word: 'arreglos' } as const;

/** s05-05: the closing line; «dónde no ves» lights the gaps once more. */
export const NEVER_EMPTY = {
  text: 'una caza nunca vuelve de vacío',
  at: { seg: 's05-05', word: 'Vamos' },
  gapsAt: { seg: 's05-05', word: 'dónde' },
} as const;
