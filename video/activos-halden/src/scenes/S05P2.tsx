import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const DOOR = { x: 704, y: 150, w: 320, h: 470 } as const;
const SIGN = { x: 654, y: 54, w: 420, h: 72 } as const;
/** The door's sign: the only text in this background. */
const SIGN_TEXT = 'servicio médico';

/**
 * s05-p2 «El servidor del servicio médico». The engine's ExamQuestionLayer draws question 2 (scenario, question,
 * options, countdown, answer on `ok-2`, trap on `trap-2`, then the exam card) over this scene from s05-01 to its end,
 * so the scene is only a still, dim background, complete from the first frame: a corridor with a closed door and its
 * sign «servicio médico» (a plain cross, no person, no equipment), a bench against the wall — plus the label
 * «pregunta tipo examen · ejemplo» (QuestionStill). The suitcase callback is voice-only.
 */
export function S05P2(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="s05-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.ink850} />
              <stop offset="100%" stopColor={C.ink900} />
            </linearGradient>
          </defs>
          <rect x={0} y={20} width={W} height={H - 20} rx={18} fill="url(#s05-wall)" />
          {/* skirting and floor */}
          <rect x={0} y={DOOR.y + DOOR.h} width={W} height={H - DOOR.y - DOOR.h} fill={alpha(C.ink700, 0.5)} />
          <rect x={0} y={DOOR.y + DOOR.h - 14} width={W} height={14} fill={alpha(C.ink600, 0.6)} />
          {/* the door */}
          <rect x={DOOR.x - 16} y={DOOR.y - 16} width={DOOR.w + 32} height={DOOR.h + 16} rx={6} fill={C.ink700} stroke={alpha(C.muted, 0.4)} strokeWidth={3} />
          <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={4} fill={C.ink800} stroke={alpha(C.text, 0.3)} strokeWidth={3} />
          <rect x={DOOR.x + 40} y={DOOR.y + 40} width={DOOR.w - 80} height={150} rx={6} fill="none" stroke={alpha(C.text, 0.15)} strokeWidth={3} />
          <rect x={DOOR.x + 40} y={DOOR.y + 230} width={DOOR.w - 80} height={190} rx={6} fill="none" stroke={alpha(C.text, 0.15)} strokeWidth={3} />
          <rect x={DOOR.x + DOOR.w - 56} y={DOOR.y + 236} width={34} height={12} rx={6} fill={alpha(C.text, 0.55)} />
          {/* the sign */}
          <rect x={SIGN.x} y={SIGN.y} width={SIGN.w} height={SIGN.h} rx={12} fill={C.ink900} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
          <g transform={`translate(${SIGN.x + 46} ${SIGN.y + SIGN.h / 2})`}>
            <rect x={-8} y={-22} width={16} height={44} rx={3} fill={C.emerald} />
            <rect x={-22} y={-8} width={44} height={16} rx={3} fill={C.emerald} />
          </g>
          <text x={SIGN.x + 90} y={SIGN.y + 48} fontFamily={FONT.sans} fontSize={36} fontWeight={800} fill={C.textStrong}>
            {SIGN_TEXT}
          </text>
          {/* a bench against the wall and a plant */}
          <g transform="translate(160 470)">
            <rect x={0} y={0} width={360} height={24} rx={6} fill={C.ink700} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
            <rect x={24} y={24} width={14} height={60} fill={C.ink800} />
            <rect x={322} y={24} width={14} height={60} fill={C.ink800} />
          </g>
          <g transform="translate(1260 420)">
            <rect x={0} y={90} width={90} height={110} rx={10} fill={C.ink700} />
            <path d="M 45 92 Q 0 40 10 0 M 45 92 Q 50 30 70 -10 M 45 92 Q 90 50 96 20" stroke={alpha(C.emerald, 0.45)} strokeWidth={8} fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </QuestionStill>
    </Stage>
  );
}
