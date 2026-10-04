/**
 * s06-recap «Tres reglas»: on-screen text (canon: out/scene-brief.md). Each rule is the brief's string split at
 * its « · »: the part before is the card title (hard-broken into two lines), the part after is the subtitle.
 */
export const S06_RULES = [
  {
    // «antes de bloquear, mira hasta cuándo vale · caducado: busca hacia atrás, ya»
    title: ['antes de bloquear,', 'mira hasta cuándo vale'] as const,
    sub: { lead: 'caducado:', rest: 'busca hacia atrás, ya' },
  },
  {
    // «un indicador, un solo contacto · con relaciones y todas sus fuentes»
    title: ['un indicador,', 'un solo contacto'] as const,
    sub: ['con relaciones', 'y todas sus fuentes'] as const,
  },
  {
    // «la carta no es el correo · STIX describe, TAXII transporta»
    title: ['la carta no es', 'el correo'] as const,
    sub: { stix: 'STIX', describe: 'describe,', taxii: 'TAXII', transports: 'transporta' },
  },
] as const;

export const S06_NEXT = 'Tu turno: las 10 preguntas de la lección';

export const S06_END = {
  title: '¿Bloqueo este dominio?',
  sub: 'Indicadores, STIX y TAXII',
  objective: 'GIAC GCTI · Collection',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
