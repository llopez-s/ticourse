import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s13-cierre';
import { Bars, Sheet, Signature } from './parts/Docs';
import { EndCard, NextAction } from './parts/EndCard';
import { BridgeArt, EscapeRoom, LiftCabin } from './parts/Images';
import { SocLog } from './parts/Log';
import { Stage, wordFrame } from './kit';


const S = 's13-cierre';
const W = STAGE.width;
const CARDS_TOP = 0;
const CARDS_H = 440;
const ART_H = 170;
const PHRASE_TOP = 466;
const PHRASE_W = 1580;
const NEXT_TOP = 512;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show }}>{text}</div>;
}

/** Two of the video's images side by side, as one rule's art. */
function Pair({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      {a}
      {b}
    </div>
  );
}

/** The two piles of signatures in miniature: many signed sheets and one document. */
function PilesMini() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ position: 'relative', width: 120, height: 112 }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: 'absolute', left: k * 14, top: k * 12 }}>
            <Sheet width={86} height={64} tone={C.sky} rotate={k - 1}>
              <div style={{ position: 'absolute', left: 8, top: 10 }}>
                <Signature p={1} variant={k} width={62} color="#7dd3fc" strokeWidth={5} />
              </div>
            </Sheet>
          </div>
        ))}
      </div>
      <Sheet width={92} height={116} tone={C.cyan}>
        <div style={{ padding: '14px 12px 0' }}>
          <Bars widths={[100, 100, 70]} gap={9} h={6} />
        </div>
        <div style={{ position: 'absolute', left: 12, bottom: 12 }}>
          <Signature p={1} variant={2} width={66} color={C.cyanSoft} strokeWidth={5} />
        </div>
      </Sheet>
    </div>
  );
}

/**
 * s13-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with the
 * images the video gave it — the two piles of signatures and the lift, the new bridge, the escape room and the empty
 * log — and its lines light on their own words. On `phrase` the cards step back and the exam phrase comes in under
 * them, the signature in sky, the audit in cyan and the pentest in rose. On `next` the phrase gives way to «Tu turno:
 * las preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card takes the stage and holds to the last frame.
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
  const declaraIn = progress(frame, Math.max(phraseAt + 4, wordFrame(S, 's13-04', 'declara') - 8), 12);
  const compruebaIn = progress(frame, Math.max(phraseAt + 8, wordFrame(S, 's13-04', 'comprueba') - 8), 12);
  const aguantasIn = progress(frame, Math.max(phraseAt + 12, wordFrame(S, 's13-04', 'aguantas') - 8), 12);
  const phraseOut = progress(frame, nextAt - 16, 12, EASE.inOut);

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const show = progress(frame, ruleAt[i] + 2, 14);
    const body =
      art === 'piles-lift' ? (
        <Pair a={<PilesMini />} b={<LiftCabin width={72} tone={C.sky} open={show} glow={0.5} />} />
      ) : art === 'bridge' ? (
        <BridgeArt width={330} load={show} />
      ) : (
        <Pair a={<EscapeRoom kind="hint" width={170} lit={show} />} b={<SocLog width={150} height={104} rows={3} title="" titleSize={14} />} />
      );
    return <div style={{ opacity: show }}>{body}</div>;
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames: number[] = [];
    r.sub.forEach((l, k) => {
      const prev = k === 0 ? ruleAt[i] : frames[k - 1];
      frames.push(l.word === null ? prev + 18 : Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word, l.nth ?? 0) - 6));
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
      tone: i === 0 ? 'sky' : i === 1 ? 'cyan' : 'rose',
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
                padding: '16px 36px',
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
              <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <div>
                  <span>{PHRASE.l1[0]}</span>
                  <span style={{ color: C.sky, opacity: 0.25 + 0.75 * declaraIn }}>{PHRASE.l1[1]}</span>
                  <span>{PHRASE.l1[2]}</span>
                  <span style={{ color: C.cyan, opacity: 0.25 + 0.75 * compruebaIn }}>{PHRASE.l1[3]}</span>
                </div>
                <div>
                  <span>{PHRASE.l2[0]}</span>
                  <span style={{ color: C.roseSoft, opacity: 0.25 + 0.75 * aguantasIn }}>{PHRASE.l2[1]}</span>
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
