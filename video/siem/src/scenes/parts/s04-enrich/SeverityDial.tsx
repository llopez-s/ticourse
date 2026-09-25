import { C, alpha } from '../../../theme/tokens';

const SEGMENTS = [
  { from: 180, to: 122, color: C.emerald },
  { from: 118, to: 62, color: C.amber },
  { from: 58, to: 0, color: C.rose },
] as const;

/**
 * Semicircular severity gauge. `level` is continuous: 0 = BAJA, 1 = MEDIA,
 * 2 = ALTA. The segment the needle sits on is lit, the others stay faint.
 */
export function SeverityDial({ level, radius = 96, stroke = 18 }: { level: number; radius?: number; stroke?: number }) {
  const pad = stroke / 2 + 4;
  const width = radius * 2 + pad * 2;
  const height = radius + pad + stroke * 0.9;
  const cx = width / 2;
  const cy = radius + pad;
  const point = (deg: number, r = radius) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };
  const arc = (from: number, to: number) => {
    const a = point(from);
    const b = point(to);
    return `M${a.x.toFixed(2)},${a.y.toFixed(2)} A${radius},${radius} 0 0 1 ${b.x.toFixed(2)},${b.y.toFixed(2)}`;
  };
  const clamped = Math.max(0, Math.min(2, level));
  const needleDeg = 150 - 60 * clamped;
  const tip = point(needleDeg, radius - stroke - 6);
  const nearest = SEGMENTS[Math.round(clamped)];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      {SEGMENTS.map((segment, index) => {
        const lit = Math.max(0, 1 - Math.abs(clamped - index));
        return (
          <path
            key={index}
            d={arc(segment.from, segment.to)}
            fill="none"
            stroke={alpha(segment.color, 0.2 + 0.8 * lit)}
            strokeWidth={stroke}
            strokeLinecap="butt"
          />
        );
      })}
      <line
        x1={cx}
        y1={cy}
        x2={tip.x}
        y2={tip.y}
        stroke={nearest.color}
        strokeWidth={Math.max(4, stroke * 0.36)}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={stroke * 0.62} fill={C.ink900} stroke={nearest.color} strokeWidth={4} />
    </svg>
  );
}
