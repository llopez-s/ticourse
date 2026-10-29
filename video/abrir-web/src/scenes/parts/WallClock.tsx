import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * Wall clock: an analog face with the hands at the given time plus the digital time and an optional label
 * (s01 «8:58 · lunes», s09 «9:02», «10:58»). `minutes` = minutes since midnight and may be fractional, so a scene
 * can animate the hands between two times (mix(CLOCK.boot, CLOCK.later, t)). Nothing reads the timeline.
 */
export function fmtClock(minutes: number): string {
  const m = Math.round(minutes);
  return `${Math.floor(m / 60) % 24}:${String(m % 60).padStart(2, '0')}`;
}

export function WallClock({
  minutes,
  label,
  size = 200,
  tone = C.cyan,
  glow = 0,
  digitalSize,
  style,
}: {
  minutes: number;
  label?: string;
  size?: number;
  tone?: string;
  glow?: number;
  digitalSize?: number;
  style?: CSSProperties;
}) {
  const r = size / 2;
  const hourA = ((minutes / 60) % 12) * 30;
  const minA = (minutes % 60) * 6;
  const g = clamp01(glow);
  const hand = (deg: number, len: number, w: number, color: string) => (
    <line
      x1={r}
      y1={r}
      x2={r + len * Math.sin((deg * Math.PI) / 180)}
      y2={r - len * Math.cos((deg * Math.PI) / 180)}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
    />
  );
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: FONT.sans, ...style }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible', display: 'block', filter: g > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * g)}px ${alpha(tone, 0.6 * g)})` : undefined }}
      >
        <circle cx={r} cy={r} r={r - 4} fill={C.ink900} stroke={alpha(tone, 0.7)} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const long = i % 3 === 0;
          return (
            <line
              key={i}
              x1={r + (r - 16) * Math.sin(a)}
              y1={r - (r - 16) * Math.cos(a)}
              x2={r + (r - (long ? 32 : 26)) * Math.sin(a)}
              y2={r - (r - (long ? 32 : 26)) * Math.cos(a)}
              stroke={alpha(C.text, long ? 0.8 : 0.4)}
              strokeWidth={long ? 4 : 2.5}
              strokeLinecap="round"
            />
          );
        })}
        {hand(hourA, r * 0.46, 7, C.textStrong)}
        {hand(minA, r * 0.7, 5, tone)}
        <circle cx={r} cy={r} r={7} fill={C.textStrong} />
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: digitalSize ?? Math.round(size * 0.3), fontWeight: 850, color: C.textStrong, fontFamily: FONT.mono, letterSpacing: -1 }}>
          {fmtClock(minutes)}
        </span>
        {label ? (
          <span
            style={{
              padding: '2px 16px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(tone, 0.6)}`,
              background: alpha(tone, 0.12),
              fontSize: 32,
              fontWeight: 700,
              color: C.cyanSoft,
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
