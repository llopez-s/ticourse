import { C } from '../../../../../engine/src/theme/tokens';

/**
 * The shop's design space: 1000 × 540 units, drawn in elevation. Everything in parts/shop/* uses these
 * numbers, and `shopLayout(width)` (Shop.tsx) scales them to px for whoever overlays labels.
 */
export const SHOP_W = 1000;
export const SHOP_H = 540;

export const G = {
  /** Pavement line: where the feet of whoever is on the street stand. */
  ground: 492,
  /** Feet of whoever is inside (hidden behind the window's sill). */
  floor: 478,
  bld: { x: 30, y: 30, w: 770, h: 462 },
  sign: { x: 92, y: 54, w: 372, h: 52 },
  awning: { x: 60, y: 126, w: 664, h: 42 },
  /** The window's glass. */
  win: { x: 80, y: 186, w: 390, h: 254 },
  /** The door's opening (hinges on its right side). */
  door: { x: 520, y: 186, w: 180, h: 306 },
  /** The roller shutter fully down: it covers window and door. */
  shutter: { x: 66, y: 166, w: 648, h: 326 },
  alarm: { cx: 628, cy: 88, size: 82 },
  /** Where the camera's bracket leaves the wall, and its lens. */
  camera: { x: 800, y: 148, lens: { x: 812, y: 178 } },
  live: { x: 902, y: 232 },
  /** The recorder with yesterday's tape, on its shelf inside. */
  recorder: { x: 104, y: 262, w: 160, h: 92 },
  safe: { x: 378, y: 318, w: 88, h: 122 },
  suspect: { x: 316, h: 236 },
  guard: { x: 758, h: 250 },
  /** The other end of the walkie's channel (his boss: never drawn). */
  far: { x: 930, y: 64 },
  /** Where somebody coming from the street stops when the shutter is down. */
  stop: { x: 770 },
  street: { x: 905 },
} as const;

/** Palette (canon «Colour meanings»): steel = structure and people, cyan = looking, emerald = stopping, amber = risk. */
export const INK = {
  wall: '#15213a',
  wallHi: '#1b2b49',
  edge: '#475569',
  line: '#64748b',
  soft: '#334155',
  glass: '#0a1322',
  room: '#0e1a2f',
  steel: '#cbd5e1',
  body: '#7c8aa0',
  dark: '#1e293b',
  amberSoft: '#fcd34d',
  emeraldSoft: '#6ee7b7',
  cyan: C.cyan,
  amber: C.amber,
  emerald: C.emerald,
  ghost: '#64748b',
} as const;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);
