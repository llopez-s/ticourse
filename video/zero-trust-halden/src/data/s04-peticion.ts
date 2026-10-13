/**
 * s04-peticion «Una petición, paso a paso» — on-screen strings (canon: out/scene-brief.md, «Canon strings»,
 * s04). The simulator's header and stamp live with its drawing (parts/Sim.tsx → SIM_TEXT); the exam names
 * of the nave, CONTROL PLANE / DATA PLANE, PDP and IMPLICIT TRUST ZONE in parts/Warehouse.tsx →
 * WAREHOUSE_TEXT. Only two clock times exist in the video: 10:05 (here) and 03:00 (s05).
 */
import type { IconName } from '../../../engine/src/ui';

type Row = { text: string | readonly string[]; pre?: string; icon: IconName; mono?: boolean; rule?: boolean };

/** The policy Seguridad wrote: a card that is only read on screen. */
export const POLICY: { title: string; tag: string; rows: Row[] } = {
  title: 'política',
  /** Small and unexplained. */
  tag: 'policy-driven access control',
  rows: [
    { text: 'ERP', icon: 'database' },
    { text: 'perfil Operaciones', icon: 'users', rule: true },
    { text: 'portátil del puerto, cifrado y con EDR activo', icon: 'laptop' },
    { text: 'ubicación y hora habituales', icon: 'globe' },
    { text: 'lectura y escritura', icon: 'file', rule: true },
    { text: 'sesión de 30 min', icon: 'clock' },
  ],
};

/** Request 1: a test account that belongs to nobody, from the port's network. */
export const REQUEST: { title: string; rows: Row[] } = {
  title: 'petición 1',
  rows: [
    { text: 'cuenta de prueba', icon: 'user' },
    { text: 'perfil Operaciones', icon: 'users' },
    { text: ['portátil del puerto,', 'cifrado, EDR activo'], icon: 'laptop' },
    // «10:05» · «desde la red del puerto»: two fields on one row, the time in mono.
    { pre: '10:05', text: 'desde la red del puerto', icon: 'clock', rule: true },
  ],
};
/** Rows of REQUEST.rows the engine looks at, in the voice's order: «con cuenta, portátil y hora». */
export const REQUEST_SAID = { cuenta: [0, 1], portatil: [2], hora: [3] } as const;

/** The person plus the laptop. */
export const SUBJECT = { term: 'SUBJECT/SYSTEM', line: 'la persona y su portátil: los dos cuentan' } as const;

/** The lesson's five steps, lit one at a time. */
export const STEPS = [
  'la petición llega al PEP',
  'el PEP pregunta a la oficina',
  'el engine decide',
  'el administrator emite la orden: token de 30 min',
  'el tráfico va a una zona mínima',
] as const;

/** The engine's verdict: conditional, it is a simulation. */
export const VERDICT = 'diría que sí';

/** The printed order is the token. */
export const ORDER = { title: 'orden', token: 'token', mode: 'lectura y escritura', expiry: '30 min' } as const;

/** IMPLICIT TRUST ZONE (the name is the Warehouse's label). */
export const ZONE = {
  line: 'zona pequeña y delimitada: solo el ERP',
  small: 'confianza implícita solo dentro de esa zona, ya autorizada la petición',
} as const;

export const RESULT = ['concedido', 'lectura y escritura', '30 min'] as const;

/** The shelf's plate: the resource. */
export const RESOURCE = 'ERP';
