import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Chip, Icon, clamp01, dimStyle, mix } from '../../../../../engine/src/ui';
import { ISOLATED_LABEL, KEYS_TAG, POWER_TAG, type ScopeHost } from '../../../data/s03-scope';

/**
 * Pieces shared by s03-scope and s04-key: the host rows of the 3-9 scope
 * (OPS-WS-14, OPS-WS-08, ADM-WS-02), a filled padlock that matches the one
 * on the Nave doors, a memory module and an SVG chevron (the «>» between two
 * hosts is never a text character). Everything is driven by 0–1 weights the
 * scene computes from its cues; nothing here reads the timeline.
 */

// ---------------------------------------------------------------------------
// Padlock
// ---------------------------------------------------------------------------

/**
 * A filled padlock. `drop` 0–1 lets it fall into place (and fade in); `open`
 * 0–1 lifts the shackle out of the body (not locked: «sin aislar»).
 */
export function Padlock({
  size = 52,
  drop = 1,
  open = 0,
  color = C.cyan,
  soft = C.cyanSoft,
  glow = 0.7,
  style,
}: {
  size?: number;
  drop?: number;
  open?: number;
  color?: string;
  soft?: string;
  glow?: number;
  style?: CSSProperties;
}) {
  const d = clamp01(drop);
  if (d <= 0.001) return null;
  const o = clamp01(open);
  return (
    <svg
      width={size * (44 / 54)}
      height={size}
      viewBox="-2 -4 44 54"
      style={{
        display: 'block',
        overflow: 'visible',
        opacity: Math.min(1, d * 1.6),
        filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(4 + 6 * glow)}px ${alpha(color, 0.75 * glow)})` : undefined,
        ...style,
      }}
    >
      <g transform={`translate(0 ${(1 - d) * -16})`}>
        <path
          d="M 10 23 L 10 14 A 10 10 0 0 1 30 14 L 30 23"
          fill="none"
          stroke={soft}
          strokeWidth={5}
          strokeLinecap="round"
          transform={o > 0 ? `translate(0 ${-6 * o}) rotate(${-32 * o} 10 23)` : undefined}
        />
        <rect x={3} y={21} width={34} height={27} rx={5} fill={color} />
        <circle cx={20} cy={32} r={3.6} fill={C.ink950} />
        <rect x={18.5} y={33} width={3} height={8} rx={1.5} fill={C.ink950} />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Chevron and memory module
// ---------------------------------------------------------------------------

/** The «>» between two hosts, drawn (never typed). */
export function Chevron({ size = 28, dir = 'right', color = C.muted, style }: { size?: number; dir?: 'right' | 'down'; color?: string; style?: CSSProperties }) {
  const points = dir === 'right' ? '6,3 18,12 6,21' : '3,6 12,18 21,6';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0, ...style }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A RAM module (what stays alive while the host is on). `drain` 0–1 empties it (amber: lost if powered off). */
export function RamStick({ width = 160, drain = 0, style }: { width?: number; drain?: number; style?: CSSProperties }) {
  const h = width * 0.38;
  const k = clamp01(drain);
  const fg = k > 0.5 ? C.amber : C.emerald;
  return (
    <svg width={width} height={h} viewBox="0 0 160 60" style={{ display: 'block', overflow: 'visible', ...style }}>
      <rect x={2} y={4} width={156} height={42} rx={5} fill={alpha(fg, 0.14 * (1 - 0.6 * k))} stroke={fg} strokeWidth={3} strokeDasharray={k > 0.02 ? `${6 + 200 * (1 - k)} 6` : undefined} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={14 + i * 36} y={13} width={26} height={24} rx={3} fill={C.ink600} stroke={alpha(fg, 0.6)} strokeWidth={1.5} opacity={1 - 0.7 * k} />
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <rect key={i} x={8 + i * 10} y={48} width={5} height={9} rx={1} fill={alpha(fg, 0.7 * (1 - 0.5 * k))} />
      ))}
      <rect x={76} y={46} width={8} height={12} fill={C.ink950} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Host row
// ---------------------------------------------------------------------------

/** Row height at rest and fully zoomed (s04 zooms the ADM-WS-02 row). */
export const ROW_H = 96;
export const ROW_ZOOM_H = 262;
export function rowHeight(zoom = 0): number {
  return mix(ROW_H, ROW_ZOOM_H, zoom);
}

export interface HostRowProps {
  host: ScopeHost;
  width: number;
  /** 0–1: the row appears (fade + slide). */
  show?: number;
  /** 0–1: the padlock drops (EDR isolation) and the time label follows. */
  lock?: number;
  /** 0–1: «encendido · memoria preservada». */
  power?: number;
  /** 0–1 emphasis of that chip. */
  powerGlow?: number;
  /** 0–1: «donde viven las llaves» (admin workstation). */
  keys?: number;
  /** 0–1: open padlock + «sin aislar» (s04). */
  open?: number;
  /** Label next to the open padlock. */
  openLabel?: string;
  /** 0–1: taller, larger type; shows `extra` under the main line. */
  zoom?: number;
  /** 0–1 step back. */
  dim?: number;
  /** 0–1 outline highlight (the row the voice is on). */
  glow?: number;
  glowTone?: string;
  /** Drawn under the main line when zoomed (row-local, starts at x = name column). */
  extra?: ReactNode;
}

/**
 * One host of the scope: icon tile, host name (mono) and role, then its state —
 * padlock + «aislado» + time, and the «encendido · memoria preservada» chip —
 * or, for ADM-WS-02, «donde viven las llaves».
 */
export function HostRow({
  host,
  width,
  show = 1,
  lock = 0,
  power = 0,
  powerGlow = 0,
  keys = 0,
  open = 0,
  openLabel,
  zoom = 0,
  dim = 0,
  glow = 0,
  glowTone = C.cyan,
  extra,
}: HostRowProps) {
  const z = clamp01(zoom);
  const h = rowHeight(z);
  const lineH = mix(ROW_H, 124, z);
  const sh = clamp01(show);
  const lk = clamp01(lock);
  const op = clamp01(open);
  const tile = mix(66, 88, z);
  const nameX = mix(112, 138, z);
  const colB = mix(560, 690, z);
  const colC = mix(1010, 1190, z);
  const borderTone = op > 0.02 ? C.amber : C.cyan;
  const borderA = Math.max(0.55 * lk, 0.7 * op, 0.9 * glow);
  const border = borderA > 0.01 ? alpha(glow > 0.02 && glow >= Math.max(lk, op) ? glowTone : borderTone, 0.25 + 0.6 * borderA) : C.ink700;
  const lockColor = C.cyan;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${border}`,
        background: `linear-gradient(90deg, ${alpha(lk > 0.02 ? C.cyan : op > 0.02 ? C.amber : C.ink700, 0.1 * Math.max(lk, op, 0.3))} 0%, ${alpha(C.ink900, 0.95)} 55%)`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(14 + 26 * glow)}px ${alpha(glowTone, 0.3 * glow)}` : undefined,
        fontFamily: FONT.sans,
        ...dimStyle(dim, sh),
        transform: sh < 1 ? `translateX(${(1 - sh) * 36}px)` : undefined,
      }}
    >
      {/* Icon tile */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: (lineH - tile) / 2,
          width: tile,
          height: tile,
          borderRadius: 16,
          display: 'grid',
          placeItems: 'center',
          background: alpha(host.keys ? C.amber : C.cyan, 0.12),
          border: `2px solid ${alpha(host.keys ? C.amber : C.cyan, 0.4)}`,
          boxSizing: 'border-box',
        }}
      >
        <Icon name={host.icon} size={Math.round(tile * 0.58)} color={host.keys ? C.amber : C.cyan} />
      </div>

      {/* Host + role */}
      <div style={{ position: 'absolute', left: nameX, top: 0, height: lineH, display: 'flex', flexDirection: 'column', justifyContent: 'center', whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: mix(44, 58, z), fontWeight: 800, color: C.textStrong, lineHeight: 1.08 }}>{host.host}</div>
        <div style={{ fontSize: mix(28, 34, z), fontWeight: 600, color: C.muted, lineHeight: 1.2, marginTop: 2 }}>{host.role}</div>
      </div>

      {/* State: padlock + «aislado» + time */}
      {host.isolated && lk > 0.001 ? (
        <div style={{ position: 'absolute', left: colB, top: 0, height: lineH, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
          <Padlock size={mix(54, 64, z)} drop={lk} color={lockColor} />
          <div style={{ opacity: clamp01(lk * 2 - 1) }}>
            <span style={{ fontSize: 34, fontWeight: 750, color: C.cyanSoft }}>{ISOLATED_LABEL}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.textStrong, marginLeft: 14 }}>{host.isolated}</span>
          </div>
        </div>
      ) : null}

      {/* «donde viven las llaves» */}
      {host.keys && keys > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: colB,
            top: 0,
            height: lineH,
            display: 'flex',
            alignItems: 'center',
            opacity: clamp01(keys),
            transform: `translateY(${(1 - clamp01(keys)) * 10}px)`,
          }}
        >
          <Chip accent="amber" icon="key" size={mix(30, 34, z)}>
            {KEYS_TAG}
          </Chip>
        </div>
      ) : null}

      {/* «encendido · memoria preservada» */}
      {host.isolated && power > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: colC,
            top: 0,
            height: lineH,
            display: 'flex',
            alignItems: 'center',
            opacity: clamp01(power),
            transform: `translateX(${(1 - clamp01(power)) * 16}px)`,
          }}
        >
          <Chip
            accent="emerald"
            icon="power"
            size={30}
            solid={powerGlow > 0.5}
            style={{ boxShadow: powerGlow > 0.02 ? `0 0 ${Math.round(24 * powerGlow)}px ${alpha(C.emerald, 0.45 * powerGlow)}` : undefined }}
          >
            {POWER_TAG}
          </Chip>
        </div>
      ) : null}

      {/* Open padlock + «sin aislar» (s04) */}
      {op > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: colC,
            top: 0,
            height: lineH,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, op * 1.4),
          }}
        >
          <Padlock size={mix(54, 66, z)} drop={1} open={op} color={C.amber} soft="#fcd34d" />
          {openLabel ? <span style={{ fontSize: mix(36, 48, z), fontWeight: 800, color: '#fcd34d' }}>{openLabel}</span> : null}
        </div>
      ) : null}

      {/* Zoomed extra (s04) */}
      {extra && z > 0.02 ? (
        <div style={{ position: 'absolute', left: nameX, top: lineH, right: 24, bottom: 12, opacity: clamp01(z * 1.5 - 0.5), overflow: 'hidden' }}>{extra}</div>
      ) : null}
    </div>
  );
}

/** Tops of N stacked rows (row-local heights from their zooms) from `top`, `gap` px apart. */
export function stackRows(zooms: readonly number[], top: number, gap: number): number[] {
  const tops: number[] = [];
  let y = top;
  for (const z of zooms) {
    tops.push(y);
    y += rowHeight(z) + gap;
  }
  return tops;
}
