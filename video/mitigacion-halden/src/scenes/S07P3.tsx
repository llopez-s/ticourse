import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Server } from './parts/Server';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const FLOOR_Y = 540;

/**
 * s07-p3 «El servidor de bases de datos». The engine's ExamQuestionLayer draws question 3 (scenario, question, options,
 * the 5 s countdown, the answer on `ok-3`, the trap on `trap-3`, then the exam card on `gym-back`) over this scene from
 * s07-01 to its end, so the scene is only a still, dim, textless background, complete from the first frame: a small
 * nameless server room — a raised floor, cable trays, two plain racks and, between them, the database server (a
 * cylinder on its front). Plus «pregunta tipo examen · ejemplo · no es del puerto» under the stage. The gym line and
 * the intranet server of question 1 are the voice's only.
 */
export function S07P3(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <rect x={0} y={FLOOR_Y} width={W} height={H - 20 - FLOOR_Y} fill={C.ink850} />
          {Array.from({ length: 12 }, (_, k) => (
            <line key={k} x1={k * 150} y1={FLOOR_Y} x2={k * 150 - 60} y2={H - 20} stroke={alpha(C.sky, 0.12)} strokeWidth={3} />
          ))}
          {/* cable tray overhead */}
          <rect x={0} y={60} width={W} height={18} fill={C.ink800} stroke={alpha(C.sky, 0.25)} strokeWidth={2} />
          {[0, 1, 2, 3, 4].map((k) => (
            <path key={k} d={`M ${200 + k * 300} 78 q 30 60 0 110`} fill="none" stroke={alpha(C.sky, 0.25)} strokeWidth={5} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 430, top: 200 }}>
          <Server width={190} on={0.5} frame={0} />
        </div>
        <div style={{ position: 'absolute', left: 760, top: 150 }}>
          <Server width={230} db frame={0} />
        </div>
        <div style={{ position: 'absolute', left: 1130, top: 200 }}>
          <Server width={190} on={0.5} frame={0} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
