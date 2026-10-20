import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { Pendrive } from './parts/Pendrive';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const DESK_Y = 380;
const PHONE = { x: 560, y: 210, w: 150, h: 250 } as const;

/**
 * s05-p2 «El curso de formación». The engine's ExamQuestionLayer draws question 2 (scenario, «MEJOR», options, the 5 s
 * countdown, the answer on `ok-2`, the trap on `trap-2`) over this scene from s05-01 to its end, so the scene is only a
 * still, dim, textless background, complete from the first frame, with no place: a desk top with a phone lying face up
 * (screen lit, no text) and a pendrive without a sticker beside it. Plus «pregunta tipo examen · ejemplo · no es del
 * puerto» under the stage. The «MEJOR: …» line is voice-only, as in V31 and V33 (the panel covers the stage).
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          {/* the desk top in perspective */}
          <path d={`M 120 ${DESK_Y - 220} L 1608 ${DESK_Y - 220} L 1708 ${H - 40} L 20 ${H - 40} Z`} fill="#2a2420" stroke="#40362e" strokeWidth={4} />
          <path d={`M 120 ${DESK_Y - 220} L 1608 ${DESK_Y - 220}`} stroke={alpha('#ffffff', 0.08)} strokeWidth={6} />
          {/* the phone, face up, its screen lit with no text */}
          <g transform={`rotate(-8 ${PHONE.x + PHONE.w / 2} ${PHONE.y + PHONE.h / 2})`}>
            <rect x={PHONE.x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={24} fill={C.ink800} stroke={alpha(C.text, 0.45)} strokeWidth={4} />
            <rect x={PHONE.x + 12} y={PHONE.y + 24} width={PHONE.w - 24} height={PHONE.h - 52} rx={10} fill={alpha(C.cyan, 0.18)} />
            <rect x={PHONE.x + 26} y={PHONE.y + 50} width={98} height={40} rx={10} fill={alpha(C.text, 0.3)} />
            <rect x={PHONE.x + PHONE.w / 2 - 18} y={PHONE.y + 9} width={36} height={6} rx={3} fill={alpha(C.text, 0.35)} />
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 900, top: 300, transform: 'rotate(12deg)' }}>
          <Pendrive width={300} sticker={false} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
