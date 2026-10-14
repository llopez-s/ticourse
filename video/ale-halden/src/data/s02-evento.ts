/** s02-evento «Cuánto cuesta un evento» — on-screen strings (canon: out/scene-brief.md, «Canon strings» › s02). */

/** R-014's risk line, broken in two for the width of the block (joined it is the canon string). */
export const RISK_LINES = ['R-014 · si un ransomware cifrara el servidor', 'de planificación de grúas del muelle norte'] as const;
export const RISK_MODE = 'análisis · sin efectos';

/** The asset block (AV) and what it is made of. A no-break space keeps «€» with its number. */
export const AV = { label: 'AV · 400.000 €', note: ['servidor + licencias +', 'datos operativos'] } as const;

/** The exposure factor: the label, and what it says under it. */
export const EF = { label: 'EF · 0,25', lines: ['el 25 % del valor,', 'en un solo evento'] } as const;

/** The single loss expectancy: the equation in pieces (kind drives the colour) and its caption. */
export type EqKind = 'term' | 'op' | 'num' | 'result';
export interface EqPiece {
  text: string;
  kind: EqKind;
}
/** Group 1 lights on `sle`, group 2 on «valor»/«porcentaje», group 3 on «salen». */
export const EQUATION: readonly (readonly EqPiece[])[] = [
  [
    { text: 'SLE', kind: 'term' },
    { text: '=', kind: 'op' },
    { text: 'AV', kind: 'term' },
    { text: '×', kind: 'op' },
    { text: 'EF', kind: 'term' },
  ],
  [
    { text: '=', kind: 'op' },
    { text: '400.000', kind: 'num' },
    { text: '×', kind: 'op' },
    { text: '0,25', kind: 'num' },
  ],
  [
    { text: '=', kind: 'op' },
    { text: '100.000 €', kind: 'result' },
  ],
];
export const SLE_CAPTION = ['lo que cuesta', 'UN', 'evento'] as const;
/** The piece that left the block carries the result. */
export const SLICE_VALUE = '100.000 €';

/** PAPER GOVERNOR's tag, presented from zero (a label, never a portrait). */
export const ADVERSARY = { name: 'PAPER GOVERNOR', section: 'sección 5', line: 'vive en los huecos de tu gobernanza' } as const;

/** The everyday image: a 400 € phone whose screen cracks (s02-05). */
export const PHONE = { price: '400 €', note: 'se le rompe la pantalla' } as const;
