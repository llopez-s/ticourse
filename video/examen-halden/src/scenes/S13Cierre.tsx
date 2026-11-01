import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s13-cierre';
import { EndCard, NextAction } from './parts/s13-cierre/EndCard';
import { ColumnsIcon, CrosswordIcon, OptionsIcon } from './parts/s13-cierre/RuleArt';
import { Stage, wordFrame } from './kit';

const S = 's13-cierre';
const W = STAGE.width;
const CARDS_H = 440;
const ART_H = 150;
const PHRASE_TOP = 474;
const PHRASE_W = 1560;
const NEXT_TOP = 510;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show }}>{text}</div>;
}

/**
 * s13-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with the
 * image its concept had in the video — the four options with two struck, the two columns, the crossword — and its lines
 * light on their own words. On `phrase` the cards step back and the exam phrase comes in under them («qué te piden» in
 * violet). On `next` the phrase gives way to «Tu turno: un simulacro de 90 preguntas y 90 minutos»; on `endcard` the
 * ALERTÓPOLIS end card takes the stage and holds to the last frame. No Halden seal, no exam card.
 */
export function S13Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phraseAt = props.cue('phrase');
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const tresAt = Math.min(wordFrame(S, 's13-01', 'tres') - 6, ruleAt[0] - 12);
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const phraseIn = progress(frame, phraseAt - 2, 16);
  const leeIn = progress(frame, Math.max(phraseAt + 2, wordFrame(S, 's13-04', 'piden') - 12), 12);
  const tachaIn = progress(frame, Math.max(phraseAt + 6, wordFrame(S, 's13-04', 'tacha') - 8), 12);
  const dejaIn = progress(frame, Math.max(phraseAt + 10, wordFrame(S, 's13-04', 'deja') - 8), 12);
  const phraseOut = progress(frame, nextAt - 16, 12, EASE.inOut);

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const show = progress(frame, ruleAt[i] + 2, 14);
    switch (art) {
      case 'options':
        return (
          <div style={{ opacity: show }}>
            <OptionsIcon strike={progress(frame, ruleAt[i] + 14, 18)} />
          </div>
        );
      case 'columns':
        return (
          <div style={{ opacity: show }}>
            <ColumnsIcon tilt={progress(frame, ruleAt[i] + 12, 24, EASE.inOut)} />
          </div>
        );
      case 'crossword':
        return (
          <div style={{ opacity: show }}>
            <CrosswordIcon easy={progress(frame, ruleAt[i] + 6, 30, EASE.inOut)} hard={progress(frame, ruleAt[i] + 34, 30, EASE.inOut)} ring={progress(frame, ruleAt[i] + 24, 24)} />
          </div>
        );
    }
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames = r.sub.map((l) => Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word, l.nth ?? 0) - 6));
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.22 }}>
          {r.sub.map((l, k) => (
            <Line key={k} text={l.text} strong={l.strong} show={0.25 + 0.75 * progress(frame, frames[k], 12)} />
          ))}
        </div>
      ),
      tone: i === 1 ? 'sky' : i === 2 ? 'violet' : 'cyan',
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
            dimFrom={phraseAt}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />

          {phraseIn > 0.01 && phraseOut < 0.99 ? (
            <div
              style={{
                position: 'absolute',
                left: (W - PHRASE_W) / 2,
                top: PHRASE_TOP,
                width: PHRASE_W,
                boxSizing: 'border-box',
                padding: '18px 36px',
                borderRadius: 26,
                background: alpha(C.violet, 0.08),
                border: `3px solid ${alpha(C.violet, 0.6)}`,
                boxShadow: `0 0 34px ${alpha(C.violet, 0.18)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 28,
                opacity: phraseIn * (1 - phraseOut),
                transform: `translateY(${(1 - phraseIn) * 16 - phraseOut * 10}px)`,
              }}
            >
              <Icon name="mortarboard" size={64} color={C.violet} strokeWidth={2} />
              <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <div>
                  <span style={{ opacity: 0.25 + 0.75 * leeIn }}>{PHRASE.lead}</span>
                  <span style={{ color: C.violet, opacity: 0.25 + 0.75 * leeIn }}>{PHRASE.ask}</span>
                  <span style={{ opacity: 0.25 + 0.75 * tachaIn }}>{PHRASE.strike}</span>
                </div>
                <div style={{ opacity: 0.25 + 0.75 * dejaIn }}>
                  {PHRASE.end}
                </div>
              </div>
            </div>
          ) : null}

          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
