import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { EVIDENCE, HYP_IDS, type EvId } from '../../../data/matrix';
import { MarkTile } from '../Matrix';

/**
 * s06's contrast: two rows lifted out of the ACH matrix, each with its three
 * letters (same tiles as the matrix), its diagnosticity and the lesson's line
 * — E1 «usa phishing: vale para las tres» (NULA, grey) against E2 «nada de
 * cobrar en seis meses: choca con el dinero» (ALTA, amber).
 */

export const CONTRAST_ROW = { w: 1660, h: 124 } as const;

const DIAG_LOOK = {
  NULA: { fg: '#94a3b8', text: '#cbd5e1' },
  ALTA: { fg: C.amber, text: '#fcd34d' },
} as const;

/**
 * One contrast row. `p` 0–1 entrance; `emph` 0–1 lights it (amber halo for
 * ALTA); `dim` 0–1 steps it back.
 */
export function ContrastRow({ ev, text, p, emph = 0, dim = 0, style }: { ev: EvId; text: string; p: number; emph?: number; dim?: number; style?: CSSProperties }) {
  const k = clamp01(p);
  if (k <= 0.001) return null;
  const e = EVIDENCE.find((x) => x.id === ev)!;
  const look = DIAG_LOOK[e.diag];
  const g = clamp01(emph);
  const d = clamp01(dim);
  return (
    <div
      style={{
        width: CONTRAST_ROW.w,
        height: CONTRAST_ROW.h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '0 34px 0 26px',
        borderRadius: RADIUS.lg,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `3px solid ${alpha(e.diag === 'ALTA' ? C.amber : C.cyan, 0.35 + 0.5 * g)}`,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.42)}${g > 0.01 ? `, 0 0 ${Math.round(36 * g)}px ${alpha(C.amber, 0.35 * g)}` : ''}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: k * (1 - 0.5 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        transform: `translateY(${(1 - k) * 22}px)`,
        ...style,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 76,
          height: 56,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          background: C.ink700,
          border: `2px solid ${alpha(C.cyan, 0.45)}`,
          fontSize: 34,
          fontWeight: 850,
          color: C.textStrong,
        }}
      >
        {ev}
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        {HYP_IDS.map((h, i) => (
          <div key={h} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: C.muted, lineHeight: 1 }}>{h}</span>
            <MarkTile mark={e.marks[i]} w={68} h={58} size={40} />
          </div>
        ))}
      </div>
      <span
        style={{
          flexShrink: 0,
          padding: '5px 18px',
          borderRadius: RADIUS.pill,
          border: `3px solid ${alpha(look.fg, e.diag === 'ALTA' ? 0.85 : 0.55)}`,
          background: alpha(look.fg, e.diag === 'ALTA' ? 0.16 : 0.1),
          color: look.text,
          fontSize: 32,
          fontWeight: 850,
          letterSpacing: 1,
          lineHeight: 1.1,
        }}
      >
        {e.diag}
      </span>
      <span style={{ fontSize: 42, fontWeight: 800, color: C.textStrong, letterSpacing: -0.2 }}>{text}</span>
    </div>
  );
}

/** Entrance helper for the rows (eased, 16 frames). */
export const rowIn = (frame: number, at: number) => progress(frame, at, 16, EASE.out);
