import { useId, type CSSProperties } from 'react';
import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * The road between the port and the shipping company, and the shadow that
 * watches it (s02, and again in s08: «Vuelve la carretera de s02, con su
 * sombra»). The road is the public network (sky); the shadow is a neutral
 * watcher (dark ink, an eye) — NOT rose: it is not NULL CIPHER.
 *
 *   - `Road`: a horizontal band `width`×`height` with a dashed centre line,
 *     revealed left to right by `draw` (0–1). `roadPoint(width, height, t)`
 *     gives the centre-line point at t (0 = left end, 1 = right end), to
 *     place travellers on it.
 *   - `Shadow`: a silhouette (head and shoulders) with an eye that opens
 *     (`eye` 0–1). Aspect 100×130 (`shadowHeight`). `eyePoint()` is the eye.
 *
 * Nothing reads the timeline; nothing is positioned.
 */

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export function roadPoint(width: number, height: number, t: number): { x: number; y: number } {
  return { x: clamp01(t) * width, y: height / 2 };
}

export function Road({
  width,
  height = 84,
  draw = 1,
  glow = 0,
  dim = 0,
  style,
}: {
  width: number;
  height?: number;
  /** 0–1: revealed left to right. */
  draw?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('road');
  const dr = clamp01(draw);
  const g = clamp01(glow);
  const d = clamp01(dim);
  if (dr <= 0) return null;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: 1 - 0.6 * d,
        filter: [g > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 14 * g)}px ${alpha(C.sky, 0.5 * g)})` : '', d > 0.01 ? `saturate(${1 - 0.6 * d})` : '']
          .filter(Boolean)
          .join(' ') || undefined,
        ...style,
      }}
    >
      <defs>
        <clipPath id={`${id}-reveal`}>
          <rect x={0} y={-20} width={width * dr} height={height + 40} />
        </clipPath>
        <linearGradient id={`${id}-asphalt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16233a" />
          <stop offset="100%" stopColor="#0d1626" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}-reveal)`}>
        <rect x={0} y={0} width={width} height={height} rx={height * 0.18} fill={`url(#${id}-asphalt)`} />
        <rect x={0} y={1.5} width={width} height={3} fill={alpha(C.sky, 0.7)} />
        <rect x={0} y={height - 4.5} width={width} height={3} fill={alpha(C.sky, 0.7)} />
        <line x1={14} y1={height / 2} x2={width - 14} y2={height / 2} stroke={alpha(C.sky, 0.55)} strokeWidth={4} strokeDasharray="26 22" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export const SHADOW_BASE = { w: 100, h: 130 } as const;

export function shadowHeight(width: number): number {
  return (SHADOW_BASE.h * width) / SHADOW_BASE.w;
}

/** The eye's centre, px from the Shadow's top-left. */
export function eyePoint(width: number): { x: number; y: number } {
  const s = width / SHADOW_BASE.w;
  return { x: 50 * s, y: 36 * s };
}

export function Shadow({
  width,
  show = 1,
  eye = 1,
  dim = 0,
  style,
}: {
  width: number;
  show?: number;
  /** 0–1: the eye opens and lights. */
  eye?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('shadow');
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const e = clamp01(eye);
  const d = clamp01(dim);
  const h = shadowHeight(width);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 100 130"
      style={{ overflow: 'visible', display: 'block', opacity: sh * (1 - 0.6 * d), ...style }}
    >
      <defs>
        <radialGradient id={`${id}-fill`} cx="0.5" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>
      {/* Shoulders and head */}
      <path d="M 6 128 Q 8 82 50 78 Q 92 82 94 128 Z" fill={`url(#${id}-fill)`} stroke={alpha(C.muted, 0.45)} strokeWidth={2} />
      <circle cx={50} cy={38} r={30} fill={`url(#${id}-fill)`} stroke={alpha(C.muted, 0.45)} strokeWidth={2} />
      {/* The eye */}
      <path
        d={`M 30 38 Q 50 ${38 - 16 * e} 70 38 Q 50 ${38 + 16 * e} 30 38 Z`}
        fill={alpha('#e2e8f0', 0.12 + 0.75 * e)}
        stroke={alpha('#e2e8f0', 0.5 + 0.5 * e)}
        strokeWidth={2}
      />
      {e > 0.2 ? <circle cx={50} cy={38} r={6 * e} fill="#020617" /> : null}
    </svg>
  );
}
