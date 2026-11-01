/**
 * The four exam qualifiers, the video's one shared vocabulary (canon: out/scene-brief.md).
 * Read by s04 (the four chips), s05 / s06 / s08 / s09 (the band under the question panel) and s11 (pill only).
 * English term first, as the exam writes it; Spanish beside it. `tone`: violet = exam word, rose = «MENOS» only.
 */
export type QualifierId = 'best' | 'first' | 'likely' | 'least';

export interface Qualifier {
  id: QualifierId;
  /** Spanish word as it is highlighted in the band: «MEJOR», «PRIMERO», «MÁS probable», «MENOS». */
  es: string;
  /** The exam term: «BEST», «FIRST», «MOST likely», «LEAST». */
  en: string;
  /** The line the scene draws under the question panel (the panel itself prints none). */
  gloss: string;
  tone: 'violet' | 'rose';
}

export const QUALIFIERS: Record<QualifierId, Qualifier> = {
  best: { id: 'best', es: 'MEJOR', en: 'BEST', gloss: 'varias ayudan, una resuelve todo el caso', tone: 'violet' },
  first: { id: 'first', es: 'PRIMERO', en: 'FIRST', gloss: 'todas llegarán, ¿cuál va antes?', tone: 'violet' },
  likely: { id: 'likely', es: 'MÁS probable', en: 'MOST likely', gloss: 'lo que pasa casi siempre', tone: 'violet' },
  least: { id: 'least', es: 'MENOS', en: 'LEAST', gloss: 'la pregunta va al revés', tone: 'rose' },
};

/** Order of s04 and of the course's four qualifiers. */
export const QUALIFIER_ORDER: QualifierId[] = ['best', 'first', 'likely', 'least'];

/** «pregunta tipo examen · ejemplo»: drawn by every question scene (the engine's panel prints only «EXAMEN · SY0-701 · N.N»). */
export const QUESTION_TAG_TEXT = 'pregunta tipo examen · ejemplo';
