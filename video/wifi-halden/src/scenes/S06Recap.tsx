import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { RULES, type RecapRule } from '../data/s06-recap';
import { EndCard, NextAction } from './parts/s06-recap/EndCard';
import { RecapCards, type RecapCardDef } from './parts/s06-recap/RecapCards';
import { ART_H, CarnetArt, FloodArt, PadlockArt } from './parts/s06-recap/RuleArt';
import { RuleLine } from './parts/s06-recap/RuleText';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 8;
const CARDS_H = 496;
const GAP = 24;
const NEXT_H = 88;
const NEXT_TOP = CARDS_TOP + CARDS_H + Math.round((STAGE.height - CARDS_TOP - CARDS_H - NEXT_H) / 2);

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame (the chapter wipe reveals
 * them). Each rule card lights as the voice starts it, with the drawing the video gave it, and its
 * lines light on their own words, in the mould «si… entonces…»:
 *   1  the dock floodlight lighting the house across the way — «Si el foco alumbra al vecino:» — and
 *      on `rule-1` it is lowered and turned inwards: «bájalo y gíralo» · «colocación y potencia».
 *   2  the combination padlock bolted to the locker: «WPA3 personal» «pone SAE» · «frena el ataque sin
 *      conexión» · «y da forward secrecy» · and, amber, «la clave sigue siendo de todos».
 *   3  a tablet and its carné: «Un carné por tableta:» «enterprise» · «EAP-TLS, o PEAP» · «si validas
 *      al servidor»; the carné's seal lights on «EAP-TLS».
 * On `next` the cards step back and «Tu turno: termina la lección y sus preguntas» comes in under
 * them; on `endcard` the ALERTÓPOLIS end card takes the stage and holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  // Rule 1's cue falls on its second half («bájalo»): the card itself lights when the voice starts the rule.
  const ruleAt = [Math.min(props.cue('rule-1'), at('s06-01', 'Si') - 4), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const reglasAt = Math.min(at('s06-01', 'reglas') - 6, ruleAt[0] - 12);

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  /** Each line lights on its own word (never before its card); an unspoken line follows the one before. */
  const lineFrames = (rule: RecapRule, cardAt: number) => {
    const out: number[] = [];
    rule.lines.forEach((l, k) => {
      out.push(l.word ? Math.max(cardAt + 2, at(rule.seg, l.word) - 6) : (out[k - 1] ?? cardAt) + (l.after ?? 12));
    });
    return out;
  };

  const art: ReactNode[] = [
    <FloodArt key="flood" frame={frame} at={ruleAt[0]} turnAt={props.cue('rule-1') - 2} />,
    <PadlockArt key="padlock" frame={frame} at={ruleAt[1]} brakeAt={at('s06-02', 'frena') - 4} />,
    <CarnetArt key="carnet" frame={frame} at={ruleAt[2]} sealAt={at('s06-03', 'EAP-TLS') - 4} />,
  ];

  const cards: RecapCardDef[] = RULES.map((rule, i) => {
    const frames = lineFrames(rule, ruleAt[i]);
    const firstSmall = rule.lines.findIndex((l) => l.kind === 'sub' || l.kind === 'but');
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
            <RecapCards cards={cards} width={W} height={CARDS_H} gap={GAP} artHeight={ART_H} slotAt={Math.min(-14, reglasAt - 40)} dimFrom={nextAt} frame={frame} fps={fps} />
          </div>
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
