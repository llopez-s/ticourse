import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, clamp01, mix } from '../../../engine/src/ui';
import { BLAME, CHAIN1, CHAIN1_TAGS, CLOSED_BOXES, LEAK_TEXT, MEETING, RCA_TERM } from '../data/s08-rca';
import { Board, type BoardProps, type ColumnGeo } from './parts/Board';
import { Leak, leakAnchors } from './parts/Leak';
import { WhyChain, chainFocus, type WhyStepState } from './parts/s08-rca/WhyChain';
import { Stage, segment, wordFrame } from './kit';

const S = 's08-rca';

/** Stage-local placements. */
const BOARD_LOW = 510; // the compact strip sits at the bottom while the intercept owns the top band
const LEAK_BIG = { left: 584, top: 126, width: 560 };
const LEAK_SMALL = { left: 0, top: 96, width: 480 }; // parts/Leak reads small under ~330 px
const CHAIN = { left: 548, top: 30 };
const PLATE = { left: 0, top: 516, width: 480 };

/**
 * s08-rca «Despide a Lucía»: the closing meeting (2026-09-11, the last
 * column). The board opens on Lecciones aprendidas, then drops to a strip at
 * the bottom so SILENT PAGER's intercept has the top band; the answer is a
 * «no … sino …» pair (no strike near Lucía). The leak: mopping is the
 * symptom, the hole in the roof the cause. Then the «¿por qué?» staircase goes
 * down step by step to the exception that never expired — the real leak, the
 * cause that can be fixed — and the exam term, root cause analysis.
 */
export function S08Rca(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const meeting = props.cue('meeting');
  const drip = props.cue('drip');
  const why = props.cue('why');
  const exception = props.cue('exception');
  const s01 = segment(props, 's08-01');

  const reunion = wordFrame(S, 's08-01', 'reunión');
  const mejor = wordFrame(S, 's08-01', 'mejor');
  const busca = wordFrame(S, 's08-02', 'busca');
  const sino = wordFrame(S, 's08-02', 'sino');
  const friegas = wordFrame(S, 's08-03', 'friegas');
  const agujero = wordFrame(S, 's08-03', 'agujero');
  const reinstalar = wordFrame(S, 's08-03', 'Reinstalar');
  const lucia = wordFrame(S, 's08-04', 'Lucía');
  const como = wordFrame(S, 's08-04', 'como');
  const ejecuto = wordFrame(S, 's08-04', 'ejecutó');
  const operaciones = wordFrame(S, 's08-05', 'Operaciones');
  const un = wordFrame(S, 's08-05', 'Un');
  const hace = wordFrame(S, 's08-05', 'hace');
  const caducaba = wordFrame(S, 's08-05', 'caducaba');
  const retirado = wordFrame(S, 's08-06', 'retirado');
  const gotera = wordFrame(S, 's08-06', 'gotera');
  const caducan = wordFrame(S, 's08-06', 'caducan');
  const buscar = wordFrame(S, 's08-06', 'buscar');
  const root = wordFrame(S, 's08-06', 'root');

  // The board: full on the meeting, then a strip at the bottom that is out of
  // the top-centre band before the intercept's silent lead (s08-01's end).
  const compact = progress(frame, s01.to - 32, 26, EASE.inOut);
  const boardOut = progress(frame, drip - 14, 18, EASE.inOut);
  const board: BoardProps = {
    compact,
    columns: {
      ...CLOSED_BOXES,
      lessons: {
        focus: [meeting - 10, Number.POSITIVE_INFINITY],
        grow: 3,
        body: (g) => <MeetingBody g={g} frame={frame} at={meeting + 4} reunionAt={reunion} mejorAt={mejor} />,
      },
    },
  };

  // The chain: which step the voice is on.
  const stepAt = [lucia - 2, ejecuto - 4, operaciones - 2, hace - 4];
  const focus = chainFocus(frame, 4, [
    { step: 0, from: stepAt[0] },
    { step: 1, from: stepAt[1] },
    { step: 2, from: stepAt[2] },
    { step: 3, from: stepAt[3] },
    { step: 2, from: retirado - 4 },
    { step: 3, from: gotera - 4 },
  ]);
  const cause = progress(frame, gotera - 4, 14);
  const states: WhyStepState[] = [
    {
      at: stepAt[0],
      hot: focus.hot[0],
      dim: Math.max(focus.dim[0], 0.6 * cause),
      inline: { at: como - 2, node: <Chip accent="muted" size={28}>{CHAIN1_TAGS.anyone}</Chip> },
    },
    { at: stepAt[1], hot: focus.hot[1], dim: Math.max(focus.dim[1], 0.6 * cause) },
    {
      at: stepAt[2],
      hot: focus.hot[2],
      dim: Math.max(focus.dim[2], 0.45 * cause),
      tabs: [{ text: CHAIN1_TAGS.retired, icon: 'check', accent: 'emerald', at: retirado - 2 }],
    },
    {
      at: stepAt[3],
      hot: focus.hot[3] * (1 - cause),
      dim: focus.dim[3],
      cause,
      underline: progress(frame, caducaba - 2, 16, EASE.inOut),
      tabsBelow: true,
      tabs: [
        { text: CHAIN1_TAGS.cause, icon: 'target', accent: 'rose', at: gotera - 2 },
        { text: CHAIN1_TAGS.fixable, icon: 'gear', accent: 'emerald', at: caducan - 2 },
      ],
    },
  ];
  const whyAt = [ejecuto - 22, exception - 4, un - 6];
  const chainOn = frame >= why - 2;

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: mix(0, BOARD_LOW, compact), opacity: 1 - boardOut, transform: `translateY(${boardOut * 40}px)` }}>
          <Board {...board} frame={frame} />
        </div>
      ) : null}

      <BlameRow frame={frame} fps={fps} noAt={busca - 4} yesAt={sino} outAt={drip - 12} />

      {frame >= drip - 12 ? (
        <LeakScene
          frame={frame}
          fps={fps}
          drip={drip}
          mopAt={friegas - 6}
          symptomAt={friegas}
          causeAt={agujero - 2}
          reinstallAt={reinstalar - 2}
          shrinkAt={why + 2}
          goteraAt={gotera - 4}
        />
      ) : null}

      {chainOn ? (
        <div style={{ position: 'absolute', left: CHAIN.left, top: CHAIN.top }}>
          <WhyChain steps={CHAIN1} states={states} whyAt={whyAt} slotAt={why + 20} frame={frame} fps={fps} opts={{ dir: 'right', dx: 56, gap: 46, fontSize: 44 }} />
        </div>
      ) : null}

      <RcaPlate frame={frame} fps={fps} esAt={buscar - 4} enAt={root - 2} />
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// s08-01: the closing meeting, in the body of Lecciones aprendidas.
// ---------------------------------------------------------------------------

