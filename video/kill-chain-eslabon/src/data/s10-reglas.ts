/**
 * s10-reglas «Tres reglas» — on-screen strings (canon: out/scene-brief.md «Canon»). The rules follow the frozen voice
 * (s10-02..04) in its own words; rule 1 says «empieza de nuevo», never «de cero», and «a tu alcance» (a broken link
 * frustrates that attempt, not the attacker). Titles are two hard lines ≤ 15 characters; sub lines ≤ 30 characters at
 * 32 px. The end card points to Lab 2A (`src/data/labs.ts:62-75`) without any of its items.
 */
import type { Tone } from '../../../engine/src/ui';

export type RuleArt = 'chain' | 'box' | 'alarm';

export interface RecapRule {
  art: RuleArt;
  tone: Tone;
  title: readonly [string, string];
  /** Two or three short lines, each ≤ 30 characters. */
  sub: readonly string[];
}

export const RULES: readonly RecapRule[] = [
  // «El atacante necesita los siete pasos. A ti te basta con romper uno a tu alcance, y si vuelve, empieza de nuevo.»
  {
    art: 'chain',
    tone: 'emerald',
    title: ['Él necesita', 'los siete pasos'],
    sub: ['a ti, romper uno a tu alcance', 'si vuelve, empieza de nuevo'],
  },
  // «Cada prueba, a su fase. El correo es la entrega. El beacon es C2, no la misión. Y el taller se deduce de la caja.»
  {
    art: 'box',
    tone: 'cyan',
    title: ['Cada prueba,', 'a su fase'],
    sub: ['el correo es la entrega', 'el beacon es C2, no la misión', 'el taller se deduce'],
  },
  // «Y cuanto más a la izquierda cortes, más pasos le quitas. Para eso hay que ver antes, o llegas tarde.»
  {
    art: 'alarm',
    tone: 'amber',
    title: ['Corta a la', 'izquierda'],
    sub: ['más pasos le quitas', 'ver antes, o llegas tarde'],
  },
];

/** The words of each rule's voice line that light its second (and third) sub line. */
export const RULE_WORDS: readonly (readonly { seg: string; word: string }[])[] = [
  [{ seg: 's10-02', word: 'vuelve' }],
  [
    { seg: 's10-03', word: 'beacon' },
    { seg: 's10-03', word: 'taller' },
  ],
  [{ seg: 's10-04', word: 'ver' }],
];

/** The word each card's drawing reacts on: the link breaks on «romper», the magnifier lights on «taller», the lock lands on «cortes». */
export const ART_WORDS: readonly { seg: string; word: string }[] = [
  { seg: 's10-02', word: 'romper' },
  { seg: 's10-03', word: 'taller' },
  { seg: 's10-04', word: 'cortes' },
];

/** The one next step (s10-05 «Te espera el Lab 2A, con doce eventos de esta intrusión»). */
export const NEXT = { text: 'Tu turno: Lab 2A · Kill Chain Mapping', chip: '12 eventos' } as const;

export const END = {
  title: ['La Cyber Kill Chain', 'basta con romper un eslabón'] as const,
  next: 'Tu turno: Lab 2A · Kill Chain Mapping',
  lab: 'Lab 2A · 12 eventos · aprueba con 80 %',
  objective: 'GIAC GCTI · Intrusion Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
