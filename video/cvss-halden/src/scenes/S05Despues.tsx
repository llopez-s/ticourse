import { useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Cursor, Icon, mix } from '../../../engine/src/ui';
import { BUTTONS, CLOSED, METHOD, RESCAN, ROW, SIGN, VERDICT } from '../data/s05-despues';
import { TIMELINE } from '../timeline/load';
import { QueueRow, ScoreBadge } from './parts/Finding';
import { HostConsole } from './parts/HostConsole';
import { Hull, hullPoint, hullSize } from './parts/Hull';
import { Stage, wordFrame } from './kit';

const S = 's05-despues';
const W = STAGE.width;

// ---- The block (report strip, row, Sistemas note / method line, the two buttons) moves as one.
const BLOCK_W = 1680;
const BLOCK_X = (W - BLOCK_W) / 2;
const STRIP_Y = 0;
const ROW_Y = 66;
const ROW_H = 112;
const NOTE_Y = ROW_Y + ROW_H + 10;
const BTN_Y = 250;
const BTN_W = 560;
const BTN_H = 96;
const BTN_X = [(BLOCK_W - 2 * BTN_W - 40) / 2, (BLOCK_W - 2 * BTN_W - 40) / 2 + BTN_W + 40] as const;
/** Block top: A (before the question), B (under the think card, whose slot is stage y 10–175), C (after the answer). */
const TOP_A = 60;
const TOP_B = 196;
const TOP_C = -58;

// ---- C: the console, the sign and the hull.
const CON_X = 0;
const CON_Y = 204;
const CON_W = 1100;
const COL_X = 1124;
const COL_W = 604;
const CALL_Y = 204;
const HULL_W = 420;
const HULL_X = COL_X + (COL_W - HULL_W) / 2;
const HULL_Y = 392;
const LABEL_Y = 584;
const VERDICT_Y = 580;

/** The think prompt's window in this scene's local frames (from the timeline). */
function thinkWindow(): { from: number; to: number } {
  const e = TIMELINE.think.find((t) => t.scene === S);
  if (!e) return { from: Number.POSITIVE_INFINITY, to: Number.NEGATIVE_INFINITY };
  const origin = sceneTiming(TIMELINE, S).from - enterFramesFor(TIMELINE, S);
  return { from: e.from - origin, to: e.from + e.durationInFrames - origin };
}

/**
 * s05-despues «Después del parche». On `rescan` Monday's strip arrives; on `still` the row of `srv-msg01` is back in the
 * list («detectada de nuevo») with Sistemas' note. On `question` the two buttons arrive and the think card takes the
 * top: the row stays still — no method, no version, no label that answers. «Comprobar»: the cursor clicks «comprobar la
 * versión»; on `version` the row's method appears («comprobación remota del servicio, sin sesión · versión que anuncia:
 * msgq/3.1.4»). On `running` the machine's console (`msgq --version`: 3.1.7; the change log from before the patch; the
 * package; the service active since 1-10 18:12, no reboot missing). On `banner` the banner is zoomed («texto de la
 * configuración · nadie lo cambió») over the same hull, patched, with its bilge dry: «el escáner leía el letrero, no el
 * servicio». `false-positive`: FALSE POSITIVE, documentado; `fix`: Sistemas corrige el texto · 5-10. `closed`: the row
 * turns emerald and the seal «cerrado · con prueba» lands (sfx «check»).
 */
