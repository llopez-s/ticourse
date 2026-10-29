import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { ACCOUNT, CHRONO, EPHEMERAL_PORT, HOST, HOST_IP, INGREDIENT, PID, PROGRAM, UPLOAD_DST, type ChronoRow } from './parts/data';
import { CLOCK_RULE, CORRELATE, GAP_SECONDS, PORT_CALLOUT, QUESTION_LINES, SAME_CALLOUT, THREAD_HOST, THREAD_LABEL, THREAD_USER } from './parts/data-b';
import { CaseStamp } from './parts/CaseStamp';
import { CHRONO_GEO, chronoRowCenterY, chronoRowTop } from './parts/Chronology';
import { SourceTag } from './parts/Ruler';

const S = 's07-hilos';

// ---- Geometry (stage-local). Rows are the chronology's, unchanged; the fact column hosts the shared fields.
const HOST_COL = { x: 372, w: 280, h: 64 } as const;
const USER_COL = { x: 676, w: 200, h: 64 } as const;
const LABEL_COL = { x: 998, w: 364, h: 84 } as const;
/** The process number sits at the left edge of the fact area, on the two EDR rows (r3 and r4). */
const PID_COL = { x: 254, w: 96, h: 66 } as const;
const COL_X = { host: HOST_COL.x + HOST_COL.w / 2, user: USER_COL.x + USER_COL.w / 2, label: LABEL_COL.x + LABEL_COL.w / 2, pid: PID_COL.x + PID_COL.w / 2 } as const;
const FIELD_SIZE = 34;
const LABEL_SIZE = 30;
const PANEL = { x: 910, w: 452, top: 74 } as const;
const WIDE = { x: 392, w: 970 } as const;

const COLOR = { host: INGREDIENT.donde.color, user: INGREDIENT.quien.color, label: INGREDIENT.que.color, pid: INGREDIENT.cuando.color } as const;

