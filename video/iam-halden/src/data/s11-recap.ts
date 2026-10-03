/** s11-recap «Tres reglas»: on-screen text (canon: out/scene-brief.md). */

/** SILENT PAGER's three shortcuts (s05, s07, s10), short and struck; `rule` = the card that answers it. */
export const SHORTCUTS = [
  { text: 'dale tu contraseña a la app', rule: 1 },
  { text: 'contraseña y pregunta: dos factores', rule: 1 },
  { text: 'admin fijo y listo', rule: 2 },
] as const;

export const ADVERSARY = 'SILENT PAGER';

/**
 * The rules, exact words split into card lines (title: two hard lines ≤ 18 characters so RuleCards keeps
 * it near 50 px; sub lines ≤ 31 characters at 30 px).
 */
export const RULES = [
  { title: ['Cambiar de puesto', 'también quita'] as const, sub: ['quien se va: cuenta precintada', '(deshabilitada) ese día'] },
  { title: ['Tu contraseña solo', 'la ve tu casa'] as const, sub: ['con un factor de otro tipo', 'al socio, un pase;', 'a la app, un permiso'] },
  { title: ['Nadie se queda las', 'llaves maestras'] as const, sub: ['la bóveda las cambia', 'y solo las presta en la ventana'] },
] as const;

export const NEXT = 'Tu turno: las 8 preguntas de la lección';

export const END = {
  title: 'Identidad y acceso',
  sub: 'quién entra y hasta dónde',
  objective: 'Security+ SY0-701 · objetivo 4.6',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;
