import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, clamp01, mix } from '../../../engine/src/ui';
import { CLOSED_BOXES } from '../data/s08-rca';
import { BETTER, CHAIN2, CHAIN2_TAGS, IMPROVEMENTS, LIST_TEXT, LL_TERM, type Improvement } from '../data/s09-plan';
import { BOARD_COMPACT_H, BOARD_LOOP_SPACE, Board, boardGeometry, emWidth, type BoardProps } from './parts/Board';
import { WhyChain, chainFocus, whyChainGeometry, type WhyStepState } from './parts/s08-rca/WhyChain';
import { Stage, segment, wordFrame } from './kit';

const S = 's09-plan';

/** Stage-local placements. */
const BOARD_LOW = 510; // the strip while the chain needs the room above it
const BOARD_HIGH = 660 - BOARD_COMPACT_H - BOARD_LOOP_SPACE; // 446: leaves the loop its space underneath
const CHAIN = { left: 0, top: 20 };
const CHAIN_OPTS = { dir: 'left' as const, dx: 56, gap: 40, fontSize: 44 };
const LIST = { left: 24, top: 6, pitch: 52, rowH: 46, textX: 56, ownerX: 1196, dateX: 1470, textSize: 32 };

/**
 * s09-plan «El hueco del plan»: the second thread of the RCA — she stayed in
 * for hours, because containment was closed with two machines of three,
 * because nobody on call could isolate ADM-WS-02, because the plan had no
 * deputies. The staircase goes down-left and lands on Preparación (the first
 * column), which lights up. The meeting's six improvements, each with owner
 * and date, fly into Preparación; the board ticks it and closes into a loop.
 * Exam term: lessons learned.
 */
