/**
 * s08-grafo «La escena que viene» — on-screen strings (canon: out/scene-brief.md «Canon», s08). Nothing here is new
 * data of the intrusion: the projected frame repeats E9's plan-A line from s02 (no size, no destination, no path), the
 * three inherited hypotheses are the lesson's «qué hará el actor a continuación, qué herramientas lleva, qué busca»
 * (`src/data/s2.ts:921`) in the voice's words (s08-04), and the two branches are the voice's «otra carpeta u otro
 * destino» (s08-06). The name ACTIVITY-ATTACK GRAPH enters only with `graph`, after the branches.
 */

/** The two films' labels: both victims, told apart by their labels (cyan · cyanSoft), never by a second accent. */
export const FILMS = { meridian: 'Meridian', orbital: 'Orbital' } as const;

/** Under the projected frame (`projected`). Two lines: the lead and E9's plan-A content, as in s02. */
export const PROJECTED = {
  lead: 'lo que vino después en Meridian:',
  what: 'compresión en una carpeta temporal · salida grande',
} as const;

/** The inherited hypotheses (`inherit`), under the amber tag. */
export const INHERIT = {
  tag: 'a comprobar',
  chips: ['qué hará después', 'con qué', 'qué busca'],
} as const;

/** The two dashed branches out of the gap (`possible`). */
export const BRANCHES = ['otra carpeta', 'otro destino'] as const;

/**
 * The name and its gloss (`graph`). «ACTIVITY-ATTACK GRAPH» and «lo que hizo y lo que podría hacer», each on two hard
 * lines (same words): the gloss doubles as the legend of the solid thread and the dashed branches.
 */
export const GRAPH = {
  name: ['ACTIVITY-ATTACK', 'GRAPH'],
  sub: ['lo que hizo', 'y lo que podría hacer'],
} as const;
