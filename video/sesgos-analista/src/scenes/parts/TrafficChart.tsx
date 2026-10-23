import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';

/**
 * Odd traffic on a chart with no axes and no machine behind it: a calm line, then a plateau that should not be
 * there. `draw` 0–1 draws the line from the left; `alarm` 0–1 lights the odd stretch amber and rings it (a
 * soft ring, slow). A normal-flow box `width` × `height`.
 */
const POINTS = 60;
const ODD = { from: 0.52, to: 0.72 } as const;

function value(t: number) {
  const noise = 0.1 * Math.sin(t * 37) + 0.07 * Math.sin(t * 91 + 1.3) + 0.05 * Math.sin(t * 17 + 0.4);
  const odd = t > ODD.from - 0.04 && t < ODD.to + 0.04 ? Math.min(1, Math.min(t - (ODD.from - 0.04), ODD.to + 0.04 - t) / 0.04) : 0;
  return 0.3 + noise + 0.5 * odd + 0.08 * odd * Math.sin(t * 160);
}

export function TrafficChart({ width, height, draw = 1, alarm = 0, label = 1 }: { width: number; height: number; draw?: number; alarm?: number; label?: number }) {
  const pad = 14;
  const pts = Array.from({ length: POINTS + 1 }, (_, i) => {
    const t = i / POINTS;
    return [pad + t * (width - 2 * pad), height - pad - value(t) * (height - 2 * pad - 50)] as const;
  });
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${d} L ${pts[POINTS][0]} ${height - pad} L ${pts[0][0]} ${height - pad} Z`;
  const x0 = pad + ODD.from * (width - 2 * pad);
  const x1 = pad + ODD.to * (width - 2 * pad);
  const clip = `chart-clip-${Math.round(width)}`;
  const mid = (x0 + x1) / 2;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.3)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.9)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        fontFamily: FONT.sans,
        overflow: 'visible',
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id={clip}>
            <rect x={0} y={-30} width={Math.max(0, draw * width)} height={height + 60} />
          </clipPath>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={alpha(C.cyan, 0.22)} />
            <stop offset="1" stopColor={alpha(C.cyan, 0)} />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <path d={area} fill="url(#chart-fill)" />
          <path d={d} fill="none" stroke={C.cyanSoft} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          <rect x={x0} y={pad} width={x1 - x0} height={height - 2 * pad} rx={10} fill={alpha(C.amber, 0.12 * alarm)} stroke={alpha(C.amber, 0.7 * alarm)} strokeWidth={3} strokeDasharray="10 8" />
        </g>
      </svg>
      {alarm > 0.02 ? (
        <div style={{ position: 'absolute', left: mid - 150, top: pad - 4, width: 300, textAlign: 'center', fontSize: 38, fontWeight: 800, color: '#fcd34d', opacity: alarm * label, whiteSpace: 'nowrap' }}>tráfico raro</div>
      ) : null}
    </div>
  );
}
