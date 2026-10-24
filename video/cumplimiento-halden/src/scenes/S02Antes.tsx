import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { AFTER_ROUTINES, BEFORE_QUESTIONS, STAMP_SHORT } from '../data/canon';
import { Cat } from './parts/Images';
import { CaseStamp, Caption, Disc, ImageTag, LoopIcon, TermPill } from './parts/Labels';
import { BTN, COL_W, ITEM_PITCH, LaunchButton, ListItem, Repeat } from './parts/s02-antes/Bits';
import { Stage, wordFrame } from './kit';

const S = 's02-antes';
const W = 1728;
const MID = W / 2;
const RAIL_Y = 78;
const HEAD_Y = 142;
const LIST_Y = 194;
const TERM_Y = 530;
const RIGHT_X = W - COL_W;
const CAT_W = 300;

/** An enter transition (`enter`) scaled by a further opacity factor. */
const dimmed = (e: { opacity: number; transform: string }, k: number) => ({ opacity: e.opacity * k, transform: e.transform });

/**
 * s02-antes «Antes de lanzarlo y después». A time line with the «lanzar» button in the middle (`timeline`, the compact
 * proposal stamp stays top-left). On `before` the left half lights and, on `questions`, the five questions the port asks
 * come in (the voice names three: ley · verá · guardan); DUE DILIGENCE lands on its word with «mirar antes de saltar».
 * On `launch` the button is pressed and turns emerald; on `after` the right half runs on towards the edge and, on
 * `routines`, the four routines come in, each with its loop (the first one «cada trimestre»); DUE CARE with «seguir
 * haciéndolo bien». On `cat` both lists step back and the cat comes in, small, tagged «imagen · no es del puerto»: «te
 * informas» ticks on its word, the kibble appears on «comer», and on `cat-rule` the bowl empties again, rimmed amber —
 * having looked well does not feed it.
 */
