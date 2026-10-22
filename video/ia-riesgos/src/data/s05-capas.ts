/** s05-capas «Lo que sí funciona»: scene-only text. */

/** `assume`: the starting point. */
export const ASSUME = 'supón que alguna vez fallará';

/** The barriers around the assistant, outside the model, one at a time. */
export const BARRIERS = [
  { key: 'least', title: 'permisos mínimos', sub: 'los de quien pregunta', icon: 'key' },
  { key: 'nolimit', title: 'sin salida libre', sub: 'una persona aprueba', icon: 'user' },
  { key: 'log', title: 'registro para el SOC', sub: 'documento procesado · herramienta usada', icon: 'file' },
] as const;

export const ASSISTANT = 'asistente';

/** `outside`: the stroke that gathers the barriers. */
export const OUTSIDE = 'todas fuera del modelo';
