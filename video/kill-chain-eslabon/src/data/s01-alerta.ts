/**
 * s01-alerta «Una llamada que nadie esperaba» — on-screen strings (canon: out/scene-brief.md «Canon»). The alert card
 * itself lives in `data/alert.ts` (shared with s08). The voice never reads the time, the host or the domain.
 */
import type { IconName } from '../../../engine/src/ui';

export const TITLE = { main: 'La Cyber Kill Chain', sub: 'basta con romper un eslabón' } as const;

/** The promise (s01-03), one chip per thing the voice names; `word` is where the chip lands. */
export const PROMISE: readonly { text: string; word: string; icon: IconName }[] = [
  { text: 'leer cada fase en las pruebas', word: 'leas', icon: 'file' },
  { text: 'separar lo que ves de lo que deduces', word: 'separes', icon: 'eye' },
  { text: 'decidir dónde cortar', word: 'decidas', icon: 'link' },
];

/** Context strip (s01-04): who you are. */
export const CONTEXT = { org: 'Meridian Dynamics', sector: 'aeroespacial', you: 'tú, su analista de inteligencia' } as const;

/**
 * The calendar of `back` (s01-05), oldest first; checked in `revision-gcti.md`. The alert day is the last one;
 * the highlight walks back from it to Monday 02-03.
 */
export const CALENDAR: readonly { weekday: string; date: string }[] = [
  { weekday: 'lunes', date: '02-03' },
  { weekday: 'martes', date: '03-03' },
  { weekday: 'miércoles', date: '04-03' },
  { weekday: 'jueves', date: '05-03' },
];
