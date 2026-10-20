import { C, alpha } from '../../engine/src/theme/tokens';
import { BACKPACK, Backpack } from './scenes/parts/Backpack';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 780, h: 560 } as const;

const PACK_W = 420;
const PACK_H = (PACK_W * BACKPACK.h) / BACKPACK.w;

/**
 * The video in one image: the backpack in the metro, every pocket outlined (the attack surface) and the pickpocket's
 * hand slipping into the top one (one vector). No dates, no names, no port.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-cyan">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2 + 40} cy={POSTER_ART.h / 2} r={380} fill="url(#poster-cyan)" />
      </svg>
      <div style={{ position: 'absolute', left: (POSTER_ART.w - PACK_W) / 2 + 60, top: POSTER_ART.h - PACK_H + 10, filter: `drop-shadow(0 0 22px ${alpha(C.cyan, 0.25)})` }}>
        <Backpack width={PACK_W} surface={0.8} lit={{ top: 1 }} open={{ top: 0.8 }} hand={{ pocket: 'top', at: 1 }} />
      </div>
    </div>
  );
}
