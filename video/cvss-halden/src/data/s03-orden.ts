/** s03-orden «¿Y ahora, cuál?» — on-screen strings (storyboard.json, ficha V18). */
import { SRV_MSG01, SRV_MSG02 } from './findings';

export const HEADS = [
  { host: SRV_MSG01.host, score: SRV_MSG01.score },
  { host: SRV_MSG02.host, score: SRV_MSG02.score },
] as const;

export const CAPACITY = 'esta semana cabe: 1';

export const ADVERSARY = { name: 'SILENT PAGER', says: 'cuenta con que tu SOC duerma' } as const;

export const COIN = 'una moneda';

/** The four questions, in the order the voice asks them. Equal answers span both columns; the odd one splits. */
export interface Question {
  key: 'reach' | 'exploit' | 'front' | 'impact';
  q: string;
  /** Two answers (one per server) or one shared answer. */
  a: readonly [string, string] | string;
  /** Small note under a shared answer. */
  note?: string;
}

export const QUESTIONS: readonly Question[] = [
  { key: 'reach', q: '¿Se llega?', a: ['sí · desde cualquier puesto de la red interna', 'solo desde el propio equipo'] },
  { key: 'exploit', q: '¿Hay exploit?', a: 'público desde hace 9 días', note: 'del fallo, no del servidor' },
  { key: 'front', q: '¿Hay algo delante?', a: 'nada' },
  { key: 'impact', q: '¿Qué se para si cae?', a: 'el intercambio de mensajes entre las aplicaciones del puerto' },
];

export const RESULT = {
  p1: { big: 'P1 · parche hoy', sub: 'ventana de emergencia (24 h)' },
  p3: { big: 'P3 · ciclo mensual', sub: '' },
} as const;

export const NOTE = 'Sistemas · parche en srv-msg01 · hoy · 18:00';
