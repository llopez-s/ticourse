import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { ArrowHead, CardGlyph, INK, Label, VerdictMark, dropGlow, joinFilters, mixHex, resolveFocus, useSvgId } from './glyphs';

/**
 * «Tres carriles» = the three 802.1X roles (canon: out/scene-brief.md «Visual metaphors»), drawn as
 * three HORIZONTAL swimlanes stacked top to bottom — equipo · supplicant, switch de acceso ·
 * authenticator, RADIUS · authentication server — the lesson's diagram (sp3-part3.ts:78-104) turned on
 * its side so it fits the 16:9 stage: time runs left to right and every message is a VERTICAL arrow
 * between two lanes. s03 builds it step by step; s04 reuses it with «EAP» riding the arrows and the
 * two endings.
 *
 * The switch port (`SwitchPort`) sits on the switch lane right where the device's arrow lands: the
 * request goes DOWN through it to RADIUS (ask + relay are one vertical line through the port), RADIUS
 * looks it up in «el directorio» (check, a horizontal arrow on its own lane), and the answer comes back
 * UP into the port («accept · reject», its own weight, 0 by default so it can't leak before s03's
 * think answer). The slot to the right of the port says what the port is doing: first «cerrado · solo
 * pasa la autenticación (EAPOL)», then the ending (`PortVerdict`): Access-Accept or Access-Reject.
 *
 * Layout is in px (not a uniform scale) so text stays at its size when a scene squeezes the lanes
 * (`laneHeight`) to clear the think card: `roleLanesLayout()` returns every box and anchor. Nothing is
 * positioned and nothing reads the timeline except the optional `frame` (for the flowing dash).
 */

/** Canon strings (out/scene-brief.md), exactly. */
export const ROLE_LANES_TEXT = {
  device: { name: 'equipo', term: 'supplicant' },
  switch: { name: 'switch de acceso', term: 'authenticator' },
  radius: { name: 'RADIUS', term: 'authentication server' },
  closed: { head: 'cerrado', rest: 'solo pasa la autenticación (EAPOL)' },
  switchNote: 'abre o cierra la toma',
  answer: { accept: 'accept', reject: 'reject' },
  directory: 'el directorio',
  eap: 'EAP',
  accept: { title: 'Access-Accept', caption: 'puerto abierto · y la VLAN de su zona' },
  reject: { title: 'Access-Reject', caption: 'puerto cerrado · o VLAN de cuarentena, solo para que lo arreglen' },
} as const;

export type LaneId = 'device' | 'switch' | 'radius';
export const LANE_ORDER: readonly LaneId[] = ['device', 'switch', 'radius'];
export type Outcome = 'accept' | 'reject';

/** Colours: requests and the port's systems cyan; the closed port amber; endings emerald / rose. */
export const LANE_TONE = { device: C.cyan, switch: C.cyan, radius: C.cyan } as const;

// ---------------------------------------------------------------------------
// Layout

export interface RoleLanesLayoutOptions {
  width?: number;
  laneHeight?: number;
  gap?: number;
  labelWidth?: number;
}

type Box = { x: number; y: number; w: number; h: number; cy: number };

/**
 * Every box and anchor of a RoleLanes in px from its top-left. `port` is the port's centre; `status`
 * the left-centre of the slot right of the port (closed label / verdict; `maxWidth` = room up to the
 * right edge); `arrows.*` the x and y ends of each message; `directory` its centre; `answerLabel` the
 * top-left of «accept · reject»; `note` the top-left of the switch's note under its name.
 */
