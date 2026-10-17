import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { NIGHT, PLAQUE, PROMISE, STAMP, TITLE, WINDOWS } from '../data/s01-hook';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { ToolWindow } from './parts/Tools';
import { ONCALL, OnCall } from './parts/s01-hook/OnCall';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The group: five windows around the on-call person (group-local coordinates).
const GROUP_W = 1180;
const GROUP_H = 520;
const WIN_W = 280;
const WIN_H = 170;
const WIN_POS = [
  { x: 0, y: 196 },
  { x: 170, y: 6 },
  { x: 450, y: 0 },
  { x: 730, y: 6 },
  { x: 900, y: 196 },
];
const ONCALL_W = 320;
const ONCALL_X = (GROUP_W - ONCALL_W) / 2;
const ONCALL_Y = GROUP_H - (ONCALL_W * ONCALL.h) / ONCALL.w;
/** Where the alert pops (group-local), between the top window and the person's head. */
const ALERT = { x: GROUP_W / 2, y: 214 } as const;
const CARD_W = 116;
const CARD_H = 58;
/** Width (%) of the value as pasted into each window: never the same twice. */
const PASTE_W = [74, 62, 86, 50, 70];
const GROUP_SCALE0 = 1.12;
const GROUP_X0 = Math.round((W - GROUP_W * GROUP_SCALE0) / 2);
const GROUP_Y0 = 74;
const GROUP_SCALE1 = 0.78;
const GROUP_Y1 = 128;
// ---- The right column: plate, title and the three chips.
const COL_X = 960;
const PLAQUE_TOP = 92;
const TITLE_TOP = 158;
const TITLE_SIZE = 100;
const CHIPS_TOP = 392;
const CHIP_GAP = 16;

const centre = (i: number) => ({ x: WIN_POS[i].x + WIN_W / 2, y: WIN_POS[i].y + WIN_H / 2 + 10 });

/**
 * s01-hook «Cinco pantallas para lo mismo». The case stamp from the first frame and, on `night`, «una noche · sin
 * fecha»; the on-call person sits at the desk, seen from behind, and on «alerta» a rose alert pops over the desk. On
 * `screens` five windows open around the person (EDR, identity provider, SOC queue, mail, phone — no products) and a
 * small data card hops from one to the next, pasted by hand: each paste comes out a different length, and from `copy`
 * the copies that differ from the first turn amber while the stopwatch on the desk keeps turning (no digits). Before
 * 12 s the group glides left and «Una tarea / o un flujo» lands on the right under «SY0-701 · 4.7»; the promise
 * follows as three chips, each lit on its words.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const nightAt = props.cue('night');
  const alertAt = wordFrame(S, 's01-01', 'alerta') - 4;
  const screensAt = props.cue('screens');
  const copyAt = props.cue('copy');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p) => wordFrame(S, p.seg, p.word, p.nth) - 6);
  const lastWord = props.segments[props.segments.length - 1].to;

  // The card leaves the alert, then lands in each window in turn.
  const hopStart = screensAt + 18;
  const HOP = 22;
  const arrive = WINDOWS.map((_, i) => hopStart + (i + 1) * HOP);
  const path = [ALERT, ...WINDOWS.map((_, i) => centre(i))];
  let card: { x: number; y: number } | null = null;
  if (frame >= hopStart && frame < arrive[arrive.length - 1] + 14) {
    const k = Math.min(WINDOWS.length - 1, Math.max(0, Math.floor((frame - hopStart) / HOP)));
    const t = progress(frame, hopStart + k * HOP, HOP - 4, EASE.inOut);
    const a = path[k];
    const b = path[k + 1];
    card = { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) - Math.sin(Math.PI * t) * 60 };
  }
  const cardOut = progress(frame, arrive[arrive.length - 1], 12);

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const nightIn = enter(frame, nightAt - 4, { distance: 12, duration: 16 });
  const personIn = progress(frame, nightAt + 4, 20);
  const alertIn = progress(frame, alertAt, 12);
  const alertOut = progress(frame, hopStart, 14);
  const spin = Math.max(0, frame - screensAt) / 110;

  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const gx = mix(GROUP_X0, 0, glide);
  const gy = mix(GROUP_Y0, GROUP_Y1, glide);
  const gs = mix(GROUP_SCALE0, GROUP_SCALE1, glide);

  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      {/* Case stamp and «una noche · sin fecha» */}
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={stampIn}>
          <CaseStamp what={STAMP.what} kind={STAMP.kind} />
        </div>
        {frame >= nightAt - 6 ? (
          <div style={nightIn}>
            <Pill text={NIGHT} tone={C.muted} size={32} height={56} weight={700} color={C.text} />
          </div>
        ) : null}
      </div>

      {/* The group: windows, the person, the alert and the hopping card */}
      <div style={{ position: 'absolute', left: gx, top: gy, width: GROUP_W, height: GROUP_H, transform: `scale(${gs})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: ONCALL_X, top: ONCALL_Y, opacity: personIn }}>
          <OnCall width={ONCALL_W} spin={spin} glow={progress(frame, screensAt, 20)} />
        </div>

        {WINDOWS.map((w, i) => {
          const at = screensAt - 4 + i * 6;
          if (frame < at - 2) return null;
          const e = enter(frame, at, { distance: 18, duration: 16 });
          const pasted = progress(frame, arrive[i] - 2, 8);
          const differs = i > 0 ? progress(frame, Math.max(copyAt, arrive[i]), 10) : 0;
          const on = 0.35 + 0.65 * Math.max(pasted * (1 - progress(frame, arrive[i] + 10, 14)), 0.2);
          return (
            <div key={w.label} style={{ position: 'absolute', left: WIN_POS[i].x, top: WIN_POS[i].y, ...e }}>
              <ToolWindow
                w={WIN_W}
                h={WIN_H}
                label={w.label}
                icon={w.icon}
                on={on}
                tone={differs > 0.5 ? C.amber : C.sky}
                paste={{ on: pasted, width: PASTE_W[i], tone: differs > 0.5 ? C.amber : C.cyan }}
              />
            </div>
          );
        })}

        {/* the alert over the desk */}
        {alertIn > 0.01 && alertOut < 0.99 ? (
          <div
            style={{
              position: 'absolute',
              left: ALERT.x - 90,
              top: ALERT.y - 28,
              opacity: alertIn * (1 - alertOut),
              transform: `scale(${0.8 + 0.2 * alertIn})`,
            }}
          >
            <Pill text="alerta" icon="bell" tone={C.rose} size={34} height={56} on={1} />
          </div>
        ) : null}

        {/* the data card being copied by hand */}
        {card && cardOut < 0.99 ? (
          <div
            style={{
              position: 'absolute',
              left: card.x - CARD_W / 2,
              top: card.y - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              boxSizing: 'border-box',
              borderRadius: 10,
              border: `2px solid ${C.cyan}`,
              background: C.ink800,
              boxShadow: `0 8px 24px ${alpha('#000000', 0.5)}, 0 0 18px ${alpha(C.cyan, 0.35)}`,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              opacity: 1 - cardOut,
            }}
          >
            {[80, 56].map((wd, k) => (
              <div key={k} style={{ height: 10, width: `${wd}%`, borderRadius: 5, background: alpha(C.cyan, k === 0 ? 0.8 : 0.4) }} />
            ))}
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
