import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { enter } from '../../../../../engine/src/theme/motion';
import { CARDS, MARKED_YEARS, YEARS } from '../../../data/s03-ano';

export const CARD_W = 780;
export const CARD_GAP = 60;
export const CARD_H = 136;

/** EF icon: the value as a block, a quarter of it bitten off (rose). */
function QuarterIcon() {
  return (
    <svg width={84} height={84} viewBox="0 0 84 84" style={{ flex: '0 0 auto' }}>
      <rect x={6} y={6} width={72} height={72} rx={10} fill={alpha(C.cyan, 0.16)} stroke={alpha(C.cyan, 0.7)} strokeWidth={3} />
      <rect x={42} y={6} width={36} height={36} rx={6} fill={alpha(C.rose, 0.75)} stroke={C.rose} strokeWidth={3} />
    </svg>
  );
}

/** ARO icon: ten small year squares, five marked at the same uneven positions as the calendar. */
function StripIcon() {
  const w = 14;
  const g = 5;
  const total = YEARS * w + (YEARS - 1) * g;
  return (
    <svg width={total} height={84} viewBox={`0 0 ${total} 84`} style={{ flex: '0 0 auto' }}>
      {Array.from({ length: YEARS }, (_, i) => {
        const on = (MARKED_YEARS as readonly number[]).includes(i);
        return (
          <rect
            key={i}
            x={i * (w + g)}
            y={22}
            width={w}
            height={40}
            rx={4}
            fill={on ? alpha(C.rose, 0.75) : alpha(C.ink500, 0.8)}
            stroke={on ? C.rose : C.ink500}
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
}

/**
 * The two factors side by side, EF on the left and ARO on the right, never crossing: each has its own column and
 * its own colour (rose: a share of the loss; cyan: how often). `glow` 0–1 lights the one the voice is on.
 */
export function Cards({ frame, at, glow }: { frame: number; at: number; glow: [number, number] }) {
  return (
    <div style={{ position: 'relative', width: CARD_W * 2 + CARD_GAP, height: CARD_H }}>
      {CARDS.map((c, i) => {
        const tone = i === 0 ? C.rose : C.cyan;
        const g = glow[i];
        const e = enter(frame, at + i * 6, { distance: 26 });
        return (
          <div
            key={c.term}
            style={{
              position: 'absolute',
              left: i * (CARD_W + CARD_GAP),
              top: 0,
              width: CARD_W,
              height: CARD_H,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(tone, 0.5 + 0.5 * g)}`,
              background: `linear-gradient(90deg, ${alpha(i === 0 ? C.roseDeep : C.cyanDeep, 0.45)} 0%, ${alpha(C.ink900, 0.97)} 80%)`,
              boxShadow: g > 0.05 ? `0 0 ${Math.round(34 * g)}px ${alpha(tone, 0.32 * g)}` : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              padding: '0 30px',
              fontFamily: FONT.sans,
              opacity: e.opacity,
              transform: `${e.transform} scale(${1 + 0.02 * g})`,
            }}
          >
            {i === 0 ? <QuarterIcon /> : <StripIcon />}
            <div style={{ lineHeight: 1.12 }}>
              <div style={{ fontSize: 58, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <span style={{ color: C.violet }}>{c.term}</span> · {c.value}
              </div>
              <div style={{ fontSize: 38, fontWeight: 650, color: i === 0 ? '#fda4af' : C.cyanSoft, whiteSpace: 'nowrap' }}>{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
