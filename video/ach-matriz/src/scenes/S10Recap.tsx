import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { S10_END, S10_NEXT, S10_RULES } from '../data/s10-recap';
import { TIMELINE } from '../timeline/load';
import { Matrix } from './parts/Matrix';
import { PromiseIcon, type PromiseKind } from './parts/PromiseIcons';
import { CraneGlyph } from './parts/s03-supuestos/CraneCard';
import { Stage, wordFrame } from './kit';

const S = 's10-recap';
const W = STAGE.width;
const CARDS_TOP = 22;
const CARDS_H = 456;
const NEXT_TOP = 506;
const ART_H = 160;
const KINDS: readonly PromiseKind[] = ['list', 'grid', 'table'];
const TONES = ['cyan', 'cyan', 'emerald'] as const;

/**
 * s10-recap «Tres reglas». Three numbered slots wait; each rule card lights as the voice
 * says it, with the same icon the promise used in s01 (list with a question mark, grid,
 * table on its legs): «Escribe lo que das por hecho», «Cuenta lo que tumba», «Quita la
 * prueba más fuerte». On `lab4b` the cards step back for the one next step, «Ahora te
 * toca: Lab 4B»; on `endcard` the ALERTÓPOLIS end card — the finished matrix in
 * miniature (H1 framed, the «Inconsistencias» row), the title, «Ahora te toca: Lab 4B»
 * again as its call to action, the GCTI objective and, as the voice warns, PAPER CRANE
 * counting on your shortcuts. It holds to the last frame.
 */
export function S10Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const lab4b = props.cue('lab4b');
  const endcard = props.cue('endcard');
  const craneAt = wordFrame(S, 's10-03', 'PAPER') - 4;

  const boardOut = progress(frame, endcard - 14, 14, EASE.inOut);

  const rules: RuleCardDef[] = S10_RULES.map((r, i) => ({
    title: r.title,
    sub: [r.sub[0], r.sub[1]],
    tone: TONES[i],
    at: ruleAt[i],
    art: <PromiseIcon kind={KINDS[i]} size={150} color={i === 2 ? C.emerald : C.cyan} draw={progress(frame, ruleAt[i] - 2, 26, EASE.inOut)} />,
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
            slotAt={-14}
            dimFrom={lab4b}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={lab4b} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcard} craneAt={craneAt} />
    </Stage>
  );
}

/** The one next step: the Lab 4B. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '18px 40px 18px 30px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
        }}
      >
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 52, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{S10_NEXT}</span>
      </div>
    </div>
  );
}

const CARD_W = 1480;
const ART_W = 480;

/** Closing card: the finished matrix in miniature, ALERTÓPOLIS, title, Lab 4B, objective, PAPER CRANE, disclaimer. */
function EndCard({ frame, fps, at, craneAt }: { frame: number; fps: number; at: number; craneAt: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const chips = enter(frame, at + 10, { distance: 18 });
  const crane = enter(frame, Math.max(at + 12, craneAt), { distance: 14, axis: 'x' });
  const ruleDraw = progress(frame, at + 12, 18);
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
        padding: '0 60px',
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
      {/* The finished matrix, in miniature */}
      <div style={{ flexShrink: 0, width: ART_W, ...art }}>
        <Matrix title={false} legend="none" counts="I" width={ART_W} winnerAt={-100} glow={0.4} frame={frame} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 60, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div>
            <span style={{ color: C.cyan }}>{S10_END.title[0].slice(0, 4)}</span>
            {S10_END.title[0].slice(4)}
          </div>
          <div>{S10_END.title[1]}</div>
        </div>
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 42, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...sub }}>
          <Icon name="play" size={38} color={C.cyan} strokeWidth={2} />
          {S10_END.sub}
        </div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div style={chips}>
            <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
              {S10_END.objective}
            </Chip>
          </div>
          <div style={crane}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 22px 8px 14px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.rose, 0.7)}`,
                background: alpha(C.roseDeep, 0.6),
                fontSize: 32,
                fontWeight: 750,
                color: '#fecdd3',
                whiteSpace: 'nowrap',
              }}
            >
              <CraneGlyph size={40} />
              {S10_END.adversary}
            </span>
          </div>
        </div>
        <div style={{ marginTop: 22, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 18, width: 820, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {S10_END.disclaimer}
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
