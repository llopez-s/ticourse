/**
 * Fictitious data for S06 "Alert fatigue" (Autoridad Portuaria de Halden).
 * Numbers reconcile with the narration and the lesson: 6.000 alerts a day,
 * 90 % = 5.400 closed unread, the three noisy rules = 78 % of the volume
 * (35 + 26 + 17), the long tail = 22 % = 1.320 (what S07 is left with after
 * excluding the three benign patterns).
 */

export const DAILY_ALERTS = 6000;
export const CLOSED_UNREAD_PCT = 90;
export const CLOSED_UNREAD = 5400;
export const TOP_SHARE_PCT = 78;
export const TAIL_SHARE_PCT = 22;

export interface QueueAlert {
  rule: string;
  host: string;
  sev: 'BAJA' | 'MEDIA';
}

/** The three noisy rules as they show up in the alert queue (same order as TOP_RULES). */
export const QUEUE_NOISY: readonly QueueAlert[] = [
  { rule: 'Barrido interno: muchos hosts', host: 'backup01', sev: 'MEDIA' },
  { rule: 'Escaneo de puertos interno', host: 'vulnscan01', sev: 'MEDIA' },
  { rule: 'Sesiones reiniciadas en lote', host: 'lb-web02', sev: 'BAJA' },
];

/** Everything else that trickles through the queue. */
export const QUEUE_TAIL: readonly QueueAlert[] = [
  { rule: 'Inicio de sesión fallido', host: '10.20.6.23', sev: 'BAJA' },
  { rule: 'Consulta DNS poco común', host: '10.20.3.54', sev: 'BAJA' },
  { rule: 'Cambio de configuración', host: 'fw-int01', sev: 'MEDIA' },
  { rule: 'Proceso poco habitual', host: '10.20.9.12', sev: 'BAJA' },
];

export interface TopRule {
  id: string;
  name: string;
  perDay: number;
  pct: number;
}

/** Pareto head: 2.100 + 1.560 + 1.020 = 4.680 = 78 % of 6.000. */
export const TOP_RULES: readonly TopRule[] = [
  { id: 'R-112', name: 'Agente de copias de seguridad', perDay: 2100, pct: 35 },
  { id: 'R-087', name: 'Escáner de vulnerabilidades corporativo', perDay: 1560, pct: 26 },
  { id: 'R-203', name: 'Balanceador que reinicia sesiones cada hora', perDay: 1020, pct: 17 },
];

/** Pareto tail: twelve other rules, 1.320 alerts a day in total (22 %). */
export const TAIL_RULES: readonly number[] = [230, 180, 150, 130, 115, 100, 90, 80, 70, 65, 60, 50];
