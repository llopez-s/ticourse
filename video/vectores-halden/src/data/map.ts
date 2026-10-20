/**
 * The entry map of the reception (canon: out/scene-brief.md), shared by s02, s04 and s06: the same five lines, the
 * same labels and the same exam chips everywhere. Order = the storyboard's list (index 0–4).
 */
import type { IconName } from '../../../engine/src/ui';

export type EntryAnchor = 'mail' | 'phone' | 'usb' | 'printer' | 'updates';

export interface Entry {
  /** What it is, in plain words (≥ 32 px). */
  title: string;
  /** Optional second line. */
  sub?: string;
  /** The exam name, in English, on its chip. */
  chip: string;
  icon: IconName | 'phone';
  anchor: EntryAnchor;
}

export const ENTRIES: readonly Entry[] = [
  { title: 'correo de recepción', chip: 'Message-based', icon: 'mail', anchor: 'mail' },
  { title: 'teléfono', chip: 'Voice call', icon: 'phone', anchor: 'phone' },
  { title: 'USB', sub: 'de los dos ordenadores', chip: 'Removable device', icon: 'plug', anchor: 'usb' },
  { title: 'panel de la impresora', sub: 'nadie lo usa', chip: 'Open service port', icon: 'gear', anchor: 'printer' },
  { title: 'actualizaciones', sub: 'del programa de visitas', chip: 'Supply chain', icon: 'layers', anchor: 'updates' },
];

/** Index of each line, by what it is. */
export const MAIL = 0;
export const PHONE = 1;
export const USB = 2;
export const PRINTER = 3;
export const UPDATES = 4;

/** The sheet's own heading (Systems draws it). */
export const SHEET_TITLE = 'entradas de la recepción · Sistemas';
