/** s05: the echo of feeds (s4.ts:239). Cards carry a letter and text bars only: no vendor name. */
export const SHEET_TITLE = '3 informes dicen lo mismo';
export const CARDS = ['A', 'B', 'C'] as const;
export const CITES = 'cita a';
export const CONSENSUS = 've consenso';
export const PROVISIONAL = 'atribución provisional';
export const THERMO = 'confianza en la atribución';
export const COUNTER = { sources: 'fuentes', sourcesValue: '3', fresh: 'pruebas nuevas', freshValue: '0', echo: 'eco de feeds' } as const;
export const INDEP = { rule: ['solo cuentas pruebas independientes,', 'no repeticiones'], row: 'cada una con su propio origen' } as const;
