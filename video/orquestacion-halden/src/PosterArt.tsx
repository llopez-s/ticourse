import { C, alpha } from '../../engine/src/theme/tokens';
import { AVENUE, Avenue } from './scenes/parts/Avenue';
import { TrafficLight } from './scenes/parts/TrafficLight';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 780, h: 560 } as const;

const AV_W = 640;
const AV_H = (AV_W * AVENUE.h) / AVENUE.w;
const LIGHT_W = 110;

/**
 * The video in one image: the avenue seen from above with its central and the green wave, the ambulance getting its
 * way (orchestration), and in front, one traffic light on green (the single task). No dates, no names, no port.
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
      <div style={{ position: 'absolute', left: POSTER_ART.w - AV_W, top: (POSTER_ART.h - AV_H) / 2 - 20, filter: `drop-shadow(0 0 22px ${alpha(C.cyan, 0.25)})` }}>
        <Avenue width={AV_W} green={() => 1} frame={40} ambulance={0.58} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: POSTER_ART.h - LIGHT_W * 3 - 10, filter: `drop-shadow(0 0 18px ${alpha(C.emerald, 0.35)})` }}>
        <TrafficLight width={LIGHT_W} green={1} />
      </div>
    </div>
  );
}
