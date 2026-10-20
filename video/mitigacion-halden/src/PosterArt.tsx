import { C, alpha } from '../../engine/src/theme/tokens';
import { PLANT, Plant } from './scenes/parts/Plant';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 700, h: 560 } as const;

const PLANT_W = 470;
const PLANT_H = (PLANT_W * PLANT.h) / PLANT.w;
const S = PLANT_W / PLANT.w;
/** Centre of the aphids' cluster on the upper right leaves, in the plant's units (with the poster's droop). */
const CAUSE = { x: 194, y: 140 } as const;

/**
 * The video in one image: the living-room plant, wilted, being watered in vain, with its aphids ringed in rose — the
 * cause that water does not fix. No dates, no names, no port.
 */
export function PosterArt() {
  const left = (POSTER_ART.w - PLANT_W) / 2 + 40;
  const top = POSTER_ART.h - PLANT_H;
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.emerald} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2 + 40} cy={POSTER_ART.h / 2 + 30} r={360} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left, top }}>
        <Plant width={PLANT_W} droop={0.85} water={1} aphids={1} frame={10} />
      </div>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <circle cx={left + CAUSE.x * S} cy={top + CAUSE.y * S} r={62} fill="none" stroke={C.rose} strokeWidth={7} style={{ filter: `drop-shadow(0 0 14px ${alpha(C.rose, 0.6)})` }} />
      </svg>
    </div>
  );
}
