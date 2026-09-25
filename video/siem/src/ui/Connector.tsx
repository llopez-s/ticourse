import { C, alpha } from '../theme/tokens';
import { cubicLength, cubicPath, cubicPoint, type Point } from './geometry';

type Curve = [Point, Point, Point, Point];

/**
 * SVG connector drawn along a cubic curve. `draw` (0–1) reveals the stroke
 * progressively; `flow` (any number, typically frame/fps) animates a travelling
 * dash to suggest data moving along it. Render inside an <svg> that shares the
 * coordinate space of the points.
 */
export function Connector({
  curve,
  color = C.cyan,
  width = 3,
  draw = 1,
  flow,
  dashed = false,
  opacity = 1,
}: {
  curve: Curve;
  color?: string;
  width?: number;
  draw?: number;
  flow?: number;
  dashed?: boolean;
  opacity?: number;
}) {
  const d = cubicPath(curve);
  const length = cubicLength(curve);
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={alpha(color, 0.28)}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '10 12' : `${length} ${length}`}
        strokeDashoffset={dashed ? 0 : length * (1 - draw)}
      />
      {flow !== undefined && draw >= 1 ? (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray="18 46"
          strokeDashoffset={-flow * 64}
        />
      ) : null}
    </g>
  );
}

/**
 * A data "packet" (glowing dot or small labelled pill) travelling along a
 * curve. `t` in [0, 1]; nothing is drawn outside that range.
 */
export function Packet({
  curve,
  t,
  color = C.cyan,
  radius = 9,
}: {
  curve: Curve;
  t: number;
  color?: string;
  radius?: number;
}) {
  if (t <= 0 || t >= 1) return null;
  const p = cubicPoint(curve, t);
  const fade = Math.min(1, t * 6, (1 - t) * 6);
  return (
    <g opacity={fade}>
      <circle cx={p.x} cy={p.y} r={radius * 2.2} fill={alpha(color, 0.18)} />
      <circle cx={p.x} cy={p.y} r={radius} fill={color} />
    </g>
  );
}
