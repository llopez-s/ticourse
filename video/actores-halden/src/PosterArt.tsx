import { C } from '../../engine/src/theme/tokens';
import { ACTORS, ActorCard } from './scenes/parts/ActorCard';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 760, h: 560 } as const;

const CARD = { w: 360, h: 130, gap: 18, row: 165 } as const;

/**
 * The video in one image: the six actor cards face up, gathered in their three pairs (amber, rose, sky), the middle
 * pair a little forward. No dates, no names but the six exam names, no port.
 */
export function PosterArt() {
  const top = (POSTER_ART.h - (2 * CARD.row + CARD.h)) / 2;
  const left = (POSTER_ART.w - (2 * CARD.w + CARD.gap)) / 2;
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
      {ACTORS.map((a, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: left + (i % 2) * (CARD.w + CARD.gap) + (a.pair === 1 ? -24 : 0),
            top: top + a.pair * CARD.row,
            transform: `rotate(${(i % 2 ? 1.5 : -1.5) * (a.pair === 1 ? -1 : 1)}deg)`,
          }}
        >
          <ActorCard index={i} w={CARD.w} h={CARD.h} size={33} glow={0.7} />
        </div>
      ))}
    </div>
  );
}
