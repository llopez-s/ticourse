import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The video's one image: a kitchen scale. Drawn in SVG from a single `width` (the body's width); everything
 * else is a fraction of it, so the same scale is the big one of s02 and the tiny one of the recap.
 *
 * <Scale width reading? unit? readingTone? press? tilt? glow? dim? platform? />
 *   reading = '2,0'   what the display says (the scale marks two kilos too many with nothing on it)
 *   press = 0         0–1: the platform is pushed down (a finger on it) — the reading does not change
 *   tilt = 0          degrees: the platform leans on its post and the whole scale leans a third as much
 *   platform?         SVG children drawn on the platform, origin at its top centre, y up = negative
 *                     (the weights of s02 / s05 sit here and lean with it)
 *   glow = 0, dim = 0 a cyan halo · steps it back
 * `scaleGeometry(width)` gives the box and the platform's top centre, for placing things beside it.
 */
export function scaleGeometry(width: number) {
  const w = width;
  return {
    w,
    h: Math.round(0.6 * w),
    /** Platform: centre x, top y, width, height. */
    plat: { cx: w / 2, top: 0.2 * w, w: 0.86 * w, h: 0.05 * w },
    body: { x: 0.04 * w, y: 0.34 * w, w: 0.92 * w, h: 0.26 * w },
  };
}

const READING_TONE = { amber: '#fcd34d', cyan: C.cyanSoft, emerald: '#6ee7b7', muted: C.muted } as const;

export function Scale({
  width,
  reading = '2,0',
  unit = 'kg',
  readingTone = 'amber',
  press = 0,
  tilt = 0,
  glow = 0,
  dim = 0,
  platform,
}: {
  width: number;
  reading?: string;
  unit?: string;
  readingTone?: keyof typeof READING_TONE;
  press?: number;
  tilt?: number;
  glow?: number;
  dim?: number;
  platform?: ReactNode;
}) {
  const g = scaleGeometry(width);
  const w = width;
  const { plat, body } = g;
  const platY = plat.top + press * 0.028 * w;
  const gid = `sc${Math.round(width)}`;
  const tone = READING_TONE[readingTone];
  const disp = { x: 0.25 * w, y: 0.395 * w, w: 0.5 * w, h: 0.135 * w };
  return (
    <div
      style={{
        width: g.w,
        height: g.h,
        transform: `rotate(${tilt * 0.33}deg)`,
        transformOrigin: '50% 100%',
        opacity: 1 - 0.6 * dim,
        filter: `${dim > 0.01 ? `saturate(${1 - 0.5 * dim}) ` : ''}drop-shadow(0 0 ${Math.round(26 * glow)}px ${alpha(C.cyan, 0.4 * glow)})`,
      }}
    >
      <svg width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.ink600} />
            <stop offset="1" stopColor={C.ink800} />
          </linearGradient>
          <linearGradient id={`${gid}-plat`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#64748b" />
          </linearGradient>
        </defs>
        {/* shadow on the table */}
        <ellipse cx={w / 2} cy={body.y + body.h + 0.012 * w} rx={0.5 * w} ry={0.03 * w} fill={alpha('#000000', 0.4)} />
        {/* the post under the platform */}
        <rect x={w / 2 - 0.05 * w} y={plat.top + 0.03 * w} width={0.1 * w} height={body.y - plat.top} fill={C.ink700} stroke={C.ink500} strokeWidth={2} />
        {/* body */}
        <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={0.05 * w} fill={`url(#${gid}-body)`} stroke={C.ink500} strokeWidth={3} />
        <rect x={body.x + 0.02 * w} y={body.y + 0.012 * w} width={body.w - 0.04 * w} height={0.012 * w} rx={0.006 * w} fill={alpha('#ffffff', 0.12)} />
        {/* display */}
        <rect x={disp.x} y={disp.y} width={disp.w} height={disp.h} rx={0.02 * w} fill={C.ink950} stroke={C.ink500} strokeWidth={2} />
        <text x={disp.x + disp.w - 0.11 * w} y={disp.y + disp.h * 0.74} textAnchor="end" fontFamily={FONT.mono} fontWeight={800} fontSize={0.1 * w} fill={tone}>
          {reading}
        </text>
        <text x={disp.x + disp.w - 0.095 * w} y={disp.y + disp.h * 0.74} textAnchor="start" fontFamily={FONT.mono} fontWeight={700} fontSize={0.05 * w} fill={alpha(tone, 0.8)}>
          {unit}
        </text>
        {/* the two buttons */}
        <circle cx={0.15 * w} cy={body.y + 0.13 * w} r={0.022 * w} fill={C.ink700} stroke={C.ink500} strokeWidth={2} />
        <circle cx={0.85 * w} cy={body.y + 0.13 * w} r={0.022 * w} fill={C.ink700} stroke={C.ink500} strokeWidth={2} />
        {/* platform (leans on its post) */}
        <g transform={`translate(${plat.cx} ${platY}) rotate(${tilt})`}>
          <rect x={-plat.w / 2} y={0} width={plat.w} height={plat.h} rx={0.022 * w} fill={`url(#${gid}-plat)`} stroke="#94a3b8" strokeWidth={2} />
          <rect x={-plat.w / 2 + 0.03 * w} y={0.008 * w} width={plat.w - 0.06 * w} height={0.01 * w} rx={0.005 * w} fill={alpha('#ffffff', 0.55)} />
          {platform}
        </g>
      </svg>
    </div>
  );
}

