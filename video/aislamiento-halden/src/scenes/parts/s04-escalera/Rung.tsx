import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { TermPill } from '../Labels';

/** Column x of a rung's parts (stage-local). */
export const RUNG = { x: 56, w: 1672, termX: 18, diagX: 500, textX: 866 } as const;

/** One piece of a text line: `hot` 0–1 lights it amber (the word the voice stresses). */
export interface Span {
  t: string;
  hot?: number;
}

/** One text line of a rung; `price` lines are amber (what this level costs). */
export interface RungLine {
  spans: Span[];
  show: number;
  price?: boolean;
  /** Extra node at the end of the line (e.g. the «container escape» chip). */
  tail?: ReactNode;
}

/**
 * One rung of the isolation ladder (s04): a dashed slot from `slot`, filled on its cue with the exam term (violet), its
 * diagram and its lines. `focus` 0–1 brightens the frame, `choice` 0–1 rings it emerald (the decision), `dim` 0–1 steps
 * it back.
 */
export function Rung({
  y,
  h,
  slot,
  show,
  term,
  diagram,
  lines,
  focus = 0,
  choice = 0,
  dim = 0,
}: {
  y: number;
  h: number;
  slot: number;
  show: number;
  term: string;
  diagram: ReactNode;
  lines: RungLine[];
  focus?: number;
  choice?: number;
  dim?: number;
}) {
  const s = clamp01(show);
  const f = clamp01(focus);
  const ch = clamp01(choice);
  const edge = ch > 0.01 ? alpha(C.emerald, 0.4 + 0.55 * ch) : alpha(C.violet, 0.2 + 0.45 * f);
  return (
    <div style={{ position: 'absolute', left: RUNG.x, top: y, width: RUNG.w, height: h, opacity: clamp01(slot) * (1 - 0.45 * clamp01(dim)) }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: RADIUS.lg,
          border: s > 0.01 ? `${ch > 0.3 ? 3 : 2}px solid ${edge}` : `2px dashed ${C.ink600}`,
          background: s > 0.01 ? alpha(ch > 0.01 ? C.emerald : C.ink800, ch > 0.01 ? 0.06 * ch : 0.55 * s) : 'transparent',
          boxShadow: ch > 0.02 ? `0 0 ${Math.round(30 * ch)}px ${alpha(C.emerald, 0.25 * ch)}` : undefined,
        }}
      />
      <div style={{ position: 'absolute', left: RUNG.termX, top: h / 2 - 27, opacity: s, transform: `translateX(${(1 - s) * -16}px)` }}>
        <TermPill text={term} on={0.4 + 0.6 * f} size={34} />
      </div>
      <div style={{ position: 'absolute', left: RUNG.diagX - RUNG.x, top: 0, height: h, display: 'flex', alignItems: 'center', opacity: s }}>{diagram}</div>
      <div style={{ position: 'absolute', left: RUNG.textX - RUNG.x, top: 0, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, fontFamily: FONT.sans, fontSize: 32, lineHeight: 1.18 }}>
        {lines.map((l, k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', opacity: clamp01(l.show), transform: `translateY(${(1 - clamp01(l.show)) * 8}px)` }}>
            <span style={{ fontWeight: l.price ? 700 : 750, color: l.price ? '#fcd34d' : C.textStrong }}>
              {l.spans.map((sp, j) => {
                const hot = clamp01(sp.hot ?? 0);
                return (
                  <span
                    key={j}
                    style={
                      hot > 0.01
                        ? { color: C.amber, fontWeight: 900, textShadow: `0 0 ${Math.round(16 * hot)}px ${alpha(C.amber, 0.6 * hot)}` }
                        : undefined
                    }
                  >
                    {sp.t}
                  </span>
                );
              })}
            </span>
            {l.tail}
          </div>
        ))}
      </div>
    </div>
  );
}
