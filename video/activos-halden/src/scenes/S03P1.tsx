import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const DESK_Y = 430;
const DESKS = [200, 980];
/** Code-like bars on a monitor (indent, width), nothing legible. */
const CODE: [number, number][] = [
  [0, 90],
  [16, 120],
  [16, 70],
  [32, 100],
  [32, 60],
  [16, 110],
  [0, 50],
];

/** A desk with two monitors showing code-like bars, a chair seen from behind and a tower under it. */
function Desk({ x, lit }: { x: number; lit: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={DESK_Y} width={520} height={22} rx={6} fill={C.ink700} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
      <rect x={30} y={DESK_Y + 22} width={16} height={H - DESK_Y - 22} fill={C.ink800} />
      <rect x={474} y={DESK_Y + 22} width={16} height={H - DESK_Y - 22} fill={C.ink800} />
      {[70, 280].map((mx) => (
        <g key={mx}>
          <rect x={mx} y={DESK_Y - 190} width={190} height={130} rx={10} fill={C.ink900} stroke={alpha(C.text, 0.35)} strokeWidth={4} />
          {CODE.map(([ind, w], k) => (
            <rect key={k} x={mx + 18 + ind} y={DESK_Y - 172 + k * 15} width={w * 0.9} height={7} rx={3.5} fill={alpha(k % 3 === 1 ? C.violet : C.cyan, 0.25 + 0.25 * lit)} />
          ))}
          <rect x={mx + 85} y={DESK_Y - 60} width={20} height={60} fill={C.ink700} />
        </g>
      ))}
      <rect x={196} y={DESK_Y + 46} width={120} height={130} rx={24} fill={C.ink800} stroke={alpha(C.text, 0.2)} strokeWidth={3} />
      <rect x={400} y={DESK_Y + 40} width={60} height={150} rx={6} fill={C.ink850} stroke={alpha(C.sky, 0.3)} strokeWidth={3} />
      <circle cx={430} cy={DESK_Y + 64} r={5} fill={alpha(C.emerald, 0.6)} />
    </g>
  );
}

/**
 * s03-p1 «Las pruebas de Desarrollo». Exam question 1 is the ENGINE's (ExamQuestionLayer, from s03-01 to the end:
 * scenario, question with «MEJOR», options, countdown, answer on `ok-1`, trap on `trap-1`). The scene is only a still,
 * half-lit, textless background, complete from the first frame and never moving: the Desarrollo office after hours —
 * two desks with their monitors still showing code-like bars, a whiteboard with boxes and lines, a lamp's cone of
 * light — plus the label «pregunta tipo examen · ejemplo» (QuestionStill). The «MEJOR» line is voice-only (the panel
 * covers the stage).
 */
export function S03P1(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="s03-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.ink850} />
              <stop offset="100%" stopColor={C.ink900} />
            </linearGradient>
            <radialGradient id="s03-lamp" cx="0.5" cy="0" r="1">
              <stop offset="0%" stopColor={C.amber} stopOpacity={0.14} />
              <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect x={0} y={20} width={W} height={H - 20} rx={18} fill="url(#s03-wall)" />
          {/* the whiteboard with boxes and lines, no text */}
          <g transform="translate(760 60)">
            <rect x={0} y={0} width={420} height={210} rx={10} fill={alpha(C.text, 0.07)} stroke={alpha(C.muted, 0.45)} strokeWidth={5} />
            {[
              [40, 40],
              [180, 40],
              [320, 40],
              [110, 130],
              [250, 130],
            ].map(([x, y], k) => (
              <rect key={k} x={x} y={y} width={70} height={44} rx={8} fill="none" stroke={alpha(k === 4 ? C.amber : C.sky, 0.5)} strokeWidth={4} />
            ))}
            <path d="M 110 62 L 180 62 M 250 62 L 320 62 M 145 84 L 145 130 M 285 84 L 285 130" stroke={alpha(C.sky, 0.4)} strokeWidth={3} />
          </g>
          {/* the lamp and its cone */}
          <path d="M 1440 20 L 1440 110" stroke={alpha(C.muted, 0.5)} strokeWidth={4} />
          <path d="M 1404 110 L 1476 110 L 1460 86 L 1420 86 Z" fill={C.ink700} stroke={alpha(C.muted, 0.5)} strokeWidth={3} />
          <path d="M 1408 112 L 1250 640 L 1700 640 L 1472 112 Z" fill="url(#s03-lamp)" />
          <rect x={0} y={H - 40} width={W} height={40} fill={alpha(C.ink700, 0.4)} />
          {DESKS.map((x, i) => (
            <Desk key={x} x={x} lit={i === 1 ? 1 : 0.3} />
          ))}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
