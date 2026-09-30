import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon, mix, windowWeight } from '../../../engine/src/ui';
import { ANALYSIS_QUESTION, MARKED_TAG, RAM_LINES, SCOPE_HEADER, SCOPE_HOSTS, SCOPE_TAG } from '../data/s03-scope';
import { Board, CASE_TIMES, boardGeometry, type BoardProps, type ColumnGeo } from './parts/Board';
import { HostRow, RamStick } from './parts/s03-scope/Hosts';
import { S03_THINK_LEAD, SCOPE_LAYOUT, scopeRowTop } from './parts/s03-scope/layout';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-scope';
const W = 1728;

/**
 * s03-scope «¿Contenido?»: the Análisis column (scope = how far the attacker
 * got), then the three hosts of the 3-9 scope under the compact board — no
 * account in it. Two are isolated from the EDR (padlocks, 16:11 and 16:15)
 * and stay on, because memory is evidence; the Contención box is ticked at
 * 16:15. During the think prompt the board and the rows sit lower (the card
 * takes the top centre), the fresh tick breathes and ADM-WS-02 stays plain.
 */
export function S03Scope(props: SceneProps) {
  const frame = useCurrentFrame();
  const scope = props.cue('scope');
  const three = props.cue('three');
  const isolate = props.cue('isolate');
  const ram = props.cue('ram');
  const marked = props.cue('marked');
  const thinkAt = segment(props, 's03-05').to - S03_THINK_LEAD;

  const alcance = wordFrame(S, 's03-01', 'alcance,');
  const hasta = wordFrame(S, 's03-01', 'hasta');
  const alcance2 = wordFrame(S, 's03-02', 'alcance');
  const tres = wordFrame(S, 's03-02', 'tres');
  const estacion = wordFrame(S, 's03-02', 'estación');
  const llaves = wordFrame(S, 's03-02', 'llaves.');
  const lucia = wordFrame(S, 's03-03', 'Lucía');
  const operaciones = wordFrame(S, 's03-03', 'Operaciones.');
  const encendidos = wordFrame(S, 's03-03', 'encendidos.');
  const memoria = wordFrame(S, 's03-04', RAM_LINES.evidence.word);
  const apagas = wordFrame(S, 's03-04', RAM_LINES.off.word);
  const aislados = wordFrame(S, 's03-05', 'aislados');
  const prueba = wordFrame(S, 's03-05', 'prueba');
  const marco = wordFrame(S, 's03-05', 'marcó');
  const casilla = wordFrame(S, 's03-05', 'casilla');

  // The full board (Análisis focused) folds into the strip as the hosts arrive.
  const compactAt = Math.max(three - 12, tres - 28);
  const compact = progress(frame, compactAt, 22, EASE.inOut);
  // Before the think prompt, everything moves down out of the card's way.
  const lower = progress(frame, thinkAt - 28, 24, EASE.inOut);

  const board: BoardProps = {
    compact,
    columns: {
      detect: { box: 'checked', time: CASE_TIMES.declared },
      analysis: {
        // The scope as known that day (three hosts): ticked on «three», no time label; it stays ticked from here on.
        box: [{ at: three, state: 'checked' }],
        focus: [scope - 8, isolate - 6],
        grow: 3,
        condition: windowWeight(frame, alcance, three + 10, { ramp: 12 }),
        body: (g) => <AnalysisBody g={g} frame={frame} tagAt={alcance - 4} qAt={hasta - 4} />,
      },
      contain: {
        focus: [isolate - 6, Number.POSITIVE_INFINITY],
        box: [
          { at: marco - 2, state: 'checked', time: CASE_TIMES.firstContainment },
          { at: thinkAt, state: 'pulse' },
        ],
        boxGlow: windowWeight(frame, casilla - 4, thinkAt, { ramp: 12 }),
      },
    },
  };

  // Rows: in on «tres equipos», one after another.
  const rowShow = SCOPE_HOSTS.map((_, i) => progress(frame, tres - 6 + i * 7, 16));
  const locks = [progress(frame, isolate - 4, 10, EASE.in), progress(frame, operaciones - 6, 10, EASE.in)];
  const power = [progress(frame, encendidos - 4, 14), progress(frame, encendidos + 4, 14)];
  const powerGlow = Math.max(windowWeight(frame, ram, marked - 6, { ramp: 12 }), windowWeight(frame, prueba - 4, marco - 2, { ramp: 10 }));
  // The voice points at each row in turn; ADM-WS-02 only while it is named (never during the think prompt).
  const bothIsolated = windowWeight(frame, aislados - 4, marco - 2, { ramp: 10 });
  const glows = [
    Math.max(windowWeight(frame, lucia - 2, operaciones - 6, { ramp: 10 }), bothIsolated),
    Math.max(windowWeight(frame, operaciones - 2, encendidos, { ramp: 10 }), bothIsolated),
    windowWeight(frame, estacion - 2, isolate - 12, { ramp: 10 }),
  ];
  const keys = progress(frame, llaves - 6, 14);
  // The heading waits for the board to fold (it sits where the full board's names are).
  const headerAt = Math.max(alcance2 - 6, compactAt + 18);
  const headerIn = progress(frame, headerAt, 16) * (1 - progress(frame, marco - 14, 10));
  // «alguien marcó la casilla»: a callout under the Contención cell, big while the voice is on it.
  const callout = progress(frame, marco - 2, 12) * (1 - progress(frame, thinkAt - 40, 12, EASE.inOut));
  const containGeo = boardGeometry(board, frame).columns.contain;
  const ramIn = progress(frame, memoria - 8, 16) * (1 - progress(frame, marked - 4, 14, EASE.inOut));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: mix(SCOPE_LAYOUT.stripTop.main, SCOPE_LAYOUT.stripTop.think, lower) }}>
        <Board {...board} frame={frame} />
      </div>

      {headerIn > 0.001 ? <ScopeHeader opacity={headerIn} rise={(1 - progress(frame, headerAt, 16)) * 12} /> : null}
      {callout > 0.001 ? <MarkedCallout cx={containGeo.x + containGeo.w / 2} opacity={callout} rise={(1 - progress(frame, marco - 2, 12)) * 10} /> : null}

      {SCOPE_HOSTS.map((host, i) =>
        rowShow[i] > 0.001 ? (
          <div key={host.host} style={{ position: 'absolute', left: 0, top: scopeRowTop(i, lower) }}>
            <HostRow
              host={host}
              width={W}
              show={rowShow[i]}
              lock={host.isolated ? locks[i] : 0}
              power={host.isolated ? power[i] : 0}
              powerGlow={host.isolated ? powerGlow : 0}
              keys={host.keys ? keys : 0}
              glow={glows[i]}
              glowTone={host.keys ? C.amber : C.cyan}
            />
          </div>
        ) : null,
      )}

      {ramIn > 0.001 ? <RamPanel frame={frame} opacity={ramIn} memoriaAt={memoria} apagasAt={apagas} /> : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Body of Análisis on the full board: «alcance» = how far the attacker got.
// ---------------------------------------------------------------------------

function AnalysisBody({ g, frame, tagAt, qAt }: { g: ColumnGeo; frame: number; tagAt: number; qAt: number }) {
  const on = progress(g.focus, 0.55, 0.3);
  if (on <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, paddingTop: 8, opacity: on, fontFamily: FONT.sans }}>
      <div style={{ ...enter(frame, tagAt, { distance: 12 }) }}>
        <Chip accent="cyan" icon="search" size={32}>
          {SCOPE_TAG}
        </Chip>
      </div>
      <div style={{ marginTop: 22, ...enter(frame, qAt, { distance: 14 }) }}>
        {ANALYSIS_QUESTION.map((line) => (
          <div key={line} style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.16, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.3 }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «Alcance del 3-9 · tres equipos»
// ---------------------------------------------------------------------------

function ScopeHeader({ opacity, rise }: { opacity: number; rise: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 4,
        top: SCOPE_LAYOUT.headerTop,
        height: 46,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `translateY(${rise}px)`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="target" size={36} color={C.cyan} />
      <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>{SCOPE_HEADER.title}</span>
      <span style={{ fontSize: 36, fontWeight: 700, color: C.faint }}>·</span>
      <span style={{ fontSize: 36, fontWeight: 750, color: C.cyanSoft }}>{SCOPE_HEADER.count}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// «alguien marcó la casilla de contención»: the tick, big, under its cell.
// ---------------------------------------------------------------------------

function MarkedCallout({ cx, opacity, rise }: { cx: number; opacity: number; rise: number }) {
  const w = 470;
  const left = Math.max(0, Math.min(W - w, cx - w / 2));
  const tip = cx - left;
  return (
    <div style={{ position: 'absolute', left, top: 150, width: w, height: 70, opacity, transform: `translateY(${rise}px)`, fontFamily: FONT.sans }}>
      <svg width={w} height={16} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <polygon points={`${tip - 14},16 ${tip},2 ${tip + 14},16`} fill={alpha(C.emerald, 0.9)} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 15,
          width: w,
          height: 56,
          boxSizing: 'border-box',
          borderRadius: 28,
          border: `2px solid ${alpha(C.emerald, 0.9)}`,
          background: alpha(C.emeraldDeep, 0.92),
          boxShadow: `0 0 26px ${alpha(C.emerald, 0.35)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="check" size={38} color={C.emerald} strokeWidth={3} />
        <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>{MARKED_TAG}</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: '#6ee7b7' }}>{CASE_TIMES.firstContainment}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// s03-04: memory is evidence; powering off loses it.
// ---------------------------------------------------------------------------

function RamPanel({ frame, opacity, memoriaAt, apagasAt }: { frame: number; opacity: number; memoriaAt: number; apagasAt: number }) {
  const off = progress(frame, apagasAt - 6, 16);
  const drain = progress(frame, apagasAt + 6, 30, EASE.inOut);
  const half = (W - 28) / 2;
  const box = (tone: string, a: number) => ({
    position: 'absolute' as const,
    top: 0,
    width: half,
    height: 100,
    boxSizing: 'border-box' as const,
    borderRadius: RADIUS.lg,
    border: `2px solid ${alpha(tone, 0.25 + 0.45 * a)}`,
    background: `linear-gradient(90deg, ${alpha(tone, 0.1 * a)} 0%, ${alpha(C.ink900, 0.92)} 70%)`,
    display: 'flex',
    alignItems: 'center',
    gap: 26,
    padding: '0 28px',
  });
  const text = (color: string) => ({ fontSize: 36, fontWeight: 750, lineHeight: 1.15, color, whiteSpace: 'nowrap' as const });
  return (
    <div style={{ position: 'absolute', left: 0, top: SCOPE_LAYOUT.ramTop, width: W, height: 100, opacity, fontFamily: FONT.sans }}>
      <div style={{ ...box(C.emerald, 1 - 0.5 * off), left: 0, ...enter(frame, memoriaAt - 8, { distance: 14 }) }}>
        <RamStick width={150} drain={drain} />
        <div>
          {RAM_LINES.evidence.lines.map((l, i) => (
            <div key={l} style={text(i === 1 ? '#6ee7b7' : C.textStrong)}>
              {l}
            </div>
          ))}
        </div>
      </div>
      {off > 0.001 ? (
        <div style={{ ...box(C.amber, off), left: half + 28, opacity: off, transform: `translateX(${(1 - off) * 20}px)` }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, display: 'grid', placeItems: 'center', background: alpha(C.amber, 0.14), border: `2px solid ${alpha(C.amber, 0.55)}`, flexShrink: 0 }}>
            <Icon name="power" size={38} color={C.amber} />
          </div>
          <div style={{ opacity: fadeIn(frame, apagasAt, 10) }}>
            {RAM_LINES.off.lines.map((l, i) => (
              <div key={l} style={text(i === 1 ? '#fcd34d' : C.textStrong)}>
                {l}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
