import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { RULES, type RecapLine, type RuleArt } from '../data/s06-recap';
import { Steps } from './parts/Steps';
import { Theatre } from './parts/Theatre';
import { Umbrella } from './parts/Umbrella';
import { EndCard, NextAction } from './parts/s06-recap/EndCard';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 520;
const NEXT_TOP = 548;
const ART_H = 210;

/** One sub line, lit on its word; `{t}` becomes its exam term in violet. */
function Line({ line, show }: { line: RecapLine; show: number }) {
  const [pre, post] = line.text.split('{t}');
  return (
    <div style={{ color: line.strong ? C.textStrong : C.text, fontWeight: line.strong ? 800 : 650, opacity: show }}>
      {pre}
      {line.term !== undefined && post !== undefined ? <span style={{ color: '#c4b5fd', fontWeight: 800 }}>{line.term}</span> : null}
      {post}
    </div>
  );
}

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame; each rule card lights on its cue with the
 * video's own image as its icon — the hot theatre (choose the site by what it already has set up, «y lo bastante
 * lejos»), the four test steps (each test proves one thing: on «fail» the fourth turns emerald and the rest step
 * back) and the folded umbrella with its sticker (a copy never restored is not a copy) — and its lines light on their
 * own words. On `next` the cards step back and «Tu turno: el laboratorio Continuity Ladder» comes in under them; on
 * `endcard` the ALERTÓPOLIS end card takes the stage and its umbrella opens on «paraguas», then holds.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const tresAt = Math.min(wordFrame(S, 's06-01', 'reglas') - 6, ruleAt[0] - 12);
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);
  const openAt = Math.max(endcardAt + 24, wordFrame(S, 's06-04', 'paraguas') - 8);

  const failAt = Math.max(ruleAt[1] + 8, wordFrame(S, 's06-02', 'fail') - 6);
  const fail = progress(frame, failAt, 14, EASE.inOut);

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const show = progress(frame, ruleAt[i] - 2, 14);
    switch (art) {
      case 'theatre':
        return (
          <div style={{ opacity: show }}>
            <Theatre kind="hot" width={240} glow={0.5} frame={frame} />
          </div>
        );
      case 'steps':
        return (
          <div style={{ opacity: show, paddingTop: 10 }}>
            <Steps
              width={250}
              height={160}
              tags={false}
              notes={false}
              frame={frame}
              steps={[0, 1, 2, 3].map((k) =>
                k === 3 ? { state: 'on' as const, tone: fail > 0.02 ? 'emerald' : 'cyan' } : { state: 'on' as const, focus: 1 - 0.75 * fail },
              )}
            />
          </div>
        );
      case 'umbrella':
        return (
          <div style={{ opacity: show }}>
            <Umbrella width={205} open={0} frame={frame} />
          </div>
        );
    }
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    // Each line lights on its own word (never before its card); an unspoken line follows the one before.
    const frames: number[] = [];
    r.sub.forEach((l, k) => {
      const at = l.word ? Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word, l.nth ?? 0) - 6) : (frames[k - 1] ?? ruleAt[i]) + (l.after ?? 14);
      frames.push(at);
    });
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.22 }}>
          {r.sub.map((l, k) => (
            <Line key={k} line={l} show={0.25 + 0.75 * progress(frame, frames[k], 12)} />
          ))}
        </div>
      ),
      tone: 'cyan',
      at: ruleAt[i],
      art: artOf(r.art, i),
    };
  });

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={Math.min(recapAt - 20, tresAt - 40)}
            dimFrom={nextAt}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} openAt={openAt} />
    </Stage>
  );
}
