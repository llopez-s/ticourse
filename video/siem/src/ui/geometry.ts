export interface Point {
  x: number;
  y: number;
}

/** Horizontal-ish S curve between two points (control points pulled along x). */
export function curveBetween(a: Point, b: Point, bend = 0.5): [Point, Point, Point, Point] {
  const dx = (b.x - a.x) * bend;
  return [a, { x: a.x + dx, y: a.y }, { x: b.x - dx, y: b.y }, b];
}

/** Vertical-ish S curve (control points pulled along y). */
export function curveBetweenV(a: Point, b: Point, bend = 0.5): [Point, Point, Point, Point] {
  const dy = (b.y - a.y) * bend;
  return [a, { x: a.x, y: a.y + dy }, { x: b.x, y: b.y - dy }, b];
}

export function cubicPath([p0, p1, p2, p3]: [Point, Point, Point, Point]): string {
  return `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
}

/** Point on a cubic bezier at t ∈ [0, 1]. */
export function cubicPoint([p0, p1, p2, p3]: [Point, Point, Point, Point], t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

/** Approximate arc length of a cubic bezier (for dash animations). */
export function cubicLength(curve: [Point, Point, Point, Point], steps = 40): number {
  let length = 0;
  let prev = curve[0];
  for (let i = 1; i <= steps; i++) {
    const p = cubicPoint(curve, i / steps);
    length += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return length;
}
