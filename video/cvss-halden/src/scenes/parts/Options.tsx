import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle, mix } from '../../../../engine/src/ui';

/**
 * One of s04's four options for a finding that has no patch: a tile with the Spanish word the voice says in big type and
 * the exam terms in English under it. Three continuous weights drive its life: `show` (it arrives), `cross` (it is ruled
 * out: struck through, rose cross, dimmed) and `lit` (it is the way to go: tinted, a check). Nothing positions itself.
 */
export function OptionTile({
  main,
  terms,
  width,
  height = 160,
  show = 1,
  cross = 0,
  lit = 0,
  litTone = C.emerald,
  dim = 0,
  mini = false,
  style,
}: {
  main: string;
  terms: readonly string[];
  width: number;
  height?: number;
  show?: number;
  cross?: number;
  lit?: number;
  litTone?: string;
  dim?: number;
  /** The strip version (phase C): one line, no terms. */
  mini?: boolean;
  style?: CSSProperties;
}) {
  const x = clamp01(cross);
  const l = clamp01(lit);
  const base = x > 0.01 ? C.rose : l > 0.01 ? litTone : C.cyan;
  const strike = clamp01(x * 1.4);
  return (
    <div
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width,
        height,
        padding: mini ? '0 52px 0 16px' : '14px 24px',
        display: mini ? 'flex' : undefined,
        alignItems: mini ? 'center' : undefined,
        borderRadius: mini ? RADIUS.md : RADIUS.lg,
        border: `3px solid ${alpha(base, mix(0.45, 0.95, Math.max(x, l)))}`,
        background: `linear-gradient(180deg, ${alpha(base, 0.1 + 0.06 * Math.max(x, l))} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: l > 0.05 ? `0 0 ${Math.round(34 * l)}px ${alpha(litTone, 0.35 * l)}` : undefined,
        fontFamily: FONT.sans,
        opacity: clamp01(show) * (1 - 0.4 * x),
        transform: `translateY(${(1 - clamp01(show)) * 22}px)`,
        ...dimStyle(dim, clamp01(show) * (1 - 0.4 * x)),
        ...style,
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block', fontSize: mini ? 34 : 46, fontWeight: 850, lineHeight: 1.12, color: x > 0.5 ? C.muted : C.textStrong, whiteSpace: 'nowrap' }}>
        {main}
        <div style={{ position: 'absolute', left: -6, top: '54%', height: 6, width: `calc(${strike * 100}% + ${12 * strike}px)`, borderRadius: 3, background: C.rose, boxShadow: `0 0 12px ${alpha(C.rose, 0.7)}` }} />
      </div>
      <div style={{ marginTop: 8, display: mini ? 'none' : 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        {terms.map((t) => (
          <span key={t} style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 700, color: x > 0.5 ? C.faint : '#c4b5fd', whiteSpace: 'nowrap' }}>
            {t}
          </span>
        ))}
      </div>
      {x > 0.05 ? (
        <div style={{ position: 'absolute', right: mini ? 8 : 16, top: mini ? 14 : 14, opacity: x, transform: `scale(${0.6 + 0.4 * x})` }}>
          <Icon name="x" size={mini ? 34 : 52} color={C.rose} strokeWidth={3} />
        </div>
      ) : null}
      {l > 0.05 ? (
        <div style={{ position: 'absolute', right: mini ? 8 : 16, top: 14, opacity: l, transform: `scale(${0.6 + 0.4 * l})` }}>
          <Icon name="check" size={mini ? 34 : 52} color={litTone} strokeWidth={3} />
        </div>
      ) : null}
    </div>
  );
}
