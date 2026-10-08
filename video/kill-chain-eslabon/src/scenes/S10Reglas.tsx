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
import { TrapBox, trapBoxLabelSlot } from './parts/TrapBox';
import { WorkshopLabel } from './parts/WorkshopLabel';
import { Lupa } from './parts/KillChain';
import { AlarmArt, ChainArt, DoorArt } from './parts/s10-reglas/Miniatures';
import { Stage, wordFrame } from './kit';

const S = 's10-reglas';
const W = STAGE.width;
const CARDS_TOP = 8;
const CARDS_H = 500;
const NEXT_TOP = 530;
const ART_H = 170;

/** One card's illustration: the video's own drawings, small (la cadena rota · la caja por capas · la alarma a la izquierda). */
function RuleImage({ art, frame, draw, beat }: { art: RuleArt; frame: number; draw: number; beat: number }): ReactNode {
  switch (art) {
    case 'chain':
      return <ChainArt frame={frame} draw={draw} broken={beat} />;
    case 'box': {
      const bw = 190;
      const layers = 3 * draw;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <TrapBox width={bw} layers={layers}>
            <WorkshopLabel width={trapBoxLabelSlot(bw).w} show={progress(layers, 2.4, 0.6)} />
          </TrapBox>
          <div style={{ opacity: 0.3 + 0.7 * beat, transform: `scale(${0.9 + 0.1 * beat})` }}>
            <Lupa glow={0.6 * beat} />
          </div>
        </div>
      );
    }
    case 'alarm':
      return <AlarmArt frame={frame} draw={draw} act={beat} />;
  }
}

/**
 * s10-reglas «Tres reglas». Three numbered slots wait from the first frame; each rule card lights as the voice says
 * it, with its drawing from the video, small: the broken chain («él necesita los siete pasos · a ti, romper uno a tu
 * alcance · si vuelve, empieza de nuevo»), the box that opens in layers with the blank workshop label and the
 * magnifier («cada prueba, a su fase»), the alarm on the left of the phase row, acted on («corta a la izquierda»).
 * The later lines of each card light on their words. On `lab2a` the cards step back for the one next step, «Tu
 * turno: Lab 2A · Kill Chain Mapping»; on `endcard` the ALERTÓPOLIS end card — the box that stays at the door —
 * holds to the last frame with the title, the lab, the objective and the SANS/GIAC disclaimer.
 */
export function S10Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const labAt = props.cue('lab2a');
  const endcardAt = props.cue('endcard');

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);
  // Each rule's later lines land on their own words.
  const lineAt = RULE_WORDS.map((ws, i) => ws.map((w) => Math.max(ruleAt[i] + 8, wordFrame(S, w.seg, w.word) - 4)));
  const beatAt = ART_WORDS.map((w, i) => Math.max(ruleAt[i] + 12, wordFrame(S, w.seg, w.word) - 4));

  const rules: RuleCardDef[] = RULES.map((r, i) => {
    return {
      title: r.title,
      sub: [
        <span key="a" style={{ color: C.text }}>
          {r.sub[0]}
        </span>,
        <div key="b">
          {r.sub.slice(1).map((line, k) => (
            <div key={k} style={{ color: C.text, opacity: 0.25 + 0.75 * progress(frame, lineAt[i][k] ?? lineAt[i][0], 12) }}>
              {line}
            </div>
          ))}
        </div>,
      ],
      tone: r.tone,
      at: ruleAt[i],
      art: <RuleImage art={r.art} frame={frame} draw={progress(frame, ruleAt[i] - 4, 26, EASE.inOut)} beat={progress(frame, beatAt[i], 14, EASE.inOut)} />,
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
            slotAt={Math.min(-14, recapAt - 40)}
            dimFrom={labAt}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={labAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** The one next step: Lab 2A. */
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
          padding: '16px 22px 16px 26px',
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
const ART_W = 460;

/** Closing card: the box that stays at the door; ALERTÓPOLIS, title, the lab, objective, disclaimer. */
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
        <DoorArt frame={frame} at={at} width={ART_W} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, lineHeight: 1.08, whiteSpace: 'nowrap', ...title }}>
          <div style={{ fontSize: 66, fontWeight: 850, letterSpacing: -1.6, color: C.textStrong }}>{END.title[0]}</div>
          <div style={{ marginTop: 4, fontSize: 40, fontWeight: 750, color: '#6ee7b7' }}>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {END.next}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.label}>
            {END.lab}
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
