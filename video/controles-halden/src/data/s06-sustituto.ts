/**
 * On-screen strings of s06-sustituto («Una aplicación sin segundo factor»). Verbatim from the storyboard goal
 * and the canon of the brief: no product name, no people, no hostnames.
 */
export const APP = {
  title: 'aplicación antigua de RR. HH.',
  sub: 'expedientes de la plantilla',
  user: 'usuario',
  password: 'contraseña',
  mfa: 'segundo factor',
  enter: 'Entrar',
} as const;

/** On `cannot`, under the crossed-out «segundo factor» box (amber). */
export const CANNOT = ['la aplicación no lo admite', 'se cambiará por otra'] as const;

/** On `instead`: the measure, both halves at once. */
export const MEASURE = {
  only: 'solo se entra desde tres ordenadores de RR. HH.',
  other: 'desde cualquier otro, no',
} as const;

/** Under the three lit PCs and under the fourth one. */
export const PC_LABELS = { hr: 'RR. HH.', other: 'otro ordenador' } as const;

/** On `stolen`: the stolen password and what happens to it. */
export const STOLEN = { key: 'contraseña robada', cut: 'no entra' } as const;

/** On `same-risk`: the control's tag (category up, type down) and its dim aside, lit in s06-04. */
export const TAG = { top: 'Technical', bottom: 'Compensating', aside: 'sola sería Preventive' } as const;

/** On `recipe`: the caption under the miniature recipe. */
export const RECIPE_CAPTION = 'una receta sin huevo';
