import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../../engine/src/ui';
import { INK } from '../glyphs';

/**
 * s03-8021x's own pieces: the think prompt's option button (V16's look, sized by the caller so both options
 * are identical), the exam-term tag (V16's TermTag) and the small role tag (a lane's exam name, lit on its
 * word). Nothing positions itself.
 */

/**
 * One option of the think prompt. Neutral until the answer: both options look the same and glow alike
 * (`glow`). `chosen` lights it emerald with a tick; `dim` steps the other one back (it is not struck: the
 * switch is not wrong to exist, it just doesn't decide).
 */
export function ChoiceButton({ label, width, height = 92, show, chosen = 0, glow = 0, dim = 0 }: { label: string; width: number; height?: number; show: number; chosen?: number; glow?: number; dim?: number }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const c = clamp01(chosen);
  const g = clamp01(glow);
  const edge = c > 0.01 ? C.emerald : C.cyan;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `3px solid ${alpha(edge, 0.65 + 0.35 * Math.max(c, g))}`,
        background: c > 0.01 ? `linear-gradient(180deg, ${alpha(C.emerald, 0.24 * c)} 0%, ${C.ink900} 100%)` : C.ink900,
        boxShadow: `0 0 ${Math.round(8 + 22 * Math.max(g, c))}px ${alpha(edge, 0.15 + 0.3 * Math.max(g, c))}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        fontFamily: FONT.sans,
        fontSize: 44,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        transform: `translateY(${(1 - p) * 12}px) scale(${1 + 0.05 * c})`,
        ...dimStyle(0.8 * clamp01(dim), p),
      }}
    >
      {c > 0.01 ? (
        <span style={{ opacity: c, display: 'inline-flex' }}>
          <Icon name="check" size={38} color={C.emerald} strokeWidth={3} />
        </span>
      ) : null}
      {label}
    </div>
  );
}

/** The exam term with its English gloss (V16's TermTag): violet, mortarboard icon, term 60 px, sub 38 px. */
export function TermTag({ show, term, sub, subShow = 1, dim = 0, style }: { show: number; term: ReactNode; sub?: ReactNode; subShow?: number; dim?: number; style?: CSSProperties }) {
  const p = clamp01(show);
  if (p <= 0.001) return null;
  const sp = clamp01(subShow);
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        padding: '14px 30px 16px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 34px ${alpha(C.violet, 0.24)}`,
        fontFamily: FONT.sans,
        transform: `translateY(${(1 - p) * 14}px) scale(${0.94 + 0.06 * p})`,
        ...dimStyle(dim, p),
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
        <Icon name="mortarboard" size={50} color={C.violet} />
        <span style={{ fontSize: 60, fontWeight: 880, letterSpacing: 0.5, color: INK.violetSoft }}>{term}</span>
      </div>
      {sub && sp > 0.001 ? (
        <div style={{ fontSize: 38, fontWeight: 760, color: C.text, whiteSpace: 'nowrap', opacity: sp, transform: `translateY(${(1 - sp) * 6}px)` }}>{sub}</div>
      ) : null}
    </div>
  );
}

/**
 * A role's exam name as a violet pill (`size` px text, mortarboard icon). `lit` 0–1 brightens and glows it
 * (the voice is on it); `show` fades it in. `maxWidth` lets a long name wrap (two lines, centred).
 */
export function RoleTag({ text, show = 1, lit = 0, size = 40, maxWidth, icon = true }: { text: string; show?: number; lit?: number; size?: number; maxWidth?: number; icon?: boolean }) {
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const l = clamp01(lit);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        maxWidth,
        boxSizing: 'border-box',
        padding: `${Math.round(size * 0.24)}px ${Math.round(size * 0.6)}px ${Math.round(size * 0.28)}px ${Math.round(size * 0.45)}px`,
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.45 + 0.45 * l)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.08 + 0.14 * l)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: l > 0.02 ? `0 0 ${Math.round(30 * l)}px ${alpha(C.violet, 0.35 * l)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 860,
        lineHeight: 1.08,
        color: INK.violetSoft,
        textAlign: 'center',
        opacity: s * (0.6 + 0.4 * l),
        transform: `translateY(${(1 - s) * 10}px) scale(${1 + 0.05 * l})`,
      }}
    >
      {icon ? <Icon name="mortarboard" size={Math.round(size * 0.95)} color={C.violet} /> : null}
      <span style={{ whiteSpace: maxWidth ? 'normal' : 'nowrap' }}>{text}</span>
    </div>
  );
}
