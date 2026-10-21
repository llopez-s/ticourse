import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s08-cierre';
import { FireTrucks, ImageTag, PartInBox, TenMinuteClock } from './parts/Firehouse';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_H = 462;
const ART_H = 104;
const ICON_H = 92;
const TAG_TOP = 478;
const PHRASE_TOP = 530;
const PHRASE_W = 1640;
const NEXT_TOP = 520;

const PHRASE_TONE = { cyan: C.cyan, amber: C.amber, violet: '#c4b5fd' } as const;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show, whiteSpace: 'nowrap' }}>{text}</div>;
}

/**
 * s08-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with the
 * fire-station icon it was given — the two trucks on duty, the ten-minute clock, the part in its box — under its
 * rule, its lines lit on the voice's words. On `phrase` the cards step back and the exam phrase comes in under them, a
 * beat per sentence on its word. On `next` it gives way to «Tu turno: las preguntas de la lección»; on `endcard` the
 * ALERTÓPOLIS end card takes the stage and holds.
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

  const phraseIn = progress(frame, phraseAt - 2, 16);
  const phraseOut = progress(frame, nextAt - 16, 12, EASE.inOut);
  const beatAt = PHRASE.map((p, i) => (i === 0 ? phraseAt : Math.max(phraseAt + 6, wordFrame(S, 's08-04', p.word) - 8)));
  const tagIn = progress(frame, ruleAt[0] + 6, 14);

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const show = progress(frame, ruleAt[i] + 2, 14);
    const glow = 0.5 * show;
    switch (art) {
      case 'trucks':
        return (
          <div style={{ opacity: show }}>
            <FireTrucks size={ICON_H} glow={glow} idSuffix="-s8" />
          </div>
        );
      case 'clock':
        return (
          <div style={{ opacity: show }}>
            <TenMinuteClock size={ICON_H} glow={glow} idSuffix="-s8" />
          </div>
        );
      case 'part':
        return (
          <div style={{ opacity: show }}>
            <PartInBox size={ICON_H} glow={glow} idSuffix="-s8" />
          </div>
        );
    }
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames = r.sub.map((l) => (l.word ? Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word) - 6) : ruleAt[i] + 8));
    return {
      title: r.title,
      sub: (
        <div style={{ lineHeight: 1.2 }}>
          {r.sub.map((l, k) => (
            <Line key={k} text={l.text} strong={l.strong} show={0.3 + 0.7 * progress(frame, frames[k] + k * 2, 12)} />
          ))}
        </div>
      ),
      tone: i === 1 ? 'amber' : i === 2 ? 'violet' : 'cyan',
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
            slotAt={recapAt - 20}
            dimFrom={phraseAt}
            titleSize={50}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: 0 }}
          />

          {/* The three icons are the fire-station image: labelled once, under the cards */}
          <div style={{ position: 'absolute', left: 0, top: TAG_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: tagIn * (1 - phraseOut), transform: `translateY(${(1 - tagIn) * 8}px)` }}>
            <ImageTag size={26} />
          </div>

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
                gap: 24,
                opacity: phraseIn * (1 - phraseOut),
                transform: `translateY(${(1 - phraseIn) * 16 - phraseOut * 10}px)`,
              }}
            >
              <Icon name="mortarboard" size={56} color={C.violet} strokeWidth={2} />
              <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.25, whiteSpace: 'nowrap' }}>
                <div>
                  {PHRASE.slice(0, 2).map((p, i) => (
                    <span key={p.text} style={{ color: PHRASE_TONE[p.tone], opacity: 0.25 + 0.75 * progress(frame, beatAt[i], 12) }}>
                      {p.text}
                      {i === 0 ? ' ' : ''}
                    </span>
                  ))}
                </div>
                <div style={{ color: PHRASE_TONE[PHRASE[2].tone], opacity: 0.25 + 0.75 * progress(frame, beatAt[2], 12) }}>{PHRASE[2].text}</div>
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
