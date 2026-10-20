import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { FunctionBlock } from './parts/FunctionBlock';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const SIZE = 300;

/**
 * s05-p2 «Un aviso en una función». The engine's ExamQuestionLayer draws question 2 (scenario, question, options, the
 * 5 s countdown, the answer on `ok-2`, the trap on `trap-2`) over this scene from s05-01 to its end, so the scene is
 * only a still, dim, textless background, complete from the first frame: a generic function (the bolt block) with an
 * amber warning, no name, provider or data — plus «pregunta tipo examen · ejemplo · no es del puerto» under the stage.
 * The bike's line and the lit strip of s04 are voice-only (the panel covers the stage).
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <circle cx={W / 2} cy={H / 2} r={300} fill={alpha(C.sky, 0.05)} />
          <rect x={W / 2 - 330} y={H / 2 - 250} width={660} height={500} rx={40} fill="none" stroke={alpha(C.sky, 0.3)} strokeWidth={3} strokeDasharray="14 12" />
        </svg>
        <div style={{ position: 'absolute', left: (W - SIZE) / 2, top: (H - SIZE) / 2 }}>
          <FunctionBlock size={SIZE} warn={1} glow={0.3} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