export function S09Plan(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thread2 = props.cue('thread2');
  const deputy = props.cue('deputy');
  const prep = props.cue('prep');
  const owner = props.cue('owner');
  const loop = props.cue('loop');
  const name2 = props.cue('name2');
  const s04 = segment(props, 's09-04');

  const noche = wordFrame(S, 's09-01', 'noche');
  const pudo = wordFrame(S, 's09-01', 'pudo');
  const contencion = wordFrame(S, 's09-01', 'contención');
  const nadie = wordFrame(S, 's09-02', 'Nadie');
  const porque = wordFrame(S, 's09-02', 'porque');
  const plan = wordFrame(S, 's09-02', 'plan');
  const sustituye = wordFrame(S, 's09-02', 'sustituye');
  const acaba = wordFrame(S, 's09-03', 'acaba');
  const primera = wordFrame(S, 's09-03', 'primera');
  const antes = wordFrame(S, 's09-03', 'antes');
  const lista = wordFrame(S, 's09-04', 'lista');
  const responsable = wordFrame(S, 's09-04', 'responsable');
  const fecha = wordFrame(S, 's09-04', 'fecha');
  const existe = wordFrame(S, 's09-04', 'existe');
  const preparacion = wordFrame(S, 's09-05', 'preparación');
  const cierra = wordFrame(S, 's09-05', 'cierra');
  const vamos = wordFrame(S, 's09-05', 'Vamos');
  const lessons = wordFrame(S, 's09-06', 'lessons');

  // --- The chain (s09-01 … s09-03) -----------------------------------------
  const stepAt = [thread2 + 2, contencion - 4, nadie - 2, plan - 4];
  const cause = progress(frame, sustituye - 4, 14);
  const focus = chainFocus(frame, 4, stepAt.map((from, step) => ({ step, from })));
  const chainOut = progress(frame, s04.from - 8, 16, EASE.inOut);
  const states: WhyStepState[] = [
    {
      at: stepAt[0],
      hot: focus.hot[0],
      dim: Math.max(focus.dim[0], 0.55 * cause),
      inline: { at: noche - 4, node: <Chip accent="muted" icon="clock" size={28}>{CHAIN2_TAGS.night}</Chip> },
    },
    { at: stepAt[1], hot: focus.hot[1], dim: Math.max(focus.dim[1], 0.55 * cause) },
    { at: stepAt[2], hot: focus.hot[2], dim: Math.max(focus.dim[2], 0.55 * cause) },
    {
      at: stepAt[3],
      hot: focus.hot[3] * (1 - cause),
      dim: focus.dim[3],
      cause,
      tabs: [{ text: CHAIN2_TAGS.cause, icon: 'target', accent: 'rose', at: sustituye - 2 }],
    },
  ];
  const whyAt = [pudo - 12, deputy - 2, porque - 4];
  const chainGeo = whyChainGeometry(CHAIN2, CHAIN_OPTS);
  const last = chainGeo.steps[3];

  // --- Flight of the improvements and the loop ------------------------------
  // «Esas mejoras van a parar a la preparación»: the first lands on «preparación», the last before «cierra».
  const flyStart = loop + 2;
  const flyDur = Math.max(18, Math.min(30, preparacion - flyStart));
  const flyStep = Math.max(4, Math.min(8, Math.round((cierra - 12 - flyStart - flyDur) / (IMPROVEMENTS.length - 1))));
  const landAt = flyStart + flyStep * (IMPROVEMENTS.length - 1) + flyDur;
  const loopP = progress(frame, cierra - 4, 40, EASE.inOut);

  // --- The board strip --------------------------------------------------------
  const boardTop = mix(BOARD_LOW, BOARD_HIGH, progress(frame, s04.from - 8, 24, EASE.inOut));
  const board: BoardProps = {
    compact: 1,
    title: 1 - progress(frame, prep - 6, 12),
    loop: loopP,
    columns: {
      ...CLOSED_BOXES,
      prep: {
        focus: [primera - 4, landAt],
        tone: 'amber',
        glow: progress(frame, landAt - 6, 16) * (1 - progress(frame, name2 - 6, 16) * 0.5),
        box: [{ at: landAt - 4, state: 'checked' }],
      },
      lessons: {
        box: [{ at: cierra - 8, state: 'checked' }],
        focus: [name2 - 4, Number.POSITIVE_INFINITY],
        tone: 'violet',
      },
    },
  };
  const geo = boardGeometry(board, frame);
  const prepGeo = geo.columns.prep;
  const lessonsGeo = geo.columns.lessons;
  const target = { x: prepGeo.box.cx, y: boardTop + prepGeo.box.cy };

  // Thread into Preparación: from the plan step down into the column.
  const intoP = progress(frame, acaba - 4, 22, EASE.inOut) * (1 - chainOut);
  const x1 = CHAIN.left + last.x + 44;
  const y1 = CHAIN.top + last.y + last.h + 4;
  const x2 = prepGeo.innerX + 34;
  const y2 = BOARD_LOW + 44;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: boardTop }}>
        <Board {...board} frame={frame} />
      </div>

      {chainOut < 1 ? (
        <div style={{ position: 'absolute', left: CHAIN.left, top: CHAIN.top, opacity: 1 - chainOut, transform: `translateY(${-chainOut * 20}px)` }}>
          <WhyChain steps={CHAIN2} states={states} whyAt={whyAt} slotAt={0} frame={frame} fps={fps} opts={CHAIN_OPTS} />
          {/* «mucho antes del ataque» beside the plan step */}
          <div style={{ position: 'absolute', left: last.x + last.w + 36, top: last.y, height: last.h, display: 'flex', alignItems: 'center', opacity: progress(frame, antes - 4, 12) }}>
            <Chip accent="amber" icon="clock" size={32}>
              {CHAIN2_TAGS.before}
            </Chip>
          </div>
        </div>
      ) : null}

      {intoP > 0 ? (
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
          <path
            d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`}
            fill="none"
            stroke={C.amber}
            strokeWidth={6}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - intoP}
          />
          {intoP > 0.8 ? (
            <path d={`M ${x2 - 13} ${y2 - 14} L ${x2} ${y2} L ${x2 + 13} ${y2 - 14}`} fill="none" stroke={C.amber} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={progress(intoP, 0.8, 0.2)} />
          ) : null}
        </svg>
      ) : null}

      <ImprovementList
        frame={frame}
        fps={fps}
        titleAt={lista - 6}
        rowsAt={lista + 6}
        ownerAt={responsable - 4}
        dateAt={fecha - 4}
        ghostAt={owner}
        ghostOut={existe + 2}
        flyStart={flyStart}
        flyStep={flyStep}
        flyDur={flyDur}
        target={target}
      />

      <Landed frame={frame} fps={fps} at={landAt - 2} left={prepGeo.x + 6} top={boardTop - 66} />
      <Better frame={frame} at={vamos - 4} outAt={name2 - 8} />
      <ExamTerm frame={frame} fps={fps} at={name2} enAt={lessons - 2} anchorX={lessonsGeo.x + lessonsGeo.w / 2} boardTop={boardTop} />
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// s09-04 / s09-05: the list of improvements, then its flight into Preparación.
// ---------------------------------------------------------------------------

function ImprovementList({
  frame,
  fps,
  titleAt,
  rowsAt,
  ownerAt,
  dateAt,
  ghostAt,
  ghostOut,
  flyStart,
  flyStep,
  flyDur,
  target,
}: {
  frame: number;
  fps: number;
  titleAt: number;
  rowsAt: number;
  ownerAt: number;
  dateAt: number;
  ghostAt: number;
  ghostOut: number;
  flyStart: number;
  flyStep: number;
  flyDur: number;
  target: { x: number; y: number };
}) {
  if (frame < titleAt - 2) return null;
  const head = progress(frame, titleAt, 14) * (1 - progress(frame, flyStart, 14));
  const ownerHead = progress(frame, ownerAt, 12);
  const dateHead = progress(frame, dateAt, 12);
  // «Si le falta alguno de los dos…»: owner and date stand out while the voice says it.
  const stress = progress(frame, ghostAt - 4, 12) * (1 - progress(frame, ghostOut + 20, 16)) * (0.8 + 0.2 * pulse(frame, fps, 0.5));
  const textW = LIST.ownerX - LIST.textX - 36;
  return (
    <div style={{ position: 'absolute', left: LIST.left, top: LIST.top, width: 1728 - LIST.left, height: 440, fontFamily: FONT.sans }}>
      {/* Header */}
      <div style={{ position: 'absolute', left: 0, top: 0, height: 50, display: 'flex', alignItems: 'center', gap: 14, opacity: head, whiteSpace: 'nowrap' }}>
        <Icon name="file" size={40} color={C.cyan} />
        <span style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, letterSpacing: -0.4 }}>{LIST_TEXT.title}</span>
      </div>
      <ColumnHead x={LIST.ownerX} text={LIST_TEXT.owner} p={ownerHead * head} stress={stress} />
      <ColumnHead x={LIST.dateX} text={LIST_TEXT.date} p={dateHead * head} stress={stress} />

      {IMPROVEMENTS.map((imp, i) => {
        const top = 60 + i * LIST.pitch;
        const rowIn = springIn(frame, fps, rowsAt + i * 5, { damping: 16 });
        const leave = flyStart + i * flyStep;
        const gone = progress(frame, leave, 10, EASE.inOut);
        if (rowIn <= 0.001 || gone >= 1) return null;
        return (
          <Row
            key={imp.text}
            imp={imp}
            top={top}
            textW={textW}
            frame={frame}
            fps={fps}
            ownerAt={ownerAt + i * 3}
            dateAt={dateAt + i * 3}
            stress={stress}
            style={{ opacity: Math.min(1, rowIn * 1.3) * (1 - gone), transform: `translateY(${(1 - rowIn) * 14}px) scale(${1 - 0.04 * gone})`, transformOrigin: 'left center' }}
            flying={progress(frame, leave - 6, 6)}
          />
        );
      })}

      {/* Each improvement leaves its row as an emerald token and drops into Preparación. */}
      {IMPROVEMENTS.map((imp, i) => {
        const leave = flyStart + i * flyStep;
        const p = progress(frame, leave + 2, flyDur, EASE.inOut);
        if (frame < leave || p >= 1) return null;
        const ox = 14 + 16;
        const oy = 60 + i * LIST.pitch + LIST.rowH / 2;
        const tx = target.x - LIST.left;
        const ty = target.y - LIST.top;
        const cx = ox + 190;
        const cy = (oy + ty) / 2;
        const x = (1 - p) * (1 - p) * ox + 2 * (1 - p) * p * cx + p * p * tx;
        const y = (1 - p) * (1 - p) * oy + 2 * (1 - p) * p * cy + p * p * ty;
        const pop = springIn(frame, fps, leave, { damping: 14 });
        const fade = 1 - progress(p, 0.85, 0.15);
        return (
          <div
            key={`tok-${imp.text}`}
            style={{
              position: 'absolute',
              left: x - 24,
              top: y - 24,
              width: 48,
              height: 48,
              borderRadius: 24,
              display: 'grid',
              placeItems: 'center',
              background: C.emerald,
              boxShadow: `0 0 22px ${alpha(C.emerald, 0.7)}`,
              opacity: Math.min(1, pop * 1.4) * fade,
              transform: `scale(${(0.5 + 0.5 * Math.min(1, pop)) * (1 - 0.3 * p)})`,
            }}
          >
            <Icon name="check" size={30} color={C.ink950} strokeWidth={3} />
          </div>
        );
      })}

      <GhostRow top={60 + IMPROVEMENTS.length * LIST.pitch} textW={textW} frame={frame} at={ghostAt} outAt={ghostOut} />
    </div>
  );
}

function ColumnHead({ x, text, p, stress }: { x: number; text: string; p: number; stress: number }) {
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - LIST.left,
        top: 10,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
        color: stress > 0.05 ? C.cyanSoft : C.muted,
        textShadow: stress > 0.05 ? `0 0 16px ${alpha(C.cyan, 0.5 * stress)}` : undefined,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
      }}
    >
      {text}
    </div>
  );
}

function Row({
  imp,
  top,
  textW,
  frame,
  fps,
  ownerAt,
  dateAt,
  stress,
  style,
  flying,
}: {
  imp: Improvement;
  top: number;
  textW: number;
  frame: number;
  fps: number;
  ownerAt: number;
  dateAt: number;
  stress: number;
  style: CSSProperties;
  flying: number;
}) {
  const size = Math.min(LIST.textSize, Math.floor(textW / (emWidth(imp.text) * 0.97)));
  const o = springIn(frame, fps, ownerAt, { damping: 15 });
  const d = springIn(frame, fps, dateAt, { damping: 15 });
  const edge = flying > 0.02 ? C.emerald : C.cyan;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: LIST.dateX + 150 - LIST.left,
        height: LIST.rowH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        background: alpha(C.ink850, 0.9),
        border: `2px solid ${alpha(edge, 0.18 + 0.5 * flying)}`,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 14, top: 0, height: LIST.rowH, display: 'flex', alignItems: 'center' }}>
        <Icon name="check" size={28} color={C.emerald} strokeWidth={2.6} />
      </div>
      <div style={{ position: 'absolute', left: LIST.textX, top: 0, height: LIST.rowH, display: 'flex', alignItems: 'center', fontSize: size, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {imp.text}
      </div>
      <div style={{ position: 'absolute', left: LIST.ownerX - LIST.left, top: 0, height: LIST.rowH, display: 'flex', alignItems: 'center', opacity: Math.min(1, o * 1.3), transform: `scale(${0.85 + 0.15 * Math.min(1, o)})`, transformOrigin: 'left center' }}>
        <Chip accent="cyan" icon="user" size={26} style={stress > 0.05 ? { boxShadow: `0 0 18px ${alpha(C.cyan, 0.5 * stress)}` } : undefined}>
          {imp.owner}
        </Chip>
      </div>
      <div
        style={{
          position: 'absolute',
          left: LIST.dateX - LIST.left,
          top: 0,
          height: LIST.rowH,
          display: 'flex',
          alignItems: 'center',
          fontFamily: FONT.mono,
          fontSize: 32,
          fontWeight: 800,
          color: stress > 0.05 ? C.cyanSoft : C.text,
          textShadow: stress > 0.05 ? `0 0 14px ${alpha(C.cyan, 0.5 * stress)}` : undefined,
          opacity: Math.min(1, d * 1.3),
          transform: `translateX(${(1 - Math.min(1, d)) * 10}px)`,
        }}
      >
        {imp.date}
      </div>
    </div>
  );
}

/** «esa mejora no existe»: a row with no owner and no date, which fades away. */
function GhostRow({ top, textW, frame, at, outAt }: { top: number; textW: number; frame: number; at: number; outAt: number }) {
  const p = progress(frame, at - 2, 14);
  const out = progress(frame, outAt, 22, EASE.inOut);
  if (p <= 0.001 || out >= 1) return null;
  const slot = (x: number, w: number) => (
    <div style={{ position: 'absolute', left: x - LIST.left, top: 8, width: w, height: LIST.rowH - 16, borderRadius: 8, border: `2px dashed ${alpha(C.muted, 0.6)}`, display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 800, color: C.faint }}>?</div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width: LIST.dateX + 150 - LIST.left,
        height: LIST.rowH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        border: `2px dashed ${alpha(C.muted, 0.55)}`,
        opacity: p * (1 - out),
        filter: out > 0.01 ? `blur(${6 * out}px)` : undefined,
        transform: `translateX(${out * 40}px)`,
      }}
    >
      <div style={{ position: 'absolute', left: LIST.textX, top: 0, height: LIST.rowH, width: textW, display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>
        {LIST_TEXT.ghost}
        <Chip accent="amber" size={24}>
          {LIST_TEXT.ghostTag}
        </Chip>
      </div>
      {slot(LIST.ownerX, 160)}
      {slot(LIST.dateX, 110)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// s09-05 / s09-06
// ---------------------------------------------------------------------------

/** After the flight: what Preparación now holds. */
function Landed({ frame, fps, at, left, top }: { frame: number; fps: number; at: number; left: number; top: number }) {
  const p = springIn(frame, fps, at, { damping: 15 });
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left, top, opacity: Math.min(1, p * 1.3), transform: `translateY(${(1 - Math.min(1, p)) * 12}px)` }}>
      <Chip accent="emerald" icon="check" size={32}>
        {LIST_TEXT.landed}
      </Chip>
    </div>
  );
}

function Better({ frame, at, outAt }: { frame: number; at: number; outAt: number }) {
  const p = progress(frame, at, 16) * (1 - progress(frame, outAt, 12));
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top: 150, width: 1728, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap' }}>
        <Icon name="check" size={60} color={C.emerald} strokeWidth={2.6} />
        <span style={{ fontFamily: FONT.sans, fontSize: 56, fontWeight: 850, letterSpacing: -0.8, color: C.textStrong }}>{BETTER}</span>
      </div>
    </div>
  );
}

function ExamTerm({ frame, fps, at, enAt, anchorX, boardTop }: { frame: number; fps: number; at: number; enAt: number; anchorX: number; boardTop: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at, { damping: 16 });
  const en = progress(frame, enAt, 14);
  const W = 640;
  const left = Math.min(1728 - W, anchorX - W / 2);
  const top = 150;
  const H = 172;
  return (
    <>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: clamp01(p) }}>
        <line x1={anchorX} y1={top + H + 4} x2={anchorX} y2={boardTop - 8} stroke={alpha(C.violet, 0.8)} strokeWidth={4} strokeDasharray="8 8" strokeLinecap="round" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: W,
          height: H,
          boxSizing: 'border-box',
          padding: '20px 30px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.violet, 0.4 + 0.45 * en)}`,
          background: `linear-gradient(180deg, ${alpha(C.violet, 0.1 + 0.08 * en)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          boxShadow: en > 0.02 ? `0 0 ${Math.round(40 * en)}px ${alpha(C.violet, 0.3 * en)}` : undefined,
          fontFamily: FONT.sans,
          opacity: Math.min(1, p * 1.3),
          transform: `translateY(${(1 - p) * 18}px)`,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{LL_TERM.label}</div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, opacity: clamp01(en * 1.2), transform: `translateY(${(1 - en) * 8}px)` }}>
          <Icon name="mortarboard" size={54} color={C.violet} />
          <span style={{ fontSize: 64, fontWeight: 850, letterSpacing: -1, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{LL_TERM.en}</span>
        </div>
      </div>
    </>
  );
}
