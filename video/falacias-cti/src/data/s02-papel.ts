/** The maths sheet: four steps and a result, drawn blurred (no readable figures). Step 3 is the crooked one. */
export const MATH = {
  steps: ['paso 1', 'paso 2', 'paso 3', 'paso 4'],
  result: 'resultado',
  crooked: 2,
  /** Generic equations, blurred on screen: they only have to look like workings. */
  lines: ['3x + 4 = 13', '3x = 13 - 4', 'x = 9 / 3', 'x = 3'],
} as const;

export const BIAS = { name: 'sesgo', parts: ['sesgo', 'cognición', 'cómo miras'] } as const;
export const FALLACY = { parts: ['falacia', 'argumentación', 'el paso de la hoja'] } as const;
export const SOLID = 'pruebas sólidas, razonamiento que falla';

/** The lesson's exam note (src/data/s4.ts:279), as two columns and a closing line. */
export const RULE = {
  bias: { term: 'sesgo', is: 'error de cognición', examples: '(confirmation, anchoring, mirror imaging…)' },
  fallacy: { term: 'falacia', is: 'error de argumentación', examples: '(ad hominem, post hoc, circular…)' },
  mixed: 'el examen mezcla ambos en la misma pregunta',
} as const;
