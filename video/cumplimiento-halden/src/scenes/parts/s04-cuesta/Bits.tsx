import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import type { Consequence } from '../../../data/canon';
import { Salon } from '../Images';
import { TermPill } from '../Labels';

export const COL_W = 560;
export const COL_X = [0, 584, 1168] as const;

/** «Una autoridad», «Quien te habilitó»…: who imposes what is under it. */
export function WhoHeader({ icon, text, show }: { icon: IconName; text: string; show: number }) {
  const s = clamp01(show);
  return (
    <div
      style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 800,
        color: C.cyanSoft,
        whiteSpace: 'nowrap',
        opacity: s,
        transform: `translateY(${(1 - s) * 10}px)`,
      }}
    >
      <Icon name={icon} size={34} color={C.cyan} />
      {text}
    </div>
  );
}

/**
 * One consequence: its exam term (violet), its gloss and, when it has one, a smaller note. `on` 0–1 brightens it (the
 * voice is on it); `salon` 0–1 pins the hair salon's badge on its corner (the image's example of the same consequence).
 */
export function ConsequenceCard({ c, height, on, salon = 0 }: { c: Consequence; height: number; on: number; salon?: number }) {
  const o = clamp01(on);
  const s = clamp01(salon);
  return (
    <div
      style={{
        position: 'relative',
        width: COL_W,
        height,
        boxSizing: 'border-box',
        padding: '14px 22px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.amber, 0.3 + 0.6 * Math.max(o, s))}`,
        background: alpha(C.amber, 0.04 + 0.08 * Math.max(o, s)),
        boxShadow: Math.max(o, s) > 0.05 ? `0 0 ${Math.round(26 * Math.max(o, s))}px ${alpha(C.amber, 0.24 * Math.max(o, s))}` : undefined,
        fontFamily: FONT.sans,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex' }}>
        <TermPill text={c.term} size={30} on={0.35 + 0.65 * o} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: o > 0.4 ? C.textStrong : C.text }}>{c.gloss}</div>
      {c.note ? <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.2, color: C.muted }}>{c.note}</div> : null}
      {s > 0.02 ? (
        <div style={{ position: 'absolute', right: 18, top: -22, opacity: s, transform: `scale(${0.7 + 0.3 * s})` }}>
          <div style={{ padding: '6px 10px 4px', borderRadius: 14, background: C.ink900, border: `2px solid ${alpha(C.sky, 0.8)}`, display: 'grid', placeItems: 'center' }}>
            <Salon width={58} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
