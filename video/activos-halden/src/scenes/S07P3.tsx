import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { Ssd } from './parts/Drives';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const BOX = { x: 580, y: 250, w: 568, h: 330 } as const;
/** The disks standing in the box (x offset, tilt) and the two left on the floor beside it (x, y, tilt). */
const INSIDE: [number, number][] = [
  [40, -6],
  [150, 4],
  [262, -3],
  [374, 6],
];
const BESIDE: [number, number, number][] = [
  [1220, 500, -8],
  [1330, 516, 10],
];

/**
 * s07-p3 «Discos camino del reciclaje». The engine's exam question panel covers the stage from s07-01 to the end of
 * the scene (scenario, question with «MEJOR», options, countdown, answer on `ok-3`, trap on `trap-3`, then the exam
 * card), so this scene is ONLY a still background, complete from the first frame and never moving: an open cardboard
 * box full of solid-state disks with blank labels, two more on the floor beside it — no text. Plus the label «pregunta
 * tipo examen · ejemplo» (QuestionStill). The magnetic-disk line and the car callback are voice-only.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 20} rx={18} fill={C.ink900} />
          <rect x={0} y={BOX.y + BOX.h} width={W} height={H - BOX.y - BOX.h} fill={alpha(C.ink700, 0.45)} />
          {/* back flap */}
          <path d={`M ${BOX.x + 20} ${BOX.y} L ${BOX.x + 60} ${BOX.y - 90} L ${BOX.x + BOX.w - 60} ${BOX.y - 90} L ${BOX.x + BOX.w - 20} ${BOX.y} Z`} fill="#6b4a2b" stroke={alpha('#000000', 0.4)} strokeWidth={3} />
        </svg>
        {INSIDE.map(([dx, rot]) => (
          <div key={dx} style={{ position: 'absolute', left: BOX.x + dx, top: BOX.y - 70, transform: `rotate(${rot + 90}deg)`, transformOrigin: '75px 52px' }}>
            <Ssd width={150} />
          </div>
        ))}
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          {/* the box front and its side flaps */}
          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={6} fill="#8a6239" stroke={alpha('#000000', 0.45)} strokeWidth={3} />
          <path d={`M ${BOX.x} ${BOX.y} L ${BOX.x - 70} ${BOX.y - 40} L ${BOX.x - 50} ${BOX.y + 20} Z`} fill="#7a5532" />
          <path d={`M ${BOX.x + BOX.w} ${BOX.y} L ${BOX.x + BOX.w + 70} ${BOX.y - 40} L ${BOX.x + BOX.w + 50} ${BOX.y + 20} Z`} fill="#7a5532" />
          <rect x={BOX.x + BOX.w / 2 - 40} y={BOX.y} width={80} height={BOX.h} fill={alpha('#c9a77c', 0.35)} />
          {/* a blank label on the box */}
          <rect x={BOX.x + 60} y={BOX.y + 120} width={150} height={90} rx={6} fill={alpha('#e8edf5', 0.75)} />
        </svg>
        {BESIDE.map(([x, y, rot]) => (
          <div key={x} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)` }}>
            <Ssd width={130} />
          </div>
        ))}
      </QuestionStill>
    </Stage>
  );
}
