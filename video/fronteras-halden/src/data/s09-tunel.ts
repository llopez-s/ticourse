/**
 * s09-tunel «Un pie a cada lado» — on-screen strings. Canon (out/scene-brief.md «Canon strings», s09) unless
 * marked otherwise. The drawing's own labels («aduana», «red interna», «Internet», «filtrado web · DLP · registros
 * del SOC», «directo · sin inspección») come from `CUSTOMS_TEXT` in parts/Customs.tsx.
 */

/** Opening: the port's remote access VPN as it is today (s08's label, the exam term, today's mode). */
export const TODAY = {
  /** s08's canon label for the service (no server name). */
  service: 'Acceso remoto del puerto',
  term: 'REMOTE ACCESS VPN',
  /** Canon s09. */
  mode: 'hoy: túnel dividido',
} as const;

/** One scheme at a time, as in the lesson's two diagrams (sp3-part3.ts:130-148). */
export const FULL = {
  term: 'FULL TUNNEL',
  /** Storyboard goal («todo por el túnel y por la sede»); not in the brief's canon list. */
  sub: 'todo por el túnel y por la sede',
  /** s09-05 «nada pasa sin que lo veas» (the narration's words); not in the brief's canon list. */
  customs: 'nada pasa sin que lo veas',
  /** Canon: the price, split at « · » into two lines. */
  price: ['más latencia ·', 'más ancho de banda en la sede'],
} as const;

export const SPLIT = {
  term: 'SPLIT TUNNEL',
  /** Storyboard goal («solo lo del puerto por el túnel»); not in the brief's canon list. */
  sub: 'solo lo del puerto por el túnel',
  /**
   * Canon «directo · sin inspección · sin DLP · sin registro». `Customs` prints the first half
   * («directo · sin inspección») under the direct route; this is the second line under it.
   */
  directRest: 'sin DLP · sin registro',
  /** Canon, split into two lines. */
  bridge: ['hace de puente entre Internet', 'sin vigilar y la red interna'],
} as const;

/** Canon decision line: the proposal and who carries it out. */
export const DECISION = { text: 'portátiles del puerto: túnel completo', owner: 'Sistemas' } as const;

/** Canon stamp, two lines (the break keeps its « · »). Approved, not running: from 1-12, with the zone plan's phases. */
export const STAMP_LINES = ['aprobado · comité de cambios · 27-11 ·', 'desde el 1-12, con las fases del plan de zonas'] as const;
