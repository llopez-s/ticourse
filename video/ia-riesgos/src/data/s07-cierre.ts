/** s07-cierre «Tres reglas»: scene-only text. */

export const RECAP = { heading: 'Tres reglas' } as const;

/** One card per rule (RuleCards). */
export const RULES = [
  { title: ['¿Quién ataca?', '¿Por dónde entra?'], sub: 'la pista decisiva', icon: 'search', tone: 'cyan' },
  { title: ['Si depende del', 'modelo, no es control'], sub: 'es una esperanza', icon: 'alert', tone: 'amber' },
  { title: ['Salida del modelo', '= no confiable'], sub: 'como la de un desconocido', icon: 'shield', tone: 'emerald' },
] as const;

/** `phrase`: the closing line under the rules. */
export const PHRASE = { lead: 'Los límites,', tail: 'fuera del modelo' } as const;

/** The one task (`next`). */
export const NEXT = {
  lead: 'Ahora te toca:',
  task: 'las comprobaciones de la lección',
  chip: '4 · opcionales · sin XP',
} as const;

/** End card (the brand is written by hand, never taken from the app name). */
export const END = {
  brand: 'ALERTÓPOLIS',
  title: ['Una orden escondida ', 'en un documento'],
  objective: 'SY0-801 · borrador · objetivo 2.6',
  disclaimer: 'Caso de ejemplo, sin datos reales. Material independiente, no afiliado a CompTIA.',
} as const;
