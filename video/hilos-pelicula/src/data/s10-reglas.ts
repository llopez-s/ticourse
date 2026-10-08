/**
 * s10-reglas «Tres reglas» — on-screen strings (canon: out/scene-brief.md «Canon», s10). The rules follow the frozen
 * voice (s10-01..03) in its own words, shortened for the card but never changed in meaning. Rule 2 says «lo común no
 * une · lo barato, si no coincide, no separa» — never «ni une ni separa» (accuracy review). Titles are two hard lines;
 * sub lines ≤ 27 characters so they fit a 560 px card at 32 px. The end card points to the lesson's ten questions
 * (s2m4q1–q10, `src/data/s2.ts`) — no lab.
 */
import type { Tone } from '../../../engine/src/ui';

export type RuleArt = 'film' | 'label' | 'projected';

export interface RecapRule {
  art: RuleArt;
  tone: Tone;
  title: readonly [string, string];
  /** Short lines, each ≤ 27 characters. */
  sub: readonly string[];
}

export const RULES: readonly RecapRule[] = [
  // «Un evento es una foto, y los de una intrusión, en orden y por fases, son su película.»
  {
    art: 'film',
    tone: 'rose',
    title: ['Un evento', 'es una foto'],
    sub: ['los de una intrusión,', 'en orden y por fases,', 'son su película'],
  },
  // «Para juntar dos películas, busca lo raro de su taller, como una ruta del PDB que sea única. Lo común no une. Lo
  // barato, si no coincide, no separa.»
  {
    art: 'label',
    tone: 'cyan',
    title: ['Busca lo raro', 'de su taller'],
    sub: ['como una ruta del PDB única', 'lo común no une', 'lo barato, si no coincide,', 'no separa'],
  },
  // «Y un grupo no es un nombre, es un plan. Lo que hizo en una víctima te da hipótesis para la siguiente.»
  {
    art: 'projected',
    tone: 'emerald',
    title: ['Un grupo no es', 'un nombre'],
    sub: ['es un plan', 'lo que hizo en una víctima', 'te da hipótesis', 'para la siguiente'],
  },
];

/**
 * The word of each rule's voice line that lights each later sub line (index-aligned with `sub.slice(1)`; a missing
 * entry reuses the previous one).
 */
export const RULE_WORDS: readonly (readonly { seg: string; word: string }[])[] = [
  [
    { seg: 's10-01', word: 'orden' },
    { seg: 's10-01', word: 'película' },
  ],
  [
    { seg: 's10-02', word: 'común' },
    { seg: 's10-02', word: 'barato' },
    { seg: 's10-02', word: 'barato' },
  ],
  [
    { seg: 's10-03', word: 'hizo' },
    { seg: 's10-03', word: 'hipótesis' },
    { seg: 's10-03', word: 'siguiente' },
  ],
];

/** The word each card's drawing reacts on: the thread runs on «película», the label lights on «única», the frame projects on «plan». */
export const ART_WORDS: readonly { seg: string; word: string }[] = [
  { seg: 's10-01', word: 'película' },
  { seg: 's10-02', word: 'única' },
  { seg: 's10-03', word: 'plan' },
];

/** The one next step (s10-04 «Lo siguiente, las diez preguntas de la lección»). */
export const NEXT = { text: 'Tu turno: las preguntas de la lección', chip: 's2m4 · 10 preguntas' } as const;

export const END = {
  title: ['De la foto a la película', 'activity threads y grupos'] as const,
  next: 'Tu turno: las preguntas de la lección',
  quiz: 's2m4 · 10 preguntas',
  objective: 'GIAC GCTI · Intrusion Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
