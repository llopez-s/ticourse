import { TITLE } from './shared';

/** The three rules: a bold lead and the rest, as the storyboard words them. */
export const RULES = [
  { lead: 'Un sesgo es un fallo de cómo miras,', rest: 'una falacia lo es de cómo argumentas: a esa le pones el boli rojo' },
  { lead: 'La fuente se evalúa, pero no sustituye a las pruebas:', rest: 'ni para creerla ni para tirarla, examina sus pruebas' },
  { lead: 'Si la conclusión ya estaba en la premisa,', rest: 'o si las fuentes se repiten unas a otras, cuenta solo las pruebas independientes' },
] as const;

export const NEXT = { text: 'Tu turno: las preguntas de la lección', chip: 's4m2 · 6 preguntas' } as const;
export const END = {
  lead: TITLE.lead,
  rest: TITLE.rest,
  sub: TITLE.sub,
  objective: 'GIAC GCTI · Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
