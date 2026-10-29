/**
 * s06-recap «Tres reglas»: on-screen text (canon: out/scene-brief.md). Each rule is the brief's sentence split at
 * its colon (or at a natural break): the first lines are the card title, the rest its subtitle, in the same order.
 */
export const S06_RULES = [
  {
    // «Mide resultados, no volumen: decisiones y amenazas encontradas, no indicadores procesados»
    title: ['Mide resultados,', 'no volumen'] as const,
    sub: ['decisiones y amenazas', 'encontradas, no indicadores', 'procesados'] as const,
  },
  {
    // «Pregunta tras cada producto y apunta los éxitos atribuibles: preguntas para mejorar, éxitos para demostrar»
    title: ['Pregunta tras cada', 'producto y apunta'] as const,
    sub: ['los éxitos atribuibles:', 'preguntas para mejorar,', 'éxitos para demostrar'] as const,
  },
  {
    // «Primero el proceso, luego la plataforma: la madurez se mide en decisiones, no en gasto»
    title: ['Primero el proceso,', 'luego la plataforma'] as const,
    sub: ['la madurez se mide en', 'decisiones, no en gasto'] as const,
  },
] as const;

export const S06_NEXT = 'Tu turno: las 6 preguntas de la lección';

export const S06_END = {
  title: ['Métricas, feedback', 'y madurez'],
  sub: ['cómo demuestra su valor', 'un equipo de inteligencia'],
  objective: 'GIAC GCTI · Dissemination',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.',
} as const;
