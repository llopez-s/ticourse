/** s04-pasos «Un caso que nadie coge» — on-screen strings (canon: out/scene-brief.md). */

/** The flow of s02, compact, at night, taking the «no» branch. */
export const FLOW = {
  edr: 'el EDR avisa',
  idp: 'proveedor de identidad',
  risk: '¿riesgo alto?',
  no: 'no',
  yes: 'sí',
} as const;

/** The SOC queue: a relative mark only, never a clock time. */
export const QUEUE = {
  title: 'cola del SOC',
  row: 'caso nuevo',
  mark: '+00:00',
  unassigned: 'sin asignar',
  high: 'prioridad alta',
  oncall: 'avisa a la guardia',
} as const;

/** «hace N min», counted up to the escalation at fifteen. */
export const minutesLabel = (n: number) => `hace ${n} min`;
export const NOBODY = 'nadie la coge';

export const TICKET_CREATION = 'Ticket creation';
export const NOTED = 'queda apuntado';
export const ESCALATION = 'Escalation';
export const RAISED = 'sube la prioridad · avisa a la guardia';
export const ACCESS = 'enabling/disabling services and access';
export const CONFIRMED = 'tras confirmar la analista';
export const SESSION = 'sesión';
