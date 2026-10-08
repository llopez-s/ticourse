import { C } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { Alarm, alarmBox } from '../Alarm';
import { KillChain, PhaseRow, Vignette, killChainLayout, vignetteHeight, type PhaseId, type VignetteLook } from '../KillChain';

/**
 * s10's small drawings — the video's own images, from the shared parts (never redrawn here). At rule-card size the
 * seven slots would be too small to read, so both rows show the stretch the rule is about, from the door onwards
 * (Delivery … Command & Control):
 * - `ChainArt` (rule 1): the links hanging from each other; Exploitation breaks («nadie la abre») and the steps after
 *   it go grey, as in s02.
 * - `AlarmArt` (rule 3): the phase row with the alarm on its left (over Delivery); when someone acts on it (`act`) the
 *   emerald lock lands and the slots to its right switch off, as in s07.
 * - `DoorArt` (end card): «que la próxima caja se quede en la puerta» — the Delivery vignette, the closed parcel on
 *   the doormat.
 */
export const MINI_W = 440;
const IDS: readonly PhaseId[] = ['delivery', 'exploitation', 'installation', 'c2'];
const AFTER_BREAK: readonly PhaseId[] = ['installation', 'c2'];
const ROW = killChainLayout(MINI_W, { ids: IDS, names: false });

export function ChainArt({ frame, draw, broken }: { frame: number; draw: number; broken: number }) {
  const b = clamp01(broken);
  const looks: Partial<Record<PhaseId, VignetteLook>> = {};
  IDS.forEach((id, i) => {
    looks[id] = {
      show: progress(draw, i * 0.1, 0.3),
      broken: id === 'exploitation' ? b : 0,
      grey: AFTER_BREAK.includes(id) ? b : 0,
    };
  });
  return (
    <div style={{ position: 'relative', width: MINI_W, height: ROW.slotH }}>
      <KillChain width={MINI_W} ids={IDS} frame={frame} looks={looks} links={progress(draw, 0.4, 0.6, EASE.inOut)} />
    </div>
  );
}

export function AlarmArt({ frame, draw, act }: { frame: number; draw: number; act: number }) {
  const size = 58;
  const box = alarmBox(size);
  const at = ROW.slot('delivery')!;
  const a = clamp01(act);
  const looks: Partial<Record<PhaseId, VignetteLook>> = {};
  for (const s of ROW.slots) looks[s.id] = { show: progress(draw, s.i * 0.08, 0.3), grey: s.i > at.i ? a : 0 };
  const top = box.h - 10;
  return (
    <div style={{ position: 'relative', width: MINI_W, height: top + ROW.slotH }}>
      <div style={{ position: 'absolute', left: 0, top }}>
        <PhaseRow width={MINI_W} ids={IDS} frame={frame} looks={looks} names={0} />
      </div>
      <div style={{ position: 'absolute', left: at.cx - box.w / 2, top: 0 }}>
        <Alarm size={size} frame={frame} appear={progress(draw, 0.5, 0.4)} ring={draw > 0.9 ? 1 - a : 0} act={a} />
      </div>
    </div>
  );
}

export function DoorArt({ frame, at, width }: { frame: number; at: number; width: number }) {
  const w = Math.min(width, 420);
  return (
    <div style={{ width: w, height: vignetteHeight(w) }}>
      <Vignette phase="delivery" width={w} frame={frame} look={{ act: progress(frame, at + 4, 24, EASE.inOut), tone: C.cyan, lit: progress(frame, at + 20, 16) }} />
    </div>
  );
}
