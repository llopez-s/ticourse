import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The small Diamond Model of this video (V3's, redrawn; canonical order: Adversary on top, Capability left,
 * Infrastructure right, Victim at the bottom). It never carries data: a corner is either a NAMED card or a
 * dim node with two illegible bars. The Adversary card can carry the dashed amber «UNKNOWN» stamp.
 *
 * <Diamond width height? … /> — an absolutely positioned box `width` × `height` px (default height
 * 0.62 × width); wrap it in a positioned div. Props (numbers 0–1 unless said otherwise):
 *   nameSize = 30     px of the corner names (UNKNOWN is drawn at 0.9 ×)
 *   draw = 1          the four edges, drawn clockwise from the top
 *   named = {adv: 1}  which corners are cards with their name (Adversary / Capability / Infrastructure /
 *                     Victim, exam terms in violet); the others are dim nodes with bars
 *   lit = {adv: 1}    glow per corner: Adversary amber (unknown), Capability / Infrastructure cyan
 *   unknown = 1       the «UNKNOWN» stamp in the Adversary card · pulse = 0 makes it swell
 *   linesLit = 0      the edges turn cyan
 *   dim = 0           the whole part steps back · style? extra CSS
 *
 * diamondLayout(width, height?, nameSize?) → px from the part's top-left: `at` (the four vertices) and `card`
 * (the rect of each corner's card), to hang connectors on. DIAMOND_UNKNOWN = 'UNKNOWN'; <UnknownStamp size />
 * is the stamp alone (s05 reuses it on «quién teclea: desconocido»).
 */
export type Corner = 'adv' | 'cap' | 'infra' | 'vic';
export const CORNER_NAME: Record<Corner, string> = { adv: 'Adversary', cap: 'Capability', infra: 'Infrastructure', vic: 'Victim' };
export const DIAMOND_UNKNOWN = 'UNKNOWN';
const CORNERS: Corner[] = ['adv', 'infra', 'vic', 'cap'];
const VIOLET_SOFT = '#c4b5fd';
const AMBER_SOFT = '#fcd34d';

type Box = { x: number; y: number; w: number; h: number };

export function diamondLayout(width: number, height = Math.round(width * 0.62), nameSize = 30) {
  const sideW = Math.round(nameSize * 7.9);
  const sideH = Math.round(nameSize * 1.2 + 22);
  const advW = Math.round(nameSize * 6.6);
  const advH = Math.round(nameSize * 1.2 + nameSize * 0.9 * 1.25 + 38);
  const at: Record<Corner, { x: number; y: number }> = {
    adv: { x: width / 2, y: advH / 2 },
    vic: { x: width / 2, y: height - sideH / 2 },
    cap: { x: sideW / 2, y: 0 },
    infra: { x: width - sideW / 2, y: 0 },
  };
  at.cap.y = at.infra.y = Math.round((at.adv.y + at.vic.y) / 2 + advH * 0.12);
  const box = (c: Corner, w: number, h: number): Box => ({ x: at[c].x - w / 2, y: at[c].y - h / 2, w, h });
  const card: Record<Corner, Box> = { adv: box('adv', advW, advH), cap: box('cap', sideW, sideH), infra: box('infra', sideW, sideH), vic: box('vic', sideW, sideH) };
  return { width, height, at, card };
}

/** The dashed amber stamp on its own. */
export function UnknownStamp({ size = 27, pulse = 0, style }: { size?: number; pulse?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${Math.round(size * 0.14)}px ${Math.round(size * 0.5)}px`,
        borderRadius: Math.round(size * 0.36),
        border: `2px dashed ${alpha(C.amber, 0.85)}`,
        background: alpha(C.amber, 0.1 + 0.14 * pulse),
        boxShadow: pulse > 0.02 ? `0 0 ${Math.round(22 * pulse)}px ${alpha(C.amber, 0.5 * pulse)}` : undefined,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: 2,
        lineHeight: 1.1,
        color: AMBER_SOFT,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {DIAMOND_UNKNOWN}
    </span>
  );
}

export type DiamondProps = {
  width: number;
  height?: number;
  nameSize?: number;
  draw?: number;
  named?: Partial<Record<Corner, number>>;
  lit?: Partial<Record<Corner, number>>;
  unknown?: number;
  pulse?: number;
  linesLit?: number;
  dim?: number;
  style?: CSSProperties;
};

export function Diamond({ width, height, nameSize = 30, draw = 1, named = { adv: 1 }, lit = { adv: 1 }, unknown = 1, pulse = 0, linesLit = 0, dim = 0, style }: DiamondProps) {
  const L = diamondLayout(width, height, nameSize);
  const toneOf = (c: Corner) => (c === 'adv' ? C.amber : c === 'vic' ? C.muted : C.cyan);
  return (
    <div style={{ position: 'relative', width: L.width, height: L.height, opacity: 1 - 0.62 * dim, filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined, ...style }}>
      <svg width={L.width} height={L.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {CORNERS.map((a, i) => {
          const b = CORNERS[(i + 1) % 4];
          const p = Math.max(0, Math.min(1, draw * 4 - i));
          if (p <= 0) return null;
          const A = L.at[a];
          const B = L.at[b];
          return (
            <g key={a} strokeLinecap="round">
              <line x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={alpha(C.muted, 0.7)} strokeWidth={4} />
              {linesLit > 0.01 ? <line x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={alpha(C.cyan, linesLit)} strokeWidth={4} /> : null}
            </g>
          );
        })}
      </svg>
      {CORNERS.map((c) => {
        const n = named[c] ?? 0;
        const g = lit[c] ?? 0;
        const tone = toneOf(c);
        const r = L.card[c];
        if (n < 0.5) {
          // a dim node: something is filed there, nothing readable
          const w = Math.round(nameSize * 4.4);
          const h = Math.round(nameSize * 1.7);
          return (
            <div key={c} style={{ position: 'absolute', left: L.at[c].x - w / 2, top: L.at[c].y - h / 2, width: w, height: h, boxSizing: 'border-box', borderRadius: 12, border: `2px solid ${alpha(C.faint, 0.75)}`, background: C.ink900, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(nameSize * 0.2), padding: `0 ${Math.round(nameSize * 0.5)}px`, opacity: Math.min(1, draw * 2) }}>
              <div style={{ height: Math.max(4, nameSize * 0.18), width: '100%', borderRadius: 4, background: alpha(C.faint, 0.6) }} />
              <div style={{ height: Math.max(4, nameSize * 0.18), width: '62%', borderRadius: 4, background: alpha(C.faint, 0.45) }} />
            </div>
          );
        }
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 16,
              border: `3px solid ${alpha(tone, 0.45 + 0.55 * g)}`,
              background: `linear-gradient(180deg, ${alpha(tone, 0.1 + 0.1 * g)} 0%, ${alpha(C.ink900, 0.96)} 100%), ${C.ink900}`,
              boxShadow: g > 0.02 ? `0 0 ${Math.round(30 * g)}px ${alpha(tone, 0.4 * g)}` : undefined,
              fontFamily: FONT.sans,
              opacity: n,
            }}
          >
            <span style={{ fontSize: nameSize, fontWeight: 850, lineHeight: 1.1, color: VIOLET_SOFT, whiteSpace: 'nowrap' }}>{CORNER_NAME[c]}</span>
            {c === 'adv' && unknown > 0.01 ? <UnknownStamp size={Math.round(nameSize * 0.9)} pulse={pulse} style={{ opacity: unknown }} /> : null}
          </div>
        );
      })}
    </div>
  );
}