function MeetingBody({ g, frame, at, reunionAt, mejorAt }: { g: ColumnGeo; frame: number; at: number; reunionAt: number; mejorAt: number }) {
  const on = progress(g.focus, 0.55, 0.3);
  if (on <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, paddingTop: 4, opacity: on, fontFamily: FONT.sans }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap', ...enter(frame, at, { distance: 12 }) }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, color: C.textStrong }}>{MEETING.date}</span>
        <span style={{ fontSize: 28, fontWeight: 650, color: C.muted }}>{MEETING.when}</span>
      </div>
      <div style={{ marginTop: 18, ...enter(frame, reunionAt - 4, { distance: 12 }) }}>
        <Chip accent="cyan" icon="users" size={32}>
          {MEETING.title}
        </Chip>
      </div>
      <div style={{ marginTop: 20, fontSize: 36, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap', ...enter(frame, mejorAt - 6, { distance: 12, axis: 'x' }) }}>
        {MEETING.question}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s08-02: «no … a quién culpar, sino … por qué funcionó el ataque».
// Lucía is never struck out: the «no» card only steps back.
// ---------------------------------------------------------------------------

function BlameRow({ frame, fps, noAt, yesAt, outAt }: { frame: number; fps: number; noAt: number; yesAt: number; outAt: number }) {
  if (frame < noAt - 6) return null;
  const out = progress(frame, outAt, 14, EASE.inOut);
  if (out >= 1) return null;
  const pNo = springIn(frame, fps, noAt, { damping: 16 });
  const pYes = springIn(frame, fps, yesAt + 4, { damping: 16 });
  const back = progress(frame, yesAt, 14);
  const top = 262;
  return (
    <div style={{ position: 'absolute', left: 0, top, width: 1728, height: 220, opacity: 1 - out, fontFamily: FONT.sans }}>
      <BlameCard
        left={70}
        width={620}
        word={BLAME.no}
        text={BLAME.noText}
        icon="users"
        tone={C.muted}
        p={pNo}
        style={{ opacity: Math.min(1, pNo * 1.3) * (1 - 0.6 * back), filter: back > 0.01 ? `saturate(${1 - 0.6 * back})` : undefined }}
      />
      <BlameCard left={780} width={880} word={BLAME.yes} text={BLAME.yesText} icon="search" tone={C.cyan} p={pYes} glow={progress(frame, yesAt + 4, 14) * (0.8 + 0.2 * pulse(frame, fps, 0.5))} />
    </div>
  );
}

function BlameCard({
  left,
  width,
  word,
  text,
  icon,
  tone,
  p,
  glow = 0,
  style,
}: {
  left: number;
  width: number;
  word: string;
  text: string;
  icon: 'users' | 'search';
  tone: string;
  p: number;
  glow?: number;
  style?: CSSProperties;
}) {
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left, top: 0, width, opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - p) * 20}px)`, ...style }}>
      <div style={{ fontSize: 34, fontWeight: 800, color: glow > 0 ? C.cyanSoft : C.muted, letterSpacing: 1, marginLeft: 6 }}>{word}</div>
      <div
        style={{
          marginTop: 10,
          height: 128,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 30px',
          borderRadius: RADIUS.lg,
          border: `${glow > 0.3 ? 3 : 2}px solid ${alpha(tone, 0.35 + 0.55 * glow)}`,
          background: `linear-gradient(90deg, ${alpha(tone, 0.06 + 0.1 * glow)} 0%, ${alpha(C.ink900, 0.96)} 70%)`,
          boxShadow: glow > 0.02 ? `0 0 ${Math.round(40 * glow)}px ${alpha(tone, 0.28 * glow)}` : `0 18px 40px ${alpha('#000000', 0.3)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name={icon} size={54} color={tone} strokeWidth={2} />
        <span style={{ fontSize: 50, fontWeight: 800, letterSpacing: -0.5, color: C.textStrong }}>{text}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s08-03 onwards: the leak. Big with its two labels, then small on the left
// with a chip each while the chain climbs down on the right.
// ---------------------------------------------------------------------------

function LeakScene({
  frame,
  fps,
  drip,
  mopAt,
  symptomAt,
  causeAt,
  reinstallAt,
  shrinkAt,
  goteraAt,
}: {
  frame: number;
  fps: number;
  drip: number;
  mopAt: number;
  symptomAt: number;
  causeAt: number;
  reinstallAt: number;
  shrinkAt: number;
  goteraAt: number;
}) {
  const show = progress(frame, drip - 10, 16);
  const t = progress(frame, shrinkAt + 6, 26, EASE.inOut);
  const width = mix(LEAK_BIG.width, LEAK_SMALL.width, t);
  const left = mix(LEAK_BIG.left, LEAK_SMALL.left, t);
  const top = mix(LEAK_BIG.top, LEAK_SMALL.top, t);
  const a = leakAnchors(width);
  const hole = { x: left + a.hole.x, y: top + a.hole.y };
  const puddle = { x: left + a.puddle.x, y: top + a.puddle.y };
  const bigLabels = 1 - progress(frame, shrinkAt - 2, 10, EASE.inOut);
  const smallLabels = progress(frame, shrinkAt + 28, 12);
  const holeHot = progress(frame, goteraAt, 12);

  const symP = progress(frame, symptomAt - 4, 14);
  const causeP = progress(frame, causeAt - 4, 14);
  const reinP = progress(frame, reinstallAt, 14);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: show, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left, top }}>
        <Leak width={width} dripFrom={drip + 6} mopAt={mopAt} mopUntil={shrinkAt + 40} dim={0.25 * smallLabels * (1 - holeHot)} frame={frame} />
      </div>

      {/* The real leak: the hole breathes when the chain lands on it. */}
      {holeHot > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: hole.x - 44,
            top: hole.y - 58,
            width: 88,
            height: 88,
            borderRadius: 44,
            border: `4px solid ${alpha(C.rose, 0.9)}`,
            boxShadow: `0 0 ${Math.round(18 + 16 * pulse(frame, fps, 0.6))}px ${alpha(C.rose, 0.6)}`,
            opacity: holeHot,
            transform: `scale(${0.9 + 0.12 * pulse(frame, fps, 0.6)})`,
          }}
        />
      ) : null}

      {/* Big layout: symptom on the left, cause on the right, each with a dashed pointer. */}
      {bigLabels > 0.01 ? (
        <>
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: bigLabels }}>
            {symP > 0 ? (
              <line x1={546} y1={puddle.y - 40} x2={546 + (puddle.x - 150 - 546) * symP} y2={puddle.y - 40 + 34 * symP} stroke={alpha(C.amber, 0.85)} strokeWidth={4} strokeDasharray="10 10" strokeLinecap="round" />
            ) : null}
            {causeP > 0 ? (
              <>
                <line x1={1196} y1={hole.y + 10} x2={1196 + (hole.x + 34 - 1196) * causeP} y2={hole.y + 10 - 14 * causeP} stroke={alpha(C.rose, 0.85)} strokeWidth={4} strokeDasharray="10 10" strokeLinecap="round" />
                <circle cx={hole.x + 34} cy={hole.y - 4} r={7 * causeP} fill={C.rose} />
              </>
            ) : null}
          </svg>
          <div style={{ position: 'absolute', right: 1728 - 540, top: puddle.y - 112, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, opacity: bigLabels * symP, transform: `translateX(${(1 - symP) * -16}px)` }}>
            <Chip accent="amber" icon="alert" size={30}>
              {LEAK_TEXT.symptomTag}
            </Chip>
            <span style={{ fontSize: 54, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{LEAK_TEXT.symptom}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 40, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: reinP, transform: `translateY(${(1 - reinP) * 10}px)` }}>
              <Icon name="laptop" size={44} color={C.cyan} />
              {LEAK_TEXT.reinstall}
            </span>
          </div>
          <div style={{ position: 'absolute', left: 1212, top: hole.y - 62, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, opacity: bigLabels * causeP, transform: `translateX(${(1 - causeP) * 16}px)` }}>
            <Chip accent="rose" icon="target" size={30}>
              {LEAK_TEXT.causeTag}
            </Chip>
            <span style={{ fontSize: 54, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{LEAK_TEXT.cause}</span>
          </div>
        </>
      ) : null}

      {/* Small layout: one chip each, above the hole and under the puddle. */}
      {smallLabels > 0.01 ? (
        <>
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: smallLabels }}>
            <line x1={hole.x} y1={top - 14} x2={hole.x} y2={hole.y - 34} stroke={alpha(C.rose, 0.85)} strokeWidth={4} strokeDasharray="8 8" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', left: hole.x, top: top - 70, transform: 'translateX(-50%)', opacity: smallLabels }}>
            <Chip accent="rose" icon="target" size={30}>
              {LEAK_TEXT.causeTag}
            </Chip>
          </div>
          <div style={{ position: 'absolute', left: puddle.x, top: top + a.height + 6, transform: 'translateX(-50%)', opacity: smallLabels }}>
            <Chip accent="amber" icon="alert" size={30}>
              {LEAK_TEXT.symptomTag}
            </Chip>
          </div>
        </>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// s08-06: the exam term.
// ---------------------------------------------------------------------------

function RcaPlate({ frame, fps, esAt, enAt }: { frame: number; fps: number; esAt: number; enAt: number }) {
  if (frame < esAt - 6) return null;
  const p = springIn(frame, fps, esAt, { damping: 16 });
  const en = progress(frame, enAt, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: PLATE.left,
        top: PLATE.top,
        width: PLATE.width,
        boxSizing: 'border-box',
        padding: '16px 24px 18px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.4 + 0.45 * en)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.08 + 0.08 * en)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: en > 0.02 ? `0 0 ${Math.round(34 * en)}px ${alpha(C.violet, 0.28 * en)}` : undefined,
        fontFamily: FONT.sans,
        opacity: Math.min(1, p * 1.3),
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{RCA_TERM.es}</div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, opacity: clamp01(en * 1.2), transform: `translateY(${(1 - en) * 8}px)` }}>
        <Icon name="mortarboard" size={40} color={C.violet} />
        <span style={{ fontSize: 44, fontWeight: 850, letterSpacing: -0.5, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{RCA_TERM.en}</span>
      </div>
    </div>
  );
}
