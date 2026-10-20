import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s08-cierre';
import { Graffiti } from './parts/Graffiti';
import { Kitchen } from './parts/Kitchen';
import { HiddenMic, Thief } from './parts/ThiefMic';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_H = 440;
const ART_H = 130;
const PHRASE_TOP = 450;
const PHRASE_W = 1600;
const NEXT_TOP = 500;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show, whiteSpace: 'nowrap' }}>{text}</div>;
}

/**
 * s08-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with
 * the image the video gave it — the wall with the slogan and the tag (fuera y con poco), the thief and the hidden
 * microphone (fuera y con mucho), the kitchen (ya dentro) — and its lines light on their own words. On `phrase` the
 * cards step back and the exam phrase comes in under them: the pair line in sky, the motive line in amber, each on its
 * word. On `next` the phrase gives way to «Tu turno: las preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card
 * takes the stage and holds to the last frame.
 */
export function S08Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phraseAt = props.cue('phrase');
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const tresAt = Math.min(wordFrame(S, 's08-01', 'reglas') - 6, ruleAt[0] - 12);
  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const phraseIn = progress(frame, phraseAt - 2, 16);
  const pairIn = progress(frame, Math.max(phraseAt + 4, wordFrame(S, 's08-04', 'pareja') - 20), 12);
  const whoIn = progress(frame, Math.max(phraseAt + 8, wordFrame(S, 's08-04', 'quiere') - 8), 12);
  const phraseOut = progress(frame, nextAt - 14, 12, EASE.inOut);

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const show = progress(frame, ruleAt[i] + 2, 14);
    switch (art) {
      case 'graffiti':
        return (
          <div style={{ opacity: show }}>
            <Graffiti width={480} lema={progress(frame, wordFrame(S, 's08-01', 'causa') - 6, 14)} mote={progress(frame, wordFrame(S, 's08-01', 'presume') - 6, 14)} />
          </div>
        );
      case 'thief-mic':
        return (
          <div style={{ opacity: show, display: 'flex', gap: 40 }}>
            <Thief size={ART_H} glow={progress(frame, wordFrame(S, 's08-02', 'cobrar') - 4, 12)} />
            <HiddenMic size={ART_H} glow={progress(frame, wordFrame(S, 's08-02', 'quedarse') - 4, 12)} listen={progress(frame, wordFrame(S, 's08-02', 'quedarse') - 4, 12)} />
          </div>
        );
      case 'kitchen':
        return (
          <div style={{ opacity: show }}>
            <Kitchen width={490} lit={[1, 1, 1]} />
          </div>
        );
    }
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames = r.sub.map((l) => Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word, l.nth ?? 0) - 6));
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.2 }}>
          {r.sub.map((l, k) => (
            <Line key={k} text={l.text} strong={l.strong} show={0.25 + 0.75 * progress(frame, frames[k] + k * 2, 12)} />
          ))}
        </div>
      ),
      tone: i === 0 ? 'amber' : i === 1 ? 'rose' : 'sky',
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
            subSize={30}
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
                padding: '14px 32px',
                borderRadius: 26,
                background: alpha(C.violet, 0.08),
                border: `3px solid ${alpha(C.violet, 0.6)}`,
                boxShadow: `0 0 34px ${alpha(C.violet, 0.18)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 26,
                opacity: phraseIn * (1 - phraseOut),
                transform: `translateY(${(1 - phraseIn) * 16 - phraseOut * 10}px)`,
              }}
            >
              <Icon name="mortarboard" size={60} color={C.violet} strokeWidth={2} />
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.25, whiteSpace: 'nowrap' }}>
                <div style={{ color: C.sky, opacity: 0.25 + 0.75 * pairIn }}>{PHRASE.pair}</div>
                <div style={{ color: C.amber, opacity: 0.25 + 0.75 * whoIn }}>{PHRASE.who}</div>
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
