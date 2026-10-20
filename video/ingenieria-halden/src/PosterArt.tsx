import { C, alpha } from '../../engine/src/theme/tokens';
import { LetterArt } from './scenes/parts/Images';
import { LureCard } from './scenes/parts/Messages';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 760, h: 560 } as const;

/**
 * The video in one image: the lure (rose rim) arriving three ways — the same letter in an envelope, in a phone and out
 * of a handset. No dates, no names, no addresses.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2} cy={330} r={340} fill="url(#poster-glow)" />
      </svg>
      <div style={{ position: 'absolute', left: 40, top: 60, transformOrigin: '0 0', transform: 'scale(0.52)' }}>
        <LureCard size={54} style={{ boxShadow: `0 0 40px ${alpha(C.rose, 0.25)}` }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 300, display: 'flex', gap: 10 }}>
        <LetterArt form="envelope" width={240} />
        <LetterArt form="phone" width={240} />
        <LetterArt form="handset" width={240} />
      </div>
    </div>
  );
}
