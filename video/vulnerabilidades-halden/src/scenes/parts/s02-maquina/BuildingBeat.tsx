import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { DRAWER, HOLE, WALL_LABEL, WALL_SUB } from '../../../data/s02-maquina';
import { Caption, Pill } from '../Labels';
import { RB, RB_ANCHORS, RentalBuilding } from '../RentalBuilding';
import { ImageTag } from '../Tags';

const BUILD = { x: 60, y: 70, w: 700 } as const;
const K = BUILD.w / RB.w;
const COL_X = 860;
const ROW_Y = [118, 286, 446] as const;

export interface BuildingBeatTimes {
  building: number;
  wall: number;
  wallWord: number;
  hole: number;
  holeWord: number;
  drawer: number;
  drawerWord: number;
  intactWord: number;
}

/**
 * s02's first beat: the rental building in section («imagen · no es del puerto»). On `wall` the party walls and the
 * slab light sky and «hipervisor» lands on the right with a leader to the slab; on `hole` a rose hole opens in the
 * upper party wall («salirte del tuyo»); on `drawer` the new tenant downstairs opens a drawer of amber papers, and on
 * «Ahí no has roto…» an emerald «ninguna pared rota». Stage-local coordinates.
 */
export function BuildingBeat({ frame, t }: { frame: number; t: BuildingBeatTimes }) {
  const bIn = enter(frame, t.building - 4, { distance: 20, duration: 18 });
  const tagIn = enter(frame, t.building + 6, { distance: 12 });
  const wall = progress(frame, t.wall, 16) * (1 - 0.55 * progress(frame, t.hole, 16));
  const hole = progress(frame, t.hole + 2, 18);
  const drawer = progress(frame, t.drawer + 4, 22);
  const slab: [number, number] = [BUILD.x + RB_ANCHORS.slab[0] * K, BUILD.y + RB_ANCHORS.slab[1] * K];
  const leader = progress(frame, t.wall + 6, 14);
  const row = (at: number) => (frame >= at - 4 ? enter(frame, at, { distance: 16 }) : null);
  const r1 = row(t.wall);
  const r2 = row(t.hole);
  const r3 = row(t.drawer);
  const onHole = progress(frame, t.holeWord - 4, 10) * (1 - 0.5 * progress(frame, t.drawer, 12));
  const onDrawer = progress(frame, t.drawerWord - 4, 10);
  const intact = frame >= t.intactWord - 6 ? enter(frame, t.intactWord - 4, { distance: 14 }) : null;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, ...tagIn }}>
        <ImageTag />
      </div>
      <div style={{ position: 'absolute', left: BUILD.x, top: BUILD.y, ...bIn }}>
        <RentalBuilding width={BUILD.w} wall={wall} hole={hole} drawer={drawer} />
      </div>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {leader > 0.01 ? (
          <path
            d={`M ${slab[0] + 6} ${slab[1]} L ${COL_X - 40} ${ROW_Y[0] + 30}`}
            stroke={alpha(C.sky, 0.8)}
            strokeWidth={3}
            strokeDasharray="8 7"
            fill="none"
            opacity={leader}
          />
        ) : null}
        {leader > 0.01 ? <circle cx={slab[0] + 6} cy={slab[1]} r={7} fill={C.sky} opacity={leader} /> : null}
      </svg>
      {r1 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_Y[0], ...r1 }}>
          <Pill text={WALL_LABEL} tone={C.sky} size={42} height={66} weight={850} on={progress(frame, t.wallWord - 4, 10) * (1 - 0.5 * progress(frame, t.hole, 12))} />
          <Caption color={C.muted} size={32} style={{ marginTop: 10 }}>
            {WALL_SUB}
          </Caption>
        </div>
      ) : null}
      {r2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_Y[1], ...r2 }}>
          <Caption color={C.text} size={34}>
            {HOLE.lead}
          </Caption>
          <Caption color={C.roseSoft} size={42} weight={850} style={{ marginTop: 6, opacity: 0.35 + 0.65 * onHole }}>
            {HOLE.strong}
          </Caption>
        </div>
      ) : null}
      {r3 ? (
        <div style={{ position: 'absolute', left: COL_X, top: ROW_Y[2], ...r3 }}>
          <Caption color="#fcd34d" size={34} style={{ opacity: 0.45 + 0.55 * onDrawer }}>
            {DRAWER.lead}
          </Caption>
          {intact ? (
            <div style={{ marginTop: 12, ...intact }}>
              <Pill text={DRAWER.strong} tone={C.emerald} icon="check" size={36} height={58} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
