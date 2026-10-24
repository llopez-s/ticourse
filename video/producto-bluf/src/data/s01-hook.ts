/** s01-hook «Un hallazgo, tres lectores» — on-screen strings (the storyboard's, exactly). */
export const S01 = {
  context: ['Meridian Dynamics', 'aeroespacial', 'tú, su analista de inteligencia'],
  date: '18-04-2026',
  clock: { time: '06:00', zone: 'UTC' },
  rainLabel: 'correos de phishing · cadena de suministro',
  title: 'Escribir para quien decide',
  sub: 'productos, BLUF y lenguaje estimativo',
  finding: 'un hallazgo',
  /** The three readers; `word` is the word of s01-03 each lands on. */
  readers: [
    { kind: 'soc', name: 'SOC', role: 'vigila la red', word: 'SOC' },
    { kind: 'ciso', name: 'CISO', role: 'responsable de seguridad', word: 'CISO' },
    { kind: 'board', name: 'consejo de dirección', role: '', word: 'consejo' },
  ],
  /** The promise: each chip lights on `word` of s01-04. */
  promise: [
    { text: 'escribirlo para cada lector', word: 'escribirlo' },
    { text: 'decidir cuánto puedes tardar', word: 'decidir' },
    { text: 'ponerle números a tus juicios', word: 'números' },
  ],
} as const;
