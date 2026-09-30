import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon, SeverityBadge, windowWeight } from '../../../engine/src/ui';
import { CASE_FIELDS, CLOCK_TAG, DECLARED_TIME, HASTY_TAG, PREP_ITEMS, PREP_TAG, type CaseField } from '../data/s02-board';
import { Board, WRONG_FRAMES, boardGeometry, type BoardProps, type ColumnGeo } from './parts/Board';
import { Leak } from './parts/Leak';
import { Nave } from './parts/Nave';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-board';

/** Set true locally to check Nave and Leak on their own (renders a gallery instead of the scene). */
const PREVIEW = false;

/**
 * s02-board «La pizarra»: the case whiteboard of IR-2026-0147. It arrives as
 * the silhouette s01 left, and the seven columns write themselves in, in exam
 * order (the voice does not list them). Preparación lights up as the only
 * phase before the incident; then the rule of the boxes — they are ticked
 * when their condition holds, not in a hurry (a hasty tick on Erradicación
 * turns amber, is struck out and empties). Finally Detección: its box is
 * ticked at 16:09 (on the «check» sound of the cue) and the case card fills
 * in field by field as proof; the box holds because it meets its condition.
 */
export function S02Board(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (PREVIEW) return <PartsPreview frame={frame} />;

  const seven = props.cue('seven');
  const before = props.cue('before');
  const criterion = props.cue('criterion');
  const declare = props.cue('declare');
  const s05 = segment(props, 's02-05').from;

  const casilla = wordFrame(S, 's02-01', 'casilla');
  const terminada = wordFrame(S, 's02-01', 'terminada');
  const antes = wordFrame(S, 's02-02', 'antes');
  const casillas = wordFrame(S, 's02-03', 'casillas');
  const condicion = wordFrame(S, 's02-03', 'condición');
  const prisa = wordFrame(S, 's02-03', 'prisa');
  const reloj = Math.max(s05, wordFrame(S, 's02-05', 'reloj') - 6);
  const declaro = wordFrame(S, 's02-05', 'declaró');
  const alta = wordFrame(S, 's02-05', 'alta');
  const aguanta = wordFrame(S, 's02-05', 'aguanta');
  const cumple = wordFrame(S, 's02-05', 'condición');

  // Columns write in left to right, in exam order.
  const reveal = (i: number) => progress(frame, seven + 4 + i * 11, 18, EASE.inOut);
  // «Cada una lleva una casilla…» and «Y ojo con las casillas»: every box and «¿terminada?» lights up.
  const boxGlow = Math.max(windowWeight(frame, casilla, terminada + 40, { ramp: 12 }), windowWeight(frame, casillas, condicion + 12, { ramp: 12 }));
  // «…cuando se cumple su condición»: every condition line lights up until Detección takes over.
  const condGlow = windowWeight(frame, condicion, declare - 16, { ramp: 12 });

  const hastyAt = prisa;
  const wrongAt = prisa + 16;
  const board: BoardProps = {
    defaults: { boxGlow, condition: condGlow },
    columns: {
      prep: {
        reveal: reveal(0),
        focus: [before - 4, criterion - 8],
        body: (g) => <PrepBody g={g} frame={frame} antesAt={antes} />,
      },
      detect: {
        reveal: reveal(1),
        focus: [declare - 14, Number.POSITIVE_INFINITY],
        grow: 3,
        box: [
          { at: declare - 3, state: 'checked', time: DECLARED_TIME },
          { at: aguanta - 4, state: 'pulse' },
        ],
        glow: progress(frame, aguanta - 4, 14),
        condition: Math.max(condGlow, progress(frame, cumple - 4, 14)),
        conditionTone: frame >= cumple - 6 ? 'emerald' : 'cyan',
        body: (g) => <CaseCard g={g} frame={frame} openAt={declare + 4} declaroAt={declaro} altaAt={alta} holdAt={aguanta} />,
      },
      analysis: { reveal: reveal(2) },
      contain: { reveal: reveal(3) },
      eradicate: {
        reveal: reveal(4),
        focus: [prisa - 18, declare - 14],
        box: [
          { at: hastyAt, state: 'checked' },
          { at: wrongAt, state: 'wrong' },
        ],
        body: (g) => <HastyTag g={g} frame={frame} at={hastyAt + 4} until={wrongAt + WRONG_FRAMES - 10} />,
      },
      recover: { reveal: reveal(5) },
      lessons: { reveal: reveal(6) },
    },
  };

  // The running clock sits right of the Detección time label.
  const geo = boardGeometry(board, frame);
  const det = geo.columns.detect;
  const clockX = det.box.x + det.box.size * 1.28 + 0.62 * DECLARED_TIME.length * det.timeSize + 26;

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Board {...board} frame={frame} />
        <RunningClock x={clockX} cy={det.box.cy} frame={frame} fps={fps} at={reloj} />
      </div>
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Body of Preparación: «antes del incidente» + what the phase is.
// ---------------------------------------------------------------------------

function PrepBody({ g, frame, antesAt }: { g: ColumnGeo; frame: number; antesAt: number }) {
  const on = progress(g.focus, 0.55, 0.3);
  if (on <= 0) return null;
  const items = PREP_ITEMS.map((it) => wordFrame(S, 's02-02', it.word));
  return (
    <div style={{ position: 'absolute', inset: 0, paddingTop: 6, opacity: on, fontFamily: FONT.sans }}>
      <div style={{ ...enter(frame, antesAt - 4, { distance: 12 }) }}>
        <Chip accent="cyan" icon="clock" size={28}>
          {PREP_TAG}
        </Chip>
      </div>
      <div style={{ marginTop: 14, display: 'grid', gap: 6 }}>
        {PREP_ITEMS.map((it, i) => (
          <div key={it.text} style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap', ...enter(frame, items[i] - 5, { distance: 16, axis: 'x' }) }}>
            <Icon name={it.icon} size={38} color={C.cyan} />
            <span style={{ fontSize: 36, lineHeight: 1.2, fontWeight: 750, color: C.textStrong }}>{it.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Body of Erradicación during the hasty tick.
// ---------------------------------------------------------------------------

function HastyTag({ g, frame, at, until }: { g: ColumnGeo; frame: number; at: number; until: number }) {
  const on = fadeIn(frame, at, 8) * (1 - progress(frame, until, 12));
  if (on <= 0 || g.focus < 0.3) return null;
  return (
    <div style={{ position: 'absolute', left: 0, bottom: 6, opacity: on * progress(g.focus, 0.3, 0.4), transform: `translateY(${(1 - fadeIn(frame, at, 10)) * 10}px)` }}>
      <Chip accent="amber" icon="bolt" size={30}>
        {HASTY_TAG}
      </Chip>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The case card in Detección.
// ---------------------------------------------------------------------------

function CaseCard({
  g,
  frame,
  openAt,
  declaroAt,
  altaAt,
  holdAt,
}: {
  g: ColumnGeo;
  frame: number;
  openAt: number;
  declaroAt: number;
  altaAt: number;
  holdAt: number;
}) {
  const on = progress(g.focus, 0.6, 0.3) * fadeIn(frame, openAt, 10);
  if (on <= 0) return null;
  const fills = CASE_FIELDS.map((f) => wordFrame(S, 's02-04', f.word) - 4 + (f.after ?? 0));
  // s02-05 points at the declaration time, then at the severity; both let go when the box «holds».
  const focusRow = [0, windowWeight(frame, declaroAt, altaAt), windowWeight(frame, altaAt, holdAt + 20), 0];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: on, fontFamily: FONT.sans }}>
      {CASE_FIELDS.map((f, i) => (
        <FieldRow key={f.label} f={f} top={4 + i * 52} width={g.body.w} frame={frame} at={fills[i]} focus={focusRow[i]} delay={i * 3} openAt={openAt} />
      ))}
    </div>
  );
}

function FieldRow({ f, top, width, frame, at, focus, delay, openAt }: { f: CaseField; top: number; width: number; frame: number; at: number; focus: number; delay: number; openAt: number }) {
  const row = enter(frame, openAt + delay, { distance: 10 });
  const fill = progress(frame, at, 12);
  const labelW = 164;
  const band: CSSProperties = {
    position: 'absolute',
    left: -8,
    top: 0,
    width: width + 8,
    height: 48,
    borderRadius: RADIUS.sm,
    background: alpha(C.cyan, 0.14 * focus),
    borderLeft: `4px solid ${alpha(C.cyan, focus)}`,
  };
  return (
    <div style={{ position: 'absolute', left: 0, top, width, height: 48, ...row }}>
      {focus > 0.01 ? <div style={band} /> : null}
      <div style={{ position: 'absolute', left: 8, top: 0, height: 48, display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{f.label}</div>
      <div style={{ position: 'absolute', left: labelW, top: 0, height: 48, right: 0, display: 'flex', alignItems: 'center' }}>
        {fill < 1 ? (
          <div style={{ position: 'absolute', left: 0, width: f.kind === 'mono' ? 300 : 110, height: 30, borderRadius: 8, border: `2px dashed ${alpha(C.muted, 0.45)}`, opacity: 1 - fill }} />
        ) : null}
        <div style={{ opacity: fill, transform: `translateX(${(1 - fill) * 12}px)`, display: 'flex', alignItems: 'center', gap: 12 }}>
          {f.kind === 'mono' ? (
            <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 800, color: focus > 0.5 ? C.cyanSoft : C.textStrong, whiteSpace: 'nowrap' }}>{f.value}</span>
          ) : null}
          {f.kind === 'severity' ? <SeverityBadge level="ALTA" size={28} /> : null}
          {f.kind === 'check' ? <Icon name="check" size={40} color={C.emerald} strokeWidth={3} style={{ transform: `scale(${0.6 + 0.4 * progress(frame, at, 10)})` }} /> : null}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Desde ese momento corre el reloj»
// ---------------------------------------------------------------------------

function RunningClock({ x, cy, frame, fps, at }: { x: number; cy: number; frame: number; fps: number; at: number }) {
  const on = enter(frame, at, { distance: 12, axis: 'x' });
  if (frame < at - 1) return null;
  const turn = ((frame - at) / fps) * 90; // a quarter turn per second
  const R = 21;
  return (
    <div style={{ position: 'absolute', left: x, top: cy - 26, height: 52, display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', ...on }}>
      <svg width={2 * R + 6} height={2 * R + 6} viewBox={`${-R - 3} ${-R - 3} ${2 * R + 6} ${2 * R + 6}`}>
        <circle r={R} fill={alpha(C.sky, 0.1)} stroke={C.sky} strokeWidth={3.5} />
        <line x1={0} y1={0} x2={0} y2={-R * 0.55} stroke={C.sky} strokeWidth={3.5} strokeLinecap="round" transform={`rotate(${turn / 12})`} />
        <line x1={0} y1={0} x2={0} y2={-R * 0.8} stroke={C.textStrong} strokeWidth={3} strokeLinecap="round" transform={`rotate(${turn})`} />
        <circle r={3} fill={C.textStrong} />
      </svg>
      <span style={{ fontSize: 28, fontWeight: 700, color: '#7dd3fc' }}>{CLOCK_TAG}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PREVIEW: the other shared parts on their own (not part of the scene).
// ---------------------------------------------------------------------------

function PartsPreview({ frame }: { frame: number }) {
  const cycle = frame % 150;
  const p = (a: number, d = 20) => progress(cycle, a, d, EASE.inOut);
  const caption: CSSProperties = { fontFamily: FONT.mono, fontSize: TYPE.micro, color: C.faint, marginTop: 4 };
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 10 }}>
        <Nave width={300} lock={p(10)} label="OPS-WS-14" sub="portátil de Lucía" />
        <div style={{ ...caption, marginTop: 96 }}>lock</div>
      </div>
      <div style={{ position: 'absolute', left: 350, top: 10 }}>
        <Nave width={300} open={p(10)} contents="keys" keyTaken={p(70)} glow={0.6} glowTone="amber" label="ADM-WS-02" sub="donde viven las llaves" />
      </div>
      <div style={{ position: 'absolute', left: 700, top: 10 }}>
        <Nave width={300} open={1} contents="crates" intruder={1} intruderHidden={p(40)} bricked={p(80, 40)} plate="3" label="srv-tc-app03" sub="copia del 3-9" />
      </div>
      <div style={{ position: 'absolute', left: 1060, top: 0 }}>
        <Leak width={330} dripFrom={0} mopAt={30} patchAt={100} frame={frame} />
      </div>
      <div style={{ position: 'absolute', left: 1400, top: 0 }}>
        <Leak width={320} state="patched" frame={frame} />
      </div>
      <div style={{ position: 'absolute', left: 1060, top: 300 }}>
        <Leak width={330} state="mopping" frame={frame} />
      </div>
    </Stage>
  );
}
