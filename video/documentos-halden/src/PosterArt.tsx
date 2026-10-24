import { C } from '../../engine/src/theme/tokens';
import { GRID, SheetsGrid } from './scenes/parts/SheetsGrid';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: Math.round(GRID.w * 1.04), h: Math.round(GRID.h * 1.04) } as const;

/**
 * The video in one image: four paper sheets in a 2×2 grid, each headed with its real name — POLICY, STANDARD,
 * PROCEDURE, GUIDELINE — and stamped OBLIGA (three) or NO OBLIGA (the guideline), over a soft cyan glow. No person,
 * place or date.
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
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <SheetsGrid scale={1.04} />
      </div>
    </div>
  );
}
