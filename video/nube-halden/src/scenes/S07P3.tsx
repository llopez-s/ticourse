import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { Piece } from './parts/Piece';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const PW = 380;
const PH = 180;
const GAP = 160;
const X0 = (W - (3 * PW + 2 * GAP)) / 2;
const Y = (H - PH) / 2;

/**
 * s07-p3 «Reseñas y pagos». The engine's ExamQuestionLayer draws question 3 (scenario, question with «MEJOR», options,
 * the 5 s countdown, the answer on `ok-3`, the trap on `trap-3`) over this scene from s07-01 to its end, so the scene
 * is only a still, dim, textless background, complete from the first frame: three generic pieces of a delivery app
 * linked by network lines (bars only, no names or data) — plus «pregunta tipo examen · ejemplo · no es del puerto»
 * under the stage. The branch's line and the lit decision of s06 are voice-only (the panel covers the stage).
 */
export function S07P3(_props: SceneProps) {
  const cy = Y + PH / 2;
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          {[0, 1].map((k) => (
            <line key={k} x1={X0 + PW + k * (PW + GAP)} y1={cy} x2={X0 + PW + GAP + k * (PW + GAP)} y2={cy} stroke={alpha(C.sky, 0.55)} strokeWidth={5} strokeDasharray="14 10" />
          ))}
        </svg>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: 'absolute', left: X0 + k * (PW + GAP), top: Y }}>
            <Piece width={PW} height={PH} />
          </div>
        ))}
      </QuestionStill>
    </Stage>
  );
}
