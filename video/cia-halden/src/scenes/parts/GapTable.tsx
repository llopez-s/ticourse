import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { COLUMNS, PLAN_ORDER, ROWS, type GapTone } from '../../data/s06-falta';

const TONE: Record<GapTone, string> = { emerald: C.emerald, amber: C.amber, rose: C.rose };

export const COL_W = [690, 470, 250, 300] as const;
export const TABLE_W = COL_W.reduce((a, b) => a + b, 0);
const HEAD_H = 52;
const ROW_H = 96;
export const TABLE_H = HEAD_H + ROWS.length * ROW_H;

/**
 * The example gap-analysis table: four columns «lo que pide · lo que hay · hueco · prioridad», three rows that come in
 * one by one (`rows[i]` 0–1). `focus` (0–1 per row) brightens a row's border (the plan's first line).
 */
export function GapTable({ show, rows, focus = [0, 0, 0] }: { show: number; rows: readonly number[]; focus?: readonly number[] }) {
  return (
    <div style={{ width: TABLE_W, fontFamily: FONT.sans, opacity: clamp01(show) }}>
      <div style={{ display: 'flex', height: HEAD_H, alignItems: 'center', borderBottom: `3px solid ${C.ink600}` }}>
        {COLUMNS.map((c, i) => (
          <div key={c} style={{ width: COL_W[i], boxSizing: 'border-box', padding: '0 20px', fontSize: 32, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>
            {c}
          </div>
        ))}
      </div>
      {ROWS.map((r, i) => {
        const o = clamp01(rows[i]);
        const f = clamp01(focus[i]);
        const tone = TONE[r.tone];
        return (
          <div
            key={r.asks}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: ROW_H,
              borderBottom: `2px solid ${alpha(C.ink600, 0.7)}`,
              opacity: 0.12 + 0.88 * o,
              background: alpha(tone, 0.04 + 0.08 * f),
              boxShadow: f > 0.05 ? `inset 0 0 0 3px ${alpha(tone, 0.7 * f)}, 0 0 ${Math.round(26 * f)}px ${alpha(tone, 0.25 * f)}` : undefined,
              borderRadius: f > 0.05 ? 14 : 0,
            }}
          >
            <div style={{ width: COL_W[0], boxSizing: 'border-box', padding: '0 20px', fontSize: 33, fontWeight: 750, color: C.textStrong, lineHeight: 1.18 }}>{r.asks}</div>
            <div style={{ width: COL_W[1], boxSizing: 'border-box', padding: '0 20px', fontSize: 33, fontWeight: 700, color: C.text, lineHeight: 1.18 }}>{r.has}</div>
            <div style={{ width: COL_W[2], boxSizing: 'border-box', padding: '0 20px', fontSize: 36, fontWeight: 850, color: tone, whiteSpace: 'nowrap' }}>{r.gap}</div>
            <div style={{ width: COL_W[3], boxSizing: 'border-box', padding: '0 20px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 20px',
                  borderRadius: 999,
                  border: `2px solid ${alpha(tone, 0.8)}`,
                  background: alpha(tone, 0.14),
                  fontSize: 34,
                  fontWeight: 850,
                  color: tone,
                  whiteSpace: 'nowrap',
                }}
              >
                {r.priority}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** A blank field with its label: «responsable ____», «fecha ____» (no names, no dates). */
function Blank({ label, on }: { label: string; on: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, opacity: 0.3 + 0.7 * clamp01(on) }}>
      <span style={{ fontSize: 32, fontWeight: 800, color: C.emerald }}>{label}</span>
      <span style={{ display: 'inline-block', width: 110, height: 0, borderBottom: `3px solid ${alpha(C.emerald, 0.7)}` }} />
    </span>
  );
}

/**
 * The plan under the table: the gaps by priority (1.º the missing signature row, 2.º the half-logged one); on `plan`
 * the first line lights with «responsable · fecha» (`top` 0–1), the second stays dim.
 */
export function PlanBox({ show, top }: { show: number; top: number }) {
  const t = clamp01(top);
  return (
    <div
      style={{
        width: TABLE_W,
        boxSizing: 'border-box',
        padding: '10px 24px',
        borderRadius: 20,
        border: `2px solid ${alpha(C.emerald, 0.5)}`,
        background: alpha(C.emerald, 0.05),
        fontFamily: FONT.sans,
        opacity: clamp01(show),
        transform: `translateY(${(1 - clamp01(show)) * 14}px)`,
      }}
    >
      {PLAN_ORDER.map((ri, k) => {
        const r = ROWS[ri];
        const lit = k === 0 ? t : 0;
        return (
          <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 18, height: 50, opacity: k === 0 ? 0.55 + 0.45 * t : 0.45 }}>
            <span style={{ fontSize: 34, fontWeight: 900, color: C.emerald, width: 64 }}>{`${k + 1}.º`}</span>
            <span style={{ fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', flex: 1 }}>{r.asks}</span>
            {k === 0 ? (
              <span style={{ display: 'inline-flex', gap: 26 }}>
                <Blank label="responsable" on={lit} />
                <Blank label="fecha" on={lit} />
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