export function roleLanesLayout({ width = 1728, laneHeight = 196, gap = 14, labelWidth = 500 }: RoleLanesLayoutOptions = {}) {
  const lane = (i: number): Box => {
    const y = i * (laneHeight + gap);
    return { x: 0, y, w: width, h: laneHeight, cy: y + laneHeight / 2 };
  };
  const lanes = { device: lane(0), switch: lane(1), radius: lane(2) };
  const height = 3 * laneHeight + 2 * gap;
  const trackX = labelWidth + 24;
  const portSize = Math.min(96, laneHeight * 0.5);
  const port = { x: trackX + 74, y: lanes.switch.cy, size: portSize };
  const top = port.y - portSize / 2 - 6;
  const bottom = port.y + portSize / 2 + 6;
  const lineL = port.x - portSize * 0.18;
  const lineR = port.x + portSize * 0.18;
  const statusX = port.x + portSize / 2 + 30;
  const radiusLife = lanes.radius.y + laneHeight * 0.62;
  const directory = { x: Math.min(width - 260, port.x + 470), y: radiusLife, size: Math.min(84, laneHeight * 0.48) };
  return {
    width,
    height,
    laneHeight,
    gap,
    labelWidth,
    lanes,
    trackX,
    /** Each lane's lifeline y (the device's and the switch's are the lane centres; RADIUS's sits lower, under «accept · reject»). */
    life: { device: lanes.device.cy, switch: lanes.switch.cy, radius: radiusLife },
    header: {
      icon: (id: LaneId) => ({ x: 22 + 38, y: lanes[id].cy, size: 76 }),
      textX: 22 + 76 + 22,
    },
    port,
    status: { x: statusX, y: lanes.switch.cy, maxWidth: Math.max(240, width - statusX - 28) },
    arrows: {
      ask: { x: lineL, y1: lanes.device.cy, y2: top },
      relay: { x: lineL, y1: bottom, y2: radiusLife },
      answer: { x: lineR, y1: radiusLife, y2: bottom },
      check: { x1: lineR + 34, x2: directory.x - directory.size / 2 - 14, y: radiusLife },
    },
    directory,
    answerLabel: { x: lineR + 44, y: lanes.radius.y + Math.max(8, laneHeight * 0.06) },
    note: { x: 22 + 76 + 22, y: lanes.switch.cy },
    /** Where the request token sits once its arrow is drawn (midpoints of ask and relay). */
    tokens: {
      ask: { x: lineL, y: (lanes.device.cy + top) / 2 },
      relay: { x: lineL, y: (bottom + radiusLife) / 2 },
    },
  };
}

export type RoleLanesLayout = ReturnType<typeof roleLanesLayout>;

/** Size of a RoleLanes for the given options. */
export function roleLanesSize(opts: RoleLanesLayoutOptions = {}) {
  const l = roleLanesLayout(opts);
  return { w: l.width, h: l.height };
}

// ---------------------------------------------------------------------------
// Glyphs: the switch, the port, the directory

/** The access switch (front panel with its ports), 24×24 grid like the engine's icons. */
export function SwitchGlyph({ size, color, strokeWidth = 1.8 }: { size: number; color: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <rect x="2" y="7" width="20" height="10" rx="1.8" />
      <path d="M5 13.5h2v-2H5zM8.5 13.5h2v-2h-2zM12 13.5h2v-2h-2zM15.5 13.5h2v-2h-2z" />
      <path d="M5 9.4h.01M7 9.4h.01" />
    </svg>
  );
}

/**
 * The switch port the cable plugs into, `size` px square. `open` 0 = shut behind a shutter with a thin
 * slit (only authentication passes: EAPOL), 1 = open (the socket's mouth glows). `color` tints it
 * (amber closed, emerald open, rose refused — RoleLanes interpolates it). `cross` 0–1 adds a rose
 * cross over the shutter (Access-Reject).
 */
