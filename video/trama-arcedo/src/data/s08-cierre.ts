/** s08-cierre «Para llevarte» — on-screen strings (the scene builder refines them against the voice). */

export interface RecapThumb {
  src: string;
  u: number;
  v: number;
  zoom: number;
  saturate?: number;
  mono?: boolean;
}

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines (as on the poster); the first in cyan. */
  title: ['De la trama al segmento', 'tres envoltorios y una pregunta en voz alta'],
  disclaimer: ['Simulación educativa con datos ficticios.', 'Material independiente, no afiliado a ninguna administración pública.'],
  art: { src: 'art/s02-envoltorios.png', focus: { x: 0.5, y: 0.5 } },
} as const;
