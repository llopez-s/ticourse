import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, STAMP_S01, TITLE, WRONG_LABEL } from '../data/canon';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Bars, Sheet } from './parts/Paper';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';

/** One chip per question of the promise; each lights on its word in s01-02. */
const PROMISE = [
  { text: '¿obliga?', word: 'obliga' },
  { text: '¿qué pregunta contesta?', word: 'contesta' },
] as const;

/** The four sheets on the table, face up, none turned over: width, height, gap and their natural tilt and offset. */
const SW = 372;
const SH = 440;
const GAP = 36;
const ROW_W = 4 * SW + 3 * GAP;
const TILT = [-2.5, 1.8, -1.2, 2.6] as const;
const DROP = [8, -6, 10, -4] as const;

/** The group (table + sheets) sits centred at first and glides left, smaller, when the title lands. */
const GROUP_X0 = (1728 - ROW_W) / 2;
const GROUP_Y0 = 128;
const GROUP_X1 = 0;
const GROUP_Y1 = 236;
const GROUP_SCALE1 = 0.66;
const TEXT_X = 1130;
const TITLE_TOP = 140;
const PLAQUE_TOP = 382;
const CHIPS_TOP = 470;
const CHIP_STEP = 80;

/** 0 → 1 → 0: a sheet lifts off the table to be read, then settles. */
function bump(frame: number, at: number): number {
  return progress(frame, at, 10) * (1 - progress(frame, at + 24, 16, EASE.inOut));
}

/**
 * s01-hook «Cuatro papeles». The proposal stamp from the first frame and an empty table. On `sheets` the four sheets
 * land one by one, FACE UP, every one headed «POLÍTICA» with the rest in unreadable bars (none is turned over: V35's
 * actor cards are). On `wrong-label` the headings turn amber and each sheet lifts off the table in turn to be read; on
 * «solo uno» three step back and the first gets its check. Before 12 s the table glides left, smaller, the title
 * «Cuatro papeles» lands with «SY0-701 · 5.1», and the promise comes as two chips, each lit on its question.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const sheetsAt = props.cue('sheets');
  const wrongAt = props.cue('wrong-label');
  const soloAt = Math.max(wrongAt + 70, wordFrame(S, 's01-01', 'solo') - 4);
  const unoAt = Math.max(soloAt + 6, wordFrame(S, 's01-01', 'uno') - 4);
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  const pAt = PROMISE.map((p) => Math.max(promiseAt, wordFrame(S, 's01-02', p.word) - 8));

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const matIn = enter(frame, -4, { distance: 20, duration: 20 });
  const dropAt = [0, 1, 2, 3].map((i) => sheetsAt - 8 + i * 14);
  const lifts = [0, 1, 2, 3].map((i) => bump(frame, wrongAt + i * 16));
  const wrongOn = progress(frame, wrongAt, 10);
  const dim = progress(frame, soloAt, 14);
  const check = progress(frame, unoAt, 12);

  const glide = progress(frame, titleAt - 18, 30, EASE.inOut);
  const gx = mix(GROUP_X0, GROUP_X1, glide);
  const gy = mix(GROUP_Y0, GROUP_Y1, glide);
  const gs = mix(1, GROUP_SCALE1, glide);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });

  const hold = PROMISE.map((_, i) => 1 - 0.5 * (i < PROMISE.length - 1 ? progress(frame, pAt[i + 1] - 2, 10) : 0));
  const on = PROMISE.map((_, i) => progress(frame, pAt[i], 10) * hold[i]);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP_S01]} size={30} />
      </div>

      <div style={{ position: 'absolute', left: gx, top: gy, width: ROW_W, height: SH, transform: `scale(${gs})`, transformOrigin: '0 0' }}>
        {/* the table */}
        <div
          style={{
            position: 'absolute',
            left: -44,
            top: -34,
            width: ROW_W + 88,
            height: SH + 80,
            borderRadius: 34,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            border: `2px solid ${C.ink700}`,
            boxShadow: `inset 0 0 60px ${alpha('#000000', 0.35)}`,
            ...matIn,
          }}
        />
        {[0, 1, 2, 3].map((i) => {
          const p = progress(frame, dropAt[i], 20);
          const d = i === 0 ? 0 : dim;
          return (
            <div key={i} style={{ position: 'absolute', left: i * (SW + GAP), top: DROP[i], opacity: p, transform: `translateY(${(1 - p) * -60}px)` }}>
              <Sheet
                width={SW}
                height={SH}
                heading={WRONG_LABEL}
                headTone={frame >= wrongAt + i * 16 ? 'wrong' : 'plain'}
                check={i === 0 ? check : 0}
                tilt={TILT[i] * (1 + 0.4 * lifts[i])}
                scale={1 + 0.05 * lifts[i]}
                lift={22 * lifts[i]}
                glow={0.55 * lifts[i] * wrongOn}
                glowTone={C.amber}
                dim={d}
              >
                <Bars set={i} count={6} gap={20} height={14} />
                <div style={{ marginTop: 34 }}>
                  <Bars set={i + 1} count={3} gap={20} height={14} />
                </div>
              </Sheet>
            </div>
          );
        })}
      </div>

      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: TEXT_X,
            top: TITLE_TOP,
            fontFamily: FONT.sans,
            fontSize: 112,
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
