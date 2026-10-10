/**
 * s05-vitrina «Dentro de una vitrina» — on-screen strings (storyboard `goal`). The exam line is the lesson's own
 * wording (sp2-part2.ts:337): input validation, or its specific version, is the answer; when both appear the specific
 * one winning is an inference (q2) that is not stated. The action line is a plan with an owner and a date, not a
 * result: nothing is blamed on Desarrollo.
 */
export const QUESTION = '¿Y con el script, qué se hace?';

/** The picture of why the defence goes in the server: the browser obeys the page, the server writes the page. */
export const CHAIN = {
  server: 'servidor',
  page: 'la página',
  browser: 'navegador',
  writes: 'la escribe',
  obeys: 'obedece',
  inside: 'texto de otra persona',
} as const;

export const VITRINA_CAPTION = 'se lee, pero no se obedece';

export const NAME = { title: 'OUTPUT\nENCODING' } as const;

/** Small and grey: the lesson's complements (sp2-part2.ts:321). */
export const EXTRAS = ['validar la entrada', 'política de contenido (CSP)'] as const;

/** The exam line (storyboard string, exactly). */
export const EXAM_LINE = 'en el examen: input validation (validar la entrada), o su versión específica (parameterized queries, output encoding), es la respuesta';

/** The action line (storyboard string): «consultas parametrizadas y codificación de salida en el portal de citas · Desarrollo · 13-11». */
export const ACTION = {
  what: 'consultas parametrizadas y codificación de salida',
  where: 'en el portal de citas',
  who: 'Desarrollo',
  when: '13-11',
} as const;

export const SAME_ROOT = 'el dato en su sitio';
