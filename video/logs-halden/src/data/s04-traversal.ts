/**
 * s04-traversal «Una nota con indicaciones» — on-screen strings (canon: out/scene-brief.md, «Canon»).
 * The two access-log lines are the lesson's (`src/data/secplus/sp2-part4.ts:61-62`) with the time and
 * the source added; the host is `hpa-portal-web-01` (`sp4-part3.ts:56`). The folder plan only names
 * the start (the portal's folder), the root, `etc` and `passwd`: the four steps in between stay unnamed.
 */

export const S04_LOG = {
  title: 'registro de accesos',
  host: 'hpa-portal-web-01',
  hostSub: 'portal público de reservas de atraque',
  srcLead: 'origen',
  src: '192.0.2.157',
} as const;

/** Token ids of the two log lines (each one styled on its own). */
export type LogTokenId =
  | 't1' | 'm1' | 'p1' | 'f1' | 'u1a' | 'u1b' | 'u1c' | 'u1d' | 'e1' | 's1' | 'b1'
  | 't2' | 'm2' | 'p2' | 'f2' | 'x2a' | 'x2b' | 'x2c' | 'e2a' | 'e2s' | 'e2b' | 's2' | 'b2'
  | 'sp';

/**
 * `04:26:14  GET /gate/viewdoc?file=../../../../etc/passwd  200  1834`, token by token
 * (joined, the tokens give the canon line back exactly).
 */
export const LINE_1: readonly { id: LogTokenId; t: string }[] = [
  { id: 't1', t: '04:26:14' },
  { id: 'sp', t: '  ' },
  { id: 'm1', t: 'GET ' },
  { id: 'p1', t: '/gate/viewdoc?' },
  { id: 'f1', t: 'file=' },
  { id: 'u1a', t: '../' },
  { id: 'u1b', t: '../' },
  { id: 'u1c', t: '../' },
  { id: 'u1d', t: '../' },
  { id: 'e1', t: 'etc/passwd' },
  { id: 'sp', t: '  ' },
  { id: 's1', t: '200' },
  { id: 'sp', t: '  ' },
  { id: 'b1', t: '1834' },
];

/** `04:26:21  GET /gate/viewdoc?file=%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fshadow  403  0`. */
export const LINE_2: readonly { id: LogTokenId; t: string }[] = [
  { id: 't2', t: '04:26:21' },
  { id: 'sp', t: '  ' },
  { id: 'm2', t: 'GET ' },
  { id: 'p2', t: '/gate/viewdoc?' },
  { id: 'f2', t: 'file=' },
  { id: 'x2a', t: '%2e%2e%2f' },
  { id: 'x2b', t: '%2e%2e%2f' },
  { id: 'x2c', t: '%2e%2e%2f' },
  { id: 'e2a', t: 'etc' },
  { id: 'e2s', t: '%2f' },
  { id: 'e2b', t: 'shadow' },
  { id: 'sp', t: '  ' },
  { id: 's2', t: '403' },
  { id: 'sp', t: '  ' },
  { id: 'b2', t: '0' },
];

/** Next to `200` / `1834` on `served`. */
export const SERVED = 'se lo llevó';

/** The folder plan. */
export const PLAN = {
  start: 'carpeta del portal',
  root: '/',
  rootSub: 'raíz',
  etc: 'etc',
  passwd: 'passwd',
  users: 'lista de usuarios',
  dots: '../',
} as const;

/** The records-office image: the order note left at the window (never «armario»). */
export const NOTE = { lines: ['sal de la sala', 'y sube cuatro plantas'] } as const;

/** Exam name (English) and the struck-through trap: only the trap's name is struck, the reason stays readable. */
export const S04_NAME = 'DIRECTORY TRAVERSAL';
export const NOT_SQLI = { term: 'inyección', sep: ': ', rest: 'no cuela código, solo cambia la ruta' } as const;

/** The encoded line, decoded character by character. */
export const DECODE = {
  pairs: [
    { enc: '%2e', dec: '.' },
    { enc: '%2e', dec: '.' },
    { enc: '%2f', dec: '/' },
  ],
  label: 'la misma nota, codificada',
} as const;

/** Next to `403  0` (`shadow` in monospace). */
export const NO_FILTER = { lead: '403: el servidor no puede leer ', file: 'shadow', sep: ' · ', rest: 'no es un filtro' } as const;

/** The defence, drawn on the plan. */
export const DEFENCE = { resolve: 'resolver la ruta', sep: ' · ', confine: 'comprobar que sigue dentro', resolved: '/etc/passwd', reject: 'se rechaza' } as const;
