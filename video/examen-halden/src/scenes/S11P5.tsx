import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { ANSWER, ONE_LINE, STRUCK, TRAP } from '../data/s11-p5';
import type { OptionItem } from './parts/OptionStack';
import { LetterStrip } from './parts/LetterStrip';
import { QualifierLine, QuestionBand, QuestionStill } from './parts/QuestionBand';
import { Stage, wordFrame } from './kit';

const S = 's11-p5';

/**
 * s11-p5 «Una web de clínica» — question scene 5 (the template is S05P1; see parts/QuestionBand.tsx). The question is the
 * ENGINE's; the scene draws the still blank exam screen and ONE band under the stage:
 *   (word «mejor»)  only the pill «MEJOR · BEST» lands: it was explained in s05, so no line and no gloss
 *   ok-5            the letters A–D come in; C lights emerald (the answer)
 *   trap-5          A lights amber (the trap)
 *   before back-5   B and D are struck with a white stroke, in silence (the voice does not comment on it)
 *   back-5          the strip gives way to the two columns of s10 in ONE line: «para el público, lo estándar» (cyan)
 *                   and «ocurrencia» struck
 */
export function S11P5(props: SceneProps) {
  const frame = useCurrentFrame();
  const pillAt = Math.max(props.cue('q5') + 6, wordFrame(S, 's11-01', 'mejor') - 6);
  const okAt = props.cue('ok-5') - 2;
  const trapAt = props.cue('trap-5') - 2;
  const backAt = props.cue('back-5') - 2;
  const strikeAt = Math.max(trapAt + 50, backAt - 40);
  const swapAt = Math.max(strikeAt + 30, backAt);

  const stripIn = progress(frame, okAt, 14);
  const swap = progress(frame, swapAt, 14);
  const lineIn = progress(frame, swapAt + 4, 14);
  const ocurIn = progress(frame, swapAt + 14, 14);
  const ocurStrike = progress(frame, swapAt + 26, 16);

  const items: OptionItem[] = [0, 1, 2, 3].map((i) => {
    if (i === ANSWER) return { state: 'ok', on: progress(frame, okAt + 6, 12) };
    if (i === TRAP) return { state: 'trap', on: progress(frame, trapAt + 4, 12) };
    const k = (STRUCK as readonly number[]).indexOf(i);
    return { strike: k >= 0 ? progress(frame, strikeAt + k * 10, 18) : 0 };
  });

  return (
    <Stage>
      <QuestionStill>
        <QuestionBand>
          <QualifierLine
            q="best"
            at={pillAt}
            glossAt={null}
            trail={
              <div style={{ position: 'relative', width: 840, height: 60 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, opacity: stripIn * (1 - swap), transform: `translateX(${(1 - stripIn) * 14}px)` }}>
                  <LetterStrip items={items} />
                </div>
                {swap > 0.01 ? (
                  <div style={{ position: 'absolute', left: 0, top: 0, height: 60, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        height: 60,
                        padding: '0 24px 0 18px',
                        boxSizing: 'border-box',
                        borderRadius: RADIUS.pill,
                        border: `3px solid ${C.cyan}`,
                        background: alpha(C.cyanDeep, 0.95),
                        boxShadow: `0 0 26px ${alpha(C.cyan, 0.45)}`,
                        fontSize: 33,
                        fontWeight: 850,
                        color: '#ffffff',
                        opacity: lineIn,
                        transform: `translateX(${(1 - lineIn) * 16}px)`,
                      }}
                    >
                      <Icon name="check" size={34} color={C.cyanSoft} strokeWidth={2.8} />
                      {ONE_LINE.standard}
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: 60,
                        padding: '0 22px',
                        boxSizing: 'border-box',
                        borderRadius: RADIUS.pill,
                        border: `3px solid ${C.amber}`,
                        background: alpha(C.amberDeep, 0.95),
                        fontSize: 33,
                        fontWeight: 800,
                        color: '#ffffff',
                        opacity: ocurIn * (1 - 0.45 * ocurStrike),
                      }}
                    >
                      {ONE_LINE.trick}
                      <svg width="100%" height="60" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: -3, overflow: 'visible' }}>
                        <line x1={4} y1={42} x2={4 + 92 * ocurStrike} y2={42 - 26 * ocurStrike} stroke="#ffffff" strokeWidth={6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </div>
                ) : null}
              </div>
            }
          />
        </QuestionBand>
      </QuestionStill>
    </Stage>
  );
}
