import type { WhyStepDef } from '../scenes/parts/s08-rca/WhyChain';

/** s09-plan «El hueco del plan»: scene-only text (canon: out/scene-brief.md). */

/** RCA chain 2 (exact canon text). It ends in Preparación. The night shift is never blamed: no step is rose but the plan's. */
export const CHAIN2: WhyStepDef[] = [
  { lines: ['siguió dentro horas'], icon: 'clock' },
  { lines: ['contención cerrada con dos equipos de tres'], icon: 'lock' },
  { lines: [['nadie de guardia podía aislar ', { text: 'ADM-WS-02', mono: true }]], icon: 'users' },
  { lines: ['el plan no tenía suplentes'], icon: 'file' },
];

export const CHAIN2_TAGS = {
  night: 'aquella noche',
  cause: 'la causa de fondo',
  before: 'mucho antes del ataque',
} as const;

/** The improvements of the closing meeting: each with owner and date (on screen only; the voice does not read them). */
export interface Improvement {
  text: string;
  owner: string;
  date: string;
}
export const IMPROVEMENTS: Improvement[] = [
  { text: 'suplentes con permiso para aislar', owner: 'Seguridad', date: '30-09' },
  { text: 'las excepciones caducan solas', owner: 'Sistemas', date: '18-09' },
  { text: 'cuentas de servicio en gestor de contraseñas con rotación', owner: 'Sistemas', date: '31-10' },
  { text: 'DMARC en reject', owner: 'Correo', date: '25-09' },
  { text: 'alerta de logon de cuentas de servicio desde estaciones', owner: 'SOC', date: '25-09' },
  { text: 'agente de seguridad en todas las estaciones de administración', owner: 'Sistemas', date: '15-10' },
];

export const LIST_TEXT = {
  title: 'Mejoras de la reunión',
  owner: 'responsable',
  date: 'fecha',
  /** «Si le falta alguno de los dos, esa mejora no existe»: a row with neither, which fades away. */
  ghost: 'una mejora sin responsable ni fecha',
  ghostTag: 'no existe',
  /** Over Preparación once the improvements have landed. */
  landed: '6 mejoras, con responsable y fecha',
} as const;

/** s09-05. */
export const BETTER = 'el puerto sale mejor de lo que entró';

/** s09-06: the exam term. */
export const LL_TERM = { label: 'en el examen, esta fase se llama', en: 'lessons learned' } as const;
