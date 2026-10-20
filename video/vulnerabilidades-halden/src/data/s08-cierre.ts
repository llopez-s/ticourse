/**
 * s08-cierre «Para el examen» — on-screen strings. Each rule card lights on its cue; its sub lines light on the
 * voice's own words (`word`, in the rule's segment `seg`). Sub lines ≤ 26 characters at 32 px (the card is ~560 px
 * wide). Exam terms in English, as in the rest of the video.
 */

export type RuleArt = 'drawer' | 'door' | 'concert';

export interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment). */
  word: string;
  nth?: number;
  strong?: boolean;
}

export interface RecapRule {
  art: RuleArt;
  seg: string;
  title: string;
  sub: readonly RecapLine[];
}

export const RULES: readonly RecapRule[] = [
  // «Si sales de tu máquina, es un escape, y si heredas restos sin salir, es resource reuse.»
  {
    art: 'drawer',
    seg: 's08-01',
    title: 'Salir o heredar',
    sub: [
      { text: 'sales: VM escape', word: 'sales', strong: true },
      { text: 'se parchea el hipervisor', word: 'escape' },
      { text: 'heredas: resource reuse', word: 'heredas', strong: true },
      { text: 'limpiar antes de reasignar', word: 'reuse' },
    ],
  },
  // «En la nube, configuración, datos e identidades son tuyos siempre, también en SaaS.»
  {
    art: 'door',
    seg: 's08-02',
    title: 'Lo de encima, tuyo',
    sub: [
      { text: 'abajo: el proveedor', word: 'nube' },
      { text: 'configuración · datos', word: 'configuración', strong: true },
      { text: 'identidades: siempre', word: 'siempre', strong: true },
      { text: 'también en SaaS', word: 'SaaS' },
    ],
  },
  // «Y saltarse la tienda no es rootear el móvil.»
  {
    art: 'concert',
    seg: 's08-03',
    title: 'Tienda no es sistema',
    sub: [
      { text: 'fuera de la tienda:', word: 'tienda' },
      { text: 'side loading', word: 'tienda', strong: true },
      { text: 'sin protecciones:', word: 'rootear' },
      { text: 'rooting · jailbreaking', word: 'rootear', strong: true },
    ],
  },
];

/** The exam phrase on `phrase`, the lesson box's own: the first half white, the second violet on «pregúntate». */
export const PHRASE = { lead: 'Antes de nombrarlo,', ask: 'pregúntate dónde nació el fallo' } as const;

/** The one next step (the voice says «Ahora te toca a ti, con las preguntas de la lección»). */
export const NEXT = 'Tu turno: las preguntas de la lección';

export const END = {
  /** The video's title, in two lines; the first in cyan. */
  title: ['Dónde nace el fallo', 'hipervisor, nube y móvil'],
  objective: 'Security+ SY0-701 · objetivo 2.3',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
