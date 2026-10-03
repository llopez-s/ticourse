import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, tone as toneOf, type IconName, type Tone } from '../../../../engine/src/ui';

/**
 * The vault console of s09 and s10: a window with the title bar
 * «bóveda de Sistemas» (vault icon) and a free body. Helpers for its content:
 * `VaultTable` (columns + rows whose cells appear on their own frames),
 * `VaultField` (a «label: value» form row) and `VaultLog` (the access log,
 * typed in mono). All frames are Sequence-relative; every `frame` prop
 * defaults to useCurrentFrame(). Sizes are in px (no scaling).
 */

export const VAULT_TITLE = 'bóveda de Sistemas';
export const VAULT_BAR_H = 72;

export function VaultConsole({
  width,
  height,
  title = VAULT_TITLE,
  right,
  at,
  glow = 0,
  tone = 'cyan',
  dim = 0,
  frame: frameProp,
  children,
  style,
  bodyStyle,
}: {
  width: number;
  height: number;
  title?: string;
  /** Right side of the title bar (a chip). */
  right?: ReactNode;
  /** Frame the console appears (fade + rise). Undefined: already on screen. */
  at?: number;
  /** 0–1 halo (the console the voice is on). */
  glow?: number;
  tone?: Tone;
  /** 0–1 step-back. */
  dim?: number;
  frame?: number;
  children?: ReactNode;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { fps } = useVideoConfig();
  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;
  const t = toneOf(tone);
  const g = clamp01(glow) * (0.8 + 0.2 * pulse(frame, fps, 0.5));
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${g > 0.02 ? alpha(t.fg, 0.35 + 0.5 * g) : C.ink600}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}${g > 0.02 ? `, 0 0 ${24 + 30 * g}px ${alpha(t.fg, 0.3 * g)}` : ''}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - show) * 18}px)`,
        ...style,
        ...dimStyle(dim, show),
      }}
    >
      <div
        style={{
          height: VAULT_BAR_H,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 26px',
          borderBottom: `2px solid ${C.ink700}`,
          background: alpha(C.ink800, 0.95),
        }}
      >
        <VaultGlyph size={44} color={t.fg} />
        <span style={{ flex: 1, fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.3 }}>{title}</span>
        {right}
      </div>
      <div style={{ position: 'relative', height: height - VAULT_BAR_H - 4, ...bodyStyle }}>{children}</div>
    </div>
  );
}

/** A vault door (round dial with spokes) — the console's icon, also usable alone. */
export function VaultGlyph({ size = 44, color = C.cyan, spin = 0 }: { size?: number; color?: string; spin?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0, display: 'block' }}>
      <rect x={3} y={3} width={42} height={42} rx={8} fill={alpha(color, 0.12)} stroke={color} strokeWidth={3} />
      <g transform={`rotate(${spin * 360} 24 24)`}>
        <circle cx={24} cy={24} r={11} fill="none" stroke={color} strokeWidth={3} />
        <path d="M 24 9 L 24 15 M 24 33 L 24 39 M 9 24 L 15 24 M 33 24 L 39 24" stroke={color} strokeWidth={3} strokeLinecap="round" />
        <circle cx={24} cy={24} r={3} fill={color} />
      </g>
    </svg>
  );
}

export interface VaultColumn {
  id: string;
  label: ReactNode;
  /** Column width in px. */
  width: number;
  /** Frame the header appears. Undefined: with the table. */
  at?: number;
  /** 0–1: the header is highlighted (the voice is on this column). */
  focus?: number;
  align?: 'left' | 'center';
}

export interface VaultRow {
  id: string;
  cells: Partial<Record<string, ReactNode>>;
  /** Frame the row slides in. Undefined: already there. */
  at?: number;
  /** Per-cell appear frames (overrides the row's). */
  cellAt?: Partial<Record<string, number>>;
  /** 0–1: highlighted row. */
  focus?: number;
  /** 0–1: stepped back. */
  dim?: number;
  /** Accent of the row's edge and highlight. */
  tone?: Tone;
}

export function VaultTable({
  columns,
  rows,
  rowH = 66,
  headH = 50,
  gap = 10,
  padX = 22,
  frame: frameProp,
  style,
}: {
  columns: VaultColumn[];
  rows: VaultRow[];
  rowH?: number;
  headH?: number;
  gap?: number;
  padX?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const lefts: number[] = [];
  columns.reduce((x, c) => {
    lefts.push(x);
    return x + c.width;
  }, padX);
  const totalW = padX * 2 + columns.reduce((a, c) => a + c.width, 0);
  return (
    <div style={{ position: 'relative', width: totalW, height: headH + rows.length * (rowH + gap), ...style }}>
      {columns.map((c, i) => {
        const p = c.at === undefined ? 1 : progress(frame, c.at, 12);
        if (p <= 0) return null;
        const f = clamp01(c.focus ?? 0);
        return (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: lefts[i],
              top: 0,
              width: c.width,
              height: headH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: c.align === 'center' ? 'center' : 'flex-start',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 0.3,
              whiteSpace: 'nowrap',
              color: f > 0.05 ? C.cyanSoft : C.muted,
              textShadow: f > 0.05 ? `0 0 16px ${alpha(C.cyan, 0.5 * f)}` : undefined,
              opacity: p,
              transform: `translateY(${(1 - p) * 8}px)`,
            }}
          >
            {c.label}
          </div>
        );
      })}
      {rows.map((r, k) => {
        const p = r.at === undefined ? 1 : progress(frame, r.at, 14);
        if (p <= 0) return null;
        const t = toneOf(r.tone ?? 'cyan');
        const f = clamp01(r.focus ?? 0);
        return (
          <div
            key={r.id}
            style={{
              position: 'absolute',
              left: padX - 12,
              top: headH + k * (rowH + gap),
              width: totalW - 2 * padX + 24,
              height: rowH,
              boxSizing: 'border-box',
              borderRadius: RADIUS.sm,
              border: `2px solid ${alpha(t.fg, 0.16 + 0.6 * f)}`,
              background: f > 0.02 ? `linear-gradient(90deg, ${alpha(t.fg, 0.14 * f)} 0%, ${alpha(C.ink850, 0.95)} 70%)` : alpha(C.ink850, 0.9),
              boxShadow: f > 0.02 ? `0 0 ${Math.round(24 * f)}px ${alpha(t.fg, 0.25 * f)}` : undefined,
              transform: `translateX(${(1 - p) * 24}px)`,
              ...dimStyle(r.dim ?? 0, p),
            }}
          >
            {columns.map((c, i) => {
              const cAt = r.cellAt?.[c.id];
              const cp = cAt === undefined ? 1 : progress(frame, cAt, 12);
              const content = r.cells[c.id];
              if (content === undefined || cp <= 0) return null;
              return (
                <div
                  key={c.id}
                  style={{
                    position: 'absolute',
                    left: lefts[i] - (padX - 12),
                    top: 0,
                    width: c.width,
                    height: rowH - 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: c.align === 'center' ? 'center' : 'flex-start',
                    whiteSpace: 'nowrap',
                    opacity: cp,
                    transform: `scale(${0.9 + 0.1 * cp})`,
                    transformOrigin: c.align === 'center' ? 'center' : 'left center',
                  }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/** One «label: value» row of a form (s10's request). */
export function VaultField({
  label,
  value,
  at,
  icon,
  tone = 'cyan',
  mono = false,
  size = 36,
  labelW = 190,
  focus = 0,
  frame: frameProp,
  style,
}: {
  label: string;
  value: ReactNode;
  at?: number;
  icon?: IconName;
  tone?: Tone;
  mono?: boolean;
  size?: number;
  labelW?: number;
  focus?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const p = at === undefined ? 1 : progress(frame, at, 14);
  if (p <= 0) return null;
  const t = toneOf(tone);
  const f = clamp01(focus);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateX(${(1 - p) * 18}px)`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.95)} color={t.fg} /> : null}
      <span style={{ width: labelW, flexShrink: 0, fontSize: size * 0.86, fontWeight: 650, color: C.muted }}>{label}</span>
      <span
        style={{
          fontFamily: mono ? FONT.mono : FONT.sans,
          fontSize: size,
          fontWeight: 800,
          color: f > 0.3 ? t.soft : C.textStrong,
          textShadow: f > 0.05 ? `0 0 16px ${alpha(t.fg, 0.45 * f)}` : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/** The access log: mono lines typed out from their frames (texture, 22–26 px). */
export function VaultLog({
  lines,
  size = 24,
  pitch = 34,
  frame: frameProp,
  style,
}: {
  lines: { text: string; at?: number; tone?: Tone }[];
  size?: number;
  pitch?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  return (
    <div style={{ position: 'relative', height: lines.length * pitch, fontFamily: FONT.mono, ...style }}>
      {lines.map((l, i) => {
        const p = l.at === undefined ? 1 : progress(frame, l.at, 16, EASE.linear);
        if (p <= 0) return null;
        const n = Math.ceil(l.text.length * p);
        const t = l.tone ? toneOf(l.tone) : null;
        return (
          <div key={i} style={{ position: 'absolute', left: 0, top: i * pitch, fontSize: size, fontWeight: 600, color: t ? t.soft : C.muted, whiteSpace: 'nowrap' }}>
            {l.text.slice(0, n)}
          </div>
        );
      })}
    </div>
  );
}
