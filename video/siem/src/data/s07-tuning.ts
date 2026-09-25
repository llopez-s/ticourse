/**
 * Fictitious data for S07 "Alert tuning" (Autoridad Portuaria de Halden).
 * Queue numbers reconcile with S06 and the lesson: 6.000 / día, minus the three
 * benign patterns (78 % = 4.680) leaves 1.320, and deduplicating + grouping
 * related events leaves 400 / día.
 */

export const QUEUE_BEFORE = 6000;
export const QUEUE_AFTER_EXCLUDE = 1320;
export const QUEUE_AFTER_DEDUP = 400;

/** The rule being tuned: the one the backup agent keeps firing (R-112 in S06). */
export const RULE = {
  id: 'R-112',
  name: 'Barrido interno',
  condition: [
    [
      { t: 'si       ', kw: true },
      { t: 'un origen conecta con más de 50 hosts', kw: false },
    ],
    [
      { t: 'en       ', kw: true },
      { t: '10 minutos', kw: false },
    ],
    [
      { t: 'entonces ', kw: true },
      { t: 'alerta MEDIA', kw: false },
    ],
  ],
} as const;

/** The precise exclusion added for the known benign pattern. */
export const GOOD_EXCLUSION = {
  title: 'excluir: agente de copias',
  detail: 'host backup01 · 01:00-03:00',
} as const;

/** The over-broad exclusion that blinds the rule. */
export const BROAD_EXCLUSION = {
  title: 'excluir: todo 10.20.0.0/16',
  detail: 'toda la red interna',
} as const;

export interface ExclusionRecord {
  id: string;
  pattern: string;
  fields: { label: string; value: string }[];
}

/** One documented exclusion per noisy pattern (front card = the backup agent). */
export const EXCLUSION_RECORDS: readonly ExclusionRecord[] = [
  {
    id: 'EXC-01',
    pattern: 'Agente de copias de seguridad',
    fields: [
      { label: 'Qué', value: 'backup01 · 01:00-03:00' },
      { label: 'Por qué', value: 'copia nocturna programada' },
      { label: 'Quién la aprobó', value: 'R. Salas · jefe de sistemas' },
      { label: 'Revisión', value: 'cada 90 días' },
    ],
  },
  {
    id: 'EXC-02',
    pattern: 'Escáner de vulnerabilidades corporativo',
    fields: [],
  },
  {
    id: 'EXC-03',
    pattern: 'Balanceador: reinicio horario de sesiones',
    fields: [],
  },
];
