/**
 * s02-spray «Una llave en todas las puertas» — on-screen strings (canon:
 * out/scene-brief.md «Canon»). The five IdP lines are the lesson's
 * (src/data/secplus/sp2-part4.ts:65-69), dated 2026-10-21, source 192.0.2.157.
 * No password appears here: the log does not keep it.
 */

export interface IdpLine {
  date: string;
  time: string;
  result: string;
  user: string;
  src: string;
  /** Empty on the OK line. */
  reason: string;
}

/** The IdP's log, titled «IdP de Halden» (never a hostname). */
export const IDP = {
  title: 'IdP de Halden',
  sub: 'registro de inicios de sesión',
} as const;

export const IDP_LINES: readonly IdpLine[] = [
  { date: '2026-10-21', time: '03:10:02', result: 'LOGIN FAIL', user: 'user=a.berg', src: 'src=192.0.2.157', reason: 'reason=bad_password' },
  { date: '2026-10-21', time: '03:10:41', result: 'LOGIN FAIL', user: 'user=j.solheim', src: 'src=192.0.2.157', reason: 'reason=bad_password' },
  { date: '2026-10-21', time: '03:11:19', result: 'LOGIN FAIL', user: 'user=m.lund', src: 'src=192.0.2.157', reason: 'reason=bad_password' },
  { date: '2026-10-21', time: '03:11:58', result: 'LOGIN FAIL', user: 'user=k.nyborg', src: 'src=192.0.2.157', reason: 'reason=bad_password' },
  { date: '2026-10-21', time: '03:12:37', result: 'LOGIN OK', user: 'user=r.haugen', src: 'src=192.0.2.157', reason: '' },
];

/** Index of the OK line (dimmed here, expanded in s03). */
export const OK_INDEX = 4;

/** «Dónde mirar», one tag per column, lit on its cue. */
export const LOOK = {
  users: 'cambia en cada línea',
  src: 'siempre el mismo',
  pace: 'unos 40 s entre intentos',
} as const;

/** «180 cuentas · 1 intento por cuenta · 03:10–05:06 · cuentas bloqueadas: 0» (the 0 at 60 px). */
export const SUMMARY = {
  accounts: 180,
  accountsLabel: 'cuentas',
  perAccount: '1 intento por cuenta',
  span: '03:10–05:06',
  lockedLabel: 'cuentas bloqueadas:',
  locked: '0',
} as const;

export const NOTE = 'este registro no guarda qué contraseña se probó';

/** The counter-example door (amber): it would lock at the 5th failure. Did not happen tonight. */
export const ONE_DOOR = {
  threshold: 'umbral: 5 fallos',
  lockout: 'ACCOUNT LOCKOUT',
  fails: 5,
} as const;

/** The single ordinary key, one try per door. */
export const EVERY_DOOR = 'una vez cada puerta · ninguna se bloquea';

/** Accounts × passwords: brute force fills a row, spraying a column. Axis titles only — no passwords, no new accounts. */
export const MATRIX = {
  rows: 'cuentas',
  cols: 'contraseñas',
  brute: 'BRUTE FORCE',
  bruteSub: 'muchas contraseñas · 1 cuenta',
  spray: 'PASSWORD SPRAYING',
  spraySub: 'pocas contraseñas · muchas cuentas',
} as const;
