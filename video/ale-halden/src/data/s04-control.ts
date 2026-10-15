/** s04-control «Lo que cuesta el control»: canon strings (fictional data, kept exactly). */

/** The three annual bars, same scale and unit («€ / año»). `k` = thousands of euros (the bar's length). */
export const BAR_ALE = { name: 'ALE de R-014', amount: '50.000 € / año', k: 50 } as const;
export const BAR_CONTROL = { name: 'Backup inmutable + EDR gestionado', amount: '20.000 € / año', k: 20 } as const;
export const BAR_REBUILD = { name: 'Reconstrucción en alta disponibilidad', amount: '90.000 € / año', k: 90 } as const;

/** The ALE the control removes (an estimate): the bracket under the control's bar. */
export const ELIMINATES = 'ALE que elimina (estimación)';

/** The difference, in three pieces so each one lands with its number. */
export const NET = { a: '50.000', minus: '−', b: '20.000', equals: '=', c: '30.000 € al año' } as const;

/** What the right column says (S1: the verdict slot, S2: the seal). */
export const SCALE_CHIP = 'misma escala · € / año';
export const FITS = ['en los números,', 'sale a cuenta'] as const;
export const SEAL = ['recomendación al comité', 'no contratado'] as const;
export const NO_FIT = ['solo con estos números,', 'no sale'] as const;
export const NOTE = 'o hace falta otro argumento: una obligación legal, la seguridad de las personas, o que cubra además otros riesgos';

/** The two phone cases (the everyday image of the two options). */
export const CASE_CHEAP = 'funda · 20 €';
export const CASE_COSTLY = 'funda · 90 €';

/** Label inside the part of the 90.000 bar that passes the ALE. */
export const OVER_LABEL = 'pasa de la ALE';
