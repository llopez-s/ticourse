/** s09-examen «Fíjate en el verbo» — on-screen strings (canon: storyboard goal, exact). A generic classification question, none of the bank's. */
export const S09_CARD = { tag: 'pregunta de clasificar', activity: ['Actividad:', 'normalizar', 'los registros recogidos'], ask: '¿qué fase?' } as const;
/** The lesson's exam-note keywords per phase; `word` is the narration word each row lights on. */
export const S09_ROWS = [
  { kind: 'board', phase: 'Processing & Exploitation', words: ['convert', 'decode', 'translate', 'normalize', 'detonate'], word: 'convertir' },
  { kind: 'stove', phase: 'Analysis & Production', words: ['judgment', 'assessment', 'hypothesis'], word: 'juzgar' },
  { kind: 'ticket', phase: 'Planning & Direction', words: ['requirements', 'tasking'], word: 'pedir' },
] as const;
export const S09_SAYS = 'manda lo que se hace con el dato';
export const S09_STAMP = 'los requirements dirigen la colección, no al revés';
