/**
 * s08-cierre «Para llevarte» — on-screen strings. Each idea lights on its cue with its image (the boxes · the van
 * that changes · the receipt); its sub lines light on the voice's own words (`word`, in segment `seg`). Titles are one
 * short line, sub lines ≤ 26 characters at 30 px (the card is 560 px wide).
 */

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  nth?: number;
}

export interface RecapThumb {
  /** The art, relative to the public dir. */
  src: string;
  /** Centre of the crop (image fractions) and how far in it is. */
  u: number;
  v: number;
  zoom: number;
  saturate?: number;
  /** One-hue plate (Illustration `mono`). Off here: the art's colours ARE the wrapper colours. */
  mono?: boolean;
}

export interface RecapRule {
  seg: string;
  title: string;
  sub: readonly [RecapLine, RecapLine];
  thumb: RecapThumb;
}

export const RULES: readonly RecapRule[] = [
  // «Una, de dentro afuera van datos, segmento, paquete y trama.»
  {
    seg: 's08-01',
    title: 'De dentro afuera',
    sub: [
      { text: 'datos, segmento,', word: 'datos' },
      { text: 'paquete y trama', word: 'paquete' },
    ],
    // The letter, the envelope and the box in the van's open back.
    thumb: { src: 'art/s02-envoltorios.png', u: 0.47, v: 0.44, zoom: 1.7 },
  },
  // «Dos, ARP no sale de su subred, y para ir fuera se pregunta por la puerta de enlace.»
  {
    seg: 's08-02',
    title: 'La subred',
    sub: [
      { text: 'ARP no sale de su subred', word: 'ARP' },
      { text: 'fuera: puerta de enlace', word: 'fuera' },
    ],
    // Both vans at the warehouse: the box has changed van.
    thumb: { src: 'art/s04-almacen-fin.png', u: 0.61, v: 0.58, zoom: 1.6 },
  },
  // «Y tres, TCP numera y confirma, y UDP no promete nada.»
  {
    seg: 's08-02',
    title: 'TCP o UDP',
    sub: [
      { text: 'TCP numera y confirma', word: 'numera' },
      { text: 'UDP no promete nada', word: 'UDP' },
    ],
    // The numbered sheets and the receipt card.
    thumb: { src: 'art/s06-certificado.png', u: 0.55, v: 0.47, zoom: 1.4 },
  },
];

/** The closing sentence, in two lines; the second lights on «pregúntate». */
export const PHRASE = { lead: 'Cuando veas una dirección,', what: 'pregúntate primero en qué envoltorio va', word: 'pregúntate' } as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines (as on the poster); the first in cyan. */
  title: ['De la trama al segmento', 'tres envoltorios y una pregunta en voz alta'],
  /** The poster's disclaimer for this track (AFFILIATION.opo in the engine's profiles), one sentence per line. */
  disclaimer: ['Simulación educativa con datos ficticios.', 'Material independiente, no afiliado a ninguna administración pública.'],
  art: { src: 'art/s02-envoltorios.png', focus: { x: 0.47, y: 0.5 } },
} as const;
