import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s08-cierre';
import { Concert } from './parts/Concert';
import { DrawerIcon } from './parts/Drawer';
import { StreetDoor } from './parts/StreetDoor';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_TOP = 0;
const CARDS_H = 430;
const ART_H = 140;
const PHRASE_TOP = 446;
const PHRASE_W = 1560;
const NEXT_TOP = 500;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show, whiteSpace: 'nowrap' }}>{text}</div>;
}

/**
 * s08-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with
 * the image the video gave it — the drawer of the previous tenant (escape or inherit), the building's street door (the
 * customer's side and the gap), the concert's back door (store or system) — and its lines light on their own words. On
 * `phrase` the cards step back and «Antes de nombrarlo, pregúntate dónde nació el fallo» comes in under them. On `next`
 * it gives way to «Tu turno: las preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card takes the stage and
 * holds to the last frame.
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
  const askIn = progress(frame, Math.max(phraseAt + 6, wordFrame(S, 's08-04', 'pregúntate') - 6), 12);
  const phraseOut = progress(frame, nextAt - 16, 12, EASE.inOut);

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const show = progress(frame, ruleAt[i] + 2, 14);
    switch (art) {
      case 'drawer':
        return (
          <div style={{ opacity: show }}>
            <DrawerIcon size={150} open={progress(frame, ruleAt[i] + 6, 18)} />
          </div>
        );
      case 'door':
        return (
          <div style={{ opacity: show }}>
            <StreetDoor width={124} open={progress(frame, ruleAt[i] + 8, 18)} night={1} />
          </div>
        );
      case 'concert':
        return (
          <div style={{ opacity: show }}>
            <Concert width={204} labels={false} sneak={0.2 + 0.8 * progress(frame, ruleAt[i] + 4, 24)} />
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
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />

          {phraseIn > 0.01 && phraseOut < 0.99 ? (
            <div
              style={{
                position: 'absolute',
                left: (W - PHRASE_W) / 2,
                top: PHRASE_TOP,
                width: PHRASE_W,
                boxSizing: 'border-box',
                padding: '20px 36px',
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
              <div style={{ fontSize: 46, fontWeight: 800, whiteSpace: 'nowrap' }}>
                <span style={{ color: C.textStrong }}>{PHRASE.lead} </span>
                <span style={{ color: '#c4b5fd', opacity: 0.25 + 0.75 * askIn }}>{PHRASE.ask}</span>
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
