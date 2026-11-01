import { C, FONT, RADIUS, STAGE, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../../engine/src/ui';
import { BAR } from '../../../data/s12-tiempo';
import { PencilRing } from './Crossword';

/** Geometry of the bar zone (local to its container; the scene places the container at stage y 408). */
export const BAR_ZONE = { w: STAGE.width, titleH: 46, trackTop: 56, trackH: 56 } as const;
const SIMS_MIN = 20;
const TOTAL_MIN = 90;
/** How far the simulations "eat" into the bar while the voice says they take much time (share of the bar). */
const EATEN = 0.58;

/**
 * The only clock of the video: a plain bar of 90 minutes (no dial, no timer icon).
 *   eat       0–1  the simulations grow from the left and swallow the bar (amber = the trap of staying there)
 *   collapse  0–1  they shrink to the booked 15–20 min (violet; the solid part is 15, the hatched part up to 20) and the
 *                  rest becomes «test» (cyan)
 *   ring      0–1  pencil ring round the simulations part ("marca")
 *   ret       0–1  an arrow runs back along the bar from the end to the marked part ("vuelve")
 * `show` fades the whole bar in; `dim` steps it back.
 */
export function TimeBar({ show, eat, collapse, ring, ret, dim = 0 }: { show: number; eat: number; collapse: number; ring: number; ret: number; dim?: number }) {
  const { w, titleH, trackTop, trackH } = BAR_ZONE;
  const wEaten = w * EATEN * eat;
  const wSims = (w * SIMS_MIN) / TOTAL_MIN;
  const wSolid = (w * 15) / TOTAL_MIN;
  const wAmber = mix(wEaten, wSims, collapse);
  const wNow = mix(wEaten, wSims, collapse);
  const amberOp = (1 - collapse) * clamp01(eat * 6);
  const ticks = Array.from({ length: 8 }, (_, i) => ((i + 1) * w) / 9);
  // The return arrow: from the end of the bar, under it, back to the start of the marked part
  const arrowD = `M ${w - 60} ${trackTop + trackH + 14} C ${w - 60} ${trackTop + trackH + 76}, ${w * 0.55} ${trackTop + trackH + 84}, ${w * 0.3} ${trackTop + trackH + 70} C ${w * 0.12} ${trackTop + trackH + 60}, 90 ${trackTop + trackH + 40}, 80 ${trackTop + trackH + 16}`;
  const arrowLen = 2400;
  return (
    <div style={{ position: 'relative', width: w, height: trackTop + trackH + 100, fontFamily: FONT.sans, opacity: show * (1 - 0.5 * dim) }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: titleH, display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{BAR.title}</div>

      <div style={{ position: 'absolute', left: 0, top: trackTop, width: w, height: trackH, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `3px solid ${alpha(C.cyan, 0.45 + 0.3 * collapse)}`, background: alpha(C.ink700, 0.85), overflow: 'hidden' }}>
        {/* the rest, once the time is booked: the test */}
        <div style={{ position: 'absolute', left: wNow, top: 0, right: 0, height: '100%', background: alpha(C.cyan, 0.28 * collapse), display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: collapse }}>
          <span style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, letterSpacing: 1 }}>{BAR.test}</span>
        </div>
        {/* the simulations that swallow the bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: wAmber, height: '100%', background: alpha(C.amber, 0.55), borderRight: `4px solid ${C.amber}`, boxShadow: `0 0 30px ${alpha(C.amber, 0.45)}`, opacity: amberOp }} />
        {/* the booked 15–20 min: solid up to 15, hatched up to 20 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: wSims, height: '100%', opacity: collapse, display: 'flex' }}>
          <div style={{ width: wSolid, height: '100%', background: alpha(C.violet, 0.7), display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          <div style={{ flex: 1, height: '100%', background: `repeating-linear-gradient(135deg, ${alpha(C.violet, 0.65)} 0 10px, ${alpha(C.violet, 0.2)} 10px 20px)`, borderRight: `4px solid ${C.violet}` }} />
        </div>
        {collapse > 0.3 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: wSims, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 850, color: '#ffffff', whiteSpace: 'nowrap', opacity: clamp01((collapse - 0.3) / 0.5) }}>
            {BAR.sims}
          </div>
        ) : null}
      </div>

      {/* tick marks every 10 minutes (no labels: it is a bar, not a dial) */}
      {ticks.map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: x - 1.5, top: trackTop + trackH + 4, width: 3, height: 12, borderRadius: 2, background: alpha(C.ink500, 0.9) }} />
      ))}

      <svg width={w} height={trackTop + trackH + 100} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {ring > 0 ? <PencilRing x={-6} y={trackTop - 4} w={Math.max(wEaten, wSims) + 4} h={trackH + 8} t={ring} stroke={5} /> : null}
        {ret > 0 ? (
          <>
            <path d={arrowD} fill="none" stroke={C.violet} strokeWidth={7} strokeLinecap="round" strokeDasharray={arrowLen} strokeDashoffset={arrowLen * (1 - ret)} opacity={Math.min(1, ret * 3)} />
            {ret > 0.92 ? <path d={`M 62 ${trackTop + trackH + 36} L 80 ${trackTop + trackH + 12} L 102 ${trackTop + trackH + 34}`} fill="none" stroke={C.violet} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </>
        ) : null}
      </svg>
    </div>
  );
}
