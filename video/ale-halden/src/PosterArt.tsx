import { C, FONT, alpha } from '../../engine/src/theme/tokens';
import { Phone } from './scenes/parts/Phone';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 850, h: 600 } as const;

const PHONE = { x: 6, y: 40, width: 232 } as const;
const COL = { x: 340, w: 510 } as const;
const BAR = { h: 66, aleY: 392, controlY: 486 } as const;
/** The control's bar is 20.000 / 50.000 of the ALE's (same scale, same unit). */
const CONTROL_W = Math.round(COL.w * (20000 / 50000));

/**
 * The video in one image: the 400 € phone with its cracked screen (an event costs a quarter of the value)
 * next to the annual number in cyan, «50.000 € / año», and the two annual bars on one scale: the ALE and the
 * control that costs less than it. No dates, no hostnames, nothing from the matrix.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg
        width={POSTER_ART.w}
        height={POSTER_ART.h}
        viewBox={`0 0 ${POSTER_ART.w} ${POSTER_ART.h}`}
        style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="poster-cyan">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="poster-rose">
            <stop offset="0%" stopColor={C.rose} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={COL.x + COL.w / 2} cy={300} r={330} fill="url(#poster-cyan)" />
        <circle cx={PHONE.x + 150} cy={300} r={260} fill="url(#poster-rose)" />

        {/* the two annual bars, same scale */}
        <rect x={COL.x} y={BAR.aleY} width={COL.w} height={BAR.h} rx={14} fill={C.cyan} />
        <rect x={COL.x} y={BAR.controlY} width={CONTROL_W} height={BAR.h} rx={14} fill={C.emerald} />
        {/* the ALE as the yardstick */}
        <line x1={COL.x + COL.w} y1={BAR.aleY - 22} x2={COL.x + COL.w} y2={BAR.controlY + BAR.h + 22} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" />
        <text x={COL.x + 24} y={BAR.aleY + BAR.h / 2 + 12} fontFamily={FONT.sans} fontSize={36} fontWeight={850} fill={C.ink950}>
          ALE
        </text>
        <text x={COL.x + CONTROL_W + 18} y={BAR.controlY + BAR.h / 2 + 12} fontFamily={FONT.sans} fontSize={36} fontWeight={800} fill={C.emerald}>
          control
        </text>
      </svg>

      {/* the 400 € phone, screen cracked */}
      <div style={{ position: 'absolute', left: PHONE.x, top: PHONE.y }}>
        <Phone width={PHONE.width} crack={1} glow={0.7} />
      </div>

      {/* the annual number */}
      <div style={{ position: 'absolute', left: COL.x - 4, top: 96, width: COL.w + 8, whiteSpace: 'nowrap', fontFamily: FONT.sans }}>
        <div style={{ fontSize: 112, fontWeight: 850, letterSpacing: -3, lineHeight: 1, color: C.cyan }}>50.000 €</div>
        <div style={{ marginTop: 6, fontSize: 64, fontWeight: 800, letterSpacing: -1, lineHeight: 1, color: C.textStrong }}>/ año</div>
      </div>
    </div>
  );
}
