import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../../engine/src/ui';
import { BLIND, DEMO } from '../../../data/s09-camara';
import { Envelope, InlineDevice, SensorBox, TapNode } from './glyphs';

/**
 * s09-04/06: the same bad packet through the two kinds of device. Top lane
 * (TAP · PASSIVE): the packet crosses a tap, its copy reaches the sensor, the
 * alert goes off — and the packet keeps going («sigue su camino»). Later the
 * sensor switches off: a blind spot that cuts nothing, the traffic still
 * flows. Bottom lane (INLINE · ACTIVE): the traffic crosses the device, which
 * drops the packet («descartado»). These lanes are a concept, not the port's
 * plan: plain dark panels, no «plan» tag. Local px LANES_W × LANES_H.
 */

export const LANES_W = 840;
export const LANE_H = 222;
export const LANE_GAP = 22;
export const LANES_H = LANE_H * 2 + LANE_GAP;

const LY = 104;
const X0 = 30;
const X1 = LANES_W - 30;
/** Top lane: the tap and its sensor. */
export const TAP_X = 150;
const SENSOR_TOP = 142;
/** Bottom lane: the inline device. */
export const DEV = { x: 340, w: 150, h: 100 } as const;

const EXAM = '#c4b5fd';

function LanePanel({ title, children, focus, dim }: { title: string; children: ReactNode; focus: number; dim: number }) {
  const f = clamp01(focus);
  return (
    <div
      style={{
        position: 'relative',
        width: LANES_W,
        height: LANE_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `${f > 0.3 ? 3 : 2}px solid ${f > 0.01 ? alpha(C.cyan, 0.35 + 0.45 * f) : C.ink700}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: f > 0.01 ? `0 0 ${Math.round(30 * f)}px ${alpha(C.cyan, 0.16 * f)}` : `0 18px 40px ${alpha('#000000', 0.3)}`,
        fontFamily: FONT.sans,
        ...dimStyle(clamp01(dim)),
      }}
    >
      <div style={{ position: 'absolute', left: 22, top: 14, fontSize: 32, fontWeight: 900, letterSpacing: 1, color: EXAM, whiteSpace: 'nowrap' }}>{title}</div>
      {children}
    </div>
  );
}

/** A position along piecewise-linear keyframes (frames → x). */
function along(frame: number, keys: readonly (readonly [number, number])[]): number {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f0, x0] = keys[i - 1];
    const [f1, x1] = keys[i];
    if (frame <= f1) return x0 + ((x1 - x0) * (frame - f0)) / Math.max(1, f1 - f0);
  }
  return keys[keys.length - 1][1];
}

export interface TapLaneTimes {
  /** The bad packet enters, reaches the tap, leaves the lane. */
  start: number;
  atTap: number;
  exit: number;
  /** The copy takes this long to reach the sensor; the alert follows. */
  copyFrames: number;
  /** «sigue su camino». */
  passesLabel: number;
  /** The sensor switches off (blind spot). */
  blind: number;
}

export interface InlineLaneTimes {
  start: number;
  /** The packet hits the device and is dropped (the «block» sfx). */
  drop: number;
}

export function DemoLanes({
  frame,
  show,
  tap,
  inline,
  focusTap,
  focusInline,
  dimTap,
  dimInline,
  deviceGlow,
}: {
  frame: number;
  /** 0–1 per panel. */
  show: readonly [number, number];
  tap: TapLaneTimes;
  inline: InlineLaneTimes;
  focusTap: number;
  focusInline: number;
  dimTap: number;
  dimInline: number;
  /** 0–1 the inline device glows (the failure mode is decided for it). */
  deviceGlow: number;
}) {
  // --- Top lane: the bad packet and its copy ---
  const pA = frame >= tap.start && frame <= tap.exit ? along(frame, [[tap.start, X0], [tap.atTap, TAP_X], [tap.exit, X1]]) : null;
  const copyT = (frame - tap.atTap) / tap.copyFrames;
  const copyOn = copyT > 0 && copyT < 1.25;
  const alertOn = clamp01((frame - (tap.atTap + tap.copyFrames - 2)) / 6) * (1 - clamp01((frame - tap.blind + 2) / 8));
  const power = 1 - clamp01((frame - tap.blind) / 8);
  const passesLabel = clamp01((frame - tap.passesLabel) / 10);
  const blindLabel = clamp01((frame - tap.blind - 6) / 12);
  // Plain traffic keeps flowing on the top lane once the sensor is off: blind, but nothing is cut.
  const flowOn = clamp01((frame - tap.blind) / 10);
  const flow = Array.from({ length: 5 }, (_, k) => X0 + ((((frame - tap.blind) * 5 + k * 150) % (X1 - X0)) + (X1 - X0)) % (X1 - X0));

  // --- Bottom lane: the packet is dropped ---
  const pB = frame >= inline.start && frame < inline.drop ? along(frame, [[inline.start, X0], [inline.drop, DEV.x - 20]]) : null;
  const burst = clamp01((frame - inline.drop) / 10);
  const burstFade = 1 - clamp01((frame - inline.drop - 26) / 14);
  const dropped = clamp01((frame - inline.drop) / 8);

  return (
    <div style={{ position: 'relative', width: LANES_W, height: LANES_H }}>
      {/* ================= TAP · PASSIVE ================= */}
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: clamp01(show[0]), transform: `translateX(${(1 - clamp01(show[0])) * 24}px)` }}>
        <LanePanel title={DEMO.tapLane} focus={focusTap} dim={dimTap}>
          <svg width={LANES_W} height={LANE_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={X0} y1={LY} x2={X1} y2={LY} stroke={alpha(C.cyan, 0.5)} strokeWidth={6} strokeLinecap="round" />
            <path d={`M ${X1 - 20} ${LY - 13} L ${X1} ${LY} L ${X1 - 20} ${LY + 13}`} fill="none" stroke={alpha(C.cyan, 0.5)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <line x1={TAP_X} y1={LY + 18} x2={TAP_X} y2={SENSOR_TOP} stroke={alpha(C.cyanSoft, 0.8 * (0.4 + 0.6 * power))} strokeWidth={3} strokeDasharray="7 6" />
            <TapNode x={TAP_X} y={LY} />
            {flowOn > 0.01
              ? flow.map((x, k) => <circle key={k} cx={x} cy={LY} r={9} fill={C.cyan} opacity={flowOn * Math.min(1, (x - X0) / 40, (X1 - x) / 40)} />)
              : null}
            {copyOn ? <Envelope x={TAP_X} y={LY + 18 + (SENSOR_TOP - 4 - LY - 18) * Math.min(1, copyT)} color={C.rose} copy scale={0.7} opacity={copyT < 1 ? 1 : Math.max(0, 1 - (copyT - 1) * 4)} /> : null}
            {pA !== null ? <Envelope x={pA} y={LY} color={C.rose} /> : null}
          </svg>
          <div style={{ position: 'absolute', left: TAP_X - 88, top: SENSOR_TOP }}>
            <SensorBox power={power} alert={alertOn} />
          </div>
          {/* the alert */}
          <div style={{ position: 'absolute', left: TAP_X + 104, top: SENSOR_TOP + 12, opacity: alertOn, transform: `scale(${0.85 + 0.15 * alertOn})`, transformOrigin: 'left center' }}>
            <Pill icon="bell" color={C.amber} soft="#fcd34d">
              {DEMO.alert}
            </Pill>
          </div>
          {/* … and it keeps going */}
          <div style={{ position: 'absolute', right: 26, top: LY - 64, opacity: passesLabel * (1 - blindLabel), fontSize: 32, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap' }}>
            {DEMO.passes}
          </div>
          {/* blind spot */}
          <div style={{ position: 'absolute', left: TAP_X + 104, top: SENSOR_TOP + 12, opacity: blindLabel, transform: `translateX(${(1 - blindLabel) * 12}px)` }}>
            <Pill icon="eyeOff" color={C.rose} soft={C.roseSoft}>
              {BLIND}
            </Pill>
          </div>
        </LanePanel>
      </div>

      {/* ================= INLINE · ACTIVE ================= */}
      <div style={{ position: 'absolute', left: 0, top: LANE_H + LANE_GAP, opacity: clamp01(show[1]), transform: `translateX(${(1 - clamp01(show[1])) * 24}px)` }}>
        <LanePanel title={DEMO.inlineLane} focus={focusInline} dim={dimInline}>
          <svg width={LANES_W} height={LANE_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={X0} y1={LY} x2={DEV.x} y2={LY} stroke={alpha(C.cyan, 0.5)} strokeWidth={6} strokeLinecap="round" />
            <line x1={DEV.x + DEV.w} y1={LY} x2={X1} y2={LY} stroke={alpha(C.cyan, 0.5)} strokeWidth={6} strokeLinecap="round" />
            <path d={`M ${X1 - 20} ${LY - 13} L ${X1} ${LY} L ${X1 - 20} ${LY + 13}`} fill="none" stroke={alpha(C.cyan, 0.5)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            {pB !== null ? <Envelope x={pB} y={LY} color={C.rose} /> : null}
            {burst > 0.01 && burstFade > 0.01 ? (
              <g opacity={burstFade} transform={`translate(${DEV.x - 26} ${LY})`}>
                <circle r={20 + 22 * burst} fill="none" stroke={alpha(C.rose, 0.7 * (1 - burst))} strokeWidth={4} />
                <g transform={`scale(${0.6 + 0.4 * burst})`} stroke={C.rose} strokeWidth={7} strokeLinecap="round">
                  <line x1={-14} y1={-14} x2={14} y2={14} />
                  <line x1={14} y1={-14} x2={-14} y2={14} />
                </g>
              </g>
            ) : null}
          </svg>
          <div style={{ position: 'absolute', left: DEV.x, top: LY - DEV.h / 2 }}>
            <InlineDevice width={DEV.w} height={DEV.h} glow={Math.max(clamp01(deviceGlow), 0.7 * burst * burstFade)} />
          </div>
          <div style={{ position: 'absolute', left: DEV.x + DEV.w + 28, top: LY + 22, opacity: dropped, transform: `translateY(${(1 - dropped) * 10}px)` }}>
            <Pill icon="x" color={C.rose} soft={C.roseSoft}>
              {DEMO.dropped}
            </Pill>
          </div>
        </LanePanel>
      </div>
    </div>
  );
}

function Pill({ icon, color, soft, children }: { icon: 'bell' | 'eyeOff' | 'x'; color: string; soft: string; children: ReactNode }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 18px 6px 14px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, 0.75)}`,
        background: alpha(color, 0.14),
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 800,
        lineHeight: 1.1,
        color: soft,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={34} color={color} strokeWidth={2.4} />
      {children}
    </span>
  );
}
