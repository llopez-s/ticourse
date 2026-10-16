/** s04-conmutar «Quién demuestra qué»: strings (canon, see out/scene-brief.md). */

export const REQUEST =
  'demostrar que la aplicación principal funciona en el sitio de reserva, con sus usuarios dentro, su DNS, sus certificados, sus integraciones y sus permisos';

export const CHIPS = [
  { text: 'DNS', icon: 'globe' },
  { text: 'certificados', icon: 'key' },
  { text: 'integraciones', icon: 'link' },
  { text: 'permisos', icon: 'lock' },
] as const;

/** The think prompt's two options (the engine draws the question itself). */
export const CHOICES = { parallel: 'parallel', failover: 'fail over' } as const;

/** `answer`: what the parallel run does not prove (step 3's note from `answer` on). */
export const PARALLEL_LIMIT = 'prueba el respaldo, no el cambio de sitio';

export const SITES = { main: 'sitio principal', reserve: 'sitio de reserva' } as const;

export const WINDOW = 'ventana de mantenimiento';
export const BACK = 'plan de vuelta atrás';

/** `ladder-top`: the bottom comparison. */
export const VALIDATES = [
  { term: 'TABLETOP', text: 'valida el plan' },
  { term: 'FAIL OVER', text: 'valida el sistema' },
] as const;
