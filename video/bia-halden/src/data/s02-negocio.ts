/**
 * s02-negocio «Empiezas preguntando al negocio» — on-screen strings (canon: out/scene-brief.md «Canon strings» › s02).
 * Two process cards, each with two empty slots (s03 fills them) and a growing «cuánto duele cada hora parado» bar:
 * no figures, no euros. The slots stay empty here on purpose.
 */
import type { IconName } from '../../../engine/src/ui';

/** What the analyst asks, and what they do not ask (s02-01). */
export const ASK = { yes: 'el negocio', no: 'los servidores' } as const;

/** The name of the method (s02-01 «el business impact analysis, el BIA»). */
export const BIA = { short: 'BIA', long: 'business impact analysis' } as const;

export interface ProcessDef {
  id: 'bills' | 'board';
  /** The department that owns the process, drawn as a chip. */
  dept: string;
  /** The process, as the card names it. */
  name: string;
  icon: IconName;
  /** Cue that brings the card. */
  cue: string;
  /** How much each hour hurts, as a share of the bar (no figure is drawn). */
  pain: number;
  /** The order the BIA gives it: how much it holds (s02-05), as the chip says it. */
  holds: string;
}

export const PROCESSES: ProcessDef[] = [
  { id: 'bills', dept: 'Facturación', name: 'Emitir facturas a las navieras', icon: 'file', cue: 'proc-bills', pain: 0.58, holds: 'aguanta más' },
  { id: 'board', dept: 'Operaciones', name: 'Seguir llegadas y salidas de buques', icon: 'radar', cue: 'proc-board', pain: 0.82, holds: 'aguanta menos' },
];

/** The two slots under each process: `word` (in s02-03) is when the voice asks for it. */
export const SLOTS = [
  { label: 'cuánto puede estar parado', word: 'parado' },
  { label: 'cuántos datos puede perder', word: 'datos' },
] as const;

export const PAIN_LABEL = 'cuánto duele cada hora parado';

/** What the intercepted message writes into the first slot, and what it costs (s02-04). */
export const ZERO = 'cero minutos';
export const CAPACITY = 'más capacidad';