export function S02Antes(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const timelineAt = props.cue('timeline');
  const beforeAt = props.cue('before');
  const questionsAt = props.cue('questions');
  const launchAt = props.cue('launch');
  const afterAt = props.cue('after');
  const routinesAt = props.cue('routines');
  const catAt = props.cue('cat');
  const ruleAt = props.cue('cat-rule');

  // The five questions: the voice names «ley», «verá» and «guardan»; the others come in between and after.
  const q0 = Math.max(questionsAt + 2, w('s02-02', 'ley') - 8);
  const q2 = Math.max(q0 + 14, w('s02-02', 'verá') - 8);
  const q3 = Math.max(q2 + 14, w('s02-02', 'guardan') - 8);
  const qAt = [q0, Math.round((q0 + q2) / 2), q2, q3, q3 + 24];
  const diligenceAt = w('s02-03', 'diligence') - 10;

  // The four routines: «revisar», «poner» and «arreglar» are spoken; «formar» comes in between.
  const r0 = Math.max(routinesAt, w('s02-05', 'revisar') - 8);
  const r1 = Math.max(r0 + 14, w('s02-05', 'poner') - 8);
  const r3 = Math.max(r1 + 24, w('s02-05', 'arreglar') - 8);
  const rAt = [r0, r1, Math.round((r1 + r3) / 2), r3];
  const careAt = w('s02-06', 'care') - 10;

  const informasAt = w('s02-07', 'informas') - 6;
  const comerAt = w('s02-07', 'comer') - 8;

  const stampIn = enter(frame, -6, { distance: 12, duration: 14 });
  const railIn = progress(frame, timelineAt - 8, 20);
  const beforeLit = progress(frame, beforeAt - 4, 20);
  const afterLit = progress(frame, afterAt - 4, 26);
  const launch = Math.max(0, 1 - Math.abs(frame - launchAt) / 7);
  const ran = progress(frame, launchAt + 2, 10);
  const ring = progress(frame, launchAt, 26);
  const cat = progress(frame, catAt - 6, 16);
  const listDim = 1 - 0.62 * cat;

  const informs = progress(frame, informasAt, 10);
  const fed = progress(frame, comerAt, 14) * (1 - progress(frame, ruleAt - 4, 10));
  const rule = progress(frame, ruleAt - 4, 12);
  const divider = progress(frame, timelineAt, 20) * (1 - cat);
  const left = MID - BTN.w / 2;
  const right = MID + BTN.w / 2;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={STAMP_SHORT} size={26} height={46} />
      </div>

      {/* The line: faint from the start, the left half lights on `before`, the right half runs on from `after` */}
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <line x1={0} y1={RAIL_Y} x2={left - 8} y2={RAIL_Y} stroke={alpha(C.cyan, 0.2 + 0.7 * beforeLit)} strokeWidth={6} strokeLinecap="round" opacity={railIn} />
        <line x1={right + 8} y1={RAIL_Y} x2={right + 8 + (W - right - 40) * afterLit} y2={RAIL_Y} stroke={C.emerald} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 14" opacity={afterLit > 0.01 ? 1 : 0} />
        <line x1={right + 8} y1={RAIL_Y} x2={W - 40} y2={RAIL_Y} stroke={alpha(C.cyan, 0.2)} strokeWidth={6} strokeLinecap="round" opacity={railIn * (1 - afterLit)} />
        {afterLit > 0.8 ? <path d={`M${W - 50} ${RAIL_Y - 16} L${W - 22} ${RAIL_Y} L${W - 50} ${RAIL_Y + 16}`} stroke={C.emerald} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={progress(frame, afterAt + 16, 12)} /> : null}
        <line x1={MID} y1={RAIL_Y + BTN.h / 2 + 10} x2={MID} y2={LIST_Y + 5 * ITEM_PITCH - 20} stroke={alpha(C.sky, 0.3)} strokeWidth={3} strokeDasharray="4 12" opacity={divider} />
      </svg>

      {/* The «lanzar» button, in the middle of the line */}
      <div style={{ position: 'absolute', left: MID - BTN.w / 2, top: RAIL_Y - BTN.h / 2, opacity: railIn, transform: `translateY(${(1 - railIn) * 10}px)` }}>
        <LaunchButton press={launch} lit={ran} ring={ring} />
      </div>

      {/* ANTES: five questions, then DUE DILIGENCE */}
      <div style={{ position: 'absolute', left: 0, top: HEAD_Y, opacity: beforeLit * (0.4 + 0.6 * listDim) }}>
        <Caption size={38} weight={850} color={C.cyanSoft} style={{ letterSpacing: 3 }}>
          ANTES
        </Caption>
      </div>
      {BEFORE_QUESTIONS.map((q, i) => {
        if (frame < qAt[i] - 2) return null;
        const on = progress(frame, qAt[i], 10) * (1 - 0.55 * progress(frame, (qAt[i + 1] ?? qAt[i] + 400) - 2, 12)) + 0.12;
        return (
          <div key={q} style={{ position: 'absolute', left: 0, top: LIST_Y + i * ITEM_PITCH, ...dimmed(enter(frame, qAt[i], { distance: 14 }), listDim) }}>
            <ListItem tone={C.cyan} on={on}>
              {q}
            </ListItem>
          </div>
        );
      })}
      {frame >= diligenceAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: TERM_Y, ...enter(frame, diligenceAt, { distance: 14 }) }}>
          <TermPill text="DUE DILIGENCE" size={40} on={0.5 + 0.5 * progress(frame, diligenceAt, 10)} />
          <Caption size={34} color={C.cyanSoft} style={{ marginTop: 12, opacity: progress(frame, diligenceAt + 10, 12) }}>
            mirar antes de saltar
          </Caption>
        </div>
      ) : null}

      {/* DESPUÉS: four routines, each with its loop, then DUE CARE */}
      <div style={{ position: 'absolute', left: RIGHT_X, top: HEAD_Y, opacity: afterLit * (0.4 + 0.6 * listDim) }}>
        <Caption size={38} weight={850} color="#6ee7b7" style={{ letterSpacing: 3 }}>
          DESPUÉS
        </Caption>
      </div>
      {AFTER_ROUTINES.map((r, i) => {
        if (frame < rAt[i] - 2) return null;
        const on = progress(frame, rAt[i], 10) * (1 - 0.55 * progress(frame, (rAt[i + 1] ?? rAt[i] + 400) - 2, 12)) + 0.12;
        return (
          <div key={r.text} style={{ position: 'absolute', left: RIGHT_X, top: LIST_Y + i * ITEM_PITCH, ...dimmed(enter(frame, rAt[i], { distance: 14 }), listDim) }}>
            <ListItem tone={C.emerald} on={on} size={30} extra={<Repeat every={'every' in r ? r.every : undefined} on={on} />}>
              {r.text}
            </ListItem>
          </div>
        );
      })}
      {frame >= careAt - 4 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: TERM_Y, ...enter(frame, careAt, { distance: 14 }) }}>
          <TermPill text="DUE CARE" size={40} on={0.5 + 0.5 * progress(frame, careAt, 10)} />
          <Caption size={34} color="#6ee7b7" style={{ marginTop: 12, opacity: progress(frame, careAt + 10, 12) }}>
            seguir haciéndolo bien
          </Caption>
        </div>
      ) : null}

      {/* The cat, in miniature, between the two lists */}
      {cat > 0.01 ? (
        <div style={{ position: 'absolute', left: MID - CAT_W / 2, top: 168, width: CAT_W, opacity: cat, transform: `translateY(${(1 - cat) * 16}px)` }}>
          <Cat width={CAT_W} fed={fed} alert={rule} glow={0.5 * cat} />
          {rule > 0.01 ? (
            <div style={{ position: 'absolute', left: CAT_W * 0.78, top: CAT_W * 0.36, opacity: rule }}>
              <Disc icon="alert" tone={C.amber} show={rule} size={46} />
            </div>
          ) : null}
        </div>
      ) : null}
      {cat > 0.01 ? (
        <div style={{ position: 'absolute', left: MID - 170, top: 396, width: 340, display: 'flex', flexDirection: 'column', gap: 12, opacity: cat, fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.25 + 0.75 * informs }}>
            <Disc icon="check" tone={C.emerald} show={0.35 + 0.65 * informs} size={42} />
            te informas
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.25 + 0.75 * progress(frame, comerAt, 10) }}>
            <div style={{ width: 42, height: 42, display: 'grid', placeItems: 'center' }}>
              <LoopIcon size={38} color={rule > 0.5 ? C.amber : C.emerald} />
            </div>
            <span style={{ color: rule > 0.5 ? C.amber : C.textStrong }}>le das de comer</span>
          </div>
        </div>
      ) : null}
      {cat > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 506, width: W, display: 'flex', justifyContent: 'center', opacity: cat }}>
          <ImageTag />
        </div>
      ) : null}
    </Stage>
  );
}
