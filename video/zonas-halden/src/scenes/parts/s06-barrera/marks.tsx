import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, type IconName } from '../../../../../engine/src/ui';

/**
 * Labels shared by s06, s07 and s08 (chapter 4, same builder): the violet exam-term card
 * (FAIL-OPEN / FAIL-CLOSED / FAIL-SAFE / FAIL-SECURE with their lines), a cause chip, a neutral
 * choice button for the think prompt (fixed width, so both options are identical boxes until one
 * is chosen) and a state chip. Every animated prop is a 0–1 weight computed by the scene.
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
 * `before` lines above it and `lines` below. The card itself appears with `p`. With `collapse`
 * the term's row opens as the term arrives (the voice names it after describing it); otherwise
 * its slot is reserved from the start so the card never resizes.
 */
export function TermCard({
  term,
  before = [],
  lines = [],
  p,
  termP = p,
  collapse = false,
  width,
  size = 48,
  align = 'left',
  glow = 0,
  glowTone = C.violet,
  dim = 0,
  aside,
  style,
}: {
  term: ReactNode;
  before?: TermLine[];
  lines?: TermLine[];
  p: number;
  termP?: number;
  collapse?: boolean;
  /** Fixed width (px); omitted = fits the content. */
  width?: number;
  size?: number;
  align?: 'left' | 'center';
  glow?: number;
  /** Colour of the extra glow (e.g. amber when the voice warns about this ending). */
  glowTone?: string;
  dim?: number;
  /** Optional element drawn to the right of the term (e.g. a small icon). */
  aside?: ReactNode;
  style?: CSSProperties;
}) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  const t = clamp01(termP);
  const g = clamp01(glow);
  const items = align === 'center' ? 'center' : 'flex-start';
  const rowH = Math.round(size * 1.12);
  const open = collapse ? EASE.out(t) : 1;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: items,
        gap: 8,
        width,
        boxSizing: 'border-box',
        padding: '14px 24px 18px',
        borderRadius: RADIUS.lg,
        border: `${g > 0.01 ? 3 : 2}px solid ${alpha(g > 0.01 ? glowTone : C.violet, 0.75 + 0.25 * g)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${Math.round(30 + 24 * g)}px ${alpha(g > 0.01 ? glowTone : C.violet, 0.22 + 0.35 * g)}`,
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - v) * 14}px)`,
        ...dimStyle(dim, v),
        ...style,
      }}
    >
      {before.map((l, i) => (
        <Line key={`b${i}`} l={l} />
      ))}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          height: rowH * open,
          marginTop: collapse ? -8 * (1 - open) : 0,
          whiteSpace: 'nowrap',
          overflow: collapse && open < 1 ? 'hidden' : undefined,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: t,
            transform: `translateY(${(1 - t) * 10}px) scale(${0.92 + 0.08 * t})`,
            transformOrigin: align === 'center' ? '50% 50%' : '0 50%',
          }}
        >
          <Icon name="mortarboard" size={Math.round(size * 0.82)} color={C.violet} />
          <span style={{ fontSize: size, fontWeight: 850, letterSpacing: 0.5, lineHeight: 1, color: '#c4b5fd' }}>{term}</span>
        </div>
        {aside}
      </div>
      {lines.map((l, i) => (
        <Line key={`a${i}`} l={l} />
      ))}
    </div>
  );
}

/** A cause chip: icon + word, in a tone. */
export function CauseChip({ icon, text, tone, p, glow = 0, size = 38 }: { icon: IconName; text: string; tone: string; p: number; glow?: number; size?: number }) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  const g = clamp01(glow);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: `8px ${Math.round(size * 0.62)}px 8px ${Math.round(size * 0.42)}px`,
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.2)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 ${Math.round(16 + 26 * g)}px ${alpha(tone, 0.2 + 0.4 * g)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: v,
        transform: `translateY(${(1 - v) * 12}px) scale(${0.9 + 0.1 * v})`,
      }}
    >
      <Icon name={icon} size={Math.round(size * 1.05)} color={tone} strokeWidth={2.3} />
      {text}
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

/** A state chip («se abre», «se queda bloqueada»): icon + text on a solid pill. */
export function StateChip({ text, tone, icon, p, size = 36, style }: { text: string; tone: string; icon?: IconName; p: number; size?: number; style?: CSSProperties }) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: `6px ${Math.round(size * 0.56)}px`,
        borderRadius: RADIUS.pill,
        border: `3px solid ${tone}`,
        background: alpha(C.ink950, 0.92),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 820,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: v,
        transform: `translateY(${(1 - v) * 10}px) scale(${0.92 + 0.08 * v})`,
        boxShadow: `0 0 22px ${alpha(tone, 0.35)}`,
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={Math.round(size * 1.0)} color={tone} strokeWidth={2.5} /> : null}
      {text}
    </div>
  );
}
