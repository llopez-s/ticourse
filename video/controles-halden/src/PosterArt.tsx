import { C } from '../../engine/src/theme/tokens';
import { LockTag, lockTagSize } from './scenes/parts/s08-cierre/LockTag';

const LOCK_W = 210;
const TAG_W = 420;
const BOX = lockTagSize(LOCK_W, TAG_W);
const PAD = 20;

/** The poster's image, in its own units. */
export const POSTER_ART = { w: Math.ceil(BOX.w) + 2 * PAD, h: Math.ceil(BOX.h) + 2 * PAD } as const;

/**
 * The video in one image: the lock from s01/s04 — a door lever handle with keyhole, never a padlock — with its
 * two-box tag tied to the lever and both boxes filled, «Physical» up (cyan, the category) and «Preventive» down
 * (violet, the type). No dates, no names, nothing else from the port.
 */
export function PosterArt() {
  return (
    <div style={{ position: 'relative', width: POSTER_ART.w, height: POSTER_ART.h }}>
      <svg width={POSTER_ART.w} height={POSTER_ART.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="poster-violet">
            <stop offset="0%" stopColor={C.violet} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.violet} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={PAD + BOX.tie.x + TAG_W / 2} cy={PAD + BOX.tagTop + 160} r={330} fill="url(#poster-violet)" />
      </svg>
      <div style={{ position: 'absolute', left: PAD, top: PAD }}>
        <LockTag lockW={LOCK_W} tagW={TAG_W} glow={0.9} />
      </div>
    </div>
  );
}
