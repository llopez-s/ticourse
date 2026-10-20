import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The grid of s06 as a small icon (s08 rule-3): two crossed axes, «dónde» horizontal (sky ends) and «quién» vertical
 * (amber ends), one cyan dot on the horizontal axis only. `size` is the side of the square.
 */
export function AxesIcon({ size = 140, glow = 0 }: { size?: number; glow?: number }) {
  const m = size / 2;
  const e = size * 0.42;
  const head = (x: number, y: number, dx: number, dy: number, color: string) => (
    <path
      d={`M ${x} ${y} L ${x - dx * 14 - dy * 9} ${y - dy * 14 - dx * 9} L ${x - dx * 14 + dy * 9} ${y - dy * 14 + dx * 9} Z`}
      fill={color}
    />
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {glow > 0.01 ? <circle cx={m} cy={m} r={size * 0.5} fill={alpha(C.cyan, 0.1 * glow)} /> : null}
      <line x1={m - e} y1={m} x2={m + e} y2={m} stroke={C.sky} strokeWidth={6} strokeLinecap="round" />
      <line x1={m} y1={m - e} x2={m} y2={m + e} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
      {head(m + e + 6, m, 1, 0, C.sky)}
      {head(m - e - 6, m, -1, 0, C.sky)}
      {head(m, m - e - 6, 0, -1, C.amber)}
      {head(m, m + e + 6, 0, 1, C.amber)}
      <circle cx={m - e * 0.62} cy={m} r={11} fill={C.cyan} stroke={C.ink900} strokeWidth={3} />
    </svg>
  );
}
