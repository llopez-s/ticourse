/** s02-niveles «Tres preguntas sobre un cuadro» — on-screen strings (canon: storyboard goal). The levels are in ./levels. */

export const S02_CAPTION = 'atribuir un cuadro: tres preguntas';

/** The chip over band 1: all that is shown of Meridian's evidence (no certificate, hash or domain). */
export const S02_OURS = { lead: 'tu caso:', rest: 'el programa y su servidor' } as const;

/**
 * The diamond chip, «Capability + Infrastructure = máquina · Adversary = operator + customer», as its two
 * halves (one line each). It is drawn as a correspondence — dotted connectors to the lanes — not as an identity.
 */
export const S02_DIAMOND = {
  machine: { terms: ['Capability', 'Infrastructure'], is: 'máquina' },
  adversary: { term: 'Adversary', parts: ['operator', 'customer'] },
  operator: { term: 'operator', does: 'teclea' },
  customer: { term: 'customer', does: 'encarga' },
} as const;

/** The closing strip, in two halves that light with the voice. */
export const S02_STRIP = { kind: 'subir un nivel pide evidencia de otro tipo,', notMore: 'no más de lo mismo' } as const;
