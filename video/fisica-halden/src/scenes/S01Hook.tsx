import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, STAMP, TITLE } from '../data/canon';
import { FloorPlan, PLAN } from './parts/FloorPlan';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { PlanLabel } from './parts/PlanLabel';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

/** One chip per question of the promise; each lights on its word in s01-02. */
const PROMISE = [
  { text: 'qué frena cada control', word: 'frena' },
  { text: 'dónde falla cada sensor', word: 'falla' },
  { text: 'qué es un cebo', word: 'cebo' },
] as const;

/** The plan before the title (big, centred) and after it (on the left). */
const BIG = { w: 1280, x: (W - 1280) / 2, y: 86 } as const;
const SMALL = { w: 800, x: 0, y: 96 } as const;
const TEXT_X = 860;
const TITLE_TOP = 84;
const TITLE_SIZE = 84;
const PLAQUE_TOP = 360;
const CHIPS_TOP = 432;
const CHIP_STEP = 70;

/** Where the car waits in the street before s02 drives it to the facade. */
export const S01_CAR = 0.7;

/**
 * s01-hook «Un plano, tres preguntas». The proposal stamp from the first frame and a faint floor plan behind it. On
 * `plan` the example plan comes in (a street with a car, one entrance, a corridor, a room; no reader, camera or fence)
 * with its label «plano de ejemplo · sobre el papel · no es un edificio del puerto». Before 12 s it glides to the left,
 * the title lands with «SY0-701 · 1.2», and the promise comes as three chips, each lit on its word.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const planAt = props.cue('plan');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  const chipAt = PROMISE.map((p) => Math.max(promiseAt, wordFrame(S, 's01-02', p.word) - 6));

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const planIn = enter(frame, planAt - 4, { distance: 24, duration: 18 });
  const ghost = 0.3 + 0.7 * progress(frame, planAt - 4, 20);
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const pw = mix(BIG.w, SMALL.w, glide);
  const px = mix(BIG.x, SMALL.x, glide);
  const py = mix(BIG.y, SMALL.y, glide);
  const ph = (pw * PLAN.h) / PLAN.w;
  const labelIn = progress(frame, planAt + 8, 16);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });

  // Each chip is lit from its word until the next chip's word, then stays half lit.
  const hold = PROMISE.map((_, i) => 1 - 0.5 * (i < PROMISE.length - 1 ? progress(frame, chipAt[i + 1] - 2, 10) : 0));
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * hold[i]);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP]} size={28} />
      </div>

      {/* The plan: faint from the first frame (never an empty stage), solid on `plan` */}
      <div style={{ position: 'absolute', left: px, top: py, opacity: ghost, transform: planIn.transform }}>
        <FloorPlan width={pw} car={S01_CAR} idSuffix="-s1" />
      </div>
      <div style={{ position: 'absolute', left: px, top: py + ph + 16, opacity: labelIn }}>
        <PlanLabel size={mix(28, 26, glide)} />
      </div>

      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: TEXT_X,
            top: TITLE_TOP,
            fontFamily: FONT.sans,
            fontSize: TITLE_SIZE,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.02,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
            ...titleIn,
          }}
        >
          <div>{TITLE[0]}</div>
          <div>{TITLE[1]}</div>
          <div style={{ color: C.cyan }}>{TITLE[2]}</div>
        </div>
      ) : null}
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', left: TEXT_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {PROMISE.map((p, i) => {
        if (frame < promiseAt - 2) return null;
        return (
          <div key={p.text} style={{ position: 'absolute', left: TEXT_X, top: CHIPS_TOP + i * CHIP_STEP, ...enter(frame, promiseAt + i * 6, { distance: 16 }) }}>
            <Pill text={p.text} tone={C.cyan} on={0.12 + 0.88 * chipOn[i]} size={40} height={60} />
          </div>
        );
      })}
    </Stage>
  );
}
