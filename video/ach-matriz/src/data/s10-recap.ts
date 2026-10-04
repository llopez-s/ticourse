/**
 * s10-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md). Rule titles are short versions of
 * the voice, hard-broken into two lines ≤ 16 characters so RuleCards keeps them at ~54 px; the subtitles
 * mirror the rest of each sentence (wording not canon).
 */
export const S10_RULES = [
  { title: ['Escribe lo que', 'das por hecho'] as const, sub: ['y pon a competir', 'todas las hipótesis'] as const },
  { title: ['Cuenta lo', 'que tumba'] as const, sub: ['no lo que encaja:', 'gana la menos inconsistente'] as const },
  { title: ['Quita la prueba', 'más fuerte'] as const, sub: ['¿tu conclusión', 'sigue en pie?'] as const },
] as const;

/** The one next step (canon, exact). */
export const S10_NEXT = 'Ahora te toca: Lab 4B';

export const S10_END = {
  title: ['ACH: gana la hipótesis', 'que no puedes tumbar'] as const,
  /** The end card's call to action (canon, exact: same words as the `lab4b` chip). */
  sub: 'Ahora te toca: Lab 4B',
  /** Mirrors the voice on `endcard` («PAPER CRANE cuenta con ellos»); not canon wording. */
  adversary: 'PAPER CRANE cuenta con tus atajos',
  objective: 'GIAC GCTI · Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
