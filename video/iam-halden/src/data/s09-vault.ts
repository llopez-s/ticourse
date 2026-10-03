/**
 * s09-vault «El armario de llaves»: on-screen text (canon: out/scene-brief.md). Never say or draw that the
 * vault would have stopped the 01:52 logon: it puts a limit on it. The vault rotates a password when it is
 * RETURNED (never «al sacarla»).
 */

/**
 * V5's list of improvements, copied verbatim from video/ir-halden/src/data/s09-plan.ts (IMPROVEMENTS and
 * LIST_TEXT.title) — not imported: that file pulls a type from ir-halden's parts. Only `focus` is lit; the
 * other five are dimmed and carry no status (some were met in other videos).
 */
export const LIST_TITLE = 'Mejoras de la reunión';
export const LIST_HEAD = { owner: 'responsable', date: 'fecha' } as const;
export const IMPROVEMENTS = [
  { text: 'suplentes con permiso para aislar', owner: 'Seguridad', date: '30-09' },
  { text: 'las excepciones caducan solas', owner: 'Sistemas', date: '18-09' },
  { text: 'cuentas de servicio en gestor de contraseñas con rotación', owner: 'Sistemas', date: '31-10' },
  { text: 'DMARC en reject', owner: 'Correo', date: '25-09' },
  { text: 'alerta de logon de cuentas de servicio desde estaciones', owner: 'SOC', date: '25-09' },
  { text: 'agente de seguridad en todas las estaciones de administración', owner: 'Sistemas', date: '15-10' },
] as const;
export const FOCUS_ROW = 2;
export const DONE = '27-10 · hecho';

export const CABINET = {
  nobody: 'nadie se queda ninguna',
  logged: 'se apunta quién usa cada una',
  /** Logbook texture (≤ 14 characters: the logbook is narrow). */
  log: ['3 · Sistemas', '6 · Seguridad', '3 · devuelta'],
} as const;

export const VAULT = {
  colAccount: 'cuenta',
  colWho: '¿quién la sabe?',
  admins: 'administradores del dominio',
  already: 'ya estaban',
  accounts: ['svc_tosreport', 'svc_edi'],
  rest: 'y el resto de cuentas de servicio',
  nobody: 'nadie',
  rotation: 'rotación: cada 24 h y cada vez que una persona la devuelve',
  /** The access log (texture). */
  log: ['08:00 · rotación diaria · svc_tosreport', '08:00 · rotación diaria · svc_edi', '23:00 · devuelta · rotada'],
} as const;

export const PAM = { term: 'PAM', sub: 'privileged access management', vaulting: 'PASSWORD VAULTING' } as const;

export const BARS = {
  before: 'septiembre: hasta que alguien se diera cuenta',
  beforeWhen: '4-9 · 10:30',
  after: 'ahora: 24 h como mucho, aunque nadie se dé cuenta',
  cap: '24 h',
} as const;

export const LEAST = 'LEAST PRIVILEGE';
