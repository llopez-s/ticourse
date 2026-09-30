import type { IconName } from '../../../engine/src/ui';

/**
 * s04-caza «Salir a buscar»: scene-only text (canon: out/scene-brief.md). The
 * voice never reads hosts or accounts: `svc_tosreport` and `ADM-WS-07` are on
 * screen only. `word` = the narration word a line lands on (segment, word, nth).
 */

export interface WordRef {
  seg: string;
  word: string;
  nth?: number;
}

/** s04-01: «que no suene nada no quiere decir que no haya nadie». */
export const SILENCE = {
  bell: { text: 'no suena nada', at: { seg: 's04-01', word: 'suene' } },
  notEqual: { seg: 's04-01', word: 'quiere' },
  nobody: { text: 'no hay nadie', at: { seg: 's04-01', word: 'haya' } },
} as const;

/** s04-02: the water meter, one note per beat of the sentence. */
export interface MeterNote {
  key: 'stain' | 'taps' | 'meter' | 'drip';
  text: string;
  at: WordRef;
}
export const METER_NOTES: MeterNote[] = [
  { key: 'stain', text: 'todavía sin mancha', at: { seg: 's04-02', word: 'mancha' } },
  { key: 'taps', text: 'grifos cerrados', at: { seg: 's04-02', word: 'grifos' } },
  { key: 'meter', text: 'el contador sigue girando', at: { seg: 's04-02', word: 'contador' } },
  { key: 'drip', text: 'algo gotea', at: { seg: 's04-02', word: 'gotea' } },
];
/** The taps close on «cierras»; the dial glows through «sigue girando». */
export const METER_WORDS = {
  close: { seg: 's04-02', word: 'cierras' },
  spinning: { seg: 's04-02', word: 'girando' },
} as const;

/** s04-03: the hypothesis card (exact canon text). */
export const HYPOTHESIS = {
  head: 'hipótesis',
  line1: 'si vuelve, se moverá como la otra vez',
  line2: 'de madrugada, con una cuenta de servicio',
  /** Spans of line2 lit as the voice says them. */
  marks: [
    { text: 'de madrugada', at: { seg: 's04-03', word: 'madrugada' } },
    { text: 'cuenta de servicio', at: { seg: 's04-03', word: 'cuenta' } },
  ],
  headAt: { seg: 's04-03', word: 'hipótesis' },
  line1At: { seg: 's04-03', word: 'vuelve' },
  line2At: { seg: 's04-03', word: 'madrugada' },
} as const;

/** The reference to the incident: «4-9 · 01:52 · svc_tosreport desde ADM-WS-07» (V5 / SIEM canon), in two lines. */
export const REFERENCE = {
  label: 'la otra vez',
  when: '4-9 · 01:52',
  account: 'svc_tosreport',
  from: 'desde',
  host: 'ADM-WS-07',
  at: { seg: 's04-03', word: 'vez' },
} as const;

/** Beside the query: what the alerts say about this hypothesis (the SOC still gets its usual alerts). */
export const ALERTS = {
  head: ['alertas para', 'esta hipótesis:'],
  zero: '0',
  ruleLabel: 'regla del SOC (25-09):',
  rule: ['logon de cuentas de servicio', 'desde estaciones'],
  fired: '0 disparos',
  at: { seg: 's04-03', word: 'avise' },
  /** «No esperas a la alarma»: the zeros pulse. */
  alarmAt: { seg: 's04-04', word: 'alarma' },
} as const;

/** s04-04: the query (exact canon text). */
export interface QueryRow {
  icon: IconName;
  text: string;
  at: WordRef;
}
export const QUERY = {
  head: 'consulta',
  date: '2026-10-13',
  rows: [
    { icon: 'archive', text: 'últimos 30 días (13-09 a 13-10)', at: { seg: 's04-04', word: 'treinta' } },
    { icon: 'key', text: 'logons de cuentas de servicio', at: { seg: 's04-04', word: 'cuentas' } },
    { icon: 'clock', text: 'de 00:00 a 06:00', at: { seg: 's04-04', word: 'horas' } },
    { icon: 'network', text: 'desde cualquier equipo: estaciones y servidores', at: { seg: 's04-04', word: 'cualquier' } },
  ] as QueryRow[],
  /** The 30 nights tick by while the search runs, from «cualquier» to «sales». */
  scanFrom: { seg: 's04-04', word: 'equipo' },
  scanTo: { seg: 's04-04', word: 'sales' },
  nights: 30,
} as const;

/** s04-04: the exam name, then the idea in Spanish. */
export const HUNT = {
  name: 'THREAT HUNTING',
  nameAt: { seg: 's04-04', word: 'threat' },
  tagline: 'sales tú de caza',
  taglineAt: { seg: 's04-04', word: 'sales' },
} as const;
