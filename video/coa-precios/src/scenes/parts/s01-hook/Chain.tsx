import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { S01 } from '../../../data/s01-hook';

const NODE_H = 58;
const GAP = 46;
const SIZE = 26;
/** Estimated node widths (bold 26 px + padding), so the row can be centred and the C2 mark anchored. */
const widths = S01.chain.map((name) => Math.round(name.length * SIZE * 0.6 + 44));
export const CHAIN_W = widths.reduce((a, b) => a + b, 0) + GAP * (widths.length - 1);
export const CHAIN_H = NODE_H + 62;

/**
 * The intrusion's chain, small and dim: five steps in a row, already known (`show[i]` 0–1 each). The
 * one still alive is Command & Control: an amber ring that beats slowly (`beat` 0–1) and its mark
 * «llama a casa cada minuto» (`mark` 0–1). No alert card, no date, no machine, no domain.
 */
export function Chain({ show, mark, beat }: { show: number[]; mark: number; beat: number }) {
  let x = 0;
  const xs = widths.map((w) => {
    const left = x;
    x += w + GAP;
    return left;
  });
  const c2x = xs[S01.c2] + widths[S01.c2] / 2;
  return (
    <div style={{ position: 'relative', width: CHAIN_W, height: CHAIN_H, fontFamily: FONT.sans }}>
      {S01.chain.map((name, i) => {
        const alive = i === S01.c2;
        const on = show[i] ?? 0;
        return (
          <div key={name}>
            {i > 0 ? (
              <svg width={GAP} height={NODE_H} style={{ position: 'absolute', left: xs[i] - GAP, top: 0, opacity: on }}>
                <path d={`M6 ${NODE_H / 2} H${GAP - 12}`} stroke={alpha(C.faint, 0.9)} strokeWidth={3} strokeLinecap="round" />
                <path d={`M${GAP - 18} ${NODE_H / 2 - 8} L${GAP - 8} ${NODE_H / 2} L${GAP - 18} ${NODE_H / 2 + 8}`} fill="none" stroke={alpha(C.faint, 0.9)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
            <div
              style={{
                position: 'absolute',
                left: xs[i],
                top: 0,
                width: widths[i],
                height: NODE_H,
                boxSizing: 'border-box',
                display: 'grid',
                placeItems: 'center',
                borderRadius: 14,
                border: `2px solid ${alive ? alpha(C.amber, 0.45 + 0.5 * mark) : alpha(C.faint, 0.7)}`,
                background: alive ? alpha(C.amber, 0.06 + 0.08 * mark) : alpha(C.ink800, 0.7),
                boxShadow: alive && mark > 0.02 ? `0 0 ${Math.round(10 + 22 * beat)}px ${alpha(C.amber, 0.25 + 0.3 * beat)}` : undefined,
                fontSize: SIZE,
                fontWeight: 800,
                letterSpacing: 0.2,
                color: alive ? alpha('#fcd34d', 0.7 + 0.3 * mark) : alpha('#c4b5fd', 0.62),
                whiteSpace: 'nowrap',
                opacity: on,
                transform: `translateY(${(1 - on) * 10}px)`,
              }}
            >
              {name}
            </div>
          </div>
        );
      })}
      {/* the mark on C2 */}
      {mark > 0.004 ? (
        <div style={{ position: 'absolute', left: c2x, top: NODE_H, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: mark }}>
          <div style={{ width: 3, height: 12, background: alpha(C.amber, 0.8) }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 18px 6px', borderRadius: 12, border: `2px solid ${alpha(C.amber, 0.8)}`, background: alpha('#1c1203', 0.9), fontSize: 33, lineHeight: 1.1, fontWeight: 800, color: '#fcd34d', whiteSpace: 'nowrap' }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.amber, boxShadow: `0 0 ${Math.round(6 + 14 * beat)}px ${C.amber}`, opacity: 0.55 + 0.45 * beat }} />
            {S01.c2Mark}
          </div>
        </div>
      ) : null}
    </div>
  );
}
