import { C, alpha } from '../../engine/src/theme/tokens';
import { CarnetGlyph, PadlockGlyph, STEEL, TabletGlyph } from './scenes/parts/Glyphs';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 850, h: 600 } as const;

const TABLET = { y: 452, h: 164 } as const;
const SHARED = { x: 205, xs: [72, 205, 338], lock: { y: 132, h: 196 } } as const;
const EACH = { xs: [500, 640, 780], card: { y: 150, h: 78 } } as const;

/**
 * The video in one image: on the left ONE combination padlock that three tablets share (amber: a key
 * for everybody); on the right the same three tablets, each with its own carné (emerald: an identity
 * each). The padlock is closed, as everywhere in the video.
 */
export function PosterArt() {
  const top = TABLET.y - TABLET.h / 2 - 8;
  return (
    <svg width={POSTER_ART.w} height={POSTER_ART.h} viewBox={`0 0 ${POSTER_ART.w} ${POSTER_ART.h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="poster-amber">
          <stop offset="0%" stopColor={C.amber} stopOpacity={0.16} />
          <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="poster-emerald">
          <stop offset="0%" stopColor={C.emerald} stopOpacity={0.16} />
          <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={SHARED.x} cy={300} r={330} fill="url(#poster-amber)" />
      <circle cx={EACH.xs[1]} cy={300} r={330} fill="url(#poster-emerald)" />

      {/* one key for everybody */}
      {SHARED.xs.map((x) => (
        <path
          key={x}
          d={`M ${x} ${top} C ${x} ${top - 70}, ${SHARED.x + (x - SHARED.x) * 0.25} ${SHARED.lock.y + 150}, ${SHARED.x + (x - SHARED.x) * 0.25} ${SHARED.lock.y + 96}`}
          fill="none"
          stroke={alpha(C.amber, 0.8)}
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
      {SHARED.xs.map((x) => (
        <TabletGlyph key={x} x={x} y={TABLET.y} h={TABLET.h} screen={0.45} />
      ))}
      <PadlockGlyph x={SHARED.x} y={SHARED.lock.y} h={SHARED.lock.h} tone={C.amber} glow={0.7} />

      {/* from one to the other */}
      <g stroke={STEEL.light} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1={392} y1={300} x2={444} y2={300} />
        <path d="M 428 280 L 448 300 L 428 320" />
      </g>

      {/* an identity each */}
      {EACH.xs.map((x) => (
        <line key={x} x1={x} y1={EACH.card.y + EACH.card.h / 2 + 6} x2={x} y2={top} stroke={alpha(C.emerald, 0.8)} strokeWidth={5} strokeLinecap="round" />
      ))}
      {EACH.xs.map((x) => (
        <TabletGlyph key={x} x={x} y={TABLET.y} h={TABLET.h} screen={0.45} />
      ))}
      {EACH.xs.map((x) => (
        <CarnetGlyph key={x} x={x} y={EACH.card.y} h={EACH.card.h} glow={0.6} />
      ))}
    </svg>
  );
}
