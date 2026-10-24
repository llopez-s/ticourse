import { C } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The first `p` (0–1) of a polyline, by length. */
function partial(points: [number, number][], p: number): [number, number][] {
  const segs = points.slice(1).map((pt, i) => Math.hypot(pt[0] - points[i][0], pt[1] - points[i][1]));
  let left = segs.reduce((a, b) => a + b, 0) * p;
  const out: [number, number][] = [points[0]];
  for (let i = 0; i < segs.length; i++) {
    if (left >= segs[i]) {
      out.push(points[i + 1]);
      left -= segs[i];
      continue;
    }
    const k = segs[i] === 0 ? 0 : left / segs[i];
    out.push([points[i][0] + (points[i + 1][0] - points[i][0]) * k, points[i][1] + (points[i + 1][1] - points[i][1]) * k]);
    break;
  }
  return out;
}

/**
 * An arrow (draw it inside an <svg> in the same coordinates): a polyline through `points`, revealed by `draw` 0–1
 * (solid or dashed), with a head once fully drawn. Never a text arrow.
 */
export function Arrow({
  points,
  draw = 1,
  color = C.cyan,
  width = 4,
  dashed = false,
  opacity = 1,
}: {
  points: [number, number][];
  draw?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  const p = clamp01(draw);
  if (p <= 0.001 || points.length < 2) return null;
  const pts = partial(points, p);
  const d = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ');
  const [x2, y2] = points[points.length - 1];
  const [x1, y1] = points[points.length - 2];
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 9 + width * 2;
  const hx = (a: number) => x2 - head * Math.cos(ang + a);
  const hy = (a: number) => y2 - head * Math.sin(ang + a);
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '14 12' : undefined} />
      {p > 0.97 ? <polygon points={`${x2},${y2} ${hx(0.45)},${hy(0.45)} ${hx(-0.45)},${hy(-0.45)}`} fill={color} /> : null}
    </g>
  );
}
