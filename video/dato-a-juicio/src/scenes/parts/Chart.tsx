import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * A nautical chart with no land on it: graticule, a compass rose, the captain's ship and the dead-reckoning point
 * («estima») inside a ring of doubt. No numbers, no percentages (probability vs. confidence is section 5's).
 *
 * <Chart show rumbo ring star … /> — a `CHART_W`×`CHART_H` box. Props (0..1 unless said otherwise):
 *   show    the chart itself        rumbo   the heading line is drawn (dashed, with an arrowhead)
 *   point   the estimate dot        ring    radius of the doubt ring in px (0 hides it)
 *   star    the new data point («dato nuevo») and its bearing line
 */
export const CHART_W = 1200;
export const CHART_H = 500;
export const SHIP = { x: 560, y: 262 } as const;
const STAR = { x: 250, y: 130 } as const;
const AIM = { x: 930, y: 120 } as const;

export function Chart({ show = 1, rumbo = 0, point = 0, ring = 0, star = 0 }: { show?: number; rumbo?: number; point?: number; ring?: number; star?: number }) {
  const lines: number[] = [];
  for (let x = 100; x < CHART_W; x += 100) lines.push(x);
  const rows: number[] = [];
  for (let y = 100; y < CHART_H; y += 100) rows.push(y);
  const ang = (Math.atan2(AIM.y - SHIP.y, AIM.x - SHIP.x) * 180) / Math.PI;
  const slen = Math.hypot(SHIP.x - STAR.x, SHIP.y - STAR.y);
  return (
    <div style={{ position: 'relative', width: CHART_W, height: CHART_H, opacity: show, transform: `translateY(${(1 - show) * 24}px)`, fontFamily: FONT.sans }}>
      <svg width={CHART_W} height={CHART_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <radialGradient id="chart-sea" cx="50%" cy="45%" r="75%">
            <stop offset="0" stopColor="#0f2a44" />
            <stop offset="1" stopColor="#0a1626" />
          </radialGradient>
        </defs>
        <rect x={2} y={2} width={CHART_W - 4} height={CHART_H - 4} rx={24} fill="url(#chart-sea)" stroke={C.ink600} strokeWidth={4} />
        {lines.map((x) => (
          <line key={`v${x}`} x1={x} y1={4} x2={x} y2={CHART_H - 4} stroke={alpha(C.cyan, 0.13)} strokeWidth={2} />
        ))}
        {rows.map((y) => (
          <line key={`h${y}`} x1={4} y1={y} x2={CHART_W - 4} y2={y} stroke={alpha(C.cyan, 0.13)} strokeWidth={2} />
        ))}
        {/* compass rose */}
        <g transform="translate(1100 392)" stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={3} fill="none" strokeLinecap="round">
          <circle r={46} />
          <path d="M0 -62V62M-62 0H62" />
          <path d="M0 -46L10 0L0 46L-10 0Z" fill={alpha(C.cyan, 0.2)} />
        </g>
        <text x={1100} y={318} textAnchor="middle" fontFamily={FONT.sans} fontSize={30} fontWeight={800} fill={alpha(C.cyanSoft, 0.8)}>
          N
        </text>

        {/* the new datum: a star sight and its bearing line */}
        {star > 0.01 ? (
          <g opacity={star}>
            <line x1={STAR.x} y1={STAR.y} x2={SHIP.x} y2={SHIP.y} stroke={alpha(C.amber, 0.8)} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={slen * (1 - star)} />
            <path d={`M${STAR.x} ${STAR.y - 30}L${STAR.x + 9} ${STAR.y - 9}L${STAR.x + 30} ${STAR.y}L${STAR.x + 9} ${STAR.y + 9}L${STAR.x} ${STAR.y + 30}L${STAR.x - 9} ${STAR.y + 9}L${STAR.x - 30} ${STAR.y}L${STAR.x - 9} ${STAR.y - 9}Z`} fill={alpha(C.amber, 0.35)} stroke={C.amber} strokeWidth={3} strokeLinejoin="round" />
          </g>
        ) : null}

        {/* the heading */}
        {rumbo > 0.01 ? (
          <g>
            <line x1={SHIP.x} y1={SHIP.y} x2={SHIP.x + (AIM.x - SHIP.x) * rumbo} y2={SHIP.y + (AIM.y - SHIP.y) * rumbo} stroke={C.cyanSoft} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" />
            <g transform={`translate(${AIM.x} ${AIM.y}) rotate(${ang})`} opacity={rumbo > 0.95 ? 1 : 0}>
              <path d="M-26 -16L0 0L-26 16" fill="none" stroke={C.cyanSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        ) : null}
        <text x={AIM.x + 16} y={AIM.y - 26} fontFamily={FONT.sans} fontSize={34} fontWeight={800} fill={C.cyanSoft} opacity={rumbo > 0.95 ? 1 : 0}>
          rumbo
        </text>

        {/* the ring of doubt, then the dead-reckoning point and the ship */}
        {ring > 1 ? <circle cx={SHIP.x} cy={SHIP.y} r={ring} fill={alpha(C.amber, 0.09)} stroke={C.amber} strokeWidth={4} strokeDasharray="14 10" /> : null}
        {point > 0.01 ? (
          <g transform={`translate(${SHIP.x} ${SHIP.y})`} opacity={point}>
            <path d="M-34 6H34L22 26H-22Z" fill={alpha(C.cyan, 0.25)} stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" />
            <path d="M0 6V-40M0 -40L24 -2H0" fill={alpha(C.cyanSoft, 0.3)} stroke={C.cyanSoft} strokeWidth={4} strokeLinejoin="round" />
            <circle r={7} cy={-6} fill={C.textStrong} opacity={0} />
          </g>
        ) : null}
      </svg>
      {point > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: SHIP.x - 160,
            top: SHIP.y + Math.max(ring, 70) + 14,
            width: 320,
            textAlign: 'center',
            fontSize: 38,
            fontWeight: 850,
            letterSpacing: 1,
            color: C.cyanSoft,
            opacity: point,
          }}
        >
          estima
        </div>
      ) : null}
      {star > 0.01 ? (
        <div style={{ position: 'absolute', left: STAR.x - 100, top: STAR.y - 82, width: 200, textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#fcd34d', opacity: star, whiteSpace: 'nowrap' }}>dato nuevo</div>
      ) : null}
    </div>
  );
}
