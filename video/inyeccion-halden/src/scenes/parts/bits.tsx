import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui';

/** Exam terms are violet text (the app's «Nota de examen» colour). */
export const EXAM_TEXT = '#c4b5fd';
/** The paper of the port's forms (V19's through-line image: the form with a hole / the pre-printed form). */
export const PAPER = '#dde3ec';
export const PAPER_INK = '#1e293b';
export const PAPER_SOFT = '#64748b';

/** Weight 0–1 that fades and lifts an element in (`show`), as a style. */
export function pop(show: number, rise = 14): CSSProperties {
  return { opacity: show, transform: `translateY(${(1 - show) * rise}px)` };
}

/** 0–1: how much `frame` is inside the window [from, to) with `ramp`-frame edges. */
export function between(frame: number, from: number, to: number, ramp = 12): number {
  return progress(frame, from, ramp) * (1 - progress(frame, to - ramp, ramp));
}

/**
 * The exam's name for what the scene just explained: big caps in violet with a growing underline and an optional
 * line under it. `show` (0–1) fades it in; `sub` is a ReactNode (so words can be coloured).
 */
export function TermName({
  text,
  sub,
  show,
  size = 64,
  align = 'left',
  style,
}: {
  text: string;
  sub?: ReactNode;
  show: number;
  size?: number;
  align?: 'left' | 'center';
  style?: CSSProperties;
}) {
  return (
    <div style={{ fontFamily: FONT.sans, textAlign: align, ...pop(show, 16), ...style }}>
      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          fontSize: size,
          fontWeight: 850,
          letterSpacing: -1,
          lineHeight: 1.05,
          color: EXAM_TEXT,
          whiteSpace: 'pre',
          paddingBottom: 8,
        }}
      >
        {text}
        <span
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 5,
            width: `${100 * Math.min(1, show * 1.2)}%`,
            borderRadius: 3,
            background: C.violet,
            boxShadow: `0 0 16px ${alpha(C.violet, 0.5)}`,
          }}
        />
      </div>
      {sub ? (
        <div style={{ marginTop: 14, fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{sub}</div>
      ) : null}
    </div>
  );
}

/** A line with an icon, 36 px: what the voice says about a name, one per sentence. */
export function Attr({
  icon,
  text,
  show,
  tone = C.cyan,
  size = 38,
  style,
}: {
  icon: IconName;
  text: ReactNode;
  show: number;
  tone?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, fontSize: size, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap', ...pop(show, 10), ...style }}>
      <span
        style={{
          width: size + 18,
          height: size + 18,
          borderRadius: (size + 18) / 2,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          background: alpha(tone, 0.14),
          border: `2px solid ${alpha(tone, 0.6)}`,
        }}
      >
        <Icon name={icon} size={Math.round(size * 0.7)} color={tone} />
      </span>
      {text}
    </div>
  );
}

/** A pill label (sans), used for tags such as the numbered «caja» headers. */
export function Pill({
  children,
  tone = C.cyan,
  size = 36,
  icon,
  show = 1,
  solid = false,
  style,
}: {
  children: ReactNode;
  tone?: string;
  size?: number;
  icon?: IconName;
  show?: number;
  solid?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: size + 26,
        padding: `0 ${Math.round(size * 0.6)}px 0 ${Math.round(size * 0.45)}px`,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, solid ? 1 : 0.6)}`,
        background: solid ? tone : alpha(tone, 0.1),
        color: solid ? C.ink950 : C.textStrong,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        whiteSpace: 'nowrap',
        ...pop(show, 10),
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 0.95)} color={solid ? C.ink950 : tone} /> : null}
      {children}
    </span>
  );
}

/** A word that lights from `base` to `lit` colour (`w` 0–1) by layering two spans (no colour maths). */
export function Lit({ text, w, base = C.textStrong, lit = C.cyan, style }: { text: string; w: number; base?: string; lit?: string; style?: CSSProperties }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre', ...style }}>
      <span style={{ color: base }}>{text}</span>
      <span style={{ position: 'absolute', left: 0, top: 0, color: lit, opacity: w }}>{text}</span>
    </span>
  );
}

/** A small mono tag, e.g. the `payload` as the voice never reads it. */
export function MonoChip({ children, tone = C.cyan, size = 32, style }: { children: ReactNode; tone?: string; size?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${Math.round(size * 0.2)}px ${Math.round(size * 0.5)}px`,
        borderRadius: 12,
        background: alpha(tone, 0.12),
        border: `2px solid ${alpha(tone, 0.55)}`,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 700,
        color: tone,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
