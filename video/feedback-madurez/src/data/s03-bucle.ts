/** s03-bucle «Preguntar al viajero»: on-screen text (canon: out/scene-brief.md). */

/** The four questions of the lesson (src/data/s5.ts, s5m5), each with the pictogram on its card. */
export const S03_QUESTIONS = [
  { text: '¿Respondió tu pregunta?', icon: 'check' },
  { text: '¿Llegó a tiempo?', icon: 'clock' },
  { text: '¿Qué decisión apoyó?', icon: 'flag' },
  { text: '¿Qué falta?', icon: 'search' },
] as const;

export const S03_LOOP = {
  nodes: [['producto'], ['feedback'], ['requirements', 'ajustados']],
  label: 'una fase del ciclo, no una cortesía',
} as const;

export const S03_NOTEBOOK = {
  tag: 'Ejemplo de la lección · no es el caso de Meridian',
  /** «esta búsqueda de amenazas nació del informe X y encontró la intrusión Y», split where Y resolves. */
  first: 'esta búsqueda de amenazas nació del informe',
  second: 'y encontró la intrusión',
  x: 'X',
  y: 'Y',
  fund: 'la frase que financia equipos',
} as const;

export const S03_SCHEMES = {
  linked: { label: 'atribuible', boxes: ['informe', 'búsqueda', 'hallazgo'] },
  timing: { label: 'solo coincide en el tiempo', boxes: ['informe', 'hallazgo'] },
} as const;

export const S03_ENDS = { improve: 'preguntas para mejorar', prove: 'éxitos para demostrar' } as const;
