import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { S06_END, S06_NEXT, S06_RULES } from '../data/s06-recap';
import { TIMELINE } from '../timeline/load';
import { Bus, Rider } from './parts/Figures';
import { AskArt, BusArt, StagesArt } from './parts/RuleArt';
import { Stage } from './kit';

const W = STAGE.width;
const CARDS_TOP = 24;
const CARDS_H = 460;
const NEXT_TOP = 502;
const ART_H = 140;

/**
 * s06-recap «Tres reglas»: three rule cards, each lit as the voice says it and
 * carrying its image in miniature (the bus with travellers, the traveller and
 * her four questions, the stage bars with the depot). Then one next action,
 * the lesson's six questions, and the ALERTÓPOLIS end card with the disclaimer.
 * No lab is mentioned.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');

  const boardOpacity = 1 - progress(frame, endcardAt - 14, 14, EASE.inOut);
  const arts = [<BusArt key="a" />, <AskArt key="b" />, <StagesArt key="c" />];
  const tones = ['emerald', 'sky', 'amber'] as const;
  const rules: RuleCardDef[] = S06_RULES.map((r, i) => ({
    title: r.title,
    sub: [...r.sub].map((l) => <span key={l}>{l}</span>),
    tone: tones[i],
    at: ruleAt[i],
    art: arts[i],
  }));

  return (
    <Stage>
      {boardOpacity > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: boardOpacity, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={recapAt - 10}
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

/** The one next action: the lesson's six questions. */
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
          gap: 24,
          padding: '18px 36px 18px 28px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
        }}
      >
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{S06_NEXT}</span>
      </div>
    </div>
  );
}

const CARD_W = 1420;

/** Closing card: the bus with its travellers, ALERTÓPOLIS, title, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const objective = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18);
  const disclaimer = enter(frame, at + 18, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 30,
        width: CARD_W,
        height: STAGE.height - 60,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 56,
        padding: '0 64px',
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
      <div style={{ flexShrink: 0, width: 380, height: 200, position: 'relative', ...art }}>
        <div style={{ position: 'absolute', left: 0, top: 40 }}>
          <Bus width={290} riders={[1, 0, 1, 1, 0]} />
        </div>
        <div style={{ position: 'absolute', left: 300, top: 106 }}>
          <Rider size={64} />
        </div>
        <div style={{ position: 'absolute', left: 340, top: 106 }}>
          <Rider size={64} />
        </div>
        <svg width={380} height={20} viewBox="0 0 380 20" style={{ position: 'absolute', left: 0, top: 168 }} aria-hidden>
          <line x1="0" y1="10" x2="380" y2="10" stroke={C.ink600} strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 70, fontWeight: 850, letterSpacing: -2, lineHeight: 1.04, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          {S06_END.title.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 38, fontWeight: 650, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap', ...sub }}>
          {S06_END.sub.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
        <div style={{ marginTop: 20, ...objective }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {S06_END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 22, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 18, width: 760, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {S06_END.disclaimer}
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
