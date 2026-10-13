/** s01-hook «Una cola, un solo parche» — on-screen strings (storyboard.json, ficha V18). */
import type { IconName } from '../../../engine/src/ui';
import { CAM_NVR02, SRV_MSG01, SRV_MSG02 } from './findings';

/** The monthly scan's report line (the scan that runs every 1st, credentialed). */
export const REPORT = {
  day: 'jueves 1-10',
  time: '09:00',
  what: 'informe de escaneo mensual',
  mode: 'credentialed',
} as const;

export const QUEUE_TITLE = 'Cola del SOC';

/** The three red rows: host and score only (the voice names «tres filas rojas»). */
export const ROWS = [SRV_MSG01, SRV_MSG02, CAM_NVR02].map((f) => ({ host: f.host, score: f.score, sev: f.sev }));

/** The week's capacity (s01-01 «esta semana solo cabe un parche»). */
export const CAPACITY = { label: 'esta semana cabe:', value: '1 parche' } as const;

export const TITLE = 'Qué se arregla primero';

/** The promise (s01-02), one chip per idea, lit on the word that names it. */
export const PROMISE: { text: string; word: string; icon: IconName }[] = [
  { text: 'el número y el contexto', word: 'decide', icon: 'chart' },
  { text: 'lo que no tiene parche', word: 'tiene', icon: 'plug' },
  { text: 'cerrar con prueba', word: 'cerrado', icon: 'check' },
];
