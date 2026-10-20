import { C } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { CONCERT } from '../../../data/s06-bolsillo';
import { Concert } from '../Concert';
import { Caption, Pill } from '../Labels';
import { ImageTag } from '../Tags';

const VENUE = { x: 40, y: 40, w: 900 } as const;
const COL_X = 1010;

export interface ConcertTimes {
  concert: number;
  backDoor: number;
  skips: number;
  same: number;
  guards: number;
  doors: number;
}

/**
 * s06's first beat: the concert («imagen · no es del puerto») with its control and its security inside. On `back-door`
 * someone slips in by the back door (rose, dashed) — «se salta el control» — and on «igual» an emerald «la seguridad
 * sigue dentro». On `guards` the staff walks out and every door opens (amber): «sin seguridad dentro · todas las
 * puertas abiertas».
 */
export function ConcertBeat({ frame, t }: { frame: number; t: ConcertTimes }) {
  const sneak = progress(frame, t.backDoor, 40, EASE.inOut);
  const gone = progress(frame, t.guards, 50, EASE.inOut);
  const r1 = frame >= t.backDoor - 4 ? enter(frame, t.backDoor, { distance: 16 }) : null;
  const skip = frame >= t.skips - 4 ? enter(frame, t.skips, { distance: 12 }) : null;
  const same = frame >= t.same - 4 ? enter(frame, t.same, { distance: 12 }) : null;
  const r2 = frame >= t.guards - 4 ? enter(frame, t.guards, { distance: 16 }) : null;
  const firstDim = 1 - 0.55 * progress(frame, t.guards, 12);
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, t.concert + 6, { distance: 10 }) }}>
        <ImageTag />
      </div>
      <div style={{ position: 'absolute', left: VENUE.x, top: VENUE.y, ...enter(frame, t.concert - 4, { distance: 20 }) }}>
        <Concert width={VENUE.w} sneak={sneak} staffGone={gone} />
      </div>
      <div style={{ position: 'absolute', left: COL_X, top: 70, opacity: firstDim }}>
        {r1 ? (
          <div style={r1}>
            <Caption color={C.roseSoft} size={36} weight={800}>
              {CONCERT.sneak}
            </Caption>
          </div>
        ) : null}
        {skip ? (
          <div style={{ marginTop: 10, ...skip }}>
            <Caption color={C.text} size={34}>
              {CONCERT.skips}
            </Caption>
          </div>
        ) : null}
        {same ? (
          <div style={{ marginTop: 18, ...same }}>
            <Pill text={CONCERT.inside} tone={C.emerald} icon="check" size={34} height={58} />
          </div>
        ) : null}
      </div>
      {r2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 380, ...r2 }}>
          <Pill text={CONCERT.gone[0]} tone={C.amber} icon="alert" size={36} height={60} />
          <Caption color="#fcd34d" size={34} style={{ marginTop: 14, marginLeft: 8, opacity: progress(frame, t.doors - 6, 10) }}>
            {CONCERT.gone[1]}
          </Caption>
        </div>
      ) : null}
    </>
  );
}
