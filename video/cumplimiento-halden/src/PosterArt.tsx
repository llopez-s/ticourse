import { C, alpha } from '../../engine/src/theme/tokens';
import { Disc } from './scenes/parts/Labels';
import { LEDGER, Ledger } from './scenes/parts/Ledger';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 700, h: Math.round((700 * 470) / 640) + 70 } as const;

/**
 * The video in one image: its thread. The lost-property notebook behind, tilted, and in front of it the screen that
 * replaces it, with its tidy rows and the three ticks of the promise. No dates, no names, no figures.
 */
export function PosterArt() {
  const bookW = 520;
  const screenW = 580;
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={POSTER_ART.h / 2} r={400} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 96, transform: 'rotate(-5deg)', opacity: 0.9 }}>
        <Ledger width={bookW} morph={0} glow={0.2} />
      </div>
      <div style={{ position: 'absolute', left: POSTER_ART.w - screenW, top: 0, filter: `drop-shadow(0 30px 40px ${alpha('#000000', 0.45)})` }}>
        <Ledger width={screenW} morph={1} glow={0.6} />
      </div>
      <div style={{ position: 'absolute', right: -6, top: Math.round((screenW * LEDGER.h) / LEDGER.w) - 24, display: 'flex', gap: 12 }}>
        {[0, 1, 2].map((k) => (
          <Disc key={k} icon="check" tone={C.emerald} show={1} size={68} />
        ))}
      </div>
    </div>
  );
}
