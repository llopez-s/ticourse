import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui/Focus';
import { STEEL } from '../Pyramid';
import { S05_LAYOUT as L, S05_PHOTO_TITLE, S05_RIGHT_LINES, type LogHighlight } from '../../../data/s05-otra-ropa';

/** Colour of each kind of highlight: hash amber (la ropa), image steel (el acento), domain cyan (lo que sigue igual). */
export const MARK_TONE: Record<LogHighlight, string> = { hash: C.amber, image: STEEL, domain: C.cyan };

/**
 * A «photo» of the EDR: a print-like frame (light border, corner marks) with a
 * caption bar — camera glyph, «foto del EDR» and the date — over its content.
 */
export function PhotoFrame({
  width,
  height = L.photoH,
  date,
  glow = 0,
  glowTone = C.cyan,
  children,
}: {
  width: number;
  height?: number;
  date: string;
  glow?: number;
  glowTone?: string;
  children: ReactNode;
}) {
  const corner = 22;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        padding: L.pad,
        borderRadius: RADIUS.md,
        background: `linear-gradient(180deg, ${alpha('#1b2840', 0.98)} 0%, ${alpha(C.ink900, 0.98)} 100%)`,
        border: `3px solid ${alpha('#cbd5e1', 0.28 + 0.4 * glow)}`,
        boxShadow: `0 28px 60px ${alpha('#000000', 0.45)}${glow > 0.02 ? `, 0 0 ${Math.round(34 * glow)}px ${alpha(glowTone, 0.35 * glow)}` : ''}`,
        fontFamily: FONT.sans,
      }}
    >
      {/* corner marks of a print */}
      {[
        { left: 6, top: 6, b: 'borderLeft', c: 'borderTop' },
        { right: 6, top: 6, b: 'borderRight', c: 'borderTop' },
        { left: 6, bottom: 6, b: 'borderLeft', c: 'borderBottom' },
        { right: 6, bottom: 6, b: 'borderRight', c: 'borderBottom' },
      ].map(({ b, c, ...pos }, i) => (
        <div key={i} style={{ position: 'absolute', ...pos, width: corner, height: corner, [b]: `3px solid ${alpha('#e2e8f0', 0.55)}`, [c]: `3px solid ${alpha('#e2e8f0', 0.55)}` }} />
      ))}
      <div style={{ height: L.captionH, display: 'flex', alignItems: 'center', gap: 14, padding: '0 12px', marginBottom: 10 }}>
        <CameraGlyph size={34} color={C.text} />
        <span style={{ fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{S05_PHOTO_TITLE}</span>
        <span style={{ flex: 1 }} />
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 30,
            fontWeight: 700,
            color: C.textStrong,
            padding: '4px 14px',
            borderRadius: RADIUS.sm,
            background: alpha('#e2e8f0', 0.08),
            border: `2px solid ${alpha('#e2e8f0', 0.3)}`,
            whiteSpace: 'nowrap',
          }}
        >
          {date}
        </span>
      </div>
      {children}
    </div>
  );
}

function CameraGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round">
      <path d="M4 10 H10 L12 6 H20 L22 10 H28 V26 H4 Z" />
      <circle cx={16} cy={17} r={5} />
    </svg>
  );
}

/** One mono line with an optional coloured highlight (0–1). */
export function MarkLine({
  text,
  size,
  tone,
  mark = 0,
  dim = 0,
  muted = false,
  strong = false,
}: {
  text: string;
  size: number;
  tone?: string;
  mark?: number;
  dim?: number;
  muted?: boolean;
  strong?: boolean;
}) {
  const m = clamp01(mark);
  return (
    <div style={{ display: 'flex', opacity: 1 - 0.55 * clamp01(dim) * (1 - m) }}>
      <span
        style={{
          fontFamily: FONT.mono,
          fontSize: size,
          fontWeight: strong || m > 0.05 ? 700 : 500,
          lineHeight: 1.3,
          padding: '0 8px',
          borderRadius: 6,
          whiteSpace: 'pre',
          color: m > 0.05 && tone ? tone : muted ? C.muted : C.text,
          background: tone && m > 0 ? alpha(tone, 0.16 * m) : undefined,
          boxShadow: tone && m > 0 ? `0 0 0 3px ${alpha(tone, 0.85 * m)}, 0 0 ${Math.round(20 * m)}px ${alpha(tone, 0.4 * m)}` : undefined,
        }}
      >
        {text}
      </span>
    </div>
  );
}

/**
 * The 05-03 photo's content: the EDR lines of V3 (heads small and muted,
 * details larger). `marks` lights the image / hash / domain lines; `appear`
 * (0–1) types the lines in top-down; `scan` (0–1, or < 0 for none) is the
 * hash rule's sweep line across the panel.
 */
export function RightLog({
  width,
  height,
  marks,
  dim = 0,
  appear = 1,
  scan = -1,
}: {
  width: number;
  height: number;
  marks: Partial<Record<LogHighlight, number>>;
  dim?: number;
  appear?: number;
  scan?: number;
}) {
  const n = S05_RIGHT_LINES.length;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        padding: '20px 18px',
        borderRadius: RADIUS.md,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        overflow: 'hidden',
      }}
    >
      {S05_RIGHT_LINES.map((l, i) => {
        const p = clamp01(appear * (n + 2) - i);
        return (
          <div key={i} style={{ opacity: p, transform: `translateX(${(1 - p) * -12}px)`, paddingLeft: l.kind === 'detail' ? 10 : 0 }}>
            <MarkLine
              text={l.text}
              size={l.kind === 'head' ? 24 : 32}
              muted={l.kind === 'head'}
              strong={l.kind === 'detail'}
              tone={l.mark ? MARK_TONE[l.mark] : undefined}
              mark={l.mark ? (marks[l.mark] ?? 0) : 0}
              dim={dim}
            />
          </div>
        );
      })}
      {scan >= 0 && scan <= 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 8 + scan * (height - 16),
            height: 4,
            background: `linear-gradient(90deg, transparent 0%, ${C.amber} 20%, ${C.amber} 80%, transparent 100%)`,
            boxShadow: `0 0 18px ${alpha(C.amber, 0.7)}`,
          }}
        />
      ) : null}
    </div>
  );
}
