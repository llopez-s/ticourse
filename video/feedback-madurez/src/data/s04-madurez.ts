/** s04-madurez «Cómo crece un servicio»: on-screen text (canon: out/scene-brief.md). */
export const S04_NO_BUY = 'no se compra';

/** The lesson's words for each stage (src/data/s5.ts, s5m5). */
export const S04_STAGE_TEXT = [
  'consume feeds, apaga fuegos',
  'requirements escritos · productos regulares · CMF',
  'inteligencia integrada en decisiones · métricas de resultado · producción propia que la comunidad consume',
] as const;

export const S04_CMF = { label: 'CMF: qué fuente responde qué pregunta', gap: 'hueco' } as const;

export const S04_MEASURE = {
  no: 'no cuenta: analistas ni gasto',
  yes: 'cuenta: decisiones tomadas con lo que produces',
} as const;
