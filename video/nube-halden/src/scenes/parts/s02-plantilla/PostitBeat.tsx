import { C } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { mix } from '../../../../../engine/src/ui';
import { POSTIT_LINES } from '../../../data/s02-plantilla';
import { Pill } from '../Labels';
import { Postit } from '../Postit';
import { ImageTag } from '../Tags';
import { FRIDGE, Fridge, Hand, POSTIT_SPOT } from './Fridge';

const FRIDGE_X = 110;
const FRIDGE_Y = 46;
const FRIDGE_W = 400;
const K = FRIDGE_W / FRIDGE.w;
const SPOT: [number, number] = [FRIDGE_X + POSTIT_SPOT[0] * K, FRIDGE_Y + POSTIT_SPOT[1] * K];
const ROW_X = 600;
const ROW_Y = 300;

export interface PostitBeatTimes {
  postit: number;
  fridge: number;
  removed: number;
  known: number;
  change: number;
}

/**
 * s02's image beat, tagged «imagen · no es del puerto»: the post-it «clave de la alarma» comes in on `postit`; on
 * `fridge` the office fridge appears and the post-it sits on its door; on `removed` a neutral hand peels it off and
 * carries it away; then «quien pasó ya la sabe» (amber) · «cambias la clave» (emerald), each on its word. No copies.
 */
export function PostitBeat({ frame, t }: { frame: number; t: PostitBeatTimes }) {
  const tagIn = progress(frame, t.postit - 6, 14);
  const pIn = enter(frame, t.postit - 4, { distance: 20 });
  const onDoor = progress(frame, t.fridge - 4, 18, EASE.inOut);
  const fridgeIn = enter(frame, t.fridge - 6, { distance: 18 });
  // The hand reaches the post-it, then both leave up and to the right.
  const reach = progress(frame, t.removed - 8, 14, EASE.out);
  const pull = progress(frame, t.removed + 8, 30, EASE.inOut);
  const size = mix(220, 176, onDoor);
  const px = SPOT[0] - size / 2 + pull * 520;
  const py = SPOT[1] - size / 2 - pull * 230;
  const handX = mix(SPOT[0] + 360, SPOT[0] + 34, reach) + pull * 520;
  const handY = SPOT[1] - 50 - pull * 230;
  const gone = progress(frame, t.removed + 26, 16);

  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: tagIn }}>
        <ImageTag />
      </div>
      <div style={{ position: 'absolute', left: FRIDGE_X, top: FRIDGE_Y, opacity: 0.18 + 0.82 * fridgeIn.opacity, transform: fridgeIn.transform }}>
        <Fridge width={FRIDGE_W} />
      </div>
      {gone < 1 ? (
        <div style={{ position: 'absolute', left: px, top: py, opacity: pIn.opacity * (1 - gone), transform: pIn.transform }}>
          <Postit size={size} glow={0.4 * (1 - onDoor) + 0.5 * reach * (1 - pull)} />
        </div>
      ) : null}
      {reach > 0.01 && gone < 1 ? (
        <div style={{ position: 'absolute', left: handX, top: handY, opacity: reach * (1 - gone) }}>
          <Hand width={190} />
        </div>
      ) : null}

      {frame >= t.known - 4 ? (
        <div style={{ position: 'absolute', left: ROW_X, top: ROW_Y, display: 'flex', alignItems: 'center', gap: 20, ...enter(frame, t.known, { distance: 16 }) }}>
          <Pill text={POSTIT_LINES.known} tone={C.amber} icon="users" size={38} height={66} on={1 - 0.5 * progress(frame, t.change, 12)} />
          {frame >= t.change - 4 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, ...enter(frame, t.change, { distance: 14 }) }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: C.faint }}>·</span>
              <Pill text={POSTIT_LINES.change} tone={C.emerald} icon="key" size={38} height={66} on={progress(frame, t.change, 12)} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
