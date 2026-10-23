import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, STAMP, TITLE } from '../data/canon';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { RequestSheet, SHEET } from './parts/Request';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

/** One chip per part of the promise; each lights on its word in s01-02. */
const PROMISE = [
  { text: 'qué hace falta antes', word: 'antes' },
  { text: 'qué toca', word: 'toca' },
  { text: 'qué queda por escrito', word: 'escrito' },
] as const;

/** The sheet before the title (centred) and after it (on the left). */
const BIG = { w: 700, x: (W - 700) / 2, y: 84 } as const;
const SMALL = { w: 680, x: 0, y: 92 } as const;
const TEXT_X = 800;
const TITLE_TOP = 84;
const TITLE_SIZE = 84;
const PLAQUE_TOP = 360;
const CHIPS_TOP = 432;
const CHIP_STEP = 72;

/**
 * s01-hook «Una petición de cambio». The case stamp from the first frame and a faint, blank change request behind it.
 * On `request` the sheet comes in — «Poner al día las carpetas compartidas de las oficinas», three empty boxes, nothing
 * touched — and on «firmado» (`stamp`) the amber «sin firmar» stamp lands. Before 12 s it glides to the left, the title
 * lands with «SY0-701 · 1.3», and the promise comes as three chips, each lit on its word.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const requestAt = props.cue('request');
  const stampAt = props.cue('stamp');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  const chipAt = PROMISE.map((p) => Math.max(promiseAt, wordFrame(S, 's01-02', p.word) - 6));

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const sheetIn = enter(frame, requestAt - 4, { distance: 24, duration: 18 });
  const ghost = 0.3 + 0.7 * progress(frame, requestAt - 4, 20);
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const sw = mix(BIG.w, SMALL.w, glide);
  const sx = mix(BIG.x, SMALL.x, glide);
  const sy = mix(BIG.y, SMALL.y, glide);
  const stampDrop = progress(frame, stampAt - 2, 12);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });

  const hold = PROMISE.map((_, i) => 1 - 0.5 * (i < PROMISE.length - 1 ? progress(frame, chipAt[i + 1] - 2, 10) : 0));
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * hold[i]);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP]} size={28} />
      </div>

      {/* The request: faint from the first frame (never an empty stage), solid on `request` */}
      <div style={{ position: 'absolute', left: sx, top: sy, opacity: ghost, transform: sheetIn.transform }}>
        <RequestSheet width={sw} stamp="unsigned" stampDrop={stampDrop} />
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

/** The sheet's size at the end of s01 (s02 grows its own form from there). */
export const S01_SHEET_H = (SMALL.w * SHEET.h) / SHEET.w;
