import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { Answers, PILLS_W } from './parts/Answers';
import { BrowserWindow, PortalPage } from './parts/Browser';
import { CLOCK, OWN_CLOCKS, PIECES, PORTAL, TABLE_COLS, TABLE_ROWS, type CellKind, type Piece, type TableCell } from './parts/data';
import { Ribbon, RibbonBox, ribbonLayout, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';
import { thinkWindow } from './parts/think';
import { WallClock } from './parts/WallClock';

const S = 's09-rato';

// ---- Table geometry (stage-local).
const HEAD_Y = 100;
const ROW_Y0 = 156;
const ROW_STEP = 90;
const ROW_H = 82;
const PIECE_W = 230;
const COL_W = 380;
const COL_X = [246, 642, 1038];
const CLOCK_X = 1428;
const LIT_OF: Record<CellKind, number> = { on: 1, half: 0.55, off: 0 };

/**
 * s09-rato «Un rato después».
 *   later      the second visit begins: the first visit's page, the wall clock at 8:58; on the words the page is
 *              closed and the clock moves to 9:02 (3 min after the first visit); the think prompt keeps the top band free (the ribbon hides);
 *   table      the ribbon BECOMES the table (primera vez · 3 min · 2 h): its five boxes travel to the row heads;
 *   no-dhcp / no-dns / tcp-closed / tls-resume / http-new  the «3 min» column, row by row: what is not repeated goes
 *              off with its reason;   two-hours  the «2 h» column and the clock at 10:58;
 *   own-clock  every piece's own clock, the request last.
 */
export function S09Rato(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const later = props.cue('later');
  const table = props.cue('table');
  const noDhcp = props.cue('no-dhcp');
  const noDns = props.cue('no-dns');
  const tcpClosed = props.cue('tcp-closed');
  const tlsResume = props.cue('tls-resume');
  const httpNew = props.cue('http-new');
  const twoHours = props.cue('two-hours');
  const ownClock = props.cue('own-clock');
  const think = thinkWindow(S);

  // ---- Phase A and B: the clock and the closed page; the think prompt and its answers.
  const reserva = w('s09-01', 'reserva');
  const cierras = w('s09-01', 'cierras');
  const minutos = w('s09-01', 'minutos');
  const vuelves = w('s09-01', 'vuelves');
  const confirmed = progress(frame, reserva, 18);
  const closed = progress(frame, cierras, 14, EASE.inOut);
  const back = progress(frame, vuelves, 16);
  const browserShow = progress(frame, later, 14) * (1 - 0.92 * closed + 0.92 * back * closed) * (1 - progress(frame, table, 14));
  const swing = progress(frame, minutos - 4, 46, EASE.inOut);
  const hide = progress(frame, think.from - 14, 10) * (1 - progress(frame, table - 2, 6));
  const answerIn: [number, number] = [progress(frame, think.from + 10, 14), progress(frame, think.from + 18, 14)];
  const reveal = progress(frame, table + 4, 18);
  const answerOut = progress(frame, table + 30, 14);

  // ---- Clock: centre (phases A/B) -> right column (table); 10:58 at two-hours.
  const toRight = progress(frame, table, 30, EASE.inOut);
  const hoursSwing = progress(frame, twoHours, 40, EASE.inOut);
  const minutes = frame < twoHours ? mix(CLOCK.boot, CLOCK.later, swing) : mix(CLOCK.later, CLOCK.twoHours, hoursSwing);
  const clockLabel = twoHours <= frame ? '2 h' : swing > 0.5 ? '3 min' : undefined;

  // ---- Ribbon -> table morph.
  const morph = progress(frame, table, 34, EASE.inOut);
  const rl = ribbonLayout();
  const headIn = progress(frame, table + 20, 14);
  const colFocus = [windowWeight(frame, table, noDhcp, { ramp: 12 }), windowWeight(frame, noDhcp, twoHours, { ramp: 12 }), windowWeight(frame, twoHours, ownClock, { ramp: 12 })];
  const ownIn = progress(frame, ownClock - 4, 18);
  const colOpacity = (i: number) => (0.65 + 0.35 * colFocus[i]) * (1 - ownIn);

  const col2At: Record<Piece, number> = { DHCP: noDhcp, DNS: noDns, TCP: tcpClosed, TLS: tlsResume, HTTP: httpNew };
  const peticion = w('s09-07', 'petición');

  return (
    <Stage>
      {frame < table ? <Ribbon lit={ribbonLit(frame, {}, PIECES)} show={1 - hide} /> : null}

      {/* the ribbon's boxes travel to the table's row heads */}
      {frame >= table
        ? PIECES.map((p, i) => {
            const a = rl[p];
            const rect = {
              x: mix(a.x, 0, morph),
              y: mix(a.y, ROW_Y0 + i * ROW_STEP, morph),
              w: mix(a.w, PIECE_W, morph),
              h: mix(a.h, ROW_H, morph),
            };
            return (
              <div key={p} style={{ opacity: 1 }}>
                <RibbonBox piece={p} rect={rect} lit={1} fontSize={mix(40, 36, morph)} />
              </div>
            );
          })
        : null}

      {/* table headers and cells */}
      {frame >= table
        ? TABLE_COLS.map((c, ci) => (
            <div
              key={c}
              style={{
                position: 'absolute',
                left: COL_X[ci],
                top: HEAD_Y,
                width: COL_W,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.sans,
                fontSize: 34,
                fontWeight: 850,
                letterSpacing: 1,
                color: colFocus[ci] > 0.5 ? C.cyanSoft : C.text,
                borderBottom: `3px solid ${alpha(C.cyan, 0.25 + 0.6 * colFocus[ci])}`,
                opacity: headIn * (1 - ownIn) * (0.55 + 0.45 * Math.max(colFocus[ci], ci === 0 ? 0.3 : 0.1)),
              }}
            >
              {c}
            </div>
          ))
        : null}

      {frame >= table
        ? PIECES.map((p, ri) => {
            const cells = TABLE_ROWS[p];
            const y = ROW_Y0 + ri * ROW_STEP;
            const at1 = table + 24 + ri * 6;
            const at2 = col2At[p];
            const at3 = twoHours + ri * 5;
            return (
              <div key={p}>
                <Cell x={COL_X[0]} y={y} cell={cells[0]} appear={progress(frame, at1, 14)} settle={1} startLit={1} opacity={colOpacity(0)} />
                <Cell x={COL_X[1]} y={y} cell={cells[1]} appear={progress(frame, at2 - 2, 12)} slot={headIn} settle={progress(frame, at2 + 10, 16)} startLit={1} opacity={colOpacity(1)} />
                <Cell x={COL_X[2]} y={y} cell={cells[2]} appear={progress(frame, at3, 12)} slot={headIn} settle={progress(frame, at3 + 4, 14)} startLit={1} opacity={colOpacity(2)} />
              </div>
            );
          })
        : null}

      {/* each piece's own clock (replaces the three columns) */}
      {ownIn > 0.01
        ? PIECES.map((p, ri) => {
            const at = ownClock + ri * 7;
            const on = progress(frame, at, 14);
            const hot = p === 'HTTP' ? progress(frame, peticion - 6, 14) : 0;
            const tone = p === 'HTTP' ? C.emerald : C.sky;
            return (
              <div
                key={p}
                style={{
                  position: 'absolute',
                  left: COL_X[0],
                  top: ROW_Y0 + ri * ROW_STEP,
                  width: COL_X[2] + COL_W - COL_X[0],
                  height: ROW_H,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '0 30px',
                  borderRadius: RADIUS.md,
                  border: `3px solid ${alpha(tone, 0.45 + 0.5 * hot)}`,
                  background: `linear-gradient(${alpha(tone, 0.1 + 0.14 * hot)}, ${alpha(tone, 0.1 + 0.14 * hot)}), ${C.ink950}`,
                  boxShadow: hot > 0.02 ? `0 0 ${Math.round(30 * hot)}px ${alpha(tone, 0.4 * hot)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 38,
                  fontWeight: 800,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                  opacity: on,
                  transform: `translateX(${(1 - on) * 24}px)`,
                }}
              >
                <Icon name="clock" size={44} color={tone} strokeWidth={2.2} />
                {OWN_CLOCKS[p]}
                {p === 'HTTP' ? <span style={{ marginLeft: 'auto', fontSize: 32, fontWeight: 750, color: '#6ee7b7', opacity: hot }}>siempre</span> : null}
              </div>
            );
          })
        : null}

      {/* the first visit's page, closed and opened again */}
      {browserShow > 0.01 && frame < table + 16 ? (
        <div style={{ position: 'absolute', left: 130, top: 236, opacity: browserShow, transform: `scale(${0.94 + 0.06 * (1 - closed * (1 - back))})`, transformOrigin: 'center' }}>
          <BrowserWindow scale={0.46} url={PORTAL.host} loading={back * (1 - progress(frame, vuelves + 24, 10))}>
            <PortalPage confirmed={confirmed} show={1 - 0.5 * closed * (1 - back)} />
          </BrowserWindow>
        </div>
      ) : null}

      {/* the wall clock */}
      <div
        style={{
          position: 'absolute',
          left: mix(714, CLOCK_X, toRight),
          top: mix(222, 130, toRight),
          width: 300,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <WallClock minutes={minutes} label={clockLabel} size={200} digitalSize={58} glow={0.25 + 0.35 * (twoHours <= frame ? hoursSwing : swing)} />
      </div>

      {/* think prompt answers */}
      {frame >= think.from && answerOut < 1 ? (
        <div style={{ position: 'absolute', left: (1728 - PILLS_W) / 2, top: 520, opacity: 1 - answerOut }}>
          <Answers labels={['Sí, todo', 'No, casi nada']} show={answerIn} reveal={reveal} />
        </div>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

function Cell({
  x,
  y,
  cell,
  appear,
  slot = 0,
  settle,
  startLit,
  opacity,
}: {
  x: number;
  y: number;
  cell: TableCell;
  appear: number;
  slot?: number;
  settle: number;
  startLit: number;
  opacity: number;
}) {
  const lit = mix(startLit, LIT_OF[cell.kind], settle);
  const shown = appear > 0.01;
  const tone = cell.kind === 'half' ? C.sky : C.cyan;
  const long = cell.text.length > 16;
  return (
    <>
      {!shown && slot > 0.01 ? (
        <div style={{ position: 'absolute', left: x, top: y, width: COL_W, height: ROW_H, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `3px dashed ${alpha(C.ink600, 0.7 * slot)}`, opacity }} />
      ) : null}
      {shown ? (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: COL_W,
            height: ROW_H,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            border: `3px ${lit > 0.4 ? 'solid' : 'dashed'} ${lit > 0.05 ? alpha(tone, 0.35 + 0.5 * lit) : C.ink600}`,
            background: lit > 0.05 ? alpha(tone, 0.04 + 0.12 * lit) : alpha(C.ink850, 0.6),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.sans,
            opacity: appear * opacity,
            transform: `translateY(${(1 - appear) * 10}px)`,
          }}
        >
          <span style={{ fontSize: long ? 30 : 34, fontWeight: 800, lineHeight: 1.1, color: lit > 0.4 ? C.textStrong : C.faint, whiteSpace: 'nowrap' }}>{cell.text}</span>
          {cell.note ? (
            <span style={{ marginTop: 2, fontSize: 26, fontWeight: 650, lineHeight: 1.1, color: cell.kind === 'off' ? C.muted : '#7dd3fc', whiteSpace: 'nowrap', opacity: settle }}>{cell.note}</span>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
