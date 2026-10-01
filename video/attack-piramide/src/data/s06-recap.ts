/** s06 «Tres reglas»: the three rules (titles hard-broken: ≤ 18 characters per line keeps them ≥ 46 px). */
export const S06_RULES = [
  {
    title: ['El comando exacto', 'es la procedure'] as const,
    sub: [
      ['technique', ': el cómo'],
      ['tactic', ': el porqué'],
    ] as const,
    tone: 'rose' as const,
  },
  {
    title: ['El hash caduca con', 'cada compilación'] as const,
    sub: ['nombres y rutas', 'aguantan algo más'] as const,
    tone: 'amber' as const,
  },
  {
    title: ['Pon tu esfuerzo', 'arriba'] as const,
    sub: ['una regla que mira', 'cómo anda, no qué ropa lleva'] as const,
    tone: 'emerald' as const,
  },
];

export const S06_NEXT = { text: 'A por las preguntas de la lección', chip: 's2m5 · 10 preguntas' } as const;

export const S06_END = {
  title: 'Del comando al TTP',
  objective: 'GIAC GCTI · Intrusion Analysis',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
