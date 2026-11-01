import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { progress } from '../../../engine/src/theme/motion';
import { ANSWER, STRUCK, TRAP } from '../data/s06-p2';
import type { OptionItem } from './parts/OptionStack';
import { LetterStrip } from './parts/LetterStrip';
import { QualifierLine, QuestionBand, QuestionStill } from './parts/QuestionBand';
import { Stage, wordFrame } from './kit';

const S = 's06-p2';

/**
 * s06-p2 «Un primer análisis». Question 2 is the ENGINE's (ExamQuestionLayer); the scene draws the still exam screen and
 * the band under it, like s05-p1:
 *   first   the pill «PRIMERO · FIRST» lands and its gloss writes in on «muchas» (voice, before the countdown)
 *   ok-2    the gloss gives way to the letters A–D; B lights emerald (the asset inventory)
 *   trap-2  C lights amber (listing the threats)
 *   back-2  A («el seguro») and D («la pérdida anual») are struck with a white stroke, in silence
 */
export function S06P2(props: SceneProps) {
  const frame = useCurrentFrame();
  const firstAt = props.cue('first') - 4;
  const glossAt = wordFrame(S, 's06-01', 'muchas') - 6;
  const okAt = props.cue('ok-2') - 2;
  const trapAt = props.cue('trap-2') - 2;
  const backAt = props.cue('back-2') - 2;

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
            q="first"
            at={firstAt}
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
