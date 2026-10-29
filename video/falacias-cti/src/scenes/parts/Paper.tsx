import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { DRAFT } from '../../data/shared';

/** Paper and ink, built from the theme's tokens. */
export const PAPER = {
  top: C.textStrong,
  bottom: C.text,
  edge: C.muted,
  ink: C.ink800,
  inkSoft: C.ink500,
  bar: alpha(C.faint, 0.55),
  line: alpha(C.faint, 0.5),
} as const;

/** A sheet of paper. A normal-flow box; children are absolutely positioned inside. `grid` = squared paper. */
export function Sheet({ width, height, glow = 0, dim = 0, grid = false, tone = C.muted, style, children }: { width: number; height: number; glow?: number; dim?: number; grid?: boolean; tone?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: 18,
        background: `linear-gradient(180deg, ${PAPER.top} 0%, ${PAPER.bottom} 100%)`,
        border: `3px solid ${alpha(tone, 0.55 + 0.4 * glow)}`,
        boxShadow: `0 22px 50px ${alpha('#000000', 0.45)}${glow > 0.01 ? `, 0 0 ${Math.round(36 * glow)}px ${alpha(C.cyan, 0.35 * glow)}` : ''}`,
        opacity: 1 - 0.55 * dim,
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        ...style,
      }}
    >
      {grid ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${alpha(C.sky, 0.28)} 1.5px, transparent 1.5px), linear-gradient(90deg, ${alpha(C.sky, 0.28)} 1.5px, transparent 1.5px)`,
            backgroundSize: '34px 34px',
          }}
        />
      ) : null}
      {children}
    </div>
  );
}

/** Grey text bars: a line of "text" that cannot be read. */
export function Bars({ x, y, widths, h = 14, gap = 10, color = PAPER.bar }: { x: number; y: number; widths: readonly number[]; h?: number; gap?: number; color?: string }) {
  return (
    <>
      {widths.map((w, i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y + i * (h + gap), width: w, height: h, borderRadius: h / 2, background: color }} />
      ))}
    </>
  );
}

/** A green tick in a circle; `p` 0-1 pops it. */
export function Tick({ p, size = 44 }: { p: number; size?: number }) {
  const len = 26;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: size / 2, border: `3px dashed ${alpha(C.faint, 0.55)}`, opacity: 1 - p, boxSizing: 'border-box' }} />
      {p > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: size / 2,
            background: alpha(C.emerald, 0.2),
            border: `3px solid ${C.emerald}`,
            boxSizing: 'border-box',
            display: 'grid',
            placeItems: 'center',
            transform: `scale(${0.6 + 0.4 * p})`,
            opacity: Math.min(1, p * 2),
          }}
        >
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={C.emeraldDeep} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" strokeDasharray={len} strokeDashoffset={len * (1 - Math.min(1, p * 1.4))} />
          </svg>
        </div>
      ) : null}
    </div>
  );
}

/** Geometry of the draft (its own coordinates, 620 x 490). */
export const DRAFT_BOX = { w: 620, h: 490 } as const;
export const DRAFT_ROWS = { first: 88, step: 56, h: 46, pill: 254, row4: 314, row4H: 48, concl: 380, conclH: 56 } as const;
/** The ellipse that rings the fourth row (the step with no tick), in draft coordinates. */
export const DRAFT_RING = { cx: 310, cy: DRAFT_ROWS.row4 + DRAFT_ROWS.row4H / 2, rx: 296, ry: 40 } as const;

/**
 * The draft report (s01, s02, s03, the end card): a title, four numbered rows (1-3 are the pruebas, each can take a green
 * tick; 4 is the step with no tick and a small «?»), then «conclusión». Every line is bars: no word can be read.
 *   scale    1 = 620 x 490
 *   checks   three 0-1 values, one per tick
 *   pill     0-1 «parecen en orden»        q  0-1 the «?» on row 4
 *   crooked  0-1 row 4 tilts and turns rose (the step that does not hold)
 *   notice   the fixed notice in the footer (true from the sheet's entry)
 */
export function DraftSheet({ scale = 1, checks = [0, 0, 0], pill = 0, q = 0, crooked = 0, glow = 0, dim = 0, notice = true, title = true, style }: { scale?: number; checks?: readonly number[]; pill?: number; q?: number; crooked?: number; glow?: number; dim?: number; notice?: boolean; title?: boolean; style?: CSSProperties }) {
  const R = DRAFT_ROWS;
  const rowTop = (i: number) => R.first + i * R.step;
  return (
    <div style={{ position: 'relative', width: DRAFT_BOX.w * scale, height: DRAFT_BOX.h * scale, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: DRAFT_BOX.w, height: DRAFT_BOX.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <Sheet width={DRAFT_BOX.w} height={DRAFT_BOX.h} glow={glow} dim={dim}>
          {/* title strip */}
          {title ? (
            <div style={{ position: 'absolute', left: 28, top: 16, fontSize: 32, fontWeight: 800, letterSpacing: -0.4, color: PAPER.ink, whiteSpace: 'nowrap' }}>{DRAFT.title}</div>
          ) : (
            <div style={{ position: 'absolute', left: 28, top: 28, width: 300, height: 18, borderRadius: 9, background: PAPER.inkSoft, opacity: 0.6 }} />
          )}
          <div style={{ position: 'absolute', left: 28, top: 68, width: 564, height: 3, background: PAPER.line }} />

          {/* rows 1-3: the pruebas */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 0, top: rowTop(i), width: DRAFT_BOX.w, height: R.h }}>
              <div style={{ position: 'absolute', left: 28, top: 4, width: 38, height: 38, borderRadius: 19, background: alpha(PAPER.inkSoft, 0.25), display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 800, color: PAPER.ink }}>{i + 1}</div>
              <Bars x={84} y={9} widths={[i === 1 ? 250 : 286]} h={13} color={PAPER.bar} />
              <Bars x={84} y={28} widths={[i === 0 ? 178 : 214]} h={11} color={alpha(C.faint, 0.35)} />
              <div style={{ position: 'absolute', left: 392, top: 6, fontSize: 30, fontWeight: 750, color: PAPER.ink, whiteSpace: 'nowrap', opacity: Math.min(1, (checks[i] ?? 0) * 1.6) }}>{DRAFT.proofs[i]}</div>
              <div style={{ position: 'absolute', left: 550, top: 1 }}>
                <Tick p={checks[i] ?? 0} />
              </div>
            </div>
          ))}

          {/* parecen en orden */}
          <div style={{ position: 'absolute', left: 0, top: R.pill, width: DRAFT_BOX.w, display: 'flex', justifyContent: 'center', opacity: pill, transform: `translateY(${(1 - pill) * 8}px)` }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 44, padding: '0 22px', borderRadius: 22, background: alpha(C.emerald, 0.16), border: `2.5px solid ${alpha(C.emerald, 0.8)}`, fontSize: 32, fontWeight: 800, color: C.emeraldDeep, whiteSpace: 'nowrap' }}>
              <Icon name="check" size={26} color={C.emeraldDeep} strokeWidth={3.2} />
              {DRAFT.ok}
            </span>
          </div>

          {/* row 4: the step with no tick */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: R.row4,
              width: 588,
              height: R.row4H,
              boxSizing: 'border-box',
              borderRadius: 12,
              border: `2.5px ${crooked > 0.5 ? 'solid' : 'dashed'} ${alpha(crooked > 0.01 ? C.rose : C.faint, 0.55 + 0.4 * crooked)}`,
              background: alpha(C.rose, 0.14 * crooked),
              transform: `rotate(${-2.2 * crooked}deg) translateX(${10 * crooked}px)`,
              transformOrigin: '0 50%',
            }}
          >
            <div style={{ position: 'absolute', left: 12, top: 4, width: 36, height: 36, borderRadius: 18, background: alpha(crooked > 0.01 ? C.rose : PAPER.inkSoft, 0.25 + 0.2 * crooked), display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 800, color: PAPER.ink }}>4</div>
            <Bars x={68} y={11} widths={[320]} h={13} color={crooked > 0.01 ? alpha(C.rose, 0.55) : PAPER.bar} />
            <Bars x={68} y={30} widths={[196]} h={9} color={alpha(C.faint, 0.3)} />
            <div style={{ position: 'absolute', right: 26, top: -2, fontSize: 40, fontWeight: 900, color: C.amberDeep, opacity: q, transform: `scale(${0.7 + 0.3 * q})` }}>?</div>
          </div>

          {/* the conclusion */}
          <div style={{ position: 'absolute', left: 16, top: R.concl, width: 588, height: R.conclH, boxSizing: 'border-box', borderRadius: 12, border: `2.5px solid ${alpha(C.cyanDeep, 0.5)}`, background: alpha(C.cyan, 0.1) }}>
            <div style={{ position: 'absolute', left: 18, top: 15, fontFamily: FONT.mono, fontSize: 24, fontWeight: 800, letterSpacing: 3, color: C.cyanDeep, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{DRAFT.conclusion}</div>
            <Bars x={222} y={13} widths={[330]} h={13} color={alpha(C.cyanDeep, 0.5)} />
            <Bars x={222} y={32} widths={[210]} h={10} color={alpha(C.cyanDeep, 0.3)} />
          </div>

          {/* the notice: on the sheet from its entry */}
          {notice ? (
            <div style={{ position: 'absolute', right: 22, bottom: 14, fontSize: 22, fontWeight: 650, color: PAPER.inkSoft, whiteSpace: 'nowrap' }}>{DRAFT.notice}</div>
          ) : null}
        </Sheet>
      </div>
    </div>
  );
}

/** Convenience: p(frame, start) clamped, for tick timing. */
export function tickAt(frame: number, start: number): number {
  return progress(frame, start, 12);
}
