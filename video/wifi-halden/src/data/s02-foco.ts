/**
 * s02-foco «Un foco que alumbra al vecino» — on-screen strings (canon: out/scene-brief.md «Canon»).
 *
 * The site survey of Monday 14-12 and what was done about it: Tuesday 15-12 two antennas lose
 * power and turn inwards, Wednesday 16-12 the second measurement. The voice only says «el martes»
 * and «el miércoles» and never the network's name: dates and HALDEN-OPS are on screen only.
 * The laptop's list has ONE row and nothing else: no other network, no MAC, no channel, no
 * address. A −55 dBm reading is a finding, not an incident. Minus signs are U+2212.
 */

/** The two exam names of the scene (violet). */
export const NAMES = { survey: 'SITE SURVEY', heat: 'HEAT MAP' } as const;

/** Places on the plan. */
export const PLACES = { terminal: 'terminal', park: ['aparcamiento', 'de visitantes'] } as const;

/** The test laptop's list of networks: its window title and its only row. */
export const SCAN = { host: 'ptl-pruebas-02', network: 'HALDEN-OPS', proto: 'WPA2', value: '−55 dBm' } as const;

/** What does not fix it (struck out, with the reason under it) and what does. */
export const FIXES = {
  hide: { text: 'ocultar el nombre (SSID)', why: ['se ve en cuanto', 'una tableta se conecta'] },
  longer: { text: 'una clave más larga', why: ['no baja la señal'] },
  works: 'colocación y potencia',
} as const;

/** «15-12 · martes · dos antenas: menos potencia, giradas hacia dentro» and «16-12 · miércoles · segunda medición». */
export const DATES = {
  adjust: { day: '15-12', weekday: 'martes', what: 'dos antenas: menos potencia, giradas hacia dentro' },
  remeasure: { day: '16-12', weekday: 'miércoles', what: 'segunda medición' },
} as const;

/** The two measurements in the visitors' car park. */
export const MEASURES = {
  first: { day: '14-12', value: '−55 dBm', bars: 3 },
  second: { day: '16-12', value: '−78 dBm', bars: 1 },
} as const;

/** The chapter's close: «se oye menos, pero se oye». Only the first letter is capitalised. */
export const STILL = ['Se oye menos,', 'pero se oye'] as const;