/** A metal calibration weight, drawn in SVG with its base's bottom centre at (0, 0). */
export function WeightSvg({ size, label = '1', glow = 0 }: { size: number; label?: string; glow?: number }) {
  const s = size;
  const id = `wt${Math.round(size)}${label}`;
  return (
    <g style={{ filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(C.cyanSoft, 0.7 * glow)})` : undefined }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#475569" />
          <stop offset="0.35" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
      </defs>
      <circle cx={0} cy={-s * 1.02} r={s * 0.14} fill="#cbd5e1" stroke="#64748b" strokeWidth={2} />
      <rect x={-s * 0.1} y={-s * 0.95} width={s * 0.2} height={s * 0.12} fill="#94a3b8" />
      <path d={`M ${-s * 0.28} ${-s * 0.84} L ${s * 0.28} ${-s * 0.84} L ${s * 0.5} 0 L ${-s * 0.5} 0 Z`} fill={`url(#${id})`} stroke="#94a3b8" strokeWidth={2} strokeLinejoin="round" />
      <text x={0} y={-s * 0.3} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={s * 0.3} fill="#1e293b">
        {label}
      </text>
    </g>
  );
}

/** The calibration certificate: a small sheet with an emerald seal. A normal-flow box. */
export function Certificate({ width, lit = 1 }: { width: number; lit?: number }) {
  const h = Math.round(width * 0.72);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: width * 0.05,
        background: `linear-gradient(180deg, ${alpha('#f1f5f9', 0.96)} 0%, ${alpha('#cbd5e1', 0.96)} 100%)`,
        border: `3px solid ${alpha(C.emerald, 0.4 + 0.5 * lit)}`,
        boxShadow: `0 16px 40px ${alpha('#000000', 0.4)}, 0 0 ${Math.round(26 * lit)}px ${alpha(C.emerald, 0.28 * lit)}`,
      }}
    >
      <div style={{ position: 'absolute', left: width * 0.1, top: width * 0.1, width: width * 0.5, height: width * 0.045, borderRadius: 6, background: alpha('#334155', 0.75) }} />
      <div style={{ position: 'absolute', left: width * 0.1, top: width * 0.2, width: width * 0.62, height: width * 0.03, borderRadius: 6, background: alpha('#64748b', 0.55) }} />
      <div style={{ position: 'absolute', left: width * 0.1, top: width * 0.27, width: width * 0.45, height: width * 0.03, borderRadius: 6, background: alpha('#64748b', 0.55) }} />
      <div
        style={{
          position: 'absolute',
          right: width * 0.08,
          bottom: width * 0.08,
          width: width * 0.26,
          height: width * 0.26,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: C.emerald,
          border: `4px solid ${alpha(C.emeraldDeep, 0.9)}`,
          boxShadow: `0 0 ${Math.round(20 * lit)}px ${alpha(C.emerald, 0.5 * lit)}`,
        }}
      >
        <svg width={width * 0.15} height={width * 0.15} viewBox="0 0 24 24" fill="none" stroke={C.emeraldDeep} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5 L10 18 L20 6" />
        </svg>
      </div>
    </div>
  );
}
