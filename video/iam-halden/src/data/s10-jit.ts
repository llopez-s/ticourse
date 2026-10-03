/**
 * s10-jit «Solo durante la ventana»: on-screen text (canon: out/scene-brief.md). The 24-h «fijo» clock
 * is SILENT PAGER's proposal, labelled as such — not the port's state (Halden already lends its domain
 * admins by window). No change number on the request.
 */

export const STANDING = {
  band: 'administrador del dominio · fijo',
  label: 'sin JIT · lo que propone',
} as const;

export const REQUEST = {
  chip: 'solicitud',
  who: 'L. Ferrer · Infraestructura',
  role: 'administrador del dominio',
  reasonLabel: 'motivo:',
  reason: 'cambio aprobado',
  windowLabel: 'ventana:',
  window: '28-10 · 22:00–23:00',
  approve: 'aprueba: R. Salas · jefe de sistemas',
} as const;

export const LOAN = {
  valid: 'credencial válida hasta las 23:00',
  recorded: 'sesión grabada',
  separate: ['cuenta de administración,', 'separada de la diaria'],
  retired: ['privilegio retirado', 'contraseña rotada'],
} as const;

export const TERMS = { jit: 'JUST-IN-TIME PERMISSIONS', ephemeral: 'EPHEMERAL CREDENTIALS' } as const;

export const COPY = { card: 'copia · 23:05', useless: 'ya no sirve' } as const;

/** The clock's window (hours) and its labels. */
export const WINDOW = { from: 22, to: 23 } as const;
export const CLOCK_TICKS = [
  { h: 0, label: '00' },
  { h: 6, label: '06' },
  { h: 12, label: '12' },
  { h: 18, label: '18' },
] as const;

export const CABINET = {
  lent: 'se presta para el trabajo',
  changed: 'al devolverla, se cambia la cerradura',
  log: ['sale · 22:00', 'vuelve · 23:00'],
} as const;
