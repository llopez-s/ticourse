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
  /**
   * Small print: a strip that unrolls under the card's own height, so a card that carries one
   * ends up taller than its neighbours (`footHeight` px at `footOpen` = 1).
   */
  foot?: ReactNode;
  footHeight?: number;
  footOpen?: number;
  /** How far this card steps back from `dimFrom` on (0–1; default 1). */
  rest?: number;
}

const PAD = { x: 26, top: 16, bottom: 18 } as const;

/** Width of one card of `RecapCards` laid out over `width` with `gap`. */
export function recapCardWidth(width: number, gap: number, n = 3): number {
  return (width - gap * (n - 1)) / n;
}

/**
 * N rule cards side by side, in the look of the engine's RuleCards (numbered dashed slots wait,
 * each card springs in on its frame and glows until the next lights, earlier cards step back,
 * `dimFrom` steps all of them back) — drawn here because these cards carry free-form lines
 * (exam names in violet inside the rule) and one of them a wrapped footnote that hangs below.
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
        const d = Math.max(dims[i] * lit, allDim * (card.rest ?? 1));
        const glow = weights[i] * (0.75 + 0.25 * pulse(frame, fps, 0.5));
        const open = card.foot ? Math.max(0, Math.min(1, card.footOpen ?? 1)) : 0;
        const footH = (card.footHeight ?? 0) * open;
        return (
          <div key={i}>
            {/* The waiting slot */}
            {lit < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 0,
                  width: w,
                  height,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px dashed ${C.ink600}`,
                  display: 'grid',
                  placeItems: 'center',
                  opacity: slot * (1 - lit),
                  transform: `translateY(${(1 - slot) * 16}px)`,
                }}
              >
                <span style={{ fontSize: 120, fontWeight: 850, color: C.ink700 }}>{i + 1}</span>
              </div>
            ) : null}
            {lit > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: 0,
                  width: w,
                  height: height + footH,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(C.cyan, 0.35 + 0.55 * glow)}`,
                  background: `linear-gradient(180deg, ${alpha(C.cyan, 0.05 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} ${Math.round((55 * height) / (height + footH))}%)`,
                  boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.28 * glow)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
                  overflow: 'hidden',
                  ...dimStyle(d, lit),
                  transform: `translateY(${(1 - p) * 22}px) scale(${(0.96 + 0.04 * Math.min(1, p)) * (1 - (1 - DIM.scale) * d)})`,
                  transformOrigin: `50% ${height / 2}px`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 18,
                    top: 18,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    display: 'grid',
                    placeItems: 'center',
                    background: glow > 0.3 ? C.cyan : alpha(C.cyan, 0.18),
                    border: `2px solid ${alpha(C.cyan, 0.7)}`,
                    fontSize: 33,
                    fontWeight: 850,
                    color: glow > 0.3 ? C.ink950 : C.cyanSoft,
                  }}
                >
                  {i + 1}
                </div>
                {/* The rule: its drawing and its lines, in the card's own height */}
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: height - 4, boxSizing: 'border-box', padding: `${PAD.top}px ${PAD.x}px ${PAD.bottom}px` }}>
                  <div style={{ height: artHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.art}</div>
                  <div style={{ marginTop: 12 }}>{card.body}</div>
                </div>
                {/* The small print, hanging below */}
                {card.foot && footH > 0.5 ? (
                  <div style={{ position: 'absolute', left: 0, top: height - 4, width: '100%', height: card.footHeight, boxSizing: 'border-box', padding: `0 ${PAD.x}px`, background: alpha(C.ink950, 0.45), opacity: Math.min(1, open * 1.2) }}>
                    <div style={{ height: 2, background: alpha(C.cyan, 0.3) }} />
                    {card.foot}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
