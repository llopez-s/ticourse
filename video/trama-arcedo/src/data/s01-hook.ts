/** s01-hook «Un clic, tres envoltorios» — on-screen strings. Addresses come from case.ts. */
import type { IconName } from '../../../engine/src/ui';
import { HOST, SERVER } from './case';

/** The title, split so «trama» and «segmento» wear their wrapper colours. */
export const TITLE = [
  { text: 'De la ', layer: null },
  { text: 'trama', layer: 'frame' },
  { text: ' al ', layer: null },
  { text: 'segmento', layer: 'segment' },
] as const;

/** The promise, one chip per idea; each lands on the word of s01-02 that starts it (`nth` = which match). */
export const PROMISE: { text: string; word: string; nth: number; icon: IconName }[] = [
  { text: 'qué envuelve a qué', word: 'qué', nth: 0, icon: 'layers' },
  { text: 'a quién va cada envoltorio', word: 'quién', nth: 0, icon: 'target' },
  { text: 'cuál cambia por el camino', word: 'cuál', nth: 0, icon: 'split' },
];

/** The two ends, as three lines each (label · where · address). */
export const LEFT_END = { icon: 'desktop' as IconName, lines: [HOST.label, HOST.vlan, HOST.cidr], mono: 2 };
export const RIGHT_END = { icon: 'server' as IconName, lines: [SERVER.label, SERVER.ip, SERVER.where], mono: 1 };
