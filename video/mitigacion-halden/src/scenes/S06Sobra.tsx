import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { GYM_LINE, HARDENING, ITEMS, RULE, SERVER_LABEL, SURFACE, SURFACE_NOTE, VERBS } from '../data/s06-sobra';
import { GymCard } from './parts/GymCard';
import { CaseTag, ExamChip, TermPill } from './parts/Labels';
import { Server } from './parts/Server';
import { ImageTag } from './parts/Tags';
import { FactoryList, LIST_W, listHeight } from './parts/s06-sobra/FactoryList';
import { Stage, wordFrame } from './kit';

const S = 's06-sobra';
const W = STAGE.width;
const LIST_X = 380;
const LIST_Y = 64;
const VERB_X = 1240;
const VERB_W = W - VERB_X;

/**
 * s06-sobra «Un servidor recién montado». The new server (no name) on the left from `new-server`; on `defaults` its
 * factory list lands, every row with «parches pendientes». On `three-verbs` the verbs column lights «quitar» (with
 * «Removal of unnecessary software» on «removal»), and on `gone` the browser's row whooshes out of the list. «cerrar» and
 * «cambiar» light on their words and tag their rows. On `shrink` «Hardening» joins the verbs; on «encoge» the two other
 * unused rows leave and the dashed frame — the attack surface, «ya la conoces» — shrinks with the pending-patch counter.
 * On `gym` the gym card (imagen · no es del puerto) replaces the verbs; on `rule` the rule card comes in underneath.
 */
