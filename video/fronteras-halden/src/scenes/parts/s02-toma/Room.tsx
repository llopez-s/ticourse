import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { INK } from '../glyphs';

/**
 * s02-toma's room pieces: the date strip, the training room's wall, the test laptop (its screen holds the
 * console), a console line, and the analyst's handwritten note. Nothing positions itself.
 */

// ---------------------------------------------------------------------------
// Date strip (V16's s01 stamp look)

export function DateStrip({ parts, opacity = 1, style }: { parts: readonly ReactNode[]; opacity?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: 64,
        padding: '0 28px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.7)}`,
        background: alpha(C.cyan, 0.1),
        fontFamily: FONT.sans,
        fontSize: 36,
        whiteSpace: 'nowrap',
        opacity,
        ...style,
      }}
    >
      <Icon name="clock" size={36} color={C.cyan} />
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          {i ? <span style={{ fontWeight: 700, color: C.faint }}>·</span> : null}
          {p}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The wall of the training room

/**
 * A stretch of wall seen from the front: plaster panels, a baseboard and the floor line; slate (it belongs to
 * nobody). `width` × `height` px; children (the socket, labels) are positioned by the caller, wall-local px.
 */
export function Wall({ width, height, children, style }: { width: number; height: number; children?: ReactNode; style?: CSSProperties }) {
  const base = 26;
  const panels = 4;
  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="s02-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.ink850} stopOpacity={0.35} />
            <stop offset="1" stopColor={C.ink800} stopOpacity={0.95} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={width} height={height - base} rx={10} fill="url(#s02-wall)" stroke={alpha(INK.struct, 0.6)} strokeWidth={2} />
        {Array.from({ length: panels - 1 }, (_, i) => (
          <line key={i} x1={((i + 1) * width) / panels} y1={14} x2={((i + 1) * width) / panels} y2={height - base - 4} stroke={alpha(INK.struct, 0.22)} strokeWidth={2} />
        ))}
        <rect x={0} y={height - base - 4} width={width} height={base} rx={4} fill={C.ink800} stroke={alpha(INK.struct, 0.8)} strokeWidth={2} />
        <line x1={-30} y1={height} x2={width + 60} y2={height} stroke={alpha(INK.struct, 0.7)} strokeWidth={3} />
      </svg>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The laptop

/**
 * The test laptop from the front: a screen `width` × `height` px (bezel included) and its keyboard base under
 * it (`LAPTOP_BASE_H` px, 40 px wider on each side). `on` 0–1 lights the screen; the screen's content is
 * `children` (positioned inside the screen area, px from its inner top-left).
 */
export const LAPTOP_BASE_H = 36;
export const LAPTOP_BEZEL = 16;

export function Laptop({ width, height, on = 1, glow = 0, children }: { width: number; height: number; on?: number; glow?: number; children?: ReactNode }) {
  const o = clamp01(on);
  const g = clamp01(glow);
  return (
    <div style={{ position: 'relative', width, height: height + LAPTOP_BASE_H }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height,
          boxSizing: 'border-box',
          borderRadius: 22,
          border: `4px solid ${mixBezel(o)}`,
          background: C.ink950,
          padding: LAPTOP_BEZEL - 4,
          boxShadow: `0 0 ${Math.round(10 + 40 * g)}px ${alpha(C.cyan, 0.12 + 0.3 * g)}`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 10,
            overflow: 'hidden',
            background: `linear-gradient(180deg, ${alpha(C.ink850, 0.6 + 0.4 * o)} 0%, ${C.ink900} 100%)`,
            border: `2px solid ${alpha(C.cyan, 0.12 + 0.3 * o)}`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, opacity: o }}>{children}</div>
        </div>
      </div>
      <svg width={width + 80} height={LAPTOP_BASE_H} style={{ position: 'absolute', left: -40, top: height - 2, overflow: 'visible' }}>
        <path d={`M 40 0 L ${width + 40} 0 L ${width + 80} ${LAPTOP_BASE_H - 10} Q ${width + 80} ${LAPTOP_BASE_H} ${width + 68} ${LAPTOP_BASE_H} L 12 ${LAPTOP_BASE_H} Q 0 ${LAPTOP_BASE_H} 0 ${LAPTOP_BASE_H - 10} Z`} fill={C.ink800} stroke={alpha(INK.steel, 0.7)} strokeWidth={3} strokeLinejoin="round" />
        <rect x={width / 2 + 40 - 70} y={6} width={140} height={8} rx={4} fill={alpha(INK.steel, 0.25)} />
      </svg>
    </div>
  );
}

function mixBezel(o: number) {
  return o > 0.5 ? alpha(C.cyan, 0.35 + 0.25 * o) : alpha(INK.steel, 0.55);
}

/** The console's title bar inside the screen: a terminal icon and the host name (34 px mono). */
export function ConsoleBar({ host }: { host: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        height: 64,
        padding: '0 22px',
        borderBottom: `2px solid ${alpha(C.cyan, 0.25)}`,
        background: alpha(C.cyan, 0.07),
        fontFamily: FONT.mono,
        fontSize: 34,
        fontWeight: 750,
        color: C.cyanSoft,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="terminal" size={32} color={C.cyan} />
      {host}
    </div>
  );
}

/**
 * One console output line (mono 40 px). `show` 0–1 prints it; `hot` 0–1 highlights it (tinted row, brighter
 * text) — the line the voice is on.
 */
export function ConsoleLine({ text, show = 1, hot = 0, color = C.text }: { text: ReactNode; show?: number; hot?: number; color?: string }) {
  const s = clamp01(show);
  const h = clamp01(hot);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 66,
        padding: '0 18px',
        borderRadius: 10,
        background: alpha(C.cyan, 0.13 * h),
        border: `2px solid ${alpha(C.cyan, 0.5 * h)}`,
        fontFamily: FONT.mono,
        fontSize: 40,
        fontWeight: 700,
        color,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 8}px)`,
      }}
    >
      <span style={{ width: 10, height: 34, borderRadius: 3, background: alpha(C.cyan, 0.55) }} />
      {text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The analyst's note

/**
 * The analyst's own note (written by hand, not printed by the laptop): a paper slip with a strip of tape,
 * dark italic ink on two lines. `show` 0–1 sticks it on (drops in and settles at `rotate` degrees).
 */
export function StickyNote({ lines, show = 1, rotate = 3, size = 44 }: { lines: readonly string[]; show?: number; rotate?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '24px 26px 20px',
        background: 'linear-gradient(180deg, #f6edd5 0%, #ece0bf 100%)',
        borderRadius: 6,
        boxShadow: `0 10px 26px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        fontStyle: 'italic',
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.08,
        letterSpacing: -0.5,
        color: '#1e293b',
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `rotate(${rotate + (1 - s) * 6}deg) translateY(${(1 - s) * -14}px) scale(${1.06 - 0.06 * s})`,
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: -12, width: 92, height: 26, transform: 'translateX(-50%) rotate(-4deg)', background: alpha('#e2e8f0', 0.45), borderRadius: 3 }} />
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  );
}
