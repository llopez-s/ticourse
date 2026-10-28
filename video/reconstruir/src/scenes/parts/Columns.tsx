import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { COLUMN_NAMES } from './data-b';
import type { ChronoRow } from './data';
import { SOURCES } from './data';

/**
 * The three columns «observado · hipótesis · conclusión» (s08 to s11): the same names, colours and places every time.
 * Cyan = what the sources say; amber = a doubt, an explanation still to prove; emerald = what is sustained (empty
 * until s11). Stage-local px; everything ends at y 548.
 */
export type ColKey = 'obs' | 'hyp' | 'con';
export const COLS = {
  obs: { x: 0, w: 740, color: C.cyan, name: COLUMN_NAMES[0] },
  hyp: { x: 780, w: 500, color: C.amber, name: COLUMN_NAMES[1] },
  con: { x: 1304, w: 424, color: C.emerald, name: COLUMN_NAMES[2] },
  h: 548,
  headH: 56,
  rowsTop: 66,
  rowH: 88,
  rowStep: 96,
} as const;

export function obsRowTop(i: number): number {
  return COLS.rowsTop + i * COLS.rowStep;
}

/** One column: dashed and quiet until `lit` (0–1), then solid in its colour. `on` (0–1) is the column existing. */
export function ColumnFrame({ col, on = 1, lit = 0, children, style }: { col: ColKey; on?: number; lit?: number; children?: ReactNode; style?: CSSProperties }) {
  const c = COLS[col];
  const l = clamp01(lit);
  const o = clamp01(on);
  return (
    <div
      style={{
        position: 'absolute',
        left: c.x,
        top: 0,
        width: c.w,
        height: COLS.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: l > 0.5 ? `3px solid ${alpha(c.color, 0.45 + 0.4 * l)}` : `3px dashed ${alpha(C.ink500, 0.75)}`,
        background: alpha(c.color, 0.03 + 0.04 * l),
        boxShadow: l > 0.02 ? `0 0 ${24 * l}px ${alpha(c.color, 0.18 * l)}` : undefined,
        opacity: o,
        transform: `translateY(${(1 - o) * 14}px)`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: COLS.headH,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 22,
          fontSize: 38,
          fontWeight: 850,
          letterSpacing: 0.5,
          color: l > 0.01 ? c.color : alpha(c.color, 0.7),
        }}
      >
        {c.name}
      </div>
      {children}
    </div>
  );
}

const FACT = 27;

/**
 * A chronology row in the narrow «observado» column: UTC with its original in grey, the fact wrapped on two lines, the
 * source's icon. `on` 0–1 = it has dropped in. Position it with `obsRowTop(i)` (relative to the stage).
 */
export function ObservedRow({ row, on = 1, glow = 0, style }: { row: ChronoRow; on?: number; glow?: number; style?: CSSProperties }) {
  const o = clamp01(on);
  const g = clamp01(glow);
  const src = SOURCES[row.source];
  return (
    <div
      style={{
        position: 'absolute',
        left: 12,
        width: COLS.obs.w - 24,
        height: COLS.rowH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${g > 0.01 ? alpha(C.amber, 0.45 + 0.5 * g) : alpha(C.cyan, 0.4)}`,
        background: alpha(C.ink850, 0.97),
        boxShadow: g > 0.01 ? `0 0 ${18 * g}px ${alpha(C.amber, 0.3 * g)}` : undefined,
        opacity: o,
        transform: `translateY(${(1 - o) * -46}px)`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 190, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, lineHeight: 1.1, color: C.emerald }}>{row.utc}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 21, fontWeight: 500, lineHeight: 1.2, color: C.muted }}>{row.original}</div>
      </div>
      <div style={{ position: 'absolute', left: 216, top: 0, bottom: 0, width: 440, display: 'flex', alignItems: 'center', fontSize: FACT, fontWeight: 600, lineHeight: 1.2, color: C.text }}>
        <span>
          {row.fact.map((p, i) =>
            p.mono ? (
              <span key={i} style={{ fontFamily: FONT.mono, fontWeight: 650, fontSize: FACT - 3, color: C.textStrong }}>
                {p.t}
              </span>
            ) : (
              <span key={i}>{p.t}</span>
            ),
          )}
        </span>
      </div>
      <div style={{ position: 'absolute', right: 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <Icon name={src.icon} size={42} color={C.cyan} />
      </div>
    </div>
  );
}
