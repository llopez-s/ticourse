import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix } from '../../../engine/src/ui';
import { CAPACITY, PROMISE, QUEUE_TITLE, REPORT, ROWS, TITLE } from '../data/s01-hook';
import { DataSeal, QueueRow } from './parts/Finding';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- Title block (from `title`): the title, then three chips.
const TITLE_TOP = 0;
const CHIPS_TOP = 84;
// ---- The queue: low and centred until the title arrives, then it steps down a little.
const Q_W = 1536;
const Q_X = (W - Q_W) / 2;
const Q_TOP_A = 70;
const Q_TOP_B = 160;
const STRIP_H = 58;
const HEAD_H = 62;
const ROW_H = 92;
const ROW_GAP = 10;

/**
 * s01-hook «Una cola, un solo parche». Thursday 1-10, nine in the morning: on `report` the monthly scan's report line
 * settles in over the SOC queue (with the «datos ficticios» seal); on `rows` the three red rows arrive on the words
 * «tres filas rojas», half-lit — `srv-msg01` 9.8 CRITICAL, `srv-msg02` 9.8 CRITICAL, `cam-nvr-02` 8.1 HIGH — and the
 * capacity counter on «cabe»: «esta semana cabe: 1 parche». Before 12 s (`title`) the title «Qué se arregla primero»
 * lands at the top while the queue steps down; the promise follows as three chips, each on its words («decide»,
 * «tiene», «cerrado»). Last, the three rows light together and everything else steps back.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const reportAt = props.cue('report');
  const rowsAt = props.cue('rows');

  // ---- Report strip and queue panel.
  const stripIn = enter(frame, reportAt - 6, { distance: 16, duration: 16 });
  const panelIn = progress(frame, 4, 22);
  const sealIn = progress(frame, wordFrame(S, 's01-01', 'informe') + 4, 12);

  // ---- Rows on «tres filas rojas», half-lit.
  const rowAt = ['tres', 'filas', 'rojas'].map((w) => Math.min(wordFrame(S, 's01-01', w) - 4, rowsAt + 24));
  const rowIn = rowAt.map((a) => springIn(frame, 30, a, { damping: 16 }));
  const capAt = wordFrame(S, 's01-01', 'cabe') - 8;
  const capIn = springIn(frame, 30, capAt, { damping: 15 });

  // ---- Title before 12 s, whatever the voice does; the queue steps down.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const drop = progress(frame, titleAt - 6, 26, EASE.inOut);
  const qTop = mix(Q_TOP_A, Q_TOP_B, drop);
  const chipAt = PROMISE.map((p, i) => (i === 0 ? Math.min(wordFrame(S, 's01-02', p.word) - 6, props.cue('promise') + 14) : wordFrame(S, 's01-02', p.word) - 6));

  // ---- The three rows light together; the rest steps back.
  const litAt = wordFrame(S, 's01-02', 'verdad') - 14;
  const lit = progress(frame, litAt, 20, EASE.inOut);
  const rest = 0.62 * lit;
  const rowLit = (i: number) => mix(0.55, 1, lit) * Math.min(1, rowIn[i] * 1.2);

  return (
    <Stage>
      {/* Title block */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, ...titleIn }}>
          <div style={{ ...dimStyle(rest), fontSize: 66, fontWeight: 850, letterSpacing: -1.3, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>{TITLE}</div>
        </div>
      ) : null}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 22, ...dimStyle(rest) }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 16 });
            const on = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? litAt) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 58,
                  padding: '0 26px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * on),
                  boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 34,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={32} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The queue: report strip, panel with three rows, the week's capacity */}
      <div style={{ position: 'absolute', left: Q_X, top: qTop, width: Q_W }}>
        {frame >= reportAt - 8 ? (
          <div style={{ ...stripIn, ...dimStyle(rest, stripIn.opacity), height: STRIP_H, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
            <Icon name="clock" size={36} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 34, color: C.cyanSoft }}>{REPORT.day}</span>
            <Dot />
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 34, color: C.text }}>{REPORT.time}</span>
            <Dot />
            <span style={{ fontWeight: 750, fontSize: 36, color: C.textStrong }}>{REPORT.what}</span>
            <Dot />
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 32, color: C.muted }}>{REPORT.mode}</span>
            <div style={{ flex: 1 }} />
            <DataSeal show={sealIn} />
          </div>
        ) : (
          <div style={{ height: STRIP_H }} />
        )}

        <div
          style={{
            marginTop: 12,
            borderRadius: RADIUS.lg,
            border: `2px solid ${C.ink700}`,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}`,
            opacity: panelIn,
            overflow: 'hidden',
          }}
        >
          <div style={{ ...dimStyle(rest), height: HEAD_H, display: 'flex', alignItems: 'center', gap: 14, padding: '0 28px', borderBottom: `2px solid ${C.ink700}`, background: alpha(C.ink800, 0.9) }}>
            <Icon name="bell" size={32} color={C.rose} />
            <span style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.text }}>{QUEUE_TITLE}</span>
          </div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: ROW_GAP }}>
            {ROWS.map((r, i) => (
              <div key={r.host} style={{ height: ROW_H }}>
                {rowIn[i] > 0.01 ? (
                  <QueueRow
                    width={Q_W - 40}
                    height={ROW_H}
                    host={r.host}
                    score={r.score}
                    sev={r.sev}
                    lit={rowLit(i)}
                    show={Math.min(1, rowIn[i] * 1.4)}
                    style={{ transform: `translateY(${(1 - Math.min(1, rowIn[i])) * 22}px)` }}
                  />
                ) : (
                  <SlotRow width={Q_W - 40} height={ROW_H} />
                )}
              </div>
            ))}
          </div>
        </div>

        {capIn > 0.01 ? (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', opacity: Math.min(1, capIn * 1.4), transform: `scale(${0.92 + 0.08 * Math.min(1, capIn)})`, ...dimStyle(rest) }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                padding: '8px 30px 8px 22px',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(C.amber, 0.85)}`,
                background: alpha(C.amberDeep, 0.5),
                boxShadow: `0 0 28px ${alpha(C.amber, 0.25)}`,
                fontFamily: FONT.sans,
                fontSize: 42,
                fontWeight: 800,
                color: '#fde68a',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="gear" size={42} color={C.amber} />
              <span style={{ fontWeight: 650, color: C.text }}>{CAPACITY.label}</span>
              {CAPACITY.value}
            </div>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

function Dot() {
  return <span style={{ fontWeight: 700, fontSize: 34, color: C.faint }}>·</span>;
}

/** An empty slot where a row will land. */
function SlotRow({ width, height }: { width: number; height: number }) {
  return <div style={{ width, height, boxSizing: 'border-box', borderRadius: RADIUS.md, border: `2px dashed ${alpha(C.ink600, 0.7)}` }} />;
}
