/** s02-causa «La carpeta abierta» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

/** The permission card, popping on `everyone` (rose: what is wrong). */
export const PERMISSION = 'todos · leer';

/** The four proposals, all with an emerald tick on «funcionan». `answer` is the one that attacks the cause. */
export const PROPOSALS: { text: string; icon: IconName; answer?: boolean; encrypt?: boolean }[] = [
  { text: 'cifrar el disco del servidor', icon: 'key', encrypt: true },
  { text: 'vigilar quién la abre', icon: 'eye' },
  { text: 'segmentar la red', icon: 'network' },
  { text: 'dejar los permisos solo a ese departamento', icon: 'users', answer: true },
];
export const PROPOSALS_HEAD = 'cuatro propuestas';

/** The plant's two readings, each lit on its word in s02-03. */
export const PLANT_LINES = [
  { text: '¿le falta agua? se riega', word: 'agua', good: true },
  { text: '¿pulgón? regarla no la salva', word: 'pulgón', good: false },
] as const;

/** The answer under the permission card: the exam term on «access», the principle behind it, dim. */
export const ANSWER = { term: 'Access control', principle: 'el principio: least privilege' } as const;

/** Why encryption does not fix it (right column, from `not-encrypt`), each line on its word in s02-05. */
export const ENCRYPT_HEAD = 'cifrar el disco';
export const ENCRYPT_LINES: { text: string; word: string; good: boolean }[] = [
  { text: 'te protege si alguien se lo lleva', word: 'protege', good: true },
  { text: 'el servidor descifra para quien tiene permiso', word: 'servidor', good: false },
  { text: 'y aquí lo tiene toda la plantilla', word: 'aquí', good: false },
];

/** The verb map (screen only; the voice does not read it): what happened, and the technique that answers it. */
export const MAP_HEAD = 'el verbo del fallo elige la técnica';
export const VERB_MAP: { verb: string; techniques: string[] }[] = [
  { verb: '¿llegó adonde no debía?', techniques: ['Segmentation', 'Access control'] },
  { verb: '¿ejecutó algo que nadie aprobó?', techniques: ['Allow list'] },
  { verb: '¿leyó lo que se llevó o escuchó?', techniques: ['Encryption'] },
  { verb: '¿aprovechó un fallo conocido?', techniques: ['Patching'] },
  { verb: '¿nadie se enteró?', techniques: ['Monitoring'] },
  { verb: '¿la cuenta podía demasiado?', techniques: ['Least privilege'] },
];
