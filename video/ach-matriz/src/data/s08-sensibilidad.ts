import { MATRIX_TEXT } from './matrix';

const plantWords = MATRIX_TEXT.plantNote.split(' ');

/** On-screen strings of s08-sensibilidad. The table and stool texts live in parts/Table.tsx. */
export const S08_TEXT = {
  /** The name the voice says first, then the exam term. */
  termEs: 'análisis de sensibilidad',
  termEn: 'SENSITIVITY ANALYSIS',
  /** MATRIX_TEXT.plantNote («justo lo que alguien podría plantar») in two lines, for the narrow column beside E4. */
  plantNoteLines: [plantWords.slice(0, 4).join(' '), plantWords.slice(4).join(' ')] as const,
} as const;
