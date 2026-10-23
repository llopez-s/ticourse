import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/** The three rungs of the lesson's table, with the tone each keeps in every scene. */
export const RUNGS = [
  { id: 'data', name: 'DATA', tone: C.cyan, soft: C.cyanSoft },
  { id: 'information', name: 'INFORMATION', tone: C.sky, soft: '#7dd3fc' },
  { id: 'intelligence', name: 'INTELLIGENCE', tone: C.emerald, soft: '#6ee7b7' },
] as const;

/** The IP as a pill (mono). `dim` steps it back once it has moved up. */
export function IpChip({ ip, size = 32, tone = C.cyan, dim = 0, style }: { ip: string; size?: number; tone?: string; dim?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `${Math.round(size * 0.2)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, 0.8)}`,
        background: alpha(tone, 0.12),
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 700,
        color: '#e0f2fe',
        whiteSpace: 'nowrap',
        opacity: 1 - 0.65 * dim,
        ...style,
      }}
    >
      <Icon name="globe" size={Math.round(size * 0.9)} color={tone} strokeWidth={2} />
      {ip}
    </span>
  );
}

/**
 * A rung's card: a header with the rung's name, then the content. `focus` 0..1 lights the border; `dim` steps it back.
 * Positioned by the caller (absolute); `w`/`h` are the card's outer size.
 */
export function RungCard({
  rung,
  w,
  h,
  focus = 0,
  dim = 0,
  show = 1,
  children,
  style,
}: {
  rung: (typeof RUNGS)[number];
  w: number;
  h: number;
  focus?: number;
  dim?: number;
  show?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        padding: '18px 26px 20px',
        borderRadius: RADIUS.lg,
        border: `${focus > 0.3 ? 3 : 2}px solid ${alpha(rung.tone, 0.35 + 0.55 * focus)}`,
        background: `linear-gradient(180deg, ${alpha(rung.tone, 0.05 + 0.08 * focus)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
        boxShadow: focus > 0.02 ? `0 0 ${Math.round(40 * focus)}px ${alpha(rung.tone, 0.28 * focus)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
        fontFamily: FONT.sans,
        opacity: show * (1 - 0.6 * dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        transform: `translateY(${(1 - show) * 24}px)`,
        ...style,
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 850, letterSpacing: 4, color: rung.soft, lineHeight: 1.1 }}>{rung.name}</div>
      {children}
    </div>
  );
}

/**
 * The staircase as an icon: three bars rising to the right, the IP's dot climbing them. `lit` 0..3 rungs filled.
 * Used on the poster and on the first rule card.
 */
export function StairsArt({ width = 300, lit = 3, labels = false, labelSize = 30, dotAt = 3 }: { width?: number; lit?: number; labels?: boolean; labelSize?: number; dotAt?: number }) {
  const h = Math.round(width * 0.62);
  const bw = width / 3;
  const rise = h * 0.3;
  return (
    <div style={{ position: 'relative', width, height: h }}>
      <svg width={width} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {RUNGS.map((r, i) => {
          const top = h - rise * (i + 1) - 10;
          const on = Math.max(0, Math.min(1, lit - i));
          return (
            <g key={r.id}>
              <rect x={i * bw + 3} y={top} width={bw - 6} height={h - top} rx={8} fill={alpha(r.tone, 0.08 + 0.3 * on)} stroke={alpha(r.tone, 0.35 + 0.6 * on)} strokeWidth={3} />
            </g>
          );
        })}
        {/* the IP, a dot that climbs */}
        {RUNGS.map((r, i) => {
          if (i >= dotAt) return null;
          const top = h - rise * (i + 1) - 10;
          return <circle key={`d${r.id}`} cx={i * bw + bw / 2} cy={top - 16} r={i === Math.min(dotAt, 3) - 1 ? 11 : 6} fill={i === Math.min(dotAt, 3) - 1 ? C.cyanSoft : alpha(C.cyan, 0.5)} />;
        })}
      </svg>
      {labels
        ? RUNGS.map((r, i) => {
            const top = h - rise * (i + 1) - 10;
            return (
              <div
                key={`l${r.id}`}
                style={{ position: 'absolute', left: i * bw, top: top + 14, width: bw, textAlign: 'center', fontFamily: FONT.sans, fontSize: labelSize, fontWeight: 850, letterSpacing: 1, color: r.soft, whiteSpace: 'nowrap' }}
              >
                {r.id === 'data' ? 'DATO' : r.id === 'information' ? 'INFO' : 'JUICIO'}
              </div>
            );
          })
        : null}
    </div>
  );
}
