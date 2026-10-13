/**
 * s03-casilla «Cada dato en su casilla» — on-screen strings (storyboard `goal`). «Cifrado en reposo» is the disk's
 * encryption (the voice says «el cifrado en reposo» / «protege el disco»): with column or application-level
 * encryption the result would differ, so the labels say «disco», never «cifrar no sirve».
 */
import { C } from '../../../engine/src/theme/tokens';

export const QUESTION = '¿Cómo se arregla?';

/** The advice's diagram: application, the tricked query, the encrypted database. */
export const FLOW = {
  app: 'la aplicación',
  db: 'base de datos',
  disk: 'disco',
  diskSub: 'cifrado en reposo',
  chip: 'consulta trucada',
  launched: ['la lanza', 'la propia aplicación'],
  decrypted: 've los datos descifrados',
} as const;

/** The corrected query's two lanes: the order travels as a sentence with marks; the text travels apart, as data. */
export const LANES = {
  order: 'orden',
  data: 'dato',
  apart: 'aparte',
  empty: '0 filas',
} as const;

/** s03-06: the name, with the lesson's complements small and grey underneath (sp2-part2.ts:316-317). */
export const NAME = {
  title: 'PARAMETERIZED\nQUERIES',
  extras: ['validar la entrada (allow list)', 'cuenta de la base con los permisos justos'],
  tone: C.violet,
} as const;

export const FORM_NOTE = 'la frase sigue igual';
