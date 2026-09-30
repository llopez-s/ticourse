/** s01-hook «¿Funciona el plan nuevo?»: scene-only text (canon: out/scene-brief.md). */

/**
 * The improvements of the 11-09 meeting, exactly as V5 s09 showed them
 * (copied from video/ir-halden/src/data/s09-plan.ts — never imported across videos).
 * On screen only: the voice never reads them.
 */
export interface Improvement {
  text: string;
  owner: string;
  date: string;
}

export const IMPROVEMENTS: Improvement[] = [
  { text: 'suplentes con permiso para aislar', owner: 'Seguridad', date: '30-09' },
  { text: 'las excepciones caducan solas', owner: 'Sistemas', date: '18-09' },
  { text: 'cuentas de servicio en gestor de contraseñas con rotación', owner: 'Sistemas', date: '31-10' },
  { text: 'DMARC en reject', owner: 'Correo', date: '25-09' },
  { text: 'alerta de logon de cuentas de servicio desde estaciones', owner: 'SOC', date: '25-09' },
  { text: 'agente de seguridad en todas las estaciones de administración', owner: 'Sistemas', date: '15-10' },
];
/** The row the voice is about («con suplentes y todo»). */
export const HIGHLIGHT_ROW = 0;

export const LIST_TEXT = {
  title: 'Mejoras de la reunión · 11-09',
  owner: 'responsable',
  date: 'fecha',
  stamp: '¿funciona?',
} as const;

export const TITLE = {
  text: 'Antes del próximo incidente',
  /** The subtitle line, one term per way (sky, amber, emerald). */
  terms: ['tabletop', 'simulation', 'threat hunting'],
} as const;

/** The promise: two ways to test the plan and the hunt (captions under the three tiles). */
export const PROMISE = [
  { caption: 'la mesa', word: 'dos' },
  { caption: 'el simulacro', word: 'probarlo,' },
  { caption: 'la caza', word: 'buscar' },
] as const;

/** The bridge with V5: one strip that flows into the deputies. */
export const BRIDGE = {
  when: 'septiembre',
  host: 'ADM-WS-02',
  hostTail: 'sin aislar',
  nobody: ['nadie de guardia', 'podía autorizarlo'],
  now: 'ahora:',
  nowTail: 'suplentes que pueden aislar',
} as const;
