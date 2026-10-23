import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s08-cierre';
import { RequestSheet } from './parts/Request';
import { ServiceHub } from './parts/Service';
import { SiteList } from './parts/SiteList';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_H = 520;
const ART_H = 96;
const PHRASE_TOP = 110;
const NEXT_TOP = 450;

const PHRASE_TONE = { cyan: C.cyan, amber: C.amber, emerald: C.emerald } as const;

function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show, whiteSpace: 'nowrap' }}>{text}</div>;
}

/** The three icons: the ticked request, the service with its list, the request stamped «cerrado». */
function Art({ art, glow }: { art: RuleArt; glow: number }) {
  if (art === 'request') return <RequestSheet width={136} mini owner={1} checks={[1, 1, 1]} stamp="cab" glow={glow} />;
  if (art === 'closed') return <RequestSheet width={136} mini owner={1} checks={[1, 1, 1]} stamp="closed" glow={glow} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <ServiceHub width={150} mini />
      <SiteList width={130} bare />
    </div>
  );
}

/**
 * s08-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with
 * its icon — the ticked request, the service with what hangs from it and the site list, the request stamped «cerrado» —
 * and the full rule of the ficha, its lines lit on the voice's words. On `phrase` the cards step back and «Antes de
 * tocar, tres cosas. Al tocar, lo necesario. Al acabar, todo al día» comes over them, one beat per line (the third on
 * `next`, with «Tu turno: las preguntas de la lección» under it); on `endcard` the ALERTÓPOLIS end card takes the stage
 * and holds.
 */
export function S08Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phraseAt = props.cue('phrase');
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);
  const cardsBack = progress(frame, phraseAt - 4, 14);

  const phraseIn = progress(frame, phraseAt - 2, 16);
  const beatAt = PHRASE.map((p, i) => (i === 0 ? phraseAt : Math.max(phraseAt + 6 * i, wordFrame(S, 's08-04', p.word, p.nth) - 8)));
  const cardAt = [Math.min(recapAt, ruleAt[0]), ruleAt[1], ruleAt[2]];

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames = r.sub.map((l) => (l.word ? Math.max(cardAt[i] + 4, wordFrame(S, r.seg, l.word) - 6) : cardAt[i] + 8));
    const show = progress(frame, cardAt[i] + 2, 14);
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.2 }}>
          {r.sub.map((l, k) => (
            <Line key={k} text={l.text} strong={l.strong} show={0.35 + 0.65 * progress(frame, frames[k] + k * 2, 12)} />
          ))}
        </div>
      ),
      tone: i === 1 ? 'amber' : i === 2 ? 'emerald' : 'cyan',
      at: cardAt[i],
      art: (
        <div style={{ opacity: show }}>
          <Art art={r.art} glow={0.5 * show} />
        </div>
      ),
    };
  });

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.75 * cardsBack }}>
            <RuleCards
              rules={rules}
              width={W}
              height={CARDS_H}
              gap={24}
              slotAt={recapAt - 20}
              dimFrom={phraseAt}
              titleSize={46}
              subSize={32}
              artHeight={ART_H}
              frame={frame}
              fps={fps}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
          </div>

          {phraseIn > 0.01 ? (
            <div style={{ position: 'absolute', left: 0, top: PHRASE_TOP, width: W, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  boxSizing: 'border-box',
                  padding: '22px 48px',
                  borderRadius: 28,
                  background: alpha(C.ink900, 0.94),
                  border: `3px solid ${alpha(C.violet, 0.7)}`,
                  boxShadow: `0 0 40px ${alpha(C.violet, 0.22)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 30,
                  opacity: phraseIn,
                  transform: `translateY(${(1 - phraseIn) * 16}px)`,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name="mortarboard" size={64} color={C.violet} strokeWidth={2} />
                <div style={{ fontSize: 56, fontWeight: 850, lineHeight: 1.22 }}>
                  {PHRASE.map((p, i) => (
                    <div key={p.text} style={{ color: PHRASE_TONE[p.tone], opacity: 0.22 + 0.78 * progress(frame, beatAt[i], 12) }}>
                      {p.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <NextAction frame={frame} fps={fps} at={nextAt + 6} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
