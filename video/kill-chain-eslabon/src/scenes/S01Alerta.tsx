import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { ALERT } from '../data/alert';
import { CONTEXT, PROMISE, TITLE } from '../data/s01-alerta';
import { AlertCard, alertCardSize } from './parts/AlertCard';
import { CALENDAR_W, Calendar } from './parts/s01-alerta/Calendar';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-alerta';
const W = STAGE.width;

// ---- The alert: big and centred, then smaller on the left under the title.
const CARD = alertCardSize('full', 1240);
const CARD_A = { x: (W - CARD.width) / 2, y: (STAGE.height - CARD.height) / 2 - 20, k: 1 };
const CARD_B = { x: 10, y: 166, k: 0.62 };
/** Between the title and the promise the small card waits in the middle (no empty half). */
const CARD_MID_X = (W - CARD.width * CARD_B.k) / 2;
const Q_Y = CARD_B.y + CARD.height * CARD_B.k + 26;

// ---- Title (top), promise chips (right column), context strip (bottom), calendar (centre, on `back`).
const CHIPS_X = 880;
const CHIPS_Y = 176;
const CHIP_H = 66;
const CHIP_GAP = 20;
const STRIP_Y = 566;
const CAL_Y = 196;

/**
 * s01-alerta «Una llamada que nadie esperaba». Meridian's SOC at night: the quiet console, then on `alert` the 5-3
 * card lands — «05-03-2026 · 02:13 UTC», ENG-WS-041 «ingeniería de propulsión» on «estación», the «llama a» link and
 * update-svc-cdn.com on «llama», «dominio desconocido» on «nadie». Before 10 s (`title`) the card steps back to the
 * left and the title lands on top, «La Cyber Kill Chain» / «basta con romper un eslabón»; «¿qué le queda por hacer?»
 * appears under the card on «queda». The promise, three chips on their words (`promise`); the context strip with
 * s01-04; on `back` the rest leaves and a calendar walks back from the alert day to «lunes 02-03» on «lunes» —
 * the last frame: title, calendar, strip.
 */
