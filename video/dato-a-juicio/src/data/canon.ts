/**
 * dato-a-juicio — on-screen strings shared by more than one scene (canon: storyboard goals, lesson s1m1/s1m2 in
 * src/data/s1.ts, docs/superpowers/canon/velvet-cicada.md). Per-scene wording lives next to its scene.
 */

/** The one IP of the lesson's table (s1.ts:27,32). The voice never reads it: it only exists on screen. */
export const IP = '141.98.6.10';

/** V13/V23's labels for the analyst's situation, plus the lesson's own wording for the small line. */
export const MERIDIAN = {
  org: 'Meridian Dynamics',
  sector: 'aeroespacial',
  you: 'tú, su analista de inteligencia',
  first: 'primera analista de inteligencia de la empresa',
} as const;

export const TITLE = {
  lead: 'De un dato',
  rest: 'a un juicio',
  sub: 'qué es inteligencia, qué es una amenaza y dónde encaja tu trabajo',
} as const;

/** The section adversary's card (src/data/course-gcti.ts:17-19): the same one G02 and G03 use. No targets, no dossier. */
export const EMBER = {
  name: 'EMBER FOX',
  role: 'célula de acceso inicial',
  craft: 'spearphishing',
} as const;

/** The three pieces of a threat, in the order the voice gives them. */
export type Piece = 'intent' | 'capability' | 'opportunity';
export const PIECES: readonly Piece[] = ['intent', 'capability', 'opportunity'];
