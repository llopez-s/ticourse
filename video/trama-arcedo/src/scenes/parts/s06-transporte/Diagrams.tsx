/**
 * The code-drawn TCP diagrams of s06, each sized for the right half of the stage (PANEL_W × PANEL_H, half-local
 * coordinates). They replace each other over time:
 *   Handshake  the two endpoints and the three messages, one per line, then «establecimiento en tres pasos»
 *   Bytes      numbered bytes travel to the server and an ack comes back; then the resend beat: a gap that stays
 *              unconfirmed (the ack keeps asking for 1003), the missing byte resent into it, and two crossed bytes
 *              put back in order
 *   ProtoLabel the TCP / UDP caption block; VoiceRow the phone with its wave
 * Every frame passed in is scene-local.
 */
import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { mix } from '../../../../../engine/src/ui';
import { LAYER } from '../../../data/case';
import {
  ACK_ALL,
  ACK_GAP,
  ACK_LABEL,
  BYTES,
  ENDPOINTS,
  GAP_LABEL,
  HANDSHAKE,
  HANDSHAKE_LABEL,
  SEQ_LABEL,
  SIDE,
  SWAP_LABEL,
  VOICE_LABEL,
} from '../../../data/s06-transporte';
import { Device } from '../Net';
import { Rotulo } from '../Tags';

export const PANEL_W = 840;
export const PANEL_H = 660;

const TCP = LAYER.segment.tone;

function Arrow({ x1, y1, x2, y2, p, tone, width = 5 }: { x1: number; y1: number; x2: number; y2: number; p: number; tone: string; width?: number }) {
  if (p <= 0.001) return null;
  const x = mix(x1, x2, p);
  const y = mix(y1, y2, p);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 22;
  const a1 = ang + Math.PI - 0.45;
  const a2 = ang + Math.PI + 0.45;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={tone} strokeWidth={width} strokeLinecap="round" />
      <path d={`M ${x} ${y} L ${x + h * Math.cos(a1)} ${y + h * Math.sin(a1)} L ${x + h * Math.cos(a2)} ${y + h * Math.sin(a2)} Z`} fill={tone} />
    </g>
  );
}

