import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { APPS, PLAQUE, PROMISE, ROOM, SOFTWARE, STAMP, TITLE } from '../data/s01-hook';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { DataCenter, vmAnchor } from './parts/s01-hook/DataCenter';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The group: the data centre, the two app labels and the «software» chip (group-local coordinates).
const GROUP_W = 1320;
const GROUP_H = 560;
const ROOM_Y = 20;
const LABEL_X = 700;
const GROUP_X0 = Math.round((W - GROUP_W) / 2);
const GROUP_Y0 = 78;
const GROUP_SCALE1 = 0.6;
const GROUP_Y1 = 236;
// ---- The right column: plate, title and the three chips.
const COL_X = 860;
const PLAQUE_TOP = 64;
const TITLE_TOP = 134;
const TITLE_SIZE = 84;
const CHIPS_TOP = 380;
const CHIP_GAP = 16;

/**
 * s01-hook «Dos aplicaciones de oficina». The stamp «Autoridad Portuaria de Halden · Sistemas · propuesta · sin fecha»
 * from the first frame; the port's data centre in schematic (two hosts, eight VMs, no count written) switches on with
 * `datacenter`; on `two-apps` two VMs light and their labels slide out — «tablón interno de anuncios» and «expedientes de
 * la plantilla · RR. HH.». On «contenedores» the chip «a contenedores de software» lands and glows on `not-shipping`
 * (no shipping container anywhere). On `title` (before 12 s) the group glides left and «Contenedores, VMs / y quién
 * gestiona» lands on the right under «SY0-701 · 3.1»; the promise follows as three chips, each lit on its word.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const roomAt = props.cue('datacenter');
  const appsAt = props.cue('two-apps');
  const softAt = wordFrame(S, 's01-01', 'contenedores') - 6;
  const notShipAt = props.cue('not-shipping');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p) => wordFrame(S, p.seg, p.word) - 6);
  const lastWord = props.segments[props.segments.length - 1].to;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const roomShow = 0.4 + 0.6 * progress(frame, roomAt - 6, 18);
  const on = progress(frame, roomAt, 30);
  const lit = APPS.map((_, k) => progress(frame, appsAt + k * 10, 14) * (1 - 0.35 * progress(frame, titleAt + 20, 20)));

  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const gx = mix(GROUP_X0, 24, glide);
  const gy = mix(GROUP_Y0, GROUP_Y1, glide);
  const gs = mix(1, GROUP_SCALE1, glide);

  const softIn = enter(frame, softAt, { distance: 14, duration: 14 });
  const softOn = progress(frame, notShipAt, 12) * (1 - 0.6 * progress(frame, titleAt, 16));

  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>

      {/* The data centre, the two apps and the software chip */}
      <div style={{ position: 'absolute', left: gx, top: gy, width: GROUP_W, height: GROUP_H, transform: `scale(${gs})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: 0, top: ROOM_Y }}>
          <DataCenter label={ROOM} show={roomShow} on={on} apps={APPS} lit={lit} />
        </div>
        <svg width={GROUP_W} height={GROUP_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {APPS.map((a, k) => {
            const p = vmAnchor(a.row, a.col);
            const draw = progress(frame, appsAt + k * 10 + 4, 12);
            return draw > 0.01 ? (
              <line key={k} x1={p.x + 6} y1={ROOM_Y + p.y} x2={p.x + 6 + (LABEL_X - p.x - 16) * draw} y2={ROOM_Y + p.y} stroke={alpha(C.cyan, 0.8)} strokeWidth={4} strokeLinecap="round" />
            ) : null;
          })}
        </svg>
        {APPS.map((a, k) => {
          const p = vmAnchor(a.row, a.col);
          const e = enter(frame, appsAt + k * 10 + 8, { distance: 14, duration: 14 });
          return (
            <div key={a.text} style={{ position: 'absolute', left: LABEL_X, top: ROOM_Y + p.y - CHIP_H / 2, ...e }}>
              <Pill text={a.text} tone={C.cyan} icon="app" on={lit[k]} size={32} />
            </div>
          );
        })}
        {frame >= softAt - 2 ? (
          <div style={{ position: 'absolute', left: LABEL_X, top: ROOM_Y + 470, ...softIn }}>
            <Pill text={SOFTWARE} tone={C.emerald} icon="layers" on={softOn} size={32} />
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
                lineHeight: 1.08,
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
