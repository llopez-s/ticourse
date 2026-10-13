import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { BLIND } from '../../../data/s01-hook';

/**
 * What today's rule does not look at (s01-01): the heading «no mira» and three labels under it,
 * «quién eres» · «cómo está tu portátil» · «desde dónde y cuándo». Dashed grey while they are
 * only "not there" (dim); amber once the voice says the rule does not look («calls for more
 * proof»). Never rose: nobody is to blame for the rule.
 */
export const BLIND_COL = { head: 50, headGap: 14, item: 58, gap: 12, size: 36, rail: 26 } as const;

const AMBER_SOFT = '#fde68a';

/** Height of the column (heading + three labels). */
export function blindColumnHeight(): number {
  const n = BLIND.items.length;
  return BLIND_COL.head + BLIND_COL.headGap + n * BLIND_COL.item + (n - 1) * BLIND_COL.gap;
}

/** Vertical centre of label `i`, from the column's top. */
export function blindItemY(i: number): number {
  return BLIND_COL.head + BLIND_COL.headGap + i * (BLIND_COL.item + BLIND_COL.gap) + BLIND_COL.item / 2;
}

export function BlindColumn({
  headShow,
  headLit,
  show,
  lit,
  glow = 0,
}: {
  /** 0–1: the heading is there. */
  headShow: number;
  /** 0–1: the heading turns amber. */
  headLit: number;
  /** 0–1 per label: it is there (dim). */
  show: number[];
  /** 0–1 per label: it lights amber. */
  lit: number[];
  /** 0–1: an extra amber halo on the lit labels (the gaps somebody is looking for). */
  glow?: number;
}) {
  const hl = clamp01(headLit);
  return (
    <div style={{ position: 'relative', width: 'max-content', height: blindColumnHeight(), fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      {/* Heading */}
      <div
        style={{
          height: BLIND_COL.head,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: clamp01(headShow),
          transform: `translateY(${(1 - clamp01(headShow)) * 10}px)`,
        }}
      >
        <TwoTone lit={hl}>{(color) => <Icon name="eyeOff" size={40} color={color} strokeWidth={2.2} />}</TwoTone>
        <TwoTone lit={hl}>
          {(color) => <span style={{ fontSize: 40, fontWeight: 850, letterSpacing: 0.2, color }}>{BLIND.head}</span>}
        </TwoTone>
      </div>

      {/* Labels */}
      {BLIND.items.map((item, i) => {
        const s = clamp01(show[i] ?? 0);
        const l = clamp01(lit[i] ?? 0);
        const g = clamp01(glow) * l;
        return (
          <div
            key={item.text}
            style={{
              position: 'absolute',
              left: 0,
              top: blindItemY(i) - BLIND_COL.item / 2,
              height: BLIND_COL.item,
              opacity: s,
              transform: `translateX(${(1 - s) * 16}px)`,
            }}
          >
            <Label text={item.text} icon={item.icon} lit={l} glow={g} />
          </div>
        );
      })}
    </div>
  );
}

function Label({ text, icon, lit, glow }: { text: string; icon: IconName; lit: number; glow: number }) {
  return (
    <div
      style={{
        position: 'relative',
        height: BLIND_COL.item,
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 24px 0 16px',
        borderRadius: 14,
        background: `linear-gradient(180deg, ${alpha(C.amber, 0.13 * lit)} 0%, ${alpha(C.ink900, 0.9)} 100%)`,
        boxShadow: glow > 0.01 ? `0 0 ${Math.round(26 * glow)}px ${alpha(C.amber, 0.4 * glow)}` : undefined,
      }}
    >
      {/* Two borders, cross-faded: dashed grey (not looked at) and amber (it should be) */}
      <span style={{ position: 'absolute', inset: 0, borderRadius: 14, border: `2px dashed ${alpha(C.faint, 0.95)}`, opacity: 1 - lit }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: 14, border: `2px solid ${alpha(C.amber, 0.85)}`, opacity: lit }} />
      <TwoTone lit={lit} dim={alpha(C.muted, 0.75)}>
        {(color) => <Icon name={icon} size={34} color={color} strokeWidth={2.1} />}
      </TwoTone>
      <TwoTone lit={lit} dim={alpha(C.muted, 0.85)} bright={AMBER_SOFT}>
        {(color) => <span style={{ fontSize: BLIND_COL.size, fontWeight: 750, color }}>{text}</span>}
      </TwoTone>
    </div>
  );
}

/** The same content drawn twice, grey underneath and amber on top, cross-faded by `lit`. */
function TwoTone({
  lit,
  dim = C.muted,
  bright = C.amber,
  children,
}: {
  lit: number;
  dim?: string;
  bright?: string;
  children: (color: string) => ReactNode;
}) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ display: 'inline-flex', opacity: 1 - lit }}>{children(dim)}</span>
      <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'inline-flex', alignItems: 'center', opacity: lit }}>{children(bright)}</span>
    </span>
  );
}