function Pill({ children, tone, size = 30, style }: { children: ReactNode; tone: string; size?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${Math.round(size * 0.18)}px ${Math.round(size * 0.5)}px`,
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.85)}`,
        background: C.ink950,
        fontFamily: FONT.mono,
        fontSize: size,
        fontWeight: 700,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        lineHeight: 1.15,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Centred horizontally on `cx` (half-local), top at `y`. */
function At({ cx, y, opacity = 1, children }: { cx: number; y: number; opacity?: number; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: cx, top: y, transform: 'translateX(-50%)', opacity }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- the three-way handshake
const LANE = [170, 670] as const;
const MSG_Y0 = 130;
const MSG_STEP = 130;
const MSG_DROP = 50;

/** `at` = the `three` cue; the messages follow each other `step` frames apart. */
export function Handshake({ frame, at, step = 32 }: { frame: number; at: number; step?: number }) {
  const lanes = progress(frame, at - 6, 18, EASE.inOut);
  const titleIn = progress(frame, at + 3 * step + 6, 14);
  return (
    <div style={{ position: 'relative', width: PANEL_W, height: PANEL_H }}>
      <svg width={PANEL_W} height={PANEL_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        {LANE.map((x) => (
          <line key={x} x1={x} y1={84} x2={x} y2={mix(84, 520, lanes)} stroke={alpha(C.text, 0.35)} strokeWidth={3} strokeDasharray="8 10" />
        ))}
        {HANDSHAKE.map((m, i) => {
          const y0 = MSG_Y0 + i * MSG_STEP;
          const [xa, xb] = m.dir === 1 ? [LANE[0], LANE[1]] : [LANE[1], LANE[0]];
          return <Arrow key={m.text} x1={xa} y1={y0} x2={xb} y2={y0 + MSG_DROP} p={progress(frame, at + i * step, 18, EASE.inOut)} tone={alpha(TCP, 0.9)} />;
        })}
      </svg>
      <At cx={LANE[0]} y={20} opacity={lanes}>
        <Pill tone={C.text}>{ENDPOINTS.host}</Pill>
      </At>
      <At cx={LANE[1]} y={20} opacity={lanes}>
        <Pill tone={C.text}>{ENDPOINTS.server}</Pill>
      </At>
      {HANDSHAKE.map((m, i) => {
        const p = progress(frame, at + i * step + 8, 12);
        return (
          <At key={m.text} cx={(LANE[0] + LANE[1]) / 2} y={MSG_Y0 + i * MSG_STEP + MSG_DROP / 2 - 24} opacity={p}>
            <Pill tone={TCP}>{m.text}</Pill>
          </At>
        );
      })}
      <At cx={PANEL_W / 2} y={556} opacity={titleIn}>
        <Rotulo tone={TCP} size={34} on={titleIn}>
          {HANDSHAKE_LABEL}
        </Rotulo>
      </At>
    </div>
  );
}

// ---------------------------------------------------------------- numbered bytes, the ack, the resend
const CELL_W = 118;
const CELL_GAP = 12;
const ROW_X = (PANEL_W - (BYTES.length * CELL_W + (BYTES.length - 1) * CELL_GAP)) / 2;
const ROW_Y = 130;
const CELL_H = 80;
const cellX = (slot: number) => ROW_X + slot * (CELL_W + CELL_GAP);
const cellCx = (slot: number) => cellX(slot) + CELL_W / 2;
const ACK_Y = 430;

function Cell({ n, x, y, tone, opacity = 1, glow = 0 }: { n: number; x: number; y: number; tone: string; opacity?: number; glow?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: CELL_W,
        height: CELL_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.sm,
        border: `3px solid ${alpha(tone, 0.85)}`,
        background: alpha(tone, 0.14 + 0.16 * glow),
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(26 * glow)}px ${alpha(tone, 0.5 * glow)}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT.mono,
        fontSize: 32,
        fontWeight: 800,
        color: C.textStrong,
        opacity,
      }}
    >
      {n}
    </div>
  );
}

export interface BytesTiming {
  /** `num` cue: bytes arrive in order */
  num: number;
  /** «confirma»: the ack comes back */
  ack: number;
  /** `resend` cue: the second run, with a gap and two crossed bytes */
  resend: number;
  /** «reenvía»: the missing byte is sent again */
  refill: number;
  /** «descolocado»: the crossed pair is pointed out */
  swapMark: number;
  /** «ordena»: the pair is put back in order */
  swap: number;
}

export function Bytes({ frame, t }: { frame: number; t: BytesTiming }) {
  // Run 1 (in order) gives way to run 2 just after the `resend` cue.
  const run1 = 1 - progress(frame, t.resend - 4, 10, EASE.inOut);
  const run2 = progress(frame, t.resend + 4, 10);
  const seqIn = progress(frame, t.num - 2, 14) * run1;
  const sidesIn = progress(frame, t.num + 6, 14) * run1;

  // The ack: drawn on «confirma», kept through the resend beat; its value says what is still expected.
  const ackLabelIn = progress(frame, t.ack + 12, 14);
  const gapAck = progress(frame, t.resend + 14, 10) * (1 - progress(frame, t.refill + 22, 10));
  // The arrow is shot again each time the ack changes: ack=1007, then ack=1003 (gap), then ack=1007.
  const shots = [t.ack - 4, t.resend + 14, t.refill + 22];
  const shot = shots.filter((s) => frame >= s).pop() ?? shots[0];
  const ackP2 = progress(frame, shot, 18, EASE.inOut);
  const ackTone = gapAck > 0.5 ? C.amber : TCP;

  // Run 2: slots 0..5 = 1001, 1002, [gap], 1005, 1004, 1006; then 1003 drops in and the pair swaps.
  const drop = progress(frame, t.refill, 18, EASE.out);
  const swap = progress(frame, t.swap, 22, EASE.inOut);
  const gapLabel = progress(frame, t.resend + 18, 12) * (1 - progress(frame, t.refill + 30, 14));
  const swapLabel = progress(frame, t.swapMark - 4, 12);
  const pairGlow = swapLabel * (1 - progress(frame, t.swap + 30, 20));
  const arc = Math.sin(Math.PI * swap) * 40;

  return (
    <div style={{ position: 'relative', width: PANEL_W, height: PANEL_H }}>
      {/* run 1: every byte in order */}
      {run1 > 0.01 ? (
        <>
          <At cx={PANEL_W / 2} y={38} opacity={seqIn}>
            <Rotulo tone={TCP} size={34} on={seqIn}>
              {SEQ_LABEL}
            </Rotulo>
          </At>
          {BYTES.map((n, i) => {
            const p = progress(frame, t.num + 4 + i * 7, 14);
            return <Cell key={n} n={n} x={cellX(i) - (1 - p) * 70} y={ROW_Y} tone={TCP} opacity={p * run1} />;
          })}
          <svg width={PANEL_W} height={PANEL_H} style={{ position: 'absolute', left: 0, top: 0, opacity: sidesIn }}>
            <Arrow x1={ROW_X} y1={ROW_Y + CELL_H + 30} x2={PANEL_W - ROW_X} y2={ROW_Y + CELL_H + 30} p={1} tone={alpha(C.text, 0.5)} width={3} />
          </svg>
          <div style={{ position: 'absolute', left: ROW_X, top: ROW_Y + CELL_H + 46, opacity: sidesIn, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted }}>
            {SIDE.host}
          </div>
          <div style={{ position: 'absolute', right: ROW_X, top: ROW_Y + CELL_H + 46, opacity: sidesIn, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted }}>
            {SIDE.server}
          </div>
        </>
      ) : null}

      {/* run 2: a gap and two crossed bytes */}
      {run2 > 0.01 ? (
        <>
          {/* the empty slot of 1003 */}
          <div
            style={{
              position: 'absolute',
              left: cellX(2),
              top: ROW_Y,
              width: CELL_W,
              height: CELL_H,
              boxSizing: 'border-box',
              borderRadius: RADIUS.sm,
              border: `3px dashed ${alpha(C.amber, 0.9)}`,
              background: alpha(C.amber, 0.08),
              opacity: run2 * (1 - drop),
            }}
          />
          {[
            { n: 1001, slot: 0 },
            { n: 1002, slot: 1 },
            { n: 1005, slot: 3, to: 4 },
            { n: 1004, slot: 4, to: 3 },
            { n: 1006, slot: 5 },
          ].map((c, i) => {
            const p = progress(frame, t.resend + 6 + i * 5, 12);
            const x = c.to === undefined ? cellX(c.slot) : mix(cellX(c.slot), cellX(c.to), swap);
            const y = c.to === undefined ? ROW_Y : ROW_Y + (c.n === 1005 ? -arc : arc);
            const tone = c.to !== undefined && pairGlow > 0.3 && swap < 0.5 ? C.amber : TCP;
            return <Cell key={c.n} n={c.n} x={x - (1 - p) * 70} y={y} tone={tone} opacity={p} glow={c.to !== undefined ? pairGlow : 0} />;
          })}
          {/* the resent byte */}
          {drop > 0.001 ? <Cell n={1003} x={cellX(2)} y={ROW_Y - (1 - drop) * 110} tone={TCP} opacity={drop} glow={1 - progress(frame, t.refill + 24, 24)} /> : null}

          <At cx={cellCx(2)} y={38} opacity={gapLabel}>
            <Rotulo tone={C.amber} size={32} on={gapLabel}>
              {GAP_LABEL}
            </Rotulo>
          </At>
          <At cx={(cellCx(3) + cellCx(4)) / 2} y={ROW_Y + CELL_H + 60} opacity={swapLabel}>
            <Rotulo tone={swap > 0.5 ? TCP : C.amber} size={32} on={pairGlow}>
              {SWAP_LABEL}
            </Rotulo>
          </At>
        </>
      ) : null}

      {/* the ack, from the server back to the workstation */}
      <svg width={PANEL_W} height={PANEL_H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <Arrow x1={PANEL_W - ROW_X} y1={ACK_Y} x2={ROW_X} y2={ACK_Y} p={ackP2} tone={alpha(ackTone, 0.85)} />
      </svg>
      <At cx={PANEL_W / 2} y={ACK_Y - 30} opacity={progress(frame, t.ack + 4, 12) * (1 - gapAck)}>
        <Pill tone={TCP}>{ACK_ALL}</Pill>
      </At>
      <At cx={PANEL_W / 2} y={ACK_Y - 30} opacity={gapAck}>
        <Pill tone={C.amber}>{ACK_GAP}</Pill>
      </At>
      <At cx={PANEL_W / 2} y={ACK_Y + 70} opacity={ackLabelIn}>
        <Rotulo tone={TCP} size={32} on={ackLabelIn * (1 - progress(frame, t.resend, 20))}>
          {ACK_LABEL}
        </Rotulo>
      </At>
    </div>
  );
}

// ---------------------------------------------------------------- captions
export function ProtoLabel({ title, lines, tone, on = 0 }: { title: string; lines: readonly string[]; tone: string; on?: number }) {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '12px 26px 14px',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.6 + 0.35 * on)}`,
        background: alpha(C.ink950, 0.92),
        boxShadow: on > 0.02 ? `0 0 ${Math.round(26 * on)}px ${alpha(tone, 0.35 * on)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ fontSize: 38, fontWeight: 850, color: tone, lineHeight: 1.2 }}>{title}</div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 32, fontWeight: 700, color: C.textStrong, lineHeight: 1.28 }}>
          {l}
        </div>
      ))}
    </div>
  );
}

/** A phone and a voice wave (sky = gear, not a Consorcio device) with «voz en tiempo real». */
export function VoiceRow({ frame, at }: { frame: number; at: number }) {
  const on = progress(frame, at, 14);
  const W = 190;
  const H = 64;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 4) {
    const env = Math.sin((Math.PI * x) / W);
    const y = H / 2 + env * 22 * Math.sin(x / 9 - (frame - at) / 3) * on;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Device icon="phone" tone={C.sky} size={68} on={on} />
      <svg width={W} height={H}>
        <polyline points={pts.join(' ')} fill="none" stroke={C.sky} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Rotulo tone={C.sky} size={34} on={on}>
        {VOICE_LABEL}
      </Rotulo>
    </div>
  );
}
