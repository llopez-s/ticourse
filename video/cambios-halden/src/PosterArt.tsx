import { C } from '../../engine/src/theme/tokens';
import { RequestSheet, SHEET } from './scenes/parts/Request';

const SHEET_W = 640;

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 700, h: Math.round((SHEET_W * SHEET.h) / SHEET.w) + 60 } as const;

/**
 * The video in one image: the change request «Poner al día las carpetas compartidas de las oficinas» with its three
 * boxes ticked and the «cerrado» stamp, slightly turned, over a soft cyan glow. No names, dates or hosts.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={440} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 30, top: 30, transform: 'rotate(2deg)' }}>
        <RequestSheet width={SHEET_W} owner={1} checks={[1, 1, 1]} stamp="closed" glow={0.6} />
      </div>
    </div>
  );
}
