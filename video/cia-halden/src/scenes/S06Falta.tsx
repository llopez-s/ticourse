import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { TABLE_LEAD, TABLE_STAMP, WHEN } from '../data/s06-falta';
import { GapTable, PlanBox, TABLE_W } from './parts/GapTable';
import { KitBox, KitList } from './parts/Kit';
import { Caption, ImageTag, Pill, SoftTag, TermPill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's06-falta';
const W = 1728;

/** Phase A: the kit (left) and its list (right), the name under them. */
const KIT_X = 30;
const KIT_Y = 92;
const KIT_W = 520;
const LIST_X = 640;
const LIST_Y = 64;
const LIST_W = 1060;
const ORDER_Y = 438;
const NAME_Y = 524;
/** Phase B: the table, the plan and the «when» chips. */
const TABLE_X = (W - TABLE_W) / 2;
const LEAD_Y = 0;
const TABLE_Y = 66;
const PLAN_Y = 424;
const WHEN_Y = 584;

/**
 * s06-falta «Cuánto falta». Phase A — the first-aid kit, tagged «imagen · no es del puerto»: the open box comes in on
 * `kit` (faint before), the list of what it should hold on `list`, and on `marks` each item gets its mark on its word
 * (tiritas, sí · termómetro, sin pilas · suero, falta), then the buying order (1.º suero, 2.º termómetro) on
 * «compras». On `name`, GAP ANALYSIS · «lo que hay frente al marco» (the exam card lands after that sentence). Phase B,
 * on `table`: the kit gives way to the example table, stamped «gap analysis · ejemplo · datos ficticios» — not the
 * port's state —; on `rows` its three rows come in on «cumple», «medias» and «falta»; on `plan` the plan under it
 * lights its first line with «responsable · fecha» (no names); on `when` four chips: norma nueva · fusión · antes de una
 * auditoría · cada cierto tiempo.
 */
export function S06Falta(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const kitAt = props.cue('kit');
  const listAt = props.cue('list');
  const marksAt = props.cue('marks');
  const markAt = [w('s06-02', 'Tiritas'), w('s06-02', 'termómetro'), w('s06-02', 'suero')].map((f, i) => Math.max(marksAt + i * 6, f - 4));
  const orderAt = w('s06-02', 'compras') - 6;
  const nameAt = props.cue('name');
  const marcoAt = w('s06-03', 'marco') - 6;
  const tableAt = props.cue('table');
  const rowsAt = props.cue('rows');
  const rowAt = [w('s06-04', 'cumple'), w('s06-04', 'medias'), w('s06-04', 'falta')].map((f, i) => Math.max(rowsAt + i * 6, f - 6));
  const planAt = props.cue('plan');
  const alguienAt = w('s06-05', 'alguien') - 6;
  const whenAt = props.cue('when');
  const chipAt = WHEN.map((c, i) => (c.word ? Math.max(whenAt + i * 4, w('s06-06', c.word) - 6) : whenAt + 4));

  // Phase A fades out just before `table`; phase B comes in on it.
  const aOut = progress(frame, tableAt - 12, 14, EASE.inOut);
  const bIn = progress(frame, tableAt - 2, 16);
  const kitGhost = 0.7 * (1 - progress(frame, kitAt - 6, 18));
  const marks = markAt.map((at) => progress(frame, at, 12));

  return (
    <Stage>
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut }}>
          <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 12 }) }}>
            <ImageTag size={28} />
          </div>
          <div style={{ position: 'absolute', left: KIT_X, top: KIT_Y, opacity: 1 - kitGhost, transform: `scale(${0.96 + 0.04 * progress(frame, kitAt - 6, 18)})` }}>
            <KitBox width={KIT_W} items={progress(frame, listAt, 14)} marks={marks} glow={progress(frame, kitAt, 14) * (1 - 0.6 * progress(frame, nameAt, 14))} />
          </div>
          {frame >= listAt - 6 ? (
            <div style={{ position: 'absolute', left: LIST_X, top: LIST_Y, ...enter(frame, listAt - 2, { distance: 18, axis: 'x' }) }}>
              <KitList width={LIST_W} marks={marks} order={progress(frame, orderAt, 12)} />
            </div>
          ) : null}
          {frame >= orderAt - 4 ? (
            <div style={{ position: 'absolute', left: LIST_X, top: ORDER_Y, width: LIST_W, display: 'flex', justifyContent: 'flex-end', ...enter(frame, orderAt, { distance: 10 }) }}>
              <Caption color={C.emerald} size={34}>
                primero, lo que más falta te haría
              </Caption>
            </div>
          ) : null}
          {frame >= nameAt - 6 ? (
            <div style={{ position: 'absolute', left: 0, top: NAME_Y, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, ...enter(frame, nameAt - 2, { distance: 16 }) }}>
              <TermPill text="gap analysis" size={46} />
              <Caption size={46} weight={800} color={C.textStrong} style={{ opacity: 0.35 + 0.65 * progress(frame, marcoAt, 12) }}>
                lo que hay frente al marco
              </Caption>
            </div>
          ) : null}
        </div>
      ) : null}

      {bIn > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: bIn, transform: `translateY(${(1 - bIn) * 16}px)` }}>
          <div style={{ position: 'absolute', left: TABLE_X, top: LEAD_Y, display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONT.sans }}>
            <SoftTag text={TABLE_STAMP} tone={C.sky} size={30} />
            <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{TABLE_LEAD}</span>
          </div>
          <div style={{ position: 'absolute', left: TABLE_X, top: TABLE_Y }}>
            <GapTable show={1} rows={rowAt.map((at) => progress(frame, at, 12))} focus={[0, 0, progress(frame, planAt, 14)]} />
          </div>
          {frame >= planAt - 6 ? (
            <div style={{ position: 'absolute', left: TABLE_X, top: PLAN_Y }}>
              <PlanBox show={progress(frame, planAt - 2, 14)} top={progress(frame, alguienAt, 14)} />
            </div>
          ) : null}
          {frame >= whenAt - 6 ? (
            <div style={{ position: 'absolute', left: 0, top: WHEN_Y, width: W, display: 'flex', justifyContent: 'center', gap: 16 }}>
              {WHEN.map((c, i) => (
                <div key={c.text} style={{ ...enter(frame, whenAt + i * 4, { distance: 12 }) }}>
                  <Pill text={c.text} tone={C.cyan} on={0.25 + 0.75 * progress(frame, chipAt[i], 10)} size={34} height={56} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}
