/** s04-sinparche «Lo que no tiene parche» — on-screen strings (storyboard.json, ficha V18). */
import { CAM_NVR02 } from './findings';

export const CARD = {
  ...CAM_NVR02,
  chips: ['firmware sin soporte', 'el fabricante no publica parche'],
} as const;

/** The four options, in order. Exam terms are written in English next to the Spanish word the voice says. */
export const OPTIONS: readonly { key: 'patch' | 'insurance' | 'isolate' | 'exception'; main: string; terms: readonly string[] }[] = [
  { key: 'patch', main: 'parchear', terms: [] },
  { key: 'insurance', main: 'seguro', terms: ['insurance'] },
  { key: 'isolate', main: 'aislar y compensar', terms: ['segmentation', 'compensating controls'] },
  { key: 'exception', main: 'excepción', terms: [] },
];

/** Beside the crossed-out insurance (after the message). */
export const INSURANCE_SEAL = {
  stamp: 'seguro · insurance',
  line1: 'transfiere el coste',
  line2: 'el fallo sigue igual de explotable',
} as const;

/** Over the hull (s04-04). */
export const HULL_LABELS = {
  bulkheads: { main: 'mamparos', sub: 'aislar' },
  pumps: { main: 'bombas de achique', sub: 'alertas reforzadas' },
} as const;

/** The exception record (s04-05/06): filled field by field. */
export const RECORD = {
  title: 'Excepción · registro',
  rows: [
    { key: 'what', label: 'Qué', value: 'grabador de las cámaras · firmware sin soporte' },
    { key: 'why', label: 'Por qué', value: 'el fabricante no publica parche' },
    { key: 'owner', label: 'Dueño', value: 'director de operaciones', note: 'quien manda en el negocio, no quien lo encontró' },
    { key: 'controls', label: 'Controles', value: 'aislado · acceso solo desde un equipo autorizado · alertas reforzadas' },
    { key: 'expiry', label: 'Caduca', value: '1-04-2027' },
    { key: 'review', label: 'Revisión', value: 'cada 90 días' },
  ],
} as const;
