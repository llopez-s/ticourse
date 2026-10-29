import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { S02_TABLE } from '../../data/s02-medir';

/** Geometry of the lesson's table (table-local px; the table is 1728 wide). */
export const TABLE = {
  leftW: 560,
  gapX: 28,
  rowH: [92, 92, 60, 92] as const,
  gapY: 8,
  headH: 46,
  headGap: 10,
} as const;
const ROWS_TOP = TABLE.headH + TABLE.headGap;
export const TABLE_H = ROWS_TOP + TABLE.rowH.reduce((a, b) => a + b, 0) + 3 * TABLE.gapY;
const RIGHT_X = TABLE.leftW + TABLE.gapX;
const RIGHT_W = 1728 - RIGHT_X;

function rowTop(i: number): number {
  let y = ROWS_TOP;
  for (let k = 0; k < i; k += 1) y += TABLE.rowH[k] + TABLE.gapY;
  return y;
}

/**
 * The lesson's table of vanity metrics against value metrics, four rows, red
 * and green chips instead of the lesson's emoji. Per row: `show` (presence),
 * `off` (left cell switched off and struck), `lit` (right cell lit) and `dim`
 * (right cell pushed back without being lit).
 */
export function MetricsTable({
  show,
  off,
  lit,
  dim,
  head,
}: {
  show: readonly number[];
  off: readonly number[];
  lit: readonly number[];
  dim: readonly number[];
  head: number;
}) {
  return (
    <div style={{ position: 'relative', width: 1728, height: TABLE_H, fontFamily: FONT.sans }}>
      {/* headers */}
      {[
        { x: 0, w: TABLE.leftW, text: S02_TABLE.headers.vain, tone: C.rose, soft: '#fda4af', icon: 'x' as const },
        { x: RIGHT_X, w: RIGHT_W, text: S02_TABLE.headers.value, tone: C.emerald, soft: '#6ee7b7', icon: 'check' as const },
      ].map((h) => (
        <div
          key={h.text}
          style={{
            position: 'absolute',
            left: h.x,
            top: 0,
            width: h.w,
            height: TABLE.headH,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 22px',
            borderRadius: 14,
            border: `2px solid ${alpha(h.tone, 0.7)}`,
            background: alpha(h.tone, 0.14),
            fontSize: 32,
            fontWeight: 800,
            color: h.soft,
            whiteSpace: 'nowrap',
            opacity: head,
            transform: `translateY(${(1 - head) * -14}px)`,
          }}
        >
          <Icon name={h.icon} size={32} color={h.tone} strokeWidth={2.4} />
          {h.text}
        </div>
      ))}

      {/* rows */}
      {S02_TABLE.vain.map((vain, i) => {
        const h = TABLE.rowH[i];
        const top = rowTop(i);
        const s = show[i] ?? 0;
        const o = off[i] ?? 0;
        const l = lit[i] ?? 0;
        const d = dim[i] ?? 0;
        return (
          <div key={vain} style={{ opacity: s, transform: `translateY(${(1 - s) * 22}px)` }}>
            {/* vanity metric */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top,
                width: TABLE.leftW,
                height: h,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 22px',
                borderRadius: 16,
                border: `2px solid ${alpha(o > 0.5 ? C.ink600 : C.rose, o > 0.5 ? 0.6 : 0.4)}`,
                background: alpha(C.ink850, 0.96),
                opacity: 1 - 0.68 * o,
                filter: o > 0.01 ? `saturate(${1 - 0.8 * o})` : undefined,
              }}
            >
              <Icon name="x" size={30} color={C.rose} strokeWidth={2.4} />
              <span style={{ position: 'relative', fontSize: 32, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>
                {vain}
                <span style={{ position: 'absolute', left: -4, top: '54%', height: 4, width: `${o * 104}%`, background: alpha(C.roseSoft, 0.9), borderRadius: 2 }} />
              </span>
            </div>
            {/* value metric */}
            <div
              style={{
                position: 'absolute',
                left: RIGHT_X,
                top,
                width: RIGHT_W,
                height: h,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '0 24px',
                borderRadius: 16,
                border: `${l > 0.4 ? 3 : 2}px solid ${alpha(C.emerald, 0.3 + 0.6 * l)}`,
                background: `linear-gradient(90deg, ${alpha(C.emerald, 0.05 + 0.14 * l)} 0%, ${alpha(C.ink850, 0.96)} 70%)`,
                boxShadow: l > 0.05 ? `0 0 ${Math.round(30 * l)}px ${alpha(C.emerald, 0.28 * l)}` : undefined,
                opacity: 1 - 0.55 * d,
              }}
            >
              <Icon name="check" size={32} color={C.emerald} strokeWidth={2.4} />
              <span style={{ fontSize: 32, fontWeight: l > 0.4 ? 750 : 600, lineHeight: 1.16, color: l > 0.4 ? C.textStrong : C.text }}>{S02_TABLE.value[i]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
