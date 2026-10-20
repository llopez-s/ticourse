import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
/** The version graph: a main line of dots and a short branch that rejoins it. */
const MAIN_Y = 470;
const DOTS = [260, 420, 580, 740, 900, 1060, 1220, 1380, 1540];

/** A stack of sheets (a repository's files) with unreadable bars, no names. */
function Sheets({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[2, 1, 0].map((k) => (
        <g key={k} transform={`translate(${x + k * 22} ${y - k * 22})`}>
          <rect width={250} height={300} rx={14} fill={C.ink850} stroke={alpha(C.cyan, 0.35 + 0.15 * (2 - k))} strokeWidth={3} />
          {k === 0
            ? [0, 1, 2, 3, 4, 5].map((r) => <rect key={r} x={28} y={40 + r * 40} width={r % 3 === 1 ? 140 : 190} height={12} rx={6} fill={alpha(C.muted, 0.25)} />)
            : null}
        </g>
      ))}
    </g>
  );
}

/**
 * s03-p1 «Una hora en el repositorio». The engine's ExamQuestionLayer draws question 1 (scenario, question with
 * «MEJOR», options, the 5 s countdown, the answer on `ok-1`, the trap on `trap-1`) over this scene from s03-01 to its
 * end, so the scene is only a still, dim, textless background, complete from the first frame: a generic repository
 * (a stack of files and a version graph, no name, nothing readable) — plus «pregunta tipo examen · ejemplo · no es del
 * puerto» under the stage. The «MEJOR: …» gloss and the post-it's line are voice-only (the panel covers the stage).
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill outside>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
          <Sheets x={180} y={120} />
          <line x1={DOTS[0]} y1={MAIN_Y} x2={DOTS[DOTS.length - 1]} y2={MAIN_Y} stroke={alpha(C.cyan, 0.4)} strokeWidth={5} />
          <path d={`M ${DOTS[3]} ${MAIN_Y} C ${DOTS[3] + 60} ${MAIN_Y - 120}, ${DOTS[5] - 60} ${MAIN_Y - 120}, ${DOTS[5]} ${MAIN_Y - 110}`} fill="none" stroke={alpha(C.sky, 0.4)} strokeWidth={5} />
          <path d={`M ${DOTS[5]} ${MAIN_Y - 110} C ${DOTS[6]} ${MAIN_Y - 110}, ${DOTS[6]} ${MAIN_Y}, ${DOTS[7]} ${MAIN_Y}`} fill="none" stroke={alpha(C.sky, 0.4)} strokeWidth={5} />
          <circle cx={DOTS[5]} cy={MAIN_Y - 110} r={16} fill={C.ink850} stroke={alpha(C.sky, 0.6)} strokeWidth={5} />
          {DOTS.map((x) => (
            <circle key={x} cx={x} cy={MAIN_Y} r={18} fill={C.ink850} stroke={alpha(C.cyan, 0.6)} strokeWidth={5} />
          ))}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
