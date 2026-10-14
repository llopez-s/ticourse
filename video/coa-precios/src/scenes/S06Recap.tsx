import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { ART_WORDS, RULES, type RecapRule } from '../data/s06-recap';
import { EndCard, NextAction } from './parts/s06-recap/EndCard';
import { RecapCards, type RecapCardDef } from './parts/s06-recap/RecapCards';
import { ART_H, LookArt, SingleRowArt } from './parts/s06-recap/RuleArt';
import { RuleLine } from './parts/s06-recap/RuleText';
import { WalkieArt } from './parts/s06-recap/WalkieArt';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 8;
const CARDS_H = 528;
const GAP = 24;
const NEXT_H = 88;
const NEXT_TOP = CARDS_TOP + CARDS_H + Math.round((STAGE.height - CARDS_TOP - CARDS_H - NEXT_H) / 2);

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame (the chapter wipe reveals
 * them). Each rule card lights on its cue with the drawing the video gave it, and its lines light on
 * their own words:
 *   rule-1  yesterday's tape and the alarm with its live camera, on each side of «hoy»: «Discover mira
 *           atrás» (the tape rewinds) · «Detect, hacia delante» (the alarm rings) · small print «Deny
 *           impide» · «Disrupt interrumpe» (plain rule text: s03's DISRUPT label and its gesture are
 *           not in this scene).
 *   rule-2  the matrix, close on a row left with a single cell (amber): «Una fase con una sola celda:»
 *           «punto único de fallo»; on «Pon varias» the row's other cells come back, «varias celdas
 *           por fase».
 *   rule-3  the suspect on his walkie and the sinkhole cell under its DENY label: «Lo que el atacante
 *           ve» «tiene un precio» (the [!] mark glows); on «corta» nobody answers the walkie and the
 *           label lights, «si ya se llevan lo crítico:» «contener ahora, recoger después».
 * On `lab2c` the cards step back and «Tu turno: Lab 2C · Courses of Action» comes in under them; on
 * `endcard` the ALERTÓPOLIS end card takes the stage and holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('lab2c');
  const endcardAt = props.cue('endcard');
  const recapAt = props.cue('recap');

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  /** Each line lights on its own word (never before its card); a line without a word lights with its card. */
  const lineFrames = (rule: RecapRule, cardAt: number) => rule.lines.map((l) => (l.word ? Math.max(cardAt + 2, at(rule.seg, l.word, l.nth ?? 0) - 6) : cardAt + 2));

  const art: ReactNode[] = [
    <LookArt key="look" frame={frame} fps={fps} at={ruleAt[0]} rewindAt={Math.max(ruleAt[0] + 2, at(RULES[0].seg, ART_WORDS.rewind) - 8)} ringAt={at(RULES[0].seg, ART_WORDS.ring) - 4} />,
    <SingleRowArt key="row" frame={frame} at={ruleAt[1]} severalAt={at(RULES[1].seg, ART_WORDS.several) - 6} />,
    <WalkieArt key="walkie" frame={frame} fps={fps} at={ruleAt[2]} seenAt={at(RULES[2].seg, ART_WORDS.seen) - 4} cutAt={at(RULES[2].seg, ART_WORDS.cut) - 4} />,
  ];

  const cards: RecapCardDef[] = RULES.map((rule, i) => {
    const frames = lineFrames(rule, ruleAt[i]);
    const firstSmall = rule.lines.findIndex((l) => l.kind === 'sub');
    return {
      at: ruleAt[i],
      art: art[i],
      body: (
        <div>
          {rule.lines.map((l, k) => (
            <RuleLine key={k} line={l} lit={progress(frame, frames[k], 12)} gap={k === firstSmall ? 10 : 0} />
          ))}
        </div>
      ),
    };
  });

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: CARDS_TOP }}>
            <RecapCards cards={cards} width={W} height={CARDS_H} gap={GAP} artHeight={ART_H} slotAt={Math.min(-14, recapAt - 40)} dimFrom={nextAt} frame={frame} fps={fps} />
          </div>
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
