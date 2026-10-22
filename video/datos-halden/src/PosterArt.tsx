import { C } from '../../engine/src/theme/tokens';
import { RECORD, Record } from './scenes/parts/Record';

const SCALE = 1.18;

/** The poster's image, in its own units. */
export const POSTER_ART = { w: Math.round(RECORD.w * SCALE), h: Math.round((RECORD.h + RECORD.chipH + 18) * SCALE) } as const;

/**
 * The video in one image: the clock-in record — «nombre · DNI · horas», every value a redacted bar, the DNI row lit —
 * with its chip «datos de la plantilla · private», over a soft cyan glow. No name, number, time or place of the port.
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
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={430} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Record scale={SCALE} dni={1} />
      </div>
    </div>
  );
}
