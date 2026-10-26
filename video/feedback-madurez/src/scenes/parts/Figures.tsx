import type { CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/** Faceless silhouette of a traveller (head and shoulders, whole body). `size` is the height in px. */
export function Rider({ size = 80, color = C.emerald, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={(size * 40) / 70} height={size} viewBox="0 0 40 70" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      <circle cx="20" cy="12" r="10" fill={color} />
      <path d="M5 68 C5 40 11 28 20 28 C29 28 35 40 35 68 Z" fill={color} />
    </svg>
  );
}

/** Natural size of the bus drawing (viewBox). */
export const BUS = { w: 320, h: 150 } as const;
const WIN_X = [26, 78, 130, 182, 234] as const;

/**
 * The one bus of the video: simple shapes, no brand, no line number. `riders`
 * says which of the five windows carry a silhouette (all empty by default).
 */
export function Bus({
  width = 320,
  tone = C.cyan,
  riders = [],
  riderColor = C.emerald,
  style,
}: {
  width?: number;
  tone?: string;
  /** Opacity 0–1 of the silhouette in each of the five windows. */
  riders?: readonly number[];
  riderColor?: string;
  style?: CSSProperties;
}) {
  return (
    <svg width={width} height={(width * BUS.h) / BUS.w} viewBox={`0 0 ${BUS.w} ${BUS.h}`} style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }} aria-hidden>
      {/* body */}
      <rect x="6" y="14" width="308" height="100" rx="28" fill={alpha(tone, 0.16)} stroke={tone} strokeWidth="5" />
      <rect x="6" y="88" width="308" height="14" fill={alpha(tone, 0.4)} />
      {/* windows, each with its (optional) silhouette */}
      {WIN_X.map((x, i) => (
        <g key={x}>
          <rect x={x} y="32" width="46" height="44" rx="10" fill={C.ink950} stroke={alpha(tone, 0.7)} strokeWidth="3" />
          {(riders[i] ?? 0) > 0.01 ? (
            <g opacity={riders[i]}>
              <circle cx={x + 23} cy="47" r="8" fill={riderColor} />
              <path d={`M${x + 8} 76 C${x + 8} 60 ${x + 15} 56 ${x + 23} 56 C${x + 31} 56 ${x + 38} 60 ${x + 38} 76 Z`} fill={riderColor} />
            </g>
          ) : null}
        </g>
      ))}
      {/* door and light */}
      <rect x="290" y="32" width="16" height="70" rx="5" fill={alpha(tone, 0.3)} />
      <rect x="306" y="80" width="12" height="12" rx="4" fill={C.amber} />
      {/* wheels */}
      {[78, 244].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="118" r="21" fill={C.ink950} stroke={C.ink500} strokeWidth="5" />
          <circle cx={cx} cy="118" r="7" fill={C.ink500} />
        </g>
      ))}
    </svg>
  );
}

/** A coin (spending): two rings and a bar, no currency symbol. */
export function Coin({ size = 96, color = C.amber, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <path d={`M10 ${74 - k * 20} v-10 a38 14 0 0 0 76 0 v10 a38 14 0 0 1 -76 0 Z`} fill={alpha(color, 0.22)} stroke={color} strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="48" cy={64 - k * 20} rx="38" ry="14" fill={alpha(color, 0.35)} stroke={color} strokeWidth="4" />
        </g>
      ))}
    </svg>
  );
}

/** A bus stop: post, flag and a ring on the road. `size` is the post height. */
export function StopPost({ size = 110, color = C.cyan, lit = 0, style }: { size?: number; color?: string; lit?: number; style?: CSSProperties }) {
  return (
    <svg width={size * 0.62} height={size} viewBox="0 0 62 100" style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }} aria-hidden>
      <rect x="28" y="22" width="6" height="76" rx="3" fill={alpha(color, 0.7)} />
      <rect x="10" y="4" width="42" height="26" rx="8" fill={alpha(color, 0.18 + 0.4 * lit)} stroke={color} strokeWidth="4" />
      <circle cx="31" cy="17" r="6" fill={color} />
    </svg>
  );
}
