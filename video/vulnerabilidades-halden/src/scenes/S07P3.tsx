import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { PHONE, Phone } from './parts/Phone';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const PHONE_W = 300;
const PHONE_H = (PHONE_W * PHONE.h) / PHONE.w;

/**
 * s07-p3 «Una app que llega por mensaje». The engine's ExamQuestionLayer draws question 3 (scenario, question, options,
 * the 5 s countdown, the answer on `ok-3`, the trap on `trap-3`) over this scene from s07-01 to its end, so the scene is
 * only a still, dim, textless background, complete from the first frame: a phone in schematic (no brand, no app names)
 * with a message notification drawn as bars — plus «pregunta tipo examen · ejemplo» under the stage. The concert's
 * line is voice-only.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <circle cx={W / 2} cy={H / 2} r={330} fill={alpha(C.cyan, 0.04)} />
        </svg>
        <div style={{ position: 'absolute', left: (W - PHONE_W) / 2, top: (H - PHONE_H) / 2 }}>
          <Phone width={PHONE_W} notice={1} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
