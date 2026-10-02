import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The abstraction ladder: three stacked rungs, top to bottom, TACTIC (sky,
 * the why) · TECHNIQUE (cyan, the how) · PROCEDURE (rose, this actor's own
 * way). Each rung has a big English label, a content slot and a small Spanish
 * gloss, between two drawn rails. Laid out in px at `width` (no scaling);
 * `ladderLayout` gives every rung's box so scenes can attach links.
 *
 * Full mode: rung 172 px tall (label line + a two-line content slot).
 * Compact mode: rung 100 px (label + optional one-line content, gloss under).
 */

export const RUNG_LABELS = ['TACTIC', 'TECHNIQUE', 'PROCEDURE'] as const;
export const RUNG_TONES = [C.sky, C.cyan, C.rose] as const;

export interface LadderRung {
  /** Frame (Sequence-relative) the rung appears; omit for always shown. */
  at?: number;
  content?: ReactNode;
  gloss?: ReactNode;
}

const FULL = { h: 172, gap: 10, padX: 20, padTop: 12, labelLine: 50, labelSize: 44, glossSize: 32 } as const;
const COMPACT = { h: 100, gap: 10, padX: 20, padTop: 8, labelLine: 44, labelSize: 34, glossSize: 32 } as const;
/** Rail inset from the ladder's edges; rungs sit between the rails. */
const RAIL = 10;
const RUNG_INSET = 22;

export interface RungBox {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Top-left of the content slot. */
  contentX: number;
  contentY: number;
}

/** Boxes of the three rungs (px from the ladder's top-left) and the total height. */
export function ladderLayout(width: number, compact = false): { rungs: RungBox[]; height: number } {
  const m = compact ? COMPACT : FULL;
  const rungs = [0, 1, 2].map((i) => {
    const x = RUNG_INSET;
    const y = i * (m.h + m.gap);
    const w = width - 2 * RUNG_INSET;
    // Bar (8) + padding on the left; content under the label line in full mode, beside it in compact mode.
    return {
      x,
      y,
      w,
      h: m.h,
      contentX: x + 8 + m.padX,
      contentY: y + m.padTop + m.labelLine,
    };
  });
  return { rungs, height: 3 * m.h + 2 * m.gap };
}

export function Ladder({
  width,
  frame: frameProp,
  rungs,
  focus,
  dim = 0.6,
  compact = false,
  style,
}: {
  width: number;
  frame?: number;
  rungs: [LadderRung, LadderRung, LadderRung];
  /** The rung the voice is on (0 TACTIC, 1 TECHNIQUE, 2 PROCEDURE), or one 0–1 weight per rung. */
  focus?: 0 | 1 | 2 | readonly number[];
  /** How much the rungs out of focus step back (0–1) while one is in focus. */
  dim?: number;
  compact?: boolean;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const m = compact ? COMPACT : FULL;
  const { rungs: boxes, height } = ladderLayout(width, compact);

  const shown = rungs.map((r) => (r.at === undefined ? 1 : progress(frame, r.at, 16, EASE.out)));
  const weights: number[] =
    focus === undefined ? [0, 0, 0] : typeof focus === 'number' ? [0, 1, 2].map((i) => (i === focus ? 1 : 0)) : [0, 1, 2].map((i) => clamp01(focus[i] ?? 0));
  const anyFocus = Math.max(...weights);

  // Rails grow down to the last rung that is showing.
  const railTo = boxes.reduce((acc, b, i) => (shown[i] > 0 ? Math.max(acc, b.y + b.h * shown[i]) : acc), 0);

  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {railTo > 0
          ? [RAIL, width - RAIL].map((x) => (
              <line key={x} x1={x} y1={-6} x2={x} y2={railTo + 6} stroke={C.ink500} strokeWidth={compact ? 4 : 5} strokeLinecap="round" />
            ))
          : null}
        {boxes.map((b, i) =>
          shown[i] > 0
            ? [RAIL, width - RAIL].map((x) => (
                <line
                  key={`${i}-${x}`}
                  x1={x}
                  y1={b.y + b.h / 2}
                  x2={x === RAIL ? b.x : b.x + b.w}
                  y2={b.y + b.h / 2}
                  stroke={C.ink500}
                  strokeWidth={compact ? 4 : 5}
                  opacity={shown[i]}
                />
              ))
            : null,
        )}
      </svg>

      {boxes.map((b, i) => {
        const p = shown[i];
        if (p <= 0) return null;
        const tone = RUNG_TONES[i];
        const f = weights[i];
        const d = clamp01(dim) * anyFocus * (1 - f);
        const r = rungs[i];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              boxSizing: 'border-box',
              borderRadius: compact ? 14 : 18,
              border: `2px solid ${alpha(tone, 0.35 + 0.5 * f)}`,
              background: `linear-gradient(90deg, ${alpha(tone, 0.1 + 0.08 * f)} 0%, ${alpha(C.ink900, 0.94)} 55%)`,
              boxShadow: f > 0 ? `0 0 ${Math.round(30 * f)}px ${alpha(tone, 0.3 * f)}` : undefined,
              overflow: 'hidden',
              opacity: p * (1 - 0.6 * d),
              filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
              transform: `translateY(${(1 - p) * -18}px)`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: tone }} />
            {/* Label line: English label, gloss on the right (full mode) */}
            <div
              style={{
                position: 'absolute',
                left: 8 + m.padX,
                right: m.padX,
                top: m.padTop,
                height: m.labelLine,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                fontFamily: FONT.sans,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: m.labelSize, fontWeight: 850, letterSpacing: compact ? 1.5 : 2.5, color: tone, lineHeight: 1 }}>{RUNG_LABELS[i]}</span>
              {compact && r.content ? <span style={{ fontSize: 28, fontWeight: 650, color: C.text, lineHeight: 1 }}>{r.content}</span> : null}
              {!compact && r.gloss ? (
                <span style={{ marginLeft: 'auto', fontSize: m.glossSize, fontWeight: 600, color: C.muted, lineHeight: 1 }}>{r.gloss}</span>
              ) : null}
            </div>
            {/* Content slot (full) / gloss line (compact) */}
            <div
              style={{
                position: 'absolute',
                left: 8 + m.padX,
                right: m.padX,
                top: m.padTop + m.labelLine,
                bottom: compact ? 6 : 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontFamily: FONT.sans,
                whiteSpace: 'nowrap',
              }}
            >
              {compact ? (
                r.gloss ? <span style={{ fontSize: m.glossSize, fontWeight: 600, color: C.text, lineHeight: 1.1 }}>{r.gloss}</span> : null
              ) : (
                r.content
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
