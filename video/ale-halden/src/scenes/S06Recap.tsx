import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { RULES, type RuleArt } from '../data/s06-recap';
import { EndCard, NextAction } from './parts/s06-recap/EndCard';
import { ART_H, BarsArt, CalendarArt, PhoneArt } from './parts/s06-recap/RuleArt';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 520;
const NEXT_TOP = 548;

/** One sub line: lit on its word (the first one is the rule itself, brighter). */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show }}>{text}</div>;
}

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame; each rule card lights as the voice
 * says it, with the image the video gave it — the phone whose screen cracks (an event does not take it all: the EF
 * is a percentage), the ten-year calendar with its five uneven marks (per year you multiply by the ARO; backwards
 * you divide) and the two annual bars (the ALE is held against the control) — and its lines light on their own
 * words. On `next` the cards step back and «Tu turno: Risk Math» comes in under them; on `endcard` the ALERTÓPOLIS
 * end card takes the stage and holds to the last frame.
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

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const at = ruleAt[i];
    switch (art) {
      case 'phone':
        return <PhoneArt frame={frame} at={at} crackAt={wordFrame(S, 's06-01', 'todo') - 8} />;
      case 'calendar':
        return <CalendarArt frame={frame} at={at} marksAt={wordFrame(S, 's06-02', 'ARO') - 4} />;
      case 'bars':
        return <BarsArt frame={frame} at={at} />;
    }
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    // Each line lights on its own word (never before its card); an unspoken line follows the one before.
    const frames: number[] = [];
    r.sub.forEach((l, k) => {
      const spoken = l.word ? Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word, l.nth ?? 0) - 6) : (frames[k - 1] ?? ruleAt[i]) + (l.after ?? 14);
      frames.push(spoken);
    });
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.22 }}>
          {r.sub.map((l, k) => (
            <Line key={k} text={l.text} strong={l.strong} show={0.25 + 0.75 * progress(frame, frames[k], 12)} />
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
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
