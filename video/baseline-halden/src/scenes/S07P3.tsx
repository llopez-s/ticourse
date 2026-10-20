import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { BRIDGE_RATIO, BridgeArt } from './parts/Devices';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const BRIDGE_W = 1000;
const BRIDGE_X = (W - BRIDGE_W) / 2;
const BRIDGE_Y = 70;
const WATER_Y = BRIDGE_Y + BRIDGE_W * BRIDGE_RATIO * (104 / 120);

/**
 * s07-p3 «El puente levadizo». The engine's exam question panel covers the stage from s07-01 to the end of the scene
 * (question, «MEJOR», options, countdown, answer on `ok-3`, trap on `trap-3`, then the exam card on `hangar`; the
 * last sentence holds 2.3 s on purpose so the card fits), so this scene is ONLY a still, dim, textless background,
 * complete from the first frame and never moving: the drawbridge at the port's entrance, lowered, over the water, the
 * same silhouette as s01 and s04 — no cables, no control box, no network line. Plus the label «pregunta tipo examen ·
 * ejemplo» (QuestionStill). «El puente entra en el hangar» is said by the voice only.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="s07-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1a33" />
              <stop offset="100%" stopColor="#1d3557" />
            </linearGradient>
            <linearGradient id="s07-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#173a60" />
              <stop offset="100%" stopColor="#0b1d33" />
            </linearGradient>
          </defs>
          <rect x={0} y={20} width={W} height={WATER_Y - 20} rx={18} fill="url(#s07-sky)" />
          <rect x={0} y={WATER_Y} width={W} height={H - WATER_Y} fill="url(#s07-water)" />
          {/* the breakwaters either side of the entrance */}
          <path d={`M 0 ${WATER_Y} H ${BRIDGE_X + 40} V ${WATER_Y - 30} H 0 Z`} fill={C.ink800} />
          <path d={`M ${W} ${WATER_Y} H ${BRIDGE_X + BRIDGE_W - 40} V ${WATER_Y - 30} H ${W} Z`} fill={C.ink800} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M ${60 + i * 190} ${WATER_Y + 40 + (i % 3) * 30} q 30 -10 60 0 t 60 0`} fill="none" stroke={alpha(C.sky, 0.35)} strokeWidth={3} strokeLinecap="round" />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: BRIDGE_X, top: BRIDGE_Y }}>
          <BridgeArt width={BRIDGE_W} tone={alpha(C.cyan, 0.7)} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
