/**
 * On-screen strings of s05-aguanta «Dónde corre y qué la rompe» (canon: out/scene-brief.md, s05).
 * No product names, no Pyramid of Pain drawing and no level names.
 */

/** Where each rule runs (s05-01, s05-02). */
export const WHERE = {
  yara: {
    title: 'YARA',
    runsOn: 'corre en:',
    places: ['escáner', 'sandbox', 'EDR', 'repositorio de muestras'],
  },
  sigma: {
    title: 'Sigma',
    runs: 'se traduce a la consulta de tu SIEM, y esa corre',
    rule: 'regla Sigma',
    query: 'consulta',
    siem: 'tu SIEM',
  },
} as const;

/** What breaks each one (s05-03, s05-04). */
export const BREAKS = {
  title: 'qué la rompe',
  rows: [
    { who: 'YARA', what: 'el programa deja de conservar esas piezas (otra compilación, otro empaquetado)' },
    { who: 'Sigma, por nombre original', what: 'otra herramienta' },
    { who: 'el filtro, por nombre', what: 'una copia con su nombre normal, en otra carpeta' },
  ],
} as const;

/** What each detection keys on (s05-05): three chips, no level names. */
export const LADDER = {
  chips: ['el nombre del disco', 'el nombre original', 'la cadena entera'],
  chainSub: 'explorer, PowerShell, tarea programada',
  limit: 'si cambia de herramienta, la regla del nombre original ya no ve',
} as const;

/** Chapter close (s05-06). */
export const CLOSE = {
  weak: 'cada una tiene su punto débil',
  loop: 'mide si dispara',
} as const;
