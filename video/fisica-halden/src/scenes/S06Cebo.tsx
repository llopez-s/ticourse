import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { DECOYS, STAMP } from '../data/canon';
import { DECOY, Decoy } from './parts/Decoy';
import { FloorPlan, PLAN } from './parts/FloorPlan';
import { CaseStamp, Pill, TermPill } from './parts/Labels';
import { PlanLabel } from './parts/PlanLabel';
import { Stage, wordFrame } from './kit';

const S = 's06-cebo';
const W = STAGE.width;

/** Phase A: the plan, big; phase B (from `four`): a small plan top right and the four decoys. */
const BIG = { w: 860, x: (W - 860) / 2, y: 76 } as const;
const MINI = { w: 300, x: W - 300, y: 0 } as const;
const LINES_TOP = 498;

const GAP = 32;
const CARD_W = (W - 3 * GAP) / 4;
const CARD_TOP = 128;
const CARD_H = 368;
const ART_W = 190;
const ART_H = (ART_W * DECOY.h) / DECOY.w;
const RULE_TOP = 516;
const CHIP_TOP = 600;

/** Segment and spoken word of each decoy's name (the cue opens its idea; the name comes after). */
const NAME_WORD = [
  ['s06-03', 'honeypot'],
  ['s06-03', 'honeynet'],
  ['s06-04', 'honeyfile'],
  ['s06-04', 'honeytoken'],
] as const;

/**
 * s06-cebo «Un cebo que nadie toca». The same stamp and the same example plan, with its three controls. On `inside`
 * the idea first: «lo de antes: frenar o detectar a quien llega», and on «dentro» «un cebo: ya hay alguien dentro»,
 * with a dashed figure already in the room (no face, no name; nothing is caught). On `four` the plan shrinks to a corner
 * and four dashed slots wait; each decoy comes in on its cue with its idea, and its English name on the spoken word.
 * On `rule` the shared mark: «nadie legítimo lo toca · cualquier toque avisa», each decoy's bell on «avisa», and a
 * half-lit chip «creíble, nunca con datos reales» (not voiced: the lesson's warning).
 */
export function S06Cebo(props: SceneProps) {
  const frame = useCurrentFrame();
  const insideAt = props.cue('inside');
  const fourAt = props.cue('four');
  const ruleAt = props.cue('rule');
  const cueAt = DECOYS.map((d) => props.cue(d.kind));
  const nameAt = NAME_WORD.map(([seg, w]) => wordFrame(S, seg, w) - 4);
  const dentroAt = wordFrame(S, 's06-01', 'dentro') - 8;
  const avisaAt = wordFrame(S, 's06-05', 'avisa') - 6;

  const shrink = progress(frame, fourAt - 10, 26, EASE.inOut);
  const pw = mix(BIG.w, MINI.w, shrink);
  const px = mix(BIG.x, MINI.x, shrink);
  const py = mix(BIG.y, MINI.y, shrink);
  const ph = (pw * PLAN.h) / PLAN.w;
  const phaseA = 1 - progress(frame, fourAt - 14, 10);
  const line1 = progress(frame, insideAt, 14);
  const line2 = progress(frame, dentroAt, 14);
  const focusI = cueAt.reduce((acc, a, i) => (frame >= a - 4 ? i : acc), -1);
  const ruleIn = progress(frame, ruleAt - 2, 16);
  const alarm = progress(frame, avisaAt, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, -6, { distance: 12 }) }}>
        <CaseStamp parts={[...STAMP]} size={26} />
      </div>

      {/* The plan with its three controls; someone already inside on «dentro» */}
      <div style={{ position: 'absolute', left: px, top: py }}>
        <FloorPlan width={pw} car={1} bollards={1} vestibule={1} reader={1} log={1} inside={line2 * phaseA} idSuffix="-s6" />
      </div>
      {phaseA > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: BIG.y + ph + 14, width: W, display: 'flex', justifyContent: 'center', opacity: phaseA }}>
            <PlanLabel size={26} inline />
          </div>
          <div style={{ position: 'absolute', left: 0, top: LINES_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 42, fontWeight: 800, lineHeight: 1.3, opacity: phaseA, whiteSpace: 'nowrap' }}>
            <div style={{ color: C.muted, opacity: line1 }}>lo de antes: frenar o detectar a quien llega</div>
            <div style={{ color: C.textStrong, opacity: line2 }}>
              un cebo: <span style={{ color: C.amber }}>ya hay alguien dentro</span>
            </div>
          </div>
        </>
      ) : null}

      {/* The four decoys */}
      {DECOYS.map((d, i) => {
        const slot = progress(frame, fourAt, 14);
        if (slot <= 0.01) return null;
        const x = i * (CARD_W + GAP);
        const shown = progress(frame, cueAt[i] - 4, 14);
        const inFocus = i === focusI && frame < ruleAt - 4;
        const strength = Math.max(inFocus ? 1 : 0.65 * shown, ruleIn);
        return (
          <div
            key={d.kind}
            style={{
              position: 'absolute',
              left: x,
              top: CARD_TOP,
              width: CARD_W,
              height: CARD_H,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `2px ${shown > 0.5 ? 'solid' : 'dashed'} ${alpha(C.cyan, 0.25 + 0.5 * strength)}`,
              background: alpha(C.ink850, 0.5 + 0.4 * shown),
              boxShadow: inFocus ? `0 0 30px ${alpha(C.cyan, 0.22)}` : undefined,
              opacity: slot,
              fontFamily: FONT.sans,
            }}
          >
            <div style={{ position: 'absolute', left: (CARD_W - ART_W) / 2, top: 14, opacity: shown * (0.6 + 0.4 * strength) }}>
              <Decoy kind={d.kind} width={ART_W} on={strength} alarm={alarm} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 14 + ART_H + 12,
                width: CARD_W,
                textAlign: 'center',
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1.18,
                color: C.text,
                opacity: shown * (0.6 + 0.4 * strength),
                whiteSpace: 'nowrap',
              }}
            >
              {d.idea.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            {frame >= nameAt[i] - 2 ? (
              <div style={{ position: 'absolute', left: 0, bottom: 16, width: CARD_W, display: 'flex', justifyContent: 'center', ...enter(frame, nameAt[i], { distance: 10 }) }}>
                <TermPill text={d.term} size={34} on={strength} />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* The shared mark and the lesson's warning */}
      {ruleIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: RULE_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: ruleIn, transform: `translateY(${(1 - ruleIn) * 12}px)` }}>
          <Pill
            tone={C.amber}
            icon="bell"
            size={40}
            height={66}
            on={0.4 + 0.6 * alarm}
            text={
              <span>
                nadie legítimo lo toca <span style={{ color: C.faint }}>·</span> <span style={{ color: C.amber }}>cualquier toque avisa</span>
              </span>
            }
          />
        </div>
      ) : null}
      {frame >= ruleAt + 20 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIP_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: 0.55 * progress(frame, ruleAt + 24, 16) }}>
          <Pill text="creíble, nunca con datos reales" tone={C.muted} icon="alert" size={28} height={46} weight={700} color={C.text} />
        </div>
      ) : null}
    </Stage>
  );
}
