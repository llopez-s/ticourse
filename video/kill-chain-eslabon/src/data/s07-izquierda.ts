/**
 * s07-izquierda «Enterarte tarde» — on-screen strings (canon: out/scene-brief.md «Canon»). Nobody at Meridian cuts
 * anything here: the row is the general rule, drawn with the house's phases; «llegas tarde» is no reproach.
 */
import type { IconName } from '../../../engine/src/ui';

export const LATE = 'te enteras cuando ya está con los planos';
export const DONE = 'ya hechas, sin que lo vieras';
export const SEE_FIRST = { main: 'para saltar antes, hay que ver antes', sub: 'registros del correo · del equipo' } as const;
export const SAVED = 'cada paso que paras de verdad te ahorra los siguientes';
export const LANGUAGE = { bubble: 'lo paramos en Delivery', sub: 'cuatro palabras que dicen mucho' } as const;

/** Phases that get an alarm after `shift`, left to right, and the source each one sits on. */
export const ALARM_SOURCES: readonly { slot: number; icon: IconName; label: string; mail?: boolean }[] = [
  { slot: 2, icon: 'mail', label: 'correo', mail: true },
  { slot: 3, icon: 'desktop', label: 'equipo' },
  { slot: 4, icon: 'desktop', label: 'equipo' },
  { slot: 5, icon: 'desktop', label: 'equipo' },
];
/** Slot index of Actions on Objectives (where every alarm starts) and of Delivery (where the cut holds). */
export const AOO_SLOT = 6;
export const CUT_SLOT = 2;
