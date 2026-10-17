import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { BaselineSheet, sheetHeight } from './parts/BaselineSheet';
import { BridgeArt, CloudArt, LaptopArt, PhoneArt, ServerArt, SwitchArt } from './parts/Devices';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The group: the sheet in front, six silhouettes behind it (group-local coordinates).
const GROUP_W = 780;
const GROUP_H = 520;
const SHEET_W = 440;
const SHEET_H = sheetHeight(SHEET_W);
const SHEET = { x: (GROUP_W - SHEET_W) / 2, y: (GROUP_H - SHEET_H) / 2 + 6 } as const;
const FLEET: { x: number; y: number; el: ReactNode }[] = [
  { x: 0, y: 28, el: <LaptopArt width={150} /> },
  { x: 26, y: 196, el: <ServerArt width={104} /> },
  { x: 40, y: 378, el: <PhoneArt width={66} /> },
  { x: 630, y: 30, el: <CloudArt width={150} /> },
  { x: 622, y: 232, el: <SwitchArt width={156} /> },
  { x: 598, y: 392, el: <BridgeArt width={182} /> },
];
/** The group is drawn at this scale, so the sheet reads large. */
const GROUP_SCALE = 1.14;
const GROUP_X0 = Math.round((W - GROUP_W * GROUP_SCALE) / 2);
const GROUP_X1 = 0;
const GROUP_Y = 70;
// ---- The stamp: centred over the stage at first, left-aligned once the group has glided.
const STAMP_W = 760; // approximate, only to centre it
const STAMP_X0 = Math.round((W - STAMP_W) / 2);
// ---- The right column: plate, title and the three chips.
const COL_X = 940;
const PLAQUE_TOP = 92;
const TITLE_TOP = 158;
const TITLE_SIZE = 96;
const CHIPS_TOP = 392;
const CHIP_GAP = 16;

/**
 * s01-hook «Un papel, muchas máquinas». From the first frame the case stamp sits centred; on `sheet` the secure
 * baseline arrives as a pale sheet, its three lines writing in one by one; on `fleet` the port's six kinds of machine
 * light up behind it in silhouette, no names (laptop, server, phone, cloud, switch, drawbridge). Before 12 s
 * (`title`) the group glides left and «Baseline y hardening» lands on the right under the plate «SY0-701 · 4.1»;
 * the promise follows as three chips, one per chapter, each lit on its words.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const stampAt = -6;
  const sheetAt = props.cue('sheet') - 2;
  const fleetAt = props.cue('fleet') - 4;
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, p.seg, p.word) - 6;
    return i === 0 ? Math.min(at, props.cue('promise') + 14) : at;
  });
  const lastWord = wordFrame(S, 's01-03', 'parar') + 20;

  const stampIn = enter(frame, stampAt, { distance: 16, duration: 16 });
  const sheetIn = enter(frame, sheetAt, { distance: 26, duration: 20 });
  const lineIn = [0, 1, 2].map((i) => progress(frame, sheetAt + 12 + i * 10, 14));
  const sheetGlow = 0.3 + 0.7 * progress(frame, sheetAt + 6, 24) * (1 - 0.5 * progress(frame, fleetAt, 20));
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const groupX = mix(GROUP_X0, GROUP_X1, glide);
  const stampX = mix(STAMP_X0, 0, glide);

  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      {/* Case stamp */}
      <div style={{ position: 'absolute', left: stampX, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>

      {/* The fleet behind, then the sheet */}
      <div style={{ position: 'absolute', left: groupX, top: GROUP_Y, width: GROUP_W, height: GROUP_H, transform: `scale(${GROUP_SCALE})`, transformOrigin: '0 0' }}>
        {FLEET.map((f, i) => {
          const at = fleetAt + i * 5;
          if (frame < at - 2) return null;
          const p = progress(frame, at, 16);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: f.x,
                top: f.y,
                opacity: 0.62 * p,
                transform: `scale(${0.9 + 0.1 * p})`,
                filter: `drop-shadow(0 0 10px ${alpha(C.cyan, 0.25)})`,
              }}
            >
              {f.el}
            </div>
          );
        })}
        {frame >= sheetAt - 2 ? (
          <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y, ...sheetIn }}>
            <div style={{ transform: 'rotate(-2deg)' }}>
              <BaselineSheet width={SHEET_W} lineIn={lineIn} glow={sheetGlow} />
            </div>
          </div>
        ) : null}
      </div>

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
          <div key={p.text} style={{ position: 'absolute', left: COL_X, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), ...e }}>
            <Pill icon={p.icon} text={p.text} on={chipOn[i]} tone={C.cyan} />
          </div>
        );
      })}
    </Stage>
  );
}
