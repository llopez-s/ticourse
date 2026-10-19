import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';

/** Colours of the four participants (each accent keeps its engine meaning where it has one). */
export const WHO = {
  ana: C.cyan,
  app: C.sky,
  idp: C.emerald,
  graph: '#fb923c',
} as const;

/** Wraps children at stage-local (x, y), entering at `at` and optionally leaving at `outAt`. */
export function Reveal({
  frame,
  at,
  outAt,
  x,
  y,
  w,
  h,
  distance = 16,
  children,
  style,
}: {
  frame: number;
  at: number;
  outAt?: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  distance?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const pin = progress(frame, at, 16);
  const pout = outAt === undefined ? 0 : progress(frame, outAt, 14, EASE.inOut);
  const opacity = pin * (1 - pout);
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity, transform: `translateY(${(1 - pin) * distance}px)`, ...style }}>
      {children}
    </div>
  );
}

/** Icon tile + title + optional sub line, in a bordered card. `lit` (0–1) adds a glow; `dim` steps it back. */
export function InfoCard({
  icon,
  title,
  sub,
  tone = 'cyan',
  lit = 0,
  dim = 0,
  w,
  h,
  titleSize = 38,
  subSize = 28,
  style,
}: {
  icon?: IconName;
  title: string;
  sub?: string;
  tone?: Tone;
  lit?: number;
  dim?: number;
  w?: number;
  h?: number;
  titleSize?: number;
  subSize?: number;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: w,
        height: h,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '14px 24px 14px 18px',
        borderRadius: RADIUS.md,
        background: lit > 0 ? alpha(t.fg, 0.1) : C.ink850,
        border: `2px solid ${alpha(t.fg, 0.35 + 0.5 * lit)}`,
        boxShadow: lit > 0 ? `0 0 ${20 + lit * 30}px ${alpha(t.fg, 0.28 * lit)}` : 'none',
        opacity: 1 - 0.55 * dim,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      {icon ? (
        <div style={{ width: 68, height: 68, borderRadius: 16, display: 'grid', placeItems: 'center', background: alpha(t.fg, 0.14), border: `2px solid ${alpha(t.fg, 0.4)}`, flexShrink: 0 }}>
          <Icon name={icon} size={40} color={t.fg} />
        </div>
      ) : null}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: titleSize, fontWeight: 800, color: C.textStrong, lineHeight: 1.12 }}>{title}</div>
        {sub ? <div style={{ marginTop: 4, fontSize: subSize, fontWeight: 560, color: t.soft, lineHeight: 1.15 }}>{sub}</div> : null}
      </div>
    </div>
  );
}

/** Small mono label such as «Mail.Read». */
export function Tag({ children, tone = 'sky', size = 30, solid = false }: { children: ReactNode; tone?: Tone; size?: number; solid?: boolean }) {
  const t = toneOf(tone);
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${Math.round(size * 0.18)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.sm,
        border: `2px solid ${alpha(t.fg, 0.7)}`,
        background: solid ? alpha(t.fg, 0.25) : alpha(t.fg, 0.1),
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 700,
        color: t.soft,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** Pill with an optional icon: the short statements the narration lands on. */
export function Pill({
  children,
  icon,
  tone = 'cyan',
  size = 32,
  dim = 0,
  strike = false,
  style,
}: {
  children: ReactNode;
  icon?: IconName;
  tone?: Tone;
  size?: number;
  dim?: number;
  strike?: boolean;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.35),
        padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.62)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(t.fg, 0.6)}`,
        background: alpha(t.fg, 0.1),
        color: t.soft,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 700,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        opacity: 1 - 0.55 * dim,
        textDecoration: strike ? 'line-through' : 'none',
        textDecorationThickness: 3,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.05)} color={t.fg} /> : null}
      {children}
    </span>
  );
}

/**
 * The «PRÁCTICA COMPLEMENTARIA» learning card. It enters at `at` (the end of the narration of the scene's last
 * paragraph), dims the scene under a scrim, and stays until the scene ends. No exam badge, no violet: this is
 * not an exam card.
 */
export function LearningCard({ frame, at, text }: { frame: number; at: number; text: string }) {
  const p = progress(frame, at, 16);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: alpha(C.ink950, 0.82 * p), display: 'grid', placeItems: 'center', zIndex: 20 }}>
      <div
        style={{
          boxSizing: 'border-box',
          width: 1400,
          padding: '34px 54px 40px',
          borderRadius: RADIUS.lg,
          background: C.ink900,
          border: `3px solid ${alpha(C.amber, 0.75)}`,
          boxShadow: `0 0 50px ${alpha(C.amber, 0.18)}, 0 30px 70px ${alpha('#000000', 0.55)}`,
          opacity: p,
          transform: `translateY(${(1 - p) * 20}px) scale(${0.97 + 0.03 * p})`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Icon name="flag" size={32} color={C.amber} strokeWidth={2.4} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 4, color: C.amber }}>PRÁCTICA COMPLEMENTARIA</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 62, fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.8, color: C.textStrong }}>{text}</div>
      </div>
    </div>
  );
}

/** Two answer options for a decision; no answer colour until `revealAt`. `answer` is the index that wins. */
export function Choices({
  frame,
  at,
  revealAt,
  labels,
  answer,
  width = 1728,
  tones,
}: {
  frame: number;
  at: number;
  revealAt: number;
  labels: [string, string];
  answer: 0 | 1;
  width?: number;
  tones?: [Tone, Tone];
}) {
  const p = progress(frame, at, 16);
  const r = progress(frame, revealAt, 14);
  const w = (width - 40) / 2;
  return (
    <div style={{ display: 'flex', gap: 40, width, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, fontFamily: FONT.sans }}>
      {labels.map((label, i) => {
        const won = i === answer;
        const base = tones ? toneOf(tones[i]).fg : C.muted;
        const col = r > 0 ? (won ? C.emerald : C.faint) : base;
        return (
          <div
            key={label}
            style={{
              boxSizing: 'border-box',
              width: w,
              height: 84,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              borderRadius: RADIUS.md,
              border: `3px solid ${alpha(col, r > 0 && won ? 0.95 : 0.55)}`,
              background: r > 0 && won ? alpha(C.emerald, 0.14) : alpha(col, 0.07),
              boxShadow: r > 0 && won ? `0 0 ${20 + 24 * r}px ${alpha(C.emerald, 0.3 * r)}` : 'none',
              opacity: r > 0 && !won ? 1 - 0.55 * r : 1,
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 800, color: r > 0 ? (won ? '#6ee7b7' : C.muted) : C.text }}>{label}</span>
            {r > 0 ? <Icon name={won ? 'check' : 'x'} size={44} color={won ? C.emerald : C.faint} strokeWidth={3} style={{ opacity: r }} /> : null}
          </div>
        );
      })}
    </div>
  );
}
