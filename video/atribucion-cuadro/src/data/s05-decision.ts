/**
 * s05-decision «El nombre y la decisión» — on-screen strings (canon: storyboard goal, exact; the lesson's
 * callout «¿Necesitas atribución?», src/data/s4.ts s4m5). The CISO's question is CISO_QUESTION (CisoStrip).
 * Nothing here names a group, a confidence grade or a country.
 */

/** Column 1 (sky: beyond your network). Each item: its lines and, optionally, a smaller aside. */
export const S05_WHO = {
  title: 'a quién le sirve el país',
  items: [
    { lines: ['gobiernos'], aside: '(respuesta diplomática o legal)' },
    { lines: ['seguros'] },
    { lines: ['decisiones geopolíticas', 'de negocio'] },
  ],
} as const;

/** Column 2 (cyan: your network). «rara vez cambian» — never «no cambian». */
export const S05_DEFENSE = { title: 'qué cambia en tu defensa', what: 'detectar, cazar y proteger', rarely: 'rara vez cambian', with: 'con el país' } as const;

/** Between the two columns. */
export const S05_QUESTION = '¿qué decisión cambia con el nombre?';

/** The museum label beside the painting, and what it stands for. */
export const S05_LABEL = { text: 'atribuido a…', means: 'lo que afirmas lleva su confianza' } as const;

/**
 * The note: what you can write in the report. Each line is «key value»; `rest` are the value's lines (the
 * first one follows the key). It describes the group without naming it: no confidence grade, no country.
 */
export type NoteLine = { key: string; rest: readonly string[]; stamp?: true };
export const S05_NOTE: readonly NoteLine[] = [
  { key: 'cómo trabaja el grupo:', rest: ['lo ves en tu red'] },
  { key: 'qué busca:', rest: ['la propiedad intelectual', 'de propulsión de Meridian'] },
  { key: 'quién teclea:', rest: ['desconocido'], stamp: true },
  { key: 'para quién trabaja:', rest: ['tu red no tiene esa clase de prueba;', 'el juicio se emite con su confianza', 'y diciendo qué falta, no se calla'] },
];

/** The chapter's close, in two halves. */
export const S05_CLOSE = { chase: 'perseguir el nombre solo compensa', when: 'si una decisión lo pide' } as const;
