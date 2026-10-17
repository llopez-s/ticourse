import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** Every everyday vignette is drawn in this viewBox and scaled to its tile. */
export const TILE_VB = { w: 200, h: 150 } as const;
export const TILE_RATIO = TILE_VB.h / TILE_VB.w;

/**
 * The frame of an everyday image (la consulta, la casa, la tienda de la calle): a rounded warm-dark tile, so the
 * images read as «not the port» next to the port's cyan schematics. `show` fades it in, `glow` rings it in `tone`,
 * `dim` steps it back.
 */
export function Tile({
  width,
  show = 1,
  glow = 0,
  dim = 0,
  tone = C.amber,
  children,
}: {
  width: number;
  show?: number;
  glow?: number;
  dim?: number;
  tone?: string;
  children: ReactNode;
}) {
  const s = clamp01(show);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const h = width * TILE_RATIO;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        borderRadius: Math.round(width * 0.09),
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #1c1a24 0%, #14131b 100%)',
        border: `2px solid ${alpha(g > 0.02 ? tone : C.text, g > 0.02 ? 0.4 + 0.5 * g : 0.2)}`,
        boxShadow: `0 10px 26px ${alpha('#000000', 0.4)}${g > 0.02 ? `, 0 0 ${Math.round(24 * g)}px ${alpha(tone, 0.35 * g)}` : ''}`,
        opacity: s * (1 - 0.6 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        transform: `translateY(${(1 - s) * 10}px)`,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${TILE_VB.w} ${TILE_VB.h}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        {children}
      </svg>
    </div>
  );
}
