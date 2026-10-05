/**
 * s03-mfa «Una puerta se abrió» — on-screen strings (canon: out/scene-brief.md
 * «Canon»). The OK line comes from s02's log; the LOGOUT line is new and is read
 * as a fact (no reason why the session ended). Halden's IdP asked only for a
 * password on 21-10: no second factor is drawn in the log.
 */

/** The expanded OK line and the new LOGOUT line, as column parts. */
export const OK_LINE = { time: '03:12:37', result: 'LOGIN OK', user: 'user=r.haugen', src: 'src=192.0.2.157' } as const;
export const LOGOUT_LINE = { time: '03:13:15', result: 'LOGOUT', user: 'user=r.haugen', apps: 'aplicaciones abiertas: 0' } as const;

/** Next to the OK line. */
export const ASKS = { idp: 'IdP de Halden', asks: 'pide: contraseña' } as const;

/** The policy card. The password only appears here (and in RED MARROW's message). */
export const POLICY = {
  title: 'política de contraseñas',
  password: 'Halden2026!',
  checks: ['mayúscula', 'cifras', 'símbolo'],
  stamp: 'cumple',
  firstTried: 'y es de las primeras que prueba cualquiera',
} as const;

/**
 * The three actions, each lit when said. The third one splits into two lines
 * (joined with a space it is the canon string).
 */
export const ACTIONS = {
  reset: 'esa cuenta: contraseña nueva y sesiones cerradas',
  blockSrc: 'bloquear el origen, no las cuentas',
  mfa: ['MFA y lista de contraseñas prohibidas', 'en el proveedor de identidad · Sistemas · 30-11'],
} as const;

/** The door comes back with a second lock: something only you have (a phone or a hardware key). */
export const SECOND_LOCK = {
  only: 'algo que solo tú tienes',
  phone: 'móvil',
  hwkey: 'llave física',
  label: 'segundo cerrojo',
  term: 'MFA',
} as const;
