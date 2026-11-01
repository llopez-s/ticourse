import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { ACCENT, C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';
import { QUALIFIERS, type Qualifier, type QualifierId } from '../../data/qualifiers';
import { BAND } from './QuestionBand';

/*
 * Extras for the question band that QuestionBand.tsx does not have (s06, s08, s09; free to reuse in s11).
 * Everything here lives in the same fixed strip (stage-local y 660–720) and is seen through the engine's dim, so it is
 * solid fills, white text, nothing under 34 px. The band's left side has ~1200 px before the fixed tag on the right.
 *   BandChip           a short solid chip (amber for «caro y raro» / «la medida de libro», ...)
 *   NotEqualMark       a drawn «≠» (never the glyph: the fonts are latin subsets)
 *   UTurnArrow         the half-turn of «MENOS»: the question goes the other way (drawn, never an arrow character)
 *   QualifierLineFit   QualifierLine with a pill whose English half can fold away once the gloss has been given
 *                      (so the letter strip and a chip still fit beside it) and a slot for an addon after the pill
 */

type ChipTone = 'amber' | 'emerald' | 'violet' | 'rose';

/** A solid chip for the band. `on` 0–1 fades and slides it in; it does not reserve space until placed by its parent. */
export function BandChip({
  text,
  tone,
  on = 1,
  icon,
  size = 34,
  children,
}: {
  text?: string;
  tone: ChipTone;
  on?: number;
  icon?: IconName;
  size?: number;
  children?: ReactNode;
}) {
  const o = clamp01(on);
  const a = ACCENT[tone];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: BAND.height - 6,
        padding: icon ? '0 22px 0 14px' : '0 22px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `3px solid ${a.fg}`,
        background: a.deep,
        boxShadow: `0 0 ${Math.round(22 * o)}px ${alpha(a.fg, 0.45 * o)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: '#ffffff',
        whiteSpace: 'nowrap',
        opacity: o,
        transform: `translateX(${(1 - o) * 16}px)`,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={a.fg} strokeWidth={2.6} /> : null}
      {text ? <span>{text}</span> : null}
      {children}
    </div>
  );
}

/** «≠» drawn as two bars and a slash. */
export function NotEqualMark({ size = 40, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', flexShrink: 0 }}>
      <line x1={7} y1={15} x2={33} y2={15} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={7} y1={26} x2={33} y2={26} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={25} y1={6} x2={15} y2={35} stroke={color} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

/** A U-turn arrow (up, over, back down) that draws itself: `p` 0–1. */
export function UTurnArrow({ p, color = C.rose, size = 56 }: { p: number; color?: string; size?: number }) {
  const len = 130;
  const head = clamp01((p - 0.7) / 0.3);
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}>
      <path
        d="M14 50 V25 a14 14 0 0 1 28 0 V38"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - clamp01(p / 0.75))}
      />
      <path d="M32 31 L42 44 L52 31" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={head} />
    </svg>
  );
}

/**
 * Like QualifierLine (same pill, same gloss, same `trail` slot) plus:
 *   collapse 0–1   the pill's « · ENGLISH» half folds away (pass `enWidth`, an upper bound of its width in px) and the
 *                  addon shrinks too, freeing room for the strip + a chip. The Spanish word stays highlighted.
 *   fold 0–1       the WHOLE pill folds away (`pillWidth` = upper bound of its width): for the last beat, when a chip needs
 *                  the room (the pill has done its job by then). The pill's glow is only clipped while folding.
 *   addon          drawn right after the pill (e.g. the U-turn arrow of «MENOS»); it folds with `collapse`.
 */
export function QualifierLineFit({
  q,
  at,
  glossAt,
  glossOut = 0,
  collapse = 0,
  fold = 0,
  pillWidth = 420,
  enWidth = 260,
  addon,
  addonWidth = 56,
  trail,
  size = 38,
}: {
  q: Qualifier | QualifierId;
  at: number;
  glossAt: number | null;
  glossOut?: number;
  collapse?: number;
  fold?: number;
  pillWidth?: number;
  enWidth?: number;
  addon?: ReactNode;
  addonWidth?: number;
  trail?: ReactNode;
  size?: number;
}) {
  const frame = useCurrentFrame();
  const qual = typeof q === 'string' ? QUALIFIERS[q] : q;
  const tone = qual.tone === 'rose' ? C.rose : C.violet;
  const pillIn = enter(frame, at, { distance: 14, duration: 14 });
  const glossP = glossAt === null ? 0 : progress(frame, glossAt, 14);
  const c = clamp01(collapse);
  const f = clamp01(fold);
  if (frame < at - 2) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: BAND.height,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        fontFamily: FONT.sans,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          maxWidth: f > 0.001 ? pillWidth * (1 - f) : undefined,
          overflow: f > 0.001 ? 'hidden' : 'visible',
          opacity: 1 - f,
          marginRight: -18 * f,
        }}
      >
      <div
        style={{
          ...pillIn,
          display: 'inline-flex',
          alignItems: 'center',
          height: BAND.height,
          padding: '0 24px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          border: `3px solid ${tone}`,
          background: alpha(tone, 0.55),
          boxShadow: `0 0 28px ${alpha(tone, 0.5)}`,
          fontWeight: 850,
          letterSpacing: 0.5,
          color: '#ffffff',
        }}
      >
        <span>{qual.es}</span>
        <span style={{ display: 'inline-block', overflow: 'hidden', maxWidth: enWidth * (1 - c), opacity: 1 - c }}>
          {' '}· {qual.en}
        </span>
      </div>
      </div>
      {addon ? (
        <div style={{ width: addonWidth * (1 - c), marginLeft: -18 * c, overflow: 'visible', opacity: 1 - c, display: 'flex', alignItems: 'center' }}>{addon}</div>
      ) : null}
      <div style={{ display: 'grid', alignItems: 'center', height: BAND.height }}>
        {glossAt !== null ? (
          <span style={{ gridArea: '1 / 1', fontWeight: 700, color: '#ffffff', opacity: glossP * (1 - glossOut), transform: `translateX(${(1 - glossP) * -10}px)` }}>{qual.gloss}</span>
        ) : null}
        {trail ? <div style={{ gridArea: '1 / 1' }}>{trail}</div> : null}
      </div>
    </div>
  );
}
