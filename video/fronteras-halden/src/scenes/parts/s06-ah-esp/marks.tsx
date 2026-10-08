import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle, type IconName } from '../../../../../engine/src/ui';

/**
 * Labels shared by s06, s07 and s08 (chapter 3–4, same builder), in V16's idiom (zonas-halden
 * parts/s06-barrera/marks.tsx): the violet exam-term card, a neutral think-prompt option button, a
 * round badge (tick, eye…) and a plain pill. Every animated prop is a 0–1 weight the scene computes.
 * Nothing positions itself.
 */

export interface TermLine {
  text: ReactNode;
  /** 0–1: the line appears. */
  p: number;
  color?: string;
  size?: number;
  weight?: number;
}

function Line({ l }: { l: TermLine }) {
  const k = clamp01(l.p);
  return (
    <div
      style={{
        fontSize: l.size ?? 34,
        fontWeight: l.weight ?? 760,
        lineHeight: 1.18,
        color: l.color ?? C.text,
        whiteSpace: 'nowrap',
        opacity: k,
        transform: `translateY(${(1 - k) * 6}px)`,
      }}
    >
      {l.text}
    </div>
  );
}

/**
 * The violet exam-term card: mortarboard + the English term (springs in with `termP`), with
 * `lines` below. The card itself appears with `p`. Lines keep their slot from the start so the
 * card never resizes.
 */
export function TermCard({
  term,
  lines = [],
  p,
  termP = p,
  width,
  size = 48,
  align = 'left',
  glow = 0,
  dim = 0,
  style,
}: {
  term: ReactNode;
  lines?: TermLine[];
  p: number;
  termP?: number;
  width?: number;
  size?: number;
  align?: 'left' | 'center';
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  const t = clamp01(termP);
  const g = clamp01(glow);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 8,
        width,
        boxSizing: 'border-box',
        padding: '14px 24px 18px',
        borderRadius: RADIUS.lg,
        border: `${g > 0.01 ? 3 : 2}px solid ${alpha(C.violet, 0.75 + 0.25 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${Math.round(30 + 24 * g)}px ${alpha(C.violet, 0.22 + 0.35 * g)}`,
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - v) * 14}px)`,
        ...dimStyle(dim, v),
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          whiteSpace: 'nowrap',
          opacity: t,
          transform: `translateY(${(1 - t) * 10}px) scale(${0.92 + 0.08 * t})`,
          transformOrigin: align === 'center' ? '50% 50%' : '0 50%',
        }}
      >
        <Icon name="mortarboard" size={Math.round(size * 0.82)} color={C.violet} />
        <span style={{ fontSize: size, fontWeight: 850, letterSpacing: 0.5, lineHeight: 1.05, color: '#c4b5fd' }}>{term}</span>
      </div>
      {lines.map((l, i) => (
        <Line key={i} l={l} />
      ))}
    </div>
  );
}

/**
 * A think-prompt option: fixed width and height, neutral until chosen. `state` 0 = neutral,
 * 1 = chosen (emerald), −1 = stepped back. `glow` lights both alike during the silent hold.
 */
export function ChoiceButton({ label, show, state = 0, glow = 0, width = 230, size = 42 }: { label: string; show: number; state?: number; glow?: number; width?: number; size?: number }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const chosen = Math.max(0, Math.min(1, state));
  const back = Math.max(0, Math.min(1, -state));
  const g = Math.max(clamp01(glow), chosen);
  const edge = chosen > 0.01 ? C.emerald : C.ink500;
  return (
    <div
      style={{
        width,
        height: Math.round(size * 1.9),
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(edge, 0.75 + 0.25 * chosen)}`,
        background: chosen > 0.01 ? `linear-gradient(180deg, ${alpha(C.emerald, 0.24 * chosen)} 0%, ${C.ink900} 100%)` : C.ink900,
        boxShadow: `0 0 ${Math.round(10 + 26 * g)}px ${alpha(chosen > 0.01 ? C.emerald : C.muted, 0.12 + 0.3 * g)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 820,
        color: chosen > 0.5 ? '#a7f3d0' : C.textStrong,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - s) * 14}px) scale(${1 + 0.06 * chosen})`,
        ...dimStyle(back, s),
      }}
    >
      {label}
    </div>
  );
}

/** A round badge with an icon (an emerald tick, an amber eye…), centred on its box. */
export function RoundBadge({ icon, tone, p, size = 56, style }: { icon: IconName; tone: string; p: number; size?: number; style?: CSSProperties }) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'grid',
        placeItems: 'center',
        background: alpha(C.ink900, 0.96),
        border: `3px solid ${tone}`,
        boxShadow: `0 0 ${Math.round(size * 0.4)}px ${alpha(tone, 0.45)}`,
        opacity: Math.min(1, v * 1.4),
        transform: `scale(${0.6 + 0.4 * v})`,
        ...style,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.62)} color={tone} strokeWidth={2.6} />
    </div>
  );
}

/** A solid pill with an optional icon: rules and decisions («el túnel se queda en modo túnel»). */
export function Pill({ text, tone, icon, p, size = 44, glow = 0, style }: { text: ReactNode; tone: string; icon?: IconName; p: number; size?: number; glow?: number; style?: CSSProperties }) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: `8px ${Math.round(size * 0.66)}px 10px ${Math.round(size * (icon ? 0.46 : 0.66))}px`,
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(tone, 0.85)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.18)} 0%, ${alpha(C.ink950, 0.95)} 100%)`,
        boxShadow: `0 0 ${Math.round(22 + 26 * g)}px ${alpha(tone, 0.25 + 0.35 * g)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 840,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: v,
        transform: `translateY(${(1 - v) * 12}px) scale(${0.94 + 0.06 * v})`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.0)} color={tone} strokeWidth={2.6} /> : null}
      {text}
    </div>
  );
}