/** Row of the chronology with the fact column turned off (`factOn`) so the shared fields can take its place. */
function FieldRow({ row, factOn, focus, dim }: { row: ChronoRow; factOn: number; focus: number; dim: number }) {
  const { cols, rowH } = CHRONO_GEO;
  const f = clamp01(focus);
  const d = clamp01(dim);
  return (
    <div
      style={{
        position: 'relative',
        width: CHRONO_GEO.width,
        height: rowH,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.cyan, 0.22 + 0.55 * f)}`,
        background: alpha(C.ink850, 0.96),
        boxShadow: f > 0.01 ? `0 0 ${16 + 22 * f}px ${alpha(C.cyan, 0.3 * f)}` : undefined,
        opacity: 1 - 0.55 * d,
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: cols.utc.w - 22, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 700, lineHeight: 1.1, color: C.emerald }}>{row.utc}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 500, lineHeight: 1.2, color: C.muted, marginTop: 2 }}>{row.original}</div>
      </div>
      <div style={{ position: 'absolute', left: cols.fact.x, top: 0, bottom: 0, width: cols.fact.w, display: 'flex', alignItems: 'center', opacity: clamp01(factOn), fontSize: 34, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>
        <span>
          {row.fact.map((p, i) =>
            p.mono ? (
              <span key={i} style={{ fontFamily: FONT.mono, fontWeight: 650, fontSize: 32, color: C.textStrong }}>
                {p.t}
              </span>
            ) : (
              <span key={i}>{p.t}</span>
            ),
          )}
        </span>
      </div>
      <div style={{ position: 'absolute', left: cols.source.x, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <SourceTag id={row.source} size={30} />
      </div>
    </div>
  );
}

/** A shared field as a chip: opaque (the thread passes behind it), bordered in the thread's colour. */
function FieldChip({
  x,
  y,
  w,
  h,
  color,
  on,
  glow = 0,
  children,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  on: number;
  glow?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const o = clamp01(on);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(color, 0.75 + 0.25 * clamp01(glow))}`,
        background: C.ink800,
        boxShadow: glow > 0.01 ? `0 0 ${14 + 18 * glow}px ${alpha(color, 0.4 * glow)}` : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT.mono,
        fontWeight: 700,
        color: C.textStrong,
        opacity: o,
        transform: `translateY(${(1 - o) * 14}px) scale(${0.94 + 0.06 * o})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Thread({ x, y1, y2, color, draw, dim = 0 }: { x: number; y1: number; y2: number; color: string; draw: number; dim?: number }) {
  const d = clamp01(draw);
  if (d < 0.01) return null;
  const yEnd = y1 + (y2 - y1) * d;
  return (
    <g opacity={1 - 0.65 * clamp01(dim)}>
      <line x1={x} y1={y1} x2={x} y2={yEnd} stroke={alpha(color, 0.3)} strokeWidth={22} strokeLinecap="round" />
      <line x1={x} y1={y1} x2={x} y2={yEnd} stroke={color} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
}

function CheckBadge({ x, y, on, color }: { x: number; y: number; on: number; color: string }) {
  const p = clamp01(on);
  if (p < 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        background: C.emerald,
        border: `3px solid ${C.ink950}`,
        boxShadow: `0 0 18px ${alpha(color, 0.6)}`,
        display: 'grid',
        placeItems: 'center',
        opacity: p,
        transform: `scale(${0.6 + 0.4 * p})`,
      }}
    >
      <Icon name="check" size={24} color={C.ink950} strokeWidth={3.4} />
    </div>
  );
}

/**
 * s07-hilos «Lo que une las líneas». The chronology stays; its fact column is replaced by the fields the sources
 * SHARE. `question`: the header asks «¿hablan de lo mismo?» and then names «campos que coinciden». `host` / `user`:
 * the same equipment name and account sit on the login, proxy and EDR rows and a coloured thread joins them (a
 * check lands on it). `label`: the EDR's connection and the firewall's carry the same origin and destination, joined
 * by a third thread. `port`: `52811` lights in both lines at once. `same` / `corr`: the connection ALLOW let through
 * was opened by that program, and that is correlating. `gap` / `clocks`: the two rows' hours are 7 s apart, with the
 * small ruler «segundos: habitual · minutos u horas enteras: revisa reloj o zona». The process number (`PID`) joins the two
 * EDR rows with a fourth thread at the left of the fact area (it lights on the word «proceso»). Everything stays above y 570.
 */
export function S07Hilos(props: SceneProps) {
  const frame = useCurrentFrame();
  const qAt = props.cue('question');
  const hostAt = props.cue('host');
  const userAt = props.cue('user');
  const labelAt = props.cue('label');
  const portAt = props.cue('port');
  const sameAt = props.cue('same');
  const corrAt = props.cue('corr');
  const gapAt = props.cue('gap');
  const clocksAt = props.cue('clocks');

  const fieldsAt = Math.max(qAt + 24, wordFrame(S, 's07-01', 'campos') - 6);
  const proxyAt = Math.max(hostAt + 10, wordFrame(S, 's07-02', 'proxy') - 6);
  const edrAt = Math.max(proxyAt + 10, wordFrame(S, 's07-02', 'edr') - 6);
  const fwAt = Math.max(labelAt + 10, wordFrame(S, 's07-04', 'cortafuegos') - 6);
  // The process number has no cue of its own: it lights on the word «proceso» (after the account, before the label).
  const pidAt = Math.max(userAt + 44, wordFrame(S, 's07-03', 'proceso') - 6);

  // header
  const hechoOn = 1 - progress(frame, qAt - 4, 10);
  const q1 = progress(frame, qAt - 2, 14) * (1 - progress(frame, fieldsAt - 4, 10));
  const q2 = progress(frame, fieldsAt - 2, 14) * (1 - progress(frame, hostAt - 8, 10));
  const hostHead = progress(frame, hostAt - 2, 14);
  const userHead = progress(frame, userAt - 2, 14);
  const labelHead = progress(frame, labelAt - 2, 14);

  const factOn = 1 - progress(frame, hostAt - 6, 16);
  const gapDim = progress(frame, gapAt - 6, 16);
  const rowFocus = (i: number) => (i >= 3 ? gapDim : 0);
  const rowDim = (i: number) => (i < 3 ? gapDim : 0);

  // chips and threads
  const hostChip = [progress(frame, hostAt + 2, 14), progress(frame, proxyAt, 14), progress(frame, edrAt, 14)];
  const userChip = [progress(frame, userAt + 2, 14), progress(frame, userAt + 10, 14), progress(frame, userAt + 18, 14)];
  const labelChip = [progress(frame, labelAt + 2, 14), progress(frame, fwAt, 14)];
  const pidChip = [progress(frame, pidAt, 14), progress(frame, pidAt + 12, 14)];
  const pidThread = progress(frame, pidAt + 8, 22, EASE.inOut);
  const hostThread = progress(frame, hostAt + 10, edrAt - hostAt + 14, EASE.inOut);
  const userThread = progress(frame, userAt + 6, 32, EASE.inOut);
  const labelThread = progress(frame, labelAt + 8, Math.max(24, fwAt - labelAt + 6), EASE.inOut);
  const hostCheck = progress(frame, edrAt + 16, 12);
  const userCheck = progress(frame, userAt + 30, 12);
  const labelCheck = progress(frame, fwAt + 14, 12);

  const portP = progress(frame, portAt, 14) * (1 - 0.7 * gapDim);

  // the call-outs
  const out = (until: number) => 1 - progress(frame, until - 6, 12);
  const portCard = progress(frame, portAt, 16) * out(sameAt);
  const sameCard = progress(frame, sameAt, 16) * out(gapAt);
  const corrCard = progress(frame, corrAt, 16) * out(gapAt);
  const gapCard = progress(frame, gapAt - 2, 18);
  const ruleCard = progress(frame, clocksAt - 2, 18);

  const rowTop = (i: number) => chronoRowTop(i);
  const chipTop = (i: number, h: number) => rowTop(i) + (CHRONO_GEO.rowH - h) / 2;

  const head = (text: string, cx: number, color: string, on: number): ReactNode => (
    <div style={{ position: 'absolute', left: cx - 190, top: 0, width: 380, height: CHRONO_GEO.headH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, letterSpacing: 1, color, opacity: on, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );

  return (
    <Stage>
      {/* header row */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: CHRONO_GEO.width, height: CHRONO_GEO.headH, fontFamily: FONT.sans, borderBottom: `2px solid ${alpha(C.cyan, 0.4)}` }}>
        <div style={{ position: 'absolute', left: 22, top: 0, height: CHRONO_GEO.headH, display: 'flex', alignItems: 'center', fontSize: 32, fontWeight: 800, letterSpacing: 1, color: C.cyanSoft }}>UTC</div>
        <div style={{ position: 'absolute', left: CHRONO_GEO.cols.fact.x, top: 0, height: CHRONO_GEO.headH, display: 'flex', alignItems: 'center', fontSize: 32, fontWeight: 800, letterSpacing: 1, color: C.cyanSoft, opacity: hechoOn }}>hecho</div>
        <div style={{ position: 'absolute', left: CHRONO_GEO.cols.fact.x, top: 0, height: CHRONO_GEO.headH, display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800, color: C.textStrong, opacity: q1, whiteSpace: 'nowrap' }}>{QUESTION_LINES[0]}</div>
        <div style={{ position: 'absolute', left: CHRONO_GEO.cols.fact.x, top: 0, height: CHRONO_GEO.headH, display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800, color: C.cyanSoft, opacity: q2, whiteSpace: 'nowrap' }}>{QUESTION_LINES[1]}</div>
        {head(THREAD_HOST, COL_X.host, COLOR.host, hostHead)}
        {head(THREAD_USER, COL_X.user, COLOR.user, userHead)}
        {head(THREAD_LABEL, COL_X.label, COLOR.label, labelHead)}
        <div style={{ position: 'absolute', left: CHRONO_GEO.cols.source.x, top: 0, height: CHRONO_GEO.headH, display: 'flex', alignItems: 'center', fontSize: 32, fontWeight: 800, letterSpacing: 1, color: C.cyanSoft }}>fuente</div>
      </div>

      {/* rows */}
      {CHRONO.map((row, i) => (
        <div key={row.id} style={{ position: 'absolute', left: 0, top: rowTop(i) }}>
          <FieldRow row={row} factOn={factOn} focus={rowFocus(i)} dim={rowDim(i)} />
        </div>
      ))}

      {/* threads (under the chips) */}
      <svg width={CHRONO_GEO.width} height={CHRONO_GEO.headH + 10 + 5 * 102} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        <Thread x={COL_X.host} y1={chronoRowCenterY(0)} y2={chronoRowCenterY(2)} color={COLOR.host} draw={hostThread} dim={gapDim * 1.4} />
        <Thread x={COL_X.user} y1={chronoRowCenterY(0)} y2={chronoRowCenterY(2)} color={COLOR.user} draw={userThread} dim={gapDim * 1.4} />
        <Thread x={COL_X.label} y1={chronoRowCenterY(3)} y2={chronoRowCenterY(4)} color={COLOR.label} draw={labelThread} />
        <Thread x={COL_X.pid} y1={chronoRowCenterY(2)} y2={chronoRowCenterY(3)} color={COLOR.pid} draw={pidThread} dim={gapDim * 1.4} />
      </svg>

      {/* chips */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.92 * gapDim }}>
        {[0, 1, 2].map((i) => (
          <FieldChip key={`h${i}`} x={HOST_COL.x} y={chipTop(i, HOST_COL.h)} w={HOST_COL.w} h={HOST_COL.h} color={COLOR.host} on={hostChip[i]} style={{ fontSize: FIELD_SIZE }}>
            {HOST}
          </FieldChip>
        ))}
        {[0, 1, 2].map((i) => (
          <FieldChip key={`u${i}`} x={USER_COL.x} y={chipTop(i, USER_COL.h)} w={USER_COL.w} h={USER_COL.h} color={COLOR.user} on={userChip[i]} style={{ fontSize: FIELD_SIZE }}>
            {ACCOUNT}
          </FieldChip>
        ))}
        {[2, 3].map((i, k) => (
          <FieldChip key={`p${i}`} x={PID_COL.x} y={chipTop(i, PID_COL.h)} w={PID_COL.w} h={PID_COL.h} color={COLOR.pid} on={pidChip[k]} style={{ fontSize: 32, lineHeight: 1.05 }}>
            <span style={{ fontFamily: FONT.sans, fontSize: 20, fontWeight: 700, letterSpacing: 1, color: C.muted }}>PID</span>
            <span>{PID}</span>
          </FieldChip>
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0 }}>
        {[3, 4].map((i, k) => (
          <FieldChip key={`l${i}`} x={LABEL_COL.x} y={chipTop(i, LABEL_COL.h)} w={LABEL_COL.w} h={LABEL_COL.h} color={COLOR.label} on={labelChip[k]} glow={portP * 0.5} style={{ fontSize: LABEL_SIZE, alignItems: 'flex-start', paddingLeft: 16, gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <span>
                {HOST_IP}:
                <span
                  style={{
                    padding: '1px 3px',
                    margin: '0 -3px',
                    borderRadius: 6,
                    color: portP > 0.5 ? C.ink950 : C.textStrong,
                    background: portP > 0.01 ? alpha(COLOR.label, 0.15 + 0.85 * portP) : undefined,
                    boxShadow: portP > 0.01 ? `0 0 ${18 * portP}px ${alpha(COLOR.label, 0.8 * portP)}` : undefined,
                  }}
                >
                  {EPHEMERAL_PORT}
                </span>
              </span>
              <Icon name="arrowDown" size={26} color={C.muted} />
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>{UPLOAD_DST}</div>
          </FieldChip>
        ))}
      </div>

      {/* checks on the threads */}
      <CheckBadge x={COL_X.host} y={(chronoRowTop(0) + CHRONO_GEO.rowH + chronoRowTop(1)) / 2} on={hostCheck * (1 - 0.65 * gapDim)} color={COLOR.host} />
      <CheckBadge x={COL_X.user} y={(chronoRowTop(0) + CHRONO_GEO.rowH + chronoRowTop(1)) / 2} on={userCheck * (1 - 0.65 * gapDim)} color={COLOR.user} />
      <CheckBadge x={LABEL_COL.x - 30} y={(chronoRowTop(3) + CHRONO_GEO.rowH + chronoRowTop(4)) / 2} on={labelCheck} color={COLOR.label} />

      {/* call-out: the ephemeral port */}
      {portCard > 0.01 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.top, width: PANEL.w, opacity: portCard, transform: `translateY(${(1 - portCard) * 12}px)`, fontFamily: FONT.sans, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 24px',
              borderRadius: RADIUS.md,
              border: `3px solid ${alpha(COLOR.label, 0.9)}`,
              background: alpha(COLOR.label, 0.16),
              boxShadow: `0 0 28px ${alpha(COLOR.label, 0.35)}`,
              fontFamily: FONT.mono,
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: 2,
              color: C.textStrong,
              lineHeight: 1.2,
            }}
          >
            {EPHEMERAL_PORT}
          </div>
          <div style={{ marginTop: 10, fontSize: 44, fontWeight: 800, color: C.textStrong, lineHeight: 1.15 }}>{PORT_CALLOUT.title}</div>
          <div style={{ marginTop: 6, fontSize: 32, fontWeight: 600, color: C.muted, lineHeight: 1.25 }}>
            {PORT_CALLOUT.lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      ) : null}

      {/* call-out: the connection that was allowed is the one that program opened */}
      {sameCard > 0.01 ? (
        <div style={{ position: 'absolute', left: PANEL.x, top: PANEL.top, width: PANEL.w, opacity: sameCard, transform: `translateY(${(1 - sameCard) * 12}px)`, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: alpha(C.emerald, 0.18), border: `3px solid ${C.emerald}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon name="check" size={28} color={C.emerald} strokeWidth={3} />
            </div>
            <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{SAME_CALLOUT.lead}</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 38, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
            {SAME_CALLOUT.then} <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: C.textStrong }}>{PROGRAM}</span>
          </div>
          <div style={{ marginTop: 2, fontSize: 32, fontWeight: 600, color: C.muted }}>{SAME_CALLOUT.tail}</div>
        </div>
      ) : null}
      {corrCard > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: PANEL.x,
            top: 238,
            width: PANEL.w,
            boxSizing: 'border-box',
            padding: '12px 20px',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.emerald, 0.7)}`,
            background: alpha(C.emerald, 0.08),
            fontFamily: FONT.sans,
            opacity: corrCard,
            transform: `translateY(${(1 - corrCard) * 12}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 42, fontWeight: 850, color: C.emerald }}>
            <Icon name="link" size={40} color={C.emerald} strokeWidth={2.4} />
            {CORRELATE.split(':')[0]}
          </div>
          <div style={{ marginTop: 4, fontSize: 32, fontWeight: 600, color: C.text, lineHeight: 1.25 }}>
            <div>unir fuentes por</div>
            <div>lo que comparten</div>
          </div>
        </div>
      ) : null}

      {/* gap between the two clocks */}
      {gapCard > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: WIDE.x,
            top: 70,
            width: WIDE.w,
            height: 150,
            boxSizing: 'border-box',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(C.emerald, 0.6)}`,
            background: C.ink900,
            boxShadow: `0 0 30px ${alpha(C.emerald, 0.15)}`,
            fontFamily: FONT.sans,
            opacity: gapCard,
            transform: `translateY(${(1 - gapCard) * 12}px)`,
          }}
        >
          <ClockSide x={30} utc={CHRONO[3].utc} id="edr" />
          <ClockSide x={WIDE.w - 300} utc={CHRONO[4].utc} id="firewall" />
          {/* the 7 s between them */}
          <div style={{ position: 'absolute', left: 330, width: WIDE.w - 660, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 68, fontWeight: 850, color: C.textStrong, lineHeight: 1 }}>{GAP_SECONDS}</div>
            <svg width={WIDE.w - 680} height={24} viewBox={`0 0 ${WIDE.w - 680} 24`} style={{ marginTop: 6 }} aria-hidden>
              <path d={`M 12 12 H ${WIDE.w - 692}`} stroke={C.emerald} strokeWidth={5} strokeLinecap="round" />
              <path d="M 12 2 V 22" stroke={C.emerald} strokeWidth={5} strokeLinecap="round" />
              <path d={`M ${WIDE.w - 692} 2 V 22`} stroke={C.emerald} strokeWidth={5} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      ) : null}
      {ruleCard > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: WIDE.x,
            top: 240,
            width: WIDE.w,
            height: 108,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'stretch',
            gap: 10,
            fontFamily: FONT.sans,
            opacity: ruleCard,
            transform: `translateY(${(1 - ruleCard) * 12}px)`,
          }}
        >
          <div style={{ width: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.md, border: `3px solid ${alpha(C.emerald, 0.8)}`, background: `linear-gradient(${alpha(C.emerald, 0.14)}, ${alpha(C.emerald, 0.14)}), ${C.ink900}`, fontSize: 36, fontWeight: 800, color: C.emerald, whiteSpace: 'nowrap' }}>
            {CLOCK_RULE.ok}
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.md, border: `3px solid ${alpha(C.amber, 0.8)}`, background: `linear-gradient(${alpha(C.amber, 0.12)}, ${alpha(C.amber, 0.12)}), ${C.ink900}`, fontSize: 32, fontWeight: 800, color: C.amber, textAlign: 'center', lineHeight: 1.18 }}>
            <div>
              {CLOCK_RULE.check.split(': ')[0]}:
              <br />
              {CLOCK_RULE.check.split(': ')[1]}
            </div>
          </div>
        </div>
      ) : null}

      <CaseStamp frame={frame} />
    </Stage>
  );
}

function ClockSide({ x, utc, id }: { x: number; utc: string; id: 'edr' | 'firewall' }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 52, fontWeight: 800, color: C.emerald, lineHeight: 1 }}>{utc}</div>
      <SourceTag id={id} size={30} />
    </div>
  );
}
