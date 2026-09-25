import type { ReactNode } from 'react';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../theme/tokens';
import { EASE, fadeIn, progress } from '../../../theme/motion';
import { Chip, Icon, Panel, cubicLength, cubicPath, type Point } from '../../../ui';
import { FLOW_END, FLOW_START, GAP_MIN, LOGON } from '../../../data/s09-pivot';

const AXIS_X = 172;
const CARD_X = 204;
const TOP = 10;
const ROW_H = 64;
const EXPAND_H = 110;
const GAP = 14;
const TIME_W = 104;

/** One timeline card: time column + content, in a ROW_H band. */
function RowCard({
  top,
  width,
  height,
  time,
  timeColor,
  border,
  background,
  glow = 0,
  glowColor = C.amber,
  opacity = 1,
  children,
  detail,
}: {
  top: number;
  width: number;
  height: number;
  time: string;
  timeColor: string;
  border: string;
  background: string;
  glow?: number;
  glowColor?: string;
  opacity?: number;
  children: ReactNode;
  detail?: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: CARD_X,
        top,
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: 16,
        border,
        background,
        boxShadow: glow > 0 ? `0 0 ${16 + 24 * glow}px ${alpha(glowColor, 0.3 * glow)}` : 'none',
        overflow: 'hidden',
        opacity,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ height: ROW_H - 4, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', whiteSpace: 'nowrap' }}>
        <span style={{ width: TIME_W - 16, fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: timeColor, flexShrink: 0 }}>{time}</span>
        {children}
      </div>
      {detail}
    </div>
  );
}

/**
 * The case timeline for srv-tc-app03: the two NetFlow facts from S08 (02:00,
 * 04:30) are there from the start; the search fills the empty 01:52 slot with
 * the correlated 4624 logon, which then expands to show where it came from,
 * and an arc measures the 8 minutes to the start of the transfer.
 */