export function SwitchPort({ size = 96, open = 0, color = C.amber, cross = 0, show = 1, glow = 0, style }: { size?: number; open?: number; color?: string; cross?: number; show?: number; glow?: number; style?: CSSProperties }) {
  const id = useSvgId('port');
  const o = clamp01(open);
  const s = clamp01(show);
  const k = size / 96;
  const sw = Math.max(2.4, 3.4 * k);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      style={{ display: 'block', overflow: 'visible', opacity: s, filter: joinFilters(dropGlow(color, clamp01(glow))), ...style }}
    >
      <defs>
        <clipPath id={`${id}-mouth`}>
          <path d="M 22 28 L 74 28 L 74 66 L 58 66 L 58 74 L 38 74 L 38 66 L 22 66 Z" />
        </clipPath>
      </defs>
      {/* Housing (the switch's face around the socket) */}
      <rect x={4} y={4} width={88} height={88} rx={14} fill={C.ink850} stroke={color} strokeWidth={sw / k} />
      {/* The socket's mouth (RJ45 outline with its key) */}
      <path d="M 22 28 L 74 28 L 74 66 L 58 66 L 58 74 L 38 74 L 38 66 L 22 66 Z" fill={alpha(color, 0.12 + 0.3 * o)} stroke={color} strokeWidth={(sw * 0.8) / k} strokeLinejoin="round" />
      {/* Contacts, lit when open */}
      <path d="M 30 32 L 30 42 M 37 32 L 37 42 M 44 32 L 44 42 M 51 32 L 51 42 M 58 32 L 58 42 M 65 32 L 65 42" stroke={alpha(color, 0.35 + 0.6 * o)} strokeWidth={(2.2 * Math.max(1, 1 / k)) / 1} strokeLinecap="round" />
      {/* Shutter, sliding up as it opens; a slit lets authentication through */}
      {o < 0.999 ? (
        <g clipPath={`url(#${id}-mouth)`}>
          <g transform={`translate(0 ${-48 * o})`}>
            <rect x={20} y={26} width={56} height={50} fill={C.ink800} stroke={color} strokeWidth={(sw * 0.7) / k} />
            <path d="M 20 40 L 76 40 M 20 54 L 76 54" stroke={alpha(color, 0.45)} strokeWidth={1.6 / Math.max(0.6, k)} />
            <rect x={30} y={45} width={36} height={4} rx={2} fill={alpha(color, 0.9)} />
          </g>
        </g>
      ) : null}
      {cross > 0.01 ? (
        <path d="M 30 32 L 66 68 M 66 32 L 30 68" stroke={C.rose} strokeWidth={6 / Math.max(0.7, k)} strokeLinecap="round" opacity={clamp01(cross)} />
      ) : null}
    </svg>
  );
}

/** «el directorio»: a card index with rows; `sweep` 0–1 runs a highlight down to the found row; `found` marks it. */
export function DirectoryGlyph({ size, color = C.cyan, sweep = 0, found, foundShow = 0 }: { size: number; color?: string; sweep?: number; found?: 'yes' | 'no'; foundShow?: number }) {
  const rows = [0, 1, 2, 3];
  const sw = clamp01(sweep);
  const target = 2;
  const hy = 30 + Math.min(target, sw * (target + 0.999)) * 15;
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={10} y={8} width={76} height={82} rx={8} fill={C.ink850} stroke={color} strokeWidth={3.6} />
      <rect x={10} y={8} width={76} height={16} rx={8} fill={alpha(color, 0.3)} />
      {sw > 0.01 ? <rect x={14} y={hy - 6} width={68} height={13} rx={4} fill={alpha(found === 'no' ? C.rose : found === 'yes' ? C.emerald : color, 0.35)} /> : null}
      {rows.map((r) => (
        <g key={r}>
          <rect x={20} y={27 + r * 15} width={8} height={8} rx={2} fill={alpha(color, 0.55)} />
          <line x1={34} y1={31 + r * 15} x2={r % 2 ? 66 : 74} y2={31 + r * 15} stroke={alpha(color, 0.75)} strokeWidth={3.4} strokeLinecap="round" />
        </g>
      ))}
      {found && foundShow > 0.01 ? <VerdictMark x={84} y={86} r={15} kind={found} show={foundShow} /> : null}
    </svg>
  );
}

