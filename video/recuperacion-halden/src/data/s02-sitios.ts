/**
 * s02-sitios «Un teatro de reserva» — on-screen strings (canon: out/scene-brief.md «Canon strings» › s02).
 * The three theatres are what each service WOULD need, never sites the port has. No distance, no figure, no price.
 */
import type { TheatreKind } from '../scenes/parts/Theatre';

export interface SiteDef {
  kind: TheatreKind;
  cue: string;
  /** Exam term (violet). */
  label: string;
  /** What is ready. */
  sub: string;
  /** How long until you carry on. */
  meta: string;
  /** Cost row (amber), on `price`. */
  cost: string;
  /** Amber pips of the cost meter (a drawing, not a figure). */
  pips: number;
  /** The nameless service row that would fit this theatre. */
  service: string;
}

export const SITES: readonly SiteDef[] = [
  {
    kind: 'hot',
    cue: 'hot',
    label: 'HOT SITE',
    sub: 'todo encendido · datos al día',
    meta: 'minutos',
    cost: 'el más caro',
    pips: 3,
    service: 'no puede parar',
  },
  {
    kind: 'warm',
    cue: 'warm',
    label: 'WARM SITE',
    sub: 'máquinas y red listas · datos por restaurar',
    meta: 'horas o un día',
    cost: 'medio',
    pips: 2,
    service: 'aguanta una jornada',
  },
  {
    kind: 'cold',
    cue: 'cold',
    label: 'COLD SITE',
    sub: 'energía y red · nada más',
    meta: 'días o semanas',
    cost: 'el más barato',
    pips: 1,
    service: 'aguanta semanas',
  },
];

/** Over the cost row (the voice: «Los tres se pagan todo el año»). */
export const YEARLY = 'se paga todo el año';

/** Fixed label over the three service rows. */
export const SERVICES_LABEL = 'lo que necesitaría cada servicio · propuesta';

/** The map: the data centre and, right by it, the reserve theatre. */
export const MAP = { dc: 'CPD', near: 'en la misma calle', term: 'GEOGRAPHIC DISPERSION' } as const;
