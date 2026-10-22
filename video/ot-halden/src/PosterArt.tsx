import { C } from '../../engine/src/theme/tokens';
import { CRANE, Crane } from './scenes/parts/Crane';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 800, h: Math.round((800 * CRANE.h) / CRANE.w) } as const;

/**
 * The video in one image: the gantry crane of every scene, its four marked parts half lit (controllers, anti-collision,
 * wind sensor, wireless sensor) and a container on its hook, over a soft sky glow. No number, quay, name or network.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.sky} stopOpacity={0.16} />
            <stop offset="100%" stopColor={C.sky} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={440} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Crane width={POSTER_ART.w} lit={{ controllers: 0.7, anticollision: 0.7, wind: 0.7, wireless: 0.7 }} dots />
      </div>
    </div>
  );
}
