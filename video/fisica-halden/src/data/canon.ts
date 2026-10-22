/**
 * On-screen strings shared by several scenes (the brief's «Canon»). Exam terms stay in English; everything else is
 * Spanish. No names, dates, hosts, files or people: the floor plan is an example «sobre el papel».
 */

/** The proposal stamp (s01, s06). */
export const STAMP = ['Autoridad Portuaria de Halden', 'lo que Seguridad pediría a cualquier entrada', 'propuesta · sin fecha'] as const;

/** The floor plan's label, in two lines (every time the plan is the main image). */
export const PLAN_LABEL = ['plano de ejemplo · sobre el papel', 'no es un edificio del puerto'] as const;

export const TITLE = ['Quién entra,', 'qué se mueve', 'y quién pica'] as const;
export const PLAQUE = 'SY0-701 · 1.2';

/** Drawn by the question scenes: the engine's panel only prints «EXAMEN · SY0-701 · 1.2». */
export const QUESTION_TAG = 'pregunta tipo examen · ejemplo';

/** s04: the four sensors, each with what it measures and where it fails (amber). */
export type SensorKind = 'infrared' | 'pressure' | 'microwave' | 'ultrasonic';
export const SENSORS: readonly { kind: SensorKind; term: string; does: string; fails: string; tag: readonly [string, string] }[] = [
  {
    kind: 'infrared',
    term: 'infrared',
    does: 'nota el calor de una persona',
    fails: 'se confunde con el sol, la calefacción y los animales',
    tag: ['sol, calefacción', 'y animales'],
  },
  { kind: 'pressure', term: 'pressure', does: 'pesa', fails: 'solo cubre el suelo que pisas', tag: ['solo cubre', 'donde pisas'] },
  {
    kind: 'microwave',
    term: 'microwave',
    does: 'eco de radio · cubre mucho',
    fails: 'atraviesa tabiques finos',
    tag: ['atraviesa', 'tabiques finos'],
  },
  {
    kind: 'ultrasonic',
    term: 'ultrasonic',
    does: 'eco de sonido · cuarto pequeño y cerrado · no pasa las paredes',
    fails: 'las corrientes de aire lo confunden',
    tag: ['corrientes', 'de aire'],
  },
];

/** s06: the four decoys, each with its idea (said first) and then its name. */
export type DecoyKind = 'honeypot' | 'honeynet' | 'honeyfile' | 'honeytoken';
export const DECOYS: readonly { kind: DecoyKind; term: string; idea: readonly string[] }[] = [
  { kind: 'honeypot', term: 'honeypot', idea: ['un sistema que', 'no sirve a nadie'] },
  { kind: 'honeynet', term: 'honeynet', idea: ['varios que se', 'hablan entre sí'] },
  { kind: 'honeyfile', term: 'honeyfile', idea: ['un fichero con un', 'nombre irresistible'] },
  { kind: 'honeytoken', term: 'honeytoken', idea: ['un dato que no existe:', 'una cuenta, una clave,', 'un registro'] },
];
