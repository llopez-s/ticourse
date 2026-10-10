import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { END, LAB, NEXT, RULES, type RuleArt } from '../data/s06-recap';
import { TIMELINE } from '../timeline/load';
import { Acta } from './parts/Acta';
import { Hull } from './parts/Hull';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 520;
const NEXT_TOP = 548;
const ART_H = 190;
const HULL_W = 360;

/** One sub line: lit on its word (the first one is the rule itself, brighter). */
function Line({ text, strong, show }: { text: string; strong?: boolean; show: number }) {
  return <div style={{ color: strong ? C.textStrong : C.text, fontWeight: strong ? 800 : 650, opacity: show }}>{text}</div>;
}

/** Per-rule moments for the art (local frames). */
interface ArtTimes {
  /** The card lights. */
  at: number;
  /** Rule 1: the storm rises («urgente»); rule 2: the acta is signed («excepción»); rule 3: the bilge's check («compruebas»). */
  a: number;
}

/** The card's illustration: the hull of the video, in the state each rule needs. */
function RuleImage({ art, frame, t }: { art: RuleArt; frame: number; t: ArtTimes }): ReactNode {
  const draw = progress(frame, t.at - 4, 20, EASE.inOut);
  const show = Math.min(1, 0.35 + draw);
  switch (art) {
    case 'sea': {
      // The hole (the score) and the sea (the context): calm first, then the storm.
      const storm = progress(frame, t.a, 30, EASE.inOut);
      return (
        <div style={{ opacity: show }}>
          <Hull width={HULL_W} sea={progress(frame, t.at, 18)} storm={storm} hole={progress(frame, t.at, 16)} holeLabel="9.8" labelSize={26} />
        </div>
      );
    }
    case 'record': {
      // The same hull, its mamparos and pump in place, and the signed acta on the right.
      const sign = progress(frame, t.a, 22, EASE.inOut);
      return (
        <div style={{ position: 'relative', opacity: show }}>
          <Hull width={HULL_W} sea={1} hole={1} bulkheads={progress(frame, t.at + 6, 22)} pumps={progress(frame, t.at + 14, 22)} />
          <div style={{ position: 'absolute', right: -6, top: 30 }}>
            <Acta width={92} show={progress(frame, t.at + 8, 16)} sign={sign} />
          </div>
        </div>
      );
    }
    case 'bilge': {
      // The bilge, looked at: dry, and the check.
      return (
        <div style={{ opacity: show }}>
          <Hull width={500} crop="lower" sea={1} hole={1} patch={1} bilge={progress(frame, t.at, 16)} bilgeOk={progress(frame, t.a, 16)} />
        </div>
      );
    }
  }
}

/**
 * s06-recap «Tres reglas». Three numbered slots wait; each rule card lights as the voice says it with the hull in the
 * state that rule needs — the hole under a stormy sea (rule 1: the score is the hole, the context the sea), the same
 * hull with its mamparos and pump and the signed acta (rule 2), the bilge looked at, dry, with its check (rule 3) —
 * and its lines light on their own words. On `next` the cards step back for «Ahora te toca: el laboratorio de triaje»
 * (Vulnerability Triage); on `endcard` the ALERTÓPOLIS end card (the hull, the title, the remate, the objective and the
 * CompTIA disclaimer) holds to the last frame.
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

  const art: ArtTimes[] = [
    { at: ruleAt[0], a: wordFrame(S, 's06-01', 'urgente') - 12 },
    { at: ruleAt[1], a: wordFrame(S, 's06-02', 'excepción') - 8 },
    { at: ruleAt[2], a: wordFrame(S, 's06-03', 'compruebas') - 4 },
  ];

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: (
      <div style={{ lineHeight: 1.22 }}>
        {r.sub.map((l, k) => (
          <Line key={k} text={l.text} strong={l.strong} show={0.25 + 0.75 * progress(frame, Math.max(ruleAt[i] + 4, wordFrame(S, r.seg, l.word, l.nth ?? 0) - 6), 12)} />
        ))}
      </div>
    ),
    tone: 'cyan',
    at: ruleAt[i],
    art: <RuleImage art={r.art} frame={frame} t={art[i]} />,
  }));

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
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** The one next step: the lab that applies this very decision to eight more findings. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: NEXT_TOP,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - Math.min(1, p)) * 18}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '14px 30px 14px 26px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          {LAB}
        </Chip>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 520;
const END_HULL_W = 500;

/** Closing card: the hull; ALERTÓPOLIS, title, the remate, the next step, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const cta = enter(frame, at + 10, { distance: 18 });
  const chips = enter(frame, at + 14, { distance: 18 });
  const ruleDraw = progress(frame, at + 14, 18);
  const disclaimer = enter(frame, at + 20, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 24,
        width: CARD_W,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 54,
        padding: '0 56px',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      <div style={{ flexShrink: 0, width: ART_W, ...art }}>
        <Hull width={END_HULL_W} sea={1} hole={1} holeLabel="9.8" labelSize={34} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 64, fontWeight: 850, letterSpacing: -1.6, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: C.cyan }}>{END.title[0]}</div>
          <div>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 12, fontSize: 38, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', ...sub }}>{END.remate}</div>
        <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14, ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
          <Chip accent="muted" size={TYPE.label}>
            {LAB}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 14, width: 900, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {END.disclaimer}
          {isElevenLabsVoice(TIMELINE.voice) ? (
            <>
              <br />
              Voz: ElevenLabs.
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
