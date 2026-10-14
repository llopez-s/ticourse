import { enterFramesFor, sceneTiming } from '../../../../../engine/src/timeline/load';
import { TIMELINE } from '../../../timeline/load';

/**
 * The plan of s02, seen from above, in stage units (1728 × 660) at its final place. The terminal
 * is a plot of land with the quay along its bottom edge; to its right a street and, across it,
 * the visitors' car park. Its outline is a painted line on a plan: no fence, gate, booth or barrier.
 */
export const PLOT = { x0: 16, y0: 172, x1: 716, y1: 600 } as const;
export const WATER = { y0: PLOT.y1, y1: 656 } as const;
export const ROAD = { x0: PLOT.x1, x1: 806 } as const;
export const PARK = { x0: 806, y0: 322, x1: 1076, y1: 600 } as const;
/** Right edge of everything the plan draws. */
export const PLAN_W = PARK.x1;

/** Container stacks in the yard: [x, y, w, h]. */
export const YARD: [number, number, number, number][] = [
  [56, 330, 190, 64],
  [56, 408, 190, 64],
  [290, 330, 190, 64],
  [290, 408, 190, 64],
];
/** The quay cranes, straddling the quay's edge: x of each gantry's centre. */
export const CRANES = [170, 410] as const;
export const BUILDING = { x: 566, y: 190, w: 134, h: 66 } as const;

/** Access points inside the terminal: omnidirectional coverage of radius `r`. */
export const INNER = [
  { x: 240, y: 300, r: 150 },
  { x: 462, y: 262, r: 140 },
  { x: 410, y: 528, r: 150 },
  { x: 170, y: 528, r: 150 },
] as const;

/** Head size of the floodlight on the plan (FloodlightGlyph `h`). */
export const LAMP_H = 66;

/**
 * The two antennas next to the boundary, each with a lobe that points out of the terminal: the
 * first one reaches the car park, the second one only the street (their outlines never cross).
 * `out` is the lobe as surveyed on 14-12; `inward` after Tuesday's adjustment (less power, turned in).
 * Angles in degrees, 0 = right (towards the car park), negative = counter-clockwise on screen.
 * The first one carries the floodlight.
 */
export const ANTENNAS = [
  { x: 630, y: 430, r: 110, spread: 13, out: { angle: 0, reach: 388 }, inward: { angle: -150, reach: 250 } },
  { x: 630, y: 556, r: 96, spread: 12, out: { angle: 0, reach: 172 }, inward: { angle: -156, reach: 150 } },
] as const;

/** Where the test laptop stands in the car park. */
export const LAPTOP = { x: 946, y: 456, h: 76 } as const;
/** Where the crane tablet of s02-03 shows up, and the access point it joins. */
export const TABLET = { x: 318, y: 552, h: 84, ap: 2 } as const;

/** The survey walk, as waypoints. */
export const WALK: [number, number][] = [
  [60, 270],
  [540, 270],
  [540, 500],
  [60, 500],
];

/** Length of the walk and the point at fraction `t` of it. */
export function walkLength(): number {
  let len = 0;
  for (let i = 1; i < WALK.length; i++) len += Math.hypot(WALK[i][0] - WALK[i - 1][0], WALK[i][1] - WALK[i - 1][1]);
  return len;
}

export function walkPoint(t: number): { x: number; y: number } {
  let left = Math.max(0, Math.min(1, t)) * walkLength();
  for (let i = 1; i < WALK.length; i++) {
    const [ax, ay] = WALK[i - 1];
    const [bx, by] = WALK[i];
    const seg = Math.hypot(bx - ax, by - ay);
    if (left <= seg) return { x: ax + ((bx - ax) * left) / seg, y: ay + ((by - ay) * left) / seg };
    left -= seg;
  }
  const [x, y] = WALK[WALK.length - 1];
  return { x, y };
}

/** Fraction of the walk at which it passes closest to (x, y): when that spot gets measured. */
export function walkNearest(x: number, y: number): number {
  let best = 0;
  let bestD = Number.POSITIVE_INFINITY;
  for (let i = 0; i <= 100; i++) {
    const p = walkPoint(i / 100);
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bestD) {
      bestD = d;
      best = i / 100;
    }
  }
  return best;
}

/**
 * The floodlight's cone and the antenna's lobe are ONE shape: half-width of FloodlightGlyph's beam
 * at distance `d` from its pivot (head height `h`, half-angle `spread`), in caller units.
 */
export function coneHalfWidth(d: number, spread: number, h = LAMP_H): number {
  const s = h / 44;
  return 18 * s + Math.tan((spread * Math.PI) / 180) * Math.max(0, d - 26 * s);
}

/**
 * Local frame at which this scene's exam card arrives (null when it has none): re-derived from the
 * timeline like kit.tsx's wordFrame, so it follows the real voice.
 */
export function examFrame(sceneId: string): number | null {
  const exam = TIMELINE.exam.find((e) => e.scene === sceneId);
  if (!exam) return null;
  return exam.from - (sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId));
}
