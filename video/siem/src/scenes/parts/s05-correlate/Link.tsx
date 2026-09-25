import { C } from '../../../theme/tokens';
import { cubicLength, cubicPath, type Point } from '../../../ui';

/** Solid correlation link along a cubic curve; `draw` (0–1) reveals it from the start point. */
export function Link({
  curve,
  draw,
  color = C.cyan,
  width = 4,
}: {
  curve: [Point, Point, Point, Point];
  draw: number;
  color?: string;
  width?: number;
}) {
  if (draw <= 0) return null;
  const length = cubicLength(curve);
  return (
    <path
      d={cubicPath(curve)}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${length} ${length}`}
      strokeDashoffset={length * (1 - Math.min(1, draw))}
    />
  );
}
