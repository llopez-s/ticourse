/**
 * s02-sqli «Una comilla en el login» — on-screen strings (storyboard `goal`). The query and the payload live in
 * data/query.ts; here: the first, ordinary attempt, the three marks of the payload, the rows the query returns and
 * the name. Test accounts are fictitious `demo.*` names, nothing like the course's canon accounts; the password is
 * only dots.
 */
import { C } from '../../../engine/src/theme/tokens';

/** The ordinary attempt (s02-01 «con una contraseña equivocada»): a test user and a wrong password (dots only). */
export const ATTEMPT = { user: 'demo.citas', dots: 8 } as const;

/** The three things the voice names (s02-03, s02-04), each lit on its own cue. */
export const MARKS = [
  { cue: 'quote', token: "'", caption: 'cierra el nombre', tone: C.amber },
  { cue: 'always-true', token: 'OR 1=1', caption: 'siempre se cumple', tone: C.amber },
  { cue: 'comment', token: '--', caption: 'apaga el resto', tone: C.rose },
] as const;

export const NOTES = {
  hole: 'aquí se pega lo que escribes',
  pass: 'contraseña incluida',
  rows: ['devuelve', 'todas las filas'],
  panel: 'Consulta a la base de datos',
} as const;

/** What the query returns when nothing filters it: every row of the table (fictitious test accounts). */
export const ROWS = [
  { id: 1, name: 'demo.citas' },
  { id: 2, name: 'demo.puerta' },
  { id: 3, name: 'demo.transporte' },
  { id: 4, name: 'demo.revision' },
] as const;

/** s02-06 «Es un formulario con un hueco…». */
export const FORM = { rellenas: 'ya no rellenas:', redactas: 'redactas la pregunta' } as const;

/** s02-07 «Eso es la inyección SQL. El texto se cuela en la consulta y pasa de dato a orden». */
export const NAME = { title: 'SQL INJECTION', from: 'dato', to: 'orden' } as const;
