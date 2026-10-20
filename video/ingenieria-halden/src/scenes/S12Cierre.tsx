import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { BankCardArt, DisguiseArt, LetterArt } from './parts/Images';
import { EndCard, NextAction } from './parts/EndCard';
import { Stage, wordFrame } from './kit';

const S = 's12-cierre';
const W = STAGE.width;
const CARDS_H = 440;
const ART_H = 170;
const PHRASE_TOP = 474;
const PHRASE_W = 1400;
const NEXT_TOP = 510;

interface RecapLine {
  text: string;
  /** The line lights when the voice says this word (in the rule's segment); null = right after the line above. */
  word: string | null;
  strong?: boolean;
}

type RuleArt = 'letter' | 'card' | 'disguise';

/** Titles one line (≤ 16 characters), sub lines ≤ 26 characters at 32 px (the card is ~560 px wide). */
const RULES: { art: RuleArt; seg: string; title: string; sub: RecapLine[] }[] = [
  // «La primera, mira cómo llega, porque el canal le pone el nombre.»
  {
    art: 'letter',
    seg: 's12-01',
    title: 'Mira cómo llega',
    sub: [
      { text: 'correo, SMS o voz', word: 'canal', strong: true },
      { text: 'le ponen el nombre', word: 'nombre', strong: true },
      { text: 'cuente lo que cuente', word: null },
    ],
  },
  // «La segunda, si no hay nada técnico, la defensa es un paso que no se salta. Llamas tú, y firma otra persona.»
  {
    art: 'card',
    seg: 's12-02',
    title: 'Sin nada técnico',
    sub: [
      { text: 'un paso que no se salta', word: 'salta', strong: true },
      { text: 'llamas tú al de siempre', word: 'llamas', strong: true },
      { text: 'y otra persona firma', word: 'firma', strong: true },
    ],
  },
  // «Y la tercera, mira de qué va disfrazado y si sabe que miente.»
  {
    art: 'disguise',
    seg: 's12-03',
    title: 'El disfraz',
    sub: [
      { text: 'una persona o una marca', word: 'disfrazado', strong: true },
      { text: 'a propósito o de buena fe', word: 'miente', strong: true },
    ],
  },
];

const PHRASE = 'Mira cómo llega, quién dice ser y qué te pide';

/** One sub line: lit on its word. */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show }}>{text}</div>;
}

/**
 * s12-cierre «Para el examen». Three numbered slots wait from the first frame; each rule card lights on its cue with
 * its image — the letter in its three ways (how it arrives), the back of the bank card (a step nobody skips), the
 * disguise (who it pretends to be, and whether it knows it lies) — and its lines light on their own words. On
 * `phrase` the cards step back and the exam phrase comes in under them. On `next` the phrase gives way to «Tu turno:
 * las preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card takes the stage and holds to the last frame.
 */
export function S12Cierre(props: SceneProps) {
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

  const artOf = (art: RuleArt, i: number): ReactNode => {
    const show = progress(frame, ruleAt[i] + 2, 14);
    const body =
      art === 'letter' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <LetterArt form="envelope" width={150} />
          <LetterArt form="phone" width={150} />
          <LetterArt form="handset" width={150} />
        </div>
      ) : art === 'card' ? (
        <BankCardArt width={250} flip={1} glow={1} />
      ) : (
        <DisguiseArt width={250} />
      );
    return <div style={{ opacity: show }}>{body}</div>;
  };

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    const frames: number[] = [];
    r.sub.forEach((l, k) => {
      const prev = k === 0 ? ruleAt[i] : frames[k - 1];
      frames.push(l.word === null ? prev + 18 : Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word) - 6));
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
      tone: i === 0 ? 'cyan' : i === 1 ? 'emerald' : 'rose',
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
            slotAt={Math.min(recapAt - 20, ruleAt[0] - 40)}
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
                padding: '22px 36px',
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
              <Icon name="mortarboard" size={60} color={C.violet} strokeWidth={2} />
              <div style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{PHRASE}</div>
            </div>
          ) : null}

          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}
