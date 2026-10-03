/**
 * s03-leaver «Se jubila el viernes» — on-screen strings (canon: scene brief «Canon» > s03).
 * A retirement without conflict or suspicion. o.virta's badge shows door
 * tiles without names (no invented doors).
 */

export const PERSON = { name: 'o.virta', dept: 'Importación', sub: 'la oficina que trata con aduanas' } as const;

export const RETIRES = 'se jubila el viernes 23-10';

/** Icon-only door tiles on his badge. */
export const DOOR_COUNT = 5;

export const BUTTONS = { del: 'borrar', disable: 'deshabilitar' } as const;

export const DISABLED = 'deshabilitada · 23-10 · fin de turno';

export const LOCKER = {
  seal: 'precintada',
  labels: ['buzón', 'archivos', 'registros'],
  keep: 'se conservan',
  policy: 'borrar: cuando lo diga la política de retención',
} as const;

export const DELETE_NOW = { button: 'borrar hoy', note: 'sin vuelta atrás' } as const;

export const TERM = 'DEPROVISIONING';

export const WRAP = [
  { arc: 'cambio', text: 'cambio: también quita', word: 'cambio' },
  { arc: 'baja', text: 'baja: deshabilitada ese día', word: 'quien' },
] as const;
