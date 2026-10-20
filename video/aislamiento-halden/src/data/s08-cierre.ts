/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`; `delay` frames after it for lines the voice does not say).
 * Sub lines ≤ ~31 characters at 32 px (the card is ~560 px wide).
 */

export type RuleArt = 'mould' | 'train' | 'grid';

export interface RecapLine {
  text: string;
  word: string;
  nth?: number;
  delay?: number;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: string;
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Un contenedor no se parchea, se rehace su imagen.»
  {
    art: 'mould',
    seg: 's08-01',
    title: 'Se arregla la imagen',
    sub: [
      { text: 'no se parchea en marcha', word: 'parchea', strong: true },
      { text: 'se rehace y se despliega', word: 'rehace', strong: true },
      { text: 'de tu registro, firmada', word: 'imagen', delay: 10 },
      { text: 'y escaneada', word: 'imagen', delay: 16 },
    ],
  },
  // «El air gap aísla más, luego la VM y al final el contenedor.»
  {
    art: 'train',
    seg: 's08-02',
    title: 'Quién aísla más',
    sub: [
      { text: 'air gap, luego la VM', word: 'air', strong: true },
      { text: 'y al final el contenedor', word: 'final', strong: true },
      { text: 'comparte el kernel del host:', word: 'contenedor', delay: 10 },
      { text: 'eso se arregla en el host', word: 'contenedor', delay: 18 },
    ],
  },
  // «Y dónde vive no es quién lo gestiona.»
  {
    art: 'grid',
    seg: 's08-03',
    title: 'Dónde no es quién',
    sub: [
      { text: 'on-premises o nube: dónde', word: 'dónde', strong: true },
      { text: 'centralizado o no: quién', word: 'quién', strong: true },
      { text: '¿cada sede con su política?', word: 'gestiona', delay: 6 },
      { text: 'centraliza', word: 'gestiona', delay: 12 },
    ],
  },
];

/** The exam phrase on `phrase`, in three lines, each lit on its words. */
export const PHRASE = [
  { text: 'Lo de dentro se arregla en la imagen;', word: 'dentro' },
  { text: 'lo de todos, en el host;', word: 'todos' },
  { text: 'y mudarse no cambia quién decide', word: 'mudarse' },
] as const;

/** The one next step (the voice: «Ahora te toca, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Contenedores, VMs', 'y quién gestiona'],
  objective: 'Security+ SY0-701 · objetivo 3.1',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
