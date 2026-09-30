import { wordFrame } from '../../kit';

/**
 * Rough text metrics for layout decisions made before render (Inter / JetBrains
 * Mono, the engine fonts). Deliberately a little generous so that text sized
 * with `fitSize` never overflows its box. Shared by s04-caza and s05-huecos.
 */

const NARROW = new Set([...'iljtfr.,:;()·!|\'" ']);
const WIDE = new Set([...'mwMW']);

function charEm(ch: string): number {
  if (ch === ' ') return 0.28;
  if (NARROW.has(ch)) return 0.32;
  if (WIDE.has(ch)) return 0.86;
  if (/[0-9]/.test(ch)) return 0.6;
  if (/[A-ZÁÉÍÓÚÑ]/.test(ch)) return 0.7;
  return 0.57;
}

/** Estimated width in px of `text` at `size` px. */
export function textWidth(text: string, size: number, { mono = false, bold = true } = {}): number {
  let em = 0;
  for (const ch of text) em += mono ? 0.61 : charEm(ch);
  return em * size * (bold && !mono ? 1.02 : 1);
}

/** The largest size ≤ `max` at which `text` fits in `width` px. */
export function fitSize(text: string, width: number, max: number, opts?: { mono?: boolean; bold?: boolean }): number {
  const w = textWidth(text, max, opts);
  return w <= width ? max : Math.floor((max * width) / w);
}

/** wordFrame for a { seg, word, nth } reference. */
export function frameOf(scene: string, ref: { seg: string; word: string; nth?: number }): number {
  return wordFrame(scene, ref.seg, ref.word, ref.nth ?? 0);
}
