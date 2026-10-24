/** s06-salida «Lo que sale del modelo»: scene-only text. The script is gray bars: nothing executable. */

export const FLOW = {
  model: 'modelo',
  output: 'script',
  interpreter: 'intérprete',
  kinds: 'un script · una consulta · un comando',
} as const;

/** `malicious`: the rose warning on the unguarded run. */
export const WARNING = 'se ejecuta sin más';

/** `self-review`: the answer to BORROWED VOICE, struck out. */
export const SELF_REVIEW = {
  text: 'el modelo revisa su script',
  verdict: 'no es una barrera',
} as const;

/** `untrusted`: the rule. */
export const RULE = {
  left: 'salida del modelo',
  right: 'entrada no confiable',
} as const;

/** `sandbox`: the box around the run. */
export const SANDBOX = {
  title: 'sandbox',
  limits: ['sin credenciales', 'sin red libre'],
  approve: 'una persona aprueba',
} as const;
