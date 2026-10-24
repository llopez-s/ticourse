/** s06-arriba «Quién decide arriba» — on-screen strings. */

export const BOARD = {
  who: 'el consejo del puerto',
  term: 'BOARD',
  chips: [
    { text: 'aprueba', seg: 's06-01', word: 'aprueba' },
    { text: 'responde', seg: 's06-01', word: 'responde' },
    { text: 'supervisa', seg: 's06-01', word: 'instancia' },
  ],
} as const;

export const COMMITTEE = {
  who: 'comité de seguridad de la información',
  term: 'COMMITTEE',
  chips: [
    { text: 'revisa riesgos', seg: 's06-02', word: 'revisa' },
    { text: 'aprueba excepciones', seg: 's06-02', word: 'riesgos' },
    { text: 'recomienda', seg: 's06-02', word: 'recomienda' },
  ],
  delegation: 'la delegación es de trabajo, no de responsabilidad',
} as const;

export const REGULATOR = {
  who: 'autoridad marítima nacional',
  term: 'GOVERNMENT ENTITY',
  chip: 'puede exigir un plan de protección aprobado antes de dejar operar',
  outside: 'gobierna desde fuera',
} as const;

export const CENTRAL = [
  { text: 'centralized · igual en todas partes, más lento', word: 'centralized', icon: 'layers' },
  { text: 'decentralized · rápido y local, desigual', word: 'Decentralized', icon: 'split' },
] as const;

export const CLUB_TITLE = 'un club de barrio';
