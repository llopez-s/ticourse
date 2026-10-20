import { C } from '../../engine/src/theme/tokens';
import { DECISIONS } from './data/s01-hook';
import { APP, AppWindow } from './scenes/parts/AppWindow';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 800, h: (800 * APP.h) / APP.w } as const;

/**
 * The video in one image: its thread, the new application's window in front of the cloud, with the three decisions
 * («la plantilla», «la función», «las piezas») ticked. No dates, no names, no provider.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.sky} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.sky} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={420} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <AppWindow width={POSTER_ART.w} labels={DECISIONS} labelOn={[1, 1, 1]} ticks={[1, 1, 1]} glow={0.6} />
      </div>
    </div>
  );
}
