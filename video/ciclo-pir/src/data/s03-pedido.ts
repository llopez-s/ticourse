/** s03-pedido «El almacén se llena» — on-screen strings (canon: storyboard goal, exact). All of it is hypothetical. */
export const S03_IMAGINE = 'Imagina que nadie la escribe';
export const S03_NO_ORDER = ['sin comanda', 'sin dirección'] as const;
export const S03_COLLECTION = ['Collection · datos crudos', 'de fuentes planificadas'] as const;
export const S03_STAMP = 'data hoarding';
/** The lesson's verbs for Processing & Exploitation; `word` is the narration word each lights on (null: with the label). */
export const S03_VERBS = [
  { text: 'parsear', word: null },
  { text: 'decodificar', word: null },
  { text: 'traducir', word: 'Traducirlos' },
  { text: 'normalizar', word: 'ordenarlos' },
  { text: 'detonar muestras', word: 'detonar' },
] as const;
export const S03_CONVERT = ['convertir lo crudo', 'en analizable'] as const;
export const S03_PILE = { storage: 'almacenamiento', fill: 'terabytes crudos', stamp: 'sin analizar' } as const;
