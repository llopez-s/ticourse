import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { ANSWER, HURRY, STATEMENT, STRUCK, TRAP, TRAP_TAG } from '../data/s09-p4';
import type { OptionItem } from './parts/OptionStack';
import { LetterStrip } from './parts/LetterStrip';
import { BandChip, QualifierLineFit, UTurnArrow } from './parts/BandExtras';
import { BAND, QuestionBand, QuestionStill } from './parts/QuestionBand';
import { Stage, wordFrame } from './kit';

const S = 's09-p4';

/**
 * s09-p4 «Un gusano en la oficina». Question 4 is the ENGINE's; the scene draws the still exam screen and the band:
 *   least   the pill «MENOS · LEAST» lands in ROSE with a U-turn arrow drawn after it (the question goes the other way)
 *           and its gloss «la pregunta va al revés» writes in on «pregunta»
 *   «dos»   «Léela dos veces»: the gloss gives way to the statement coming back, with «MENOS» underlined on «veces»
 *   ok-4    the statement gives way to the letters; D lights emerald (the firewall only towards the internet); the pill's
 *           English half and the arrow fold away to make room
 *   trap-4  C lights amber (splitting into VLANs) and the chip «la medida de libro» lands on «tienta»
 *   back-4  A and B are struck in silence; the chip gives way to «con prisa se marca la mejor» on «prisa»
 *           and the pill folds away just before, to make room
 */
export function S09P4(props: SceneProps) {
  const frame = useCurrentFrame();
  const leastAt = props.cue('least') - 4;
  const glossAt = wordFrame(S, 's09-01', 'pregunta') - 4;
  const rereadAt = wordFrame(S, 's09-01', 'dos') - 8;
  const underlineAt = wordFrame(S, 's09-01', 'veces') - 6;
  const okAt = props.cue('ok-4') - 2;
  const trapAt = props.cue('trap-4') - 2;
  const backAt = props.cue('back-4') - 2;
  const tagAt = wordFrame(S, 's09-02', 'tienta') - 6;
  const hurryAt = wordFrame(S, 's09-03', 'prisa') - 8;

  const stripIn = progress(frame, okAt, 14);
  const collapse = progress(frame, okAt, 16);
  const fold = progress(frame, hurryAt - 16, 16);
  const reread = progress(frame, rereadAt, 14) * (1 - stripIn);
  const underline = progress(frame, underlineAt, 16);
  const arrow = progress(frame, leastAt + 6, 22);
  const items: OptionItem[] = [0, 1, 2, 3].map((i) => {
    if (i === ANSWER) return { state: 'ok', on: progress(frame, okAt + 6, 12) };
    if (i === TRAP) return { state: 'trap', on: progress(frame, trapAt + 4, 12) };
    const k = (STRUCK as readonly number[]).indexOf(i);
    return { strike: k >= 0 ? progress(frame, backAt + k * 10, 18) : 0 };
  });

  const tag = progress(frame, tagAt, 12) * (1 - progress(frame, backAt, 10));
  const hurry = progress(frame, hurryAt, 12);

  return (
    <Stage>
      <QuestionStill>
        <QuestionBand>
          <QualifierLineFit
            q="least"
            at={leastAt}
            glossAt={glossAt}
            glossOut={progress(frame, rereadAt, 14)}
            collapse={collapse}
            fold={fold}
            pillWidth={420}
            enWidth={170}
            addon={<UTurnArrow p={arrow} />}
            trail={
              <div style={{ display: 'grid', alignItems: 'center', height: BAND.height }}>
                {/* The statement coming back, «MENOS» underlined */}
                <div
                  style={{
                    gridArea: '1 / 1',
                    opacity: reread,
                    transform: `translateX(${(1 - reread) * -10}px)`,
                    fontFamily: FONT.sans,
                    fontSize: 38,
                    fontWeight: 750,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {STATEMENT.pre}
                  <span
                    style={{
                      color: C.roseSoft,
                      fontWeight: 900,
                      paddingBottom: 2,
                      backgroundImage: `linear-gradient(${C.rose}, ${C.rose})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'left bottom',
                      backgroundSize: `${Math.round(underline * 100)}% 6px`,
                      textShadow: `0 0 18px ${alpha(C.rose, 0.5)}`,
                    }}
                  >
                    {STATEMENT.em}
                  </span>
                  {STATEMENT.post}
                </div>
                {/* The letters and the chips */}
                <div style={{ gridArea: '1 / 1', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ opacity: stripIn, transform: `translateX(${(1 - stripIn) * 14}px)` }}>
                    <LetterStrip items={items} w={96} gap={10} />
                  </div>
                  <div style={{ display: 'grid', alignItems: 'center' }}>
                    <div style={{ gridArea: '1 / 1' }}>{tag > 0.01 ? <BandChip text={TRAP_TAG} tone="amber" on={tag} icon="alert" /> : null}</div>
                    <div style={{ gridArea: '1 / 1' }}>{hurry > 0.01 ? <BandChip text={HURRY} tone="amber" on={hurry} icon="cursor" /> : null}</div>
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
