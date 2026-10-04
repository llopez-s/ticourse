import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { MEMO_LINES, S09_TEXT } from '../../../data/s09-informe';

/**
 * The one-page note to the CISO (s09): paper, a kicker «Para el CISO ·
 * Meridian Dynamics», the CISO's question as its title, and the four canon
 * lines written one by one (label + value, the value wiping in like a pen).
 * Rows can be highlighted (marker behind them) as the voice lists what a good
 * ACH report carries.
 */

const PAPER = '#f4ecd8';
const PAPER_EDGE = '#d9c9a3';
const INK = '#1e293b';
const NAVY = '#1e3a8a';
const MUTED_INK = '#64748b';
const AMBER_INK = '#b45309';
const MARKER = '#fde047';

export const MEMO = { w: 1120, h: 548, padX: 46, top: 34, labelW: 292, size: 38, line: 47, rowGap: 18 } as const;

/** Reveals its child left to right (p 0–1). */
function Written({ p, children }: { p: number; children: ReactNode }) {
  const k = clamp01(p);
  if (k <= 0) return null;
  return <div style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', clipPath: k < 1 ? `inset(-12px ${(1 - k) * 100}% -12px -12px)` : undefined }}>{children}</div>;
}

export function Memo({
  frame,
  at,
  headerAt,
  rowAt,
  highlight,
  glow = 0,
  style,
}: {
  frame: number;
  /** Paper lands. */
  at: number;
  /** Kicker + title written. */
  headerAt: number;
  /** Per row: [label, value] frames. */
  rowAt: readonly (readonly [number, number])[];
  /** Per row: 0–1 marker weight. */
  highlight: readonly number[];
  glow?: number;
  style?: CSSProperties;
}) {
  const show = progress(frame, at, 16);
  if (show <= 0) return null;
  const g = clamp01(glow);
  const write = (t: number, d = 22) => progress(frame, t, d, EASE.inOut);
  return (
    <div
      style={{
        position: 'relative',
        width: MEMO.w,
        height: MEMO.h,
        boxSizing: 'border-box',
        padding: `${MEMO.top}px ${MEMO.padX}px`,
        borderRadius: 8,
        background: `linear-gradient(180deg, ${PAPER} 0%, #ede3c9 100%)`,
        border: `2px solid ${PAPER_EDGE}`,
        boxShadow: `0 26px 56px ${alpha('#000000', 0.45)}${g > 0 ? `, 0 0 ${Math.round(26 + 26 * g)}px ${alpha(C.cyan, 0.3 * g)}` : ''}`,
        fontFamily: FONT.sans,
        color: INK,
        opacity: show,
        transform: `translateY(${(1 - show) * 24}px) rotate(${-0.5 - (1 - show) * 1.5}deg)`,
        ...style,
      }}
    >
      <Written p={write(headerAt, 18)}>
        <div style={{ fontSize: 28, fontWeight: 750, color: MUTED_INK, letterSpacing: 0.3 }}>{S09_TEXT.kicker}</div>
      </Written>
      <div style={{ height: 6 }} />
      <Written p={write(headerAt + 10, 22)}>
        <div style={{ fontSize: 48, fontWeight: 900, color: NAVY, letterSpacing: -0.3, lineHeight: 1.1 }}>{S09_TEXT.title}</div>
      </Written>
      <div style={{ height: 3, margin: '18px 0 22px', borderRadius: 2, background: alpha(NAVY, 0.35), transformOrigin: '0 50%', transform: `scaleX(${write(headerAt + 18, 20)})` }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: MEMO.rowGap }}>
        {MEMO_LINES.map((m, i) => {
          const [labelAt, valueAt] = rowAt[i];
          const hl = clamp01(highlight[i] ?? 0);
          const isWatch = i === MEMO_LINES.length - 1;
          return (
            <div key={m.label} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', minHeight: MEMO.line * m.lines.length }}>
              {hl > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: -14,
                    top: -4,
                    height: MEMO.line * m.lines.length + 8,
                    width: `calc(${hl * 100}% + 28px)`,
                    borderRadius: 8,
                    background: alpha(MARKER, 0.55),
                  }}
                />
              ) : null}
              <div style={{ position: 'relative', width: MEMO.labelW, flexShrink: 0, lineHeight: `${MEMO.line}px` }}>
                <Written p={write(labelAt, 14)}>
                  <span style={{ fontSize: MEMO.size, fontWeight: 900, color: NAVY }}>{m.label}</span>
                </Written>
              </div>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {m.lines.map((ln, k) => (
                  <div key={ln} style={{ height: MEMO.line, lineHeight: `${MEMO.line}px` }}>
                    <Written p={write(valueAt + k * 18, 24)}>
                      <span style={{ fontSize: MEMO.size, fontWeight: 750, color: isWatch ? AMBER_INK : INK }}>{ln}</span>
                    </Written>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
