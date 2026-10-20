import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { ITEMS, LIST_HEAD, PATCH_BOX } from '../../../data/s06-sobra';

export const LIST_W = 820;
const HEAD_H = 66;
const ROW_H = 78;
const PAD_B = 14;

/** Height of the list frame for the rows' remaining fractions (1 = present, 0 = gone). */
export function listHeight(keep: number[]): number {
  return HEAD_H + keep.reduce((a, k) => a + ROW_H * k, 0) + PAD_B;
}

/**
 * The new server's factory list (s06): a dashed violet frame (the attack surface, shrinking with the list), the head
 * «trae de fábrica» and five rows, each with an amber «parches pendientes» box. Per row: `show` brings it in, `out`
 * 0–1 sends it off to the right fast (removal; the browser's is the whoosh), `keep` 0–1 its remaining height (it
 * collapses after leaving), `tag` 0–1 lights its emerald tag («cerrados los que sobran», «cambiada»). `glow` lights the
 * frame when the attack surface is named.
 */
export function FactoryList({
  show,
  out,
  keep,
  tag,
  glow,
}: {
  show: number[];
  out: number[];
  keep: number[];
  tag: number[];
  glow: number;
}) {
  const h = listHeight(keep);
  const g = clamp01(glow);
  let y = HEAD_H;
  return (
    <div style={{ position: 'relative', width: LIST_W, height: h, fontFamily: FONT.sans }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.lg,
          border: `3px dashed ${alpha(C.violet, 0.45 + 0.5 * g)}`,
          background: alpha(C.ink850, 0.7),
          boxShadow: g > 0.02 ? `0 0 ${Math.round(30 * g)}px ${alpha(C.violet, 0.3 * g)}` : undefined,
        }}
      />
      <div style={{ position: 'absolute', left: 28, top: 16, fontSize: 30, fontWeight: 750, color: C.muted }}>{LIST_HEAD}</div>
      {ITEMS.map((it, i) => {
        const top = y;
        y += ROW_H * keep[i];
        const o = clamp01(out[i]);
        const s = clamp01(show[i]);
        if (keep[i] <= 0.01 || s <= 0.01) return null;
        const t = clamp01(tag[i]);
        return (
          <div
            key={it.text}
            style={{
              position: 'absolute',
              left: 18,
              top,
              width: LIST_W - 36,
              height: ROW_H - 10,
              display: 'flex',
              alignItems: 'center',
              opacity: s * (1 - o) * keep[i],
              transform: `translateX(${o * o * 700}px) skewX(${-18 * o}deg)`,
              filter: o > 0.05 ? `blur(${Math.round(6 * o)}px)` : undefined,
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: RADIUS.md, background: alpha(C.cyan, 0.05), border: `2px solid ${alpha(C.cyan, 0.25)}` }} />
            <div style={{ position: 'relative', marginLeft: 22, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{it.text}</span>
              {it.tag && t > 0.01 ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 24, fontWeight: 750, color: C.emerald, opacity: t, lineHeight: 1.15 }}>
                  <Icon name="check" size={24} color={C.emerald} strokeWidth={3} />
                  {it.tag}
                </span>
              ) : null}
            </div>
            <div
              style={{
                position: 'absolute',
                right: 14,
                top: (ROW_H - 10 - 42) / 2,
                height: 42,
                padding: '0 16px 0 12px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: RADIUS.sm,
                border: `2px solid ${alpha(C.amber, 0.7)}`,
                background: alpha(C.amberDeep, 0.35),
                fontSize: 24,
                fontWeight: 750,
                color: '#fcd34d',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="alert" size={24} color={C.amber} />
              {PATCH_BOX}
            </div>
          </div>
        );
      })}
    </div>
  );
}
