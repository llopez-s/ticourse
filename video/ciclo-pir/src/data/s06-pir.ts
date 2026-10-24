/** s06-pir «Una pregunta bien pedida» — on-screen strings (canon: storyboard goal, exact). No PIR of Meridian's. */
export const S06_TICKETS = { vague: 'tráeme algo de comer', precise: ['mesa cuatro', 'pescado sin gluten', 'antes de las diez'] } as const;
export const S06_PIR = 'Priority Intelligence Requirement';
/** The lesson's five criteria; `word` is the narration word each lights on, `sub` a small second line. */
export const S06_CRITERIA = [
  { title: 'una sola pregunta', sub: null, seg: 's06-03', word: 'sola' },
  { title: 'específico', sub: 'sector, actor, tecnología, geografía', seg: 's06-03', word: 'concreta' },
  { title: 'ligado a una decisión', sub: null, seg: 's06-04', word: null },
  { title: 'factible', sub: null, seg: 's06-05', word: null },
  { title: 'acotado en el tiempo', sub: 'cuando haga falta', seg: 's06-05', word: 'fecha' },
] as const;
export const S06_DECISION = '¿qué decisión cambia con la respuesta?';
export const S06_EXPIRE = 'las prioridades caducan';
export const S06_PEOPLE = {
  you: { who: 'tú', does: 'redactas y propones' },
  boss: { who: 'quien decide', does: 'valida la prioridad' },
} as const;
