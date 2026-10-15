import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, dimStyle } from '../../../../../engine/src/ui';

/** Tones of the two levers: ARO (frequency) is sky, EF (share of the value) is rose. */
export const TONE_ARO = '#38bdf8';
export const TONE_EF = C.rose;

export type SwapItem = { at: number; text: string };

/**
 * A text that is replaced by the next one on its frame (cross-fade with a small lift). `items` are in time order; the
 * first is what shows from the start.
 */
export function Swap({ items, frame, ramp = 10, style }: { items: readonly SwapItem[]; frame: number; ramp?: number; style?: CSSProperties }) {
  let idx = 0;
  items.forEach((it, i) => {
    if (i > 0 && frame >= it.at) idx = i;
  });
  const cur = items[idx];
  const prev = idx > 0 ? items[idx - 1] : null;
  const t = idx > 0 ? progress(frame, cur.at, ramp) : 1;
  return (
    <span style={{ display: 'inline-grid', ...style }}>
      {prev && t < 1 ? (
        <span style={{ gridArea: '1 / 1', opacity: 1 - t, transform: `translateY(${-t * 10}px)`, whiteSpace: 'nowrap' }}>{prev.text}</span>
      ) : null}
      <span style={{ gridArea: '1 / 1', opacity: t, transform: `translateY(${(1 - t) * 10}px)`, whiteSpace: 'nowrap' }}>{cur.text}</span>
    </span>
  );
}

export const PANEL_W = 840;
export const PANEL_H = 296;

/** Shell of a lever panel: border, header with the term and what it counts, and the «ahora» chip. */
export function LeverPanel({
  tone,
  term,
  def,
  focus,
  dim,
  show,
  chip,
  chipShow,
  children,
}: {
  tone: string;
  term: string;
  def: string;
  focus: number;
  dim: number;
  show: number;
  chip: string;
  chipShow: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: PANEL_W,
        height: PANEL_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.4 + 0.5 * focus)}`,
        background: `linear-gradient(160deg, ${alpha(C.ink800, 0.9)}, ${alpha(C.ink900, 0.95)})`,
        boxShadow: focus > 0.02 ? `0 0 ${Math.round(34 * focus)}px ${alpha(tone, 0.28 * focus)}` : undefined,
        fontFamily: FONT.sans,
        ...dimStyle(dim, show),
        transform: `translateY(${(1 - show) * 18}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: 26, top: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            fontFamily: FONT.mono,
            fontSize: 34,
            fontWeight: 850,
            letterSpacing: 2,
            color: tone,
            padding: '2px 16px',
            borderRadius: RADIUS.pill,
            border: `3px solid ${alpha(tone, 0.85)}`,
            background: alpha(tone, 0.12),
          }}
        >
          {term}
        </span>
        <span style={{ fontSize: 36, fontWeight: 700, color: C.text }}>{def}</span>
      </div>
      {chipShow > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: 22,
            top: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 18px 6px 12px',
            borderRadius: RADIUS.pill,
            border: `3px solid ${alpha(C.amber, 0.85)}`,
            background: alpha(C.amberDeep, 0.55),
            fontSize: 32,
            fontWeight: 800,
            color: '#fde68a',
            whiteSpace: 'nowrap',
            opacity: chipShow,
            transform: `translateX(${(1 - chipShow) * 20}px)`,
          }}
        >
          <Icon name="arrowDown" size={30} color={C.amber} strokeWidth={3} />
          {chip}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** The big value + « · » + its reading («0,5 · una vez cada dos años»). */
export function Readout({ tone, nums, reads, frame }: { tone: string; nums: readonly SwapItem[]; reads: readonly SwapItem[]; frame: number }) {
  return (
    <div style={{ position: 'absolute', left: 26, top: 80, display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap' }}>
      <Swap items={nums} frame={frame} style={{ fontFamily: FONT.mono, fontSize: 84, fontWeight: 850, color: tone, lineHeight: '92px', minWidth: 152 }} />
      <span style={{ fontSize: 38, fontWeight: 700, color: C.faint }}>·</span>
      <Swap items={reads} frame={frame} style={{ fontSize: 38, fontWeight: 700, color: C.textStrong }} />
    </div>
  );
}

/** ARO's picture: ten squares, one per year; a mark is a hit that is expected (`marks[i]` 0–1 = how present). */
export function YearStrip({ marks, label }: { marks: readonly number[]; label: string }) {
  return (
    <div style={{ position: 'absolute', left: 26, top: 190 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {marks.map((m, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              width: 60,
              height: 60,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `2px solid ${alpha(C.ink500, 0.9)}`,
              background: alpha(C.ink950, 0.7),
            }}
          >
            {m > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 5,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  background: alpha(TONE_ARO, 0.9),
                  opacity: m,
                  transform: `scale(${0.6 + 0.4 * m})`,
                }}
              >
                <Icon name="bolt" size={30} color={C.ink950} strokeWidth={2.4} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 6, fontSize: 26, fontWeight: 600, color: C.faint }}>{label}</div>
    </div>
  );
}

/** EF's picture: the asset as one column; the part that is lost fills it from the top (`share` 0–1). */
export function ValueTank({ share, label }: { share: number; label: string }) {
  const H = 158;
  const W = 150;
  return (
    <div style={{ position: 'absolute', left: 644, top: 78, width: W, textAlign: 'center' }}>
      <div
        style={{
          position: 'relative',
          width: W,
          height: H,
          boxSizing: 'border-box',
          borderRadius: 14,
          border: `3px solid ${alpha(C.ink500, 0.95)}`,
          background: `linear-gradient(180deg, ${alpha(C.cyan, 0.16)}, ${alpha(C.cyan, 0.06)})`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: H * share,
            background: `repeating-linear-gradient(135deg, ${alpha(C.rose, 0.95)} 0 10px, ${alpha(C.rose, 0.55)} 10px 20px)`,
            borderBottom: `3px solid ${C.roseSoft}`,
          }}
        />
      </div>
      <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, letterSpacing: 2, color: C.violet }}>{label}</div>
    </div>
  );
}

/** One slot of the equation: a small exam-term label over the value. */
export function EqSlot({ label, width, tone, align = 'center', children, dim = 0 }: { label: string; width: number; tone: string; align?: 'center' | 'left'; children: ReactNode; dim?: number }) {
  return (
    <div style={{ width, textAlign: align, ...dimStyle(dim) }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 800, letterSpacing: 2, color: C.violet, lineHeight: '30px' }}>{label}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: 52, fontWeight: 850, color: tone, lineHeight: '60px', whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

export function EqOp({ children }: { children: ReactNode }) {
  return <div style={{ width: 40, textAlign: 'center', fontFamily: FONT.mono, fontSize: 52, fontWeight: 700, color: C.muted, lineHeight: '60px', paddingTop: 30 }}>{children}</div>;
}

export { EASE };
