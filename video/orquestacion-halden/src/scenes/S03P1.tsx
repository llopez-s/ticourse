import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const DESK_Y = 440;
const WINDOW = { x: 120, y: 70, w: 520, h: 250 } as const;
const DESKS = [760, 1220];
const BLOCKS: [number, number, number, number][] = [
  [30, 150, 70, 100],
  [120, 110, 60, 140],
  [200, 170, 90, 80],
  [320, 90, 70, 160],
  [410, 140, 80, 110],
];
const BOXES: [number, number, number][] = [
  [790, 90, 60],
  [900, 80, 44],
  [1010, 100, 70],
  [1240, 110, 52],
  [1380, 70, 64],
  [1470, 90, 40],
];

/** A desk with its monitor off and a chair seen from behind (x of the desk's left edge). */
function Desk({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={0} y={DESK_Y} width={380} height={22} rx={6} fill={C.ink700} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
      <rect x={24} y={DESK_Y + 22} width={16} height={H - DESK_Y - 22} fill={C.ink800} />
      <rect x={340} y={DESK_Y + 22} width={16} height={H - DESK_Y - 22} fill={C.ink800} />
      <rect x={110} y={DESK_Y - 170} width={220} height={140} rx={10} fill={C.ink900} stroke={alpha(C.text, 0.35)} strokeWidth={4} />
      <path d={`M 130 ${DESK_Y - 150} L 190 ${DESK_Y - 150} L 140 ${DESK_Y - 60} Z`} fill={alpha(C.cyan, 0.08)} />
      <rect x={210} y={DESK_Y - 30} width={20} height={30} fill={C.ink700} />
      <rect x={176} y={DESK_Y - 8} width={88} height={8} rx={3} fill={C.ink700} />
      <rect x={150} y={DESK_Y + 40} width={110} height={120} rx={22} fill={C.ink800} stroke={alpha(C.text, 0.2)} strokeWidth={3} />
    </g>
  );
}

/**
 * s03-p1 «El primer día de alguien». Exam question 1 is the ENGINE's (ExamQuestionLayer, from s03-01 to the end:
 * scenario, question with «MEJOR», options, countdown, answer on `ok-1`, trap on `trap-1`, then the exam card on
 * `flow`). The scene is only a still, half-lit, textless background, complete from the first frame and never moving:
 * the Systems office after hours — a window onto the night city, two desks with their monitors off, a shelf with
 * boxes — plus the label «pregunta tipo examen · ejemplo» (QuestionStill). The «MEJOR: …» line is voice-only.
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
            <linearGradient id="s03-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b1730" />
              <stop offset="100%" stopColor="#1a3153" />
            </linearGradient>
          </defs>
          <rect x={0} y={20} width={W} height={H - 20} rx={18} fill="url(#s03-wall)" />
          {/* the window onto the city at night */}
          <g transform={`translate(${WINDOW.x} ${WINDOW.y})`}>
            <rect x={0} y={0} width={WINDOW.w} height={WINDOW.h} rx={8} fill="url(#s03-sky)" stroke={alpha(C.muted, 0.45)} strokeWidth={6} />
            {BLOCKS.map(([x, y, w, h], i) => (
              <g key={i}>
                <rect x={x} y={y} width={w} height={h - 3} fill={alpha(C.ink950, 0.85)} />
                {Array.from({ length: 4 }, (_, k) => (
                  <rect key={k} x={x + 10 + (k % 2) * 28} y={y + 14 + Math.floor(k / 2) * 30} width={12} height={10} fill={alpha(k === i % 4 ? C.amber : C.cyan, 0.45)} />
                ))}
              </g>
            ))}
            <line x1={WINDOW.w / 2} y1={0} x2={WINDOW.w / 2} y2={WINDOW.h} stroke={alpha(C.muted, 0.4)} strokeWidth={5} />
          </g>
          {/* a shelf with boxes */}
          <rect x={760} y={130} width={820} height={12} rx={4} fill={C.ink700} />
          {BOXES.map(([x, w, h]) => (
            <rect key={x} x={x} y={130 - h} width={w} height={h} rx={4} fill={C.ink800} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
          ))}
          <rect x={0} y={H - 40} width={W} height={40} fill={alpha(C.ink700, 0.4)} />
          {DESKS.map((x) => (
            <Desk key={x} x={x} />
          ))}
        </svg>
      </QuestionStill>
    </Stage>
  );
}
