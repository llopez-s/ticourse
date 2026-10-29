import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Bus, Rider, StopPost } from './Figures';
import { S02_CLOCK } from '../../data/s02-medir';

const W = 1728;
export const CLOCK_STRIP_H = 222;
const ROAD_Y = 176;
const A = 200;
const B = W - 200;
const BUS_W = 200;

/**
 * The traveller's whole trip, stop to stop: the clock starts when she reaches
 * the first stop and stops when she gets where she was going, with the bus in
 * the middle. `u` is 0–1 over the whole run.
 */
export function ClockStrip({ u, opacity = 1 }: { u: number; opacity?: number }) {
  // Phases of the run: the bus arrives, she boards, the bus drives, she gets off.
  const arrive = progress(u, 0, 0.2);
  const board = progress(u, 0.2, 0.1);
  const drive = progress(u, 0.3, 0.6);
  const leave = progress(u, 0.9, 0.1);
  const busX = u < 0.3 ? -BUS_W + (A + 10 + BUS_W) * arrive : A + 10 + (B - A - 20) * drive;
  const clockOn = u > 0.02 && u < 0.98 ? 1 : 0.9;
  const hand = u * 360 * 3;
  const reach = Math.max(0, busX - A);
  return (
    <div style={{ position: 'relative', width: W, height: CLOCK_STRIP_H, opacity, fontFamily: FONT.sans }}>
      <svg width={W} height={CLOCK_STRIP_H} viewBox={`0 0 ${W} ${CLOCK_STRIP_H}`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <line x1={60} y1={ROAD_Y} x2={W - 60} y2={ROAD_Y} stroke={C.ink600} strokeWidth={14} strokeLinecap="round" />
        <line x1={60} y1={ROAD_Y} x2={W - 60} y2={ROAD_Y} stroke={C.ink500} strokeWidth={3} strokeDasharray="16 22" />
        {/* the stretch already travelled */}
        <line x1={A} y1={ROAD_Y} x2={A + reach} y2={ROAD_Y} stroke={C.sky} strokeWidth={10} strokeLinecap="round" />
        {[A, B].map((x) => (
          <circle key={x} cx={x} cy={ROAD_Y} r={15} fill={C.ink950} stroke={C.cyan} strokeWidth={5} />
        ))}
      </svg>

      {/* clock: it runs from the first stop to the last */}
      <div style={{ position: 'absolute', left: W / 2 - 330, top: 0, display: 'flex', alignItems: 'center', gap: 22, opacity: clockOn }}>
        <svg width={84} height={84} viewBox="0 0 84 84" aria-hidden>
          <circle cx={42} cy={42} r={37} fill={alpha(C.sky, 0.12)} stroke={C.sky} strokeWidth={5} />
          <line x1={42} y1={42} x2={42} y2={16} stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" transform={`rotate(${hand} 42 42)`} />
          <line x1={42} y1={42} x2={58} y2={42} stroke={C.muted} strokeWidth={5} strokeLinecap="round" transform={`rotate(${hand / 12} 42 42)`} />
          <circle cx={42} cy={42} r={5} fill={C.textStrong} />
        </svg>
        <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{S02_CLOCK.span}</span>
      </div>

      {/* the traveller waiting, the bus, the traveller arriving */}
      <div style={{ position: 'absolute', left: A - 116, top: ROAD_Y - 112, opacity: (1 - board) * Math.min(1, u * 14) }}>
        <Rider size={76} />
      </div>
      <div style={{ position: 'absolute', left: A - 66, top: ROAD_Y - 118, opacity: 1 }}>
        <StopPost size={96} />
      </div>
      <div style={{ position: 'absolute', left: B - 66, top: ROAD_Y - 118 }}>
        <StopPost size={96} />
      </div>
      <div style={{ position: 'absolute', left: busX, top: ROAD_Y - 91 }}>
        <Bus width={BUS_W} riders={[0, 0, board * (1 - leave), 0, 0]} />
      </div>
      <div style={{ position: 'absolute', left: B + 40, top: ROAD_Y - 90, opacity: leave }}>
        <Rider size={76} />
      </div>

      {/* labels */}
      {[
        { x: A, text: S02_CLOCK.start },
        { x: B, text: S02_CLOCK.end },
      ].map((l) => (
        <div key={l.text} style={{ position: 'absolute', left: l.x - 200, top: ROAD_Y + 20, width: 400, textAlign: 'center', fontSize: 34, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>
          {l.text}
        </div>
      ))}
    </div>
  );
}
