import { C } from '../../engine/src/theme/tokens';
import { SilhouetteRow, silhouetteRowSize } from './scenes/parts/SilhouetteRow';

const SIL_W = 220;
const ROW = silhouetteRowSize(SIL_W);
const PAD = 30;

/** The poster's image, in its own units. */
export const POSTER_ART = { w: ROW.w + 2 * PAD, h: Math.ceil(ROW.h) + 2 * PAD } as const;

/**
 * The video in one image: s01's three silhouettes — the server, the application window and the door onto the street —
 * each with its eye, its cone of light and its hatched blind spot. No dates, no names, nothing else from the port.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-cyan">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} rx={POSTER_ART.w * 0.6} ry={POSTER_ART.h * 0.7} fill="url(#poster-cyan)" />
      </svg>
      <div style={{ position: 'absolute', left: PAD, top: PAD }}>
        <SilhouetteRow width={SIL_W} glow={0.6} id="poster" />
      </div>
    </div>
  );
}
