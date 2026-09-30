import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { CLOSED_BOXES } from '../data/s08-rca';
import { END, LAB, NEXT, RECAP, RULE1_ART, RULE_TEXT } from '../data/s10-recap';
import { TIMELINE } from '../timeline/load';
import { Board, type BoardProps } from './parts/Board';
import { Leak } from './parts/Leak';
import { Nave } from './parts/Nave';
import { Stage, wordFrame } from './kit';

const S = 's10-recap';

const RULES_TOP = 88;
const RULES_H = 440;
const BAR_TOP = 550;
const BAR_H = 106;
const ART_H = 200;

/**
 * s10-recap «Tres reglas»: the case board, closed (every box ticked), while
 * the voice says SILENT PAGER counted on your hurry; then three rule cards
 * lit as the voice says them (the tick of Contención at 10:30, the padlocked
 * nave and the clean copy, the patched leak). The hook to the next video
 * asks how you know the new plan works (formats unnamed); the lab bar and
 * the ALERTÓPOLIS end card close it and hold to the last frame.
 */
export function S10Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const next = props.cue('next');
  const lab = props.cue('lab');
  const endcard = props.cue('endcard');

  const prisas = wordFrame(S, 's10-01', 'prisas');
  const tres = wordFrame(S, 's10-01', 'tres');
  const copia = wordFrame(S, 's10-03', 'copia');
  const siguiente = wordFrame(S, 's10-04', 'siguiente');

  const boardOut = progress(frame, tres - 10, 16, EASE.inOut);
  const rulesOpacity = 1 - progress(frame, endcard - 14, 14, EASE.inOut);
  const headIn = enter(frame, tres - 6, { distance: 14 });
  const labDim = progress(frame, lab - 4, 14);

  const copyLine = progress(frame, copia - 4, 14);
  const rules: RuleCardDef[] = [
    { title: RULE_TEXT[0].title, sub: <span style={{ color: C.amber }}>{RULE_TEXT[0].sub}</span>, art: <CheckArt frame={frame} at={ruleAt[0] + 6} />, at: ruleAt[0] },
    {
      title: RULE_TEXT[1].title,
      sub: <span style={{ color: C.emerald, opacity: copyLine }}>{RULE_TEXT[1].sub}</span>,
      art: <LockArt frame={frame} at={ruleAt[1] + 4} copyAt={copia - 4} />,
      at: ruleAt[1],
    },
    { title: RULE_TEXT[2].title, sub: <span style={{ color: C.emerald }}>{RULE_TEXT[2].sub}</span>, art: <Leak width={272} state="patched" frame={frame} />, at: ruleAt[2] },
  ];

  return (
    <Stage>
      {boardOut < 1 ? <ClosedCase frame={frame} fps={fps} at={recap} prisasAt={prisas} out={boardOut} /> : null}

      {rulesOpacity > 0.001 && frame >= tres - 8 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: rulesOpacity, fontFamily: FONT.sans }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              height: 64,
              ...headIn,
              opacity: headIn.opacity * (1 - 0.4 * labDim),
            }}
          >
            <Icon name="flag" size={48} color={C.cyan} />
            <span style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <span style={{ color: C.cyan }}>{RECAP.heading[0]}</span> {RECAP.heading[1]}
            </span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: RULES_TOP }}>
            <RuleCards rules={rules} width={STAGE.width} height={RULES_H} slotAt={tres + 2} dimFrom={next} subSize={32} artHeight={ART_H} frame={frame} fps={fps} />
          </div>
          <NextBar frame={frame} fps={fps} at={next} chipAt={siguiente - 6} outAt={lab - 6} />
          <LabBar frame={frame} fps={fps} at={lab} />
        </div>
      ) : null}

      <EndCard frame={frame} fps={fps} at={endcard} />
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// s10-01: the case, closed.
// ---------------------------------------------------------------------------

function ClosedCase({ frame, fps, at, prisasAt, out }: { frame: number; fps: number; at: number; prisasAt: number; out: number }) {
  const board: BoardProps = {
    compact: 1,
    columns: { ...CLOSED_BOXES, prep: { box: 'checked' }, lessons: { box: 'checked' } },
    defaults: { glow: 0.35, glowTone: 'emerald' },
  };
  const chip = springIn(frame, fps, prisasAt - 8, { damping: 15 });
  const closed = enter(frame, at + 6, { distance: 12 });
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-out * 24}px)` }}>
      <div style={{ position: 'absolute', left: 0, top: 250 }}>
        <Board {...board} frame={frame} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 150, width: 1728, display: 'flex', justifyContent: 'center', ...closed }}>
        <Chip accent="emerald" icon="check" size={36}>
          {RECAP.closed}
        </Chip>
      </div>
      {chip > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 452, width: 1728, display: 'flex', justifyContent: 'center', opacity: Math.min(1, chip * 1.3), transform: `translateY(${(1 - chip) * 16}px)` }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '18px 32px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.rose, 0.7)}`,
              background: `linear-gradient(180deg, ${alpha(C.rose, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 80%)`,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="terminal" size={44} color={C.rose} />
            <span style={{ fontSize: 48, fontWeight: 800, color: C.textStrong }}>
              <span style={{ fontFamily: FONT.mono, color: C.roseSoft }}>SILENT PAGER</span>
              {RECAP.adversary.replace('SILENT PAGER', '')}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rule art
// ---------------------------------------------------------------------------

