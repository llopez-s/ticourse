import { C } from '../../engine/src/theme/tokens';
import { FloorPlan, PLAN } from './scenes/parts/FloorPlan';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 820, h: Math.round((820 * PLAN.h) / PLAN.w) } as const;

/**
 * The video in one image: the example floor plan seen from above with its three controls — the bollards, the
 * vestibule with one person inside, the card reader lit and its log — over a soft sky glow. No camera, fence, name or
 * place of the port.
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
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={460} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <FloorPlan width={POSTER_ART.w} car={1} bollards={1} vestibule={1} reader={1} person={1} beep={1} log={1} idSuffix="-poster" />
      </div>
    </div>
  );
}