export function S05Despues(props: SceneProps) {
  const frame = useCurrentFrame();
  const rescanAt = props.cue('rescan');
  const stillAt = props.cue('still');
  const questionAt = props.cue('question');
  const versionAt = props.cue('version');
  const runningAt = props.cue('running');
  const bannerAt = props.cue('banner');
  const fpAt = props.cue('false-positive');
  const fixAt = props.cue('fix');
  const closedAt = props.cue('closed');
  const think = thinkWindow();
  const clickAt = wordFrame(S, 's05-03', 'Comprobar') + 2;

  // ---- Block position.
  const down = progress(frame, think.from - 30, 22, EASE.inOut);
  const up = progress(frame, clickAt + 10, 26, EASE.inOut);
  const blockTop = mix(mix(TOP_A, TOP_B, down), TOP_C, up);
  const stripOut = 1 - progress(frame, clickAt + 14, 16);

  // ---- A: the strip and the row.
  const stripIn = enter(frame, rescanAt - 4, { distance: 16, duration: 16 });
  const rowIn = springIn(frame, 30, stillAt - 6, { damping: 16 });
  const noteAt = Math.min(wordFrame(S, 's05-01', 'Sistemas') - 6, stillAt + 40);
  const noteIn = enter(frame, noteAt, { distance: 12, duration: 14 });
  const noteOut = 1 - progress(frame, versionAt - 14, 12);

  // ---- B: the two buttons; the click.
  const btnIn = [progress(frame, questionAt, 14), progress(frame, questionAt + 8, 14)];
  const pick = progress(frame, clickAt, 10);
  const btnOut = progress(frame, versionAt - 6, 14, EASE.inOut);
  const hold = think.from < Number.POSITIVE_INFINITY ? Math.max(0, Math.min(1, (frame - think.from) / 20)) * (1 - pick) : 0;
  const pulseB = hold * (0.5 + 0.5 * Math.sin(frame * 0.17));

  // ---- C: the method; the console; the sign and hull; the verdict; the close.
  const methodIn = enter(frame, versionAt, { distance: 12, duration: 14 });
  const announceAt = wordFrame(S, 's05-03', 'anuncia') - 8;
  const bannerHot = progress(frame, announceAt, 12);
  const sessionHot = progress(frame, wordFrame(S, 's05-03', 'credenciales') - 6, 12) * (1 - progress(frame, announceAt - 6, 12));
  const conAt = {
    cmd: runningAt - 6,
    version: runningAt + 34,
    changes: wordFrame(S, 's05-04', 'versión') - 6,
    pkg: wordFrame(S, 's05-04', 'nueva') - 4,
    service: wordFrame(S, 's05-04', 'falta') - 14,
    noReboot: wordFrame(S, 's05-04', 'reinicio') - 16,
  };
  const conIn = progress(frame, runningAt - 12, 14);
  const signAt = wordFrame(S, 's05-04', 'letrero') - 10;
  const callIn = springIn(frame, 30, bannerAt - 2, { damping: 16 });
  const callNote = progress(frame, signAt, 14);
  const hullIn = progress(frame, signAt, 22);
  const casco0 = wordFrame(S, 's05-04', 'casco', 0) - 4;
  const casco1 = wordFrame(S, 's05-04', 'casco', 1) - 4;
  const signGlow = progress(frame, casco0, 12) * (1 - progress(frame, casco1 - 4, 12));
  const realGlow = progress(frame, casco1, 14);
  const labelIn = progress(frame, bannerAt + 30, 14) * (1 - progress(frame, fpAt - 6, 12));
  const conDim = 0.45 * progress(frame, bannerAt, 16);
  const fpIn = springIn(frame, 30, fpAt - 2, { damping: 14 });
  const docAt = progress(frame, wordFrame(S, 's05-05', 'documenta') - 6, 12);
  const fixIn = enter(frame, fixAt - 4, { distance: 12, duration: 14 });
  const closed = springIn(frame, 30, closedAt - 2, { damping: 13 });
  const closedOn = closed > 0.3;
  const rowTone = closedOn ? { fg: C.emerald, soft: '#a7f3d0', deep: C.emeraldDeep } : undefined;
  const dimAll = 0.4 * progress(frame, closedAt + 4, 20);

  const hs = hullSize(HULL_W);
  const sign = hullPoint(HULL_W, 'sign');

  return (
    <Stage>
      {/* ================= the block ================= */}
      <div style={{ position: 'absolute', left: BLOCK_X, top: blockTop, width: BLOCK_W }}>
        {/* Monday's strip */}
        {frame >= rescanAt - 6 && stripOut > 0.01 ? (
          <div style={{ ...stripIn, opacity: stripIn.opacity * stripOut, position: 'absolute', left: 0, top: STRIP_Y, height: 58, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
            <Icon name="clock" size={36} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, fontSize: 38, color: C.cyanSoft }}>{RESCAN.day}</span>
            <span style={{ fontWeight: 700, fontSize: 36, color: C.faint }}>·</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 38, color: C.text }}>{RESCAN.time}</span>
            <span style={{ fontWeight: 700, fontSize: 36, color: C.faint }}>·</span>
            <span style={{ fontWeight: 850, fontSize: 40, color: C.textStrong }}>{RESCAN.what}</span>
          </div>
        ) : null}

        {/* the row, back in the list */}
        {rowIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: ROW_Y, opacity: Math.min(1, rowIn * 1.4), transform: `translateY(${(1 - Math.min(1, rowIn)) * 24}px)` }}>
            <QueueRow
              width={BLOCK_W}
              height={ROW_H}
              host={ROW.host}
              sev="CRITICAL"
              lit={1}
              hostSize={46}
              toneColors={rowTone}
              right={
                closedOn ? (
                  <div style={{ transform: `rotate(-3deg) scale(${1.35 - 0.35 * Math.min(1, closed)})`, opacity: Math.min(1, closed * 1.5), display: 'inline-flex', alignItems: 'center', gap: 14, padding: '6px 24px 6px 16px', borderRadius: RADIUS.md, border: `5px solid ${C.emerald}`, background: alpha(C.emeraldDeep, 0.85), fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, letterSpacing: 1, color: '#a7f3d0', whiteSpace: 'nowrap' }}>
                    <Icon name="check" size={42} color={C.emerald} strokeWidth={3.4} />
                    {CLOSED.stamp}
                  </div>
                ) : (
                  <ScoreBadge score="9.8" sev="CRITICAL" size={50} withSev={false} lit={0.8} />
                )
              }
            >
              <span style={{ fontFamily: FONT.mono, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{ROW.cve}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '4px 20px 4px 14px',
                  borderRadius: RADIUS.pill,
                  border: `3px solid ${alpha(closedOn ? C.emerald : C.amber, 0.85)}`,
                  background: alpha(closedOn ? C.emeraldDeep : C.amberDeep, 0.6),
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 800,
                  color: closedOn ? '#a7f3d0' : '#fde68a',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={closedOn ? 'check' : 'alert'} size={36} color={closedOn ? C.emerald : C.amber} />
                {closedOn ? CLOSED.rescan : ROW.again}
              </span>
            </QueueRow>
          </div>
        ) : null}

        {/* Sistemas' note, until the method takes its place */}
        {frame >= noteAt - 2 && noteOut > 0.01 ? (
          <div style={{ ...noteIn, opacity: noteIn.opacity * noteOut, position: 'absolute', left: 0, top: NOTE_Y, height: 52, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 38, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
            <Icon name="gear" size={38} color={C.sky} />
            {ROW.patched}
          </div>
        ) : null}

        {/* the method: only once the voice says it */}
        {frame >= versionAt - 2 ? (
          <div style={{ ...methodIn, position: 'absolute', left: 0, top: NOTE_Y, height: 52, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 36, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>
            <Icon name="radar" size={38} color={C.amber} />
            <span style={{ color: sessionHot > 0.5 ? '#fde68a' : C.text, textDecoration: sessionHot > 0.05 ? `underline ${alpha(C.amber, 0.9 * sessionHot)} 4px` : undefined, textUnderlineOffset: 8 }}>{METHOD.how}</span>
            <span style={{ color: C.faint }}>·</span>
            <span style={{ color: C.muted }}>{METHOD.announces}</span>
            <span style={{ fontFamily: FONT.mono, fontWeight: 850, color: '#fcd34d', padding: '0 10px', borderRadius: 8, background: alpha(C.amber, 0.12 + 0.2 * bannerHot), boxShadow: bannerHot > 0.05 ? `0 0 ${Math.round(22 * bannerHot)}px ${alpha(C.amber, 0.4 * bannerHot)}` : undefined }}>{METHOD.banner}</span>
          </div>
        ) : null}

        {/* the two buttons of the think prompt */}
        {btnOut < 1 && btnIn[0] > 0.01 ? (
          <>
            {BUTTONS.map((b, i) => {
              const chosen = i === 1;
              const lit = chosen ? pick : 0;
              const dimB = chosen ? 0 : 0.55 * pick;
              return (
                <div
                  key={b}
                  style={{
                    position: 'absolute',
                    left: BTN_X[i],
                    top: BTN_Y,
                    width: BTN_W,
                    height: BTN_H,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    borderRadius: RADIUS.lg,
                    border: `3px solid ${chosen && lit > 0.05 ? C.emerald : alpha(C.cyan, 0.55 + 0.3 * pulseB)}`,
                    background: chosen && lit > 0.05 ? alpha(C.emeraldDeep, 0.7) : alpha(C.cyan, 0.07 + 0.05 * pulseB),
                    boxShadow: chosen && lit > 0.05 ? `0 0 ${Math.round(32 * lit)}px ${alpha(C.emerald, 0.4 * lit)}` : undefined,
                    fontFamily: FONT.sans,
                    fontSize: 44,
                    fontWeight: 850,
                    color: C.textStrong,
                    whiteSpace: 'nowrap',
                    opacity: btnIn[i] * (1 - btnOut) * (1 - dimB),
                    transform: `translateY(${(1 - btnIn[i]) * 18}px) scale(${1 + 0.03 * lit})`,
                  }}
                >
                  <Icon name={chosen ? 'search' : 'gear'} size={44} color={chosen && lit > 0.05 ? C.emerald : C.cyan} />
                  {b}
                </div>
              );
            })}
            <div style={{ opacity: 1 - btnOut }}>
              <Cursor
                frame={frame}
                path={[
                  { x: BTN_X[1] + BTN_W + 90, y: BTN_Y + 150, at: clickAt - 40 },
                  { x: BTN_X[1] + BTN_W * 0.62, y: BTN_Y + BTN_H * 0.62, at: clickAt, click: true },
                ]}
              />
            </div>
          </>
        ) : null}
      </div>

      {/* ================= C: the machine's console ================= */}
      {conIn > 0.01 ? (
        <div style={{ position: 'absolute', left: CON_X, top: CON_Y, opacity: conIn, transform: `translateY(${(1 - conIn) * 20}px)` }}>
          <HostConsole width={CON_W} at={conAt} dim={Math.max(conDim, dimAll)} />
        </div>
      ) : null}

      {/* ================= C: the sign, zoomed, over the same hull ================= */}
      {callIn > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: COL_X, top: CALL_Y, width: COL_W, opacity: Math.min(1, callIn * 1.4) * (1 - dimAll), transform: `translateY(${(1 - Math.min(1, callIn)) * 20}px)`, fontFamily: FONT.sans }}>
            <div style={{ boxSizing: 'border-box', padding: '12px 22px 14px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.85)}`, background: alpha(C.amberDeep, 0.35), boxShadow: `0 0 30px ${alpha(C.amber, 0.22)}` }}>
              <div style={{ display: 'inline-block', padding: '2px 26px', borderRadius: 10, background: '#f1f5f9', border: '4px solid #64748b', fontFamily: FONT.mono, fontSize: 60, fontWeight: 850, color: '#0f172a', whiteSpace: 'nowrap' }}>{SIGN.banner}</div>
              <div style={{ marginTop: 10, fontSize: 32, fontWeight: 650, lineHeight: 1.22, color: C.text, opacity: callNote }}>{SIGN.note}</div>
            </div>
          </div>
          {hullIn > 0.01 ? (
            <div style={{ position: 'absolute', left: HULL_X, top: HULL_Y, width: HULL_W, height: hs.h, opacity: hullIn * (1 - dimAll * 0.8) }}>
              <Hull width={HULL_W} sea={1} storm={0} hole={1} patch={1} bilge={0.5 + 0.5 * realGlow} bilgeOk={1} sign={SIGN.banner} />
              <div style={{ position: 'absolute', left: sign.x - 86, top: sign.y - 28, width: 172, height: 56, borderRadius: 10, border: `4px solid ${alpha(C.amber, 0.95 * signGlow)}`, boxShadow: `0 0 ${Math.round(26 * signGlow)}px ${alpha(C.amber, 0.6 * signGlow)}`, opacity: signGlow }} />
            </div>
          ) : null}
          {hullIn > 0.01 ? (
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width={1} height={1}>
              <path d={`M ${COL_X + COL_W * 0.78} ${CALL_Y + 138} L ${HULL_X + sign.x} ${HULL_Y + sign.y - 30}`} stroke={alpha(C.amber, 0.85 * hullIn)} strokeWidth={4} strokeDasharray="3 9" fill="none" />
            </svg>
          ) : null}
        </>
      ) : null}

      {/* the label that says what the scanner read */}
      {labelIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: LABEL_Y, width: W, opacity: labelIn, transform: `translateY(${(1 - labelIn) * 10}px)`, fontFamily: FONT.sans, fontSize: 42, fontWeight: 850, color: '#fde68a', whiteSpace: 'nowrap', textAlign: 'center' }}>{SIGN.label}</div>
      ) : null}

      {/* the verdict, and who fixes the text */}
      {fpIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: VERDICT_Y, width: W, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <span
            style={{
              padding: '4px 26px',
              borderRadius: RADIUS.md,
              border: `5px solid ${C.violet}`,
              background: alpha(C.violetDeep, 0.8),
              color: '#ddd6fe',
              fontSize: 46,
              fontWeight: 900,
              letterSpacing: 3,
              transform: `rotate(-2deg) scale(${1.3 - 0.3 * Math.min(1, fpIn)})`,
              opacity: Math.min(1, fpIn * 1.5),
            }}
          >
            {VERDICT.stamp}
          </span>
          <span style={{ fontSize: 40, fontWeight: 750, color: '#c4b5fd', opacity: docAt }}>{VERDICT.sub}</span>
          {frame >= fixAt - 6 ? (
            <span style={{ ...fixIn, display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 40, fontWeight: 750, color: C.text }}>
              <span style={{ color: C.faint }}>·</span>
              <Icon name="gear" size={40} color={C.sky} />
              {VERDICT.fix}
            </span>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}
