import { C } from '../../engine/src/theme/tokens';
import { SensorField } from './scenes/parts/SensorField';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 760, h: 520 } as const;

/**
 * The video in one image: the network of sensors, every dot lit and joined to its neighbours, and one dot raising an
 * amber warning with a bell — the person who avisa —, over a soft cyan glow. No face, name, count or date.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.18} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={470} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <SensorField width={POSTER_ART.w} height={POSTER_ART.h} cols={11} rows={8} seed={5} frame={0} dotsAt={-1000} sensorsAt={-1000} heroAt={-1000} live={false} hero dot={10} />
      </div>
    </div>
  );
}
