import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The cloud outline in its own units. */
export const CLOUD = { w: 420, h: 260 } as const;
export const CLOUD_PATH =
  'M 96 236 C 40 236 8 198 8 156 C 8 112 44 80 90 82 C 100 38 142 10 192 10 C 246 10 286 44 298 88 C 304 86 312 84 320 84 C 372 84 412 120 412 162 C 412 204 376 236 330 236 Z';

/**
 * A public cloud, in outline (no provider, no logo): sky stroke, faint fill, three horizontal strips inside hinting at
 * layers. `children` are drawn inside in cloud units (documents, a crack).
 */
export function CloudShape({ width = CLOUD.w, glow = 0, tone = C.sky, strips = true, children }: { width?: number; glow?: number; tone?: string; strips?: boolean; children?: ReactNode }) {
  const h = (width * CLOUD.h) / CLOUD.w;
  const g = clamp01(glow);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${CLOUD.w} ${CLOUD.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <clipPath id="cloud-clip">
          <path d={CLOUD_PATH} />
        </clipPath>
      </defs>
      {g > 0.02 ? <path d={CLOUD_PATH} fill="none" stroke={alpha(tone, 0.25 * g)} strokeWidth={22} /> : null}
      <path d={CLOUD_PATH} fill={alpha(tone, 0.1)} stroke={alpha(tone, 0.7 + 0.3 * g)} strokeWidth={5} strokeLinejoin="round" />
      {strips ? (
        <g clipPath="url(#cloud-clip)">
          <rect x={0} y={112} width={CLOUD.w} height={34} fill={alpha(C.cyan, 0.16)} />
          <rect x={0} y={150} width={CLOUD.w} height={30} fill={alpha(C.muted, 0.1)} />
          <rect x={0} y={184} width={CLOUD.w} height={60} fill={alpha(C.sky, 0.18)} />
        </g>
      ) : null}
      {children}
    </svg>
  );
}

/** A blank document (no text) in cloud units, top-left at (x, y). */
export function BlankDoc({ x, y, s = 1, tone = C.cyan }: { x: number; y: number; s?: number; tone?: string }) {
  const w = 54 * s;
  const h = 70 * s;
  const f = 16 * s;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x + w - f} ${y} L ${x + w} ${y + f} L ${x + w} ${y + h} L ${x} ${y + h} Z`} fill={C.ink800} stroke={alpha(tone, 0.8)} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M ${x + w - f} ${y} L ${x + w - f} ${y + f} L ${x + w} ${y + f}`} fill="none" stroke={alpha(tone, 0.8)} strokeWidth={3} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={x + 9 * s} y={y + (24 + k * 13) * s} width={(k === 2 ? 22 : 34) * s} height={5 * s} rx={2.5 * s} fill={alpha(tone, 0.4)} />
      ))}
    </g>
  );
}
