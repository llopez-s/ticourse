import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { E7_LABEL, E7_STRIP } from '../data/e7';
import { PROMISE, TITLE } from '../data/s01-hook';
import { SampleCard, SandboxBox, sampleCardHeight, sandboxSlot } from './parts/SampleBox';
import { Stage, wordFrame } from './kit';

const SCENE = 's01-hook';
const W = 1728;

// The strip of E7 and the closed box share one container that slides down when the title lands.
const GROUP_Y0 = 96;
const GROUP_Y1 = 176;
const STRIP = { x: 0, y: 0, w: 1110 } as const;
const HEAD_H = 74;
const LINE = { size: 30, h: 46, padTop: 16 } as const;
const STRIP_H = HEAD_H + LINE.padTop * 2 + LINE.h * E7_STRIP.length;
const BOX = { x: 1370, y: 8, w: 330 } as const;
const CARD_W = 500;
const PROMISE_Y = 578;

const HASH_ROW = E7_STRIP.findIndex((l) => l.mark === 'hash');
const IMAGE_ROW = E7_STRIP.findIndex((l) => l.mark === 'image');
const rowTop = (i: number) => HEAD_H + LINE.padTop + i * LINE.h;
const DETAIL_INDENT = 34;

type Rect = { x: number; y: number; w: number };

