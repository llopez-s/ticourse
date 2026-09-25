import type { ReactElement } from 'react';
import { random } from 'remotion';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { EASE, fadeIn, fadeOut, lerp, progress } from '../../../theme/motion';
import { Cursor, Icon, Panel, Stamp } from '../../../ui';
import { QUEUE_NOISY, QUEUE_TAIL, type QueueAlert } from '../../../data/s06-fatigue';

/** Panel header height (see ui/Panel). */
const TITLE_H = 64;
const COLS_H = 48;
const ROW_H = 58;
/** Scroll speed in px/frame: a slow trickle before the cue, a firehose after it. */
const V_IDLE = 0.9;
const V_FAST = 14;
/** One row in ten survives the batch close (the 10 % somebody opened). */
const KEEP_EVERY = 10;
const KEEP_AT = 4;
/** Rows laid out per frame (virtualised: only what can be on screen). */
const WINDOW = 24;
/** Rows that fold one after another (2 frames apart); the rest fold with the last of them. */
const FOLD_STAGGER_ROWS = 8;

const mod = (a: number, n: number) => ((a % n) + n) % n;

function velocity(f: number, queue: number, close: number): number {
  const up = progress(f, queue - 6, 18, EASE.inOut);
  const down = progress(f, close, 10, EASE.out);
  return (V_IDLE + (V_FAST - V_IDLE) * up) * (1 - down);
}

/** Total scroll (px) accumulated before `frame`. New alerts enter at the top and push the list down. */
function scrollAt(frame: number, queue: number, close: number): number {
  let s = 0;
  for (let i = 0; i < frame; i++) s += velocity(i, queue, close);
  return s;
}

/**
 * Queue mix, 20 rows long, matching the Pareto: 7 backup (35 %), 5 scanner
 * (26 %), 4 balancer (~17 %), 4 from the long tail (~22 %). -1 = tail.
 */
const MIX = [0, 1, 0, 2, -1, 0, 1, 0, 1, 2, 0, -1, 1, 0, 2, -1, 1, 0, 2, -1] as const;

function alertFor(k: number): QueueAlert {
  const slot = MIX[mod(k, MIX.length)];
  if (slot >= 0) return QUEUE_NOISY[slot];
  return QUEUE_TAIL[Math.floor(random(`s06-tail-${k}`) * QUEUE_TAIL.length)];
}

/** Night-shift clock: newer rows (smaller k) are later. */
function clockFor(k: number): string {
  const total = mod(10050 - k * 6, 86400);
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  return parts.map((n) => String(n).padStart(2, '0')).join(':');
}

const COL = { dot: 12, time: 132, sev: 96, host: 180 } as const;

function Row({ alert, time, opened }: { alert: QueueAlert; time: string; opened: number }) {
  return (
    <div
      style={{
        height: ROW_H,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 24px',
        borderBottom: `1px solid ${alpha(C.ink700, 0.9)}`,
        background: alpha(C.cyan, 0.07 * opened),
        boxShadow: opened > 0 ? `inset 4px 0 0 ${alpha(C.cyan, 0.8 * opened)}` : 'none',
      }}
    >
      <div
        style={{
          width: COL.dot,
          height: COL.dot,
          borderRadius: COL.dot / 2,
          background: alpha(C.cyan, 0.75),
          flexShrink: 0,
        }}
      />
      <div style={{ width: COL.time, fontFamily: FONT.mono, fontSize: 24, color: C.faint, flexShrink: 0 }}>{time}</div>
      <div
        style={{
          width: COL.sev,
          textAlign: 'center',
          fontFamily: FONT.mono,
          fontSize: TYPE.micro,
          fontWeight: 650,
          color: C.muted,
          border: `2px solid ${C.ink600}`,
          borderRadius: RADIUS.pill,
          padding: '2px 0',
          flexShrink: 0,
        }}
      >
        {alert.sev}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: FONT.sans,
          fontSize: TYPE.small,
          fontWeight: 550,
          color: opened > 0.5 ? C.text : C.muted,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {alert.rule}
      </div>
      <div
        style={{
          width: COL.host,
          textAlign: 'right',
          fontFamily: FONT.mono,
          fontSize: TYPE.micro,
          color: C.faint,
          flexShrink: 0,
        }}
      >
        {alert.host}
      </div>
    </div>
  );
}

function ColumnHeads() {
  const head = { fontFamily: FONT.sans, fontSize: TYPE.micro, fontWeight: 700, color: C.faint, letterSpacing: 1.5 } as const;
  return (
    <div
      style={{
        height: COLS_H,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 24px',
        borderBottom: `2px solid ${C.ink700}`,
        background: alpha(C.ink850, 0.6),
      }}
    >
      <div style={{ width: COL.dot, flexShrink: 0 }} />
      <div style={{ ...head, width: COL.time }}>HORA</div>
      <div style={{ ...head, width: COL.sev, textAlign: 'center' }}>SEV.</div>
      <div style={{ ...head, flex: 1 }}>REGLA</div>
      <div style={{ ...head, width: COL.host, textAlign: 'right' }}>ORIGEN</div>
    </div>
  );
}

