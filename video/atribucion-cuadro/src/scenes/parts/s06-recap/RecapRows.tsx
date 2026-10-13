import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { progress, pulse, springIn } from '../../../../../engine/src/theme/motion';
import { DIM, dimStyle, focusWeights } from '../../../../../engine/src/ui';
import { THUMB } from './Thumbs';

/** One rule card. Frames are local to the scene's Sequence. */
export interface RecapRowDef {
  /** Frame the card lights: the voice starts the rule. */
  at: number;
  /** The thumbnail, centred in its slot. */
  thumb: ReactNode;
  /** The rule's lines, right of the thumbnail. */
  body: ReactNode;
}

const PAD_X = 20;
const BADGE = 54;
const THUMB_X = PAD_X + BADGE + 18;
const TEXT_X = THUMB_X + THUMB.w + 30;

/**
 * The rule cards in the look of the engine's RuleCards (numbered dashed slots wait, each card springs in on
 * its frame and glows until the next lights, earlier cards step back, `dimFrom` steps all of them back) —
 * laid out as full-width ROWS, one under the other, because these rules are whole sentences: each keeps its
 * title on one line at focus size, with its thumbnail on the left. The thumbnails are in their slots from
 * `thumbAt` (the `recap` cue), before any rule is said.
 */
export function RecapRows({
  rows,
  width,
  rowHeight,
  gap,
  slotAt = 0,
  thumbAt,
  dimFrom,
  frame,
  fps,
}: {
  rows: readonly RecapRowDef[];
  width: number;
  rowHeight: number;
  gap: number;
  /** Frame the numbered placeholder slots start to appear (staggered). */
  slotAt?: number;
  /** Frame the thumbnails come into their waiting slots (staggered). */
  thumbAt: number;
  /** Frame from which every card steps back. */
  dimFrom?: number;
  frame: number;
  fps: number;
}) {
  const allDim = dimFrom === undefined ? 0 : progress(frame, dimFrom - 4, 14);
  const { weights, dims } = focusWeights(
    frame,
    rows.map((r) => r.at),
    { end: dimFrom },
  );
  return (
    <div style={{ position: 'relative', width, height: rows.length * rowHeight + (rows.length - 1) * gap, fontFamily: FONT.sans }}>
      {rows.map((row, i) => {
        const slot = progress(frame, slotAt + i * 4, 12);
        const waiting = progress(frame, thumbAt + i * 5, 14);
        const p = springIn(frame, fps, row.at - 4, { damping: 16 });
        const lit = Math.min(1, p * 1.3);
        const d = Math.max(dims[i] * lit, 0.55 * allDim);
        const glow = weights[i] * (0.75 + 0.25 * pulse(frame, fps, 0.5));
        const box = { position: 'absolute' as const, inset: 0, boxSizing: 'border-box' as const, borderRadius: RADIUS.lg };
        const on = glow > 0.3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: i * (rowHeight + gap),
              width,
              height: rowHeight,
              ...dimStyle(d),
              transform: `translateY(${(1 - slot) * 14}px) scale(${1 - (1 - DIM.scale) * d * 0.5})`,
            }}
          >
            {/* The waiting slot */}
            {lit < 1 ? <div style={{ ...box, border: `2px dashed ${C.ink600}`, opacity: slot * (1 - lit) }} /> : null}
            {lit > 0 ? (
              <div
                style={{
                  ...box,
                  border: `${on ? 3 : 2}px solid ${alpha(C.cyan, 0.35 + 0.55 * glow)}`,
                  background: `linear-gradient(90deg, ${alpha(C.cyan, 0.06 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 38%)`,
                  boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.cyan, 0.28 * glow)}` : `0 16px 40px ${alpha('#000000', 0.3)}`,
                  opacity: lit,
                }}
              />
            ) : null}
            {/* The number: a ghost while the slot waits, a badge once the rule is said */}
            <div
              style={{
                position: 'absolute',
                left: PAD_X,
                top: (rowHeight - BADGE) / 2,
                width: BADGE,
                height: BADGE,
                boxSizing: 'border-box',
                borderRadius: BADGE / 2,
                display: 'grid',
                placeItems: 'center',
                background: on ? C.cyan : alpha(C.cyan, 0.18 * lit),
                border: `2px solid ${lit > 0.5 ? alpha(C.cyan, 0.7) : C.ink600}`,
                fontSize: 32,
                fontWeight: 850,
                color: on ? C.ink950 : lit > 0.5 ? C.cyanSoft : C.ink500,
                opacity: slot,
              }}
            >
              {i + 1}
            </div>
            <div style={{ position: 'absolute', left: THUMB_X, top: 0, width: THUMB.w, height: rowHeight, display: 'grid', placeItems: 'center', opacity: Math.max(0.5 * waiting, lit) }}>
              {row.thumb}
            </div>
            {lit > 0 ? (
              <div style={{ position: 'absolute', left: TEXT_X, right: 20, top: 0, height: rowHeight, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: lit, transform: `translateX(${(1 - Math.min(1, p)) * 18}px)` }}>
                {row.body}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