/** The «EAP» frame riding an arrow (a violet pill: an exam term). `size` = font px. */
export function EapChip({ size = 32, show = 1, style }: { size?: number; show?: number; style?: CSSProperties }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color: INK.violetSoft,
        background: C.ink900,
        border: `3px solid ${C.violet}`,
        borderRadius: 999,
        padding: `${size * 0.22}px ${size * 0.45}px`,
        boxShadow: `0 0 ${14 * s}px ${alpha(C.violet, 0.45 * s)}`,
        opacity: s,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {ROLE_LANES_TEXT.eap}
    </div>
  );
}

/**
 * The port with its ending, standalone (s04 can lay both endings side by side): the port glyph, the
 * exam term («Access-Accept» emerald / «Access-Reject» rose, 44 px) and the canon caption (32 px)
 * wrapping inside `width`. `show` fades it in; the port opens with it on accept.
 */
export function PortVerdict({ kind, show = 1, width = 640, portSize = 96, titleSize = 44, captionSize = 32, port = true, style }: { kind: Outcome; show?: number; width?: number; portSize?: number; titleSize?: number; captionSize?: number; port?: boolean; style?: CSSProperties }) {
  const s = clamp01(show);
  const t = ROLE_LANES_TEXT[kind];
  const col = kind === 'accept' ? C.emerald : C.rose;
  const soft = kind === 'accept' ? INK.emeraldSoft : C.roseSoft;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, width, opacity: s, ...style }}>
      {port ? <SwitchPort size={portSize} open={kind === 'accept' ? s : 0} color={col} cross={kind === 'reject' ? s : 0} glow={0.6 * s} /> : null}
      <div style={{ fontFamily: FONT.sans, minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: titleSize, fontWeight: 850, color: soft, lineHeight: 1.08, letterSpacing: -0.4 }}>{t.title}</div>
        <div style={{ fontSize: captionSize, fontWeight: 700, color: C.text, lineHeight: 1.18, marginTop: 6 }}>{t.caption}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RoleLanes

export interface RoleLanesProps extends RoleLanesLayoutOptions {
  /** 0–1 the three lanes come in (device, switch, RADIUS, staggered). Default 1. */
  draw?: number;
  /** 0–1 the port appears shut + «cerrado · solo pasa la autenticación (EAPOL)». */
  closed?: number;
  /** 0–1 the device's request drawn down into the port (a card rides it: «dice quién es»). */
  ask?: number;
  /** 0–1 the switch passes it down to RADIUS. */
  relay?: number;
  /** 0–1 RADIUS looks it up in «el directorio» (arrow + a highlight down the index). */
  check?: number;
  /** 0–1 the answer back up into the port, «accept · reject». Keep 0 until s03's `decides`. */
  answer?: number;
  /** 0–1 «abre o cierra la toma» under the switch's name. */
  switchNote?: number;
  /** 0–1 the token on ask/relay turns from the accreditation card into «EAP» (s04). */
  eap?: number;
  /** Which ending `verdict` shows. */
  outcome?: Outcome;
  /** 0–1 the ending: port opens (emerald) or stays shut (rose), the status slot swaps to PortVerdict, RADIUS and the directory take the colour, the chosen word of «accept · reject» lights. */
  verdict?: number;
  /** Per-lane glow; with `autoDim` the other lanes step back. */
  focus?: Partial<Record<LaneId, number>>;
  dim?: Partial<Record<LaneId, number>>;
  autoDim?: boolean;
  /** 0–1 hides the request token (card / EAP) on the arrows. Default 1 (shown). */
  tokens?: number;
  /** Extra content per lane, drawn in the lane's track (px from the lanes' top-left; use the layout). */
  children?: ReactNode;
  frame?: number;
  style?: CSSProperties;
}

