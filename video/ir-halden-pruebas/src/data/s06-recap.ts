/** s06-recap «Tres reglas»: scene-only text (canon: out/scene-brief.md). */

/** SILENT PAGER's message from s04, the one the recap answers. */
export const RECAP = {
  adversary: 'SILENT PAGER',
  message: 'Sin alarma no hay nada que buscar. Duerme tranquila.',
  heading: 'Tres reglas',
} as const;

/**
 * Three rules, one big full-width row each (the texts are too long for three
 * RuleCards columns). `lead` is the coloured head of a line.
 */
export const RULES = [
  {
    lines: [
      { lead: 'Mesa:', text: 'quién decide y a quién se llama', tone: 'sky' },
      { lead: 'Simulacro:', text: 'herramientas, permisos y tiempos', tone: 'amber' },
    ],
  },
  { lines: [{ lead: '', text: 'Si partes de una alerta, no es hunting', tone: 'emerald' }] },
  {
    lines: [
      { lead: '', text: 'La caza siempre trae algo', tone: 'emerald' },
      { lead: '', text: 'una regla o un hueco', tone: 'emerald', sub: true },
    ],
  },
] as const;

/** The one task. */
export const NEXT = { lead: 'Ahora te toca:', task: 'las preguntas de la lección', chip: 'sp4m10 · 8 preguntas' } as const;

/** End card (the brand is written by hand, never taken from the app name). */
export const END = {
  brand: 'ALERTÓPOLIS',
  title: ['Antes del ', 'próximo incidente'],
  objective: 'Security+ SY0-701 · objetivo 4.8',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
