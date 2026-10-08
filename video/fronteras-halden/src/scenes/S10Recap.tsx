import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, windowWeight, type RuleCardDef } from '../../../engine/src/ui';
import { END, NEXT, QUESTIONS, RULES, type RecapLine, type RuleArt } from '../data/s10-recap';
import { TIMELINE } from '../timeline/load';
import { Customs } from './parts/Customs';
import { EntranceGate } from './parts/EntranceGate';
import { ContainerIcon } from './parts/Shipment';
import { Launch } from './parts/Sites';
import { AskingPort } from './parts/s10-recap/AskingPort';
import { Stage, wordFrame } from './kit';

const S = 's10-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 520;
const NEXT_TOP = 546;
const ART_H = 190;

const EXAM_TEXT = '#c4b5fd';

/** An exam term: capitals and digits (RADIUS, ESP, TLS, FULL, TUNNEL, 802.1X), trailing punctuation aside. */
const EXAM_WORD = /^([0-9A-Z][0-9A-Z.-]*[0-9A-Z])([,:;.]*)$/;

/** One sub line: exam terms violet. */
function Line({ line, show }: { line: RecapLine; show: number }) {
  return (
    <div style={{ color: line.strong ? C.textStrong : C.text, fontWeight: line.strong ? 800 : 650, opacity: show }}>
      {line.text.split(' ').map((w, k) => {
        const m = EXAM_WORD.exec(w);
        const term = m && /[A-Z]/.test(m[1]);
        return (
          <span key={k}>
            {k ? ' ' : ''}
            {term && m ? (
              <>
                <span style={{ color: EXAM_TEXT, fontWeight: 850 }}>{m[1]}</span>
                {m[2]}
              </>
            ) : (
              w
            )}
          </span>
        );
      })}
    </div>
  );
}

/** Per-rule moments for the art (local frames). */
interface ArtTimes {
  /** The card lights. */
  at: number;
  /** Rule 2: the launch lights on «persona». Rule 3: the laptop briefly steps onto the fence on «pie» (the split tunnel), then back at `b`. */
  a: number;
  b: number;
}

/** The card's illustration: the same drawings the video used, at icon size. */
function RuleImage({ art, frame, t }: { art: RuleArt; frame: number; t: ArtTimes }): ReactNode {
  const draw = progress(frame, t.at - 4, 20, EASE.inOut);
  const show = Math.min(1, 0.35 + draw);
  switch (art) {
    case 'gate': {
      // The compound's entrance gate (s03): the office said yes, the gate opens.
      const ans = progress(frame, t.at + 6, 16);
      return (
        <div style={{ opacity: show }}>
          <EntranceGate width={430} call={1} check={1} answer={ans} open={progress(frame, t.at + 18, 18)} result={progress(frame, t.at + 18, 12)} glow={0.3 * draw} frame={frame} />
        </div>
      );
    }
    case 'corridor': {
      // Two sites once, between gateways, ESP in tunnel mode: the container (s07); one person with a client:
      // the launch (s05, s08), which lights on «persona». At this size the whole corridor scene would not read.
      const boat = progress(frame, t.a, 14);
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, opacity: show }}>
          <ContainerIcon width={286} glow={0.4 * draw} />
          <div style={{ opacity: 0.4 + 0.6 * boat }}>
            <Launch width={190} tag={false} glow={0.4 * boat} />
          </div>
        </div>
      );
    }
    case 'customs': {
      // The customs office (s09): everything through the booth; on «pie» a short step onto the fence.
      const sp = windowWeight(frame, t.a, t.b, { ramp: 16, lead: 4 });
      const lap = (off: number) => (frame < t.at ? 0 : ((frame - t.at) / 110 + off) % 1);
      return (
        <div style={{ opacity: show }}>
          <Customs width={450} split={sp} bridge={sp} files={lap(0.2)} web={lap(0.7)} inspect={1 - sp} frame={frame} />
        </div>
      );
    }
  }
}

