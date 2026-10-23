import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { FEED_COUNT } from '../../data/canon';

/** A deterministic 0–1 value for row `i` and salt `k` (no Math.random: renders must repeat). */
const hash = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * The panel of twelve feeds that never stop: «feed 1» to «feed 12» (never a source name), each row with a little
 * stream of packets running along its track. Rows drop in one after another from `at`; `tone` tints the packets
 * (cyan: data; amber when the pile is the problem); `strain` (0–1) makes the panel look overwhelmed.
 */
export function FeedPanel({
  width,
  rowH = 33,
  frame,
  at,
  step = 6,
  tone = C.cyan,
  strain = 0,
  show = 1,
  dim = 0,
  style,
}: {
  width: number;
  rowH?: number;
  frame: number;
  at: number;
  step?: number;
  tone?: string;
  strain?: number;
  show?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const pad = 12;
  const labelW = 104;
  const track = width - 2 * pad - labelW - 12;
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        padding: pad,
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(strain > 0.3 ? C.amber : C.ink600, 0.5 + 0.4 * strain)}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.98)} 0%, ${alpha(C.ink900, 0.98)} 100%)`,
        boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}${strain > 0.02 ? `, 0 0 ${Math.round(30 * strain)}px ${alpha(C.amber, 0.25 * strain)}` : ''}`,
        fontFamily: FONT.sans,
        opacity: show * (1 - 0.6 * dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        ...style,
      }}
    >
      {Array.from({ length: FEED_COUNT }, (_, i) => {
        const p = progress(frame, at + i * step, 12);
        const speed = 0.011 + 0.012 * hash(i, 1) + 0.01 * strain;
        const phase = hash(i, 2);
        return (
          <div key={i} style={{ height: rowH, display: 'flex', alignItems: 'center', gap: 12, opacity: p, transform: `translateX(${(1 - p) * -24}px)` }}>
            <span style={{ width: labelW, flexShrink: 0, fontSize: 26, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{`feed ${i + 1}`}</span>
            <div style={{ position: 'relative', width: track, height: 12, borderRadius: 6, background: alpha(C.ink700, 0.9), overflow: 'hidden' }}>
              {[0, 1, 2].map((k) => {
                const x = (((frame - at) * speed + phase + k / 3) % 1 + 1) % 1;
                return <div key={k} style={{ position: 'absolute', left: x * track, top: 0, width: 22 + 14 * hash(i, 3 + k), height: 12, borderRadius: 6, background: alpha(tone, 0.85) }} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The twelve feeds again as chips in a grid (s08's callback), «feed 1» to «feed 12». `used[i]` keeps a feed lit
 * (some requirement needs it); the rest go out when `out` (0–1) rises. `lit` is the 0–1 brightness of the used ones.
 */
export function FeedChips({ cols = 4, chipW = 150, chipH = 54, gap = 14, used = [], out = 0, show = 1, style }: { cols?: number; chipW?: number; chipH?: number; gap?: number; used?: readonly number[]; out?: number; show?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${chipW}px)`, gap, opacity: show, ...style }}>
      {Array.from({ length: FEED_COUNT }, (_, i) => {
        const isUsed = used.includes(i);
        const k = isUsed ? 0 : out;
        return (
          <div
            key={i}
            style={{
              height: chipH,
              boxSizing: 'border-box',
              display: 'grid',
              placeItems: 'center',
              borderRadius: RADIUS.md,
              border: `2px ${k > 0.5 ? 'dashed' : 'solid'} ${isUsed && out > 0.4 ? alpha(C.cyan, 0.9) : alpha(C.ink500, 0.6 + 0.4 * (1 - k))}`,
              background: isUsed && out > 0.4 ? alpha(C.cyan, 0.14) : alpha(C.ink850, 0.9),
              boxShadow: isUsed && out > 0.4 ? `0 0 22px ${alpha(C.cyan, 0.3)}` : undefined,
              fontFamily: FONT.sans,
              fontSize: 28,
              fontWeight: 700,
              color: isUsed && out > 0.4 ? C.cyanSoft : C.text,
              opacity: 1 - 0.62 * k,
              filter: k > 0.01 ? `saturate(${1 - 0.8 * k})` : undefined,
              whiteSpace: 'nowrap',
            }}
          >
            {`feed ${i + 1}`}
          </div>
        );
      })}
    </div>
  );
}
