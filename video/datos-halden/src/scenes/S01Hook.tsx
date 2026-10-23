import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, STAMP, TITLE } from '../data/canon';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Record } from './parts/Record';
import { TimeClock } from './parts/TimeClock';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';

/** One chip per promise; each lights on its word in s01-02. */
const PROMISE = [
  { text: 'guardado, en camino o en uso', word: 'guardado' },
  { text: 'qué se ve y qué se guarda', word: 'verás' },
  { text: 'en qué país vive', word: 'país' },
] as const;

/** The clock and its record: centred before the title, on the left after it. */
const GROUP_W = 780;
const CENTRE_X = 470;
const CLOCK_W = 230;
const CLOCK_Y = 180;
const RECORD_X = 290;
const RECORD_Y = 150;
const RECORD_SCALE = 1.05;
const TEXT_X = 900;
const TITLE_TOP = 128;
const PLAQUE_TOP = 350;
const CHIPS_TOP = 436;
const CHIP_STEP = 76;

/**
 * s01-hook «Un fichaje». The proposal stamp from the first frame and the time clock at an entrance (no brand or device
 * name). On `clock` a card passes the reader and its LED lights; on `record` the record comes out — «nombre · DNI ·
 * horas», every value a redacted bar — and on «personal» its chip «datos de la plantilla · private». Before 12 s the
 * pair glides left, the title «Dónde está el dato» lands with «SY0-701 · 3.3», and the promise comes as three chips,
 * each lit on its word. Nothing says the system already works.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const clockAt = props.cue('clock');
  const recordAt = props.cue('record');
  const chipAt = Math.max(recordAt + 12, wordFrame(S, 's01-01', 'personal') - 4);
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  const pAt = PROMISE.map((p) => Math.max(promiseAt, wordFrame(S, 's01-02', p.word) - 6));

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const clockIn = enter(frame, -2, { distance: 20, duration: 18 });
  const swipe = progress(frame, clockAt + 4, 30, EASE.inOut);
  const beep = progress(frame, clockAt + 20, 8) * (0.6 + 0.4 * (1 - progress(frame, clockAt + 60, 30)));
  const rows = progress(frame, recordAt - 2, 26, EASE.linear);
  const recIn = enter(frame, recordAt - 6, { distance: 30, duration: 18, axis: 'x' });
  const chip = progress(frame, chipAt, 14);

  const glide = progress(frame, titleAt - 18, 30, EASE.inOut);
  const gx = mix(CENTRE_X, 0, glide);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });

  const hold = PROMISE.map((_, i) => 1 - 0.5 * (i < PROMISE.length - 1 ? progress(frame, pAt[i + 1] - 2, 10) : 0));
  const on = PROMISE.map((_, i) => progress(frame, pAt[i], 10) * hold[i]);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP]} size={30} />
      </div>

      <div style={{ position: 'absolute', left: gx, top: 0, width: GROUP_W, height: 660 }}>
        <div style={{ position: 'absolute', left: 0, top: CLOCK_Y, ...clockIn }}>
          <TimeClock width={CLOCK_W} swipe={swipe} beep={beep} idSuffix="-s1" />
        </div>
        {frame >= recordAt - 8 ? (
          <div style={{ position: 'absolute', left: RECORD_X, top: RECORD_Y, ...recIn }}>
            <Record rows={rows} chip={chip} scale={RECORD_SCALE} />
          </div>
        ) : null}
      </div>

      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: TEXT_X,
            top: TITLE_TOP,
            fontFamily: FONT.sans,
            fontSize: 100,
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
          <div style={{ color: C.cyan }}>{TITLE[1]}</div>
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
            <Pill text={p.text} tone={C.cyan} on={0.12 + 0.88 * on[i]} size={40} height={62} />
          </div>
        );
      })}
    </Stage>
  );
}
