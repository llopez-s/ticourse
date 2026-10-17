import { LOCK_TAG } from '../../../data/s08-cierre';
import { ControlTag } from '../ControlTag';
import { LOCK_RATIO, LOCK_TIE, Lock } from '../Lock';

/** ControlTag's height at width w with the hole on (2 boxes + gap + padding + borders, see ControlTag). */
const tagHeight = (w: number) => {
  const s = w / 420;
  return 2 * Math.round(118 * s) + Math.round(12 * s) + 2 * Math.round(18 * s) + 2 * Math.max(2, Math.round(3 * s));
};

/** The composite's box for a lock of width `lockW` and a tag of width `tagW`. */
export function lockTagSize(lockW: number, tagW: number) {
  const s = tagW / 420;
  const tie = { x: lockW * LOCK_TIE.x, y: lockW * LOCK_RATIO * LOCK_TIE.y };
  const tagTop = tie.y - 26 * s;
  return { w: tie.x + tagW, h: Math.max(lockW * LOCK_RATIO, tagTop + tagHeight(tagW)), tie, tagTop };
}

/**
 * s04's lock with its tag completed — «Physical» up, «Preventive» down — tied to the lever with the same geometry
 * as S04Camara (the tag's string ends at tag-local (0, 26·s) on LOCK_TIE). Static: both values are in from the
 * first frame. For the end card and the poster (one Lock per frame: its gradient ids are fixed).
 */
export function LockTag({ lockW, tagW, glow = 0 }: { lockW: number; tagW: number; glow?: number }) {
  const { w, h, tie, tagTop } = lockTagSize(lockW, tagW);
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Lock width={lockW} glow={glow} />
      </div>
      <div style={{ position: 'absolute', left: tie.x, top: tagTop }}>
        <ControlTag frame={0} width={tagW} top={LOCK_TAG.top} topAt={-100} bottom={LOCK_TAG.bottom} bottomAt={-100} />
      </div>
    </div>
  );
}
