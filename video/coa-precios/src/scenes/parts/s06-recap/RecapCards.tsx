import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { DIM, dimStyle, focusWeights } from '../../../../../engine/src/ui';

/** One rule card. Frames are local to the scene's Sequence. */
export interface RecapCardDef {
  /** Frame the card lights: the voice starts the rule. */
  at: number;
  /** The drawing, centred in the art slot. */
  art: ReactNode;
  /** The rule's lines, under the drawing. */
  body: ReactNode;
}

/** Inner padding and border of a lit card: its drawing gets `recapArtWidth()` px. */
export const CARD_PAD = { x: 20, top: 14, bottom: 16, border: 3 } as const;

/** Width of one card of `RecapCards` laid out over `width` with `gap`. */
export function recapCardWidth(width: number, gap: number, n = 3): number {
  return (width - gap * (n - 1)) / n;
}

/** Width left for a card's drawing and lines. */
export function recapArtWidth(width: number, gap: number, n = 3): number {
  return recapCardWidth(width, gap, n) - 2 * (CARD_PAD.x + CARD_PAD.border);
}

/**
 * N rule cards side by side, in the look of the engine's RuleCards (numbered dashed slots wait, each
 * card springs in on its frame and glows until the next lights, earlier cards step back, `dimFrom`
 * steps all of them back) — drawn here because these rules carry a drawing of the video's own image
 * and up to four lines lit one by one, more than that piece's two nowrap lines.
 */
export function RecapCards({
  cards,
  width,
  height,
  gap = 24,
  artHeight,
  slotAt = 0,
  dimFrom,
  frame,
  fps,
}: {
  cards: readonly RecapCardDef[];
  width: number;
  height: number;
  gap?: number;
  artHeight: number;
  /** Frame the numbered placeholder slots start to appear (staggered). */
  slotAt?: number;
  /** Frame from which every card steps back. */
  dimFrom?: number;
  frame: number;
  fps: number;
}) {
  const n = cards.length;
  const w = recapCardWidth(width, gap, n);
  const allDim = dimFrom === undefined ? 0 : progress(frame, dimFrom - 4, 14);
  const { weights, dims } = focusWeights(
    frame,
    cards.map((c) => c.at),
    { end: dimFrom },
  );
  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans }}>
      {cards.map((card, i) => {
        const left = i * (w + gap);
        const slot = progress(frame, slotAt + i * 4, 12);
        const p = springIn(frame, fps, card.at - 4, { damping: 16 });
        const lit = Math.min(1, p * 1.3);
        const d = Math.max(dims[i] * lit, 0.8 * allDim);
        const glow = weights[i] * (0.75 + 0.25 * pulse(frame, fps, 0.5));
        const box = { position: 'absolute' as const, left, top: 0, width: w, height, boxSizing: 'border-box' as const, borderRadius: RADIUS.lg };
        return (
          <div key={i}>
            {/* The waiting slot */}
            {lit < 1 ? (
              <div style={{ ...box, border: `2px dashed ${C.ink600}`, display: 'grid', placeItems: 'center', opacity: slot * (1 - lit), transform: `translateY(${(1 - slot) * 16}px)` }}>
                <span style={{ fontSize: 120, fontWeight: 850, color: C.ink700 }}>{i + 1}</span>
              </div>
            ) : null}
            {lit > 0 ? (
              <div
                style={{
                  ...box,
                  padding: `${CARD_PAD.top}px ${CARD_PAD.x}px ${CARD_PAD.bottom}px`,
                  border: `${CARD_PAD.border}px solid ${alpha(C.cyan, 0.3 + 0.6 * glow)}`,
                  background: `linear-gradient(180deg, ${alpha(C.cyan, 0.05 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 55%)`,
                  boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.28 * glow)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
                  overflow: 'hidden',
                  ...dimStyle(d, lit),
                  transform: `translateY(${(1 - p) * 22}px) scale(${(0.96 + 0.04 * Math.min(1, p)) * (1 - (1 - DIM.scale) * d)})`,
                }}
              >
                <div style={{ height: artHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.art}</div>
                <div style={{ height: height - artHeight - CARD_PAD.top - CARD_PAD.bottom - 2 * CARD_PAD.border, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{card.body}</div>
                {/* The rule's number, over the drawing's free corner */}
                <div
                  style={{
                    position: 'absolute',
                    left: 15,
                    top: 15,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    display: 'grid',
                    placeItems: 'center',
                    background: glow > 0.3 ? C.cyan : '#0d3340',
                    border: `2px solid ${alpha(C.cyan, 0.7)}`,
                    fontSize: 33,
                    fontWeight: 850,
                    color: glow > 0.3 ? C.ink950 : C.cyanSoft,
                  }}
                >
                  {i + 1}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
