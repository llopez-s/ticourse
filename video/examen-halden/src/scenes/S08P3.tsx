import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { ANSWER, COMPARE, STRUCK, TRAP, TRAP_TAG } from '../data/s08-p3';
import type { OptionItem } from './parts/OptionStack';
import { LetterStrip } from './parts/LetterStrip';
import { BandChip, NotEqualMark, QualifierLineFit } from './parts/BandExtras';
import { QuestionBand, QuestionStill } from './parts/QuestionBand';
import { Stage, wordFrame } from './kit';

const S = 's08-p3';

/**
 * s08-p3 «Una academia pequeña». Question 3 is the ENGINE's; the scene draws the still exam screen and the band:
 *   likely  the pill «MÁS probable · MOST likely» lands and its gloss «lo que pasa casi siempre» writes in on «sino»
 *   ok-3    the gloss gives way to the letters; A lights emerald (phishing) and the pill's English half folds away to
 *           make room (the Spanish word stays highlighted)
 *   trap-3  B lights amber (the zero-day) and the chip «caro y raro» lands on «caro»
 *   back-3  C and D are struck in silence; the chip gives way to «probable ≠ posible» (on those two words of the voice)
 *           and the pill folds away just before, to make room
 */
export function S08P3(props: SceneProps) {
  const frame = useCurrentFrame();
  const likelyAt = props.cue('likely') - 4;
  const glossAt = wordFrame(S, 's08-01', 'sino') - 4;
  const okAt = props.cue('ok-3') - 2;
  const trapAt = props.cue('trap-3') - 2;
  const backAt = props.cue('back-3') - 2;
  const caroAt = wordFrame(S, 's08-02', 'caro') - 8;
  const likelyWordAt = wordFrame(S, 's08-03', 'probable') - 6;
  const possibleAt = wordFrame(S, 's08-03', 'posible') - 6;

  const stripIn = progress(frame, okAt, 14);
  const collapse = progress(frame, okAt, 16);
  const fold = progress(frame, likelyWordAt - 16, 16);
  const items: OptionItem[] = [0, 1, 2, 3].map((i) => {
    if (i === ANSWER) return { state: 'ok', on: progress(frame, okAt + 6, 12) };
    if (i === TRAP) return { state: 'trap', on: progress(frame, trapAt + 4, 12) };
    const k = (STRUCK as readonly number[]).indexOf(i);
    return { strike: k >= 0 ? progress(frame, backAt + k * 10, 18) : 0 };
  });

  const caro = progress(frame, caroAt, 12) * (1 - progress(frame, backAt, 10));
  const likelyOn = progress(frame, likelyWordAt, 12);
  const possibleOn = progress(frame, possibleAt, 12);

  return (
    <Stage>
      <QuestionStill>
        <QuestionBand>
          <QualifierLineFit
            q="likely"
            at={likelyAt}
            glossAt={glossAt}
            glossOut={stripIn}
            collapse={collapse}
            fold={fold}
            pillWidth={420}
            enWidth={250}
            trail={
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ opacity: stripIn, transform: `translateX(${(1 - stripIn) * 14}px)` }}>
                  <LetterStrip items={items} w={96} gap={10} />
                </div>
                <div style={{ display: 'grid', alignItems: 'center' }}>
                  <div style={{ gridArea: '1 / 1' }}>{caro > 0.01 ? <BandChip text={TRAP_TAG} tone="amber" on={caro} icon="alert" /> : null}</div>
                  <div style={{ gridArea: '1 / 1', display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans }}>
                    {likelyOn > 0.01 ? <BandChip text={COMPARE.likely} tone="emerald" on={likelyOn} /> : null}
                    {likelyOn > 0.01 ? (
                      <div style={{ opacity: Math.min(likelyOn, 1), display: 'flex' }}>
                        <NotEqualMark color={C.textStrong} />
                      </div>
                    ) : null}
                    {possibleOn > 0.01 ? <BandChip text={COMPARE.possible} tone="amber" on={possibleOn} /> : null}
                  </div>
                </div>
              </div>
            }
          />
        </QuestionBand>
      </QuestionStill>
    </Stage>
  );
}