export function S06Sobra(props: SceneProps) {
  const frame = useCurrentFrame();
  const serverAt = props.cue('new-server');
  const defaultsAt = props.cue('defaults');
  const goneAt = props.cue('gone');
  const shrinkAt = props.cue('shrink');
  const gymAt = props.cue('gym');
  const ruleAt = props.cue('rule');
  const verbAt = VERBS.map((v) => wordFrame(S, v.seg, v.word) - 6);
  const removalAt = wordFrame(S, 's06-02', 'removal') - 6;
  const encogeAt = wordFrame(S, 's06-04', 'encoge') - 8;
  const surfaceAt = wordFrame(S, 's06-04', 'attack') - 8;
  const patchesAt = wordFrame(S, 's06-04', 'parches') - 6;
  const sobraAt = wordFrame(S, 's06-06', 'sobra') - 6;

  const caseIn = enter(frame, -6, { distance: 12, duration: 14 });
  const serverIn = enter(frame, serverAt - 4, { distance: 16, duration: 16 });
  const out = ITEMS.map((it, i) => (it.fate === 'gone' ? progress(frame, goneAt - 2, 10, EASE.in) : it.fate === 'remove' ? progress(frame, encogeAt + (i - 1) * 6, 12, EASE.in) : 0));
  const keep = out.map((o, i) => 1 - progress(frame, (ITEMS[i].fate === 'gone' ? goneAt + 8 : encogeAt + (i - 1) * 6 + 10), 12, EASE.inOut) * (o > 0 ? 1 : 0));
  const show = ITEMS.map((_, i) => (frame < defaultsAt - 6 ? 0.0 : progress(frame, defaultsAt + i * 5, 12)));
  const tag = ITEMS.map((it) => (it.fate === 'close' ? progress(frame, verbAt[1] + 8, 12) : it.fate === 'change' ? progress(frame, verbAt[2] + 8, 12) : 0));
  const listIn = progress(frame, defaultsAt - 6, 12);
  const listH = listHeight(keep);
  const remaining = Math.round(keep.reduce((a, k) => a + k, 0));
  const surfaceIn = progress(frame, surfaceAt, 14);
  const counterHi = progress(frame, patchesAt, 12);

  const verbsOut = progress(frame, gymAt - 10, 14, EASE.inOut);
  const hardIn = enter(frame, shrinkAt, { distance: 14, duration: 14 });
  const gymIn = progress(frame, gymAt, 16);
  const ruleIn = enter(frame, ruleAt - 2, { distance: 18, duration: 16 });
  const otherOn = progress(frame, ruleAt, 12);
  const mainOn = progress(frame, sobraAt, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...caseIn }}>
        <CaseTag />
      </div>

      {/* The new server */}
      <div style={{ position: 'absolute', left: 30, top: 70, fontFamily: FONT.sans, ...serverIn }}>
        <Server width={190} frame={frame} />
        <div style={{ marginTop: 12, fontSize: 32, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{SERVER_LABEL[0]}</div>
        <div style={{ fontSize: 28, fontWeight: 650, color: C.muted, lineHeight: 1.15, whiteSpace: 'nowrap' }}>
          {SERVER_LABEL[1]}
          <br />
          {SERVER_LABEL[2]}
        </div>
      </div>

      {/* The factory list, its frame = the attack surface */}
      <div style={{ position: 'absolute', left: LIST_X, top: LIST_Y, opacity: listIn }}>
        <FactoryList show={show} out={out} keep={keep} tag={tag} glow={surfaceIn} />
      </div>
      <div style={{ position: 'absolute', left: LIST_X + 24, top: LIST_Y + listH + 16, display: 'flex', alignItems: 'center', gap: 12, opacity: listIn * surfaceIn, fontFamily: FONT.sans }}>
        <TermPill text={SURFACE} size={32} on={surfaceIn} />
        <span style={{ fontSize: 28, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{SURFACE_NOTE}</span>
      </div>
      {/* The pending-patch counter, in the list's header row */}
      <div style={{ position: 'absolute', left: LIST_X, top: LIST_Y + 10, width: LIST_W - 14, display: 'flex', justifyContent: 'flex-end', opacity: listIn }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 46,
            padding: '0 18px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.amber, 0.5 + 0.5 * counterHi)}`,
            background: alpha(C.amberDeep, 0.25 + 0.3 * counterHi),
            boxShadow: counterHi > 0.02 ? `0 0 ${Math.round(24 * counterHi)}px ${alpha(C.amber, 0.35 * counterHi)}` : undefined,
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 800,
            color: '#fcd34d',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="alert" size={28} color={C.amber} />
          parches pendientes: {remaining}
        </div>
      </div>

      {/* The verbs (then the gym) */}
      {verbsOut < 1 ? (
        <div style={{ position: 'absolute', left: VERB_X, top: LIST_Y, width: VERB_W, opacity: 1 - verbsOut, fontFamily: FONT.sans }}>
          {VERBS.map((v, i) => {
            const on = progress(frame, verbAt[i], 12);
            const showV = Math.max(0.3 * progress(frame, props.cue('three-verbs') - 6, 12), on);
            const termOn = v.term ? progress(frame, removalAt, 12) : 0;
            return (
              <div
                key={v.verb}
                style={{
                  marginBottom: 14,
                  padding: '14px 20px',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(C.emerald, 0.3 + 0.6 * on)}`,
                  background: alpha(C.emeraldDeep, 0.2 + 0.35 * on),
                  opacity: showV,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon name={v.icon} size={38} color={C.emerald} strokeWidth={2.4} />
                  <span style={{ fontSize: 42, fontWeight: 900, color: C.textStrong }}>{v.verb}</span>
                </div>
                <div style={{ fontSize: 30, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{v.what}</div>
                {v.term ? (
                  <div style={{ marginTop: 8, opacity: termOn }}>
                    <ExamChip text={v.term} size={24} />
                  </div>
                ) : null}
              </div>
            );
          })}
          <div style={{ marginTop: 4, ...hardIn }}>
            <TermPill text={HARDENING} size={34} />
          </div>
        </div>
      ) : null}
      {gymIn > 0.01 ? (
        <div style={{ position: 'absolute', left: VERB_X, top: LIST_Y, width: VERB_W, opacity: gymIn, transform: `translateY(${(1 - gymIn) * 14}px)`, fontFamily: FONT.sans }}>
          <ImageTag size={26} />
          <div style={{ marginTop: 22, marginLeft: (VERB_W - 360) / 2 }}>
            <GymCard width={360} paid={progress(frame, gymAt + 6, 50)} />
          </div>
          <div style={{ marginTop: 14, textAlign: 'center', fontSize: 30, fontWeight: 750, color: '#fcd34d', whiteSpace: 'nowrap' }}>{GYM_LINE}</div>
        </div>
      ) : null}

      {/* The rule */}
      {frame >= ruleAt - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: LIST_X,
            top: 430,
            width: W - LIST_X,
            boxSizing: 'border-box',
            padding: '20px 34px',
            borderRadius: 26,
            background: alpha(C.emerald, 0.07),
            border: `3px solid ${alpha(C.emerald, 0.6)}`,
            fontFamily: FONT.sans,
            ...ruleIn,
          }}
        >
          {RULE.main.map((l, k) => (
            <div key={k} style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.2, color: C.textStrong, opacity: 0.35 + 0.65 * mainOn, whiteSpace: 'nowrap' }}>
              {l}
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 32, fontWeight: 750, color: C.emerald, opacity: 0.35 + 0.65 * otherOn, whiteSpace: 'nowrap' }}>{RULE.other}</div>
        </div>
      ) : null}
    </Stage>
  );
}
