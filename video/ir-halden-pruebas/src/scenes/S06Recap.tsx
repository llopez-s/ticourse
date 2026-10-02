import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, DIM, Icon, dimStyle, focusWeights, tone as toneOf, type Tone } from '../../../engine/src/ui';
import { END, NEXT, RECAP, RULES } from '../data/s06-recap';
import { TIMELINE } from '../timeline/load';
import { BellOff } from './parts/Bits';
import { DrillArt, MesaArt } from './parts/TwoWays';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;

const HEAD_H = 60;
const ROWS_TOP = 72;
const ROW_H = 146;
const ROW_GAP = 12;
const BAR_TOP = 552;
const BAR_H = 104;
const ART_X = 96;
const ART_W = 340;
const TEXT_X = 470;
const ROW_TONE: Tone[] = ['sky', 'emerald', 'emerald'];

/**
 * s06-recap «Tres reglas»: SILENT PAGER's message from s04 («Sin alarma no
 * hay nada que buscar…») is struck out; three rules, one big row each, lit
 * as the voice says them (the table and the drill; a silenced bell: an alert
 * is not hunting; the magnifier: every hunt brings a rule or a gap). One task
 * (the lesson's questions, sp4m10 · 8 preguntas) and the ALERTÓPOLIS end card,
 * held to the last frame.
 *
 * Deviation from the engine's RuleCards: rule 1's lines are 37 and 43
 * characters long, which three 544 px columns can only fit at ~20 px, so the
 * rules are full-width rows in the same idiom (numbered disc, lit one at a
 * time, the rest step back, everything steps back for the call to action).
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const next = props.cue('next');
  const endcard = props.cue('endcard');

  const mejor = wordFrame(S, 's06-01', 'Mejor');
  const tres = wordFrame(S, 's06-01', 'tres');
  const herramientas = wordFrame(S, 's06-02', 'herramientas,');
  const regla = wordFrame(S, 's06-03', 'regla');
  const preguntas = wordFrame(S, 's06-04', 'preguntas');

  const pagerIn = springIn(frame, fps, Math.max(2, recap - 16), { damping: 16 });
  const pagerOut = progress(frame, tres - 10, 14, EASE.inOut);
  const strike = progress(frame, mejor - 4, 16, EASE.inOut);

  const rulesOpacity = 1 - progress(frame, endcard - 14, 14, EASE.inOut);
  const head = enter(frame, tres - 6, { distance: 14 });
  const allDim = progress(frame, next - 4, 14);
  const { weights, dims } = focusWeights(frame, ruleAt, { end: next });

  const lineAt = [
    [ruleAt[0], herramientas - 6],
    [ruleAt[1]],
    [ruleAt[2], regla - 6],
  ];

  return (
    <Stage>
      {pagerOut < 1 && pagerIn > 0.001 ? <Pager p={pagerIn} out={pagerOut} strike={strike} /> : null}

      {rulesOpacity > 0.001 && frame >= tres - 8 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: rulesOpacity, fontFamily: FONT.sans }}>
          <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, ...head, opacity: head.opacity * (1 - 0.4 * allDim) }}>
            <Icon name="flag" size={48} color={C.cyan} />
            <span style={{ fontSize: 52, fontWeight: 850, letterSpacing: -0.5, color: C.cyan, whiteSpace: 'nowrap' }}>{RECAP.heading}</span>
          </div>
          {RULES.map((rule, i) => (
            <RuleRow
              key={i}
              index={i}
              frame={frame}
              fps={fps}
              top={ROWS_TOP + i * (ROW_H + ROW_GAP)}
              at={ruleAt[i]}
              slotAt={tres + 2 + i * 4}
              lineAt={lineAt[i]}
              hot={weights[i]}
              dim={Math.max(dims[i], allDim)}
              art={<RuleArt index={i} frame={frame} at={ruleAt[i]} />}
              lines={rule.lines}
            />
          ))}
          <NextBar frame={frame} fps={fps} at={next} chipAt={preguntas - 4} />
        </div>
      ) : null}

      <EndCard frame={frame} fps={fps} at={endcard} />
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// s06-01: SILENT PAGER's message, struck out
// ---------------------------------------------------------------------------

function Pager({ p, out, strike }: { p: number; out: number; strike: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 220, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.3) * (1 - out), transform: `translateY(${(1 - Math.min(1, p)) * 18 - out * 20}px)` }}>
      <div
        style={{
          padding: '26px 44px 30px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.rose, 0.7)}`,
          background: `linear-gradient(180deg, ${alpha(C.rose, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 80%)`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
          ...dimStyle(0.35 * strike),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Icon name="terminal" size={42} color={C.rose} />
          <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.roseSoft, letterSpacing: 1 }}>{RECAP.adversary}</span>
        </div>
        <div style={{ position: 'relative', marginTop: 18, fontSize: 48, fontWeight: 750, color: C.textStrong }}>
          «{RECAP.message}»
          <div style={{ position: 'absolute', left: -8, top: '52%', height: 6, width: `calc((100% + 16px) * ${strike})`, borderRadius: 3, background: C.textStrong, boxShadow: `0 0 12px ${alpha('#000000', 0.6)}` }} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The rule rows
// ---------------------------------------------------------------------------

type RuleLine = { lead: string; text: string; tone: string; sub?: boolean };

function RuleRow({
  index,
  frame,
  fps,
  top,
  at,
  slotAt,
  lineAt,
  hot,
  dim,
  art,
  lines,
}: {
  index: number;
  frame: number;
  fps: number;
  top: number;
  at: number;
  slotAt: number;
  lineAt: readonly number[];
  hot: number;
  dim: number;
  art: ReactNode;
  lines: readonly RuleLine[];
}) {
  const t = toneOf(ROW_TONE[index]);
  const slot = progress(frame, slotAt, 12);
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  const lit = Math.min(1, p * 1.3);
  const glow = hot * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  const d = dim * lit;
  return (
    <>
      {lit < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top,
            width: W,
            height: ROW_H,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `2px dashed ${C.ink600}`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 36,
            opacity: slot * (1 - lit),
            transform: `translateY(${(1 - slot) * 14}px)`,
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 850, color: C.ink700 }}>{index + 1}</span>
        </div>
      ) : null}
      {lit > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top,
            width: W,
            height: ROW_H,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(t.fg, 0.35 + 0.55 * glow)}`,
            background: `linear-gradient(90deg, ${alpha(t.fg, 0.06 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.95)} 45%)`,
            boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(t.fg, 0.28 * glow)}` : `0 18px 44px ${alpha('#000000', 0.3)}`,
            ...dimStyle(d, lit),
            transform: `translateY(${(1 - p) * 20}px) scale(${1 - (1 - DIM.scale) * 0.5 * d})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 22,
              top: ROW_H / 2 - 29,
              width: 58,
              height: 58,
              borderRadius: 29,
              display: 'grid',
              placeItems: 'center',
              background: glow > 0.3 ? t.fg : alpha(t.fg, 0.18),
              border: `2px solid ${alpha(t.fg, 0.7)}`,
              fontSize: 34,
              fontWeight: 850,
              color: glow > 0.3 ? C.ink950 : t.soft,
            }}
          >
            {index + 1}
          </div>
          <div style={{ position: 'absolute', left: ART_X, top: 0, width: ART_W, height: ROW_H - 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{art}</div>
          <div style={{ position: 'absolute', left: TEXT_X, top: 0, height: ROW_H - 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            {lines.map((l, k) => {
              const lp = progress(frame, lineAt[k] ?? at, 12);
              const lt = toneOf(l.tone as Tone);
              return (
                <div key={k} style={{ fontSize: l.sub ? 42 : 48, fontWeight: l.sub ? 750 : 850, letterSpacing: -0.6, color: l.sub ? lt.soft : C.textStrong, lineHeight: 1.1, opacity: lp, transform: `translateX(${(1 - lp) * 16}px)` }}>
                  {l.lead ? <span style={{ color: lt.soft }}>{l.lead} </span> : null}
                  {highlightHunting(l.text, lt.soft)}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** «hunting» keeps its exam colour inside rule 2. */
