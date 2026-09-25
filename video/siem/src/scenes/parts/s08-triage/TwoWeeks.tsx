import { C, FONT, TYPE, alpha } from '../../../theme/tokens';
import { EASE, fadeIn, progress } from '../../../theme/motion';
import { Counter, Panel } from '../../../ui';
import { DAILY_VOLUME } from '../../../data/s08-triage';

const BAR_MAX = 520;
const BARS_H = 116;

/**
 * "+14 días / dos semanas después" marker with the calm daily volume since
 * the tuning: fourteen flat emerald bars and 400 alertas/día.
 */
export function TwoWeeks({ frame, at, width, height }: { frame: number; at: number; width: number; height: number }) {
  const barW = 18;
  const gap = (width - 56 - barW * DAILY_VOLUME.length) / (DAILY_VOLUME.length - 1);
  return (
    <Panel title="Tras el ajuste" icon="clock" accent="cyan" style={{ width, height, boxSizing: 'border-box' }}>
      <div style={{ padding: '26px 28px 0', fontFamily: FONT.sans }}>
        <div style={{ opacity: fadeIn(frame, at, 12) }}>
          <div style={{ fontSize: 84, fontWeight: 850, lineHeight: 1, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.cyan }}>+14</span> días
          </div>
          <div style={{ fontSize: TYPE.label, color: C.muted, fontWeight: 600, marginTop: 12 }}>dos semanas después</div>
        </div>
        <div style={{ height: 2, background: C.ink700, margin: '26px 0 22px' }} />
        <div style={{ opacity: fadeIn(frame, at + 10, 12) }}>
          <Counter value={400} unit="/ día" size={TYPE.h1} color={C.textStrong} />
          <div style={{ fontSize: TYPE.small, color: C.muted, marginTop: 6, fontWeight: 550 }}>alertas en la cola, estable</div>
        </div>
        <svg width={width - 56} height={BARS_H} style={{ display: 'block', marginTop: 20 }}>
          {DAILY_VOLUME.map((v, i) => {
            const grow = progress(frame, at + 14 + i * 2, 14, EASE.out);
            const h = (v / BAR_MAX) * BARS_H * grow;
            return (
              <rect
                key={i}
                x={i * (barW + gap)}
                y={BARS_H - h}
                width={barW}
                height={h}
                rx={4}
                fill={alpha(C.emerald, i === DAILY_VOLUME.length - 1 ? 0.85 : 0.5)}
              />
            );
          })}
        </svg>
      </div>
    </Panel>
  );
}
