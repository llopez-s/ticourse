/**
 * s08-cierre «Para llevarte» — on-screen strings. Each idea lights on its cue with its image (the partitions · the
 * sticker · the door); its sub lines light on the voice's own words (`word`, in segment `seg`). Titles are one short
 * line, sub lines ≤ 25 characters at 30 px (the card is 560 px wide).
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
  /** One-hue plate (Illustration `mono`): the crop sits in a cyan card, so the art's own colours stay out. */
  mono?: boolean;
}

export interface RecapRule {
  seg: string;
  title: string;
  sub: readonly [RecapLine, RecapLine];
  thumb: RecapThumb;
}

export const RULES: readonly RecapRule[] = [
  // «Una, el conmutador separa colisiones, y la VLAN, difusiones.»
  {
    seg: 's08-01',
    title: 'La VLAN',
    sub: [
      { text: 'el conmutador, colisiones', word: 'conmutador' },
      { text: 'la VLAN, difusiones', word: 'VLAN' },
    ],
    thumb: { src: 'art/s02-difusion-walls.png', u: 0.56, v: 0.55, zoom: 1.6, mono: true },
  },
  // «Dos, en el acceso la trama va sin marca, y en el troncal, con etiqueta.»
  {
    seg: 's08-02',
    title: 'La etiqueta',
    sub: [
      { text: 'acceso: sin etiqueta', word: 'acceso' },
      { text: 'troncal: con etiqueta', word: 'troncal' },
    ],
    thumb: { src: 'art/s04-etiqueta-mail.png', u: 0.73, v: 0.46, zoom: 1.9, mono: true },
  },
  // «Y tres, de una VLAN a otra, por capa tres.»
  {
    seg: 's08-02',
    title: 'La capa 3',
    sub: [
      { text: 'de una VLAN a otra', word: 'VLAN' },
      { text: 'se pasa por capa 3', word: 'capa' },
    ],
    // Cropped on the door: the racks (their amber and pink lights) stay out.
    thumb: { src: 'art/s06-capa3-wall.png', u: 0.47, v: 0.53, zoom: 2, mono: true },
  },
];

/** The closing sentence, in two lines; the second lights on «ver». */
export const PHRASE = { lead: 'Si dos equipos no se ven, lo primero,', what: 'ver si están en la misma VLAN', word: 'ver' } as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines (as on the poster); the first in cyan. */
  title: ['VLAN y 802.1Q', 'tabiques, etiquetas y una puerta'],
  /** The poster's disclaimer for this track (AFFILIATION.opo in the engine's profiles), one sentence per line. */
  disclaimer: ['Simulación educativa con datos ficticios.', 'Material independiente, no afiliado a ninguna administración pública.'],
  art: { src: 'art/s02-difusion-walls.png', focus: { x: 0.62, y: 0.5 } },
} as const;
