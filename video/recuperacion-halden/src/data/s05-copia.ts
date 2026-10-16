/**
 * s05-copia «La copia en verde» — on-screen strings (canon: out/scene-brief.md).
 * The nightly squares are an EXAMPLE: no dates, times, counts or host names.
 */

/** Header over the grid of nightly squares. */
export const GRID_TITLE = 'trabajo de copia · cada noche';
/** The status every square carries (plain job-status green). */
export const DONE = 'completada';
/** Fixed label under the grid. */
export const GRID_NOTE = 'ejemplo · sin fecha · no es el registro del puerto';

/** s05-03: what the green says and what it does not. */
export const SAYS = 'el trabajo terminó';
export const DOES_NOT = '¿la copia vuelve?';

/** s05-04: the restore of one square. */
export const RESTORE_TITLE = 'restaurar una copia';
export const UNUSABLE = 'los archivos no sirven';

/** s05-05: the proof, in three steps. `lead` is bold, `tail` muted (one canon string). */
export const PROOF: { lead: string; tail?: string }[] = [
  { lead: 'restaurar en un entorno aparte', tail: ' · cada cierto tiempo' },
  { lead: 'datos completos y la aplicación responde' },
  { lead: 'cronometrar y apuntar' },
];

/** s05-06: two things that do not count as copies. */
export const NOT_COPIES: { term: string; rest: string; damage?: string }[] = [
  { term: 'snapshot', rest: ' · mismo almacenamiento' },
  { term: 'réplica', rest: ' · copia también ', damage: 'el borrado y el cifrado del ransomware' },
];
