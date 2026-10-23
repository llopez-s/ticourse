import type { CSSProperties, ReactNode } from 'react';
import { ACCENT, C, FONT, alpha, type Accent } from '../../../../engine/src/theme/tokens';

/**
 * The comanda: a paper order slip with a torn zig-zag bottom, drawn as an SVG outline with the content laid over
 * it. `question` (0–1) fades in the big «?» of the blank slip nobody wrote; `grey` is the vague order that says
 * nothing; `tone` + `glow` highlight the one that does. Content goes in `children` (below the «COMANDA» header).
 *
 * <Ticket width height title? tone? glow? grey? question? show? dim? style?>children</Ticket>
 */
export function Ticket({
  width,
  height,
  title = 'COMANDA',
  tone = 'cyan',
  glow = 0,
  grey = false,
  question = 0,
  show = 1,
  dim = 0,
  children,
  style,
}: {
  width: number;
  height: number;
  title?: string | null;
  tone?: Accent;
  glow?: number;
  grey?: boolean;
  question?: number;
  show?: number;
  dim?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  if (show <= 0.001) return null;
  const a = ACCENT[grey ? 'muted' : tone];
  const tooth = 20;
  const depth = 12;
  const n = Math.max(2, Math.round(width / tooth));
  const dx = width / n;
  let zig = '';
  for (let i = n - 1; i >= 0; i--) zig += ` L ${((i + 0.5) * dx).toFixed(1)} ${height} L ${(i * dx).toFixed(1)} ${height - depth}`;
  const d = `M 0 0 H ${width} V ${height - depth}${zig} Z`;
  const edge = grey ? alpha(C.muted, 0.5) : alpha(a.fg, 0.5 + 0.45 * glow);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        fontFamily: FONT.sans,
        opacity: show * (1 - 0.55 * dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        transform: `translateY(${(1 - show) * 16}px)`,
        ...style,
      }}
    >
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${alpha(a.fg, 0.45 * glow)})` : `drop-shadow(0 16px 26px ${alpha('#000000', 0.4)})` }} aria-hidden>
        <path d={d} fill={grey ? alpha(C.ink800, 0.95) : alpha(C.ink850, 0.98)} stroke={edge} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M 18 56 H ${width - 18}`} stroke={alpha(grey ? C.muted : a.fg, 0.28)} strokeWidth={2} strokeDasharray="6 8" />
      </svg>
      {title ? (
        <div style={{ position: 'absolute', left: 24, top: 14, fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, letterSpacing: 5, color: grey ? C.faint : a.soft, whiteSpace: 'nowrap' }}>{title}</div>
      ) : null}
      <div style={{ position: 'absolute', left: 24, right: 24, top: title ? 70 : 24, bottom: depth + 14 }}>{children}</div>
      {question > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: title ? 40 : 0, width, height: height - (title ? 40 : 0) - depth, display: 'grid', placeItems: 'center', opacity: question, transform: `scale(${0.8 + 0.2 * question})` }}>
          <span style={{ fontSize: Math.round(Math.min(width, height) * 0.62), fontWeight: 900, color: alpha(C.amber, 0.9), lineHeight: 1, textShadow: `0 0 36px ${alpha(C.amber, 0.35)}` }}>?</span>
        </div>
      ) : null}
    </div>
  );
}

/** Scribbled order lines: grey bars standing for handwriting (no readable order). */
export function Scribbles({ widths = [0.9, 0.7, 0.8, 0.5], color = C.ink500, show = 1, rowH = 26 }: { widths?: readonly number[]; color?: string; show?: number; rowH?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: rowH * 0.6, opacity: show }}>
      {widths.map((w, i) => (
        <div key={i} style={{ width: `${w * 100}%`, height: rowH * 0.42, borderRadius: rowH, background: color }} />
      ))}
    </div>
  );
}