function CloseAllButton({ pressed, press }: { pressed: number; press: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 44,
        padding: '0 18px',
        borderRadius: 12,
        border: `2px solid ${pressed > 0.5 ? alpha(C.amber, 0.85) : C.ink500}`,
        background: pressed > 0.5 ? alpha(C.amber, 0.18) : C.ink700,
        color: pressed > 0.5 ? C.amber : C.text,
        fontFamily: FONT.sans,
        fontSize: TYPE.small,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        transform: `scale(${1 - 0.06 * press})`,
      }}
    >
      <Icon name="archive" size={26} color={pressed > 0.5 ? C.amber : C.muted} />
      Cerrar todas
    </div>
  );
}

/**
 * The console's alert queue: grey rows stream in from the top (virtualised),
 * then "Cerrar todas" is clicked, the stream stops and nine rows in ten fold
 * away while an amber stamp lands on the emptied queue.
 */
export function AlertQueue({
  frame,
  queue,
  close,
  stampAt,
  width,
  height,
}: {
  frame: number;
  queue: number;
  close: number;
  stampAt: number;
  width: number;
  height: number;
}) {
  const listH = height - TITLE_H - COLS_H;
  const scroll = scrollAt(frame, queue, close);
  const frozen = scrollAt(close + 14, queue, close);
  const kFrozen = Math.floor(-frozen / ROW_H) - 1;
  const kStart = Math.floor(-scroll / ROW_H) - 1;

  const rows: ReactElement[] = [];
  // While the rows fold, the survivors settle flush with the top of the list.
  const raw = kStart * ROW_H + scroll;
  let y = raw + (6 - raw) * progress(frame, close + 10, 28, EASE.inOut);
  for (let k = kStart; k < kStart + WINDOW && y < listH; k++) {
    const kept = mod(k, KEEP_EVERY) === KEEP_AT;
    // Rows below the fold scroll up into view as the ones above collapse; they fold
    // together with the last visible row so the list is empty before the stamp lands.
    const j = Math.min(FOLD_STAGGER_ROWS, Math.max(0, k - kFrozen));
    const fold = kept ? 0 : progress(frame, close + 10 + j * 2, 10, EASE.inOut);
    const h = ROW_H * (1 - fold);
    if (h > 0.5 && y + h > 0) {
      const opened = kept ? progress(frame, close + 34, 12) : 0;
      rows.push(
        <div key={k} style={{ position: 'absolute', left: 0, right: 0, top: y, height: h, overflow: 'hidden' }}>
          <div style={{ opacity: 1 - Math.min(1, fold * 1.6) }}>
            <Row alert={alertFor(k)} time={clockFor(k)} opened={opened} />
          </div>
        </div>,
      );
    }
    y += h;
  }

  const clickAt = close;
  const press = lerp(frame, [clickAt, clickAt + 3], [0, 1]) * (1 - lerp(frame, [clickAt + 3, clickAt + 9], [0, 1]));
  const pressed = frame >= clickAt ? 1 : 0;
  const streaming = progress(frame, queue - 6, 12) * (1 - progress(frame, close, 10));

  return (
    <>
      <Panel
        title="Cola de alertas · SOC de Halden"
        icon="bell"
        accent="cyan"
        glow={0.55 * streaming}
        right={<CloseAllButton pressed={pressed} press={press} />}
        style={{ position: 'absolute', left: 0, top: 0, width, height }}
      >
        <ColumnHeads />
        <div style={{ position: 'absolute', left: 0, right: 0, top: COLS_H, height: listH, overflow: 'hidden' }}>
          {rows}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 70,
              background: `linear-gradient(180deg, ${alpha(C.ink900, 0)} 0%, ${C.ink900} 100%)`,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 24,
            bottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: FONT.mono,
            fontSize: TYPE.micro,
            color: C.faint,
            opacity: fadeIn(frame, close + 30, 12),
          }}
        >
          <Icon name="archive" size={24} color={C.faint} />
          5.400 cerradas en lote
        </div>
      </Panel>

      <div style={{ position: 'absolute', left: width / 2, top: 404, transform: 'translate(-50%, -50%)' }}>
        <Stamp frame={frame} at={stampAt} accent="amber" rotate={-6}>
          Cerradas sin abrir
        </Stamp>
      </div>

      <div style={{ position: 'absolute', inset: 0, opacity: fadeOut(frame, close + 30, 12) }}>
        <Cursor
          frame={frame}
          path={[
            { x: width - 330, y: 430, at: close - 30 },
            { x: width - 96, y: 34, at: close, click: true },
          ]}
        />
      </div>
    </>
  );
}
