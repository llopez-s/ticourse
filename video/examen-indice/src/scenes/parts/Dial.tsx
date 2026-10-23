import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * A clock / stopwatch face. `sweep` (0–1) fills a wedge from 12 o'clock clockwise in `color`
 * (the time that passes, or the time that is saved); `hand` (0–1) puts a hand at that
 * fraction of a turn; `stopwatch` adds the crown button on top. `children` sit in the
 * centre (a number, a label) and are not scaled.
 */
export function Dial({
  size = 300,
  sweep = 0,
  hand,
  color = C.emerald,
  stopwatch = false,
  glow = 0,
  children,
  style,
}: {
  size?: number;
  sweep?: number;
  hand?: number;
  color?: string;
  stopwatch?: boolean;
  glow?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const s = Math.max(0, Math.min(0.9999, sweep));
  const ang = (f: number) => (f * 2 * Math.PI) - Math.PI / 2;
  const pt = (f: number, r: number) => `${50 + r * Math.cos(ang(f))} ${50 + r * Math.sin(ang(f))}`;
  const wedge = s > 0.002 ? `M50 50 L${pt(0, 44)} A44 44 0 ${s > 0.5 ? 1 : 0} 1 ${pt(s, 44)} Z` : '';
  const topPad = stopwatch ? Math.round(size * 0.1) : 0;
  return (
    <div style={{ position: 'relative', width: size, height: size + topPad, fontFamily: FONT.sans, ...style }}>
      {stopwatch ? (
        <div style={{ position: 'absolute', left: size / 2 - size * 0.07, top: 0, width: size * 0.14, height: topPad + 6, borderRadius: 6, background: C.ink600, border: `2px solid ${C.ink500}` }} />
      ) : null}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', left: 0, top: topPad, overflow: 'visible' }} aria-hidden>
        <circle cx={50} cy={50} r={47} fill={C.ink850} stroke={alpha(color, 0.45 + 0.4 * glow)} strokeWidth={3} style={{ filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(14 * glow)}px ${alpha(color, 0.6)})` : undefined }} />
        {wedge ? <path d={wedge} fill={alpha(color, 0.55)} stroke={color} strokeWidth={1.2} /> : null}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ang(i / 12);
          const r1 = i % 3 === 0 ? 39 : 42;
          return <line key={i} x1={50 + r1 * Math.cos(a)} y1={50 + r1 * Math.sin(a)} x2={50 + 45 * Math.cos(a)} y2={50 + 45 * Math.sin(a)} stroke={C.muted} strokeWidth={i % 3 === 0 ? 2.4 : 1.4} strokeLinecap="round" />;
        })}
        {hand !== undefined ? <line x1={50} y1={50} x2={50 + 38 * Math.cos(ang(hand))} y2={50 + 38 * Math.sin(ang(hand))} stroke={C.textStrong} strokeWidth={3} strokeLinecap="round" /> : null}
        <circle cx={50} cy={50} r={3.2} fill={C.textStrong} />
      </svg>
      {children ? (
        <div style={{ position: 'absolute', left: 0, top: topPad, width: size, height: size, display: 'grid', placeItems: 'center' }}>{children}</div>
      ) : null}
    </div>
  );
}
