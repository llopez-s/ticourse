import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** Natural size: the pitch (from above) and, under its touchline, the coach. */
export const FOOTBALL = { w: 380, h: 250 } as const;
const P = { x: 10, y: 10, w: 360, h: 180 } as const;
const PLAYERS: [number, number][] = [
  [60, 100], [120, 50], [120, 150], [170, 100], [230, 60], [230, 140], [290, 100],
];

/**
 * The football team (concept 3, «imagen · no es del puerto»): a pitch seen from above with the players as dots and,
 * at the touchline, the coach with a raised arm. `field` 0–1 lights the pitch (where you play), `coach` 0–1 lights the
 * coach and the dashed plays he calls (who decides). No referee, no money, no stadium name.
 */
export function Football({ width = FOOTBALL.w, field = 0, coach = 0 }: { width?: number; field?: number; coach?: number }) {
  const h = (width * FOOTBALL.h) / FOOTBALL.w;
  const f = clamp01(field);
  const c = clamp01(coach);
  const line = alpha('#ffffff', 0.45 + 0.3 * f);
  const cx = 190;
  const cy = 222;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${FOOTBALL.w} ${FOOTBALL.h}`} style={{ overflow: 'visible' }}>
      {f > 0.01 ? <rect x={P.x - 10} y={P.y - 10} width={P.w + 20} height={P.h + 20} rx={18} fill={alpha(C.emerald, 0.16 * f)} /> : null}
      <rect x={P.x} y={P.y} width={P.w} height={P.h} rx={8} fill={f > 0.5 ? '#1d5a3a' : '#17432d'} stroke={line} strokeWidth={3} />
      {[1, 3, 5].map((k) => (
        <rect key={k} x={P.x + (k * P.w) / 7} y={P.y} width={P.w / 7} height={P.h} fill={alpha('#ffffff', 0.04)} />
      ))}
      <line x1={P.x + P.w / 2} y1={P.y} x2={P.x + P.w / 2} y2={P.y + P.h} stroke={line} strokeWidth={3} />
      <circle cx={P.x + P.w / 2} cy={P.y + P.h / 2} r={28} fill="none" stroke={line} strokeWidth={3} />
      <rect x={P.x} y={P.y + 45} width={46} height={90} fill="none" stroke={line} strokeWidth={3} />
      <rect x={P.x + P.w - 46} y={P.y + 45} width={46} height={90} fill="none" stroke={line} strokeWidth={3} />
      {/* the plays the coach calls */}
      {c > 0.01 ? (
        <g opacity={c}>
          <path d="M 70 110 Q 120 90 130 60" fill="none" stroke={alpha(C.amber, 0.9)} strokeWidth={4} strokeDasharray="10 8" strokeLinecap="round" />
          <path d="M 180 110 Q 220 120 240 70" fill="none" stroke={alpha(C.amber, 0.9)} strokeWidth={4} strokeDasharray="10 8" strokeLinecap="round" />
        </g>
      ) : null}
      {PLAYERS.map(([x, y], i) => (
        <circle key={i} cx={P.x + x} cy={P.y + y - 10} r={10} fill={C.cyan} stroke={C.ink900} strokeWidth={3} />
      ))}
      {/* the coach at the touchline, one arm raised */}
      <g opacity={0.55 + 0.45 * c}>
        {c > 0.01 ? <circle cx={cx} cy={cy - 6} r={30} fill={alpha(C.amber, 0.18 * c)} /> : null}
        <circle cx={cx} cy={cy - 22} r={9} fill={c > 0.5 ? C.amber : C.muted} />
        <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 14} stroke={c > 0.5 ? C.amber : C.muted} strokeWidth={6} strokeLinecap="round" />
        <line x1={cx} y1={cy - 6} x2={cx + 22} y2={cy - 30} stroke={c > 0.5 ? C.amber : C.muted} strokeWidth={6} strokeLinecap="round" />
        <line x1={cx} y1={cy - 4} x2={cx - 16} y2={cy + 8} stroke={c > 0.5 ? C.amber : C.muted} strokeWidth={6} strokeLinecap="round" />
      </g>
    </svg>
  );
}