export function CaseTimeline({
  frame,
  width,
  height,
  runAt,
  correlateAt,
  logonAt,
  admAt,
  privAt,
  linkAt,
  row2Lit,
  dim,
}: {
  frame: number;
  width: number;
  height: number;
  runAt: number;
  correlateAt: number;
  logonAt: number;
  admAt: number;
  privAt: number;
  linkAt: number;
  row2Lit: number;
  dim: number;
}) {
  const cardW = width - 4 - CARD_X - 22;
  const fill = progress(frame, logonAt, 14);
  const expand = progress(frame, admAt, 18, EASE.inOut);
  const run = fadeIn(frame, runAt, 12);
  const row1H = ROW_H + EXPAND_H * expand;
  const row2Top = TOP + row1H + GAP;
  const row3Top = row2Top + ROW_H + GAP;
  const y1 = TOP + ROW_H / 2;
  const y2 = row2Top + ROW_H / 2;
  const y3 = row3Top + ROW_H / 2;

  const link = progress(frame, correlateAt, 30, EASE.inOut);
  const arc: [Point, Point, Point, Point] = [
    { x: AXIS_X - 16, y: y1 },
    { x: 46, y: y1 },
    { x: 46, y: y2 },
    { x: AXIS_X - 16, y: y2 },
  ];
  const arcLen = cubicLength(arc);
  const arcDraw = progress(frame, linkAt, 18, EASE.inOut);
  const arcLabel = progress(frame, linkAt + 10, 14, EASE.out);
  const flowCard = { border: `2px solid ${alpha(C.amber, 0.45 + 0.1 * run)}`, background: alpha(C.amber, 0.05 + 0.03 * run) };

  return (
    <Panel
      title="Línea de tiempo · srv-tc-app03"
      icon="clock"
      accent="cyan"
      right={
        <div style={{ display: 'flex', gap: 10, opacity: run }}>
          <Chip accent="cyan" icon="key" size={TYPE.small}>
            autenticación
          </Chip>
          <Chip accent="cyan" icon="network" size={TYPE.small}>
            NetFlow
          </Chip>
        </div>
      }
      style={{ width, height, opacity: dim, boxSizing: 'border-box' }}
    >
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {/* Axis: flow facts joined from the start; the logon link draws as the SIEM correlates. */}
        <line x1={AXIS_X} x2={AXIS_X} y1={y2} y2={y3} stroke={alpha(C.amber, 0.5)} strokeWidth={3} />
        <line x1={AXIS_X} x2={AXIS_X} y1={y1} y2={y2} stroke={C.ink600} strokeWidth={3} strokeDasharray="6 8" opacity={1 - fill} />
        <line x1={AXIS_X} x2={AXIS_X} y1={y2} y2={y2 + (y1 - y2) * link} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
        {/* 8-minute arc */}
        {arcDraw > 0 ? (
          <path
            d={cubicPath(arc)}
            fill="none"
            stroke={C.cyan}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${arcLen}`}
            strokeDashoffset={arcLen * (1 - arcDraw)}
          />
        ) : null}
        {/* Dots */}
        <circle cx={AXIS_X} cy={y1} r={11} fill={fill > 0.5 ? C.rose : C.ink900} stroke={fill > 0.5 ? C.roseSoft : C.ink600} strokeWidth={3} strokeDasharray={fill > 0.5 ? undefined : '4 4'} />
        {fill > 0 ? <circle cx={AXIS_X} cy={y1} r={11 + 14 * fill} fill="none" stroke={alpha(C.rose, 0.5 * (1 - fill))} strokeWidth={3} /> : null}
        <circle cx={AXIS_X} cy={y2} r={10} fill={C.amber} />
        <circle cx={AXIS_X} cy={y3} r={10} fill={C.amber} />
      </svg>

      {/* 8 min label at the apex of the arc */}
      {arcLabel > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 78,
            top: (y1 + y2) / 2,
            transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * arcLabel})`,
            opacity: Math.min(1, arcLabel * 1.5),
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: RADIUS.pill,
            background: C.ink900,
            border: `2px solid ${C.cyan}`,
            boxShadow: `0 0 24px ${alpha(C.cyan, 0.3)}`,
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 850,
            color: C.textStrong,
            whiteSpace: 'nowrap',
          }}
        >
          {GAP_MIN} min
        </div>
      ) : null}

      {/* Row 1: empty slot, filled by the correlated logon. */}
      {fill < 1 ? (
        <RowCard
          top={TOP}
          width={cardW}
          height={ROW_H}
          time="--:--"
          timeColor={C.faint}
          border={`2px dashed ${C.ink600}`}
          background={alpha(C.ink850, 0.6)}
          opacity={1 - fill}
        >
          <span style={{ fontSize: 30, color: C.muted, fontWeight: 550 }}>¿qué pasó antes de las 02:00?</span>
        </RowCard>
      ) : null}
      {fill > 0 ? (
        <RowCard
          top={TOP}
          width={cardW}
          height={row1H}
          time={LOGON.time}
          timeColor={C.roseSoft}
          border={`2px solid ${alpha(C.rose, 0.85)}`}
          background={`linear-gradient(90deg, ${alpha(C.rose, 0.18)} 0%, ${alpha(C.rose, 0.06)} 100%)`}
          glow={fill * 0.8}
          glowColor={C.rose}
          opacity={fill}
          detail={
            <div style={{ padding: `2px 22px 0 ${22 + TIME_W}px`, opacity: expand }}>
              <div style={{ height: 2, background: alpha(C.rose, 0.3), marginBottom: 10 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap', opacity: fadeIn(frame, admAt + 4, 12) }}>
                <Icon name="desktop" size={30} color={C.roseSoft} />
                <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: C.textStrong }}>{LOGON.origin}</span>
                <span style={{ fontSize: TYPE.label, color: C.text, fontWeight: 650 }}>({LOGON.originRole})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, whiteSpace: 'nowrap', opacity: fadeIn(frame, privAt, 12) }}>
                <Icon name="network" size={28} color={C.muted} />
                <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.text }}>{LOGON.originIp}</span>
                <span style={{ color: C.faint, fontSize: TYPE.small }}>·</span>
                <Chip accent="rose" icon="key" size={TYPE.small}>
                  {LOGON.privId}
                </Chip>
                <span style={{ fontSize: 28, color: C.text, fontWeight: 600 }}>{LOGON.privLabel}</span>
              </div>
            </div>
          }
        >
          <Chip accent="rose" size={TYPE.small}>
            {LOGON.eventId}
          </Chip>
          <span style={{ fontSize: TYPE.label, color: C.textStrong, fontWeight: 700 }}>{LOGON.label}</span>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 30,
              fontWeight: 800,
              color: C.roseSoft,
              padding: '2px 10px',
              borderRadius: 8,
              background: alpha(C.rose, 0.16),
            }}
          >
            {LOGON.account}
          </span>
        </RowCard>
      ) : null}

      {/* Rows 2–3: the NetFlow facts already known from the triage. */}
      <RowCard
        top={row2Top}
        width={cardW}
        height={ROW_H}
        time={FLOW_START.time}
        timeColor={C.amber}
        glow={row2Lit}
        {...flowCard}
      >
        <Icon name="network" size={30} color={C.amber} />
        <span style={{ fontSize: TYPE.label, color: C.text, fontWeight: 650 }}>{FLOW_START.label}</span>
        <Icon name="arrowRight" size={28} color={C.amber} strokeWidth={2.4} />
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: '#fcd34d', fontWeight: 700 }}>{FLOW_START.dest}</span>
      </RowCard>
      <RowCard top={row3Top} width={cardW} height={ROW_H} time={FLOW_END.time} timeColor={C.amber} {...flowCard}>
        <Icon name="network" size={30} color={C.amber} />
        <span style={{ fontSize: TYPE.label, color: C.text, fontWeight: 650 }}>{FLOW_END.label}</span>
        <span style={{ color: C.faint, fontSize: TYPE.label }}>·</span>
        <span style={{ fontSize: TYPE.label, color: C.textStrong, fontWeight: 850 }}>{FLOW_END.total}</span>
      </RowCard>
    </Panel>
  );
}

