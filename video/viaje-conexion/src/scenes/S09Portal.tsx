import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui/Chip';
import { Icon } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { Edificio } from './parts/Edificio';
import { NAT_TIME, NAT_PORT, PUBLIC_IP } from './parts/data';
import { DeviceTile } from './parts/Glyphs';
import { CaseStamp, Line } from './parts/Marks';
import { NAT_W, NatTable, natRowTop } from './parts/NatTable';
import { thinkWindow } from './parts/Timing';

const S = 's09-portal';
const LOG_Y = 246;
const CROWD = { x0: 54, pitch: 108, row0: 500, rowStep: 108, cols: 15 };
const TABLE_K = 0.8;
const TABLE_X = 250;
const TABLE_Y = 392;

/** One silhouette of the thirty identical laptops behind the public address. */
function Silhouette({ x, y, lit, dim }: { x: number; y: number; lit: number; dim: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 36,
        top: y - 36,
        width: 72,
        height: 72,
        borderRadius: 18,
        display: 'grid',
        placeItems: 'center',
        background: alpha(lit > 0.02 ? C.cyan : C.muted, 0.1 + 0.12 * lit),
        border: `2px solid ${alpha(lit > 0.02 ? C.cyan : C.muted, 0.4 + 0.5 * lit)}`,
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(30 * lit)}px ${alpha(C.cyan, 0.5 * lit)}` : undefined,
        opacity: 1 - 0.6 * dim,
      }}
    >
      <Icon name="laptop" size={42} color={lit > 0.02 ? C.cyan : C.muted} />
    </div>
  );
}

/**
 * s09-portal «Lo que ve el portal». The portal's side: on `log` one line of its record (the public address and
 * port, «reserva creada», the time); on `crowd` thirty identical laptops appear behind that address and, during
 * the think pause, a magnifying glass sweeps all of them without stopping on any («Sí» / «No» sit at the top
 * right; the top-centre band stays free); on `verdict` the portal only sees the translated address; on `natlog`
 * the NAT table of the shipping company replaces the crowd; on `match` the row that matches the log's address,
 * port and time lights and points at one laptop; `wrap` closes with the shared address line.
 */
export function S09Portal(props: SceneProps) {
  const frame = useCurrentFrame();
  const logAt = props.cue('log');
  const crowdAt = props.cue('crowd');
  const verdictAt = props.cue('verdict');
  const natlogAt = props.cue('natlog');
  const matchAt = props.cue('match');
  const wrapAt = props.cue('wrap');
  const wf = (seg: string, w: string, n = 0) => wordFrame(S, seg, w, n);
  const hold = thinkWindow(S);

  // ---- the portal and its record ----
  const bIn = progress(frame, 0, 18);
  const logIn = progress(frame, logAt - 2, 22, EASE.linear);
  const logBox = enter(frame, logAt - 2, { distance: 14 });
  const addrGlow = progress(frame, crowdAt, 12) * (1 - progress(frame, natlogAt, 12));
  const timeAt = wf('s09-01', 'hora') - 2;
  const timeHi = progress(frame, timeAt, 10);
  const matchP = progress(frame, matchAt, 14);

  // ---- the crowd ----
  const crowdIn = progress(frame, crowdAt, 18);
  const crowdOut = progress(frame, natlogAt - 6, 14);
  const crowdLabel = enter(frame, crowdAt, { distance: 12 });
  const thirty = progress(frame, wf('s09-03', 'treinta') - 6, 12);

  // ---- the magnifier sweeps both rows during the pause, never stopping ----
  const sweepLen = Math.max(1, hold.to - hold.from);
  const u = progress(frame, hold.from, sweepLen, EASE.linear);
  const lupaOn = progress(frame, hold.from - 4, 8) * (1 - progress(frame, hold.to + 2, 8));
  const rowSpan = (CROWD.cols - 1) * CROWD.pitch;
  const lupaX = CROWD.x0 + (u < 0.5 ? u * 2 : 2 - u * 2) * rowSpan;
  const lupaY = CROWD.row0 + (u < 0.5 ? 0 : CROWD.rowStep) + 6;
  const lupaRow = u < 0.5 ? 0 : 1;

  // ---- «Sí» / «No» ----
  const optAt = wf('s09-02', 'ordenador') - 2;
  const opts = progress(frame, optAt, 12);
  const noSolid = progress(frame, verdictAt, 8);
  const optsOut = progress(frame, verdictAt + 40, 12);

  // ---- verdict callout ----
  const verdict = enter(frame, verdictAt, { distance: 16 });
  const verdictOut = 1 - progress(frame, natlogAt - 8, 12);

  // ---- NAT table ----
  const tableRows = [0, 1, 2, 3].map((i) => progress(frame, natlogAt + 6 + i * 8, 22, EASE.linear));
  const tableTitle = enter(frame, natlogAt, { distance: 14 });
  const hourHi = progress(frame, wf('s09-04', 'hora') - 2, 10);
  const portsHi = progress(frame, wf('s09-04', 'puertos') - 2, 10);
  const tableDim = 1 - 0.9 * progress(frame, wrapAt - 4, 14);
  const wrap1 = enter(frame, wrapAt - 2, { distance: 16 });
  const wrap2 = enter(frame, wrapAt + 14, { distance: 16 });

  const rowCenterY = TABLE_Y + (natRowTop(0) + 31) * TABLE_K;

  return (
    <>
      <Stage>
        {/* ---- the portal ---- */}
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: bIn }}>
          <Edificio width={150} height={200} glow={0.3} />
        </div>
        <div style={{ position: 'absolute', left: 176, top: 60, opacity: bIn, fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, lineHeight: 1.18, color: C.muted }}>
          portal de
          <br />
          reservas
        </div>

        {/* ---- «Sí» / «No» while the question waits ---- */}
        {opts > 0.01 ? (
          <div style={{ position: 'absolute', left: 1370, top: 150, display: 'flex', gap: 18, opacity: opts * (1 - optsOut) }}>
            <Chip accent="emerald" size={44} style={{ minWidth: 120, justifyContent: 'center', opacity: 1 - 0.6 * noSolid }}>
              Sí
            </Chip>
            <Chip accent="amber" size={44} solid={noSolid > 0.5} style={{ minWidth: 120, justifyContent: 'center' }}>
              No
            </Chip>
          </div>
        ) : null}

        {/* ---- the portal's record ---- */}
        {logIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: LOG_Y,
              width: 1728,
              height: 132,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha('#94a3b8', 0.55)}`,
              background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              ...logBox,
            }}
          >
            <div style={{ position: 'absolute', left: 26, top: 10, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted }}>registro del portal</div>
            <div style={{ position: 'absolute', left: 26, top: 50, display: 'flex', alignItems: 'center', width: 1676, clipPath: `inset(-10px ${Math.round((1 - logIn) * 100)}% -10px 0)` }}>
              <div
                style={{
                  padding: '2px 16px',
                  borderRadius: RADIUS.sm,
                  border: `3px solid ${alpha(C.cyan, 0.9 * Math.max(addrGlow, matchP))}`,
                  background: alpha(C.cyan, 0.12 * Math.max(addrGlow, matchP)),
                  boxShadow: addrGlow > 0.05 ? `0 0 ${Math.round(34 * addrGlow)}px ${alpha(C.cyan, 0.45 * addrGlow)}` : undefined,
                  fontFamily: FONT.mono,
                  fontSize: 52,
                  fontWeight: 800,
                  color: C.cyanSoft,
                  whiteSpace: 'nowrap',
                }}
              >
                {PUBLIC_IP}:{NAT_PORT}
              </div>
              <div style={{ marginLeft: 72, display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 46, fontWeight: 800, color: C.emerald, whiteSpace: 'nowrap' }}>
                <Icon name="check" size={46} color={C.emerald} strokeWidth={3.2} />
                reserva creada
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  marginRight: 10,
                  padding: '2px 14px',
                  borderRadius: RADIUS.sm,
                  border: `3px solid ${alpha(C.cyan, 0.9 * matchP)}`,
                  fontFamily: FONT.mono,
                  fontSize: 48,
                  fontWeight: 750,
                  color: matchP > 0.5 || timeHi > 0.5 ? C.textStrong : C.muted,
                  whiteSpace: 'nowrap',
                }}
              >
                {NAT_TIME}
              </div>
            </div>
          </div>
        ) : null}

        {/* ---- the crowd behind the address ---- */}
        {crowdIn > 0.01 && crowdOut < 0.99 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: crowdIn * (1 - crowdOut) }}>
            <div style={{ position: 'absolute', left: CROWD.x0 - 36, top: 408, ...crowdLabel, opacity: crowdLabel.opacity, fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: thirty > 0.5 ? C.amber : C.muted, whiteSpace: 'nowrap' }}>
              la oficina de la naviera · treinta portátiles iguales
            </div>
            {Array.from({ length: 30 }, (_, i) => {
              const row = Math.floor(i / CROWD.cols);
              const col = i % CROWD.cols;
              const x = CROWD.x0 + col * CROWD.pitch;
              const y = CROWD.row0 + row * CROWD.rowStep + 6;
              const showAt = crowdAt + 4 + ((i * 3) % 30);
              const p = progress(frame, showAt, 10);
              const near = Math.abs(lupaX - x) < 50 && lupaRow === row ? lupaOn : 0;
              return (
                <div key={i} style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
                  <Silhouette x={x} y={y} lit={near * 0.35} dim={0} />
                </div>
              );
            })}
            {lupaOn > 0.01 ? (
              <div style={{ position: 'absolute', left: lupaX - 8, top: lupaY - 70, opacity: lupaOn }}>
                <Icon name="search" size={86} color={C.textStrong} strokeWidth={2.4} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---- the verdict ---- */}
        {frame >= verdictAt - 2 && verdictOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 30, width: 1728, display: 'flex', justifyContent: 'center', ...verdict, opacity: verdict.opacity * verdictOut }}>
            <Line size={58} weight={850}>
              <span style={{ color: C.amber }}>No</span>: solo ve la dirección traducida
            </Line>
          </div>
        ) : null}

        {/* ---- the NAT table of the shipping company ---- */}
        {frame >= natlogAt - 2 ? (
          <div style={{ opacity: tableDim }}>
            <div style={{ position: 'absolute', left: TABLE_X, top: TABLE_Y, transformOrigin: 'top left', transform: `scale(${TABLE_K})` }}>
              <NatTable rows={tableRows} lit={[matchP, 0, 0, 0]} markPorts={portsHi} markTime={matchP} />
            </div>
            <div style={{ position: 'absolute', left: TABLE_X + NAT_W * TABLE_K + 30, top: TABLE_Y, ...tableTitle }}>
              <Line size={40} weight={850} color={C.cyan}>
                registro de NAT
              </Line>
              <Line size={40} weight={850} color={C.cyan}>
                de la naviera
              </Line>
              <div style={{ marginTop: 10, opacity: Math.max(hourHi, portsHi) }}>
                <Line size={30} weight={650} color={C.muted}>
                  con la hora y los puertos
                </Line>
              </div>
            </div>
            {/* the one laptop it points at */}
            {matchP > 0.01 ? (
              <div style={{ position: 'absolute', left: 50, top: rowCenterY - 52, opacity: matchP }}>
                <DeviceTile kind="laptop" tile={84} glow={matchP} name="este portátil" nameSize={26} />
              </div>
            ) : null}
            {matchP > 0.01 ? (
              <svg width={100} height={30} style={{ position: 'absolute', left: 140, top: rowCenterY - 15, overflow: 'visible', opacity: matchP }}>
                <line x1={0} y1={15} x2={86 * matchP} y2={15} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
                <polygon points="98,15 82,6 82,24" fill={C.cyan} />
              </svg>
            ) : null}
          </div>
        ) : null}

        {/* ---- wrap ---- */}
        {frame >= wrapAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 470, width: 1728, display: 'grid', justifyItems: 'center', gap: 10 }}>
            <div style={wrap1}>
              <Line size={62} weight={850}>
                una dirección <span style={{ color: C.amber }}>compartida</span>,
              </Line>
            </div>
            <div style={wrap2}>
              <Line size={62} weight={850}>
                por sí sola, no señala a nadie
              </Line>
            </div>
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
