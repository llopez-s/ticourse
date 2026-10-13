/**
 * s06-recap «Tres reglas» — on-screen strings (canon: out/scene-brief.md, «Scenes» › s06-recap). The three
 * rule texts are the storyboard's, word for word; they are only cut into lines (a short title line and the
 * rest, smaller) and into spans that carry this video's colours. Each line lights on a word of the voice
 * (`word`, in the rule's segment — the voice says less than the card: «pruebas» where the card reads
 * «evidencia»), or `after` frames behind the line before it.
 */

/** cyan = what your network gives you · amber = cheap, forgeable · emerald = costly, well-founded · exam = violet. */
export type RecapTone = 'strong' | 'soft' | 'cyan' | 'amber' | 'emerald' | 'exam' | 'aside';

export interface RecapSpan {
  text: string;
  tone?: RecapTone;
}

export interface RecapLine {
  /** 'title' = the short title line (big) · 'rest' = the rest of the rule · 'ask' = the question to ask yourself. */
  kind: 'title' | 'rest' | 'ask';
  spans: readonly RecapSpan[];
  word?: string;
  after?: number;
}

export type RecapThumb = 'bands' | 'signature' | 'label';

export interface RecapRule {
  thumb: RecapThumb;
  seg: string;
  lines: readonly RecapLine[];
}

export const RULES: readonly [RecapRule, RecapRule, RecapRule] = [
  // «Máquina, operador y sponsor: cada nivel pide evidencia de otro tipo. Tu red llega a la máquina»
  {
    thumb: 'bands',
    seg: 's06-01',
    lines: [
      { kind: 'title', spans: [{ text: 'Máquina, operador y ' }, { text: 'sponsor', tone: 'exam' }, { text: ':' }] },
      { kind: 'rest', spans: [{ text: 'cada nivel pide evidencia de otro tipo.' }], word: 'nivel' },
      { kind: 'rest', spans: [{ text: 'Tu red llega a la máquina', tone: 'cyan' }], word: 'tipo' },
    ],
  },
  // «Un idioma o una hora se falsifican en un minuto; años de objetivos y de rutina cuestan mucho más
  //  (caro no es imposible). ¿Y si esta pista es un señuelo?»
  {
    thumb: 'signature',
    seg: 's06-02',
    lines: [
      { kind: 'title', spans: [{ text: 'Un idioma o una hora ' }, { text: 'se falsifican en un minuto', tone: 'amber' }, { text: ';' }] },
      {
        kind: 'rest',
        spans: [{ text: 'años de objetivos y de rutina ' }, { text: 'cuestan mucho más', tone: 'emerald' }, { text: ' (caro no es imposible).', tone: 'aside' }],
        word: 'pesa',
      },
      { kind: 'ask', spans: [{ text: '¿Y si esta pista es un señuelo?' }], word: 'Pregúntate' },
    ],
  },
  // «Antes de poner un nombre, ¿qué decisión cambia? Y si lo pones, con su confianza»
  {
    thumb: 'label',
    seg: 's06-03',
    lines: [
      { kind: 'title', spans: [{ text: 'Antes de poner un nombre, ', tone: 'soft' }, { text: '¿qué decisión cambia?' }] },
      { kind: 'rest', spans: [{ text: 'Y si lo pones, ' }, { text: 'con su confianza', tone: 'emerald' }], word: 'cambia' },
    ],
  },
];

/** What the museum label of rule 3's thumbnail reads: s05's own string. */
export const LABEL_TEXT = 'atribuido a…';

/** The one next step (no lab): the lesson's quiz. The chip names it as the other GCTI capsules do. */
export const NEXT = { text: 'Tu turno: las preguntas de la lección', chip: 's4m5 · 10 preguntas' } as const;

export const END = {
  /** The video's title: s01's title line and the rest of it under. */
  lead: 'Atribución:',
  rest: '¿quién fue?',
  sub: 'Los tres niveles y las pistas falsas',
  objective: 'GIAC GCTI · Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
