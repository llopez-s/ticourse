import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { Arrow } from './parts/Arrow';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { RECEPTION, RECEPTION_ANCHORS, Reception } from './parts/Reception';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The group: the reception and the entries that reach it (group-local coordinates).
const GROUP_W = 1000;
const GROUP_H = 560;
const REC = { x: 50, y: 90, w: 900 } as const;
const RS = REC.w / RECEPTION.w;
const pt = (a: { x: number; y: number }): [number, number] => [REC.x + a.x * RS, REC.y + a.y * RS];
/** Five unlabelled entries, from outside the group to the desk (no names yet: the map comes in s02). */
const ENTRIES: { from: [number, number]; to: [number, number] }[] = [
  { from: [-30, 150], to: pt(RECEPTION_ANCHORS.mail) },
  { from: [-30, 500], to: pt(RECEPTION_ANCHORS.usb) },
  { from: [610, -20], to: pt(RECEPTION_ANCHORS.updates) },
  { from: [1030, 190], to: pt(RECEPTION_ANCHORS.phone) },
  { from: [1030, 500], to: pt(RECEPTION_ANCHORS.printer) },
];
const GROUP_X0 = Math.round((W - GROUP_W) / 2);
const GROUP_Y0 = 72;
const GROUP_SCALE1 = 0.74;
const GROUP_Y1 = 150;
// ---- The right column: plate, title and the three chips.
const COL_X = 820;
const PLAQUE_TOP = 70;
const TITLE_TOP = 136;
const TITLE_SIZE = 112;
const CHIPS_TOP = 400;
const CHIP_GAP = 16;

/** Shortens a segment by `by` px at its end, so the arrowhead stops short of the desk. */
function short(from: [number, number], to: [number, number], by = 18): [number, number] {
  const d = Math.hypot(to[0] - from[0], to[1] - from[1]);
  return [to[0] - ((to[0] - from[0]) / d) * by, to[1] - ((to[1] - from[1]) / d) * by];
}

/**
 * s01-hook «Una recepción, muchas entradas». The case stamp from the first frame; the reception of the office building
 * in schematic (counter, two screens, a phone, a printer; no names) lights on `desk`, and on «entradas» five dashed,
 * unlabelled arrows reach it from every side — «¿por cuál se cuela alguien?». Before 12 s the group glides left and
 * «Un camino / o todos» lands on the right under «SY0-701 · 2.2»; the promise follows as three chips, each lit on its
 * words («difícil», «cebo», «acceso»).
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const deskAt = props.cue('desk');
  const entriesAt = wordFrame(S, 's01-01', 'entradas') - 6;
  const sneakAt = wordFrame(S, 's01-01', 'cuela') - 4;
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p) => wordFrame(S, p.seg, p.word, p.nth) - 6);
  const lastWord = props.segments[props.segments.length - 1].to;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const recIn = 0.35 + 0.65 * progress(frame, deskAt - 6, 18);
  const deskGlow = progress(frame, deskAt, 20) * (1 - 0.5 * progress(frame, titleAt, 20));

  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const gx = mix(GROUP_X0, 24, glide);
  const gy = mix(GROUP_Y0, GROUP_Y1, glide);
  const gs = mix(1, GROUP_SCALE1, glide);

  // From «cuela», the five arrows pulse gently in turn: which one?
  const pulseOf = (i: number) => {
    if (frame < sneakAt) return 0;
    const t = ((frame - sneakAt - i * 8) % 60) / 60;
    return t < 0 ? 0 : Math.max(0, Math.sin(Math.PI * t)) * (1 - progress(frame, titleAt, 16));
  };

  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>

      {/* The reception and its entries */}
      <div style={{ position: 'absolute', left: gx, top: gy, width: GROUP_W, height: GROUP_H, transform: `scale(${gs})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: REC.x, top: REC.y, opacity: recIn }}>
          <Reception width={REC.w} glow={deskGlow} screens={0.3 + 0.5 * progress(frame, deskAt, 20)} />
        </div>
        <svg width={GROUP_W} height={GROUP_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {ENTRIES.map((e, i) => {
            const draw = progress(frame, entriesAt + i * 5, 18);
            const p = pulseOf(i);
            return (
              <g key={i}>
                {p > 0.02 ? <line x1={e.from[0]} y1={e.from[1]} x2={e.to[0]} y2={e.to[1]} stroke={alpha(C.cyan, 0.25 * p)} strokeWidth={14} strokeLinecap="round" /> : null}
                <Arrow points={[e.from, short(e.from, e.to)]} draw={draw} color={alpha(C.cyan, 0.65 + 0.35 * p)} width={4} dashed />
              </g>
            );
          })}
        </svg>
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
