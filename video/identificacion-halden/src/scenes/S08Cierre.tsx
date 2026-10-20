import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { PHRASE, RULES, type RuleArt } from '../data/s08-cierre';
import { EndCard, NextAction } from './parts/s08-cierre/EndCard';
import { ART_H, CasaArt, ConsultaArt, TiendaArt } from './parts/s08-cierre/RuleArt';
import { Stage, wordFrame } from './kit';

const S = 's08-cierre';
const W = STAGE.width;
const CARDS_TOP = 0;
const CARDS_H = 420;
const PHRASE_TOP = 452;
const PHRASE_W = 1500;
const NEXT_TOP = 490;

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show }}>{text}</div>;
}

/**
 * s08-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with the
 * image the video gave it — la consulta (the doctor at the door, the blood test, the heart-rate band), la casa (the
 * plans, the tap, the materials list) and la tienda de la calle (the newspaper, the shops' group, the mercadillo) — and
 * its lines light on the voice's words (or a beat after, for the line the voice leaves to the screen). On `phrase` the
 * cards step back and «Antes de elegir, pregúntate qué puede ver ese método y qué no» comes in under them; on `next` it
 * gives way to «Tu turno: las preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card takes the stage and holds
 * to the last frame.
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

  // The phrase: the lead on the cue, «qué puede ver» on «ver», «y qué no» on «no».
  const phraseIn = progress(frame, phraseAt - 2, 16);
  const seeIn = progress(frame, Math.max(phraseAt + 4, wordFrame(S, 's08-04', 'ver') - 8), 12);
  const notIn = progress(frame, Math.max(phraseAt + 8, wordFrame(S, 's08-04', 'no') - 6), 12);
  const phraseOut = progress(frame, nextAt - 16, 12, EASE.inOut);

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const at = ruleAt[i];
    switch (art) {
      case 'consulta':
        return <ConsultaArt frame={frame} at={at} />;
      case 'casa':
        return <CasaArt frame={frame} at={at} />;
      case 'tienda':
        return <TiendaArt frame={frame} at={at} />;
    }
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    // Each line lights on its own word, never before its card; a line the voice does not say follows the one before.
    const frames: number[] = [];
    r.sub.forEach((l, k) => {
      const prev = frames[k - 1] ?? ruleAt[i];
      frames.push(l.word ? Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word, l.nth ?? 0) - 6) : prev + 16);
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
            dimFrom={phraseAt}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />

          {/* the exam phrase */}
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
              <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <div>{PHRASE.lead}</div>
                <div>
                  <span style={{ color: C.cyan, opacity: 0.25 + 0.75 * seeIn }}>{PHRASE.see}</span>
                  <span style={{ opacity: 0.25 + 0.75 * notIn }}>{PHRASE.and}</span>
                  <span style={{ color: C.amber, opacity: 0.25 + 0.75 * notIn }}>{PHRASE.not}</span>
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
