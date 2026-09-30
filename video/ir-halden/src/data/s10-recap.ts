/** s10-recap «Tres reglas»: scene-only text. The rule cards' art is drawn in the scene. */

export const RECAP = {
  adversary: 'SILENT PAGER contaba con tus prisas',
  closed: 'caso cerrado',
  heading: ['Tres reglas', 'para tu próximo incidente'],
} as const;

/**
 * Titles are two hard-broken lines (RuleCards sizes all three by the longest line: 17 characters
 * gives 50 px); one sub line each, so the art slot can be 200 px high (the Leak reads small under
 * ~330 px wide).
 */
export const RULE_TEXT = [
  { title: ['Cada casilla,', 'su condición'], sub: 'no con las ganas de acabar' },
  { title: ['Primero cierra,', 'después limpia'], sub: 'y vuelve con copia de antes' },
  { title: ['Busca la gotera,', 'no a quién culpar'], sub: 'con responsable y fecha' },
] as const;

/** Rule 1's art: the box of Contención, re-checked with its condition met. */
export const RULE1_ART = { column: 'Contención', time: '10:30' } as const;

/** s10-04: the hook to the next video (never names the formats it will cover). */
export const NEXT = { question: '¿Cómo sabes que el plan nuevo funciona?', chip: 'en el siguiente vídeo' } as const;

/** s10-05: the lab (spl4b) and the end card. */
export const LAB = { lead: 'Ahora te toca:', name: 'Incident Response Drill', chip: 'ordena las 7 fases' } as const;
export const END = {
  title: ['Respuesta a ', 'incidentes'],
  objective: 'Security+ SY0-701 · objetivo 4.8',
  next: 'Siguiente: ¿funciona el plan nuevo?',
} as const;
