/** s08-permanentes «El pedido fijo y el banquete» — on-screen strings (canon: storyboard goal, exact). Generic sources, no provider names. */
export const S08_STANDING = { label: 'standing requirement', question: '¿Qué actores apuntan a nuestro sector?', clock: 'se revisa cada cierto tiempo' } as const;
export const S08_ADHOC = { label: 'ad hoc requirement · expira al responderse', items: [{ text: 'una fusión', icon: 'merge', word: 'fusión' }, { text: 'un incidente', icon: 'alert', word: 'incidente' }, { text: 'una tecnología nueva', icon: 'plug', word: null }] } as const;
export const S08_TABLE = {
  title: 'Collection Management Framework',
  later: 'lo construirás en la sección tres',
  heads: ['PIR', 'preguntas de colección', 'fuente'],
  rows: [
    { q: 'pregunta de colección 1', src: 'fuente A' },
    { q: 'pregunta de colección 2', src: 'fuente B' },
    { q: 'pregunta de colección 3', src: 'fuente C' },
    { q: 'pregunta de colección 4', src: null },
  ],
} as const;
export const S08_CALLBACK = { spare: 'sobra', get: 'hay que conseguirlas' } as const;
