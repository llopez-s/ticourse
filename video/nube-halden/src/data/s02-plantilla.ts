/** s02-plantilla «Un pósit en la nevera» — on-screen strings (canon: out/scene-brief.md). */

/** The image beat: what the post-it means once someone has read it. */
export const POSTIT_LINES = { known: 'quien pasó ya la sabe', change: 'cambias la clave' } as const;

/** The port beat's label. */
export const PORT = { what: 'En el puerto · Sistemas', kind: 'propuesta · sin fecha' } as const;

/** The template's three typed lines, each on the voice's word (s02-03), and the decision's key line. */
export const LINES = [
  { text: 'red', word: 'red' },
  { text: 'máquinas', word: 'máquinas' },
  { text: 'permisos', word: 'permisos' },
] as const;
export const KEY_LINE = 'clave: en el gestor';

/** Two environments from the same template. */
export const ENVS = ['pruebas', 'producción'] as const;

/** What the template gives, each on its word (s02-03); the last one is screen-only, after «revisa». */
export const GAINS = [
  { text: 'pruebas y producción,\nde la misma plantilla', word: 'Pruebas', icon: 'layers' },
  { text: 'cada cambio, revisado', word: 'cambio', icon: 'check' },
  { text: 'nada a mano', word: 'revisa', icon: 'terminal', small: 'sin deriva' },
] as const;

export const IAC = 'infrastructure as code · IaC';

/** The risk, each on its word (s02-04 «error», s02-05 «historial»). */
export const RISKS = [
  { text: 'un error, en todas partes a la vez', seg: 's02-04', word: 'error' },
  { text: 'lo que escribes, en el historial', seg: 's02-05', word: 'historial' },
] as const;

/** The decision card (s02-05). */
export const DECISION = {
  text: ['la plantilla dice dónde está la clave,', 'no la clave'],
  vault: 'gestor de secretos',
  struck: 'secrets in the repo',
} as const;
