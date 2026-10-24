import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui';
import { Pill, TermPill } from './Labels';

/** One chip inside a card; it comes in at `at` (the voice says it). */
export interface RoleChip {
  text: string;
  at: number;
  /** Colour of the chip; default is the card's tone. */
  tone?: string;
  /** A long chip that may break over two lines (full row width). */
  wrap?: boolean;
}

/**
 * A role card: who holds the post (icon + a short label), the exam term in a violet pill (DATA OWNER…) and the chips
 * that say what it does. Waits as a dashed outline (`skeleton`, 0–1) before `at`; from `at` it comes in, the term lights
 * on `termAt` and each chip on its own frame. `dim` 0–1 steps it back once the next card is the one being talked about.
 * `x`, `y` are stage-local.
 */
export function RoleCard({
  frame,
  x,
  y,
  width,
  height,
  at,
  termAt,
  tone,
  icon,
  who,
  whoSize = 30,
  term,
  chips,
  skeleton = 0,
  dim = 0,
  glow = 0,
  termSize = 42,
  chipSize = 30,
  layout = 'column',
}: {
  frame: number;
  x: number;
  y: number;
  width: number;
  height: number;
  at: number;
  termAt: number;
  tone: string;
  icon: IconName;
  who: string;
  whoSize?: number;
  term: string;
  chips: readonly RoleChip[];
  skeleton?: number;
  dim?: number;
  glow?: number;
  termSize?: number;
  chipSize?: number;
  /** `row` puts the exam term at the right of the header (cards that are wide and short). */
  layout?: 'column' | 'row';
}) {
  const show = progress(frame, at - 4, 14);
  const ghost = skeleton * (1 - show);
  if (show <= 0.01 && ghost <= 0.01) return null;
  const termOn = progress(frame, termAt - 4, 10);
  const lit = Math.max(glow, 0.35 * show);
  const e = enter(frame, at - 4, { distance: 20, duration: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        boxSizing: 'border-box',
        padding: '18px 24px',
        borderRadius: RADIUS.lg,
        background: show > 0.01 ? alpha(C.ink850, 0.96) : 'transparent',
        border: show > 0.01 ? `3px solid ${alpha(tone, 0.45 + 0.4 * lit)}` : `3px dashed ${alpha(C.muted, 0.5)}`,
        boxShadow: show > 0.01 && lit > 0.05 ? `0 0 ${Math.round(34 * lit)}px ${alpha(tone, 0.28 * lit)}` : undefined,
        fontFamily: FONT.sans,
        opacity: show > 0.01 ? e.opacity * (1 - 0.45 * dim) : ghost * 0.6,
        transform: show > 0.01 ? e.transform : undefined,
      }}
    >
      {show > 0.01 ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, minHeight: layout === 'row' ? 66 : 76, justifyContent: layout === 'row' ? 'space-between' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 62, height: 62, flexShrink: 0, borderRadius: 31, display: 'grid', placeItems: 'center', background: alpha(tone, 0.14), border: `3px solid ${alpha(tone, 0.8)}` }}>
                <Icon name={icon} size={34} color={tone} strokeWidth={2.2} />
              </div>
              <div style={{ fontSize: whoSize, fontWeight: 700, lineHeight: 1.18, color: C.text, whiteSpace: layout === 'row' ? 'nowrap' : undefined }}>{who}</div>
            </div>
            {layout === 'row' ? (
              <div style={{ opacity: 0.3 + 0.7 * termOn }}>
                <TermPill text={term} on={termOn} size={termSize} />
              </div>
            ) : null}
          </div>
          {layout === 'column' ? (
            <div style={{ marginTop: 10, opacity: 0.3 + 0.7 * termOn }}>
              <TermPill text={term} on={termOn} size={termSize} />
            </div>
          ) : null}
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {chips.map((c) => {
              const on = progress(frame, c.at - 4, 10);
              if (on <= 0.01) return null;
              if (c.wrap) {
                const t = c.tone ?? tone;
                return (
                  <div
                    key={c.text}
                    style={{
                      opacity: on,
                      transform: `translateY(${(1 - on) * 8}px)`,
                      boxSizing: 'border-box',
                      padding: '8px 24px',
                      borderRadius: 30,
                      border: `2px solid ${alpha(t, 0.4 + 0.5 * on)}`,
                      background: alpha(t, 0.06 + 0.12 * on),
                      fontSize: chipSize,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: C.textStrong,
                    }}
                  >
                    {c.text}
                  </div>
                );
              }
              return (
                <div key={c.text} style={{ opacity: on, transform: `translateY(${(1 - on) * 8}px)` }}>
                  <Pill text={c.text} tone={c.tone ?? tone} on={0.55 + 0.45 * on} size={chipSize} height={Math.round(chipSize * 1.8)} weight={700} />
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
