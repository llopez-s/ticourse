import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { Stage, wordFrame } from './kit';
import { THREE_RULES } from './parts/data';
import { CaseStamp } from './parts/Marks';
import { Plano } from './parts/Plano';

const S = 's12-reglas';
const W = STAGE.width;
const CARDS_TOP = 30;
const CARDS_H = 590;

/** Short headings for the three cards (not canon wording: the canon sentence of each rule is the subtitle). */
const HEADINGS = ['Entregar o salir', 'Etiqueta y puerto', 'Traducir y decidir'] as const;
const ICONS = ['network', 'file', 'firewall'] as const;
const NEXT_BUTTON = 'Práctica · Mapa de red';
const END = {
  title: ['Cómo viaja', 'una conexión'],
  sub: 'IP · gateway · NAT · puertos',
  objective: 'Security+ SY0-701 · objetivos 3.2 y 4.5',
  disclaimer: 'Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.',
} as const;

/**
 * s12-reglas «Tres reglas». Three numbered slots wait; each rule card lights as the voice says it (`r1` «Una»,
 * `r2` «Dos», `r3` «Tres»), the canon sentence of the rule as its subtitle. On `next` the cards step back and
 * the end card arrives: ALERTÓPOLIS, «Cómo viaja una conexión», the plan in miniature and the one next step,
 * the button «Práctica · Mapa de red», which holds to the last frame. No exam card, nothing new on screen.
 */
export function S12Reglas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const threeAt = props.cue('three');
  const ruleAt = [props.cue('r1'), props.cue('r2'), props.cue('r3')];
  const nextAt = props.cue('next');
  const practiceAt = wordFrame(S, 's12-05', 'práctica') - 4;
  const endAt = nextAt + 16;
  const boardOut = progress(frame, endAt - 8, 14, EASE.inOut);

  const rules: RuleCardDef[] = THREE_RULES.map((text, i) => ({
    title: HEADINGS[i],
    sub: <span style={{ display: 'block', whiteSpace: 'normal', fontWeight: 700 }}>{text}</span>,
    icon: ICONS[i],
    tone: 'cyan',
    at: ruleAt[i],
  }));

  return (
    <>
      <Stage>
        {boardOut < 1 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
            <RuleCards
              rules={rules}
              width={W}
              height={CARDS_H}
              gap={24}
              slotAt={threeAt - 8}
              dimFrom={nextAt}
              titleSize={54}
              subSize={38}
              artHeight={140}
              frame={frame}
              fps={fps}
              style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
            />
          </div>
        ) : null}
        <EndCard frame={frame} fps={fps} at={endAt} practiceAt={practiceAt} />
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}

const CARD_W = 1620;
const ART_W = 470;

/** Closing card: the plan in miniature, ALERTÓPOLIS, the title, the next step as a button, the objective, the disclaimer. */
function EndCard({ frame, fps, at, practiceAt }: { frame: number; fps: number; at: number; practiceAt: number }) {
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
  const hot = progress(frame, Math.max(practiceAt, at + 12), 12);
  const beat = hot * (0.6 + 0.4 * pulse(frame, fps, 0.8));
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
      {/* the plan, in miniature */}
      <div style={{ position: 'relative', flexShrink: 0, width: ART_W, height: 150, ...art }}>
        <Plano view={{ x: 0, y: 0, k: ART_W / 1728 }} dashed={1} names={0} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 68, fontWeight: 850, letterSpacing: -1.6, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: C.cyan }}>{END.title[0]}</div>
          <div>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 10, fontSize: 38, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 24, ...cta }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
              padding: '14px 34px 14px 26px',
              borderRadius: 28,
              background: alpha(C.cyan, 0.12 + 0.1 * beat),
              border: `3px solid ${alpha(C.cyan, 0.7 + 0.3 * beat)}`,
              boxShadow: `0 0 ${Math.round(18 + 24 * beat)}px ${alpha(C.cyan, 0.2 + 0.2 * beat)}`,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
            <span style={{ fontSize: 46, fontWeight: 850, color: C.textStrong }}>{NEXT_BUTTON}</span>
          </div>
        </div>
        <div style={{ marginTop: 18, ...chips }}>
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
