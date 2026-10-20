import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { SERVER_RATIO, ServerArt } from './parts/Devices';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const FLOOR_Y = 560;
const SERVER_W = 150;
const N = 7;
const GAP = (W - 160 - N * SERVER_W) / (N - 1);

/**
 * s03-p1 «La aplicación de cobros». Exam question 1 is the ENGINE's (ExamQuestionLayer, from s03-01 to the end:
 * question, «MEJOR», options, countdown, answer on `ok-1`, trap on `trap-1`, then the exam card on `photo`). The scene
 * is only a still, half-lit, textless background, complete from the first frame and never moving: a row of server
 * towers on a raised floor, their lights dim — plus the label «pregunta tipo examen · ejemplo» (QuestionStill). The
 * «MEJOR» line and «esta vez, la central cambia la foto» are said by the voice only (the panel covers the stage).
 */
export function S03P1(_props: SceneProps) {
  const h = SERVER_W * SERVER_RATIO;
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={660} viewBox={`0 0 ${W} 660`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={FLOOR_Y - 20} rx={18} fill={C.ink850} />
          <rect x={0} y={FLOOR_Y} width={W} height={36} fill={alpha(C.ink700, 0.5)} />
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} x1={i * 76} y1={FLOOR_Y} x2={i * 76} y2={FLOOR_Y + 36} stroke={alpha(C.text, 0.12)} strokeWidth={2} />
          ))}
          <line x1={0} y1={FLOOR_Y} x2={W} y2={FLOOR_Y} stroke={alpha(C.text, 0.25)} strokeWidth={3} />
        </svg>
        {Array.from({ length: N }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 80 + i * (SERVER_W + GAP), top: FLOOR_Y - h }}>
            <ServerArt width={SERVER_W} tone={alpha(C.cyan, 0.55)} light={alpha(C.cyan, 0.35)} />
          </div>
        ))}
      </QuestionStill>
    </Stage>
  );
}
