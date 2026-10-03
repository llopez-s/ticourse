/**
 * s01-hook «Un aviso y un botón» — on-screen strings. The TIP window, the
 * incoming card and their texts live in the shared parts
 * (`scenes/parts/TipFrame.tsx`, `scenes/parts/IncomingCard.tsx`).
 */

export const TITLE = { main: '¿Bloqueo este dominio?', sub: 'Indicadores, STIX y TAXII' } as const;

/** The promise, one chip per word the voice says («Su fecha, su contexto y cómo llega»). */
export const PROMISE = [
  { text: 'su fecha', word: 'fecha' },
  { text: 'su contexto', word: 'contexto' },
  { text: 'cómo llega', word: 'llega' },
] as const;

export const BRIDGE = {
  meridian: 'Meridian Dynamics',
  sector: 'aeroespacial',
  target: 'meses en el punto de mira',
  before: 'hasta ahora: sobre todo tus datos',
  todayLead: 'hoy: un aviso de fuera, en ',
  todayStix: 'STIX',
} as const;
