/**
 * s05-contexto «Otro país, las tres de la madrugada» — on-screen strings (canon: out/scene-brief.md,
 * «Canon strings», s05). The simulator's header and stamp are in parts/Sim.tsx; the nave's names, «orden»
 * and «anulada» in parts/Warehouse.tsx.
 *
 * Times: the only clock time written here is 03:00. Everything after it is relative («10 min», «30 min»):
 * never a derived time. The only date besides the pilot's 11-12 is the future 30-11. The second factor is
 * a requirement inside the simulator — never a phone, a code or a login page — and nothing here «ya
 * funciona».
 */
import type { IconName } from '../../../engine/src/ui';
import type { SimTone } from '../scenes/parts/Sim';

type Row = { text: string; icon: IconName; mono?: boolean; tone?: SimTone };

/** Request 2: the same test account and laptop; what changes is where and when. */
export const REQUEST2: { title: string; same: Row[]; odd: Row[] } = {
  title: 'petición 2',
  same: [
    { text: 'misma cuenta', icon: 'user' },
    { text: 'mismo portátil', icon: 'laptop' },
  ],
  odd: [
    { text: 'otro país', icon: 'globe', tone: 'amber' },
    { text: '03:00', icon: 'clock', mono: true, tone: 'amber' },
  ],
};

/** `step-up`: a requirement of the engine, plus the port's plan (future). */
export const STEP_UP = {
  line: 'el engine pide un segundo factor',
  note: 'el proveedor de identidad lo pedirá desde el 30-11',
} as const;

export const ADAPTIVE = { term: 'ADAPTIVE IDENTITY', line: 'la exigencia sube o baja según el contexto' } as const;

/** `readonly`: what the engine would grant once the second factor is passed. */
export const READ_ONLY = ['solo lectura', '30 min'] as const;

/** `event`: a test event, ten minutes into the session. */
export const EVENT = { head: ['evento de prueba', 'a los 10 min'], line: 'EDR: malware en el portátil' } as const;

/** The think prompt's two buttons; nothing on the page answers it. */
export const OPTIONS = { pep: 'PEP', administrator: 'administrator' } as const;

/** The answer, in the order the voice gives it. */
export const REVOKE = ['el engine ve el aviso y decide cerrar', 'el administrator revoca la sesión', 'el PEP la corta'] as const;
export const CLOSED = ['sesión cerrada', '10 min'] as const;

export const SCOPE = { term: 'THREAT SCOPE REDUCTION', chips: ['solo lectura', '30 min', 'solo el ERP'] } as const;

/** «siguiente paso · piloto con el ERP de pruebas · Seguridad · 11-12». */
export const PILOT = { label: 'siguiente paso', what: 'piloto con el ERP de pruebas', owner: 'Seguridad', day: '11-12' } as const;
