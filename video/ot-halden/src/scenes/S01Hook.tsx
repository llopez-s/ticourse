import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { CRANE_PLACE, Crane } from './parts/Crane';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

/** Stamp, title and promise: the exact strings of the brief. */
const STAMP = ['Autoridad Portuaria de Halden', 'requisitos para el control del muelle', 'propuesta · sin fecha'];
const TITLE = ['En marcha, a tiempo', 'y con parche'];
const PLAQUE = 'SY0-701 · 3.1';
/** One chip per question; `word` is the spoken word (and its 0-based occurrence in s01-02) that lights it and its crane part(s). */
const PROMISE = [
  { text: '¿qué manda?', word: 'manda', alt: 'primero', nth: 0, parts: ['controllers'] },
  { text: '¿llega a tiempo?', word: 'tiempo', alt: 'tiempo', nth: 1, parts: ['anticollision'] },
  { text: '¿hay parche y se puede poner?', word: 'parche', alt: 'parche', nth: 1, parts: ['wind', 'wireless'] },
] as const;

/** The crane before the title (big, centred) and after it (its fixed place on the left). */
const BIG = { w: 800, x: (W - 800) / 2, y: 100 } as const;
const TEXT_X = CRANE_PLACE.left + CRANE_PLACE.width + 70;
const TITLE_TOP = 84;
const TITLE_SIZE = 94;
const CHIPS_TOP = 372;
const CHIP_GAP = 14;

/**
 * s01-hook «Una grúa sobre el papel». The proposal stamp from the first frame, with a faint crane behind it. On
 * `crane` the gantry crane (a drawing, a container on its hook) comes in; on `parts` the four dots mark the controllers,
 * the anti-collision, the wind sensor and the wireless sensor, still without a word. Before 12 s the crane glides to
 * its place on the left, the title lands with «SY0-701 · 3.1», and the promise comes as three chips, each lit on its
 * word together with the part it is about (qué manda: controllers · a tiempo: anti-collision · parche: wind and
 * wireless sensors).
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const craneAt = props.cue('crane');
  const partsAt = props.cue('parts');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  // `alt` only matters while the timeline still carries an older script («qué va primero»); the final script says «manda».
  const spoken = (word: string, alt: string, nth: number) => {
    try {
      return wordFrame(S, 's01-02', word, nth);
    } catch {
      return wordFrame(S, 's01-02', alt, nth);
    }
  };
  const chipAt = PROMISE.map((p) => spoken(p.word, p.alt, p.nth) - 6);

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const craneIn = enter(frame, craneAt - 6, { distance: 24, duration: 18 });
  const ghost = 0.82 * (1 - progress(frame, craneAt - 6, 22));
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const cw = mix(BIG.w, CRANE_PLACE.width, glide);
  const cx = mix(BIG.x, CRANE_PLACE.left, glide);
  const cy = mix(BIG.y, CRANE_PLACE.top, glide);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });

  // Each chip (and its crane parts) is lit from its word until the next chip's word, then stays half lit.
  const hold = PROMISE.map((_, i) => 1 - 0.5 * (i < PROMISE.length - 1 ? progress(frame, chipAt[i + 1] - 2, 10) : 0));
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * hold[i]);
  const lit: Record<string, number> = { controllers: 0, anticollision: 0, wind: 0, wireless: 0 };
  PROMISE.forEach((p, i) => {
    const l = progress(frame, chipAt[i], 12) * hold[i];
    p.parts.forEach((part) => (lit[part] = Math.max(lit[part], l)));
  });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={STAMP} />
      </div>

      {/* The crane: faint from the first frame (never an empty stage), solid on `crane`. */}
      <div style={{ position: 'absolute', left: cx, top: cy, transform: craneIn.transform }}>
        <Crane width={cw} dim={ghost} lit={lit} dots={progress(frame, partsAt, 40, EASE.inOut)} />
      </div>

      {/* The title */}
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
            lineHeight: 1.04,
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
        <div style={{ position: 'absolute', left: TEXT_X, top: TITLE_TOP + 2 * TITLE_SIZE * 1.04 + 16, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {/* The promise: three questions, one per beat of the lesson */}
      {PROMISE.map((p, i) => {
        if (frame < promiseAt - 2) return null;
        const on = Math.max(0.0, chipOn[i]);
        return (
          <div key={p.text} style={{ position: 'absolute', left: TEXT_X, top: CHIPS_TOP + i * (CHIP_H + 16 + CHIP_GAP), ...enter(frame, promiseAt + i * 6, { distance: 16 }) }}>
            <Pill text={p.text} tone={C.cyan} on={0.12 + 0.88 * on} size={44} height={CHIP_H + 16} />
          </div>
        );
      })}
    </Stage>
  );
}
