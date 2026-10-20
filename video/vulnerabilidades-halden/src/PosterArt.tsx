import { C } from '../../engine/src/theme/tokens';
import { Silhouette, type SilKind } from './scenes/parts/Silhouettes';

/** The poster's image, in its own units. */
export const POSTER_ART = { w: 780, h: 560 } as const;

const SIZE = 290;
const AT: { kind: SilKind; x: number; y: number }[] = [
  { kind: 'server', x: 60, y: 0 },
  { kind: 'cloud', x: POSTER_ART.w - SIZE - 20, y: 0 },
  { kind: 'phone', x: (POSTER_ART.w - SIZE) / 2 + 20, y: POSTER_ART.h - SIZE + 10 },
];

/**
 * The video in one image: its three silhouettes — the shared server, the cloud, the phone — each with its rose crack
 * (where the failure was born). No dates, no names, no port.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-glow">
            <stop offset="0%" stopColor={C.rose} stopOpacity={0.12} />
            <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={POSTER_ART.w / 2 + 20} cy={POSTER_ART.h / 2} r={380} fill="url(#poster-glow)" />
      </svg>
      {AT.map((a) => (
        <div key={a.kind} style={{ position: 'absolute', left: a.x, top: a.y }}>
          <Silhouette kind={a.kind} size={SIZE} crack={1} glow={0.6} />
        </div>
      ))}
    </div>
  );
}
