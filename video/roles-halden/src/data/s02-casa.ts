/** s02-casa «Quién decide y quién aplica» — on-screen strings. */
import type { IconName } from '../../../engine/src/ui';

export const REQUEST = { who: 'Atención al Pasajero', what: 'pide ver la lista' } as const;

/** One post and what it does; each chip lights on `word` of the segment `seg` (the voice says it). */
export interface Post {
  id: 'owner' | 'custodian' | 'steward';
  seg: string;
  /** The word the exam term lights on. */
  termWord: string;
  who: string;
  term: string;
  icon: IconName;
  chips: readonly { text: string; word: string }[];
}

export const POSTS: readonly Post[] = [
  {
    id: 'owner',
    seg: 's02-02',
    termWord: 'owner',
    who: 'responsable de la oficina de la terminal de pasajeros',
    term: 'DATA OWNER',
    icon: 'user',
    chips: [
      { text: 'aprueba accesos', word: 'decide' },
      { text: 'clasifica', word: 'clasificó' },
      { text: 'asume el riesgo', word: 'responde' },
      { text: 'rol de negocio', word: 'negocio' },
    ],
  },
  {
    id: 'custodian',
    seg: 's02-03',
    termWord: 'custodian',
    who: 'Sistemas',
    term: 'DATA CUSTODIAN',
    icon: 'gear',
    chips: [
      { text: 'da el permiso', word: 'permiso' },
      { text: 'cifra', word: 'cifra' },
      { text: 'hace las copias', word: 'copias' },
      { text: 'aplica · no decide', word: 'Aplica' },
    ],
  },
  {
    id: 'steward',
    seg: 's02-04',
    termWord: 'steward',
    who: 'oficina de planificación',
    term: 'DATA STEWARD',
    icon: 'search',
    chips: [
      { text: 'un solo formato de fecha', word: 'bien' },
      { text: 'nombres sin duplicar', word: 'repetidos' },
      { text: 'qué significa cada campo', word: 'significa' },
      { text: 'calidad y significado', word: 'steward' },
    ],
  },
];

/** The album (s02-05): who is each one and what do they do with the photos. */
export const ALBUM_TITLE = 'el álbum de fotos de la abuela';
