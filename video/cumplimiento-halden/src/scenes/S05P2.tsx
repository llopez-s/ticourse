import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { QuestionFrame, SlotLine, SlotText } from './parts/Question';
import { TenderBoardArt } from './parts/QuestionArt';
import { Stage, wordFrame } from './kit';

const S = 's05-p2';
/** The three columns of s04 in miniature: how many labels each holds (2 + 2 + 1) — the authority's lights. */
const MINI = [2, 2, 1] as const;

/** The three columns of s04 as a small icon, the first one (the authority) lit. */
function MiniColumns({ lit }: { lit: number }) {
  return (
    <svg width={150} height={92} viewBox="0 0 150 92" fill="none" style={{ display: 'block', overflow: 'visible' }}>
      {MINI.map((n, c) => (
        <g key={c}>
          {Array.from({ length: n }).map((_, k) => {
            const on = c === 0 ? lit : 0;
            return (
              <rect
                key={k}
                x={c * 52}
                y={k * 44}
                width={42}
                height={36}
                rx={8}
                fill={alpha(c === 0 ? C.cyan : C.sky, 0.08 + 0.22 * on)}
                stroke={alpha(c === 0 ? C.cyan : C.sky, 0.3 + 0.65 * on)}
                strokeWidth={3.5}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/**
 * s05-p2 «Fuera de los concursos». The engine's ExamQuestionLayer draws question 2 (no qualifier, on purpose: the
 * scenario closes the other three) over this scene from s05-01 to its end, so the stage is a still, dim, textless
 * background — a tender board with a prohibition stamp over it, no company, no name — plus «pregunta tipo examen ·
 * ejemplo» bottom right. On `regulator` s04's three columns come back in miniature with the authority's lit, and the
 * line «la impone el regulador, no un cliente» (the voice says «aquí es el regulador»).
 */
export function S05P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const regAt = props.cue('regulator');
  const reguladorAt = Math.max(regAt, wordFrame(S, 's05-04', 'regulador') - 8);
  const lineIn = progress(frame, regAt - 2, 14);
  const lit = progress(frame, regAt + 6, 14);
  const clientIn = progress(frame, reguladorAt + 6, 12);

  return (
    <Stage>
      <QuestionFrame>
        <TenderBoardArt />
      </QuestionFrame>

      <SlotLine opacity={lineIn} dy={(1 - lineIn) * 14}>
        <MiniColumns lit={lit} />
        <SlotText size={40}>
          <span>la impone </span>
          <span style={{ color: C.cyanSoft }}>el regulador</span>
          <span style={{ fontFamily: FONT.sans, color: alpha('#ffffff', 0.55 + 0.45 * clientIn) }}>, no un cliente</span>
        </SlotText>
      </SlotLine>
    </Stage>
  );
}
