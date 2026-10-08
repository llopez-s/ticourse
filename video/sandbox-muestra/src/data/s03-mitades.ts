/** s03 «Dos mitades»: on-screen labels (canon: out/scene-brief.md, «Canon strings» → s03). The report is report.ts. */

export const S03_LABELS = {
  later: 'la leemos luego',
  /** Only what the task does in the sandbox: no date, no host. */
  task: ['tarea para volver', 'a arrancar'] as const,
  /** Screen only (the voice does not comment on the pipe). */
  pipeRule: ['mismo formato', 'otro número en cada ejecución'] as const,
  wrapStatic: 'lo que lleva escrito',
  wrapDynamic: 'lo que hace',
} as const;

/** Exam names (violet), each with its Spanish gloss. */
export const S03_NAMES = {
  static: { en: 'STATIC ANALYSIS', es: 'análisis estático' },
  dynamic: { en: 'DYNAMIC ANALYSIS', es: 'análisis dinámico' },
} as const;
