import type { ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../theme/tokens';
import { EASE, fadeIn, progress, springIn } from '../theme/motion';
import { Icon, MonoLine, Panel, PipelineSpine, SeverityBadge, curveBetween } from '../ui';
import { ACCOUNT, ALERT_FIELDS, AXIS, EVENTS, LANES, RULE, clock, type EventKind } from '../data/s05-correlate';
import { EventChip, chipHeight, chipWidth } from './parts/s05-correlate/EventChip';
import { Link } from './parts/s05-correlate/Link';

/* Layout in stage-local px (stage = 1728 × 660). */
const PANEL = { x: 0, y: 104, w: 1728 };
const LABEL_W = 446;
const PLOT = { x0: 470, x1: 1700 };
/**
 * The rule card is drawn at full size (32 px text) while it is the focus, then
 * scales down to RULE_BOX.small wide (anchored bottom-left) to share the bottom
 * row with the alert card, which matches its scaled height.
 */
const RULE_BOX = { w: 960, h: 288, small: 830 };
const RULE_SCALE = RULE_BOX.small / RULE_BOX.w;
const BOTTOM_H = Math.round(RULE_BOX.h * RULE_SCALE);
const BOTTOM_Y = STAGE.height - BOTTOM_H;
const ALERT_BOX = { x: 858, w: 870 };

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const xOf = (minute: number) => PANEL.x + PLOT.x0 + ((PLOT.x1 - PLOT.x0) * minute) / AXIS.span;
/** 0→1→0 bump: rises at `start`, holds `hold` frames, then eases out. */
const bump = (frame: number, start: number, hold = 14) =>
  progress(frame, start, 8) * (1 - progress(frame, start + 8 + hold, 16, EASE.inOut));

/**
 * The timeline panel is tall while the events arrive, then compacts (c: 0→1)
 * to free the bottom row for the rule and the alert.
 */
function geometry(c: number) {
  const topPad = mix(58, 14, c);
  const laneH = mix(128, 62, c);
  const dimRow = mix(44, 0, c);
  const panelH = mix(556, 250, c);
  const lanesTop = PANEL.y + topPad;
  const lanesBottom = lanesTop + 3 * laneH;
  return {
    laneH,
    dimRow,
    panelH,
    lanesTop,
    lanesBottom,
    axisY: lanesBottom + dimRow + 4,
    /** Chips sit a little high in the tall lanes to leave room for their note. */
    chipY: (lane: number) => lanesTop + (lane + 0.5) * laneH - 16 * (1 - c),
  };
}

const CLAUSE_OF: Record<EventKind, number> = { fail: 0, success: 1, create: 2 };

export function S05Correlate({ cue, segments }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const evFail = cue('ev-fail');
  const evSuccess = cue('ev-success');
  const evCreate = cue('ev-create');
  const windowAt = cue('window');
  const ruleAt = cue('rule');
  const alertAt = cue('alert');
  const sourcesAt = segments.find((s) => s.id === 's05-03')?.from ?? windowAt - 90;

  // The timeline finishes compacting right as the voice says "regla", so the
  // rule card rises into free space instead of over the shrinking lanes.
  const compact = progress(frame, ruleAt - 22, 22, EASE.inOut);
  // In-lane notes leave before the lanes shrink, so they never ghost across the compact rows.
  const notesOut = 1 - progress(frame, ruleAt - 26, 8, EASE.inOut);
  const g = geometry(compact);
  const chipSize = mix(32, 28, compact);
  const chipH = chipHeight(chipSize);
  const clauseAt = RULE.map((_, i) => ruleAt + 16 + i * 14);
  const alerting = progress(frame, alertAt, 16, EASE.inOut);

  // Playhead (minutes after 16:40) glides to each event as the voice names it;
  // it fast-forwards through "diez minutos después".
  const playMinute = interpolate(
    frame,
    [evFail - 14, evFail, evFail + 16, evSuccess - 14, evSuccess, evCreate - 30, evCreate],
    [0, 1, 5, 5, 6, 6, 16],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const playheadOn = fadeIn(frame, 4, 12) * (1 - progress(frame, evCreate + 48, 14, EASE.inOut));

  const appearAt: Record<string, number> = {
    f1: evFail,
    f2: evFail + 8,
    f3: evFail + 16,
    ok: evSuccess,
    new: evCreate,
  };

  const timelineDim = 1 - 0.5 * alerting;
  const panelIn = progress(frame, 0, 16);

  // Geometry the links and the window band hang from.
  const failW = chipWidth('4625', undefined, chipSize);
  const okEvent = EVENTS.find((e) => e.id === 'ok')!;
  const newEvent = EVENTS.find((e) => e.id === 'new')!;
  const okW = chipWidth(okEvent.code, okEvent.label, chipSize);
  const newW = chipWidth(newEvent.code, newEvent.label, chipSize);
  const bandLeft = xOf(1) - failW / 2 - 16;
  const bandRight = xOf(16) + newW / 2 + 16;
  const bandSweep = progress(frame, windowAt - 4, 22, EASE.inOut);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <PipelineSpine
          active={frame >= alertAt ? 4 : 3}
          intensity={frame >= alertAt ? progress(frame, alertAt, 16) : progress(frame, 0, 24)}
        />

        {/* ================= Timeline ================= */}
        <div style={{ position: 'absolute', inset: 0, opacity: panelIn * timelineDim }}>
          <div
            style={{
              position: 'absolute',
              left: PANEL.x,
              top: PANEL.y,
              width: PANEL.w,
              height: g.panelH,
              borderRadius: RADIUS.lg,
              background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              border: `2px solid ${C.ink700}`,
              boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}`,
            }}
          />

          {/* Lanes: one row per source */}
          {LANES.map((lane, index) => {
            const top = g.lanesTop + index * g.laneH;
            const glow = bump(frame, sourcesAt + 22 + index * 9, 16);
            return (
              <div key={lane.label}>
                <div
                  style={{
                    position: 'absolute',
                    left: PANEL.x + 2,
                    top,
                    width: PANEL.w - 4,
                    height: g.laneH,
                    background: index % 2 === 0 ? alpha(C.ink800, 0.55) : 'transparent',
                    borderTop: index === 0 ? 'none' : `1px solid ${alpha(C.ink600, 0.5)}`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: PANEL.x + 12,
                    top: top + g.laneH / 2,
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '4px 12px 4px 6px',
                    borderRadius: RADIUS.md,
                    background: alpha(C.cyan, 0.16 * glow),
                    border: `2px solid ${alpha(C.cyan, 0.85 * glow)}`,
                    boxShadow: glow > 0 ? `0 0 ${24 * glow}px ${alpha(C.cyan, 0.3 * glow)}` : 'none',
                    fontFamily: FONT.sans,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name={lane.icon} size={30} color={glow > 0.2 ? C.cyanSoft : C.cyan} />
                  <span style={{ fontSize: TYPE.label, fontWeight: 700, color: glow > 0.2 ? C.textStrong : C.text }}>{lane.label}</span>
                  {lane.host ? (
                    <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.muted }}>{lane.host}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: PANEL.x + LABEL_W,
              top: g.lanesTop,
              width: 2,
              height: g.lanesBottom - g.lanesTop,
              background: alpha(C.ink600, 0.7),
            }}
          />

          {/* Axis */}
          <div
            style={{
              position: 'absolute',
              left: PANEL.x + PLOT.x0,
              top: g.axisY,
              width: PLOT.x1 - PLOT.x0,
              height: 2,
              background: C.ink600,
            }}
          />
          {AXIS.ticks.map((tick) => (
            <div key={tick}>
              <div style={{ position: 'absolute', left: xOf(tick) - 1, top: g.axisY - 6, width: 2, height: 14, background: C.ink500 }} />
              {tick < AXIS.span ? (
              <div
                style={{
                  position: 'absolute',
                  left: xOf(tick),
                  top: g.axisY + 8,
                  transform: 'translateX(-50%)',
                  fontFamily: FONT.mono,
                  fontSize: TYPE.small,
                  color: C.muted,
                }}
              >
                {clock(tick)}
              </div>
              ) : null}
            </div>
          ))}

          {/* "misma ventana de tiempo" band */}
          {bandSweep > 0 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: bandLeft,
                  top: g.lanesTop + mix(6, 2, compact),
                  width: (bandRight - bandLeft) * bandSweep,
                  height: g.lanesBottom - g.lanesTop - mix(12, 4, compact),
                  borderRadius: RADIUS.md,
                  background: alpha(C.cyan, 0.08),
                  border: `2px dashed ${alpha(C.cyan, 0.75)}`,
                  boxSizing: 'border-box',
                }}
              />
              {/* Tab label inside the band's top-right corner (the empty end of the remote-desktop row), so it survives the compaction. */}
              <div
                style={{
                  position: 'absolute',
                  left: bandRight - 20,
                  top: g.chipY(0),
                  transform: 'translate(-100%, -50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: FONT.sans,
                  fontSize: mix(TYPE.label, 28, compact),
                  fontWeight: 750,
                  color: C.cyanSoft,
                  whiteSpace: 'nowrap',
                  opacity: progress(frame, windowAt + 14, 10),
                }}
              >
                <Icon name="clock" size={Math.round(mix(32, 28, compact))} color={C.cyan} />
                misma ventana de tiempo
              </div>
            </>
          ) : null}

          {/* Lines: playhead, "10 min" dimension, correlation links */}
          <svg width={STAGE.width} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {playheadOn > 0 ? (
              <g opacity={playheadOn}>
                <line
                  x1={xOf(playMinute)}
                  y1={g.lanesTop - 4}
                  x2={xOf(playMinute)}
                  y2={g.axisY + 4}
                  stroke={C.cyan}
                  strokeWidth={3}
                />
                <circle cx={xOf(playMinute)} cy={g.axisY + 1} r={7} fill={C.cyan} />
              </g>
            ) : null}

            <DimensionLine frame={frame} evCreate={evCreate} playMinute={playMinute} g={g} chipH={chipH} fade={notesOut} />

            {/* Clause 1: the three failures are one group */}
            {(() => {
              const draw = progress(frame, clauseAt[0], 12, EASE.inOut);
              if (draw <= 0) return null;
              const x = xOf(1) - failW / 2 - 10;
              const w = xOf(5) + failW / 2 + 10 - x;
              const y = g.chipY(0) - chipH / 2 - 7;
              const h = chipH + 14;
              const perimeter = 2 * (w + h);
              return (
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={h / 2}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={3}
                  strokeDasharray={`${perimeter} ${perimeter}`}
                  strokeDashoffset={perimeter * (1 - draw)}
                />
              );
            })()}
            {/* Clause 2: failures, then a success for the same account (elbow down into the 4624) */}
            {(() => {
              const startX = xOf(2);
              const y0 = g.chipY(0) + chipH / 2 + 7;
              const y1 = g.chipY(1);
              const endX = xOf(6) - okW / 2;
              return (
                <Link
                  curve={[
                    { x: startX, y: y0 },
                    { x: startX, y: y1 },
                    { x: startX + 10, y: y1 },
                    { x: endX, y: y1 },
                  ]}
                  draw={progress(frame, clauseAt[1], 12, EASE.inOut)}
                />
              );
            })()}
            {/* Clause 3: then an account created by it */}
            <Link
              curve={curveBetween({ x: xOf(6) + okW / 2, y: g.chipY(1) }, { x: xOf(16) - newW / 2, y: g.chipY(2) })}
              draw={progress(frame, clauseAt[2], 14, EASE.inOut)}
            />
          </svg>

          {/* Playhead clock */}
          {playheadOn > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: xOf(playMinute),
                top: PANEL.y + 12,
                transform: 'translateX(-50%)',
                padding: '2px 12px',
                borderRadius: RADIUS.pill,
                background: C.cyan,
                color: C.ink950,
                fontFamily: FONT.mono,
                fontSize: TYPE.small,
                fontWeight: 750,
                opacity: playheadOn,
              }}
            >
              {clock(playMinute)}
            </div>
          ) : null}

          {/* Events */}
          {EVENTS.map((event) => {
            const at = appearAt[event.id];
            if (frame < at) return null;
            const clauseLit = progress(frame, clauseAt[CLAUSE_OF[event.kind]], 10);
            const landing = bump(frame, at, 18);
            return (
              <EventChip
                key={event.id}
                x={xOf(event.minute)}
                y={g.chipY(event.lane)}
                code={event.code}
                label={event.label}
                accent={event.accent}
                size={chipSize}
                glow={Math.max(landing, 0.75 * clauseLit)}
                opacity={progress(frame, at, 6)}
                scale={0.7 + 0.3 * springIn(frame, fps, at, { damping: 12, mass: 0.6 })}
              />
            );
          })}

          {/* Plain-language notes under the events (only while the timeline is tall) */}
          <SubLabel
            x={xOf(1) - failW / 2 - 10}
            y={g.chipY(0) + chipH / 2 + 6}
            opacity={progress(frame, evFail + 32, 12) * notesOut}
          >
            <span style={{ color: C.amber }}>3 fallidos</span>
            <span style={{ color: C.muted }}> · cuenta </span>
            <Account frame={frame} at={evSuccess + 8}>
              {ACCOUNT}
            </Account>
          </SubLabel>
          <SubLabel
            x={xOf(6)}
            y={g.chipY(1) + chipH / 2 + 6}
            center
            opacity={progress(frame, evSuccess + 8, 10) * notesOut}
          >
            <Account frame={frame} at={evSuccess + 8}>
              misma cuenta
            </Account>
          </SubLabel>
          <SubLabel
            x={xOf(16)}
            y={g.chipY(2) + chipH / 2 + 6}
            center
            opacity={progress(frame, evCreate + 12, 10) * notesOut}
          >
            <span style={{ color: C.muted }}>creada por </span>
            <span style={{ color: C.cyanSoft }}>{ACCOUNT}</span>
          </SubLabel>
        </div>

        {/* ================= Rule ================= */}
        <RuleCard frame={frame} ruleAt={ruleAt} clauseAt={clauseAt} alertAt={alertAt} dim={1 - 0.45 * alerting} />

        {/* ================= Alert ================= */}
        <AlertCard frame={frame} fps={fps} alertAt={alertAt} />
      </div>
    </AbsoluteFill>
  );
}

function SubLabel({
  x,
  y,
  center = false,
  opacity,
  children,
}: {
  x: number;
  y: number;
  center?: boolean;
  opacity: number;
  children: ReactNode;
}) {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: center ? 'translateX(-50%)' : undefined,
        fontFamily: FONT.sans,
        fontSize: TYPE.label,
        fontWeight: 650,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        // Opaque backing so the playhead and the "10 min" guides never cut through the text.
        padding: '1px 10px',
        borderRadius: 10,
        background: alpha(C.ink900, 0.94),
        opacity,
      }}
    >
      {children}
    </div>
  );
}

/** The account name, underlined in cyan once the voice says "la misma cuenta". */
function Account({ frame, at, children }: { frame: number; at: number; children: ReactNode }) {
  const on = progress(frame, at, 10);
  return (
    <span
      style={{
        color: on > 0 ? C.cyanSoft : C.text,
        background: alpha(C.cyan, 0.16 * on),
        borderRadius: 8,
        padding: '0 6px',
      }}
    >
      {children}
    </span>
  );
}

/** "10 min" between the successful logon and the account creation. */
function DimensionLine({
  frame,
  evCreate,
  playMinute,
  g,
  chipH,
  fade,
}: {
  frame: number;
  evCreate: number;
  playMinute: number;
  g: ReturnType<typeof geometry>;
  chipH: number;
  fade: number;
}) {
  const start = evCreate - 30;
  if (frame < start || fade <= 0) return null;
  const y = g.lanesBottom + g.dimRow / 2;
  const x1 = xOf(6);
  const x2 = xOf(Math.max(6, Math.min(16, playMinute)));
  const label = progress(frame, evCreate - 4, 10);
  const reached = frame >= evCreate;
  return (
    <g opacity={fade * fadeIn(frame, start, 6)}>
      <line x1={x1} y1={g.chipY(1) + chipH / 2 + 50} x2={x1} y2={y} stroke={C.ink500} strokeWidth={2} strokeDasharray="6 8" />
      {reached ? (
        <line x1={x2} y1={g.chipY(2) + chipH / 2 + 50} x2={x2} y2={y} stroke={C.ink500} strokeWidth={2} strokeDasharray="6 8" />
      ) : null}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.cyanSoft} strokeWidth={3} />
      <line x1={x1} y1={y - 10} x2={x1} y2={y + 10} stroke={C.cyanSoft} strokeWidth={3} />
      <line x1={x2} y1={y - 10} x2={x2} y2={y + 10} stroke={C.cyanSoft} strokeWidth={3} />
      {label > 0 ? (
        <g opacity={label}>
          <rect x={(x1 + xOf(16)) / 2 - 72} y={y - 22} width={144} height={44} rx={22} fill={C.ink900} stroke={C.cyanSoft} strokeWidth={2} />
          <text
            x={(x1 + xOf(16)) / 2}
            y={y + 11}
            textAnchor="middle"
            fontFamily={FONT.sans}
            fontSize={TYPE.label}
            fontWeight={750}
            fill={C.cyanSoft}
          >
            10 min
          </text>
        </g>
      ) : null}
    </g>
  );
}

function RuleCard({
  frame,
  ruleAt,
  clauseAt,
  alertAt,
  dim,
}: {
  frame: number;
  ruleAt: number;
  clauseAt: number[];
  alertAt: number;
  dim: number;
}) {
  const inP = progress(frame, ruleAt + 2, 16);
  if (inP <= 0) return null;
  // Centred at full size while it is the focus, then it shrinks to the left to make room for the alert.
  const slide = progress(frame, alertAt - 16, 16, EASE.inOut);
  const left = mix((STAGE.width - RULE_BOX.w) / 2, 0, slide);
  const scale = mix(1, RULE_SCALE, slide);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: STAGE.height - RULE_BOX.h,
        width: RULE_BOX.w,
        height: RULE_BOX.h,
        opacity: inP * dim,
        transformOrigin: '0 100%',
        transform: `translateY(${(1 - inP) * 36}px) scale(${scale})`,
      }}
    >
      <Panel
        title="Regla de correlación"
        icon="link"
        glow={progress(frame, clauseAt[0], 10) * (1 - progress(frame, alertAt, 12))}
        style={{ width: RULE_BOX.w, height: RULE_BOX.h }}
      >
        <div style={{ position: 'absolute', left: 14, right: 14, top: 12, display: 'grid', gap: 3 }}>
          {RULE.map((tokens, index) => {
            const lit = progress(frame, clauseAt[index], 8);
            const next = index + 1 < clauseAt.length ? clauseAt[index + 1] : alertAt;
            const current = frame >= clauseAt[index] ? 1 - progress(frame, next, 10) : 0;
            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  padding: '2px 12px',
                  borderRadius: 10,
                  background: alpha(C.cyan, 0.12 * current),
                  opacity: 0.38 + 0.62 * lit,
                }}
              >
                {current > 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 7,
                      bottom: 7,
                      width: 4,
                      borderRadius: 2,
                      background: alpha(C.cyan, current),
                    }}
                  />
                ) : null}
                <MonoLine tokens={tokens} size={TYPE.label} style={{ lineHeight: 1.3 }} />
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function AlertCard({ frame, fps, alertAt }: { frame: number; fps: number; alertAt: number }) {
  // Lands just after the rule card has cleared the right half.
  const inP = springIn(frame, fps, alertAt + 2, { damping: 15, mass: 0.8 });
  const shown = progress(frame, alertAt + 2, 10);
  if (shown <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: ALERT_BOX.x,
        top: BOTTOM_Y,
        width: ALERT_BOX.w,
        height: BOTTOM_H,
        opacity: shown,
        // Scale-in (not a slide) so nothing is drawn outside the stage while it lands.
        transform: `scale(${0.93 + 0.07 * Math.min(1, inP)})`,
      }}
    >
      <Panel
        title="Alerta de correlación"
        icon="bell"
        accent="rose"
        glow={0.45 + 0.35 * progress(frame, alertAt + 4, 14)}
        right={<span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.muted }}>{clock(16)}</span>}
        style={{ width: ALERT_BOX.w, height: BOTTOM_H }}
      >
        <div style={{ position: 'absolute', left: 18, right: 18, top: 8, display: 'grid', gap: 3 }}>
          {ALERT_FIELDS.map((field) => {
            const at = alertAt + field.delay;
            const value = progress(frame, at, 10);
            const glow = bump(frame, at, 16);
            return (
              <div
                key={field.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 40,
                  gap: 14,
                  padding: '0 12px',
                  borderRadius: 12,
                  background: alpha(C.rose, 0.1 * glow),
                  fontFamily: FONT.sans,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 286, flexShrink: 0, fontSize: 32, fontWeight: 750, color: value > 0 ? C.text : C.muted }}>
                  {field.label}
                </span>
                <div style={{ position: 'relative', flex: 1, height: 40, display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: 180,
                      height: 10,
                      borderRadius: 5,
                      background: C.ink700,
                      opacity: 1 - value,
                    }}
                  />
                  <div style={{ opacity: value, transform: `translateX(${(1 - value) * 18}px)` }}>
                    {field.value ? (
                      <span style={{ fontSize: 28, fontWeight: 650, color: C.textStrong }}>{field.value}</span>
                    ) : (
                      <SeverityBadge level="ALTA" size={28} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
