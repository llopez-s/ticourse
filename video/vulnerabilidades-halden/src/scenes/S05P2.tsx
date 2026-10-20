import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { BlankDoc, CLOUD, CloudShape } from './parts/Cloud';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const CLOUD_W = 900;
const CLOUD_H = (CLOUD_W * CLOUD.h) / CLOUD.w;
/** Documents inside the cloud (cloud units): no names, no text. */
const DOCS: [number, number, number][] = [
  [118, 104, 0.95],
  [186, 92, 1.05],
  [258, 110, 0.9],
];

/**
 * s05-p2 «Lo que no vuelve». The engine's ExamQuestionLayer draws question 2 (scenario, question, options, the 5 s
 * countdown, the answer on `ok-2`, the trap on `trap-2`; the exam card on `door-back` is in the top band) over this
 * scene from s05-01 to its end, so the scene is only a still, dim, textless background, complete from the first frame:
 * a cloud in outline (no provider) with a few blank documents inside — plus «pregunta tipo examen · ejemplo» under the
 * stage. The street door's line is voice-only.
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <circle cx={W / 2} cy={H / 2} r={420} fill={alpha(C.sky, 0.04)} />
        </svg>
        <div style={{ position: 'absolute', left: (W - CLOUD_W) / 2, top: (H - CLOUD_H) / 2 }}>
          <CloudShape width={CLOUD_W} strips={false}>
            {DOCS.map(([x, y, s]) => (
              <BlankDoc key={x} x={x} y={y} s={s} />
            ))}
          </CloudShape>
        </div>
      </QuestionStill>
    </Stage>
  );
}
