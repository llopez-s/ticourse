import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { PROMISE, ROW_WORDS, TITLE } from '../data/s01-hook';
import { QUEUE, QueuePanel, TRAIL_ORDER, type RowState, type TrailKind } from './parts/TrailRow';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

/** While the first sentence is said the queue sits centred; it settles at QUEUE.y as the title arrives. */
const CENTRED_Y = Math.round((STAGE.height - QUEUE.height) / 2);
const TITLE_TOP = 0;
const CHIPS_TOP = 102;

/**
 * s01-hook «Tres rastros de una noche». The SOC's morning queue, «21-10 ·
 * 08:00 · revisión de la mañana», is on screen from the first frame with its
 * three rows in time order, all at once and half-lit (key, folder, pipe).
 * The date lights on «mañana» and the count pops on «tres». On `title` the
 * queue settles lower and «Ataques en los logs» enters above it, then the
 * promise as three chips on «verla», «nombre» and «decidir» (la forma · el
 * nombre · qué hacer). On `rows` the three rows light within the one sentence
 * — each on its own words (llave, URL, chorro) — while the title, chips and
 * the queue's header step back. The last frame is the resting layout of
 * TrailRow's QUEUE, so s02's ExpandingRow starts from exactly here.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const queueAt = props.cue('queue');
  const titleAt = props.cue('title');
  const rowsAt = props.cue('rows');

  // ---- The queue: settle-in on frame 0, the date on «mañana», the count on «tres».
  const settle = progress(frame, -10, 22);
  const headerGlow = windowWeight(frame, Math.max(queueAt, wordFrame(S, 's01-01', 'mañana') - 4), titleAt, { ramp: 12 });
  const countIn = springIn(frame, fps, wordFrame(S, 's01-01', 'tres') - 6, { damping: 12 });
  const drop = progress(frame, titleAt - 16, 24, EASE.inOut);
  const queueY = mix(CENTRED_Y, QUEUE.y, drop);

  // ---- Rows: half-lit until their words in s01-03.
  const restDim = progress(frame, rowsAt - 4, 18, EASE.inOut);
  const rowLit = (k: TrailKind) => progress(frame, Math.max(rowsAt - 4, wordFrame(S, 's01-03', ROW_WORDS[k]) - 6), 14);
  const allLit = progress(frame, wordFrame(S, 's01-03', ROW_WORDS.pipe) + 10, 1);
  const rows = Object.fromEntries(TRAIL_ORDER.map((k) => [k, { lit: rowLit(k), pulse: allLit >= 1 } satisfies RowState])) as Record<TrailKind, RowState>;

  // ---- Title and promise.
  const titleIn = enter(frame, titleAt - 6, { distance: 22, duration: 18 });
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);
  const showTitle = frame >= titleAt - 8;

  return (
    <Stage>
      {/* Title */}
      {showTitle ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn }}>
          <div style={{ ...dimStyle(restDim) }}>
            <span style={{ fontSize: 80, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap' }}>
              {TITLE.lead}
              <span style={{ color: C.cyan }}>{TITLE.accent}</span>
            </span>
          </div>
        </div>
      ) : null}

      {/* Promise: three chips */}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 22, ...dimStyle(restDim) }}>
          {PROMISE.map((p, i) => {
            const a = ACCENT[p.accent];
            const e = enter(frame, chipAt[i], { distance: 16 });
            const lit = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? rowsAt) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 62,
                  padding: '0 26px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(a.fg, 0.4 + 0.5 * lit)}`,
                  background: alpha(a.fg, 0.06 + 0.12 * lit),
                  boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(a.fg, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={34} color={a.fg} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The morning queue */}
      <div
        style={{
          position: 'absolute',
          left: QUEUE.x,
          top: queueY,
          opacity: settle,
          transform: `scale(${0.985 + 0.015 * settle})`,
          transformOrigin: '50% 50%',
        }}
      >
        <QueuePanel rows={rows} headerGlow={headerGlow} countIn={countIn} chromeDim={0.6 * restDim} frame={frame} />
      </div>
    </Stage>
  );
}
