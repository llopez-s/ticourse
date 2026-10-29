import type { Point } from '../../../../engine/src/ui/geometry';

export type { Point };

/** Length of a polyline. */
export function polyLength(pts: readonly Point[]): number {
  let n = 0;
  for (let i = 1; i < pts.length; i++) n += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return n;
}

/** Point at fraction `t` (0–1, by length) of a polyline. */
export function polyPoint(pts: readonly Point[], t: number): Point {
  const total = polyLength(pts);
  let want = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (want <= seg || i === pts.length - 1) {
      const k = seg === 0 ? 0 : Math.min(1, want / seg);
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k };
    }
    want -= seg;
  }
  return pts[pts.length - 1];
}

/** Fraction (0–1, by length) at which vertex `index` of the polyline sits. */
export function polyFraction(pts: readonly Point[], index: number): number {
  const total = polyLength(pts);
  return total === 0 ? 0 : polyLength(pts.slice(0, index + 1)) / total;
}

/** SVG path of a polyline. */
export function polyPath(pts: readonly Point[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

/** Smooth SVG path through the points (Catmull-Rom converted to cubic segments). */
export function smoothPath(pts: readonly Point[]): string {
  if (pts.length < 3) return polyPath(pts);
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
  }
  return d;
}
