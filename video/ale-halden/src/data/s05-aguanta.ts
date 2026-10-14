/** s05-aguanta «¿Y si nos equivocamos?»: canon strings (fictional data, kept exactly). */

/** The calculation with its two levers: AV × EF × ARO = ALE. */
export const AV = '400.000 €';
export const CONTROL_LABEL = 'el control · 20.000 € / año';
export const ALE_NAME = 'ALE de R-014';

/** ARO: the frequency lever (veces al año). */
export const ARO = {
  term: 'ARO',
  def: 'veces al año',
  base: { n: '0,5', reading: 'una vez cada dos años' },
  low: { n: '0,2', reading: 'una vez cada cinco años' },
  lower: { n: '< 0,2', reading: 'aún menos frecuente' },
  chipLow: 'ARO 0,5, ahora 0,2',
  years: 'diez años',
} as const;

/** EF: the share-of-the-value lever. */
export const EF = {
  term: 'EF',
  def: 'parte del valor',
  base: { n: '0,25', reading: 'el 25 % del valor' },
  low: { n: '0,10', reading: 'el 10 % del valor' },
  chipLow: 'EF 0,25, ahora 0,10',
  caption: 'lo que se pierde en un solo evento',
} as const;

/** ALE amounts as the bar's title and the equation's result show them. */
export const ALE = {
  base: '50.000 € / año',
  baseEq: '50.000 € al año',
  tie: '20.000 € / año',
  tieEq: '20.000 € al año',
  below: 'por debajo de 20.000 € / año',
  belowEq: '< 20.000 € al año',
} as const;

export const TIE = 'aquí empata';
export const BELOW = 'el control cuesta más de lo que evita';
export const AGAIN = 'otra vez, igual que el control';
export const ESTIMATE = 'la cuenta vale lo que valen sus estimaciones';
export const STAMP = 'R-014 · 50.000 € al año · una estimación para comparar';
