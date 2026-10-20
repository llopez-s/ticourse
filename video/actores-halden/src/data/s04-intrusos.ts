/** s04-intrusos «Un ladrón y un micrófono» — on-screen strings (canon: out/scene-brief.md). No figures, no crypto. */

export const CASE = 'Imagina dos intrusos · caso de ejemplo · sin fecha';

/** In both toolkits; the voice only names it in question 2. */
export const TOOLS = 'fallos que nadie conocía · zero-day';

/** The first intruder: an office with no name. */
export const OFFICE = {
  label: 'una oficina',
  hours: 'en horas',
  stamp: 'cifrado',
  note: ['o pagáis,', 'o no recuperáis nada'],
  chip: 'ransomware',
} as const;

/** The second intruder: the port's network, unnamed. */
export const NETWORK = {
  label: 'la red del puerto',
  year: 'más de un año dentro',
  reports: 'informes para el Gobierno',
  quiet: 'no pide nada · no rompe nada',
} as const;

/** The names, with their motives. */
export const NAMES = [
  { name: 'Organized crime', chips: ['financial gain', 'blackmail'], also: null },
  { name: 'Nation-state', chips: ['APT', 'espionage'], also: 'también: service disruption · war' },
] as const;
