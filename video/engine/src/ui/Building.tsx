import type { CSSProperties, ReactNode } from 'react';
import { interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, alpha } from '../theme/tokens';
import { EASE, enter, progress, pulse } from '../theme/motion';
import { FOCUS_TEXT } from './Focus';
import { Icon, type IconName } from './Icon';
import { tone as toneOf, type Tone } from './tone';

/**
 * The tenant metaphor, generalised from V4 (S04Tenants' block and house,
 * s01-hook/Problem's block, the recap's block-vs-house art):
 *   Building — a shared resource: a tall block of many flats (an IP with
 *              thousands of co-hosted domains, a CDN, a sinkhole…);
 *   House    — a dedicated resource: one house, one tenant.
 * Window colours keep the Alertópolis meaning: grey routine, cyan data,
 * amber warning/noise; a highlighted window (the suspect) is rose by default.
 */

/** A window picked out of the block. */
export interface BuildingWindow {
  col: number;
  row: number;
  tone?: Tone;
  /** Frame it lights up (defaults to 20 frames after the block's `at`). */
  at?: number;
}

export interface BuildingSpec {
  width: number;
  height: number;
  cols: number;
  rows: number;
  antenna?: boolean;
}

/** Space above the facade for the roof slab (+ antenna). */
function topOf(antenna: boolean): number {
  return antenna ? 50 : 16;
}

function geometry({ width, height, cols, rows, antenna = true }: BuildingSpec) {
  const top = topOf(antenna);
  const padX = Math.max(8, width * 0.05);
  const padY = 16;
  const cw = (width - 2 * padX) / cols;
  const ch = (height - 2 * padY) / rows;
  const ww = cw * 0.72;
  const wh = ch * 0.64;
  return {
    top,
    ww,
    wh,
    x: (c: number) => padX + c * cw + (cw - ww) / 2,
    y: (r: number) => top + padY + r * ch + (ch - wh) / 2,
  };
}

/** Centre of window (col, row) in the Building's own coordinates (for leaders and threads). */
export function buildingWindowCenter(spec: BuildingSpec, col: number, row: number): { x: number; y: number } {
  const g = geometry(spec);
  return { x: g.x(col) + g.ww / 2, y: g.y(row) + g.wh / 2 };
}

