/** s04-dueno «De quién es y qué trato» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

export const LIST_TITLE = 'lista de Sistemas';
export const DEVICE = 'disco de red';

/** The two fields of the disk's row (exam terms, in English). */
export const OWNER = 'owner';
export const CLASSIFICATION = 'classification';

/** A post, never a person's name. */
export const OWNER_VALUE = 'responsable de la oficina de la terminal de pasajeros';
export const PERSON = 'una persona, no un área';

/** What being the owner means, each lit on a word of s04-03 (the third has no word: it follows the second). */
export const DUTIES: { text: string; icon: IconName; word: string | null }[] = [
  { text: 'aprueba los cambios', icon: 'check', word: 'Aprueba' },
  { text: 'decide quién entra', icon: 'users', word: 'decide' },
  { text: 'responde del parche y de la retirada', icon: 'shield', word: null },
];

/** What it keeps (no «documentos», so «Private» is not up for debate). */
export const CONTENTS = 'listas de embarque · nombres de pasajeros';

/** The level sp3m6's table gives personal data; the voice never says it. */
export const LABEL = 'Private';

/** The four obligations the label turns into, each lit on a word of s04-04 (copias has none: between). */
export const OBLIGATIONS: { text: string; icon: IconName; word: string | null }[] = [
  { text: 'cifrado', icon: 'key', word: 'cifra' },
  { text: 'quién accede', icon: 'eye', word: 've' },
  { text: 'copias', icon: 'archive', word: null },
  { text: 'cómo se retira', icon: 'power', word: 'retira' },
];
