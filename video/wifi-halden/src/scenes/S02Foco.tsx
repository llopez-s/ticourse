import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { DATES, FIXES, NAMES } from '../data/s02-foco';
import { focoBeats } from './parts/s02-foco/beats';
import { DateStamp, FIX_ROW_H, NamePlate, StillLines, StrikeRow, Why, WorksRow } from './parts/s02-foco/Fixes';
import { LAPTOP, PLAN_W } from './parts/s02-foco/geometry';
import { MEASURES_H, Measures, PANEL, ScanWindow } from './parts/s02-foco/Panel';
import { PlanLayer } from './parts/s02-foco/PlanLayer';
import { Stage } from './kit';

const W = STAGE.width;

/** The plan starts centred on the stage and steps left when the right column is needed. */
const PLAN_DX = Math.round((W - PLAN_W) / 2) - 8;

// ---- Right column (from `scan`): everything in it sits below the engine's top-centre band.
const COL_X = W - PANEL.w - 16;
const PANEL_Y = 236;
const ROW_A_Y = PANEL_Y + PANEL.h + 20;
const ROW_B_Y = ROW_A_Y + FIX_ROW_H + 6;
const WORKS_Y = 566;
/** Once the box holds the two measurements: what works moves up, the close goes under it. */
const WORKS_Y_END = PANEL_Y + MEASURES_H + 20;
const STILL_Y = WORKS_Y_END + 62 + 20;

// ---- The two exam names: big over the plan while they are said, then a small title in the corner.
const NAME_SIZE = 54;
const NAME_Y = 30;
const NAME_X = [493, 927] as const;
const NAME_SMALL = 0.55;
const NAME_CORNER: [number, number][] = [
  [16, 12],
  [16, 12 + Math.round(NAME_SIZE * 1.46 * NAME_SMALL) + 8],
];
/** Tuesday's and Wednesday's strips, to the right of the corner names. */
const STAMP_X = 274;
const STAMP_Y = [10, 74] as const;

/**
 * s02-foco «Un foco que alumbra al vecino». The terminal's plan, seen from above, is there from
 * the first frame. On `survey` a cyan marker walks it and the heat map blooms behind (red and
 * orange next to each access point); SITE SURVEY and HEAT MAP land as they are said and then step
 * into the corner. On `spill` two lobes leave the terminal's limit, cross the street and reach the
 * visitors' car park (amber dashed outline: the finding). On `floodlight` a dock floodlight shows
 * on the first antenna, its cone being that same lobe. On `scan` the plan steps left, the test
 * laptop appears in the car park and its list of networks opens on the right: one row,
 * «HALDEN-OPS · WPA2 · −55 dBm». SILENT PAGER's message takes the top band; under it, «ocultar el
 * nombre (SSID)» is struck out (`hide`): the name's slot goes empty while the lamp and the reading
 * stay, and the name is back as soon as a crane tablet joins. On `fix` «una clave más larga» is
 * struck too («no baja la señal»), the lamp dims and turns inwards with its lobe, and
 * «colocación y potencia» is what works. Tuesday's strip (15-12): the second antenna follows.
 * Wednesday's (16-12, `remeasure`): the box now holds the two measurements, «14-12 · −55 dBm» and
 * «16-12 · −78 dBm», both still before the exam card. `still`: «Se oye menos, pero se oye» over a
 * weak blue haze that still reaches the car park.
 */
