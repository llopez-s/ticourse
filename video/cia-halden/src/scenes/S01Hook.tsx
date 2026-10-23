import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Sheet } from './parts/Sheet';
import { Harbour } from './parts/Ship';
import { Stage } from './kit';

/** Stamp, title, plate and promise: the exact strings of the brief. */
const STAMP = ['Autoridad Portuaria de Halden', 'caso de ejemplo', 'sin fecha'];
const TITLE = ['Qué se rompe,', 'quién toca', 'y cuánto falta'];
const PLAQUE = 'SY0-701 · 1.2';
const PROMISE = ['qué no puede romperse', 'quién la toca', 'cuánto falta'];

/** Before the title: the harbour big and centred, the sheet in front of the mouth. After: both on the left. */
const HARBOUR_BIG = { w: 1000, x: 230, y: 96 } as const;
const HARBOUR_SMALL = { w: 620, x: 0, y: 262 } as const;
const SHEET_BIG = { w: 360, x: 1300, y: 92 } as const;
const SHEET_SMALL = { w: 280, x: 476, y: 112 } as const;
const TEXT_X = 830;
const TITLE_TOP = 74;
const TITLE_SIZE = 84;
const TITLE_LH = 1.04;
const PLAQUE_TOP = TITLE_TOP + 3 * TITLE_SIZE * TITLE_LH + 14;
const CHIPS_TOP = PLAQUE_TOP + 66;

/**
 * s01-hook «Una hoja antes de atracar». The case stamp from the first frame and the harbour mouth, faint. On `ship` an
 * unnamed cargo ship comes in towards the mouth (one amber container: the dangerous goods); on `sheet` the declaration
 * lands in front of it — «qué trae · cuánto · adónde va», no shipping line, ship or figures. Before 12 s both glide to
 * the left, the three-line title lands with «SY0-701 · 1.2», and on `promise` the three chips come in one by one.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const shipAt = props.cue('ship');
  const sheetAt = props.cue('sheet');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const ghost = 0.75 * (1 - progress(frame, shipAt - 6, 22));
  const approach = progress(frame, shipAt - 6, Math.max(60, sheetAt - shipAt + 40), EASE.inOut);
  const sheetIn = enter(frame, sheetAt - 4, { distance: 30, duration: 18 });
  const sheetGlow = progress(frame, sheetAt, 14) * (1 - 0.6 * progress(frame, titleAt, 20));
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);

  const hw = mix(HARBOUR_BIG.w, HARBOUR_SMALL.w, glide);
  const hx = mix(HARBOUR_BIG.x, HARBOUR_SMALL.x, glide);
  const hy = mix(HARBOUR_BIG.y, HARBOUR_SMALL.y, glide);
  const sw = mix(SHEET_BIG.w, SHEET_SMALL.w, glide);
  const sx = mix(SHEET_BIG.x, SHEET_SMALL.x, glide);
  const sy = mix(SHEET_BIG.y, SHEET_SMALL.y, glide);

  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={STAMP} />
      </div>

      {/* The harbour mouth and the ship: faint from the first frame (never an empty stage), solid on `ship`. */}
      <div style={{ position: 'absolute', left: hx, top: hy }}>
        <Harbour width={hw} approach={approach} dim={ghost} glow={sheetGlow} />
      </div>

      {/* The declaration, in front of the mouth */}
      {frame >= sheetAt - 6 ? (
        <div style={{ position: 'absolute', left: sx, top: sy, ...sheetIn }}>
          <Sheet width={sw} glow={sheetGlow} />
        </div>
      ) : null}

      {/* The title, in three lines */}
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
            lineHeight: TITLE_LH,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
            ...titleIn,
          }}
        >
          <div>{TITLE[0]}</div>
          <div>{TITLE[1]}</div>
          <div style={{ color: C.cyan }}>{TITLE[2]}</div>
        </div>
      ) : null}
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', left: TEXT_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {/* The promise: three chips, one per chapter */}
      {PROMISE.map((p, i) => {
        const at = promiseAt + i * 10;
        if (frame < at - 2) return null;
        const on = progress(frame, at, 10) * (1 - 0.45 * (i < PROMISE.length - 1 ? progress(frame, at + 10, 10) : 0));
        return (
          <div key={p} style={{ position: 'absolute', left: TEXT_X, top: CHIPS_TOP + i * (CHIP_H + 12), ...enter(frame, at, { distance: 16 }) }}>
            <Pill text={p} tone={C.cyan} on={0.3 + 0.7 * on} size={40} height={CHIP_H} />
          </div>
        );
      })}
    </Stage>
  );
}
