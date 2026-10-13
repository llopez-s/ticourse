import type { SceneProps } from '../../../../../engine/src/timeline/types';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { windowWeight } from '../../../../../engine/src/ui';
import { SHOP_AFTER_S04 } from '../../../data/s04-fase';
import { VIGNETTE, VIGNETTE_BIG, mixPose } from '../../../data/s05-caminos';
import { SHOP_POSE } from '../../../data/shop-poses';
import type { ShopProps } from '../Shop';
import { s05Marks } from './beats';

/**
 * The shop of s05 at `frame`: where it sits and every prop of the walkie vignette. One drawing that
 * changes state on the words; the C2 never borrows the shutter or the walked-out figure.
 *   start      s04's door (lock, alarm, camera, guard) going dark, low and left under the message.
 *   row-c2     it steps up to its vignette place, still dim.
 *   walkie     the suspect and his walkie; «nadie le conteste» = the far end goes dead (DENY);
 *              «un canal con ruido, y escuchas» = static and headphones on the line, the safe closed.
 *   supose     the safe lights emerald on «a salvo»; the channel is plain again while you think.
 *   answer     static and headphones again, safe closed.
 *   flip       hypothetical: the safe opens, amber; on «Cortas» the far end goes dead and the safe
 *              closes again. From `business` on, the plain channel: the menu, not a decision.
 */
export function s05Shop(props: SceneProps, frame: number, fps: number): { pose: { x: number; y: number; w: number }; shop: Omit<ShopProps, 'width'> } {
  const m = s05Marks(props);
  const { at } = m;
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const io = (start: number, dur = 20) => progress(frame, start, dur, EASE.inOut);
  const win = (from: number, to?: number, ramp = 12) => windowWeight(frame, from, to, { ramp });

  const pose = mixPose(mixPose(SHOP_POSE.card, VIGNETTE, io(m.rowC2 - 4, 26)), VIGNETTE_BIG, io(m.answer + 6, 24));
  // What s04 left lit on the door goes out during the first second.
  const left = 1 - io(2, props.enterFrames + 16);
  const dim = 0.5 * io(2, props.enterFrames + 16) * (1 - p(m.walkie - 6, 14));

  const suspect = p(at('s05-04', 'sospechoso') - 6, 12);
  const draw = progress(frame, at('s05-04', 'habla') - 4, 26, EASE.inOut);
  const cutOff = win(m.cut, m.business - 8);
  const nobody = Math.max(win(at('s05-04', 'nadie') - 4, at('s05-04', 'o', 1) - 2), cutOff);
  const noisy = Math.max(win(at('s05-04', 'ruido,') - 6, m.supose - 8), win(at('s05-06', 'frenas') - 4, m.cut - 2));
  const listener = Math.max(win(at('s05-04', 'escuchas.') - 4, m.supose - 8), win(at('s05-06', 'mirando,') - 4, m.cut - 2));

  const emptied = win(m.taken, at('s05-07', 'resto') - 2);
  const closed = Math.max(0.6 * win(at('s05-04', 'ruido,') - 6, m.supose - 8), p(at('s05-05', 'salvo.') - 6, 12));
  const secured = p(at('s05-07', 'resto') + 6, 14);

  return {
    pose,
    shop: {
      phase: frame / fps,
      dim,
      lock: SHOP_AFTER_S04.lock * left,
      lockFail: left > 0.02 ? SHOP_AFTER_S04.lockFail : 0,
      door: SHOP_AFTER_S04.door * left,
      alarm: SHOP_AFTER_S04.alarm * left,
      camera: SHOP_AFTER_S04.camera * left,
      live: SHOP_AFTER_S04.live * left,
      labels: { live: SHOP_AFTER_S04.live * left },
      guard: SHOP_AFTER_S04.guard * left,
      guardGlow: SHOP_AFTER_S04.guardGlow * left,
      suspect,
      channel: { draw, talk: 1, nobody, noisy, listener },
      safe: Math.max(closed * (1 - emptied), secured),
      safeOpen: 0.8 * emptied,
      safeWarn: emptied,
    },
  };
}
