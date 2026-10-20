import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { ACTORS, ActorCard, PAIR_TONES } from './parts/ActorCard';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- On the table: six portrait cards in a row, then gathered two by two.
const TABLE = { x: 24, y: 104, w: W - 48, h: 470 } as const;
const CARD = { w: 236, h: 300, y: 190 } as const;
const SPREAD_X0 = (W - (6 * CARD.w + 5 * 36)) / 2;
const PAIRED_X0 = (W - (6 * CARD.w + 3 * 16 + 2 * 90)) / 2;
const spreadX = (i: number) => SPREAD_X0 + i * (CARD.w + 36);
const pairedX = (i: number) => PAIRED_X0 + i * (CARD.w + 16) + Math.floor(i / 2) * 74;
// ---- After the title: one landscape row per pair on the left, its chip on the right.
const ROW = { w: 350, h: 96, gap: 16, top: 340, step: 112 } as const;
const finalX = (i: number) => (i % 2) * (ROW.w + ROW.gap);
const finalY = (i: number) => ROW.top + ACTORS[i].pair * ROW.step;
// ---- The right column.
const COL_X = 800;
const PLAQUE_TOP = 76;
const TITLE_TOP = 140;
const TITLE_SIZE = 100;

/**
 * s01-hook «Seis actores, tres parejas». The case stamp from the first frame; on `cards` six actor cards land face
 * down on a table («nadie te dice quién ataca»); on `pairs` they turn over one by one with their names and, on «dos en
 * dos», gather into three pairs. Before 12 s the table gives way: each pair lines up as a row on the left, «Seis
 * actores, / tres parejas» lands on the right under «SY0-701 · 2.1», and the promise follows as three chips in the
 * pairs' colours, each lit on its word («poco», «mucho», «dentro») together with its pair.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const cardsAt = props.cue('cards');
  const pairsAt = props.cue('pairs');
  const gatherAt = wordFrame(S, 's01-01', 'dos', 0) - 4;
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);
  const lastWord = props.segments[props.segments.length - 1].to;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const tableIn = progress(frame, cardsAt - 12, 16);
  const gather = progress(frame, gatherAt, 20, EASE.inOut);
  const glide = progress(frame, titleAt - 16, 28, EASE.inOut);

  // While its chip is the newest, a pair glows; earlier pairs keep a soft light.
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>

      {/* The table */}
      <div
        style={{
          position: 'absolute',
          left: TABLE.x,
          top: TABLE.y,
          width: TABLE.w,
          height: TABLE.h,
          borderRadius: 40,
          background: `radial-gradient(ellipse at 50% 40%, #1b2a44 0%, ${C.ink900} 75%)`,
          border: `2px solid ${C.ink700}`,
          opacity: tableIn * (1 - glide),
        }}
      />

      {/* The six cards */}
      {ACTORS.map((a, i) => {
        const land = progress(frame, cardsAt + i * 5, 14);
        if (land <= 0) return null;
        const flip = progress(frame, pairsAt + i * 7, 14, EASE.inOut);
        const tx = mix(mix(spreadX(i), pairedX(i), gather), finalX(i), glide);
        const ty = mix(CARD.y, finalY(i), glide) + (1 - land) * 30;
        const w = mix(CARD.w, ROW.w, glide);
        const h = mix(CARD.h, ROW.h, glide);
        return (
          <div key={i} style={{ position: 'absolute', left: tx, top: ty, opacity: land }}>
            <ActorCard index={i} w={w} h={h} flip={flip} size={mix(30, 32, glide)} glow={glide > 0.5 ? chipOn[a.pair] : 0.4 * gather} />
          </div>
        );
      })}

      {/* Plate, title and promise */}
      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
          {TITLE.map((l, k) => (
            <div
              key={k}
              style={{
                fontSize: TITLE_SIZE,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.04,
                color: k === 0 ? C.textStrong : C.cyan,
                whiteSpace: 'nowrap',
                textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      ) : null}
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const e = enter(frame, chipAt[i], { distance: 16 });
        return (
          <div key={p.text} style={{ position: 'absolute', left: COL_X, top: ROW.top + i * ROW.step + (ROW.h - CHIP_H) / 2, ...e }}>
            <Pill text={p.text} on={chipOn[i]} tone={PAIR_TONES[i]} size={36} />
          </div>
        );
      })}
    </Stage>
  );
}
