/** s04-medida «Lo prometido y lo que mides»: the fault-log console (invented figures, no causes, no names). */

/** The console's title bar and the seal both consoles carry. */
export const CONSOLE_TITLE = 'registro de averías · seguimiento de llegadas y salidas · últimos 12 meses';
export const SEAL = 'análisis de impacto en el negocio · propuesta · ejemplo · datos ficticios';

/** The four faults in the log, in the order the voice reads them. `word` = the spoken number that grows the bar. */
export const FAULTS = [
  { ordinal: '1.ª avería', minutes: 40, said: 'primera', number: 'cuarenta' },
  { ordinal: '2.ª avería', minutes: 95, said: 'segunda', number: 'noventa' },
  { ordinal: '3.ª avería', minutes: 120, said: 'tercera', number: 'ciento' },
  { ordinal: '4.ª avería', minutes: 65, said: 'cuarta', number: 'sesenta' },
] as const;

/** The promise (Operaciones' RTO) and the measured mean (80 = (40 + 95 + 120 + 65) / 4). */
export const RTO_MIN = 30;
export const MTTR_MIN = 80;
export const RTO_LABEL = 'RTO 30 min';
export const MTTR_LABEL = 'MTTR 80 min';
export const GAP = 'las cuatro pasan de 30';

/** `correct`: where each number comes from. */
export const SOURCES = [
  { term: 'RTO', says: 'lo que el negocio aguanta' },
  { term: 'MTTR', says: 'lo que se mide' },
] as const;

/** `technician` (the café's technician; NOT the port). */
export const TECHNICIAN = { says: 'tarda lo que tarda', sub: 'se mide, no se promete', tag: 'imagen · no es del puerto' } as const;

/** `fix`: the conditional close. */
export const FIX = { main: 'Si fueran tus números, el plan no se cumpliría', fix: 'mejorar la recuperación, no el papel' } as const;
