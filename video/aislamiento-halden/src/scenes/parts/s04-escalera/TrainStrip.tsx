import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';
import { TRAIN } from '../../../data/s04-escalera';
import { ImageTag } from '../Tags';
import { TRAIN_ANCHORS, Train } from '../Train';

const TOP = 534;
const SCALE = 0.62;
const MAIN_X = 340;
const VM_X = 920;
const TRAIN_Y = TOP + 44;

function Label({ text, cx, show, color }: { text: string; cx: number; show: number; color: string }) {
  const s = clamp01(show);
  return (
    <div style={{ position: 'absolute', left: cx, top: TOP, transform: `translate(-50%, ${(1 - s) * 8}px)`, opacity: s, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
}

/**
 * The train along the bottom of s04 (concept 2, «imagen · no es del puerto»): on `train` the locomotive with three
 * passenger carriages; on `train-map` «kernel» over the locomotive and «contenedores» over the carriages, each on its
 * word; then a second short train with its own locomotive, «VM: lleva la suya» and, in amber, «cuesta más».
 */
export function TrainStrip({ show, loco, cars, vm, cost }: { show: number; loco: number; cars: number; vm: number; cost: number }) {
  const s = clamp01(show);
  const carSpan = TRAIN_ANCHORS.cars(3);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s, transform: `translateY(${(1 - s) * 14}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: TRAIN_Y + 18 }}>
        <ImageTag size={24} />
      </div>
      <div style={{ position: 'absolute', left: MAIN_X, top: TRAIN_Y }}>
        <Train cars={3} scale={SCALE} loco={loco} carsLit={cars} />
      </div>
      <Label text={TRAIN.loco} cx={MAIN_X + TRAIN_ANCHORS.loco * SCALE} show={loco} color="#7dd3fc" />
      <Label text={TRAIN.cars} cx={MAIN_X + ((carSpan.from + carSpan.to) / 2) * SCALE} show={cars} color={C.cyanSoft} />
      <div style={{ position: 'absolute', left: VM_X, top: TRAIN_Y, opacity: clamp01(vm), filter: clamp01(cost) > 0.01 ? `drop-shadow(0 0 ${Math.round(14 * clamp01(cost))}px ${alpha(C.amber, 0.4)})` : undefined }}>
        <Train cars={1} scale={SCALE} loco={1} carsLit={1} />
      </div>
      <Label text={TRAIN.vm} cx={VM_X + (TRAIN_ANCHORS.cars(1).to * SCALE) / 2} show={vm} color={C.cyanSoft} />
      <div style={{ position: 'absolute', left: VM_X + TRAIN_ANCHORS.cars(1).to * SCALE + 28, top: TRAIN_Y + 18, opacity: clamp01(cost), fontFamily: FONT.sans, fontSize: 34, fontWeight: 850, color: C.amber, whiteSpace: 'nowrap' }}>
        {TRAIN.cost}
      </div>
    </div>
  );
}
