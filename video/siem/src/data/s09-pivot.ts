import { random } from 'remotion';

/**
 * S09 "Pivotar y correlacionar" — fictitious data only. Times match the
 * narration and lesson: query from 01:30, 4624 logon of svc_tosreport at
 * 01:52 from ADM-WS-07 (10.20.4.17), exfiltration 02:00–04:30 (38 GB) to
 * 203.0.113.47 — 8 minutes after the logon.
 */

/** Spanish pseudo-query (no real query language), typed on two lines. */
export type QueryTokenKind = 'kw' | 'field' | 'value' | 'time' | 'pipe';
export const QUERY_LINES: { t: string; k: QueryTokenKind }[][] = [
  [
    { t: 'buscar', k: 'kw' },
    { t: ' host=', k: 'field' },
    { t: 'srv-tc-app03', k: 'value' },
    { t: ' desde ', k: 'kw' },
    { t: '01:30', k: 'time' },
    { t: ' hasta ', k: 'kw' },
    { t: '04:30', k: 'value' },
  ],
  [
    { t: '| ', k: 'pipe' },
    { t: 'unir ', k: 'kw' },
    { t: 'autenticación, netflow', k: 'value' },
    { t: ' | ', k: 'pipe' },
    { t: 'ordenar por ', k: 'kw' },
    { t: 'hora', k: 'value' },
  ],
];

export const LOGON = {
  time: '01:52',
  eventId: '4624',
  label: 'inicio de sesión',
  account: 'svc_tosreport',
  origin: 'ADM-WS-07',
  originRole: 'estación de administración',
  originIp: '10.20.4.17',
  privId: '4672',
  privLabel: 'privilegios especiales',
};

export const FLOW_START = { time: '02:00', label: 'inicio de la salida', dest: '203.0.113.47:443' };
export const FLOW_END = { time: '04:30', label: 'fin de la salida', total: '38 GB' };

/** Minutes between the logon and the start of the transfer (01:52 → 02:00). */
export const GAP_MIN = 8;

/**
 * UBA heatmap of svc_tosreport over the last 30 days × 24 hours. The account
 * only runs its reports on weekdays between 08:00 and 18:00; the single
 * outlier is today at 01:xx (the 01:52 logon). Today is still in progress
 * (the triage happens in the morning), so its cells after 10:00 are empty.
 */
export const UBA_DAYS = 30;
export const UBA_HOURS = 24;
export const BASELINE_FROM = 8;
export const BASELINE_TO = 18; // exclusive
export const OUTLIER = { day: UBA_DAYS - 1, hour: 1, label: 'hoy, 01:52' };
/** Hour the triage is happening today: later cells of today have no data yet. */
export const TODAY_NOW_H = 10;

/** Activity 0–1 per cell (0 = none). Weekends (two days in seven) are quiet. */
export const UBA_ACTIVITY: number[][] = Array.from({ length: UBA_DAYS }, (_, d) =>
  Array.from({ length: UBA_HOURS }, (_, h) => {
    if (d === OUTLIER.day && h === OUTLIER.hour) return 1;
    if (d === OUTLIER.day && h >= TODAY_NOW_H) return 0;
    const weekend = (d + 2) % 7 >= 5;
    if (weekend || h < BASELINE_FROM || h >= BASELINE_TO) return 0;
    const r = random(`s09-uba-${d}-${h}`);
    return r < 0.12 ? 0 : 0.3 + 0.7 * r;
  }),
);
