import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type IconName, type RuleCardDef } from '../../../engine/src/ui';
import { END, NEXT, PHRASE, RECAP, RULES } from '../data/s07-cierre';
import { TIMELINE } from '../timeline/load';
import { Stage } from './kit';

const W = STAGE.width;
const HEAD_H = 64;
const CARDS_TOP = 76;
const CARDS_H = 410;
const BAR_TOP = 520;
const BAR_H = 112;

/**
 * s07-cierre «Tres reglas». `recap`: the heading; `rule-1..3`: the engine's
 * RuleCards light one at a time. `phrase`: «Los límites, fuera del modelo»
 * under them. `next`: the one task (the lesson's four optional checks, no
 * XP) replaces the phrase. `endcard`: the ALERTÓPOLIS end card, held to the
 * last frame.
 */
export function S07Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const phrase = props.cue('phrase');
  const next = props.cue('next');
  const endcard = props.cue('endcard');

  const head = enter(frame, recap - 4, { distance: 14 });
  const allOut = 1 - progress(frame, endcard - 14, 14, EASE.inOut);
  const phraseIn = springIn(frame, fps, phrase - 2, { damping: 15 });
  const phraseOut = progress(frame, next - 6, 12, EASE.inOut);

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: r.sub,
    icon: r.icon as IconName,
    tone: r.tone,
    at: ruleAt[i],
  }));

  return (
    <Stage>
      {allOut > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: allOut, fontFamily: FONT.sans }}>
          <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, ...head }}>
            <Icon name="flag" size={48} color={C.cyan} />
            <span style={{ fontSize: 54, fontWeight: 850, letterSpacing: -0.5, color: C.cyan, whiteSpace: 'nowrap' }}>{RECAP.heading}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: CARDS_TOP }}>
            <RuleCards rules={rules} width={W} height={CARDS_H} slotAt={recap + 4} dimFrom={phrase} titleSize={46} subSize={34} artHeight={120} frame={frame} fps={fps} />
          </div>

          {phraseIn > 0.001 && phraseOut < 1 ? (
            <div style={{ position: 'absolute', left: 0, top: BAR_TOP, width: W, height: BAR_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: 60, fontWeight: 850, letterSpacing: -1, whiteSpace: 'nowrap', opacity: Math.min(1, phraseIn * 1.3) * (1 - phraseOut), transform: `translateY(${(1 - Math.min(1, phraseIn)) * 20}px)` }}>
              <Icon name="lock" size={56} color={C.emerald} strokeWidth={2.2} />
              <span style={{ color: C.textStrong }}>{PHRASE.lead}</span>
              <span style={{ color: '#6ee7b7' }}>{PHRASE.tail}</span>
            </div>
          ) : null}

          <NextBar frame={frame} fps={fps} at={next} />
        </div>
      ) : null}

      <EndCard frame={frame} fps={fps} at={endcard} />
    </Stage>
  );
}

function NextBar({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 15 });
  const glow = Math.min(1, p) * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  const chip = progress(frame, at + 8, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: BAR_TOP,
        width: W,
        height: BAR_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.violet, 0.85)}`,
        background: `linear-gradient(90deg, ${alpha(C.violet, 0.2)} 0%, ${alpha(C.ink900, 0.95)} 45%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: `0 0 ${Math.round(40 * glow)}px ${alpha(C.violet, 0.32 * glow)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + 0.04 * Math.min(1, p)})`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="brain" size={50} color={C.violet} strokeWidth={2} />
      <span style={{ fontSize: 40, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong }}>
        {NEXT.lead} <span style={{ color: '#c4b5fd' }}>{NEXT.task}</span>
      </span>
      <span style={{ opacity: chip, transform: `translateX(${(1 - chip) * 12}px)` }}>
        <Chip accent="violet" icon="mortarboard" size={28}>
          {NEXT.chip}
        </Chip>
      </span>
    </div>
  );
}

const CARD_W = 1360;

function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const objective = enter(frame, at + 8, { distance: 18 });
  const ruleDraw = progress(frame, at + 8, 18);
  const cta = enter(frame, at + 14, { distance: 18 });
  const disclaimer = enter(frame, at + 22, { distance: 12 });
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
        <BrandMark size={34} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>{END.brand}</span>
      </div>
      <div style={{ marginTop: 18, fontSize: 64, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        {END.title[0]}
        <span style={{ color: C.cyan }}>{END.title[1]}</span>
      </div>
      <div style={{ marginTop: 18, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          {END.objective}
        </Chip>
      </div>
      <div style={{ marginTop: 26, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div
        style={{
          marginTop: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '16px 34px 16px 24px',
          borderRadius: 32,
          background: alpha(C.violet, 0.08),
          border: `2px solid ${alpha(C.violet, 0.55)}`,
          whiteSpace: 'nowrap',
          ...cta,
        }}
      >
        <Icon name="brain" size={44} color={C.violet} strokeWidth={2} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: TYPE.body, fontWeight: 750, color: C.textStrong }}>
            {NEXT.lead} <span style={{ color: '#c4b5fd' }}>{NEXT.task}</span>
          </span>
          <Chip accent="violet" icon="mortarboard" size={28}>
            {NEXT.chip}
          </Chip>
        </div>
      </div>
      <div style={{ marginTop: 30, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
        {END.disclaimer}
        {isElevenLabsVoice(TIMELINE.voice) ? (
          <>
            <br />
            Voz: ElevenLabs.
          </>
        ) : null}
      </div>
    </div>
  );
}