export function S02Foco(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = focoBeats(frame, fps, props);
  const { at } = b;

  const panelIn = enter(frame, at.panelAt, { distance: 22, duration: 16, axis: 'x' });
  const rowAIn = enter(frame, at.hideAt - 4, { distance: 14, duration: 14 });
  const whyAIn = enter(frame, at.whyHideAt, { distance: 10, duration: 14 });
  const rowBIn = enter(frame, at.fixAt - 4, { distance: 14, duration: 14 });
  const whyBIn = enter(frame, at.whyLongerAt, { distance: 10, duration: 14 });
  const worksIn = enter(frame, at.worksAt, { distance: 14, duration: 14 });
  const stamp15 = enter(frame, at.tuesdayAt, { distance: 14, duration: 16 });
  const stamp16 = enter(frame, at.remeasureAt - 4, { distance: 14, duration: 16 });
  const cornerDim = 1 - 0.3 * progress(frame, at.panelAt, 16, EASE.inOut);

  return (
    <Stage>
      <PlanLayer b={b} dx={PLAN_DX * (1 - b.slide)} />

      {/* SITE SURVEY · HEAT MAP */}
      {[NAMES.survey, NAMES.heat].map((name, i) =>
        b.names[i] > 0.001 ? (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: mix(NAME_X[i], NAME_CORNER[i][0], b.toCorner),
              top: mix(NAME_Y, NAME_CORNER[i][1], b.toCorner) + (1 - b.names[i]) * 14,
              opacity: b.names[i] * cornerDim,
              transform: `scale(${mix(1, NAME_SMALL, b.toCorner)})`,
              transformOrigin: '0 0',
            }}
          >
            <NamePlate text={name} size={NAME_SIZE} />
          </div>
        ) : null,
      )}

      {/* From the laptop in the car park to what it hears */}
      {panelIn.opacity > 0.001 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={STAGE.height} opacity={panelIn.opacity}>
          <path d={`M ${LAPTOP.x + 46} ${LAPTOP.y - 30} C ${LAPTOP.x + 110} ${LAPTOP.y - 110}, ${COL_X - 70} ${PANEL_Y + 70}, ${COL_X - 6} ${PANEL_Y + 70}`} fill="none" stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeLinecap="round" strokeDasharray="4 10" />
        </svg>
      ) : null}

      {/* The laptop's list of networks; later, in its place, the two measurements */}
      {frame >= at.panelAt - 2 && b.swap < 0.999 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PANEL_Y, opacity: panelIn.opacity * (1 - b.swap), transform: panelIn.transform }}>
          <ScanWindow row={b.row} value={b.value} hidden={b.hidden} seen={b.seen} />
        </div>
      ) : null}
      {b.swap > 0.001 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PANEL_Y, opacity: b.swap }}>
          <Measures second={b.second} value={b.secondValue} glow={b.secondGlow} />
        </div>
      ) : null}

      {/* What does not fix it */}
      {frame >= at.hideAt - 6 && b.fixesOut < 0.999 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_A_Y, width: PANEL.w, opacity: 1 - b.fixesOut }}>
          <div style={{ ...rowAIn }}>
            <StrikeRow text={FIXES.hide.text} strike={b.strikeHide} />
          </div>
          {frame >= at.whyHideAt - 2 && b.whyHideOut < 0.999 ? (
            <div style={{ opacity: whyAIn.opacity * (1 - b.whyHideOut), transform: whyAIn.transform }}>
              <Why lines={FIXES.hide.why} />
            </div>
          ) : null}
        </div>
      ) : null}
      {frame >= at.fixAt - 6 && b.fixesOut < 0.999 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_B_Y, width: PANEL.w, opacity: 1 - b.fixesOut }}>
          <div style={{ ...rowBIn }}>
            <StrikeRow text={FIXES.longer.text} strike={b.strikeLonger} />
          </div>
          {frame >= at.whyLongerAt - 2 ? (
            <div style={{ ...whyBIn }}>
              <Why lines={FIXES.longer.why} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* What does: «colocación y potencia» */}
      {frame >= at.worksAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: mix(WORKS_Y, WORKS_Y_END, b.worksUp), ...worksIn }}>
          <WorksRow lit={b.worksLit} />
        </div>
      ) : null}

      {/* Tuesday 15-12 and Wednesday 16-12 */}
      {frame >= at.tuesdayAt - 2 ? (
        <div style={{ position: 'absolute', left: STAMP_X, top: STAMP_Y[0], ...stamp15 }}>
          <DateStamp {...DATES.adjust} tone={C.sky} />
        </div>
      ) : null}
      {frame >= at.remeasureAt - 6 ? (
        <div style={{ position: 'absolute', left: STAMP_X, top: STAMP_Y[1], ...stamp16 }}>
          <DateStamp {...DATES.remeasure} tone={C.cyan} />
        </div>
      ) : null}

      {/* The chapter's close */}
      {b.still[0] > 0.001 ? (
        <div style={{ position: 'absolute', left: COL_X + 4, top: STILL_Y }}>
          <StillLines show={b.still} />
        </div>
      ) : null}
    </Stage>
  );
}
