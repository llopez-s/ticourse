import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { RULES, type RecapLine, type RecapRule } from '../data/s06-recap';
import { EndCard, NextAction } from './parts/s06-recap/EndCard';
import { RecapCards, recapCardWidth, type RecapCardDef } from './parts/s06-recap/RecapCards';
import { ART_H, OrderArt, TrioArt, VestArt } from './parts/s06-recap/RuleArt';
import { RuleLine, RuleNote } from './parts/s06-recap/RuleText';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 8;
const CARDS_H = 484;
const GAP = 24;
/** The small print hangs under its card; the next step takes the room beside it, under the other two. */
const FOOT_H = 156;
const NEXT_W = 2 * recapCardWidth(W, GAP) + GAP;
const NEXT_H = 88;
const NEXT_TOP = CARDS_TOP + CARDS_H + Math.round((FOOT_H - NEXT_H) / 2);

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame (the chapter wipe
 * reveals them). Each rule card lights as the voice says it, with the drawing the video gave it,
 * and its lines light on their own words: the vest («Dentro no es de fiar» — a dashed grey ring,
 * not decided yet — «verificar no es negar»: amber dots, it asks for proof); the oficina, the
 * administrativo and the mozo («Decide el engine» · «comunica el administrator» · «aplica el
 * PEP», the only tick at the office); the order with its clock («Sesión corta» · «alcance mínimo»
 * · «revocable», annulled on that word), with the small print the voice does not say hanging
 * under that card. On `next` the cards step back and «Tu turno: las preguntas de la lección»
 * takes the room beside the small print; on `endcard` the ALERTÓPOLIS end card (V12's layout, no
 * lab line) — the vest, «Zero Trust: quién decide, quién comunica y quién aplica», the remate
 * «Que ninguna petición pase solo por llevar chaleco», the objective and the CompTIA disclaimer
 * — holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const reglasAt = Math.min(wordFrame(S, 's06-01', 'reglas') - 6, ruleAt[0] - 12);
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  /** A line lights on its own word, never before its card. */
  const lineAt = (rule: RecapRule, l: RecapLine, cardAt: number) => Math.max(cardAt + 2, at(rule.seg, l.word, l.nth ?? 0) - 6);

  const art: ReactNode[] = [
    <VestArt key="vest" frame={frame} at={ruleAt[0]} openAt={at('s06-01', 'no') - 4} askAt={at('s06-01', 'verificar') - 4} />,
    <TrioArt
      key="trio"
      frame={frame}
      at={ruleAt[1]}
      decideAt={at('s06-02', 'Decide') - 2}
      comunicaAt={at('s06-02', 'comunica') - 4}
      aplicaAt={at('s06-02', 'aplica') - 4}
      endAt={at('s06-02', 'PEP') + 20}
    />,
    <OrderArt key="order" frame={frame} at={ruleAt[2]} shortAt={at('s06-03', 'sesión') - 4} scopeAt={at('s06-03', 'alcance') - 4} revokeAt={at('s06-03', 'revocable') - 2} />,
  ];

  const cards: RecapCardDef[] = RULES.map((rule, i) => ({
    at: ruleAt[i],
    art: art[i],
    body: (
      <div>
        {rule.lines.map((l, k) => (
          <RuleLine key={k} line={l} first={k === 0} lit={progress(frame, lineAt(rule, l, ruleAt[i]), 12)} />
        ))}
      </div>
    ),
    foot: rule.note ? <RuleNote text={rule.note} show={progress(frame, ruleAt[i] + 10, 14)} /> : undefined,
    footHeight: FOOT_H,
    footOpen: progress(frame, ruleAt[i] + 4, 18, EASE.inOut),
    // The card with the small print stays readable while the next step comes in.
    rest: rule.note ? 0.4 : 0.8,
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: CARDS_TOP }}>
            <RecapCards cards={cards} width={W} height={CARDS_H} gap={GAP} artHeight={ART_H} slotAt={Math.min(-14, reglasAt - 40)} dimFrom={nextAt} frame={frame} fps={fps} />
          </div>
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} width={NEXT_W} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} vestAt={at('s06-04', 'chaleco') - 4} />
    </Stage>
  );
}
