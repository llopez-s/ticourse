/** s02-lista «Lo que la lista no sabe» — on-screen strings (canon: out/scene-brief.md). */

export const CASE_TAG = 'Caso de ejemplo · sin fecha';
/** «oficina de la terminal de pasajeros», in two lines. */
export const OFFICE = ['oficina de la terminal', 'de pasajeros'] as const;
export const SHARED = 'listas de embarque';

/** The three crossed-out items next to the disk, each struck on a word of s02-02. */
export const UNPATCHED: { text: string; word: string }[] = [
  { text: 'sin parches', word: 'parchea' },
  { text: 'sin copias', word: 'copias' },
  { text: 'sin vigilar', word: 'existe' },
];

export const LIST_TITLE = 'lista de Sistemas';
export const DOOR = 'Compras';

export const NETWORK = 'red cableada de la oficina';
export const EXTRA = 'responde · no está en la lista';

/** Names, each on its word in s02-05. */
export const TERMS = {
  inventory: 'inventory',
  enumeration: 'enumeration',
  shadow: 'shadow IT',
} as const;
