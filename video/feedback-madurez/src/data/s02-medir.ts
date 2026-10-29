/** s02-medir «Kilómetros y viajeros»: on-screen text (canon: out/scene-brief.md). */
export const S02_ODOMETER = { label: 'Nº de IOCs ingeridos', unit: 'km' } as const;

export const S02_EMPTY = 'nadie a bordo';

/**
 * The lesson's table (src/data/s5.ts, s5m5), word for word. The only deviation, on purpose: row 4's value is
 * written without the arrow the lesson uses («requisito→respuesta»).
 */
export const S02_TABLE = {
  headers: { vain: 'métrica vanidosa', value: 'métrica de valor' },
  vain: ['Nº de IOCs ingeridos', 'Nº de informes publicados', 'Feeds contratados', 'Páginas por informe'],
  value: [
    'Detecciones/hunts originados por intel que encontraron actividad real',
    'Requirements respondidos y decisiones informadas (con feedback del consumidor)',
    'Cobertura del CMF sobre los PIRs (gaps cerrados)',
    'Tiempo de requisito a respuesta; satisfacción del consumidor',
  ],
} as const;

export const S02_TARGET = ['el equipo hace', 'lo que se mide'] as const;

export const S02_CLOCK = { start: 'llegas a la parada', end: 'llegas adonde ibas', span: 'de punta a punta' } as const;

export const S02_LENS = 'resultados sobre decisiones y detección, no volumen';
