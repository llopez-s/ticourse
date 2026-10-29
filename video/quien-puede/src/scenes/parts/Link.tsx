import { C, alpha } from '../../../../engine/src/theme/tokens';
import { cubicLength, cubicPath, cubicPoint, type Point } from '../../../../engine/src/ui/geometry';

type Curve = [Point, Point, Point, Point];

/**
 * A connector that is actually readable at 480 px: the engine's `Connector` draws its base stroke at 28 % alpha (it relies
 * on a travelling dash), which disappears on a small player. `Link` draws the whole stroke solid as it is revealed
 * (`draw` 0–1), optionally with an arrowhead at the end (`head`), and lets `dashed` mean «not a real link» (muted, 10/12 dash).
 * Render inside an <svg> that shares the coordinate space of the points.
 */
export function Link({
  curve,
  color = C.cyan,
  width = 5,
  draw = 1,
  opacity = 1,
  dashed = false,
  head = false,
}: {
  curve: Curve;
  color?: string;
  width?: number;
  draw?: number;
  opacity?: number;
  dashed?: boolean;
  head?: boolean;
}) {
  if (draw < 0.005 || opacity < 0.005) return null;
  const d = cubicPath(curve);
  const length = cubicLength(curve);
  const end = curve[3];
  const before = cubicPoint(curve, 0.96);
  const ang = (Math.atan2(end.y - before.y, end.x - before.x) * 180) / Math.PI;
  const hs = width * 2.6;
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={alpha(color, 0.92)}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '10 12' : `${length} ${length}`}
        strokeDashoffset={dashed ? 0 : length * (1 - draw)}
        opacity={dashed ? draw : 1}
      />
      {head && draw > 0.95 ? (
        <path d={`M${-hs} ${-hs * 0.75} L0 0 L${-hs} ${hs * 0.75}`} transform={`translate(${end.x} ${end.y}) rotate(${ang})`} fill="none" stroke={alpha(color, 0.95)} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
    </g>
  );
}