/**
 * s10-recap «Tres reglas». Three numbered slots wait from the first frame (the transition reveals them). Each
 * rule card lights as the voice says it, with the image the video gave it, and its three lines light on
 * their own words: the compound's entrance gate, which opens on a yes («Una toma no se abre»); the container
 * (tunnel mode between the gateways) and the launch, which lights on «persona» («Dos sedes se unen una
 * vez»); the customs office, where the laptop steps onto the
 * fence for a moment on «pie» («Todo por tu inspección»). On `next` the cards step back for «Tu turno: las
 * preguntas de la lección» with «8 preguntas» (never the lesson id); on `endcard` the ALERTÓPOLIS end card
 * (V16's layout) holds to the last frame: the port that asks who you are under the remate, the title, the next
 * step, the objective (Security+ SY0-701 · 3.2) and the CompTIA disclaimer.
 */
export function S10Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const reglasAt = Math.min(wordFrame(S, 's10-01', 'reglas') - 6, ruleAt[0] - 12);
  const askAt = Math.max(endcardAt + 24, wordFrame(S, 's10-04', 'pregunta') - 8);
  const pieAt = wordFrame(S, 's10-03', 'pie') - 8;

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const lineAt = (seg: string, l: RecapLine, at: number) => Math.max(at + 4, wordFrame(S, seg, l.word, l.nth ?? 0) - 6);

  const art: ArtTimes[] = [
    { at: ruleAt[0], a: 0, b: 0 },
    { at: ruleAt[1], a: wordFrame(S, 's10-02', 'persona') - 6, b: 0 },
    { at: ruleAt[2], a: pieAt, b: Math.min(pieAt + 80, nextAt - 10) },
  ];

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: (
      <div style={{ lineHeight: 1.22 }}>
        {r.sub.map((l, k) => (
          <Line key={k} line={l} show={0.25 + 0.75 * progress(frame, lineAt(r.seg, l, ruleAt[i]), 12)} />
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
            slotAt={Math.min(-14, reglasAt - 40)}
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
      <EndCard frame={frame} fps={fps} at={endcardAt} askAt={askAt} />
    </Stage>
  );
}

/** The one next step: the lesson's questions, with how many (never the lesson id). */
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
          padding: '16px 20px 16px 26px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
        <span
          style={{
            padding: '8px 20px',
            borderRadius: RADIUS.pill,
            background: alpha(C.cyan, 0.16),
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            fontSize: 32,
            fontWeight: 800,
            color: C.cyanSoft,
          }}
        >
          {QUESTIONS}
        </span>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 500;

/** The remate: «La próxima toma libre: ¿te pregunta quién eres?» over the port that asks. */
function Remate({ frame, at, askAt }: { frame: number; at: number; askAt: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26 }}>
      <div style={{ fontSize: 38, fontWeight: 850, lineHeight: 1.14, letterSpacing: -0.5, opacity: progress(frame, at + 4, 12) }}>
        <div style={{ color: C.text, whiteSpace: 'nowrap' }}>{END.remate[0]}</div>
        <div style={{ color: '#6ee7b7', whiteSpace: 'nowrap', opacity: 0.35 + 0.65 * progress(frame, askAt, 12) }}>{END.remate[1]}</div>
      </div>
      <div style={{ opacity: progress(frame, at + 8, 12) }}>
        <AskingPort width={440} ask={progress(frame, askAt, 14)} glow={progress(frame, askAt, 14)} />
      </div>
    </div>
  );
}

/** Closing card: the asking port; ALERTÓPOLIS, title, the next step, the questions, objective, disclaimer. */
function EndCard({ frame, fps, at, askAt }: { frame: number; fps: number; at: number; askAt: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const cta = enter(frame, at + 8, { distance: 18 });
  const chips = enter(frame, at + 12, { distance: 18 });
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
        <Remate frame={frame} at={at} askAt={askAt} />
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
        <div style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.label}>
            {QUESTIONS}
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 14, width: 860, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
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
