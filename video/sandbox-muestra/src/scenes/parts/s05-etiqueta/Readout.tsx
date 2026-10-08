import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * s05's big readout of the static line the voice is on (≥ 32 px, the report band
 * above stays as texture): the value in mono, a caption, an optional chip, and an
 * exam-name slot on the right. Every input is a 0–1 weight from the scene.
 */
export function Readout({
  width,
  p,
  tone,
  value,
  caption,
  captionP = 1,
  chip,
  chipTone,
  chipP = 1,
  name,
  minHeight,
  style,
}: {
  width: number;
  p: number;
  /** Accent of the card (the line's meaning: amber fragile, emerald links…). */
  tone: string;
  value: ReactNode;
  caption?: ReactNode;
  captionP?: number;
  chip?: string;
  chipTone?: string;
  chipP?: number;
  name?: ReactNode;
  minHeight?: number;
  style?: CSSProperties;
}) {
  const k = clamp01(p);
  if (k <= 0.001) return null;
  const cp = clamp01(captionP);
  const hp = clamp01(chipP);
  const ct = chipTone ?? tone;
  return (
    <div
      style={{
        position: 'relative',
        width,
        minHeight,
        boxSizing: 'border-box',
        padding: '22px 30px 24px 34px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.55)}`,
        background: `linear-gradient(90deg, ${alpha(tone, 0.12)} 0%, ${alpha(C.ink900, 0.94)} 62%)`,
        boxShadow: `0 24px 60px ${alpha('#000000', 0.35)}, inset 6px 0 0 ${alpha(tone, 0.9)}`,
        fontFamily: FONT.sans,
        opacity: k,
        transform: `translateY(${(1 - k) * 18}px)`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', minHeight: 62 }}>{value}</div>
      {caption ? (
        <div
          style={{
            marginTop: 10 * Math.min(1, cp * 2),
            maxHeight: Math.round(64 * Math.min(1, cp * 2)),
            overflow: 'hidden',
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.18,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: cp,
            transform: `translateY(${(1 - cp) * 10}px)`,
          }}
        >
          {caption}
        </div>
      ) : null}
      {chip ? (
        <div
          style={{
            marginTop: 16 * Math.min(1, hp * 2),
            maxHeight: Math.round(90 * Math.min(1, hp * 2)),
            overflow: 'hidden',
            opacity: hp,
            transform: `scale(${0.9 + 0.1 * hp})`,
            transformOrigin: 'left center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              borderRadius: RADIUS.pill,
              border: `3px solid ${ct}`,
              background: alpha(ct, 0.16),
              color: C.textStrong,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: -0.3,
              whiteSpace: 'nowrap',
              boxShadow: `0 0 ${Math.round(22 * hp)}px ${alpha(ct, 0.35)}`,
            }}
          >
            {chip}
          </span>
        </div>
      ) : null}
      {name ? <div style={{ position: 'absolute', right: 34, top: 16 }}>{name}</div> : null}
    </div>
  );
}

/** A mono `key value` line for the readout: key muted, value in its colour. */
export function MonoValue({ k, sep = ' ', value, color, size = 48 }: { k: string; sep?: string; value: ReactNode; color: string; size?: number }) {
  return (
    <span style={{ fontFamily: FONT.mono, fontSize: size, fontWeight: 700, whiteSpace: 'pre', letterSpacing: -0.5 }}>
      <span style={{ color: C.muted }}>{k}</span>
      <span style={{ color: C.faint }}>{sep}</span>
      <span style={{ color }}>{value}</span>
    </span>
  );
}

/**
 * Exam-term entrance: the English name big, upper case, violet (= exam), with an
 * optional gloss under it. `at` is the frame it lands.
 */
export function ExamName({ en, gloss, at, frame, fps, size = 72, align = 'flex-end' }: { en: string; gloss?: string; at: number; frame: number; fps: number; size?: number; align?: 'flex-start' | 'flex-end' | 'center' }) {
  if (frame < at - 1) return null;
  const sp = springIn(frame, fps, at, { damping: 15, mass: 0.7 });
  const glow = 1 - progress(frame, at + 16, 40, EASE.inOut);
  const gp = progress(frame, at + 8, 14);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, gap: 4, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div
        style={{
          fontSize: size,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: 3,
          color: '#c4b5fd',
          opacity: Math.min(1, sp * 1.4),
          transform: `scale(${0.85 + 0.15 * Math.min(1.05, sp)})`,
          transformOrigin: align === 'flex-end' ? 'right center' : align === 'center' ? 'center' : 'left center',
          textShadow: `0 0 ${Math.round(18 + 22 * glow)}px ${alpha(C.violet, 0.35 + 0.3 * glow)}`,
        }}
      >
        {en}
      </div>
      {gloss ? <div style={{ fontSize: 34, fontWeight: 700, color: C.text, opacity: gp }}>{gloss}</div> : null}
    </div>
  );
}
