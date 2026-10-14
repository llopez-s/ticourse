/** On-screen strings of s01-hook (the storyboard's, exactly). */
export const S01 = {
  /** The intrusion's chain, already reconstructed (earlier videos): small and dim. */
  chain: ['Delivery', 'Exploitation', 'Installation', 'Command & Control', 'Actions on Objectives'],
  /** Index of the step that is still alive, and its mark. */
  c2: 3,
  c2Mark: 'llama a casa cada minuto',
  context: ['Meridian Dynamics', 'aeroespacial', 'tú, su analista de inteligencia'],
  team: 'equipo de respuesta:',
  ask: '¿qué hacemos con esto?',
  title: 'Courses of Action',
  sub: 'la matriz de decisiones',
  /** The promise: each chip lights on `word` (spoken in s01-02). */
  promise: [
    { text: 'los verbos que se confunden', word: 'verbos' },
    { text: 'una matriz con huecos', word: 'matriz' },
    { text: 'cuánto cuesta cada acción', word: 'cuánto' },
  ],
} as const;
