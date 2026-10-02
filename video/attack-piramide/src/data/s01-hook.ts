/**
 * s01-hook «Un árbol, dos mapas» — on-screen strings. The bridge with V3
 * (`video/diamond-e7/`): the E7 alert of 2026-03-05 02:13 UTC and the step back
 * to the morning of 2026-03-02.
 */

export const TITLE = { main: 'Del comando al TTP', attack: 'ATT&CK', pyramid: 'Pyramid of Pain' } as const;

export const PROMISE = { left: 'ponerle nombre a cada rama', right: 'elegir la detección que más le duele' } as const;

/** ATT&CK matrix sketch: this video's four tactics plus three greyed generic columns, in ATT&CK order. */
export const MATRIX_COLUMNS: { name: string; ours: boolean }[] = [
  { name: 'Initial Access', ours: false },
  { name: 'Execution', ours: true },
  { name: 'Persistence', ours: true },
  { name: 'Defense Evasion', ours: true },
  { name: 'Discovery', ours: false },
  { name: 'Lateral Movement', ours: false },
  { name: 'Command and Control', ours: true },
];

export const BRIDGE = {
  e7: 'E7',
  date: '05-03-2026 · 02:13 UTC',
  beacon: 'beacon a ',
  domain: 'update-svc-cdn.com',
  unknown: 'dominio desconocido',
  back: 'después de la alerta: ¿cómo empezó?',
  backDate: '02-03',
} as const;
