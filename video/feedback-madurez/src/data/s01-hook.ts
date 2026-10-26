/** s01-hook «¿Sirve de algo el equipo?»: on-screen text (canon: out/scene-brief.md). */
export const S01_CONTEXT = ['Meridian Dynamics', 'aeroespacial', 'tú, su analista de inteligencia'] as const;

export const S01_ASK = { who: 'el CISO', text: '¿Sirve de algo el equipo de inteligencia?' } as const;

export const S01_PANEL = {
  title: 'panel de ejemplo · cifras ficticias',
  /** The left column of the lesson's table: the things that are easy to count. */
  counters: ['indicadores procesados', 'informes publicados', 'feeds contratados'],
} as const;

export const S01_TITLE = {
  lines: ['Métricas, feedback', 'y madurez'],
  sub: ['cómo demuestra su valor', 'un equipo de inteligencia'],
} as const;

/** Each chip lights on the word the voice says (looked up in s01-02). */
export const S01_PROMISE = [
  { text: 'qué medir', word: 'medir', icon: 'chart' },
  { text: 'a quién preguntar', word: 'bucle', icon: 'users' },
  { text: 'cómo madura un equipo', word: 'madura', icon: 'layers' },
] as const;
