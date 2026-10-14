/**
 * Where the whole shop sits on the stage (stage-local px: left, top, width; height = 0.54 × width).
 * s02 ends in `full` and s03 starts there, so the cut between them does not jump.
 */
export interface ShopPose {
  x: number;
  y: number;
  w: number;
}

export const SHOP_POSE = {
  /** s02: the shop in the middle of the stage, a column of text on each side. */
  full: { x: 434, y: 34, w: 860 },
  /** s03 while the intercepted message is up: low and left, everything under the card. */
  card: { x: 0, y: 222, w: 770 },
  /** s03 from `matrix` on: left, beside the matrix, with room for two labels under it. */
  beside: { x: 0, y: 20, w: 770 },
} as const satisfies Record<string, ShopPose>;

export function mixPose(a: ShopPose, b: ShopPose, t: number): ShopPose {
  const k = Math.max(0, Math.min(1, t));
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k };
}

/** How s02 leaves the shop (and s03 finds it): everything that looks is lit. */
export const SHOP_AFTER_S02 = { tape: 1, tapeWound: 0.92, alarm: 1, camera: 1, live: 1, cone: 0.6, labels: { ayer: 1, live: 1 } } as const;
