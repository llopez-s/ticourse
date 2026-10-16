import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { AdversaryTag } from './parts/s01-hook/AdversaryTag';
import { CLOCK_D, CPD, Clock, CpdBox } from './parts/s01-hook/DataCentre';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The CPD + clock group (design size; scaled per phase).
const CLOCK_GAP = 70;
const GROUP_W = CPD.w + CLOCK_GAP + CLOCK_D;
const GROUP_H = CPD.h;
/** A: alone under the stamp. */
const SA = 1.15;
const GA = { s: SA, x: Math.round((W - GROUP_W * SA) / 2), y: 116 } as const;
/** B: smaller, under the title and the promise. */
const SB = 0.72;
const GB = { s: SB, x: Math.round((W - GROUP_W * SB) / 2), y: 340 } as const;
/** C: to the left, BLIND ARCHITECT's tag on the right. */
const TAG_W = 640;
const PAIR_GAP = 80;
const GC = { s: SB, x: Math.round((W - (GROUP_W * SB + PAIR_GAP + TAG_W)) / 2), y: 340 } as const;
const TAG_X = GC.x + Math.round(GROUP_W * SB) + PAIR_GAP;
const TAG_TOP = 354;

// ---- Title block (from `title`).
const TITLE_TOP = 80;
const CHIPS_TOP = 204;
const CHIP_H = 62;

/** The power cut: a short flicker, then half light. */
const FLICKER = [1, 0.25, 0.9, 0.1, 0.7, 0.05, 0, 0.35, 0, 0, 0.12, 0];
function powerAt(frame: number, darkAt: number): number {
  const t = frame - darkAt;
  if (t < 0) return 1;
  if (t >= FLICKER.length) return 0;
  return FLICKER[t];
}

/**
 * s01-hook «Si el centro de datos no está». The stamp «plan de recuperación · revisión · propuesta · sin efectos»
 * (no date) settles from the first frame, with a clock with no numbers already ticking and a dashed slot beside it.
 * On `dc` the one box «CPD» springs into the slot, its LEDs blinking; on `dark` it flickers and stays at half light
 * with a rose edge (the sound is the engine's). On «reloj» the clock's ring turns amber and the hands race. Before
 * 12 s (`title`) «Recuperación ante desastres» lands under the stamp while the box and the clock step down and back;
 * the promise follows as three chips, each lit on its own word. On `adversary` the box and the clock move left and
 * BLIND ARCHITECT's tag («BLIND ARCHITECT · sección 3» / «vive de los planos con atajos») comes in on the right; on
 * «atajos» it glows once more. No second CPD anywhere; no hour, no date, no question on screen.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const dcAt = props.cue('dc');
  const darkAt = props.cue('dark');
  const advAt = props.cue('adversary');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);

  // ---- Stamp and slot from the first frame.
  const settle = progress(frame, -12, 20);
  const slotIn = progress(frame, -6, 18);

  // ---- The box.
  const boxIn = springIn(frame, 30, dcAt - 6, { damping: 15 });
  const lit = powerAt(frame, darkAt);
  const dark = progress(frame, darkAt, 10);

  // ---- The clock: ticks slowly from the start, races from «reloj».
  const relojAt = wordFrame(S, 's01-01', 'reloj') - 4;
  const race = progress(frame, relojAt, 20, EASE.inOut);
  const minutes = 0.12 + frame * 0.0025 + Math.max(0, frame - relojAt) * 0.012 * race;
  const clockGlow = race;

  // ---- Group phases: A → B (title) → C (adversary).
  const toB = progress(frame, titleAt - 8, 26, EASE.inOut);
  const toC = progress(frame, advAt - 10, 24, EASE.inOut);
  const gs = mix(mix(GA.s, GB.s, toB), GC.s, toC);
  const gx = mix(mix(GA.x, GB.x, toB), GC.x, toC);
  const gy = mix(mix(GA.y, GB.y, toB), GC.y, toC);
  const groupDim = 0.45 * toB;

  // ---- Title and promise.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const chipAt = PROMISE.map((p, i) =>
    i === 0 ? Math.min(wordFrame(S, 's01-02', p.word) - 6, props.cue('promise') + 6) : wordFrame(S, 's01-02', p.word) - 6,
  );
  const blockDim = 0.35 * progress(frame, advAt - 8, 16, EASE.inOut);

  // ---- BLIND ARCHITECT.
  const tagIn = enter(frame, advAt - 2, { distance: 26, duration: 18, axis: 'x' });
  const shortcutAt = wordFrame(S, 's01-03', 'atajos') - 6;
  const tagGlow = windowWeight(frame, shortcutAt, Number.POSITIVE_INFINITY, { ramp: 14 });

  return (
    <Stage>
      {/* The stamp of the review: no date */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, display: 'flex', justifyContent: 'center', opacity: settle, ...dimStyle(0.3 * toB, settle) }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            height: 54,
            padding: '0 30px 0 20px',
            boxSizing: 'border-box',
            borderRadius: RADIUS.pill,
            border: `2px dashed ${alpha(C.cyan, 0.7)}`,
            background: alpha(C.ink850, 0.9),
            color: C.cyanSoft,
            fontFamily: FONT.sans,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 0.3,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="file" size={32} color={C.cyan} />
          {STAMP}
        </span>
      </div>

      {/* The one box and the clock */}
      <div
        style={{
          position: 'absolute',
          left: gx,
          top: gy,
          width: GROUP_W,
          height: GROUP_H,
          transform: `scale(${gs})`,
          transformOrigin: '0 0',
          ...dimStyle(groupDim),
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          {boxIn < 0.999 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: slotIn * (1 - Math.min(1, boxIn * 1.5)) }}>
              <CpdBox frame={frame} outline={1} />
            </div>
          ) : null}
          {boxIn > 0.001 ? (
            <div style={{ opacity: Math.min(1, boxIn * 1.4), transform: `translateY(${(1 - Math.min(1, boxIn)) * 20}px) scale(${0.94 + 0.06 * Math.min(1, boxIn)})`, transformOrigin: '50% 100%' }}>
              <CpdBox frame={frame} lit={lit} dark={dark} />
            </div>
          ) : null}
        </div>
        <div style={{ position: 'absolute', left: CPD.w + CLOCK_GAP, top: Math.round((CPD.h - CLOCK_D) / 2), opacity: settle }}>
          <Clock minutes={minutes} glow={clockGlow} />
        </div>
      </div>

      {/* Title */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn, ...dimStyle(blockDim, titleIn.opacity) }}>
          <span style={{ fontSize: 96, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color: C.textStrong, textShadow: `0 0 34px ${alpha(C.cyan, 0.25)}`, whiteSpace: 'nowrap' }}>
            {TITLE}
          </span>
        </div>
      ) : null}

      {/* The promise: three chips, each on its word */}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 24, ...dimStyle(blockDim) }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 16 });
            const on = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? advAt - 6) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  height: CHIP_H,
                  padding: '0 30px 0 22px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * on),
                  boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 40,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={38} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* BLIND ARCHITECT: lives off plans with shortcuts */}
      {frame >= advAt - 4 ? (
        <div style={{ position: 'absolute', left: TAG_X, top: TAG_TOP, ...tagIn }}>
          <AdversaryTag glow={tagGlow} />
        </div>
      ) : null}
    </Stage>
  );
}