function highlightHunting(text: string, color: string): ReactNode {
  const k = text.lastIndexOf('hunting');
  if (k < 0) return text;
  return (
    <>
      {text.slice(0, k)}
      <span style={{ color }}>hunting</span>
      {text.slice(k + 'hunting'.length)}
    </>
  );
}

function RuleArt({ index, frame, at }: { index: number; frame: number; at: number }) {
  const act = progress(frame, at, 18, EASE.inOut);
  if (index === 0) {
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        <MesaArt width={160} act={act} glow={0.3 * act} frame={frame} />
        <DrillArt width={160} act={act} glow={0.3 * act} frame={frame} />
      </div>
    );
  }
  if (index === 1) {
    return (
      <div style={{ width: 120, height: 120, borderRadius: 60, display: 'grid', placeItems: 'center', background: alpha(C.amber, 0.1), border: `3px solid ${alpha(C.amber, 0.6)}` }}>
        <BellOff size={74} color={C.amber} slash={act} />
      </div>
    );
  }
  return (
    <div style={{ width: 120, height: 120, borderRadius: 60, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.12), border: `3px solid ${alpha(C.emerald, 0.7)}` }}>
      <Icon name="search" size={70} color={C.emerald} strokeWidth={2.2} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// s06-04: the one task, under the rules
// ---------------------------------------------------------------------------

function NextBar({ frame, fps, at, chipAt }: { frame: number; fps: number; at: number; chipAt: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 15 });
  const glow = Math.min(1, p) * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  const chip = progress(frame, chipAt, 12);
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
      <Icon name="brain" size={52} color={C.violet} strokeWidth={2} />
      <span style={{ fontSize: 46, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong }}>
        {NEXT.lead} <span style={{ color: '#c4b5fd' }}>{NEXT.task}</span>
      </span>
      <span style={{ opacity: chip, transform: `translateX(${(1 - chip) * 12}px)` }}>
        <Chip accent="violet" icon="mortarboard" size={32}>
          {NEXT.chip}
        </Chip>
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// End card
// ---------------------------------------------------------------------------

const CARD_W = 1320;

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
      <div style={{ marginTop: 18, fontSize: 78, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
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
