import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { LIST_TITLE, MISSING, PLAQUE, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { InventoryList } from './parts/Inventory';
import { NAS, Nas, Shelf } from './parts/Nas';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- The group: the office shelf with the disk, and the list beside it (group-local coordinates).
const GROUP_W = 1140;
const GROUP_H = 500;
const SHELF = { x: 0, y: 330, w: 450 } as const;
const NAS_W = 250;
const NAS_H = (NAS_W * NAS.h) / NAS.w;
const NAS_X = 70;
const NAS_Y = SHELF.y - NAS_H;
const LIST = { x: 540, y: 0, w: 600, rows: 7 } as const;
const GROUP_SCALE0 = 1.15;
const GROUP_X0 = Math.round((W - GROUP_W * GROUP_SCALE0) / 2);
const GROUP_Y0 = 76;
const GROUP_SCALE1 = 0.8;
const GROUP_Y1 = 140;
// ---- The right column: plate, title and the three chips.
const COL_X = 950;
const PLAQUE_TOP = 92;
const TITLE_TOP = 158;
const TITLE_SIZE = 100;
const CHIPS_TOP = 392;
const CHIP_GAP = 16;

/** Binders standing on the shelf next to the disk (x, height). */
const BINDERS: [number, number][] = [
  [356, 120],
  [384, 104],
  [410, 128],
];

/**
 * s01-hook «Un aparato que nadie apuntó». The case stamp from the first frame; an office shelf with a small network
 * disk whose lights start blinking on `box`. On `missing` the port's «lista de equipos» comes in beside it and a cyan
 * highlight runs down its rows without stopping: a dashed line from the disk to the list ends in a rose cross and
 * «no aparece». Before 12 s the group glides left and «De la lista / al desguace» lands on the right under
 * «SY0-701 · 4.2»; the promise follows as three chips, each lit on its words.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const boxAt = props.cue('box');
  const missingAt = props.cue('missing');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p) => wordFrame(S, p.seg, p.word, p.nth) - 6);
  const lastWord = props.segments[props.segments.length - 1].to;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const officeIn = progress(frame, 0, 16);
  const running = progress(frame, boxAt - 4, 8);
  const nasGlow = progress(frame, boxAt, 16) * (1 - 0.6 * progress(frame, missingAt + 40, 20));

  const listIn = enter(frame, missingAt - 10, { distance: 18, duration: 16 });
  const scanFrom = missingAt + 8;
  const SCAN = 42;
  const scan = frame >= scanFrom && frame < scanFrom + SCAN + 8 ? Math.min(LIST.rows - 0.01, ((frame - scanFrom) / SCAN) * LIST.rows) : null;
  const lineDraw = progress(frame, scanFrom + SCAN, 14);
  const crossIn = progress(frame, scanFrom + SCAN + 10, 10);

  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const gx = mix(GROUP_X0, 0, glide);
  const gy = mix(GROUP_Y0, GROUP_Y1, glide);
  const gs = mix(GROUP_SCALE0, GROUP_SCALE1, glide);

  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });

  // The dashed line from the disk's right side to the list's left edge (group-local).
  const lx1 = NAS_X + NAS_W + 10;
  const ly = NAS_Y + NAS_H / 2;
  const lx2 = LIST.x - 14;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>

      {/* The group: shelf, disk, list */}
      <div style={{ position: 'absolute', left: gx, top: gy, width: GROUP_W, height: GROUP_H, transform: `scale(${gs})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        <div style={{ position: 'absolute', inset: 0, opacity: officeIn }}>
          <div style={{ position: 'absolute', left: SHELF.x, top: SHELF.y }}>
            <Shelf width={SHELF.w} />
          </div>
          <svg width={SHELF.w} height={SHELF.y} style={{ position: 'absolute', left: SHELF.x, top: 0, overflow: 'visible' }}>
            {BINDERS.map(([x, h], i) => (
              <rect key={i} x={x} y={SHELF.y - h} width={24} height={h} rx={3} fill={[C.ink600, C.ink700, C.ink500][i]} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
            ))}
          </svg>
          <div style={{ position: 'absolute', left: NAS_X, top: NAS_Y }}>
            <Nas width={NAS_W} frame={frame} running={running} glow={nasGlow} tone={crossIn > 0.5 ? C.rose : C.cyan} />
          </div>
        </div>

        {frame >= missingAt - 12 ? (
          <div style={{ position: 'absolute', left: LIST.x, top: LIST.y, ...listIn }}>
            <InventoryList width={LIST.w} rows={LIST.rows} title={LIST_TITLE} scan={scan} />
          </div>
        ) : null}

        {lineDraw > 0.01 ? (
          <svg width={GROUP_W} height={GROUP_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={lx1} y1={ly} x2={mix(lx1, lx2 - 30, lineDraw)} y2={ly} stroke={alpha(C.rose, 0.85)} strokeWidth={4} strokeDasharray="12 10" />
          </svg>
        ) : null}
        {crossIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: lx2 - 52,
              top: ly - 26,
              width: 52,
              height: 52,
              borderRadius: 26,
              background: C.roseDeep,
              border: `3px solid ${C.rose}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: crossIn,
              transform: `scale(${0.7 + 0.3 * crossIn})`,
            }}
          >
            <Icon name="x" size={32} color={C.rose} strokeWidth={3} />
          </div>
        ) : null}
        {crossIn > 0.01 ? (
          <div style={{ position: 'absolute', left: NAS_X + NAS_W / 2 - 110, top: SHELF.y + 84, width: 220, display: 'flex', justifyContent: 'center', opacity: crossIn }}>
            <Pill text={MISSING} icon="alert" tone={C.rose} size={36} height={60} on={crossIn} />
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
