import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { AV, SLICE_VALUE } from '../../../data/s02-evento';

export const BLOCK_W = 860;
export const BLOCK_H = 200;
export const QUARTER = BLOCK_W / 4;
const R = 20;

/**
 * The asset value as one block of four equal quarters. State, all 0–1:
 *   show       the block draws in
 *   full       the whole block turns rose: «lo perdieras entero» (no text — it is the hypothesis the answer denies)
 *   marks      the quarter dividers appear
 *   hot        the last quarter is the one that is lost (rose)
 *   travel     the last quarter leaves the block (to `dx` px to the right)
 *   value      the result «100.000 €» shows on the piece that left
 *   glow       extra halo on the piece
 */
export function AssetBlock({
  show,
  full = 0,
  marks = 0,
  hot = 0,
  travel = 0,
  dx = 315,
  value = 0,
  glow = 0,
}: {
  show: number;
  full?: number;
  marks?: number;
  hot?: number;
  travel?: number;
  dx?: number;
  value?: number;
  glow?: number;
}) {
  const s = clamp01(show);
  const body = {
    position: 'absolute' as const,
    top: 0,
    height: BLOCK_H,
    boxSizing: 'border-box' as const,
  };
  const cyanFill = `linear-gradient(180deg, ${alpha(C.cyan, 0.2)} 0%, ${alpha(C.cyanDeep, 0.35)} 100%)`;
  const roseFill = `linear-gradient(180deg, ${alpha(C.rose, 0.3)} 0%, ${alpha(C.roseDeep, 0.8)} 100%)`;
  return (
    <div style={{ position: 'relative', width: BLOCK_W, height: BLOCK_H, fontFamily: FONT.sans, opacity: s, transform: `scale(${0.97 + 0.03 * s})`, transformOrigin: 'left center' }}>
      {/* The first three quarters: what stays */}
      <div
        style={{
          ...body,
          left: 0,
          width: 3 * QUARTER,
          borderRadius: `${R}px 0 0 ${R}px`,
          border: `3px solid ${alpha(C.cyan, 0.75)}`,
          borderRight: 'none',
          background: cyanFill,
        }}
      />
      {/* The ghost of the quarter once it has left */}
      <div
        style={{
          ...body,
          left: 3 * QUARTER,
          width: QUARTER,
          borderRadius: `0 ${R}px ${R}px 0`,
          border: `3px dashed ${alpha(C.rose, 0.6)}`,
          borderLeft: 'none',
          opacity: clamp01(travel * 2),
        }}
      />
      {/* Quarter marks: short ticks on the top and bottom edges (the text runs across the first three quarters),
          and a full dashed line only at the cut of the last quarter */}
      {[1, 2].map((q) => (
        <div key={q} style={{ opacity: clamp01(marks) }}>
          <div style={{ position: 'absolute', left: q * QUARTER - 1, top: 0, height: 22, borderLeft: `3px solid ${alpha(C.cyanSoft, 0.8)}` }} />
          <div style={{ position: 'absolute', left: q * QUARTER - 1, top: BLOCK_H - 22, height: 22, borderLeft: `3px solid ${alpha(C.cyanSoft, 0.8)}` }} />
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 3 * QUARTER - 1,
          top: 12,
          height: BLOCK_H - 24,
          borderLeft: `3px dashed ${alpha(hot > 0.3 ? C.rose : C.text, 0.75)}`,
          opacity: clamp01(marks) * (1 - clamp01(travel * 2)),
        }}
      />
      {/* The last quarter: it is the piece that leaves */}
      <div
        style={{
          ...body,
          left: 3 * QUARTER,
          width: QUARTER,
          borderRadius: `0 ${R}px ${R}px 0`,
          border: `3px solid ${alpha(hot > 0.3 || travel > 0 ? C.rose : C.cyan, 0.8)}`,
          borderLeft: travel > 0 ? `3px solid ${alpha(C.rose, 0.8)}` : 'none',
          background: hot > 0 ? roseFill : cyanFill,
          boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(C.rose, 0.45 * glow)}` : undefined,
          transform: `translateX(${dx * travel}px)`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: -0.5, color: '#ffe4e6', whiteSpace: 'nowrap', opacity: clamp01(value), transform: `translateY(${(1 - clamp01(value)) * 10}px)` }}>
          {SLICE_VALUE}
        </span>
      </div>
      {/* The whole block as the loss: the hypothesis the narration then denies */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BLOCK_W,
          height: BLOCK_H,
          boxSizing: 'border-box',
          borderRadius: R,
          border: `4px solid ${alpha(C.rose, 0.9 * full)}`,
          background: alpha(C.rose, 0.28 * full),
          boxShadow: full > 0.02 ? `0 0 ${Math.round(36 * full)}px ${alpha(C.rose, 0.35 * full)}` : undefined,
          opacity: full > 0.001 ? 1 : 0,
        }}
      />
      {/* What the block is */}
      <div style={{ position: 'absolute', left: 30, top: 22, width: 3 * QUARTER - 40, opacity: 1 - 0.3 * clamp01(full) }}>
        <div style={{ fontSize: 62, fontWeight: 900, letterSpacing: -1, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap' }}>{AV.label}</div>
        <div style={{ marginTop: 10, fontSize: 34, fontWeight: 650, lineHeight: 1.22, color: C.text, whiteSpace: 'nowrap' }}>
          {AV.note.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
