/** s02-lectores «Quién lo lee» — on-screen strings (the storyboard's and the lesson's, exactly). */
export const S02 = {
  dump: { label: '40 páginas técnicas', stamp: 'sin acción' },
  /** The four questions (lesson s5m1, first paragraph); `word` is the word of s02-03/s02-04 each lands on. */
  questions: [
    { icon: 'user', text: '¿quién lo lee?', seg: 's02-03', word: 'Quién' },
    { icon: 'target', text: '¿qué decisión tiene delante?', seg: 's02-03', word: 'decisión' },
    { icon: 'clock', text: '¿cuánto tiempo tiene?', seg: 's02-04', word: 'Cuánto' },
    { icon: 'layers', text: '¿en qué formato lo consume?', seg: 's02-04', word: 'cómo' },
  ],
  formats: [
    { text: 'incidencia del SOC', icon: 'bell', word: 'incidencia' },
    { text: 'informe', icon: 'file', word: 'informe' },
    { text: 'charla', icon: 'users', word: 'charla' },
  ],
  soc: {
    name: 'SOC',
    product: 'Flash alert / advisory',
    detail: 'SOC, IR, IT · 1 página, BLUF + acciones',
    from: 'amenaza activa que exige acción ya',
    gets: 'acciones',
  },
  ciso: {
    name: 'CISO',
    product: 'extracto de la lección',
    // Lesson s5m1 «El mismo hallazgo, dos audiencias», without its first sentence and without «prevista para Q4».
    quote: ['Riesgo principal: acceso a diseño de propulsión vía cuentas de terceros.', 'Recomendamos adelantar la revisión de accesos de proveedores.'],
    tag: 'ejemplo de la lección · recomendación de CTI, no decisión de Meridian',
    gets: 'riesgo y decisión que se le propone',
  },
  board: {
    name: 'consejo',
    product: 'Assessment estratégico',
    detail: 'CISO, dirección, board · 2–5 págs, juicios + implicaciones',
    enables: 'presupuesto, postura, apetito de riesgo',
    from: 'ciclo periódico o decisión concreta',
    gets: 'juicios e implicaciones',
    getsSub: 'en su propio ciclo, no a la hora del flash',
  },
  nobody: 'el volcado de datos no lo recibe nadie',
} as const;
