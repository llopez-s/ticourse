/** s01-hook «Los mismos aparatos» — on-screen strings and where things sit on the building art. */
import type { IconName } from '../../../engine/src/ui';
import type { VlanId } from './vlans';

export const ART = 'art/s01-hook-building.png';

/** «VLAN y 802.1Q», in two lines for the left column (the same break as the poster). */
export const TITLE = ['VLAN', 'y 802.1Q'] as const;

/** The promise, one chip per idea; each lights on the word of s01-02 that starts it (`nth` = which match). */
export const PROMISE: { text: string; word: string; nth: number; icon: IconName }[] = [
  { text: 'qué separan', word: 'qué', nth: 0, icon: 'split' },
  { text: 'cómo cruzan de planta', word: 'cómo', nth: 0, icon: 'layers' },
  { text: 'cómo vuelven a hablarse', word: 'cómo', nth: 1, icon: 'link' },
];

type Box = readonly [number, number, number, number];

/**
 * The three groups the voice names, with the VLAN whose colour they wear, the word of s01-01 that lights them and
 * their boxes on the art (image fractions u0, v0, u1, v1: upper floor first, then lower floor). `label` is where the
 * word sits (image fractions, bottom-centre of the pill).
 */
export const GROUPS: { text: string; word: string; vlan: VlanId; boxes: readonly [Box, Box]; label: { u: number; v: number } }[] = [
  {
    text: 'puestos',
    word: 'puestos',
    vlan: 10,
    boxes: [
      [0.53, 0.425, 0.755, 0.628],
      [0.526, 0.772, 0.755, 0.975],
    ],
    label: { u: 0.642, v: 0.418 },
  },
  {
    text: 'servidores',
    word: 'servidores',
    vlan: 20,
    boxes: [
      [0.776, 0.495, 0.85, 0.628],
      [0.776, 0.84, 0.85, 0.975],
    ],
    label: { u: 0.813, v: 0.488 },
  },
  {
    text: 'teléfonos',
    word: 'teléfonos',
    vlan: 30,
    boxes: [
      [0.882, 0.462, 0.985, 0.535],
      [0.882, 0.808, 0.985, 0.882],
    ],
    label: { u: 0.93, v: 0.455 },
  },
];

/** The network cabinet of each floor: «un conmutador por planta». */
export const SWITCHES: { box: Box; label: { u: number; v: number } }[] = [
  { box: [0.42, 0.383, 0.502, 0.62], label: { u: 0.461, v: 0.376 } },
  { box: [0.42, 0.728, 0.502, 0.968], label: { u: 0.461, v: 0.721 } },
];
export const SWITCH_LABEL = 'conmutador';
