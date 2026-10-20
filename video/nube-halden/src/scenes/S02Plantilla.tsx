import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { GAINS, LINES, PORT, RISKS } from '../data/s02-plantilla';
import { Arrow } from './parts/Arrow';
import { CaseStamp, Pill } from './parts/Labels';
import { Postit } from './parts/Postit';
import { CARD, DecisionCard, VAULT } from './parts/s02-plantilla/DecisionCard';
import { PortBeat, TPL_X, TPL_Y } from './parts/s02-plantilla/PortBeat';
import { PostitBeat } from './parts/s02-plantilla/PostitBeat';
import { KEY_Y, TPL } from './parts/s02-plantilla/Template';
import { Stage, wordFrame } from './kit';

const S = 's02-plantilla';
const RISK_Y = 562;
const RISK_X = [0, 800];
/** Where the key line's arrow turns towards the vault. */
const KEY_ELBOW = 606;

/**
 * s02-plantilla «Un pósit en la nevera». First the image («imagen · no es del puerto»): the post-it with the alarm's
 * code, the office fridge, the hand that peels it off, «quien pasó ya la sabe · cambias la clave». On `port` the image
 * folds away for the port's proposal: Sistemas types the template (`template`, the typing sound), the two identical
 * environments, what it gives, «infrastructure as code · IaC». On `risk` the two amber risks, each on its word, with
 * the error copied to both environments and the history lit; a small post-it pops on «pósit». On `decision` the
 * decision card: the template says where the key is, not the key — «gestor de secretos», «secrets in the repo» struck.
 */
export function S02Plantilla(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const portAt = props.cue('port');
  const decisionAt = props.cue('decision');
  const imageOut = progress(frame, portAt - 14, 14, EASE.inOut);
  const riskAt = RISKS.map((r) => w(r.seg, r.word) - 6);
  const postitAt = w('s02-05', 'pósit') - 4;
  const keyAt = w('s02-05', 'dónde') - 4;
  const keyArrow = progress(frame, keyAt + 10, 16);

  return (
    <Stage>
      {imageOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - imageOut }}>
          <PostitBeat
            frame={frame}
            t={{
              postit: props.cue('postit'),
              fridge: props.cue('fridge'),
              removed: props.cue('removed'),
              known: w('s02-02', 'quien') - 4,
              change: w('s02-02', 'cambias') - 4,
            }}
          />
        </div>
      ) : null}

      {frame >= portAt - 6 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, ...enter(frame, portAt - 4, { distance: 14 }) }}>
            <CaseStamp what={PORT.what} kind={PORT.kind} />
          </div>
          <PortBeat
            frame={frame}
            t={{
              port: portAt,
              typeAt: LINES.map((l) => w('s02-03', l.word)),
              template: props.cue('template'),
              envs: w('s02-03', 'Pruebas') - 4,
              gainAt: GAINS.map((g) => (g.word === 'revisa' ? w('s02-03', g.word) + 18 : w('s02-03', g.word) - 4)),
              iac: props.cue('iac'),
              error: riskAt[0] + 6,
              history: riskAt[1] + 4,
              key: keyAt,
              decision: decisionAt,
            }}
          />
          {RISKS.map((r, i) => {
            if (frame < riskAt[i] - 4) return null;
            const on = progress(frame, riskAt[i], 10) * (1 - 0.45 * progress(frame, decisionAt, 14));
            return (
              <div key={r.text} style={{ position: 'absolute', left: RISK_X[i], top: RISK_Y, display: 'flex', alignItems: 'center', gap: 18, ...enter(frame, riskAt[i], { distance: 14 }) }}>
                <Pill text={r.text} tone={C.amber} icon="alert" size={36} height={62} on={on} />
                {i === 1 && frame >= postitAt - 2 ? (
                  <div style={{ ...enter(frame, postitAt, { distance: 10 }), opacity: enter(frame, postitAt, { distance: 10 }).opacity * (1 - 0.5 * progress(frame, decisionAt, 14)) }}>
                    <Postit size={64} text={false} tilt={6} glow={0.6 * progress(frame, postitAt, 8) * (1 - progress(frame, postitAt + 30, 20))} />
                  </div>
                ) : null}
              </div>
            );
          })}
          <DecisionCard frame={frame} at={decisionAt} />
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <Arrow
              points={[
                [TPL_X + TPL.w + 4, TPL_Y + KEY_Y + 25],
                [KEY_ELBOW, TPL_Y + KEY_Y + 25],
                [KEY_ELBOW, CARD.y + 3 + VAULT.y + VAULT.h / 2],
                [CARD.x + 3 + VAULT.x - 4, CARD.y + 3 + VAULT.y + VAULT.h / 2],
              ]}
              draw={keyArrow}
              color={C.emerald}
              width={4}
            />
          </svg>
        </>
      ) : null}
    </Stage>
  );
}
