import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { progress } from '../../../engine/src/theme/motion';
import { ANSWER, STRUCK, TRAP } from '../data/s05-p1';
import type { OptionItem } from './parts/OptionStack';
import { LetterStrip } from './parts/LetterStrip';
import { QualifierLine, QuestionBand, QuestionStill } from './parts/QuestionBand';
import { Stage, wordFrame } from './kit';

const S = 's05-p1';

/**
 * s05-p1 «Doce aplicaciones» — the TEMPLATE for the question scenes (s06, s08, s09, s11; see parts/QuestionBand.tsx).
 * Exam question 1 is the ENGINE's (ExamQuestionLayer, from s05-01 to the end of the scene: badge, scenario, question,
 * options, countdown, answer on `ok-1`, trap on `trap-1`, then the exam card on `back-1`). It covers the stage under an
 * 86 % dim, so the scene only draws a still blank exam screen and ONE band under the stage (stage-local y 668–720):
 *   best    the qualifier pill «MEJOR · BEST» lands and its gloss writes in on «varias» (voice, before the countdown)
 *   ok-1    the gloss gives way to the letters A–D; D lights emerald (the answer)
 *   trap-1  A lights amber (the trap)
 *   back-1  B and C are struck with a white stroke (they solve neither the passwords nor the closing of accounts),
 *           in silence: the voice says nothing about it
 * The tag «pregunta tipo examen · ejemplo» is fixed at the right of the band from the first frame.
 */
export function S05P1(props: SceneProps) {
  const frame = useCurrentFrame();
  const bestAt = props.cue('best') - 4;
  const glossAt = wordFrame(S, 's05-01', 'varias') - 6;
  const okAt = props.cue('ok-1') - 2;
  const trapAt = props.cue('trap-1') - 2;
  const backAt = props.cue('back-1') - 2;

  const stripIn = progress(frame, okAt, 14);
  const items: OptionItem[] = [0, 1, 2, 3].map((i) => {
    if (i === ANSWER) return { state: 'ok', on: progress(frame, okAt + 6, 12) };
    if (i === TRAP) return { state: 'trap', on: progress(frame, trapAt + 4, 12) };
    const k = (STRUCK as readonly number[]).indexOf(i);
    return { strike: k >= 0 ? progress(frame, backAt + k * 10, 18) : 0 };
  });

  return (
    <Stage>
      <QuestionStill>
        <QuestionBand>
          <QualifierLine
            q="best"
            at={bestAt}
            glossAt={glossAt}
            glossOut={stripIn}
            trail={
              <div style={{ opacity: stripIn, transform: `translateX(${(1 - stripIn) * 14}px)` }}>
                <LetterStrip items={items} />
              </div>
            }
          />
        </QuestionBand>
      </QuestionStill>
    </Stage>
  );
}
