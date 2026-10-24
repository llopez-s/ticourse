/**
 * s02-entra «Por dónde entra la orden»: scene-only text. The hidden order is
 * NEVER written: on screen it is a gray bar under a padlock.
 */

export const DOC = {
  title: 'Documento de un tercero',
  /** The request of the person from operations (her own words are a gray bar too; this is the label). */
  ask: 'resúmelo',
  hiddenLabel: 'texto escondido',
} as const;

/** The model's single «ear»: the request and the hidden bar go in the same way. */
export const READS = {
  model: 'modelo',
  caption: 'para el modelo, todo es texto',
  request: 'petición',
  hidden: 'documento',
} as const;

/** The three-row table: who attacks and where the order comes in. */
export interface RowDef {
  term: string;
  where: string;
  tone: 'rose' | 'amber' | 'violet';
  icon: 'file' | 'users' | 'database';
}

export const ROWS: readonly RowDef[] = [
  { term: 'indirecta', where: 'la orden viaja en el documento', tone: 'rose', icon: 'file' },
  { term: 'jailbreaking', where: 'el usuario, en su conversación', tone: 'amber', icon: 'users' },
  { term: 'poisoning', where: 'los datos con los que aprende', tone: 'violet', icon: 'database' },
];

/** The question that tells them apart (`rule`). */
export const RULE_Q = '¿quién ataca y por dónde entra?';