/** Rule 1: the box of Contención, ticked with its time (condition met). */
function CheckArt({ frame, at }: { frame: number; at: number }) {
  const tick = progress(frame, at, 14, EASE.inOut);
  const S = 104;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, fontFamily: FONT.sans }}>
      <span style={{ fontSize: 42, fontWeight: 800, color: C.textStrong }}>{RULE1_ART.column}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
          <rect x={3} y={3} width={S - 6} height={S - 6} rx={S * 0.18} fill={alpha(C.emerald, 0.12 * tick)} stroke={tick > 0.05 ? C.emerald : C.muted} strokeWidth={5} />
          <path
            d={`M ${S * 0.22} ${S * 0.53} L ${S * 0.43} ${S * 0.73} L ${S * 0.8} ${S * 0.3}`}
            fill="none"
            stroke={C.emerald}
            strokeWidth={S * 0.13}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - tick}
          />
        </svg>
        <span style={{ fontFamily: FONT.mono, fontSize: 56, fontWeight: 800, color: C.emerald, opacity: progress(frame, at + 6, 12) }}>{RULE1_ART.time}</span>
      </div>
    </div>
  );
}

/** Rule 2: a padlocked nave (machines and keys closed first), then the clean copy. */
function LockArt({ frame, at, copyAt }: { frame: number; at: number; copyAt: number }) {
  const lock = progress(frame, at, 14, EASE.out);
  const copy = progress(frame, copyAt, 14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
      <Nave width={228} lock={lock} glow={0.5 * lock} glowTone="cyan" frame={frame} />
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.emerald, 0.12),
          border: `3px solid ${alpha(C.emerald, 0.75)}`,
          opacity: 0.25 + 0.75 * copy,
          transform: `scale(${0.9 + 0.1 * copy})`,
        }}
      >
        <Icon name="archive" size={66} color={C.emerald} strokeWidth={2.2} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s10-04 / s10-05: the hook and the lab, in the bar under the cards.
// ---------------------------------------------------------------------------

function barStyle(p: number, glow: number, tone: string) {
  return {
    position: 'absolute' as const,
    left: 0,
    top: BAR_TOP,
    width: STAGE.width,
    height: BAR_H,
    boxSizing: 'border-box' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
    borderRadius: RADIUS.lg,
    border: `3px solid ${alpha(tone, 0.85)}`,
    background: `linear-gradient(90deg, ${alpha(tone, 0.2)} 0%, ${alpha(C.ink900, 0.95)} 45%, ${alpha(C.ink900, 0.95)} 100%)`,
    boxShadow: `0 0 ${Math.round(40 * glow)}px ${alpha(tone, 0.32 * glow)}`,
    fontFamily: FONT.sans,
    opacity: Math.min(1, p * 1.3),
    transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + 0.04 * Math.min(1, p)})`,
  };
}

function NextBar({ frame, fps, at, chipAt, outAt }: { frame: number; fps: number; at: number; chipAt: number; outAt: number }) {
  if (frame < at - 6) return null;
  const out = progress(frame, outAt, 10, EASE.inOut);
  if (out >= 1) return null;
  const p = springIn(frame, fps, at - 4, { damping: 15 }) * (1 - out);
  const glow = Math.min(1, p) * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  const chip = progress(frame, chipAt, 12);
  return (
    <div style={barStyle(p, glow, C.violet)}>
      <Icon name="brain" size={52} color={C.violet} strokeWidth={2} />
      <span style={{ fontSize: 48, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{NEXT.question}</span>
      <span style={{ opacity: chip, transform: `translateX(${(1 - chip) * 12}px)` }}>
        <Chip accent="violet" icon="play" size={32}>
          {NEXT.chip}
        </Chip>
      </span>
    </div>
  );
}

function LabBar({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 15 });
  const glow = Math.min(1, p) * (0.75 + 0.25 * pulse(frame, fps, 0.5));
  return (
    <div style={barStyle(p, glow, C.cyan)}>
      <div style={{ width: 74, height: 74, borderRadius: 20, display: 'grid', placeItems: 'center', background: C.cyan, flexShrink: 0 }}>
        <Icon name="target" size={46} color={C.ink950} strokeWidth={2.2} />
      </div>
      <span style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {LAB.lead} <span style={{ color: C.cyanSoft }}>{LAB.name}</span>
      </span>
      <Chip accent="cyan" icon="layers" size={34}>
        {LAB.chip}
      </Chip>
    </div>
  );
}

// ---------------------------------------------------------------------------
// End card (the idiom of V4's s11-recap, with this video's text).
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
        left: (STAGE.width - CARD_W) / 2,
        top: 30,
        width: CARD_W,
        height: STAGE.height - 60,
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
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
        <BrandMark size={34} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 80, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        {END.title[0]}
        <span style={{ color: C.cyan }}>{END.title[1]}</span>
      </div>
      <div style={{ marginTop: 20, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          {END.objective}
        </Chip>
      </div>
      <div style={{ marginTop: 30, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div
        style={{
          marginTop: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '16px 34px 16px 24px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `2px solid ${alpha(C.cyan, 0.55)}`,
          ...cta,
        }}
      >
        <Icon name="play" size={40} color={C.cyan} strokeWidth={2} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: TYPE.body, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
            {LAB.lead} <span style={{ color: C.cyanSoft }}>{LAB.name}</span>
          </span>
          <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>{END.next}</span>
        </div>
      </div>
      <div style={{ marginTop: 32, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
        Simulación educativa con datos ficticios. Material independiente, no afiliado a CompTIA.
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