export function S01Alerta(props: SceneProps) {
  const frame = useCurrentFrame();
  const alertAt = props.cue('alert');
  const titleCue = props.cue('title');
  const promiseAt = props.cue('promise');
  const backAt = props.cue('back');
  const s04 = segment(props, 's01-04');

  // ---- The card's pieces land on the words that name them (clamped so audio mode cannot reorder them).
  const hostAt = Math.max(alertAt + 6, wordFrame(S, 's01-01', 'estación') - 4);
  const linkAt = Math.max(hostAt + 8, wordFrame(S, 's01-01', 'llama') - 4);
  const domainAt = Math.max(linkAt + 8, wordFrame(S, 's01-01', 'dominio') - 4);
  const unknownAt = Math.max(domainAt + 6, wordFrame(S, 's01-01', 'nadie') - 4);

  // ---- Title before 10 s, whatever the voice does.
  const titleAt = Math.min(titleCue - 6, 10 * 30 - 22);
  const move = progress(frame, titleAt - 10, 24, EASE.inOut);
  // ---- Promise chips on their words; the card makes room for them.
  const chipAt = PROMISE.map((p, i) => Math.max(promiseAt + i * 8, wordFrame(S, 's01-03', p.word) - 6));
  const chipEnd = s04.from;
  const aside = progress(frame, chipAt[0] - 16, 20, EASE.inOut);
  const card = {
    x: mix(CARD_A.x, mix(CARD_MID_X, CARD_B.x, aside), move),
    y: mix(CARD_A.y, CARD_B.y, move),
    k: mix(CARD_A.k, CARD_B.k, move),
  };
  const cardDim = 0.55 * progress(frame, titleAt - 4, 18, EASE.inOut);

  // ---- «¿qué le queda por hacer?» on «queda», lit while it is said.
  const qAt = Math.max(titleAt + 10, wordFrame(S, 's01-02', 'queda') - 6);
  const qGlow = windowWeight(frame, qAt, segment(props, 's01-02').to, { ramp: 12 });


  // ---- Context strip with s01-04, lit on «analista».
  const stripAt = s04.from - 6;
  const stripGlow = windowWeight(frame, wordFrame(S, 's01-04', 'analista') - 4, s04.to, { ramp: 12 });

  // ---- `back`: the card, the question and the chips leave; the calendar walks back to Monday.
  const leave = progress(frame, backAt - 8, 16, EASE.inOut);
  const landAt = Math.max(backAt + 30, wordFrame(S, 's01-05', 'lunes') - 2);

  return (
    <Stage>
      {/* Title */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', fontFamily: FONT.sans, ...enter(frame, titleAt, { distance: 22 }) }}>
          <div style={{ fontSize: 76, fontWeight: 850, letterSpacing: -1.6, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap' }}>{TITLE.main}</div>
          <div style={{ marginTop: 6, fontSize: 42, fontWeight: 750, lineHeight: 1.15, color: '#6ee7b7', whiteSpace: 'nowrap' }}>{TITLE.sub}</div>
        </div>
      ) : null}

      {/* The alert card */}
      {leave < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: card.x,
            top: card.y,
            transform: `scale(${card.k})`,
            transformOrigin: '0 0',
            opacity: 1 - leave,
          }}
        >
          <AlertCard variant="full" width={CARD.width} at={alertAt} hostAt={hostAt} linkAt={linkAt} domainAt={domainAt} unknownAt={unknownAt} dim={cardDim} />
        </div>
      ) : null}

      {/* «¿qué le queda por hacer?» under the card, at full size */}
      {frame >= qAt - 2 && leave < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: card.x,
            top: Q_Y,
            width: CARD.width * CARD_B.k,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 48,
            fontWeight: 850,
            letterSpacing: -0.6,
            lineHeight: 1.15,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: qGlow > 0.01 ? `0 0 ${Math.round(26 * qGlow)}px ${alpha(C.cyan, 0.6 * qGlow)}` : undefined,
            ...enter(frame, qAt, { distance: 14 }),
            opacity: progress(frame, qAt, 14) * (1 - leave),
          }}
        >
          {ALERT.question}
        </div>
      ) : null}

      {/* Promise: three chips, stacked on the right */}
      {frame >= chipAt[0] - 2 && leave < 1 ? (
        <div style={{ position: 'absolute', left: CHIPS_X, top: CHIPS_Y, width: W - CHIPS_X, opacity: 1 - leave }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 18, axis: 'x' });
            const lit = windowWeight(frame, chipAt[i], chipAt[i + 1] ?? chipEnd, { ramp: 10, lead: 0 });
            return (
              <div
                key={p.text}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: i * (CHIP_H + CHIP_GAP),
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  height: CHIP_H,
                  padding: '0 28px 0 20px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.45 + 0.45 * lit)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * lit),
                  boxShadow: lit > 0.02 ? `0 0 ${Math.round(24 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={36} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Calendar: back to Monday 02-03 */}
      {frame >= backAt - 4 ? (
        <div style={{ position: 'absolute', left: (W - CALENDAR_W) / 2, top: CAL_Y }}>
          <Calendar frame={frame} at={backAt} landAt={landAt} />
        </div>
      ) : null}

      {/* Context strip */}
      {frame >= stripAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: STRIP_Y, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, stripAt, { distance: 16 }) }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              height: 64,
              padding: '0 30px 0 20px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.cyan, 0.35 + 0.45 * stripGlow)}`,
              background: alpha(C.ink800, 0.92),
              boxShadow: stripGlow > 0.02 ? `0 0 ${Math.round(26 * stripGlow)}px ${alpha(C.cyan, 0.25 * stripGlow)}` : undefined,
              fontFamily: FONT.sans,
              fontSize: 34,
              fontWeight: 700,
              color: C.text,
              whiteSpace: 'nowrap',
              ...dimStyle(0.35 * progress(frame, backAt, 14) * (1 - stripGlow)),
            }}
          >
            <Icon name="user" size={36} color={C.cyan} />
            <span style={{ fontWeight: 850, color: C.cyanSoft }}>{CONTEXT.org}</span>
            <span style={{ color: C.faint }}>·</span>
            <span>{CONTEXT.sector}</span>
            <span style={{ color: C.faint }}>·</span>
            <span style={{ color: C.textStrong, fontWeight: 800 }}>{CONTEXT.you}</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
