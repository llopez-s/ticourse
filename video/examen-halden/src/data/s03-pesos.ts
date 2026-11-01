/** s03-pesos «Dónde están los puntos» — on-screen strings (canon: out/scene-brief.md). The course's five sections, short names. */
export interface WeightBlock {
  n: number;
  /** Short Spanish name inside the block. */
  name: string;
  /** Weight in percent (the lesson's table). */
  pct: number;
}

export const BLOCKS: WeightBlock[] = [
  { n: 1, name: 'conceptos generales', pct: 12 },
  { n: 2, name: 'amenazas, vulnerabilidades y mitigaciones', pct: 22 },
  { n: 3, name: 'arquitectura', pct: 18 },
  { n: 4, name: 'operaciones', pct: 28 },
  { n: 5, name: 'gestión del programa', pct: 20 },
];

/** The two blocks the brace joins (Amenazas and Operaciones), by `n`. */
export const HALF_PAIR = [2, 4] as const;
export const HALF_LABEL = 'la mitad del examen';
export const VOCAB_LABEL = 'el vocabulario de todas las demás';
