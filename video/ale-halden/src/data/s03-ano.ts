/** s03-ano «Cuántas veces al año»: strings and fixed numbers (canon, see out/scene-brief.md). */

export const SLE_CHIP = { term: 'SLE', value: '100.000 €', sub: 'un golpe' } as const;

/** Ten squares = ten years. Five are marked, at uneven positions (0-based): 2, 3, 6, 8 and 10. */
export const YEARS = 10;
export const MARKED_YEARS = [1, 2, 5, 7, 9] as const;
export const YEARS_LABEL = '10 años · un cuadrado por año';
export const MARKS_LABEL = 'esperados, no fijos';

export const ARO_LINE = { term: 'ARO', value: '0,5', sub: 'una vez cada dos años', ask: '¿cuántas veces al año?' } as const;

/** ALE = SLE × ARO = 100.000 × 0,5 = 50.000 € al año, in the order it is said. */
export const ALE_PARTS = {
  head: ['ALE', '=', 'SLE', '×', 'ARO'],
  numbers: ['=', '100.000', '×', '0,5'],
  result: ['=', '50.000 €', 'al año'],
} as const;

export const CARDS = [
  { term: 'EF', value: '0,25', sub: 'un trozo del valor' },
  { term: 'ARO', value: '0,5', sub: 'veces al año' },
] as const;

export const THINK = {
  tag: 'otro riesgo · ejemplo · no es R-014',
  ale: 'ALE 36.000',
  aro: 'ARO 3',
  ask: 'SLE = ?',
  good: '12.000',
  trap: '108.000',
  goodSub: '36.000 ÷ 3',
  trapSub: '36.000 × 3 = 108.000 · multiplicar',
  rule: 'hacia atrás se divide',
  answered: 'SLE = 12.000',
} as const;
