/** s03-simulacro «Probarlo de verdad»: scene-only text (canon: out/scene-brief.md). */

/** What the deputy said at the table, and the doubt. */
export const WORDS = { said: 'aislar es cosa mía', who: 'la suplente', doubt: '¿seguro?' } as const;

/** The port's drill. */
export const DRILL = {
  date: '2026-10-08',
  time: '22:00',
  vlan: 'VLAN de pruebas',
  host: 'ptl-pruebas-02',
  /** The call goes out through the list fixed in s02. */
  outOfBand: 'lista fuera de banda',
  caption: 'el simulacro',
} as const;

/** The EDR console. */
export const CONSOLE = {
  title: 'Consola del EDR',
  online: 'en línea',
  button: 'Aislar equipo',
  denied: 'Acción no permitida',
  deniedWhy: 'tu rol no incluye aislar equipos',
  isolated: 'aislado',
  deputy: 'la suplente',
  analyst: 'la analista de guardia',
} as const;

/** The finding, split in two rows (icons, never glyphs). */
export const SPLIT = {
  plan: 'el plan: la suplente puede aislar',
  account: 'su cuenta en la consola: no puede',
} as const;

export const ORDER = 'por orden de la suplente';

/** The stopwatch stops at 11 minutes (22:00 to 22:11). Always «11 min», never a clock time. */
export const STOP_MINUTES = 11;
export const minutesLabel = (n: number) => `${n} min`;

/** Comparison bars. September: 16:15 on 3-9 to 10:30 on 4-9, more than 18 h. */
export const BARS = {
  drill: { label: 'simulacro', value: '11 min', minutes: 11 },
  sept: { label: 'septiembre', host: 'ADM-WS-02', value: 'más de 18 h hasta aislarla', minutes: 18 * 60 + 15 },
} as const;

/** The fix of the drill. */
export const FIX_ROW = { text: 'permiso de aislar en la cuenta de la suplente', owner: 'Seguridad', date: '09-10' } as const;

/** The exam name and what it costs. */
export const NAME = { label: 'en el examen', en: 'SIMULATION' } as const;
export const COST = ['gente de guardia, de noche', 'coordinado con Operaciones', 'puede afectar a la operación'] as const;

/** Closing columns. */
export const BOTH = {
  mesa: { name: 'la mesa', line: 'lo que se dice' },
  drill: { name: 'el simulacro', line: 'lo que se hace' },
} as const;
