import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { blend } from './Software';

/** Locomotive and carriage sizes, in the train's own units (height 120). */
const LOCO_W = 176;
const CAR_W = 150;
const GAP = 12;
export const TRAIN_H = 124;

/** Natural width of a train with `cars` carriages. */
export function trainWidth(cars: number): number {
  return LOCO_W + cars * (CAR_W + GAP);
}

/** Centre x of the locomotive and the span of the carriages (natural units), to place labels. */
export const TRAIN_ANCHORS = {
  loco: LOCO_W / 2,
  cars: (cars: number) => ({ from: LOCO_W + GAP, to: trainWidth(cars) }),
};

const BODY = '#1f2b40';

/**
 * The train (concept 2, «imagen · no es del puerto»): one steam locomotive pulling passenger carriages with windows —
 * never flatcars, never cargo. `loco` 0–1 lights the locomotive (the kernel), `cars` 0–1 lights the carriages (the
 * containers), `fault` 0–1 turns the locomotive rose (its breakdown). `scale` = width / natural width.
 */
export function Train({
  cars = 3,
  scale = 1,
  loco = 0,
  carsLit = 0,
  fault = 0,
  tone = C.sky,
}: {
  cars?: number;
  scale?: number;
  loco?: number;
  carsLit?: number;
  fault?: number;
  tone?: string;
}) {
  const W = trainWidth(cars);
  const lTone = blend(blend(C.muted, tone, clamp01(loco)), C.rose, clamp01(fault));
  const cTone = blend(C.muted, C.cyan, clamp01(carsLit));
  const wheel = (x: number, r = 13) => <circle cx={x} cy={TRAIN_H - 16} r={r} fill={C.ink900} stroke={alpha(C.text, 0.6)} strokeWidth={3} />;
  return (
    <svg width={W * scale} height={TRAIN_H * scale} viewBox={`0 0 ${W} ${TRAIN_H}`} style={{ overflow: 'visible' }}>
      {/* the rails */}
      <line x1={-10} y1={TRAIN_H - 2} x2={W + 10} y2={TRAIN_H - 2} stroke={alpha(C.muted, 0.6)} strokeWidth={4} />
      {/* the locomotive: cab, boiler, chimney, cowcatcher */}
      <g>
        {fault > 0.01 ? <rect x={-12} y={-8} width={LOCO_W + 20} height={TRAIN_H} rx={18} fill={alpha(C.rose, 0.22 * fault)} /> : null}
        <rect x={104} y={14} width={70} height={TRAIN_H - 44} rx={8} fill={BODY} stroke={lTone} strokeWidth={4} />
        <rect x={116} y={26} width={46} height={30} rx={5} fill={alpha(lTone, 0.35)} />
        <rect x={98} y={6} width={82} height={12} rx={4} fill={lTone} />
        <rect x={18} y={44} width={92} height={TRAIN_H - 74} rx={22} fill={BODY} stroke={lTone} strokeWidth={4} />
        <rect x={34} y={18} width={20} height={30} rx={4} fill={BODY} stroke={lTone} strokeWidth={4} />
        <path d={`M 18 ${TRAIN_H - 34} L 0 ${TRAIN_H - 12} L 18 ${TRAIN_H - 12} Z`} fill={lTone} />
        {wheel(42, 15)}
        {wheel(84, 15)}
        {wheel(146, 12)}
      </g>
      {/* the passenger carriages, windows in a row */}
      {Array.from({ length: cars }, (_, i) => {
        const x = LOCO_W + GAP + i * (CAR_W + GAP);
        return (
          <g key={i}>
            <line x1={x - GAP} y1={TRAIN_H - 34} x2={x} y2={TRAIN_H - 34} stroke={alpha(C.text, 0.5)} strokeWidth={4} />
            <rect x={x} y={20} width={CAR_W} height={TRAIN_H - 50} rx={14} fill={BODY} stroke={cTone} strokeWidth={4} />
            <rect x={x + 6} y={14} width={CAR_W - 12} height={10} rx={5} fill={alpha(cTone, 0.6)} />
            {[0, 1, 2, 3].map((k) => (
              <rect key={k} x={x + 14 + k * 33} y={36} width={24} height={24} rx={4} fill={alpha(cTone, 0.4)} />
            ))}
            {wheel(x + 30)}
            {wheel(x + CAR_W - 30)}
          </g>
        );
      })}
    </svg>
  );
}
