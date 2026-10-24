/**
 * On-screen strings shared by several scenes (the brief's «Canon»). Exam terms stay in English; everything else is
 * Spanish. No names, dates, hosts, accounts, addresses or people: the awareness programme and its first simulated
 * campaign are a proposal of the port «sin fecha», the three behaviours of s02 are «imagina», and the three questions
 * are examples from other companies. The figures of s04 are invented and live only on screen.
 */

/** The proposal stamp (s01). */
export const STAMP = ['Autoridad Portuaria de Halden', 'programa de concienciación', 'propuesta · sin fecha'] as const;

/** s01's title is these two lines; the end card and the poster add the subtitle. */
export const TITLE = ['Que la gente', 'avise'] as const;
export const SUBTITLE = 'concienciación que funciona';
export const PLAQUE = 'SY0-701 · 5.6';

/** s02: the three cases are suppositions, not facts of the port. */
export const IMAGINE_STAMP = ['Tres casos que llegan a Seguridad', 'imagina', 'sin fecha'] as const;

/** s04: the first simulated campaign is a proposal with invented figures. */
export const CAMPAIGN_STAMP = ['Autoridad Portuaria de Halden', 'primera campaña simulada', 'propuesta · ejemplo · datos ficticios'] as const;

/** Drawn by the question scenes: the engine's panel only prints «EXAMEN · SY0-701 · 5.6». */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';

/** Under the one everyday image of the video (the school English). */
export const IMAGE_TAG = 'imagen · no es del puerto';

/** Colour of each behaviour (amber = warning, sky = neutral, cyan = data), the same in s02, s03 and s08. */
export const BEHAVIOUR_TONE = { risky: '#fbbf24', unexpected: '#38bdf8', unintentional: '#22d3ee' } as const;
