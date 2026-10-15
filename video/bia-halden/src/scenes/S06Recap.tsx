import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { RULES, type RecapLine, type RecapRule } from '../data/s06-recap';
import { EndCard, NextAction } from './parts/s06-recap/EndCard';
import { RecapCards, type RecapCardDef } from './parts/s06-recap/RecapCards';
import { ART_H, ClockBookArt, PaperArt, TechArt } from './parts/s06-recap/RuleArt';
import { RuleLine } from './parts/s06-recap/RuleText';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 8;
const CARDS_H = 520;
const GAP = 24;
const NEXT_TOP = CARDS_TOP + CARDS_H + 22;

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame. Each rule card lights as the voice says it,
 * with the drawing the video gave it, and its lines light on their own words: the clock and the notebook («RTO: de
 * tiempo» · «RPO: de datos»); the technician beside the four faults over the promise line, and their mean («MTTR y
 * MTBF: se miden» · «no se prometen» · «el MTTR se compara con el RTO»); the paper that does not add up, the measured
 * bar running past the promise, and «≠» («Se mejora la recuperación» · «si lo medido no llega» · «no el papel»). On
 * `next` the cards step back and «Tu turno: las preguntas de la lección» takes the room under them; on `endcard`
 * the ALERTÓPOLIS end card (the café's three glyphs, the title, the next step, the objective and the CompTIA
 * disclaimer) holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const tresAt = Math.min(at('s06-01', 'reglas') - 6, ruleAt[0] - 12);
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  /** A line lights on its own word, never before its card. */
  const lineAt = (rule: RecapRule, l: RecapLine, cardAt: number) => Math.max(cardAt + 2, at(rule.seg, l.word, l.nth ?? 0) - 6);

  const art: Record<RecapRule['art'], (i: number) => ReactNode> = {
    clockbook: (i) => <ClockBookArt frame={frame} at={ruleAt[i]} clockAt={at('s06-01', 'RTO') - 6} bookAt={at('s06-01', 'RPO') - 6} />,
    tech: (i) => <TechArt frame={frame} at={ruleAt[i]} meanAt={at('s06-02', 'compara') - 12} />,
    paper: (i) => <PaperArt frame={frame} at={ruleAt[i]} markAt={at('s06-03', 'medido') - 6} />,
  };

  const cards: RecapCardDef[] = RULES.map((rule, i) => ({
    at: ruleAt[i],
    art: art[rule.art](i),
    body: (
      <div>
        {rule.lines.map((l, k) => (
          <RuleLine key={k} line={l} first={k === 0} lit={progress(frame, lineAt(rule, l, ruleAt[i]), 12)} />
        ))}
      </div>
    ),
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: CARDS_TOP }}>
            <RecapCards cards={cards} width={W} height={CARDS_H} gap={GAP} artHeight={ART_H} slotAt={Math.min(-14, tresAt - 40, recapAt - 20)} dimFrom={nextAt} frame={frame} fps={fps} />
          </div>
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
