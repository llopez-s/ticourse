/**
 * s01-hook «Una clave para toda la terminal» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * Monday 14-12, the field review of the quarter's audit: two findings on the wifi of the crane
 * tablets. The voice never says the date nor the network's name («la red de las tabletas»), so both
 * are here, on screen only. No key, no channel, no address; the only year is 2022 (the key's).
 * Signal values carry a real minus sign (U+2212) and a space before the unit.
 */
import type { IconName } from '../../../engine/src/ui';

/** «14-12 · lunes · auditoría del trimestre · wifi de la terminal». */
export const STAMP = { day: '14-12', weekday: 'lunes', what: 'auditoría del trimestre', where: 'wifi de la terminal' } as const;

/** Finding 1: «la señal llega al aparcamiento de visitantes · −55 dBm». */
export const SIGNAL = { lines: ['la señal llega al', 'aparcamiento de visitantes'], value: '−55 dBm' } as const;

/** Finding 2: «HALDEN-OPS · WPA2 · una clave que sabe toda la terminal · sin cambiar desde 2022». */
export const SHARED_KEY = {
  network: 'HALDEN-OPS',
  proto: 'WPA2',
  lines: ['una clave que sabe', 'toda la terminal'],
  since: 'sin cambiar desde 2022',
} as const;

export const TITLE = 'WPA3';

/**
 * The promise (s01-02 «Verás hasta dónde llega la señal, qué se lleva quien la escucha y cómo dar a
 * cada uno su identidad»): three chips, each lit when the voice reaches `word`.
 */
export const PROMISE: { icon: IconName; text: string; word: string }[] = [
  { icon: 'radar', text: 'hasta dónde llega la señal', word: 'hasta' },
  { icon: 'record', text: 'qué se lleva quien la escucha', word: 'qué' },
  { icon: 'user', text: 'una identidad para cada uno', word: 'cómo' },
];

/** «SILENT PAGER · sección 4» with «cuenta con que tu SOC duerma» under it (rose; a label only). */
export const ADVERSARY = { name: 'SILENT PAGER', section: 'sección 4', line: 'cuenta con que tu SOC duerma' } as const;
