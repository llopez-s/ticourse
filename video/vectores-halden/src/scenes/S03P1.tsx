import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const SHEET = { x: 484, y: 40, w: 760, h: 580 } as const;
const ROW_Y = [176, 282, 388, 494];
const BAR_W = [[380, 260], [420, 200], [340, 280], [450, 230]];

/**
 * s03-p1 «Cuatro peticiones de Comercial». The engine's ExamQuestionLayer draws question 1 (scenario, question, the
 * four changes as options, the 7 s countdown, the answer on `ok-1`, the trap on `trap-1`, then the exam card on
 * `zipper`) over this scene from s03-01 to its end, so the scene is only a still, dim, textless background, complete
 * from the first frame: a request sheet on a clipboard with four rows — a box and two grey bars each, nothing readable
 * — plus «pregunta tipo examen · ejemplo» under the stage. The backpack's line in the resolution is the voice's only.
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          {/* the clipboard */}
          <rect x={SHEET.x - 30} y={SHEET.y - 10} width={SHEET.w + 60} height={SHEET.h + 20} rx={22} fill="#3a2f24" stroke="#5a4733" strokeWidth={4} />
          <rect x={SHEET.x} y={SHEET.y + 20} width={SHEET.w} height={SHEET.h - 30} rx={8} fill="#d9d4c7" />
          <rect x={SHEET.x + SHEET.w / 2 - 90} y={SHEET.y - 24} width={180} height={50} rx={10} fill="#8a95a8" stroke="#cbd5e1" strokeWidth={3} />
          {/* heading bars */}
          <rect x={SHEET.x + 50} y={SHEET.y + 66} width={300} height={22} rx={8} fill={alpha('#1e293b', 0.55)} />
          <rect x={SHEET.x + 50} y={SHEET.y + 102} width={200} height={14} rx={7} fill={alpha('#1e293b', 0.3)} />
          {ROW_Y.map((y, i) => (
            <g key={y}>
              <rect x={SHEET.x + 50} y={SHEET.y + y - 16} width={44} height={44} rx={8} fill="none" stroke={alpha('#1e293b', 0.6)} strokeWidth={4} />
              <rect x={SHEET.x + 120} y={SHEET.y + y - 10} width={BAR_W[i][0]} height={16} rx={8} fill={alpha('#1e293b', 0.45)} />
              <rect x={SHEET.x + 120} y={SHEET.y + y + 16} width={BAR_W[i][1]} height={12} rx={6} fill={alpha('#1e293b', 0.25)} />
            </g>
          ))}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
