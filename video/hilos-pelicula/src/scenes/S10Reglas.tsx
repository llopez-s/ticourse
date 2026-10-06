import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { ART_WORDS, END, NEXT, RULES, RULE_WORDS, type RuleArt } from '../data/s10-reglas';
import { TIMELINE } from '../timeline/load';
import { EndArt, FilmArt, LabelArt, ProjectedArt } from './parts/s10-reglas/Miniatures';
import { Stage, wordFrame } from './kit';

const S = 's10-reglas';
const W = STAGE.width;
const CARDS_TOP = 8;
const CARDS_H = 520;
const NEXT_TOP = 548;
const ART_H = 160;

/** One card's illustration: the video's own images, small (la tira de película · la etiqueta del taller · el fotograma proyectado). */
function RuleImage({ art, draw, beat }: { art: RuleArt; draw: number; beat: number }): ReactNode {
  switch (art) {
    case 'film':
      return <FilmArt draw={draw} beat={beat} />;
    case 'label':
      return <LabelArt draw={draw} beat={beat} />;
    case 'projected':
      return <ProjectedArt draw={draw} beat={beat} />;
  }
}

/**
 * s10-reglas «Tres reglas». Three numbered slots wait from the first frame; each rule card lights as the voice says
 * it, with its drawing from the video, small: the film strip whose thread runs on «película»; the workshop label
 * with the PDB path, glowing on «única»; s08 in miniature, Meridian's last frame projected into Orbital's gap on
 * «plan». The later lines of each card light on their words. On `next` the cards step back for the one next step,
 * «Tu turno: las preguntas de la lección · s2m4 · 10 preguntas»; on `endcard` the ALERTÓPOLIS end card — one photo in
 * front of its film («ninguna foto viene sola») — holds to the last frame with the title, the quiz, the objective and
 * the SANS/GIAC disclaimer. No lab.
 */
export function S10Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);
  // Each rule's later lines land on their own words.
  const lineAt = RULE_WORDS.map((ws, i) => ws.map((w) => Math.max(ruleAt[i] + 8, wordFrame(S, w.seg, w.word) - 4)));
  const beatAt = ART_WORDS.map((w, i) => Math.max(ruleAt[i] + 12, wordFrame(S, w.seg, w.word) - 4));

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: [
      <span key="a" style={{ color: i === 2 ? '#6ee7b7' : C.text, fontWeight: i === 2 ? 800 : 700 }}>
        {r.sub[0]}
      </span>,
      <div key="b">
        {r.sub.slice(1).map((line, k) => (
          <div key={k} style={{ color: C.text, opacity: 0.25 + 0.75 * progress(frame, lineAt[i][k] ?? lineAt[i][lineAt[i].length - 1], 12) }}>
            {line}
          </div>
        ))}
      </div>,
    ],
    tone: r.tone,
    at: ruleAt[i],
    art: <RuleImage art={r.art} draw={progress(frame, ruleAt[i] - 4, 30, EASE.inOut)} beat={progress(frame, beatAt[i], 18, EASE.inOut)} />,
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
            slotAt={Math.min(-14, recapAt - 40)}
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

/** The one next step: the lesson's ten questions. */
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
          padding: '14px 22px 14px 26px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          whiteSpace: 'nowrap',
          fontFamily: FONT.sans,
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT.text}</span>
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
          {NEXT.chip}
        </span>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 440;

/** Closing card: one photo in front of its film; ALERTÓPOLIS, title, the quiz, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const cta = enter(frame, at + 8, { distance: 18 });
  const chips = enter(frame, at + 12, { distance: 18 });
  const ruleDraw = progress(frame, at + 14, 18);
  const disclaimer = enter(frame, at + 18, { distance: 12 });
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
      <div style={{ flexShrink: 0, width: ART_W, display: 'flex', justifyContent: 'center', ...art }}>
        <EndArt frame={frame} at={at} width={ART_W} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, lineHeight: 1.08, whiteSpace: 'nowrap', ...title }}>
          <div style={{ fontSize: 66, fontWeight: 850, letterSpacing: -1.6, color: C.textStrong }}>{END.title[0]}</div>
          <div style={{ marginTop: 4, fontSize: 40, fontWeight: 750, color: C.roseSoft }}>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {END.next}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, ...chips }}>
          <Chip accent="cyan" icon="file" size={TYPE.label}>
            {END.quiz}
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
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
