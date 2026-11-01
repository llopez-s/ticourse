import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../engine/src/ui';
import { BAR, CROSSWORD_TAG, PBQ, SIM_TAG, SIM_WORDS } from '../data/s12-tiempo';
import { ImageTag } from './parts/Labels';
import { ClueList, CrosswordGrid, gridSize } from './parts/s12-tiempo/Crossword';
import { ClassifyThumb, FirewallThumb, StepsThumb, THUMB } from './parts/s12-tiempo/SimThumbs';
import { BAR_ZONE, TimeBar } from './parts/s12-tiempo/TimeBar';
import { Stage, wordFrame } from './kit';

const S = 's12-tiempo';
const W = STAGE.width;
const THUMB_GAP = (W - 3 * THUMB.w) / 2;
const THUMBS_TOP = 64;
const BAR_TOP = 408;
const CELL = 58;
const GRID_X = 330;
const GRID_TOP = 56;
const LIST_X = GRID_X + gridSize(CELL).w + 100;
const LIST_ROW = 58;
const CHIP_TOP = 552;
const FOOT_TOP = 614;

/**
 * s12-tiempo «El tiempo y las simulaciones». Always on stage: the 90-minute bar (`bar`), the video's only clock.
 *   sims        three thumbnails (firewall rules, response steps to order, controls to sort), each on its word, under the
 *               label «simulación · ejemplo · datos ficticios» and the English term; no CompTIA screen. While the voice says
 *               they take much time, the simulations swallow the bar (amber).
 *   crossword   the everyday image (tagged «imagen · no es del puerto») replaces them: the easy words fill on «sabes»
 *   mark        the hard ones keep a pencil ring (and so does the simulations part of the bar)
 *   back        they are filled when you come back; an arrow runs back along the bar
 *   budget      the simulations shrink to «15–20 min», the rest is «test»; the chip «algo menos de 1 min por pregunta»
 *   blank       the footer «sin penalización · nunca en blanco»
 */
export function S12Tiempo(props: SceneProps) {
  const frame = useCurrentFrame();
  const barAt = props.cue('bar') - 4;
  const simsAt = props.cue('sims') - 4;
  const crossAt = props.cue('crossword') - 4;
  const markAt = props.cue('mark') - 2;
  const backAt = props.cue('back') - 2;
  const budgetAt = props.cue('budget') - 4;
  const blankAt = props.cue('blank') - 4;

  const thumbAt = SIM_WORDS.map((w, i) => Math.max(simsAt + 6 + i * 4, wordFrame(S, 's12-02', w) - 14));
  const pbqAt = Math.max(simsAt + 20, wordFrame(S, 's12-02', 'performance-based') - 8);
  const eatAt = wordFrame(S, 's12-03', 'principio') - 6;
  const easyAt = Math.max(crossAt + 18, wordFrame(S, 's12-04', 'sabes') - 30);
  const hintAt = wordFrame(S, 's12-04', 'difícil') - 8;
  const chipAt = Math.max(budgetAt + 10, wordFrame(S, 's12-06', 'algo') - 10);

  const barIn = progress(frame, barAt, 18);
  const eat = progress(frame, eatAt, 70, EASE.inOut);
  const collapse = progress(frame, budgetAt, 36, EASE.inOut);
  const ringIn = progress(frame, markAt, 26) * (1 - collapse);
  const retIn = progress(frame, backAt + 10, 40, EASE.inOut) * (1 - collapse);

  const simsOut = progress(frame, crossAt - 8, 14, EASE.inOut);
  const simsTag = progress(frame, simsAt, 14) * (1 - simsOut);
  const crossIn = progress(frame, crossAt, 16);
  const easy = progress(frame, easyAt, 70, EASE.inOut);
  const hint = progress(frame, hintAt, 12) * (1 - progress(frame, markAt, 10));
  const hardRing = progress(frame, markAt, 24);
  const hard = progress(frame, backAt + 6, 70, EASE.inOut);
  const crossDim = 0.5 * progress(frame, budgetAt, 20);

  const chipIn = progress(frame, chipAt, 16);
  const footIn = progress(frame, blankAt, 16);

  return (
    <Stage>
      {/* Content: the simulations, then the crossword */}
      {simsOut < 0.99 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: BAR_TOP - 6, opacity: 1 - simsOut, transform: `translateY(${-simsOut * 18}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', opacity: simsTag }}>
            <ImageTag text={SIM_TAG} />
          </div>
          <div style={{ position: 'absolute', right: 0, top: -4, opacity: progress(frame, pbqAt, 14), transform: `translateX(${(1 - progress(frame, pbqAt, 14)) * 20}px)` }}>
            <Chip accent="violet" icon="mortarboard" size={32}>
              {PBQ}
            </Chip>
          </div>
          {[FirewallThumb, StepsThumb, ClassifyThumb].map((Thumb, i) => (
            <div key={i} style={{ position: 'absolute', left: i * (THUMB.w + THUMB_GAP), top: THUMBS_TOP }}>
              <Thumb show={progress(frame, thumbAt[i], 16)} t={progress(frame, thumbAt[i] + 8, 90, (x) => x)} />
            </div>
          ))}
        </div>
      ) : null}

      {crossIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: BAR_TOP - 6, opacity: crossIn * (1 - crossDim), transform: `translateY(${(1 - crossIn) * 18}px)` }}>
          <div style={{ position: 'absolute', left: GRID_X, top: 0 }}>
            <ImageTag text={CROSSWORD_TAG} />
          </div>
          <div style={{ position: 'absolute', left: GRID_X, top: GRID_TOP }}>
            <CrosswordGrid cell={CELL} easy={easy} hard={hard} ring={hardRing} />
          </div>
          <div style={{ position: 'absolute', left: LIST_X, top: GRID_TOP + (gridSize(CELL).h - 6 * LIST_ROW) / 2 }}>
            <ClueList rowH={LIST_ROW} width={500} show={1} easy={easy} hard={hard} ring={hardRing} pulse={hint} />
          </div>
        </div>
      ) : null}

      {/* The 90-minute bar */}
      <div style={{ position: 'absolute', left: 0, top: BAR_TOP }}>
        <TimeBar show={barIn} eat={eat} collapse={collapse} ring={ringIn} ret={retIn} />
      </div>
      {chipIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIP_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: chipIn, transform: `translateY(${(1 - chipIn) * 14}px)` }}>
          <div style={{ marginLeft: BAR_ZONE.w * (20 / 90) }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                height: 58,
                padding: '0 30px 0 22px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `3px solid ${C.cyan}`,
                background: alpha(C.cyan, 0.14),
                boxShadow: `0 0 28px ${alpha(C.cyan, 0.25)}`,
                fontFamily: FONT.sans,
                fontSize: 36,
                fontWeight: 800,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="play" size={34} color={C.cyan} strokeWidth={2.4} />
              {BAR.budget}
            </div>
          </div>
        </div>
      ) : null}
      {footIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: FOOT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: footIn, transform: `translateY(${(1 - footIn) * 14}px)` }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              height: 46,
              padding: '0 28px 0 20px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.pill,
              border: `3px solid ${alpha(C.violet, 0.85)}`,
              background: alpha(C.violet, 0.16),
              fontFamily: FONT.sans,
              fontSize: 34,
              fontWeight: 800,
              color: C.textStrong,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="check" size={32} color={C.violet} strokeWidth={2.8} />
            {BAR.blank}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
