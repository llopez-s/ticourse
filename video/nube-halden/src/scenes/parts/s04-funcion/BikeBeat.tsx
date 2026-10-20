import { C, FONT } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { mix } from '../../../../../engine/src/ui';
import { BIKE } from '../../../data/s04-funcion';
import { DOCK, Dock, Pass, Tracker } from '../Bike';
import { Pill, StrikeLine } from '../Labels';
import { ImageTag } from '../Tags';

const DOCK_X = 20;
const DOCK_Y = 96;
const DOCK_W = 740;
const COL_X = 800;
const ROW_Y = [92, 236, 380];

export interface BikeBeatTimes {
  bike: number;
  fixed: number;
  route: number;
  tracker: number;
  trip: number;
  pass: number;
}

/**
 * s04's image beat, tagged «imagen · no es del puerto»: the public bike in its dock (`bike`), «la arregla el servicio»
 * on «arregla». On `route` the tracker puck comes towards the bike, bounces off and «tu localizador» is struck through
 * on «localizador»; on «recorrido» the totem's screen draws the trip, «el recorrido, en la aplicación del servicio».
 * On `pass` the pass with «solo en esta ciudad».
 */
export function BikeBeat({ frame, t }: { frame: number; t: BikeBeatTimes }) {
  const dockIn = enter(frame, t.bike - 4, { distance: 20 });
  const kDock = DOCK_W / DOCK.w;
  // The tracker heads for the bike's frame, then backs off to its row.
  const come = progress(frame, t.route, 16, EASE.out);
  const back = progress(frame, t.tracker - 2, 14, EASE.inOut);
  const trackerX = mix(COL_X, DOCK_X + 520 * kDock, come * (1 - back));
  const trackerY = mix(ROW_Y[0], DOCK_Y + 280 * kDock, come * (1 - back));
  const strike = progress(frame, t.tracker + 6, 14);
  const routeDraw = progress(frame, t.trip - 2, 30, EASE.inOut);

  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: progress(frame, t.bike - 6, 14) }}>
        <ImageTag />
      </div>
      <div style={{ position: 'absolute', left: DOCK_X, top: DOCK_Y, ...dockIn }}>
        <Dock width={DOCK_W} route={routeDraw} glow={0.6 * progress(frame, t.fixed, 10) * (1 - progress(frame, t.route, 14))} />
      </div>
      {frame >= t.fixed - 4 ? (
        <div style={{ position: 'absolute', left: DOCK_X + 330 * kDock, top: DOCK_Y + DOCK.h * kDock + 18, ...enter(frame, t.fixed, { distance: 14 }) }}>
          <Pill text={BIKE.fixed} tone={C.sky} icon="gear" size={36} height={62} on={1 - 0.5 * progress(frame, t.route, 12)} />
        </div>
      ) : null}

      {frame >= t.route - 4 ? (
        <>
          <div style={{ position: 'absolute', left: trackerX, top: trackerY, opacity: progress(frame, t.route - 4, 10) }}>
            <Tracker size={84} />
          </div>
          {back > 0.01 ? (
            <div style={{ position: 'absolute', left: COL_X + 120, top: ROW_Y[0] + 16, opacity: back }}>
              <div style={{ position: 'relative', fontSize: 40, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', fontFamily: FONT.sans }}>
                {BIKE.tracker}
                <StrikeLine strike={strike} />
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {frame >= t.trip - 4 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_Y[1], ...enter(frame, t.trip, { distance: 14 }) }}>
          <Pill text={BIKE.route} tone={C.sky} icon="globe" size={34} height={66} on={progress(frame, t.trip, 10) * (1 - 0.5 * progress(frame, t.pass, 12))} />
        </div>
      ) : null}

      {frame >= t.pass - 4 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_Y[2], display: 'flex', alignItems: 'center', gap: 28, ...enter(frame, t.pass, { distance: 14 }) }}>
          <Pass width={230} glow={progress(frame, t.pass, 10)} />
          <Pill text={BIKE.pass} tone={C.sky} size={36} height={62} on={progress(frame, t.pass, 10)} />
        </div>
      ) : null}
    </>
  );
}