/**
 * s01-hook «La copia que llamó a casa». V3's EDR lines in V7's cut, in half-light, with V7's label
 * «05-03-2026 · 02:11 UTC» and «Meridian Dynamics · aeroespacial» beside it: «esta alerta». At `sample` the
 * FILE_HASH line lights and a card peels off it — «muestra · SHA-256 9f3a2c...e1» — and drops into a closed box
 * on the right that is still OFF (dim, no label, door shut). The title lands on top (`title`), then the promise
 * in three chips (`promise`). Nothing here is dated after V3's lines.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const edrAt = props.cue('edr');
  const sampleAt = props.cue('sample');
  const titleAt = props.cue('title');
  const promiseAt = props.cue('promise');

  const wPrograma = wordFrame(SCENE, 's01-01', 'programa');
  const wAlerta = wordFrame(SCENE, 's01-01', 'alerta');
  const wMeridian = wordFrame(SCENE, 's01-01', 'Meridian');
  const wSuyo = wordFrame(SCENE, 's01-02', 'suyo');
  const wParientes = wordFrame(SCENE, 's01-02', 'parientes');

  // ---- The group (strip + box) slides down to make room for the title.
  const shift = progress(frame, titleAt - 10, 24, EASE.inOut);
  const groupY = mix(GROUP_Y0, GROUP_Y1, shift);
  const groupIn = progress(frame, 0, 14);

  // ---- Strip: half-light from the first frame; its lines light one by one at `edr`.
  const lineLit = E7_STRIP.map((_, i) => progress(frame, edrAt - 6 + i * 5, 12));
  const headGlow = windowWeight(frame, wAlerta - 4, wMeridian + 30, { ramp: 10 });
  const orgGlow = windowWeight(frame, wMeridian - 4, sampleAt + 10, { ramp: 10 });
  const imageGlow = windowWeight(frame, wPrograma - 4, wAlerta + 6, { ramp: 10 });
  const hashGlow = windowWeight(frame, sampleAt - 6, sampleAt + 54, { ramp: 10 });
  const stripLight = 0.5 + 0.3 * progress(frame, edrAt - 6, 30) - 0.12 * progress(frame, sampleAt + 50, 30);

  // ---- The card: peels off the hash line, holds a beat, flies to the slot and drops in.
  const slot = sandboxSlot(BOX.w);
  const lineRect: Rect = { x: STRIP.x + 28 + DETAIL_INDENT, y: rowTop(HASH_ROW), w: 16 * LINE.size * 0.6 };
  const hold: Rect = { x: 846, y: rowTop(HASH_ROW) - 42, w: CARD_W };
  const above: Rect = { x: BOX.x + slot.x - slot.w / 2, y: BOX.y + slot.y - sampleCardHeight(slot.w) - 2, w: slot.w };
  const inside: Rect = { ...above, y: BOX.y + slot.y + 6 };
  const pPeel = progress(frame, sampleAt - 2, 16, EASE.out);
  const pFly = progress(frame, sampleAt + 32, 20, EASE.inOut);
  const pDrop = progress(frame, sampleAt + 52, 10, EASE.in);
  const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t) });
  const card = pDrop > 0 ? lerpRect(above, inside, pDrop) : pFly > 0 ? lerpRect(hold, above, pFly) : lerpRect(lineRect, hold, pPeel);
  const cardShow = frame < sampleAt - 2 ? 0 : (0.4 + 0.6 * pPeel) * (1 - progress(frame, sampleAt + 58, 6));
  const cardGlow = windowWeight(frame, sampleAt + 6, sampleAt + 34, { ramp: 8 });
  const holding = progress(frame, sampleAt + 58, 12);
  const boxBump = windowWeight(frame, sampleAt + 56, sampleAt + 70, { ramp: 5, lead: 0 });

  // ---- Title and promise.
  const titleIn = enter(frame, titleAt, { distance: 18 });
  const chip1 = progress(frame, promiseAt - 2, 14);
  const chip2 = progress(frame, wSuyo - 6, 14);
  const chip3 = progress(frame, wParientes - 6, 14);

  return (
    <Stage>
      {/* Title */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn }}>
        <div style={{ fontSize: 76, fontWeight: 850, color: C.textStrong, lineHeight: 1.05, letterSpacing: -1 }}>{TITLE.main}</div>
        <div style={{ marginTop: 8, fontSize: 40, fontWeight: 700, color: C.cyanSoft, lineHeight: 1.1 }}>{TITLE.sub}</div>
      </div>

      <div style={{ position: 'absolute', left: 0, top: groupY, width: W, height: STRIP_H, opacity: groupIn }}>
        {/* The strip of E7 */}
        <div
          style={{
            position: 'absolute',
            left: STRIP.x,
            top: STRIP.y,
            width: STRIP.w,
            height: STRIP_H,
            boxSizing: 'border-box',
            borderRadius: 22,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            border: `2px solid ${alpha(C.cyan, 0.18 + 0.4 * headGlow)}`,
            boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}${headGlow > 0 ? `, 0 0 ${Math.round(30 * headGlow)}px ${alpha(C.cyan, 0.2 * headGlow)}` : ''}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: HEAD_H,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 26px',
              borderBottom: `2px solid ${C.ink700}`,
              background: alpha(C.ink800, 0.9),
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="bell" size={34} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0', fontSize: 32, fontWeight: 800, color: mixColor(headGlow) }}>{E7_LABEL.date}</span>
            <span style={{ fontSize: 30, color: C.faint }}>·</span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: orgGlow > 0.3 ? C.textStrong : C.text,
                textShadow: orgGlow > 0 ? `0 0 ${Math.round(18 * orgGlow)}px ${alpha(C.cyan, 0.6 * orgGlow)}` : undefined,
              }}
            >
              {E7_LABEL.org}
            </span>
          </div>
          {E7_STRIP.map((line, i) => {
            const glow = i === HASH_ROW ? hashGlow : i === IMAGE_ROW ? imageGlow : 0;
            const tint = i === HASH_ROW ? C.amber : C.cyan;
            const op = clamp01(stripLight * (0.55 + 0.45 * lineLit[i]) + 0.5 * glow);
            const detail = line.kind === 'detail';
            return (
              <div key={i} style={{ position: 'absolute', left: 0, top: rowTop(i), width: STRIP.w, height: LINE.h }}>
                {glow > 0.01 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 16 + (detail ? DETAIL_INDENT : 0),
                      top: 2,
                      width: line.text.length * LINE.size * 0.6 + 26,
                      height: LINE.h - 4,
                      borderRadius: 9,
                      background: alpha(tint, 0.14 * glow),
                      boxShadow: `inset 4px 0 0 ${alpha(tint, 0.9 * glow)}`,
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: 'absolute',
                    left: 28 + (detail ? DETAIL_INDENT : 0),
                    top: 0,
                    height: LINE.h,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: FONT.mono, fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0',
                    fontSize: LINE.size,
                    fontWeight: detail ? 600 : 500,
                    whiteSpace: 'pre',
                    color: glow > 0.3 ? (i === HASH_ROW ? '#fcd34d' : C.textStrong) : detail ? C.text : C.muted,
                    opacity: op,
                  }}
                >
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* The card, behind the box (it disappears into the slot) */}
        {cardShow > 0.001 ? (
          <div style={{ position: 'absolute', left: card.x, top: card.y }}>
            <SampleCard width={card.w} show={cardShow} glow={cardGlow} />
          </div>
        ) : null}

        {/* The closed box, still off */}
        <div style={{ position: 'absolute', left: BOX.x, top: BOX.y, transform: `translateY(${boxBump * 4}px)` }}>
          <SandboxBox width={BOX.w} lit={0} holding={holding} pulse={pulse(frame, fps, 0.4)} />
        </div>
      </div>

      {/* The promise */}
      {frame >= promiseAt - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: PROMISE_Y,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            gap: 26,
            fontFamily: FONT.sans,
            fontSize: 40,
            fontWeight: 750,
            whiteSpace: 'nowrap',
          }}
        >
          <PromiseChip p={chip1} color={C.cyan}>
            <span style={{ color: C.cyanSoft }}>{PROMISE.silent}</span>
          </PromiseChip>
          <PromiseChip p={chip2} color={C.rose}>
            <span>
              <span style={{ color: C.roseSoft }}>{PROMISE.own}</span>
              <span style={{ color: C.muted }}>{` ${PROMISE.noise}`}</span>
            </span>
          </PromiseChip>
          <PromiseChip p={chip3} color={C.emerald}>
            <span style={{ color: '#6ee7b7' }}>{PROMISE.kin}</span>
          </PromiseChip>
        </div>
      ) : null}
    </Stage>
  );
}

/** The date label goes from cyan to a brighter cyan while the voice says «esta alerta». */
function mixColor(glow: number): string {
  return glow > 0.4 ? C.cyanSoft : C.cyan;
}

function PromiseChip({ p, color, children }: { p: number; color: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 70,
        padding: '0 30px',
        borderRadius: 999,
        border: `2px solid ${alpha(color, 0.6)}`,
        background: alpha(color, 0.09),
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      {children}
    </div>
  );
}
