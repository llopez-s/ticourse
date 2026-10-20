import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { DeskPhone } from './parts/Images';
import { QuestionStill } from './parts/QuestionStill';
import { Stage } from './kit';

/**
 * s04-p1 «Una reparación urgente». Exam question 1 is the ENGINE's (ExamQuestionLayer, from s04-01 to the end:
 * scenario, question with «MEJOR», options, countdown, answer on `ok-1`, trap on `trap-1`). The scene is only a still,
 * dim, textless background, complete from the first frame and never moving: a desk phone on an office table (no
 * name, no number), plus the label «pregunta tipo examen · ejemplo». The «MEJOR» gloss and the letter's line
 * (`letter-back`) are the voice's only: the panel covers the stage.
 */
export function S04P1(_props: SceneProps) {
  return (
    <Stage>
      <QuestionStill>
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
          {/* the table */}
          <path d="M120 470 L1608 470 L1700 600 L28 600 Z" fill={C.ink800} stroke={alpha(C.cyan, 0.25)} strokeWidth={3} />
          {/* a notepad and a pen */}
          <rect x={1160} y={490} width={210} height={70} rx={8} fill={alpha(C.text, 0.12)} />
          <rect x={1400} y={510} width={150} height={10} rx={5} fill={alpha(C.cyan, 0.4)} transform="rotate(-8 1400 510)" />
          {/* a monitor */}
          <rect x={300} y={150} width={360} height={240} rx={14} fill={C.ink900} stroke={alpha(C.cyan, 0.35)} strokeWidth={4} />
          <rect x={460} y={390} width={40} height={60} fill={C.ink700} />
          <rect x={400} y={448} width={160} height={14} rx={7} fill={C.ink700} />
        </svg>
        <div style={{ position: 'absolute', left: 720, top: 268 }}>
          <DeskPhone width={400} />
        </div>
      </QuestionStill>
    </Stage>
  );
}
