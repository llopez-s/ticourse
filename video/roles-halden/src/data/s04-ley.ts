/** s04-ley «Quién decide para qué» — on-screen strings. */

export const PERSONAL = [
  { text: 'datos personales', word: null },
  { text: 'ley de privacidad', word: 'ley' },
] as const;

export const CONTROLLER = {
  who: 'el puerto, como organización',
  term: 'DATA CONTROLLER',
  chips: [
    { text: 'qué se recoge', word: 'recoge' },
    { text: 'para qué', word: 'para' },
    { text: 'cómo se trata', word: 'usa' },
  ],
} as const;

export const PROCESSOR = {
  who: 'una empresa manda a los pasajeros los avisos de embarque',
  term: 'DATA PROCESSOR',
  chip: 'por encargo del puerto, con sus instrucciones',
} as const;

export const OWN = { offers: 'sus propias ofertas', becomes: 'pasa a ser controller' } as const;

export const SENTENCE = ['Externalizar el trabajo no', 'externaliza la responsabilidad'] as const;
export const LEGAL = 'papeles legales entre organizaciones, no puestos de trabajo';

export const MOVING_TITLE = 'una mudanza';
