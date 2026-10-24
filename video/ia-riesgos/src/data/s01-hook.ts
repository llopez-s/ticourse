/**
 * s01-hook «El asistente nuevo»: scene-only text. A made-up example outside
 * GLASS HARBOR: no dates, no campaign facts, no host, IP, domain or account.
 */

/** The ribbon over the whole scene: an example, never a campaign fact. */
export const RIBBON = 'Autoridad Portuaria de Halden · caso de ejemplo · sin fecha';

/** The assistant's chat window and the folder it can read (bubbles carry gray bars, never text). */
export const ASSISTANT = {
  window: 'Asistente interno',
  folder: 'documentos internos',
} as const;

export const TITLE = {
  lead: 'Una orden escondida',
  tail: 'en un documento',
} as const;

/** The two promise chips (`promise`). */
export const PROMISE = ['cómo se cuela', 'qué limita el daño'] as const;

/** The exam plaque: the engine's badge wording, nothing more about the SY0-801. */
export const PLAQUE = 'SY0-801 · borrador';

/** BORROWED VOICE's insignia (a quoted voice, never a portrait, no gender). */
export const ADVERSARY = {
  name: 'BORROWED VOICE',
  line: 'vive de voces ajenas',
} as const;
