/** s03-promesas «Dos promesas por proceso» — on-screen strings (storyboard.json goal, canon of the scene brief). */

export const CAFE_TAG = 'imagen · no es del puerto';
export const TILL_BROKEN = 'caja estropeada';

/** The two glyph labels: the canon line, then the English exam term under it. */
export const RTO_LABEL = { line: 'RTO · cuánto puede estar sin servir', term: 'recovery time objective' } as const;
export const RPO_LABEL = { line: 'RPO · cuántas ventas desde la última copia', term: 'recovery point objective' } as const;

/** The two empty slots every process card carries. */
export const SLOT_RTO = 'cuánto puede estar parado';
export const SLOT_RPO = 'cuántos datos puede perder';

export interface ProcessDef {
  key: 'bills' | 'board';
  name: string;
  area: string;
}

/** Same two cards, same order as s02. */
export const PROCESSES: readonly ProcessDef[] = [
  { key: 'bills', name: 'Emitir facturas a las navieras', area: 'Facturación' },
  { key: 'board', name: 'Seguir llegadas y salidas de buques', area: 'Operaciones' },
];

export const VALUES = {
  board: { rto: 'RTO 30 min', rpo: 'RPO 24 h', note: 'con una copia al día le basta' },
  bills: { rto: 'RTO 48 h', note: 'no puede perder casi nada', rpoFive: 'RPO 5 min' },
} as const;

/** The think prompt's two answers (the question itself is drawn by the engine). */
export const ANSWERS = { once: 'Basta una al día', often: 'Más a menudo' } as const;

/** The two dials, in words: the canon line is «RTO · …» / «RPO · …». */
export const DIALS = {
  rto: { head: 'RTO', line: 'RTO · qué recuperación necesitas tener lista', value: '48 h' },
  rpo: { head: 'RPO', line: 'RPO · cada cuánto copias', value: '5 min' },
} as const;
