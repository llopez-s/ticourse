import type { CSSProperties } from 'react';
import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { ACTION_IDS, CELL, PHASE_IDS, cellId, type CellId, type PhaseId } from '../../../data/matrix';
import { TONE, type CellTone } from './Cell';

const c01 = (v: number | undefined) => Math.max(0, Math.min(1, v ?? 0));

/**
 * The matrix as a thumbnail: the same grid (five rows, a label column, five action columns, the three
 * amber `[!]` dots) with no text at all. `width` px wide, 0.62 × width tall.
 * - `rows` { phase: { dim, warn } }: step a row back / outline it in amber (the single-cell row);
 * - `cells` { 'phase-action': { show = 1, lit, tone } }: drop or light cells;
 * - `only`: keep one row and fade the rest out completely.
 */
export function MatrixThumb({
  width,
  rows = {},
  cells = {},
  only,
  style,
}: {
  width: number;
  rows?: Partial<Record<PhaseId, { dim?: number; warn?: number }>>;
  cells?: Partial<Record<CellId, { show?: number; lit?: number; tone?: CellTone }>>;
  only?: PhaseId;
  style?: CSSProperties;
}) {
  const W = 300;
  const H = 186;
  const pad = 8;
  const labelW = 44;
  const headH = 18;
  const colW = (W - 2 * pad - labelW) / 5;
  const rowH = (H - 2 * pad - headH) / 5;
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', ...style }}>
      <rect x={1.5} y={1.5} width={W - 3} height={H - 3} rx={10} fill={C.ink900} stroke={alpha(C.cyan, 0.45)} strokeWidth={3} />
      {ACTION_IDS.map((a, i) => (
        <rect key={a} x={pad + labelW + i * colW + 5} y={pad + 4} width={colW - 10} height={8} rx={4} fill={alpha(C.violet, 0.7)} />
      ))}
      {PHASE_IDS.map((p, r) => {
        const y = pad + headH + r * rowH;
        const st = rows[p] ?? {};
        const off = only && only !== p ? 1 : c01(st.dim);
        const warn = c01(st.warn);
        return (
          <g key={p} opacity={1 - 0.8 * off}>
            <rect x={pad} y={y + 1} width={W - 2 * pad} height={rowH - 2} rx={5} fill={alpha(C.ink700, r % 2 ? 0.25 : 0.5)} />
            <rect x={pad + 5} y={y + rowH / 2 - 4} width={labelW - 12} height={8} rx={4} fill={alpha(C.violet, 0.55)} />
            {ACTION_IDS.map((a, i) => {
              const id = cellId(p, a);
              const def = CELL[id];
              if (!def) return null;
              const cs = cells[id] ?? {};
              const show = cs.show === undefined ? 1 : c01(cs.show);
              if (show <= 0.01) return null;
              const lit = c01(cs.lit);
              const tone = lit > 0.01 ? TONE[cs.tone ?? 'cyan'].fg : a === 'detect' ? C.cyan : '#94a3b8';
              const x = pad + labelW + i * colW + 3;
              return (
                <g key={a} opacity={show * (def.alwaysDim ? 0.4 : 1)}>
                  <rect x={x} y={y + 4} width={colW - 6} height={rowH - 8} rx={5} fill={alpha(tone, 0.22 + 0.3 * lit)} stroke={alpha(tone, 0.75 + 0.25 * lit)} strokeWidth={2 + lit} strokeDasharray={def.alwaysDim ? '4 4' : undefined} />
                  {def.mark ? <circle cx={x + colW - 14} cy={y + 11} r={4.5} fill={C.amber} /> : null}
                </g>
              );
            })}
            {warn > 0.01 ? <rect x={pad - 2} y={y} width={W - 2 * pad + 4} height={rowH} rx={6} fill="none" stroke={alpha(C.amber, 0.95 * warn)} strokeWidth={3} strokeDasharray="7 5" /> : null}
          </g>
        );
      })}
    </svg>
  );
}
