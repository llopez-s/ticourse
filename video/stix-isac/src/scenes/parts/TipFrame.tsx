import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress, pulse } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * Meridian's threat intelligence platform (TIP): a window with the title bar
 * «Plataforma de inteligencia · Meridian Dynamics» and a date chip
 * «02-07-2026» (cyan: Meridian's own platform). Generic body: callers draw
 * inside it (s01/s03 the incoming card, s04 the graph).
 *
 * `width`/`height` are the window's size at scale 1; children use body-local
 * coordinates (TIP_HEADER_H below the window's top). `scale` shrinks the
 * whole window — children included — from its top-left. All frames are
 * Sequence-relative; `frame` defaults to useCurrentFrame().
 */

export const TIP_TEXT = {
  title: 'Plataforma de inteligencia · Meridian Dynamics',
  date: '02-07-2026',
} as const;

export const TIP_HEADER_H = 76;

/**
 * Title size that fits the whole title beside the date chip: 30 px when the
 * window is wide enough, smaller (never under 20) when it is not, so the title
 * is never cut. Fixed parts: paddings, icon, gaps and the date chip.
 */
function titleSize(width: number): number {
  const fixed = 26 + 36 + 16 + 16 + 290 + 22;
  const em = TIP_TEXT.title.length * 0.56;
  return Math.max(20, Math.min(30, (width - fixed) / em));
}

/** Body box in px (window-local, at scale 1) of a TipFrame of this size. */
export function tipBody(width: number, height: number): { x: number; y: number; w: number; h: number } {
  return { x: 0, y: TIP_HEADER_H, w: width, h: height - TIP_HEADER_H };
}

/** Small calendar page (stroke), for the date chip. */
export function CalendarGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h2M12 14h2M16 14h.01M8 17.2h2M12 17.2h2" />
    </svg>
  );
}

export function TipFrame({
  width,
  height,
  scale = 1,
  at,
  dim = 0,
  chromeDim = 0,
  glow = 0,
  dateGlow = 0,
  frame: frameProp,
  children,
  style,
}: {
  width: number;
  height: number;
  /** Shrinks the window (and its body) from the top-left. */
  scale?: number;
  /** Frame the window opens. Undefined: already on screen. */
  at?: number;
  /** 0–1: steps the whole window back, children included. */
  dim?: number;
  /** 0–1: dims only the title bar and the empty body texture (the card on top stays lit). */
  chromeDim?: number;
  /** 0–1: cyan halo around the window. */
  glow?: number;
  /** 0–1: the date chip lights up (the voice says the date). */
  dateGlow?: number;
  frame?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;
  const g = clamp01(glow);
  const dg = clamp01(dateGlow);
  const d = clamp01(dim);
  const cd = clamp01(chromeDim);
  const beat = 0.8 + 0.2 * pulse(frame, fps, 0.6);

  return (
    <div
      style={{
        position: 'relative',
        width: width * scale,
        height: height * scale,
        opacity: show * (1 - 0.6 * d),
        filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height,
          transform: `scale(${scale}) translateY(${(1 - show) * 18}px)`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px solid ${g > 0 ? alpha(C.cyan, 0.35 + 0.5 * g) : C.ink600}`,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}${g > 0 ? `, 0 0 ${26 + 30 * g}px ${alpha(C.cyan, 0.3 * g)}` : ''}`,
          overflow: 'hidden',
          fontFamily: FONT.sans,
        }}
      >
        {/* Body texture: a faint grid, the platform's canvas. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TIP_HEADER_H,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(${alpha(C.ink700, 0.5)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(C.ink700, 0.5)} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            opacity: 0.55 * (1 - 0.6 * cd),
          }}
        />

        {/* Title bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            height: TIP_HEADER_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 22px 0 26px',
            background: alpha(C.ink800, 0.95),
            borderBottom: `2px solid ${C.ink700}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0, opacity: 1 - 0.55 * cd }}>
            <Icon name="radar" size={36} color={C.cyan} />
            <span style={{ fontSize: titleSize(width), fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{TIP_TEXT.title}</span>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              height: 54,
              padding: '0 18px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.cyan, 0.45 + 0.5 * dg)}`,
              background: alpha(C.cyan, 0.08 + 0.14 * dg),
              boxShadow: dg > 0 ? `0 0 ${Math.round(26 * dg * beat)}px ${alpha(C.cyan, 0.45 * dg)}` : undefined,
              opacity: Math.max(1 - 0.55 * cd, dg),
              flexShrink: 0,
            }}
          >
            <CalendarGlyph size={32} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: dg > 0.3 ? C.textStrong : C.cyanSoft, whiteSpace: 'nowrap' }}>{TIP_TEXT.date}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ position: 'absolute', left: 0, top: TIP_HEADER_H, width, height: height - TIP_HEADER_H }}>{children}</div>
      </div>
    </div>
  );
}