/** Deterministic 0–1 hash of a window index (no Math.random: every render is identical). */
function hash01(i: number, seed: number): number {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(seed + 7, 40503);
  h = Math.imul(h ^ (h >>> 15), 2246822519);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/**
 * A block of flats: seeded window cells that light floor by floor from the
 * street up at `at`, an optional highlighted window (pulsing) and a label.
 * `tone` outlines the facade (amber = shared/noisy); `glow` adds a halo.
 */
export function Building({
  width = 300,
  height = 460,
  cols = 9,
  rows = 16,
  seed = 1,
  mix = { cyan: 0.26, amber: 0.04 },
  tone,
  glow = 0,
  antenna = true,
  highlight,
  label,
  sub,
  icon,
  labelSize = FOCUS_TEXT.min,
  subSize = FOCUS_TEXT.sub,
  labelPosition = 'bottom',
  at = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  /** Height of the facade (the roof and antenna sit above it). */
  height?: number;
  cols?: number;
  rows?: number;
  seed?: number;
  /** Share of cyan (data) and amber (warning) windows; the rest are grey. */
  mix?: { cyan?: number; amber?: number };
  tone?: Tone;
  glow?: number;
  antenna?: boolean;
  highlight?: BuildingWindow | BuildingWindow[];
  label?: ReactNode;
  sub?: ReactNode;
  icon?: IconName;
  labelSize?: number;
  subSize?: number;
  labelPosition?: 'top' | 'bottom';
  /** Frame the block rises and its lights start coming on. */
  at?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const g = geometry({ width, height, cols, rows, antenna });
  const rise = progress(frame, at, 24, EASE.out);
  const outline = tone ? toneOf(tone).fg : C.sky;
  const floorStep = Math.min(1.4, 28 / rows);
  const cyan = mix.cyan ?? 0.26;
  const amber = mix.amber ?? 0.04;
  const lights = Array.isArray(highlight) ? highlight : highlight ? [highlight] : [];
  const lightSet = new Set(lights.map((w) => `${w.col}:${w.row}`));
  const onAt = (r: number, c: number) => at + 4 + (rows - 1 - r) * floorStep + (c % 3);

  const windows: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (lightSet.has(`${c}:${r}`)) continue;
      const on = progress(frame, onAt(r, c), 8);
      if (on <= 0) continue;
      const h = hash01(r * cols + c, seed);
      const fill = h < amber ? alpha(C.amber, 0.55) : h < amber + cyan ? alpha(C.cyan, 0.5) : alpha(C.muted, 0.22);
      windows.push(<rect key={`${c}:${r}`} x={g.x(c)} y={g.y(r)} width={g.ww} height={g.wh} rx={2} fill={fill} opacity={on} />);
    }
  }

  const totalH = g.top + height;
  const labelBlock =
    label || sub ? (
      <LabelBlock width={width} edge={labelPosition === 'bottom' ? { top: totalH + 18 } : { bottom: totalH + 14 }} style={enter(frame, at + 10, { distance: 12 })}>
        {label ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: labelSize, fontWeight: 800, lineHeight: 1.1, color: C.textStrong }}>
            {icon ? <Icon name={icon} size={Math.round(labelSize * 0.8)} color={tone ? outline : C.muted} /> : null}
            {label}
          </div>
        ) : null}
        {sub ? <div style={{ marginTop: 6, fontSize: subSize, fontWeight: 600, color: C.muted }}>{sub}</div> : null}
      </LabelBlock>
    ) : null;

  return (
    <div style={{ position: 'relative', width, height: totalH, ...style }}>
      <svg
        width={width}
        height={totalH}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: rise, transform: `translateY(${(1 - rise) * 30}px)` }}
      >
        {antenna ? (
          <>
            <line x1={width - 50} y1={g.top - 10} x2={width - 50} y2={g.top - 40} stroke={C.ink500} strokeWidth={4} strokeLinecap="round" />
            <circle cx={width - 50} cy={g.top - 42} r={5} fill={alpha(C.sky, 0.8)} />
          </>
        ) : null}
        <rect x={-8} y={g.top - 12} width={width + 16} height={14} rx={4} fill={C.ink700} />
        <rect
          x={0}
          y={g.top}
          width={width}
          height={height}
          rx={6}
          fill={C.ink850}
          stroke={tone ? alpha(outline, 0.4 + 0.5 * glow) : glow > 0 ? alpha(outline, 0.3 + 0.5 * glow) : C.ink700}
          strokeWidth={3}
          style={{ filter: glow > 0 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(outline, 0.5 * glow)})` : undefined }}
        />
        {windows}
        {lights.map((w) => {
          const lit = progress(frame, w.at ?? at + 20, 10);
          const col = toneOf(w.tone ?? 'rose').fg;
          const beat = lit * (0.65 + 0.35 * pulse(frame, fps, 0.6));
          return (
            <rect
              key={`hl-${w.col}:${w.row}`}
              x={g.x(w.col) - 3}
              y={g.y(w.row) - 3}
              width={g.ww + 6}
              height={g.wh + 6}
              rx={3}
              fill={lit > 0 ? interpolateColors(lit, [0, 1], [alpha(C.muted, 0.22), col]) : alpha(C.muted, 0.22)}
              opacity={progress(frame, onAt(w.row, w.col), 8)}
              style={beat > 0 ? { filter: `drop-shadow(0 0 ${Math.round(12 * beat)}px ${alpha(col, 0.9)})` } : undefined}
            />
          );
        })}
      </svg>
      {labelBlock}
    </div>
  );
}

// House geometry in its own viewBox units (from V4's S04Tenants house).
const VB = { x: -4, y: -4, w: 292, h: 196 } as const;
const HOUSE = {
  cx: 142,
  roofTop: 0,
  bodyTop: 74,
  ground: 188,
  window: { x: 56, y: 102, w: 70, h: 56 },
} as const;

/**
 * A single house — one tenant, a dedicated resource. Emerald by default. Its
 * one window lights at `litAt` and shows the tenant (`tenant`); `glow` adds
 * a halo while the voice is on it.
 */
export function House({
  width = 284,
  tone = 'emerald',
  glow = 0,
  tenant = true,
  label,
  sub,
  labelSize = FOCUS_TEXT.min,
  subSize = FOCUS_TEXT.sub,
  labelPosition = 'bottom',
  at = 0,
  litAt,
  frame: frameProp,
  style,
}: {
  width?: number;
  tone?: Tone;
  glow?: number;
  tenant?: boolean;
  label?: ReactNode;
  sub?: ReactNode;
  labelSize?: number;
  subSize?: number;
  labelPosition?: 'top' | 'bottom';
  /** Frame the house rises. */
  at?: number;
  /** Frame the window lights (default: 14 frames after `at`). */
  litAt?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const t = toneOf(tone);
  const k = width / VB.w;
  const height = VB.h * k;
  const rise = progress(frame, at, 22, EASE.out);
  const lit = progress(frame, litAt ?? at + 14, 14);
  const { cx, roofTop, bodyTop, ground, window: win } = HOUSE;
  const roof = `M${cx - 142},${bodyTop + 4} L${cx},${roofTop} L${cx + 142},${bodyTop + 4} Z`;
  const iconSize = 34 * k;
  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <svg
        width={width}
        height={height}
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: rise, transform: `translateY(${(1 - rise) * 24}px)` }}
      >
        <g style={{ filter: glow > 0 ? `drop-shadow(0 0 ${Math.round(22 * glow)}px ${alpha(t.fg, 0.55 * glow)})` : undefined }}>
          {/* Chimney */}
          <rect x={cx + 62} y={roofTop + 18} width={26} height={46} rx={3} fill={C.ink800} stroke={alpha(t.fg, 0.6)} strokeWidth={3} />
          {/* Roof: an opaque base hides the chimney's foot, then the tint */}
          <path d={roof} fill={C.ink850} />
          <path d={roof} fill={alpha(t.fg, 0.14)} stroke={alpha(t.fg, 0.75 + 0.25 * glow)} strokeWidth={4} strokeLinejoin="round" />
          {/* Body */}
          <rect x={cx - 112} y={bodyTop} width={224} height={ground - bodyTop} rx={6} fill={C.ink850} stroke={alpha(t.fg, 0.75 + 0.25 * glow)} strokeWidth={4} />
          {/* Door */}
          <rect x={cx + 18} y={ground - 70} width={44} height={70} rx={4} fill={C.ink800} stroke={alpha(t.fg, 0.5)} strokeWidth={3} />
          <circle cx={cx + 52} cy={ground - 34} r={3.5} fill={alpha(t.fg, 0.8)} />
          {/* The one window */}
          <rect
            x={win.x}
            y={win.y}
            width={win.w}
            height={win.h}
            rx={5}
            fill={interpolateColors(lit, [0, 1], [alpha(C.muted, 0.22), alpha(t.fg, 0.85)])}
            stroke={alpha(t.fg, 0.8)}
            strokeWidth={3}
          />
        </g>
      </svg>
      {tenant ? (
        <div
          style={{
            position: 'absolute',
            left: (win.x + win.w / 2 - VB.x) * k - iconSize / 2,
            top: (win.y + win.h / 2 - VB.y) * k - iconSize / 2 + (1 - rise) * 24,
            opacity: lit * rise,
          }}
        >
          <Icon name="user" size={iconSize} color={C.ink950} strokeWidth={2.4} />
        </div>
      ) : null}
      {label || sub ? (
        <LabelBlock width={width} edge={labelPosition === 'bottom' ? { top: height + 18 } : { bottom: height + 18 }} style={enter(frame, at + 10, { distance: 12 })}>
          {label ? <div style={{ fontSize: labelSize, fontWeight: 800, lineHeight: 1.1, color: C.textStrong }}>{label}</div> : null}
          {sub ? <div style={{ marginTop: 6, fontSize: subSize, fontWeight: 600, color: t.soft }}>{sub}</div> : null}
        </LabelBlock>
      ) : null}
    </div>
  );
}

/** Label centred on the figure (it may be wider than it: it overflows both sides equally). */
function LabelBlock({ width, edge, style, children }: { width: number; edge: { top: number } | { bottom: number }; style: CSSProperties; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 0, width, ...edge, display: 'flex', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', fontFamily: FONT.sans, whiteSpace: 'nowrap', ...style }}>{children}</div>
    </div>
  );
}
