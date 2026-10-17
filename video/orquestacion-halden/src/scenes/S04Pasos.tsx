import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { ACCESS, CONFIRMED, ESCALATION, FLOW, NOTED, QUEUE, RAISED, SESSION, TICKET_CREATION, minutesLabel } from '../data/s04-pasos';
import { TIMELINE } from '../timeline/load';
import { Arrow, Diamond, FlowNode } from './parts/Flow';
import { BELL, HospitalBell } from './parts/HospitalBell';
import { ImageTag, Pill, TermPill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's04-pasos';

// ---- Left column: the compact flow, «no» branch (outside the intercept's band, x < 400).
// It sits low: SILENT PAGER's card spans stage-local x ~160–1570 at the top, so nothing essential goes above y 160.
const N1 = { x: 0, y: 170, w: 360, h: 76 };
const N2 = { x: 0, y: 274, w: 360, h: 100 };
const D = { x: 20, y: 404, w: 320, h: 124 };
// ---- Centre: the term area (top, x 420–1160) and the SOC queue (below the intercept's band).
const TERM_X = 420;
const TERM_Y = 16;
const SUB_Y = 104;
const Q = { x: 430, y: 252, w: 720, h: 360 };
const HEAD_H = 60;
const ROW_Y = HEAD_H + 14;
const ROW_H = 118;
const OLD_ROWS = 3;
// ---- Right column: the hospital bell.
const RIGHT_X = 1190;
const RIGHT_W = 538;
const BELL_Y = 166;
const BELL_H = (RIGHT_W * BELL.h) / BELL.w;

/** The intercepted message's window in this scene's local frames (from the timeline). */
function interceptWindow(): { from: number; to: number } {
  const e = TIMELINE.intercept?.find((i) => i.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/**
 * s04-pasos «Un caso que nadie coge». On `queue` the flow of s02 comes back on the left, compact, at night: «el EDR
 * avisa», «proveedor de identidad», the diamond «¿riesgo alto?», and this time the «no» branch lights (the «sí» one
 * stays a grey stub) and runs into the SOC queue. On `ticket` the new case lands in the queue with its relative mark
 * «+00:00» — named «Ticket creation» on its word, «queda apuntado». On `minutes` «sin asignar» and, top-right, an
 * amber ring counting «hace N min» up to fifteen. While SILENT PAGER's message is on screen (engine card, window from
 * the timeline) the top-centre stays empty. On `bell` the hospital bell comes in on the right («imagen · no es del
 * puerto»): the lamp over the door lights; on `station` it rings at the nurses' station. On `escalate`, at fifteen, the
 * case turns «prioridad alta», a bell «avisa a la guardia», named «Escalation». On `cut`, the third piece: «enabling/
 * disabling services and access» with «tras confirmar la analista», and the account's three sessions switched off.
 */
export function S04Pasos(props: SceneProps) {
  const frame = useCurrentFrame();
  const queueAt = props.cue('queue');
  const ticketAt = props.cue('ticket');
  const minutesAt = props.cue('minutes');
  const bellAt = props.cue('bell');
  const stationAt = props.cue('station');
  const escAt = props.cue('escalate');
  const cutAt = props.cue('cut');
  const ticketWord = wordFrame(S, 's04-01', 'creation') - 6;
  const escWord = wordFrame(S, 's04-05', 'escalation') - 6;
  const accessWord = wordFrame(S, 's04-06', 'enabling') - 6;
  const ic = interceptWindow();

  // ---- Left: the flow
  const n1In = progress(frame, queueAt - 4, 14);
  const n2In = progress(frame, queueAt + 6, 14);
  const dIn = progress(frame, queueAt + 16, 14);
  const noDraw = progress(frame, queueAt + 34, 16);
  const flowDim = 1 - 0.35 * progress(frame, ticketAt + 20, 20);

  // ---- Term area (top-centre): out before the intercepted message, back after it.
  const termClear = progress(frame, ic.from - 14, 12, EASE.inOut) * (1 - progress(frame, ic.to - 2, 8));
  const ticketIn = progress(frame, ticketWord, 12) * (1 - progress(frame, ic.from - 14, 12, EASE.inOut));
  const notedIn = progress(frame, ticketWord + 16, 12) * (1 - progress(frame, ic.from - 14, 12, EASE.inOut));
  const escIn = progress(frame, escWord, 12) * (1 - progress(frame, cutAt - 10, 12, EASE.inOut));
  const raisedIn = progress(frame, escAt + 6, 12) * (1 - progress(frame, cutAt - 10, 12, EASE.inOut));
  const accessIn = progress(frame, Math.min(accessWord, cutAt + 40), 14);
  const confirmIn = progress(frame, cutAt - 2, 12);
  const sessIn = progress(frame, cutAt + 6, 12);
  const sessOff = (k: number) => progress(frame, Math.max(accessWord, cutAt + 30) + 10 + k * 8, 10);

  // ---- Queue
  const panelIn = progress(frame, queueAt + 30, 16);
  const rowIn = enter(frame, ticketAt, { distance: -24, duration: 16 });
  const unassignedIn = progress(frame, minutesAt, 12);
  const high = progress(frame, escAt, 12);

  // ---- Counter (queue header): 0 to 15 between `minutes` and `escalate`.
  const counterIn = progress(frame, minutesAt - 2, 14);
  const mins = Math.min(15, Math.floor(15 * progress(frame, minutesAt, escAt - minutesAt, EASE.linear) + 1e-6));
  const ringFill = Math.min(1, mins / 15);
  const ringTone = high > 0.5 ? C.rose : C.amber;

  // ---- Bell
  const bellIn = progress(frame, bellAt - 4, 16);
  const door = progress(frame, wordFrame(S, 's04-04', 'luz') - 6, 12);
  const station = progress(frame, stationAt + 4, 12);

  const R = 40;
  const ringLen = 2 * Math.PI * R;

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* ---------- Left: the flow, «no» branch ---------- */}
        <svg width={420} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: flowDim }}>
          <Arrow points={[[180, N1.y + N1.h + 2], [180, N2.y - 4]]} draw={progress(frame, queueAt + 4, 10)} width={3} />
          <Arrow points={[[180, N2.y + N2.h + 2], [180, D.y - 2]]} draw={progress(frame, queueAt + 14, 10)} width={3} />
          <Arrow points={[[180, D.y + D.h], [180, D.y + D.h + 56]]} draw={progress(frame, queueAt + 30, 10)} color={C.faint} width={3} dashed />
          <Arrow points={[[D.x + D.w, D.y + D.h / 2], [392, D.y + D.h / 2], [392, Q.y + ROW_Y + 56], [Q.x - 6, Q.y + ROW_Y + 56]]} draw={noDraw} width={4} />
        </svg>
        <div style={{ position: 'absolute', left: N1.x, top: N1.y, opacity: n1In * flowDim }}>
          <FlowNode w={N1.w} h={N1.h} title={FLOW.edr} icon="shield" tone={C.sky} on={0.6} />
        </div>
        <div style={{ position: 'absolute', left: N2.x, top: N2.y, opacity: n2In * flowDim }}>
          <FlowNode w={N2.w} h={N2.h} title={FLOW.idp} icon="user" tone={C.sky} on={0.6} />
        </div>
        <div style={{ position: 'absolute', left: D.x, top: D.y, opacity: dIn * flowDim }}>
          <Diamond w={D.w} h={D.h} text={FLOW.risk} on={0.7} />
        </div>
        {noDraw > 0.5 ? (
          <>
            <div style={{ position: 'absolute', left: 346, top: D.y + D.h / 2 + 6, fontSize: 32, fontWeight: 800, color: C.cyan, opacity: progress(frame, queueAt + 40, 10) * flowDim }}>{FLOW.no}</div>
            <div style={{ position: 'absolute', left: 196, top: D.y + D.h + 14, fontSize: 32, fontWeight: 700, color: C.faint, opacity: progress(frame, queueAt + 40, 10) * flowDim }}>{FLOW.yes}</div>
          </>
        ) : null}

        {/* ---------- Term area (top-centre) ---------- */}
        {termClear < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - termClear }}>
            {ticketIn > 0.01 ? (
              <div style={{ position: 'absolute', left: TERM_X, top: TERM_Y, opacity: ticketIn, transform: `translateY(${(1 - ticketIn) * 12}px)` }}>
                <TermPill text={TICKET_CREATION} on={ticketIn} />
              </div>
            ) : null}
            {notedIn > 0.01 ? (
              <div style={{ position: 'absolute', left: TERM_X, top: SUB_Y, opacity: notedIn }}>
                <Pill text={NOTED} icon="archive" tone={C.cyan} size={34} height={58} on={0.6} />
              </div>
            ) : null}
            {escIn > 0.01 ? (
              <div style={{ position: 'absolute', left: TERM_X, top: TERM_Y, opacity: escIn, transform: `translateY(${(1 - escIn) * 12}px)` }}>
                <TermPill text={ESCALATION} on={escIn} />
              </div>
            ) : null}
            {raisedIn > 0.01 ? (
              <div style={{ position: 'absolute', left: TERM_X, top: SUB_Y, opacity: raisedIn }}>
                <Pill text={RAISED} icon="bell" tone={C.rose} size={34} height={58} on={0.6} />
              </div>
            ) : null}
            {accessIn > 0.01 ? (
              <div style={{ position: 'absolute', left: TERM_X, top: TERM_Y, opacity: accessIn, transform: `translateY(${(1 - accessIn) * 12}px)` }}>
                <TermPill text={ACCESS} on={accessIn} size={38} />
              </div>
            ) : null}
            {confirmIn > 0.01 ? (
              <div style={{ position: 'absolute', left: TERM_X, top: SUB_Y, opacity: confirmIn }}>
                <Pill text={CONFIRMED} icon="user" tone={C.emerald} size={34} height={58} on={0.6} />
              </div>
            ) : null}
            {sessIn > 0.01 ? (
              <div style={{ position: 'absolute', left: TERM_X + 520, top: SUB_Y, display: 'flex', gap: 12, opacity: sessIn }}>
                {[0, 1, 2].map((k) => {
                  const off = sessOff(k);
                  return (
                    <div
                      key={k}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        height: 58,
                        padding: '0 18px 0 14px',
                        boxSizing: 'border-box',
                        borderRadius: RADIUS.pill,
                        border: `2px solid ${off > 0.5 ? alpha(C.faint, 0.7) : alpha(C.sky, 0.7)}`,
                        background: off > 0.5 ? alpha(C.ink800, 0.9) : alpha(C.sky, 0.1),
                        fontSize: 32,
                        fontWeight: 700,
                        color: off > 0.5 ? C.faint : C.textStrong,
                        textDecoration: off > 0.5 ? 'line-through' : undefined,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Icon name="power" size={30} color={off > 0.5 ? C.rose : C.sky} />
                      {SESSION}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- The SOC queue ---------- */}
        {panelIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: Q.x,
              top: Q.y,
              width: Q.w,
              height: Q.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.sky, 0.5)}`,
              background: C.ink850,
              overflow: 'hidden',
              opacity: panelIn,
            }}
          >
            <div style={{ height: HEAD_H, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', background: alpha(C.sky, 0.1), fontSize: 32, fontWeight: 800, color: C.textStrong }}>
              <Icon name="archive" size={32} color={C.sky} />
              {QUEUE.title}
              {counterIn > 0.01 ? (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, opacity: counterIn }}>
                  <svg width={44} height={44} viewBox="0 0 100 100">
                    <circle cx={50} cy={50} r={R} fill={C.ink900} stroke={alpha(C.text, 0.15)} strokeWidth={14} />
                    <circle cx={50} cy={50} r={R} fill="none" stroke={ringTone} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${ringLen * ringFill} ${ringLen}`} transform="rotate(-90 50 50)" />
                  </svg>
                  <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: ringTone, whiteSpace: 'nowrap' }}>{minutesLabel(mins)}</span>
                </div>
              ) : null}
            </div>
            {/* older, closed cases: texture */}
            {Array.from({ length: OLD_ROWS }, (_, k) => (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  top: ROW_Y + ROW_H + 14 + k * 54,
                  height: 44,
                  borderRadius: 8,
                  background: alpha(C.ink800, 0.8),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '0 16px',
                  opacity: 0.6,
                }}
              >
                <div style={{ width: 14, height: 14, borderRadius: 7, background: alpha(C.emerald, 0.6) }} />
                <div style={{ height: 12, width: [300, 240, 280][k], borderRadius: 6, background: alpha(C.text, 0.18) }} />
                <div style={{ marginLeft: 'auto', height: 12, width: 90, borderRadius: 6, background: alpha(C.text, 0.12) }} />
              </div>
            ))}
            {/* the new case */}
            {frame >= ticketAt - 2 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  top: ROW_Y,
                  height: ROW_H,
                  boxSizing: 'border-box',
                  borderRadius: 12,
                  border: `3px solid ${high > 0.5 ? C.rose : C.cyan}`,
                  background: high > 0.5 ? alpha(C.rose, 0.1) : alpha(C.cyan, 0.08),
                  boxShadow: `0 0 ${Math.round(16 + 14 * high)}px ${alpha(high > 0.5 ? C.rose : C.cyan, 0.3)}`,
                  padding: '10px 18px',
                  ...rowIn,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 34, fontWeight: 800, color: C.textStrong }}>
                  <Icon name="archive" size={34} color={high > 0.5 ? C.rose : C.cyan} />
                  {QUEUE.row}
                  <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.cyanSoft }}>{QUEUE.mark}</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 14, height: 44 }}>
                  {unassignedIn > 0.01 && high < 0.5 ? (
                    <div style={{ opacity: unassignedIn }}>
                      <Pill text={QUEUE.unassigned} icon="user" tone={C.amber} size={30} height={44} on={0.5} />
                    </div>
                  ) : null}
                  {high > 0.01 ? (
                    <>
                      <div style={{ opacity: high }}>
                        <Pill text={QUEUE.high} icon="alert" tone={C.rose} size={30} height={44} on={0.8} />
                      </div>
                      <div style={{ opacity: progress(frame, escAt + 10, 12) }}>
                        <Pill text={QUEUE.oncall} icon="bell" tone={C.rose} size={30} height={44} on={0.5} />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- Right: the hospital bell ---------- */}
        {bellIn > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: RIGHT_X, top: BELL_Y, opacity: bellIn, transform: `translateY(${(1 - bellIn) * 16}px)` }}>
              <HospitalBell width={RIGHT_W} door={door} station={station} frame={frame} />
            </div>
            <div style={{ position: 'absolute', left: RIGHT_X + 20, top: BELL_Y + BELL_H + 18, opacity: bellIn }}>
              <ImageTag />
            </div>
          </>
        ) : null}
      </div>
    </Stage>
  );
}
