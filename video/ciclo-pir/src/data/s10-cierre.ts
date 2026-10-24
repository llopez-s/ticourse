/**
 * s10-cierre «Tres reglas» — on-screen strings (canon: storyboard goal, exact where quoted). Rule titles are short
 * versions of the voice, hard-broken into two lines ≤ 18 characters; the subtitles mirror the rest of each sentence
 * (wording not canon). The video does not solve the Lab 1B nor give its list of PIRs.
 */
export const S10_RULES = [
  { title: ['La pregunta', 'va primero'] as const, sub: ['sin requirements, ninguna', 'fase tiene sentido'] as const },
  { title: ['Un PIR se prueba', 'con una decisión'] as const, sub: ['una pregunta concreta y', 'alguien que actúa distinto'] as const },
  { title: ['El ciclo se cierra', 'con feedback'] as const, sub: ['y en un incidente,', 'F3EAD gira más rápido'] as const },
] as const;

/** The recap strip: the three rules in one word each. */
export const S10_STRIP = ['pregunta', 'decisión', 'feedback'] as const;

/** The one next step (storyboard, exact). */
export const S10_NEXT = { lab: 'Tu turno: Lab 1B · PIR Workshop', twelve: 'y las doce preguntas de las dos lecciones' } as const;

export const S10_END = {
  title: ['Antes de recoger nada:', 'la pregunta'] as const,
  objective: 'GCTI · Requirements',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
