/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md › Canon › s06). The rule texts
 * follow the narration (s06-01..03), cut into a big two-line title and a smaller two-line sub (titles
 * ≤ 20 characters per line so the engine's RuleCards keeps them at ~44 px on a 560 px card).
 */

export type SubSpan = { text: string; tone?: 'cyan' | 'violet' | 'amber' | 'emerald' };

export interface RecapRuleText {
  title: readonly [string, string];
  sub: readonly [readonly SubSpan[], readonly SubSpan[]];
  tone: 'cyan' | 'amber' | 'emerald';
  /** Segment of the rule's sentence, for word-synced beats of its art. */
  seg: string;
}

export const RULES: readonly [RecapRuleText, RecapRuleText, RecapRuleText] = [
  // «YARA mira dentro. Sigma mira lo que pasa, y se convierte antes de correr.»
  {
    title: ['YARA mira dentro;', 'Sigma, lo que pasa'],
    sub: [[{ text: 'Sigma', tone: 'violet' }, { text: ' ' }, { text: 'se convierte', tone: 'cyan' }], [{ text: 'antes de correr' }]],
    tone: 'cyan',
    seg: 's06-01',
  },
  // «Una cadena corriente, sola, salta con cualquiera. Pídele compañía, o una pieza única como el PDB.»
  {
    title: ['Lo corriente, solo,', 'salta con cualquiera'],
    sub: [[{ text: 'pídele ' }, { text: 'compañía', tone: 'cyan' }], [{ text: 'o una pieza única: el ' }, { text: 'PDB', tone: 'violet' }]],
    tone: 'amber',
    seg: 's06-02',
  },
  // «Apóyate en lo que cuesta cambiar, el nombre original y no el del disco. Y vigila si salta.»
  {
    title: ['El nombre original,', 'no el del disco'],
    sub: [[{ text: 'lo que ' }, { text: 'cuesta cambiar', tone: 'emerald' }], [{ text: 'y ' }, { text: 'vigila si salta', tone: 'amber' }]],
    tone: 'emerald',
    seg: 's06-03',
  },
];

/** Words of the voice that move the cards' art. */
export const ART_WORDS = { piece: 'pieza', disk: 'disco' } as const;

/** What rule 3's art shows: s04's passport (OriginalFileName) and the renamed boarding card (Image). */
export const PASSPORT_NAME = 'CertUtil.exe';
export const CARD_NAME = 'wcssvc.exe';

export const HEAD = { lead: 'Tres ideas', rest: ' para llevarte' } as const;

/** The one next step (no lab): the lesson's quiz. */
export const NEXT = { text: 'Tu turno: las preguntas de la lección (s5m3)', chip: '10 preguntas' } as const;

export const END = {
  title: 'YARA y Sigma',
  sub: 'del indicador a la regla',
  objective: 'GIAC GCTI · Dissemination',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
