/**
 * s04-binario «Un binario sobre la mesa» — on-screen strings (canon: storyboard goal, exact; the table is the
 * lesson's, src/data/s4.ts s4m5 «False flags»). No language, alphabet, place, time zone or hour anywhere: the
 * two clues are these two Spanish phrases and nothing else.
 */

/** The sample's label, readable from the first frame: it is the lesson's example, not Meridian's case. */
export const S04_SAMPLE = { lead: 'Ejemplo de la lección', not: 'no es el caso de Meridian' } as const;

/** The two clues, already cut into lines. They carry no weight label until the answer. */
export const S04_CLUES = [['textos en otro idioma'], ['horas de compilación de una', 'jornada de oficina concreta']] as const;

/** The hand paints signature and date alone, in a moment. */
export const S04_MINUTE = 'un minuto';

/** A piece of cell text; `term` marks an exam term kept in English (violet). */
export type Piece = { t: string; term?: true };
export type TableRow = {
  /** Lines of the «evidencia» cell. */
  evidence: readonly (readonly Piece[])[];
  /** Lines of the «falsificable» cell. */
  forgeable: readonly string[];
  weight: string;
  /** A caveat under the weight (small). */
  note?: readonly Piece[];
  /** false = cheap to forge (amber) · true = costly, sustained (emerald). */
  costly: boolean;
};

export const S04_HEADERS = ['evidencia', 'falsificable', 'peso para atribuir'] as const;

export const S04_ROWS: readonly TableRow[] = [
  { evidence: [[{ t: 'strings', term: true }, { t: ' o idioma' }]], forgeable: ['trivial'], weight: 'muy bajo, aislada', costly: false },
  { evidence: [[{ t: 'compile times', term: true }, { t: ' u horario' }]], forgeable: ['trivial'], weight: 'muy bajo, aislada', costly: false },
  { evidence: [[{ t: 'tooling', term: true }, { t: ' de otro grupo' }]], forgeable: ['fácil si es público', 'o robado'], weight: 'bajo', costly: false },
  {
    evidence: [[{ t: 'objetivos sostenidos durante años,' }], [{ t: 'alineados con unos intereses' }]],
    forgeable: ['cara de sostener'],
    weight: 'medio-alto',
    note: [{ t: 'sola no llega al ' }, { t: 'sponsor', term: true }],
    costly: true,
  },
  { evidence: [[{ t: 'tradecraft', term: true }, { t: ' de años con errores de ' }, { t: 'opsec', term: true }]], forgeable: ['muy cara'], weight: 'alto, en agregado', costly: true },
];

/** The name of the trick (violet: an exam name) and what it is. */
export const S04_FALSE_FLAG = { name: 'FALSE FLAG', is: ['pistas dejadas a propósito', 'para culpar a otro'] } as const;

/** Beside the first two rows: «aisladas pesan muy poco · dentro de un conjunto grande y coherente, suman». */
export const S04_ALONE = { alone: 'aisladas pesan muy poco', together: ['dentro de un conjunto', 'grande y coherente, suman'] } as const;

/** Beside the two costly rows. */
export const S04_NOT_IMPOSSIBLE = 'caro no es imposible';

/** The painting's documented history, year after year. */
export const S04_PROVENANCE = 'procedencia';

/** V9's sensitivity question, in two halves. */
export const S04_QUESTION = { lure: 'si esta pista fuera un señuelo,', ask: '¿cambia tu conclusión?' } as const;