export function RoleLanes({
  width = 1728,
  laneHeight = 196,
  gap = 14,
  labelWidth = 500,
  draw = 1,
  closed = 0,
  ask = 0,
  relay = 0,
  check = 0,
  answer = 0,
  switchNote = 0,
  eap = 0,
  outcome = 'accept',
  verdict = 0,
  focus = {},
  dim = {},
  autoDim = true,
  tokens = 1,
  children,
  frame: frameProp,
  style,
}: RoleLanesProps) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const L = roleLanesLayout({ width, laneHeight, gap, labelWidth });
  const fx = resolveFocus(LANE_ORDER, focus, dim, autoDim);
  const v = clamp01(verdict);
  const accept = outcome === 'accept';
  const verdictCol = accept ? C.emerald : C.rose;
  const cl = clamp01(closed);
  const portCol = mixHex(C.amber, verdictCol, v);
  const radiusCol = mixHex(LANE_TONE.radius, verdictCol, v);
  const laneIn = (i: number) => progress(clamp01(draw) * 100, i * 22, 56, EASE.out);

  // ---- Lane bands, headers ----------------------------------------------------
  const headers = LANE_ORDER.map((id, i) => {
    const box = L.lanes[id];
    const inW = laneIn(i);
    const f = fx[id];
    const col = id === 'radius' ? radiusCol : LANE_TONE[id];
    const ic = L.header.icon(id);
    const noteW = id === 'switch' ? clamp01(switchNote) : 0;
    const textTop = box.cy - 44 - 21 * noteW;
    const opacity = inW * (1 - 0.6 * f.dim);
    const filter = joinFilters(dropGlow(col, f.focus * 0.9), f.dim > 0.01 ? `saturate(${1 - 0.5 * f.dim})` : '');
    return (
      <div key={id} style={{ position: 'absolute', left: 0, top: box.y, width, height: box.h, opacity, filter, transform: inW < 1 ? `translateX(${(1 - inW) * -24}px)` : undefined }}>
        {/* Band */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            background: alpha(C.ink850, 0.88),
            border: `2.5px solid ${alpha(col, 0.28 + 0.5 * f.focus)}`,
          }}
        />
        {/* Header separator */}
        <div style={{ position: 'absolute', left: labelWidth, top: 18, bottom: 18, width: 2, background: alpha(col, 0.22) }} />
        {/* Icon tile */}
        <div
          style={{
            position: 'absolute',
            left: ic.x - ic.size / 2,
            top: ic.y - box.y - ic.size / 2,
            width: ic.size,
            height: ic.size,
            borderRadius: 18,
            background: alpha(col, 0.12),
            border: `3px solid ${alpha(col, 0.75)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {id === 'device' ? <Icon name="laptop" size={48} color={col} strokeWidth={2} /> : id === 'switch' ? <SwitchGlyph size={52} color={col} /> : <Icon name="server" size={46} color={col} strokeWidth={2} />}
        </div>
        {/* Name + exam term (the canon «name · term», stacked: both halves verbatim) */}
        <div style={{ position: 'absolute', left: L.header.textX, top: textTop - box.y, width: labelWidth - L.header.textX - 12, fontFamily: FONT.sans }}>
          <div style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, lineHeight: 1.12, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>{ROLE_LANES_TEXT[id].name}</div>
          <div style={{ fontSize: 32, fontWeight: 750, color: INK.violetSoft, lineHeight: 1.18, whiteSpace: 'nowrap' }}>{ROLE_LANES_TEXT[id].term}</div>
          {id === 'switch' && noteW > 0.01 ? (
            <div style={{ fontSize: 32, fontWeight: 750, color: C.cyanSoft, lineHeight: 1.2, whiteSpace: 'nowrap', opacity: noteW, marginTop: 2 }}>{ROLE_LANES_TEXT.switchNote}</div>
          ) : null}
        </div>
      </div>
    );
  });

  // ---- Messages (SVG over the lanes) -------------------------------------------
  const a = L.arrows;
  const vline = (x: number, y1: number, y2: number, w: number, col: string, key: string) => {
    const k = clamp01(w);
    if (k <= 0.01) return null;
    const yEnd = y1 + (y2 - y1) * k;
    const dir = y2 > y1 ? Math.PI / 2 : -Math.PI / 2;
    return (
      <g key={key}>
        <line x1={x} y1={y1} x2={x} y2={yEnd} stroke={col} strokeWidth={5} strokeLinecap="round" />
        <ArrowHead x={x} y={yEnd + (y2 > y1 ? 4 : -4)} angle={dir} size={20} color={col} />
      </g>
    );
  };
  const reqCol = C.cyan;
  const ansCol = mixHex(C.text, verdictCol, v);
  const ck = clamp01(check);
  const lifeOpacity = (i: number) => laneIn(i) * 0.5;

  const svg = (
    <svg width={width} height={L.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {/* Lifelines (faint, dashed) */}
      {LANE_ORDER.map((id, i) => (
        <line key={id} x1={L.trackX + 10} y1={L.life[id]} x2={width - 28} y2={L.life[id]} stroke={alpha(C.muted, 0.5)} strokeWidth={2} strokeDasharray="6 12" opacity={lifeOpacity(i) * (1 - 0.6 * fx[id].dim)} />
      ))}
      {/* The cable from the device's lane down to the port, faint until the request runs on it */}
      {cl > 0.01 ? <line x1={a.ask.x} y1={a.ask.y1} x2={a.ask.x} y2={a.ask.y2} stroke={alpha(C.muted, 0.4)} strokeWidth={3} strokeDasharray="4 8" opacity={cl} /> : null}
      <g opacity={1 - 0.6 * Math.max(fx.device.dim, fx.switch.dim) * 0.6}>{vline(a.ask.x, a.ask.y1, a.ask.y2, ask, reqCol, 'ask')}</g>
      <g opacity={1 - 0.6 * Math.max(fx.switch.dim, fx.radius.dim) * 0.6}>{vline(a.relay.x, a.relay.y1, a.relay.y2, relay, reqCol, 'relay')}</g>
      {/* Check: RADIUS → the directory */}
      {ck > 0.01 ? (
        <g opacity={1 - 0.6 * fx.radius.dim}>
          <line x1={a.check.x1} y1={a.check.y} x2={a.check.x1 + (a.check.x2 - a.check.x1) * ck} y2={a.check.y} stroke={reqCol} strokeWidth={5} strokeLinecap="round" />
          <ArrowHead x={a.check.x1 + (a.check.x2 - a.check.x1) * ck + 4} y={a.check.y} angle={0} size={20} color={reqCol} />
        </g>
      ) : null}
      {/* Answer: RADIUS → the port */}
      <g opacity={1 - 0.6 * Math.max(fx.switch.dim, fx.radius.dim) * 0.6}>{vline(a.answer.x, a.answer.y1, a.answer.y2, answer, ansCol, 'answer')}</g>
      {/* The relay's foot: a dot where RADIUS receives it */}
      {relay > 0.98 ? <circle cx={a.relay.x} cy={a.relay.y2} r={8} fill={reqCol} /> : null}
    </svg>
  );

  // ---- Tokens riding the requests (card → EAP) ----------------------------------------
  const e = clamp01(eap);
  const tok = clamp01(tokens);
  const token = (w: number, at: { x: number; y: number }, from: { x: number; y: number }, key: string, laneDim: number) => {
    const k = clamp01(w);
    if (k <= 0.02 || tok <= 0.01) return null;
    const x = from.x + (at.x - from.x) * Math.min(1, k * 1.15);
    const y = from.y + (at.y - from.y) * Math.min(1, k * 1.15);
    return (
      <div key={key} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', opacity: tok * Math.min(1, k * 3) * (1 - 0.5 * laneDim) }}>
        <div style={{ position: 'relative' }}>
          {e < 0.99 ? (
            <svg width={92} height={70} viewBox="-46 -35 92 70" style={{ display: 'block', overflow: 'visible', opacity: 1 - e }}>
              <CardGlyph x={0} y={0} scale={0.92} color={C.cyan} />
            </svg>
          ) : null}
          {e > 0.01 ? (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * e})` }}>
              <EapChip size={32} show={e} />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  // ---- Status slot (closed label → verdict) and «accept · reject» -------------------------
  const st = L.status;
  const closedLabel =
    cl > 0.01 && v < 0.99 ? (
      <Label x={st.x} y={st.y} anchor="left-center" size={34} maxWidth={st.maxWidth} color={C.text} style={{ opacity: cl * (1 - v) * (1 - 0.6 * fx.switch.dim) }}>
        <span style={{ color: INK.amberSoft, fontWeight: 850 }}>{ROLE_LANES_TEXT.closed.head}</span>
        <span style={{ color: alpha(C.muted, 0.9) }}> · </span>
        {ROLE_LANES_TEXT.closed.rest}
      </Label>
    ) : null;
  const verdictLabel =
    v > 0.01 ? (
      <div style={{ position: 'absolute', left: st.x, top: st.y, transform: `translate(${(1 - v) * 16}px, -50%)`, opacity: v * (1 - 0.6 * fx.switch.dim) }}>
        <PortVerdict kind={outcome} port={false} width={st.maxWidth} show={1} titleSize={44} captionSize={32} />
      </div>
    ) : null;
  const ans = clamp01(answer);
  const ansLabel =
    ans > 0.01 ? (
      <Label x={L.answerLabel.x} y={L.answerLabel.y} anchor="left-top" size={38} weight={850} style={{ opacity: Math.min(1, ans * 1.6) * (1 - 0.6 * fx.radius.dim) }}>
        <span style={{ color: INK.emeraldSoft, opacity: accept ? 1 : 1 - 0.65 * v }}>{ROLE_LANES_TEXT.answer.accept}</span>
        <span style={{ color: alpha(C.muted, 0.9) }}> · </span>
        <span style={{ color: C.roseSoft, opacity: accept ? 1 - 0.65 * v : 1 }}>{ROLE_LANES_TEXT.answer.reject}</span>
      </Label>
    ) : null;

  // ---- Port and directory -------------------------------------------------------------------
  const p = L.port;
  const portEl =
    cl > 0.01 ? (
      <div style={{ position: 'absolute', left: p.x - p.size / 2, top: p.y - p.size / 2, opacity: cl * (1 - 0.6 * fx.switch.dim), transform: `scale(${0.85 + 0.15 * cl})` }}>
        <SwitchPort size={p.size} open={accept ? v : 0} color={portCol} cross={accept ? 0 : v} glow={0.35 + 0.65 * fx.switch.focus} />
      </div>
    ) : null;
  const d = L.directory;
  const dirShow = Math.max(ck > 0.01 ? 1 : 0, 0) * Math.min(1, ck * 3);
  const dirEl =
    dirShow > 0.01 ? (
      <>
        <div style={{ position: 'absolute', left: d.x - d.size / 2, top: d.y - d.size / 2, opacity: dirShow * (1 - 0.6 * fx.radius.dim) }}>
          <DirectoryGlyph size={d.size} color={radiusCol} sweep={progress(ck, 0.35, 0.65, EASE.inOut)} found={v > 0.01 ? (accept ? 'yes' : 'no') : undefined} foundShow={v} />
        </div>
        <Label x={d.x + d.size / 2 + 18} y={d.y} anchor="left-center" size={34} color={C.text} style={{ opacity: dirShow * (1 - 0.6 * fx.radius.dim) }}>
          {ROLE_LANES_TEXT.directory}
        </Label>
      </>
    ) : null;

  void frame; // kept for the parts' uniform API (nothing here is frame-driven yet)

  return (
    <div style={{ position: 'relative', width, height: L.height, ...style }}>
      {headers}
      {svg}
      {portEl}
      {dirEl}
      {closedLabel}
      {verdictLabel}
      {ansLabel}
      {token(ask, L.tokens.ask, { x: a.ask.x, y: a.ask.y1 }, 'tok-ask', Math.max(fx.device.dim, fx.switch.dim) * 0.6)}
      {token(relay, L.tokens.relay, { x: a.relay.x, y: a.relay.y1 }, 'tok-relay', Math.max(fx.switch.dim, fx.radius.dim) * 0.6)}
      {children}
    </div>
  );
}
