import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, tone as toneOf, type IconName, type Tone } from '../../../../../engine/src/ui';

/**
 * Small helpers shared by scene builder B's scenes (s05–s09): view weights for
 * the hand-over between the scene's images, absolute placement in stage
 * coordinates, the exam-term name card and the one-line strip.
 */

/** A frame far enough in the future to keep a Matrix reveal hidden (finite: interpolate rejects Infinity). */
export const NEVER = 1_000_000;

/**
 * Weight (0–1) of a view that is on screen from `from` to `to`: it fades in
 * over `inFrames` from `from` (omitted: already on screen) and fades out over
 * the `outFrames` that end at `to` + 4 (omitted: stays). Outgoing and incoming
 * views overlap by a few frames on the cue.
 */
export function viewWeight(frame: number, from?: number, to?: number, inFrames = 14, outFrames = 12): number {
  const a = from === undefined ? 1 : progress(frame, from, inFrames, EASE.out);
  const b = to === undefined ? 0 : progress(frame, to + 4 - outFrames, outFrames, EASE.inOut);
  return a * (1 - b);
}

/** Absolutely placed box (stage coordinates); renders nothing at opacity 0. */
export function Place({ x, y, opacity = 1, children, style }: { x: number; y: number; opacity?: number; children: ReactNode; style?: CSSProperties }) {
  if (opacity <= 0.001) return null;
  return <div style={{ position: 'absolute', left: x, top: y, opacity, ...style }}>{children}</div>;
}

/**
 * Mask that fades the top `band` px of a box to `keep` opacity (0–1), the
 * rest untouched. Used to lift a Matrix's title + legend bands out of the way
 * of the think prompt. Returns {} when nothing is faded (the mask would clip
 * shadows and overhangs).
 */
export function topFadeMask(band: number, keep: number): CSSProperties {
  if (keep >= 0.999 || band <= 0) return {};
  const k = clamp01(keep);
  const g = `linear-gradient(to bottom, rgba(0,0,0,${k}) 0px, rgba(0,0,0,${k}) ${band}px, #000 ${band + 2}px, #000 100%)`;
  return { maskImage: g, WebkitMaskImage: g };
}

/**
 * Exam-term name card: the Spanish name small on top, the exam term (English,
 * violet = exam) big under it. `esAt` / `enAt` are the frames each lands.
 */
export function TermName({
  es,
  en,
  esAt,
  enAt,
  frame,
  fps,
  enSize = 84,
  align = 'center',
  style,
}: {
  es: string;
  en: string;
  esAt: number;
  enAt: number;
  frame: number;
  fps: number;
  enSize?: number;
  align?: 'center' | 'left';
  style?: CSSProperties;
}) {
  const esP = progress(frame, esAt, 14);
  const enP = frame < enAt ? 0 : springIn(frame, fps, enAt, { damping: 15, mass: 0.7 });
  const glow = 1 - progress(frame, enAt + 16, 40, EASE.inOut);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 6, fontFamily: FONT.sans, whiteSpace: 'nowrap', ...style }}>
      <div style={{ fontSize: 40, fontWeight: 750, color: C.text, opacity: esP, transform: `translateY(${(1 - esP) * 10}px)`, letterSpacing: 0.3 }}>{es}</div>
      <div
        style={{
          fontSize: enSize,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: 4,
          color: '#c4b5fd',
          opacity: Math.min(1, enP * 1.4),
          transform: `scale(${0.85 + 0.15 * Math.min(1.05, enP)})`,
          textShadow: `0 0 ${Math.round(18 + 22 * glow)}px ${alpha(C.violet, 0.35 + 0.3 * glow)}`,
        }}
      >
        {en}
      </div>
    </div>
  );
}

/**
 * One-line strip (a rule or a pointer): dark pill with a coloured border, an
 * optional icon disc and the text. `p` is its 0–1 entrance.
 */
export function Strip({
  children,
  tone = 'cyan',
  icon,
  size = 42,
  p = 1,
  glow = 0,
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: IconName | ReactNode;
  size?: number;
  p?: number;
  glow?: number;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  const k = clamp01(p);
  if (k <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 20,
        padding: `14px 32px 14px ${icon ? 16 : 32}px`,
        borderRadius: RADIUS.lg,
        background: alpha(C.ink900, 0.94),
        border: `3px solid ${alpha(t.fg, 0.8)}`,
        boxShadow: `0 18px 40px ${alpha('#000000', 0.45)}, 0 0 ${Math.round(20 + 24 * g)}px ${alpha(t.fg, 0.18 + 0.3 * g)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: k,
        transform: `translateY(${(1 - k) * 16}px)`,
        ...style,
      }}
    >
      {icon ? (
        <div style={{ flexShrink: 0, width: size * 1.35, height: size * 1.35, borderRadius: '50%', display: 'grid', placeItems: 'center', background: alpha(t.fg, 0.16), border: `2px solid ${alpha(t.fg, 0.7)}` }}>
          {typeof icon === 'string' ? <Icon name={icon as IconName} size={size * 0.78} color={t.soft} strokeWidth={2.2} /> : icon}
        </div>
      ) : null}
      <span>{children}</span>
    </div>
  );
}
