import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { CAPTIONS, CONFIRM, DOORS, FOCUS_DOOR, HEADER, PERSON, POSTS, RETIRED, TERMS } from '../data/s02-creep';
import { PortBadge, portBadgeGeometry, type DoorDef, type PortBadgeProps } from './parts/Badge';
import { LifecycleRing, ringHeight } from './parts/Ring';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-creep';
const W = 1728;

const RING_BIG = { size: 860, left: (W - 860) / 2, top: Math.round((660 - ringHeight(860)) / 2) };
const RING_SMALL = { size: 400, left: 0, top: 0 };
const BADGE = { left: 430, top: 64, width: W - 430 };
const COL_W = 400; // left column (ring + terms)

/**
 * s02-creep «La acreditación que solo suma». The lifecycle ring (alta ·
 * cambio · baja, JOINER · MOVER · LEAVER) fills the stage, each arc lit as
 * the voice names it. At «mover» it steps into the corner with «cambio» lit;
 * the quarterly review header and c.navarro's port badge enter, her three
 * posts as column heads (oldest first). At «doors» the eleven doors fill the
 * columns: four cyan «de su puesto», seven amber «de puestos anteriores».
 * «creep»: «facturas a navieras · emitir» lifts with «nadie lo decidió» and
 * PERMISSION CREEP. «review»: LEAST PRIVILEGE and ATTESTATION, the doors
 * become a checklist. «removed» (sfx check, on the cue): the four cyan ticks
 * land, the seven amber fade with «no confirmado · retirado». No blame tones.
 */
