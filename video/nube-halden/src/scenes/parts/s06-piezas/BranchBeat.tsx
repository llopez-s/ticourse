import { C } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../../../engine/src/theme/motion';
import { mix } from '../../../../../engine/src/ui';
import { BRANCHES_SAFE } from '../../../data/s06-piezas';
import { BankMap, MAP } from '../Branch';
import { Pill } from '../Labels';
import { ImageTag } from '../Tags';

const BIG = { x: 60, y: 70, w: 700 } as const;
const THUMB = { x: 0, y: 470, w: 270 } as const;

export interface BranchBeatTimes {
  branches: number;
  robbed: number;
  safe: number;
  shrink: number;
  back: number;
  out: number;
}

/**
 * s06's image beat, tagged «imagen · no es del puerto»: a street map with four bank branches (`branches`). On
 * `robbed` (the alarm sound) the first one's shutter is forced and its rose beacon flashes; on «demás» the other three
 * get their emerald ticks and «las demás no pierden nada». On `port` the map shrinks to a thumbnail at the bottom
 * left, which glows again when the voice says «como las sucursales», and leaves on `calls`.
 */
export function BranchBeat({ frame, fps, t }: { frame: number; fps: number; t: BranchBeatTimes }) {
  const mapIn = enter(frame, t.branches - 6, { distance: 18 });
  const shrink = progress(frame, t.shrink - 12, 22, EASE.inOut);
  const x = mix(BIG.x, THUMB.x, shrink);
  const y = mix(BIG.y, THUMB.y, shrink);
  const w = mix(BIG.w, THUMB.w, shrink);
  const forced = progress(frame, t.robbed - 2, 10, EASE.out);
  // The beacon flashes while the alarm sounds, then stays dimly on.
  const flash = frame >= t.robbed ? (frame < t.robbed + 40 ? 0.4 + 0.6 * pulse(frame, fps, 3) : 0.45) : 0;
  const backGlow = progress(frame, t.back - 4, 10) * (1 - progress(frame, t.back + 40, 20));
  const out = progress(frame, t.out - 12, 14, EASE.inOut);
  const labelOut = progress(frame, t.shrink - 14, 12);

  return (
    <>
      <div style={{ position: 'absolute', left: shrink > 0.5 ? THUMB.x : 0, top: shrink > 0.5 ? THUMB.y - 44 : 0, opacity: progress(frame, t.branches - 6, 14) * (1 - out) }}>
        <ImageTag size={shrink > 0.5 ? 20 : 26} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          opacity: (0.25 + 0.75 * mapIn.opacity) * (1 - out) * (1 - 0.3 * shrink + 0.3 * shrink * backGlow),
          transform: shrink < 0.01 ? mapIn.transform : undefined,
          filter: backGlow > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * backGlow)}px rgba(52, 211, 153, 0.5))` : undefined,
        }}
      >
        <BankMap width={w} forced={forced} beacon={flash} safe={progress(frame, t.safe, 12)} />
      </div>
      {frame >= t.safe - 4 && labelOut < 1 ? (
        <div style={{ position: 'absolute', left: BIG.x + BIG.w + 60, top: BIG.y + (BIG.w * MAP.h) / MAP.w / 2 - 33, opacity: 1 - labelOut }}>
          <div style={{ ...enter(frame, t.safe, { distance: 14 }) }}>
            <Pill text={BRANCHES_SAFE} tone={C.emerald} icon="check" size={42} height={72} on={progress(frame, t.safe, 12)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
