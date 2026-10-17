import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { PHONE_RATIO, PhoneArt } from './parts/Devices';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

const W = 1728;
const H = 660;
const DESK_Y = 430;
const WINDOW = { x: 520, y: 50, w: 690, h: 260 } as const;
const PHONE_W = 120;

/**
 * s05-p2 «Los móviles de los capataces». The engine's ExamQuestionLayer draws question 2 (scenario, options,
 * countdown, answer on `ok-2`, trap on `trap-2`, then the exam card on `remote`) over this scene from s05-01 to its
 * end, so the scene is only a still, dim, textless background, complete from the first frame: the inside of the dock
 * foreman's hut — a window onto the water with a mooring bollard on the quay (no cranes, no containers), a desk, and on
 * it a company phone lying screen-up, dark, beside a mug and a blank clipboard. Plus the label «pregunta tipo examen ·
 * ejemplo» (QuestionStill). «El móvil solo obedece a su mando» is said by the voice only.
 */
export function S05P2(_props: SceneProps) {
  const phoneH = PHONE_W * PHONE_RATIO;
  return (
    <Stage>
      <QuestionStill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="s05-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.ink850} />
              <stop offset="100%" stopColor={C.ink900} />
            </linearGradient>
            <linearGradient id="s05-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b3358" />
              <stop offset="100%" stopColor="#2c4c78" />
            </linearGradient>
          </defs>
          {/* the hut's wall */}
          <rect x={0} y={20} width={W} height={DESK_Y - 20} rx={18} fill="url(#s05-wall)" />
          {/* the window: sky, water, the quay's edge and a bollard */}
          <g transform={`translate(${WINDOW.x} ${WINDOW.y})`}>
            <rect x={0} y={0} width={WINDOW.w} height={WINDOW.h} rx={8} fill="url(#s05-sky)" stroke={alpha(C.muted, 0.45)} strokeWidth={6} />
            <rect x={3} y={150} width={WINDOW.w - 6} height={WINDOW.h - 153} fill="#16365a" />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M ${30 + i * 160} ${182 + (i % 2) * 22} q 24 -8 48 0 t 48 0`} fill="none" stroke={alpha(C.sky, 0.5)} strokeWidth={3} strokeLinecap="round" />
            ))}
            <rect x={3} y={226} width={WINDOW.w - 6} height={31} fill={alpha(C.ink700, 0.9)} />
            <rect x={480} y={196} width={34} height={32} rx={6} fill={C.ink800} stroke={alpha(C.text, 0.45)} strokeWidth={3} />
            <rect x={472} y={190} width={50} height={12} rx={5} fill={C.ink800} stroke={alpha(C.text, 0.45)} strokeWidth={3} />
            <line x1={WINDOW.w / 2} y1={0} x2={WINDOW.w / 2} y2={WINDOW.h} stroke={alpha(C.muted, 0.4)} strokeWidth={5} />
          </g>
          {/* the desk */}
          <rect x={160} y={DESK_Y} width={W - 320} height={24} rx={6} fill={C.ink700} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
          <rect x={200} y={DESK_Y + 24} width={18} height={H - DESK_Y - 24} fill={C.ink800} />
          <rect x={W - 218} y={DESK_Y + 24} width={18} height={H - DESK_Y - 24} fill={C.ink800} />
          {/* a mug and a blank clipboard */}
          <rect x={560} y={DESK_Y - 70} width={58} height={70} rx={8} fill={C.ink800} stroke={alpha(C.text, 0.4)} strokeWidth={3} />
          <path d={`M 618 ${DESK_Y - 56} q 26 6 0 34`} fill="none" stroke={alpha(C.text, 0.4)} strokeWidth={4} />
          <g transform={`translate(1040 ${DESK_Y - 22}) rotate(-6)`}>
            <rect x={0} y={0} width={200} height={20} rx={4} fill={alpha('#cbd5e1', 0.35)} stroke={alpha(C.text, 0.3)} strokeWidth={2} />
            <rect x={80} y={-6} width={40} height={10} rx={3} fill={alpha(C.text, 0.4)} />
          </g>
        </svg>
        {/* the company phone, lying on the desk, screen dark */}
        <div style={{ position: 'absolute', left: 800, top: DESK_Y - PHONE_W / 2 - phoneH / 2 - 2, transform: 'rotate(-90deg)', transformOrigin: `${PHONE_W / 2}px ${phoneH / 2}px` }}>
          <PhoneArt width={PHONE_W} tone={alpha(C.cyan, 0.7)} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
