import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { S02 } from '../../../data/s02-atras';

export const AXIS = { w: 1728, h: 120, y: 60, left: 96, right: 1632, cx: 864, pill: { w: 150, h: 70 } } as const;

/**
 * The time line under the shop: a dim base line with ticks (`base` 0–1), «hoy» in the middle (`today`
 * 0–1) and two drawn connectors, one backwards and one forwards (`back`, `fwd` 0–1 draw them; their
 * arrowheads are drawn, never text). What already happened is solid; what is to come, dashed.
 */
export function TimeAxis({ base, today, back, fwd, backLit = 0, fwdLit = 0 }: { base: number; today: number; back: number; fwd: number; backLit?: number; fwdLit?: number }) {
  const y = AXIS.y;
  const half = AXIS.pill.w / 2 + 10;
  const ticks = Array.from({ length: 23 }, (_, i) => AXIS.left + 60 + i * ((AXIS.right - AXIS.left - 120) / 22));
  const head = (dir: -1 | 1, on: number, lit: number) => {
    const x = dir < 0 ? AXIS.left : AXIS.right;
    return <path d={`M${x} ${y} l${-dir * 30} -17 v34 Z`} fill={C.cyan} opacity={on} style={{ filter: lit > 0.02 ? `drop-shadow(0 0 ${Math.round(12 * lit)}px ${alpha(C.cyan, 0.8)})` : undefined }} />;
  };
  return (
    <div style={{ position: 'relative', width: AXIS.w, height: AXIS.h }}>
      <svg width={AXIS.w} height={AXIS.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* base line: solid behind us, dashed ahead */}
        <g opacity={base * (1 - 0.7 * Math.max(back, fwd))}>
          <path d={`M${AXIS.left} ${y} H${AXIS.cx}`} stroke={alpha(C.faint, 0.55)} strokeWidth={3} />
          <path d={`M${AXIS.cx} ${y} H${AXIS.right}`} stroke={alpha(C.faint, 0.55)} strokeWidth={3} strokeDasharray="10 12" />
          {ticks.map((x) => (
            <path key={x} d={`M${x} ${y - 9} v18`} stroke={alpha(C.faint, x < AXIS.cx ? 0.6 : 0.3)} strokeWidth={3} strokeLinecap="round" />
          ))}
        </g>
        <path d={`M${AXIS.cx - half} ${y} H${AXIS.cx - half - (AXIS.cx - half - AXIS.left - 26) * back}`} stroke={C.cyan} strokeWidth={6 + 2 * backLit} strokeLinecap="round" opacity={back > 0.02 ? 0.6 + 0.4 * backLit : 0} />
        <path d={`M${AXIS.cx + half} ${y} H${AXIS.cx + half + (AXIS.right - 26 - AXIS.cx - half) * fwd}`} stroke={C.cyan} strokeWidth={6 + 2 * fwdLit} strokeLinecap="round" strokeDasharray="18 14" opacity={fwd > 0.02 ? 0.6 + 0.4 * fwdLit : 0} />
        {head(-1, back > 0.9 ? Math.min(1, (back - 0.9) * 10) : 0, backLit)}
        {head(1, fwd > 0.9 ? Math.min(1, (fwd - 0.9) * 10) : 0, fwdLit)}
      </svg>
      {/* «hoy» */}
      <div
        style={{
          position: 'absolute',
          left: AXIS.cx - AXIS.pill.w / 2,
          top: y - AXIS.pill.h / 2,
          width: AXIS.pill.w,
          height: AXIS.pill.h,
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 18,
          border: `3px solid ${C.textStrong}`,
          background: C.ink900,
          fontFamily: FONT.sans,
          fontSize: 46,
          lineHeight: 1,
          fontWeight: 900,
          color: C.textStrong,
          opacity: today,
          transform: `scale(${0.7 + 0.3 * today})`,
          boxShadow: `0 0 ${Math.round(26 * today)}px ${alpha(C.textStrong, 0.2)}`,
        }}
      >
        {S02.today}
      </div>
    </div>
  );
}