export function S02Creep(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const cycle = props.cue('cycle');
  const mover = props.cue('mover');
  const doors = props.cue('doors');
  const creep = props.cue('creep');
  const review = props.cue('review');
  const removed = props.cue('removed');
  const s05 = segment(props, 's02-05');

  // ---- Ring: big while the cycle is told, then into the corner with «cambio» lit.
  const arcAt: [number, number, number] = [Math.max(0, cycle - 20), Math.max(4, cycle - 8), Math.max(8, cycle + 4)];
  const enAt: [number, number, number] = [w('s02-01', 'joiner') - 4, w('s02-01', 'mover') - 4, w('s02-01', 'leaver') - 4];
  const said = (from: number, to: number) => windowWeight(frame, from, to, { ramp: 8, lead: 4 });
  const lit: [number, number, number] = [
    Math.max(said(w('s02-01', 'alta'), w('s02-01', 'sus')), said(enAt[0], enAt[1])),
    Math.max(said(w('s02-01', 'cambios'), w('s02-01', 'y', 1)), said(enAt[1], enAt[2])),
    Math.max(said(w('s02-01', 'baja'), w('s02-01', 'en')), said(enAt[2], mover - 6)),
  ];
  const shrink = progress(frame, mover - 4, 26, EASE.inOut);
  const ringSize = mix(RING_BIG.size, RING_SMALL.size, shrink);
  const ringLeft = mix(RING_BIG.left, RING_SMALL.left, shrink);
  const ringTop = mix(RING_BIG.top, RING_SMALL.top, shrink);

  // ---- Header and badge.
  const headerIn = progress(frame, mover + 8, 16);
  const confirmSwap = progress(frame, removed, 12, EASE.inOut);
  const badgeAt = mover + 14;
  const postAt = POSTS.map((p) => w('s02-02', p.word) - 6);
  const gridOpen = progress(frame, doors - 4, 20, EASE.inOut);
  const onceAt = w('s02-03', 'once');
  const sieteAt = w('s02-03', 'siete');
  const doorOrder = DOORS.map((_, i) => i); // chronological: column by column
  const doorAt = (i: number) => doors + 6 + doorOrder.indexOf(i) * 3;

  // creep > review > removed
  const focusUntil = s05.from - 6;
  const listAt = w('s02-05', 'confirmen') - 6;
  const retireAt = w('s02-06', 'siete') - 4;
  let cyanIndex = 0;
  const doorDefs: DoorDef[] = DOORS.map((d, i) => {
    const def: DoorDef = { ...d, at: doorAt(i) };
    if (d.label === FOCUS_DOOR.label) {
      def.focusAt = creep;
      def.focusUntil = focusUntil;
      def.note = FOCUS_DOOR.note;
      def.noteAt = w('s02-04', 'nadie') - 4;
    }
    if (d.tone === 'cyan') {
      def.checkAt = removed + cyanIndex * 3;
      cyanIndex++;
    } else {
      def.goneAt = retireAt;
    }
    return def;
  });
  const badgeProps: PortBadgeProps = {
    name: PERSON.name,
    dept: PERSON.dept,
    doors: doorDefs,
    width: BADGE.width,
    cols: 3,
    at: badgeAt,
    heads: POSTS.map((p, i) => ({ text: p.text, tone: p.tone, at: postAt[i] })),
    captions: CAPTIONS.map((c) => ({ ...c, at: c.tone === 'cyan' ? onceAt - 4 : sieteAt - 4 })),
    listAt,
    grid: gridOpen,
  };
  const geo = portBadgeGeometry(badgeProps);
  const amberBox = { x: geo.cell(0, 0).x, y: geo.gridTop, w: geo.cell(1, 0).x + geo.cell(1, 0).w - geo.cell(0, 0).x, h: geo.gridHeight };
  const retiredIn = progress(frame, retireAt + 6, 14);

  // ---- Terms in the left column.
  const creepTerm = progress(frame, w('s02-04', 'permission') - 6, 14);
  const leastIn = progress(frame, w('s02-05', 'least') - 6, 14);
  const attestIn = progress(frame, review - 4, 14);
  const termsDim = progress(frame, s05.from, 14, EASE.inOut);
  const leastDim = progress(frame, review - 4, 14, EASE.inOut) * 0.5;

  return (
    <Stage>
      {/* The lifecycle ring */}
      <div style={{ position: 'absolute', left: ringLeft, top: ringTop }}>
        <LifecycleRing at={-12} size={ringSize} arcAt={arcAt} enAt={enAt} lit={lit} focus={frame >= mover - 4 ? 'cambio' : null} focusAt={mover - 4} frame={frame} />
      </div>

      {/* Review header (swaps to the manager's confirmation on «removed») */}
      {headerIn > 0 ? (
        <div style={{ position: 'absolute', left: BADGE.left, top: 150 * (1 - gridOpen), width: BADGE.width, height: 52, fontFamily: FONT.sans, opacity: headerIn }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', opacity: 1 - confirmSwap }}>
            <Icon name="search" size={36} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: C.cyanSoft }}>{HEADER.date}</span>
            <span style={{ fontSize: 36, color: C.faint }}>·</span>
            <span style={{ fontSize: 38, fontWeight: 750, color: C.textStrong }}>{HEADER.text}</span>
          </div>
          {confirmSwap > 0 ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap', opacity: confirmSwap, transform: `translateY(${(1 - confirmSwap) * 10}px)` }}>
              <Icon name="check" size={40} color={C.emerald} strokeWidth={2.8} />
              <span style={{ fontSize: 38, fontWeight: 800, color: '#6ee7b7' }}>{CONFIRM}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* c.navarro's badge (sits lower while the door grid is closed) */}
      <div style={{ position: 'absolute', left: BADGE.left, top: BADGE.top + 150 * (1 - gridOpen) }}>
        <PortBadge {...badgeProps} frame={frame} />
        {retiredIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: amberBox.x,
              top: amberBox.y,
              width: amberBox.w,
              height: amberBox.h,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: retiredIn,
              zIndex: 3,
            }}
          >
            <span
              style={{
                padding: '12px 30px',
                borderRadius: RADIUS.pill,
                background: alpha(C.ink950, 0.92),
                border: `2px solid ${alpha(C.amber, 0.75)}`,
                boxShadow: `0 12px 30px ${alpha('#000000', 0.5)}`,
                fontFamily: FONT.sans,
                fontSize: 44,
                fontWeight: 850,
                color: '#fcd34d',
                whiteSpace: 'nowrap',
                transform: `scale(${1.1 - 0.1 * retiredIn})`,
              }}
            >
              {RETIRED}
            </span>
          </div>
        ) : null}
      </div>

      {/* Left column: the names */}
      <div style={{ position: 'absolute', left: 0, top: 300, width: COL_W, fontFamily: FONT.sans }}>
        {creepTerm > 0 ? (
          <div style={{ ...enter(frame, w('s02-04', 'permission') - 6, { distance: 14 }), opacity: creepTerm * (1 - 0.5 * termsDim) }}>
            <span
              style={{
                display: 'inline-block',
                padding: '8px 20px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.violet, 0.8)}`,
                background: alpha(C.violet, 0.12),
                fontSize: 32,
                fontWeight: 850,
                letterSpacing: 1,
                color: '#c4b5fd',
                whiteSpace: 'nowrap',
              }}
            >
              {TERMS.creep}
            </span>
          </div>
        ) : null}
        {leastIn > 0 ? (
          <Term at={w('s02-05', 'least') - 6} frame={frame} top={80} term={TERMS.least.term} sub={TERMS.least.sub} dim={leastDim} />
        ) : null}
        {attestIn > 0 ? <Term at={review - 4} frame={frame} top={214} term={TERMS.attest.term} sub={TERMS.attest.sub} dim={0} /> : null}
      </div>
    </Stage>
  );
}

/** An exam name (violet) with its plain-Spanish line under it. */
function Term({ at, frame, top, term, sub, dim }: { at: number; frame: number; top: number; term: string; sub: string; dim: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top, width: COL_W, ...enter(frame, at, { distance: 14 }), opacity: progress(frame, at, 14) * (1 - dim) }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 14 }}>
        <div style={{ width: 5, borderRadius: 3, background: C.violet, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 36, fontWeight: 850, letterSpacing: 1, color: '#c4b5fd', whiteSpace: 'nowrap', lineHeight: 1.1 }}>{term}</div>
          <div style={{ marginTop: 6, fontSize: 32, fontWeight: 650, color: C.text, lineHeight: 1.15 }}>{sub}</div>
        </div>
      </div>
    </div>
  );
}
