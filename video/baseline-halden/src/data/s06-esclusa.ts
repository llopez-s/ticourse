/** s06-esclusa «Lo que no se puede parar» — on-screen strings (canon: out/scene-brief.md). */
import type { IconName } from '../../../engine/src/ui';

export const STAMP = { what: 'Las esclusas', kind: 'caso de ejemplo · sin fecha' } as const;

/** Why not, in the voice's order (s06-02), each lit on its word. */
export const WHY_NOT: { text: string; word: string; icon: IconName }[] = [
  { text: 'se para una vez al año', word: 'paran', icon: 'clock' },
  { text: 'no aguanta un agente', word: 'aguantan', icon: 'x' },
  { text: 'el fabricante solo responde de una versión', word: 'fabricante', icon: 'file' },
];

export const STILL = 'sin parche en caliente · sin agente';
export const OT = 'OT';
export const SAME = 'lo mismo: embedded · RTOS';

export const PROPOSAL = 'propuesta · sin fecha';
/** What it takes meanwhile (s06-04), each lit on its word. */
export const COMPENSATE: { text: string; word: string; icon: IconName }[] = [
  { text: 'que solo le hable quien lo necesita', word: 'solo', icon: 'users' },
  { text: 'escuchar su tráfico sin tocarlo', word: 'escuchar', icon: 'eye' },
];
export const COMPENSATING = 'Compensating controls';

/** The plane's three captions. */
export const PLANE = { hangar: 'hangar', flight: 'en vuelo no se toca', radar: 'radar' } as const;

/** The inverse trap, half-lit (s06-06). */
export const INVERSE = ['¿desconectarlas del todo?', 'no, si tienen que seguir conectadas'] as const;
