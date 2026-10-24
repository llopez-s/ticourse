import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * «Tu cabeza»: a head in profile, facing left, drawn on a 300×360 grid. It is nobody in particular — no
 * face, no features beyond the outline — and it is the same head in s01 (the hunch) and s02 (the three
 * inner steps). `HEAD_GRID` is the grid so a scene can place HTML on top of the skull with `k = width / 300`.
 *
 * <Head width glow? dim? fill? stroke?>{svg children in grid coordinates}</Head>
 */
export const HEAD_GRID = { w: 300, h: 360 } as const;

export const HEAD_PATH =
  'M 170 10 C 100 10 48 56 46 120 C 45 136 40 150 38 160 L 14 208 L 36 214 L 36 232 C 30 238 34 244 38 246 C 32 252 36 258 40 260 C 36 276 42 288 56 292 C 90 296 112 288 128 280 L 128 336 L 254 336 L 238 262 C 290 236 302 170 288 112 C 274 50 230 10 170 10 Z';

export function Head({
  width,
  glow = 0,
  dim = 0,
  stroke = C.cyan,
  children,
}: {
  width: number;
  glow?: number;
  dim?: number;
  stroke?: string;
  children?: ReactNode;
}) {
  const k = width / HEAD_GRID.w;
  return (
    <svg
      width={width}
      height={HEAD_GRID.h * k}
      viewBox={`0 0 ${HEAD_GRID.w} ${HEAD_GRID.h}`}
      style={{
        display: 'block',
        overflow: 'visible',
        opacity: 1 - 0.6 * dim,
        filter: `${dim > 0.01 ? `saturate(${1 - 0.5 * dim}) ` : ''}drop-shadow(0 0 ${Math.round(24 * glow)}px ${alpha(stroke, 0.4 * glow)})`,
      }}
    >
      <defs>
        <linearGradient id="head-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={alpha(stroke, 0.22)} />
          <stop offset="1" stopColor={alpha(C.ink900, 0.96)} />
        </linearGradient>
      </defs>
      <path d={HEAD_PATH} fill="url(#head-fill)" stroke={alpha(stroke, 0.85)} strokeWidth={4} strokeLinejoin="round" />
      {children}
    </svg>
  );
}
