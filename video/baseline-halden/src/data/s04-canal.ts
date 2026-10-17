/** s04-canal «Cada aparato, su mando» — on-screen strings (canon: out/scene-brief.md). */

/** The principle, said in s04-01, and its name. */
export const PRINCIPLE = 'quitar lo que sobra · proteger lo que queda';
export const HARDENING = 'Hardening';

export type SlotArt = 'laptop' | 'phone' | 'cloud' | 'bridge';

export interface Slot {
  art: SlotArt;
  name: string;
  cue: string;
  /** The channel the baseline goes through (sky), or «sin mando» (amber) for the drawbridge. */
  channel: string;
  /** The main measure, one entry per line (emerald, bold). */
  main: readonly string[];
  /** Measures shown half-lit (not said). */
  aside?: string;
}

export const SLOTS: readonly Slot[] = [
  { art: 'laptop', name: 'portátil del dominio', cue: 'laptop', channel: 'Group Policy', main: ['usuaria sin derechos', 'de admin'], aside: 'disco cifrado · EDR' },
  { art: 'phone', name: 'móvil de empresa', cue: 'phone', channel: 'MDM', main: ['cifrado · bloqueo', 'borrado a distancia'] },
  { art: 'cloud', name: 'nube', cue: 'cloud', channel: 'consola', main: ['permisos mínimos', 'registros activos', 'nada público'] },
  { art: 'bridge', name: 'puente levadizo', cue: 'no-remote', channel: 'sin mando', main: [] },
];

export const LIVING_ROOM = 'en el salón';

/** The rule in plain words (s04-05), two lines. */
export const RULE = ['si admite una consola de gestión,', 'el baseline se impone desde ahí'] as const;
