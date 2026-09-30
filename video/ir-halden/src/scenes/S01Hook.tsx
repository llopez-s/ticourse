import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { CRISIS, NIGHT, PROMISE, QUESTION, TITLE } from '../data/s01-hook';
import { Board, COLUMN_IDS, type BoardProps, type ColumnId, type ColumnState } from './parts/Board';
import { NightStrip } from './parts/s01-hook/NightStrip';
import { Problem, type ProblemTimes } from './parts/s01-hook/Problem';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = 1728;
/** The whiteboard on the crisis-room wall, before the camera moves in. */
const WALL = { left: 690, top: 132, scale: 0.58 } as const;
const STRIP_TOP = 56;

/**
 * s01-hook «Treinta y ocho gigas». The problem first: Lucía's laptop
 * (OPS-WS-14) spent the night isolated inside its cyan bubble, and still a
 * rose stream leaves the port while a counter climbs to 38 GB. The title
 * «Respuesta a incidentes» and the promise: run an incident end to end and
 * know when each phase is really closed (seven boxes tick). Then the night,
 * as a strip that fills with the voice: 3-9 afternoon, the lure e-mail; 16:11
 * the laptop isolated, still on; 01:52 svc_tosreport into srv-tc-app03;
 * 02:00–04:30, 38 GB out to 203.0.113.47. Noon on 4-9: the crisis room, its
 * whiteboard on the wall; the camera moves in until the board fills the stage
 * as an unreadable silhouette (s02 writes it in), its seven boxes lit while
 * the voice asks which are really closed.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exfil = props.cue('exfil');
  const title = props.cue('title');
  const night = props.cue('night');
  const crisis = props.cue('crisis');
  const boardCue = props.cue('board');

  const problem: ProblemTimes = {
    isolatedAt: wordFrame(S, 's01-01', 'noche'),
    okAt: wordFrame(S, 's01-01', 'tocaba.'),
    beaconAt: exfil,
    streamAt: wordFrame(S, 's01-01', 'aun'),
    nightAt: wordFrame(S, 's01-01', 'madrugada,'),
    countFrom: wordFrame(S, 's01-01', 'madrugada,') + 8,
    countTo: wordFrame(S, 's01-01', '38'),
    portAt: wordFrame(S, 's01-01', 'puerto.'),
  };
  const problemOut = progress(frame, title - 14, 14, EASE.inOut);

  // Title and promise.
  const titleOut = progress(frame, night - 12, 12, EASE.inOut);
  const promiseAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word));
  const tickFrom = wordFrame(S, 's01-02', 'cerrada');

  // The night strip.
  const nightAt = NIGHT.map((e) => wordFrame(S, e.seg, e.word));
  const lineAt = NIGHT.map((e) => e.lines.map((l) => wordFrame(S, l.seg, l.word) - 2));
  const stripOut = progress(frame, crisis - 8, 14, EASE.inOut);

  // The crisis room, then the camera moves into the board.
  const roomIn = progress(frame, crisis - 2, 16);
  const zoom = progress(frame, boardCue - 2, 34, EASE.inOut);
  const roomOut = progress(frame, boardCue - 2, 18, EASE.inOut);
  const boardScale = WALL.scale + (1 - WALL.scale) * zoom;
  const boardLeft = WALL.left * (1 - zoom);
  const boardTop = WALL.top * (1 - zoom);

  // «repartido en siete columnas»: the columns light up one by one, then rest.
  const siete = wordFrame(S, 's01-05', 'siete');
  // s01-06: «¿cerradas de verdad?» — every box lights, then lets go well before the scene ends.
  const cerradas = wordFrame(S, 's01-06', 'cerradas');
  const tiempo = wordFrame(S, 's01-06', 'tiempo.');
  const letGo = Math.min(tiempo + 8, props.durationInFrames - 44);
  const boxGlow = progress(frame, cerradas - 6, 12) * (1 - progress(frame, letGo, 14, EASE.inOut));
  const columns: Partial<Record<ColumnId, ColumnState>> = {};
  COLUMN_IDS.forEach((id, i) => {
    const a = siete - 6 + i * 5;
    columns[id] = { glow: 0.55 * progress(frame, a, 6) * (1 - progress(frame, a + 12, 12)), glowTone: 'cyan' };
  });
  const board: BoardProps = { defaults: { reveal: 0, boxGlow }, columns };
  const questionIn = progress(frame, cerradas - 8, 12) * (1 - progress(frame, letGo, 12, EASE.inOut));

  return (
    <Stage>
      {problemOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - problemOut, transform: `scale(${1 - 0.04 * problemOut})` }}>
          <Problem frame={frame} fps={fps} t={problem} />
        </div>
      ) : null}

      {frame >= title - 6 && titleOut < 1 ? (
        <TitleCard frame={frame} fps={fps} at={title - 2} promiseAt={promiseAt} tickFrom={tickFrom} opacity={1 - titleOut} />
      ) : null}

      {frame >= night - 8 && stripOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_TOP, opacity: 1 - stripOut, transform: `translateY(${-24 * stripOut}px)` }}>
          <NightStrip events={NIGHT} frame={frame} fps={fps} headAt={night - 2} drawAt={night + 2} at={nightAt} lineAt={lineAt} release={crisis - 8} />
        </div>
      ) : null}

      {frame >= crisis - 4 ? (
        <>
          {roomOut < 1 ? <Room opacity={roomIn * (1 - roomOut)} /> : null}
          <div
            style={{
              position: 'absolute',
              left: boardLeft,
              top: boardTop,
              width: W,
              transform: boardScale !== 1 ? `scale(${boardScale})` : undefined,
              transformOrigin: '0 0',
              opacity: roomIn,
            }}
          >
            <Board {...board} frame={frame} />
            {questionIn > 0.001 ? <Question opacity={questionIn} /> : null}
          </div>
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Title and promise
// ---------------------------------------------------------------------------

function TitleCard({
  frame,
  fps,
  at,
  promiseAt,
  tickFrom,
  opacity,
}: {
  frame: number;
  fps: number;
  at: number;
  promiseAt: readonly number[];
  tickFrom: number;
  opacity: number;
}) {
  const t = springIn(frame, fps, at, { damping: 17 });
  const rule = progress(frame, at + 8, 18);
  const BOX = 64;
  const GAP = 30;
  const boxesW = 7 * BOX + 6 * GAP;
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans, opacity }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 100,
          width: W,
          textAlign: 'center',
          fontSize: 108,
          fontWeight: 850,
          letterSpacing: -2.5,
          lineHeight: 1.05,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: Math.min(1, t * 1.4),
          transform: `translateY(${(1 - t) * 30}px) scale(${0.96 + 0.04 * t})`,
        }}
      >
        {TITLE.lead} <span style={{ color: C.cyan }}>{TITLE.accent}</span>
      </div>
      <div style={{ position: 'absolute', left: (W - 760 * rule) / 2, top: 238, width: 760 * rule, height: 2, background: C.ink600 }} />
      {PROMISE.map((p, i) => (
        <div
          key={p.text}
          style={{
            position: 'absolute',
            left: 0,
            top: 268 + i * 62,
            width: W,
            textAlign: 'center',
            fontSize: 48,
            fontWeight: 750,
            color: i === 1 ? C.cyanSoft : C.text,
            whiteSpace: 'nowrap',
            ...enter(frame, promiseAt[i] - 6, { distance: 14 }),
          }}
        >
          {p.text}
        </div>
      ))}
      <svg width={boxesW} height={BOX} viewBox={`0 0 ${boxesW} ${BOX}`} style={{ position: 'absolute', left: (W - boxesW) / 2, top: 462, overflow: 'visible' }}>
        {Array.from({ length: 7 }, (_, i) => {
          const x = i * (BOX + GAP);
          const inn = progress(frame, at + 16 + i * 3, 12);
          const tick = progress(frame, tickFrom - 6 + i * 4, 10, EASE.inOut);
          return (
            <g key={i} opacity={inn} transform={`translate(0 ${(1 - inn) * 10})`}>
              <rect x={x + 2} y={2} width={BOX - 4} height={BOX - 4} rx={12} fill={tick > 0.02 ? alpha(C.emerald, 0.12 * tick) : alpha(C.ink950, 0.6)} stroke={tick > 0.02 ? C.emerald : alpha(C.muted, 0.7)} strokeWidth={4} />
              {tick > 0.001 ? (
                <path
                  d={`M ${x + BOX * 0.22} ${BOX * 0.53} L ${x + BOX * 0.43} ${BOX * 0.73} L ${x + BOX * 0.8} ${BOX * 0.3}`}
                  fill="none"
                  stroke={C.emerald}
                  strokeWidth={BOX * 0.12}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - tick}
                />
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The crisis room at noon (the board itself is drawn by the scene)
// ---------------------------------------------------------------------------

function Room({ opacity }: { opacity: number }) {
  const R = 104;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, fontFamily: FONT.sans }}>
      {/* Wall clock at 12:00 */}
      <div style={{ position: 'absolute', left: 150, top: 118 }}>
        <svg width={2 * R + 12} height={2 * R + 12} viewBox={`${-R - 6} ${-R - 6} ${2 * R + 12} ${2 * R + 12}`} style={{ display: 'block' }}>
          <circle r={R} fill={alpha(C.sky, 0.06)} stroke={C.ink500} strokeWidth={8} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r0 = i % 3 === 0 ? R - 26 : R - 18;
            return <line key={i} x1={Math.sin(a) * r0} y1={-Math.cos(a) * r0} x2={Math.sin(a) * (R - 8)} y2={-Math.cos(a) * (R - 8)} stroke={i % 3 === 0 ? C.text : C.muted} strokeWidth={i % 3 === 0 ? 6 : 3} strokeLinecap="round" />;
          })}
          <line x1={0} y1={8} x2={0} y2={-R * 0.52} stroke={C.textStrong} strokeWidth={10} strokeLinecap="round" />
          <line x1={0} y1={10} x2={0} y2={-R * 0.78} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
          <circle r={8} fill={C.cyan} />
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 360, width: 440, textAlign: 'center', whiteSpace: 'nowrap' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 60, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>
          {CRISIS.date} <span style={{ color: C.faint }}>·</span> <span style={{ color: C.cyanSoft }}>{CRISIS.time}</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 46, fontWeight: 800, color: C.text }}>{CRISIS.room}</div>
      </div>
      {/* People around the table, in front of the board */}
      <div style={{ position: 'absolute', left: WALL.left, top: 546, width: 1728 * WALL.scale, height: 110 }}>
        <div style={{ position: 'absolute', left: 30, right: 30, top: 70, height: 20, borderRadius: RADIUS.sm, background: C.ink700, border: `2px solid ${C.ink600}` }} />
        {[0.18, 0.4, 0.62, 0.84].map((f) => (
          <svg key={f} width={96} height={78} viewBox="0 0 96 78" style={{ position: 'absolute', left: `calc(${f * 100}% - 48px)`, top: 0 }}>
            <circle cx={48} cy={20} r={17} fill={C.ink600} />
            <path d="M 12 78 Q 12 42 48 42 Q 84 42 84 78 Z" fill={C.ink600} />
          </svg>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s01-06: the question, on the board's empty body band (board-local)
// ---------------------------------------------------------------------------

function Question({ opacity }: { opacity: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 286, width: W, display: 'flex', justifyContent: 'center', opacity, transform: `translateY(${(1 - opacity) * 12}px)` }}>
      <div
        style={{
          padding: '16px 40px',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.amber, 0.8)}`,
          background: alpha(C.ink950, 0.94),
          boxShadow: `0 0 30px ${alpha(C.amber, 0.25)}`,
          fontFamily: FONT.sans,
          fontSize: 54,
          fontWeight: 850,
          color: '#fcd34d',
          whiteSpace: 'nowrap',
          letterSpacing: -0.5,
        }}
      >
        {QUESTION}
      </div>
    </div>
  );
}
