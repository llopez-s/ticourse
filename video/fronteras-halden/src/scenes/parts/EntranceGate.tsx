import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { clamp01, cubicPoint, mix, type Point } from '../../../../engine/src/ui';
import { CardGlyph, HandsetGlyph, INK, PersonBust, TruckSide, VerdictMark, dropGlow, joinFilters, mixHex, resolveFocus, strokeAt, useSvgId } from './glyphs';

/**
 * «La puerta del recinto» = 802.1X (canon: out/scene-brief.md «Visual metaphors»): the ENTRANCE of the
 * port compound, seen from the side (an elevation, never V16's top-down hut with a barrier arm), left to
 * right in the same order as the three 802.1X roles:
 *
 *   - the DRIVER in a truck cab outside the fence, holding up an accreditation card (`card`);
 *   - the GATEHOUSE (gabled roof, big window) with the GUARD on the phone (`call`): he does not decide;
 *   - the GATE: a sliding gate between two pillars that rolls aside behind the gatehouse only when the
 *     office says yes (`open`); `result` shows the verdict on it (emerald tick / rose cross);
 *   - «la oficina de acreditaciones», inside the fence: a separate building with a sign, the clerk on
 *     the phone and its LIST on the wall (`check` runs down it). The call is an arc from the gatehouse
 *     to the office that lights (`call`); the answer travels back along it (`answer`, emerald yes /
 *     rose no, `verdict`). EAP-TLS: the office shows its OWN accreditation (`officeCard`) and sends it
 *     to the driver along the same line (`officeCardSent`).
 *
 * Every state is an independent 0–1 weight (the gate never opens by itself after the answer: the scene
 * picks the beat). Design units 1000 × 440 scaled to `width`; `entranceGateSize()` / `entranceGatePoint()`
 * give the px box and anchors. Below ~440 px wide it switches to `detail: 'icon'` (no sign text, no
 * mesh, thicker lines) for s10's rule card. Nothing reads the timeline except the optional `frame`.
 */

export const ENTRANCE_GATE_TEXT = { office: ['oficina de', 'acreditaciones'] } as const;

export const GATE_BASE = { w: 1000, h: 440 } as const;
const GROUND = 404;
const TRUCK = { front: 250, scale: 1 } as const;
const CARD = { x: 262, y: 204, scale: 1.2, rest: { x: 196, y: 300, scale: 0.45 } } as const;
const BOOTH = { x0: 312, x1: 500, top: 252, apex: { x: 406, y: 186 }, win: { x: 328, y: 270, w: 156, h: 84 } } as const;
const GATE = { l0: 518, l1: 540, r0: 744, r1: 766, top: 236, panelTop: 282, panelBottom: 394 } as const;
const OFFICE = { x0: 792, x1: 990, top: 246, win: { x: 806, y: 266, w: 90, h: 76 }, list: { x: 906, y: 262, w: 72, h: 92 } } as const;
const FENCE = { top: 334 } as const;
const SIGN_BOTTOM = 218;
const GUARD_SCALE = 1.4;

const P = {
  /** The driver's card at full raise. */
  card: { x: CARD.x, y: CARD.y },
  /** The driver's head in the cab window. */
  driver: { x: TRUCK.front - 440 * TRUCK.scale + 350 * TRUCK.scale, y: GROUND - 200 * TRUCK.scale + 88 * TRUCK.scale },
  truck: { x: 170, y: 330 },
  guard: { x: 416, y: 300 },
  booth: { x: BOOTH.apex.x, y: 300 },
  roof: { x: BOOTH.apex.x, y: BOOTH.apex.y - 6 },
  gate: { x: (GATE.l1 + GATE.r0) / 2, y: (GATE.panelTop + GATE.panelBottom) / 2 },
  office: { x: (OFFICE.x0 + OFFICE.x1) / 2, y: 320 },
  clerk: { x: OFFICE.win.x + 50, y: 300 },
  list: { x: OFFICE.list.x + OFFICE.list.w / 2, y: OFFICE.list.y + OFFICE.list.h / 2 },
  /** The sign's bottom-right corner (it grows up and left from here). */
  sign: { x: OFFICE.x1, y: SIGN_BOTTOM },
  ground: { x: 500, y: GROUND },
} as const;

export type EntranceGatePoint = keyof typeof P | 'line';
export type EntranceGateDetail = 'full' | 'icon';
export type EntranceGateElement = 'driver' | 'guard' | 'gate' | 'office';
const ELEMENTS: readonly EntranceGateElement[] = ['driver', 'guard', 'gate', 'office'];

/** The px box of an EntranceGate `width` px wide. */
export function entranceGateSize(width: number) {
  const scale = width / GATE_BASE.w;
  return { w: width, h: GATE_BASE.h * scale, scale };
}

export function entranceGateDetail(width: number): EntranceGateDetail {
  return width < 440 ? 'icon' : 'full';
}

/** Sign height in design units (two 32-px lines + padding, kept ≥ 32 px on screen). */
function signHeight(scale: number, detail: EntranceGateDetail): number {
  return detail === 'icon' ? 60 : (2 * 32 * 1.12 + 22) / scale;
}

/** The call's arc: gatehouse roof → the office sign's top. */
function callCurve(scale: number, detail: EntranceGateDetail): [Point, Point, Point, Point] {
  const top = SIGN_BOTTOM - signHeight(scale, detail);
  const a = { x: BOOTH.apex.x + 4, y: BOOTH.apex.y - 8 };
  const b = { x: OFFICE.x1 - 70, y: top - 4 };
  // Keep the arc inside the part's box (the sign is taller in design units at small widths).
  const peak = Math.max(6, Math.min(a.y, b.y) - 110);
  return [a, { x: a.x + 110, y: peak }, { x: b.x - 150, y: peak }, b];
}

/**
 * An anchor in px from the EntranceGate's top-left: 'card' (the driver's raised card), 'driver',
 * 'truck', 'guard', 'booth', 'roof' (where the call leaves), 'gate' (centre of the gate panel),
 * 'office', 'clerk', 'list', 'sign' (bottom-right of the sign), 'ground', 'line' (top of the call arc).
 */
export function entranceGatePoint(width: number, which: EntranceGatePoint): { x: number; y: number } {
  const { scale } = entranceGateSize(width);
  const detail = entranceGateDetail(width);
  const p = which === 'line' ? cubicPoint(callCurve(scale, detail), 0.5) : P[which];
  return { x: p.x * scale, y: p.y * scale };
}

export interface EntranceGateProps {
  width: number;
  /** 0–1 the driver raises the card to the gatehouse window. Default 1. */
  card?: number;
  /** 0–1 the guard lifts the handset and the line to the office lights (drawn gatehouse → office). */
  call?: number;
  /** 0–1 the office runs down its list. */
  check?: number;
  /** 0–1 the answer travels back along the line and lands on the gatehouse. */
  answer?: number;
  /** What the office says. Default 'yes'. */
  verdict?: 'yes' | 'no';
  /** 0–1 the gate rolls aside (behind the gatehouse). Independent of the answer: the scene picks it. */
  open?: number;
  /** 0–1 the verdict on the gate: emerald tick and glow (yes) / rose cross and glow (no). */
  result?: number;
  /** 0–1 EAP-TLS: the clerk holds up the office's own accreditation. */
  officeCard?: number;
  /** 0–1 that card travels along the line to the driver (lands beside the driver's own card). */
  officeCardSent?: number;
  /** Per-element glow; with `autoDim` the others step back. */
  focus?: Partial<Record<EntranceGateElement, number>>;
  dim?: Partial<Record<EntranceGateElement, number>>;
  autoDim?: boolean;
  /** Show the office's sign text (default true at full detail). */
  sign?: boolean;
  detail?: EntranceGateDetail;
  glow?: number;
  /** Whole-part dim (e.g. s10's rule card stepping back). */
  dimAll?: number;
  /** Frame (Sequence-relative) the part pops in; omitted = on screen. */
  at?: number;
  frame?: number;
  style?: CSSProperties;
}

export function EntranceGate({
  width,
  card = 1,
  call = 0,
  check = 0,
  answer = 0,
  verdict = 'yes',
  open = 0,
  result = 0,
  officeCard = 0,
  officeCardSent = 0,
  focus = {},
  dim = {},
  autoDim = true,
  sign = true,
  detail: detailProp,
  glow = 0,
  dimAll = 0,
  at,
  frame: frameProp,
  style,
}: EntranceGateProps) {
  const id = useSvgId('egate');
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { h, scale: s } = entranceGateSize(width);
  const detail = detailProp ?? entranceGateDetail(width);
  const icon = detail === 'icon';
  const sw = strokeAt(s);
  const lw = sw(3.4, icon ? 1.8 : 2);
  const thin = sw(2.2, icon ? 1.2 : 1.2);
  const fx = resolveFocus(ELEMENTS, focus, dim, autoDim);
  const pop = at === undefined ? 1 : progress(frame, at, 14, EASE.out);
  if (pop <= 0) return null;

  const yes = verdict === 'yes';
  const verdictCol = yes ? C.emerald : C.rose;
  const cd = clamp01(card);
  const cl = clamp01(call);
  const ck = clamp01(check);
  const an = clamp01(answer);
  const op = clamp01(open);
  const rs = clamp01(result);
  const oc = clamp01(officeCard);
  const ocs = clamp01(officeCardSent);
  const officeCol = mixHex(C.cyan, verdictCol, an);
  const gateCol = mixHex(INK.steel, verdictCol, rs);
  const curve = callCurve(s, detail);

  const groupStyle = (k: EntranceGateElement, color: string): CSSProperties => {
    const f = fx[k];
    return {
      opacity: 1 - 0.6 * f.dim,
      filter: joinFilters(dropGlow(color, f.focus), f.dim > 0.01 ? `saturate(${1 - 0.5 * f.dim})` : ''),
    };
  };

  // ---- Background: ground, road, faint compound behind the fence -------------------------------
  const ground = (
    <g>
      <rect x={0} y={GROUND} width={GATE_BASE.w} height={34} fill={C.ink850} />
      <line x1={0} y1={GROUND} x2={GATE_BASE.w} y2={GROUND} stroke={INK.struct} strokeWidth={lw} />
      {!icon ? <line x1={20} y1={GROUND + 18} x2={GATE_BASE.w - 20} y2={GROUND + 18} stroke={INK.structFaint} strokeWidth={sw(3, 1.4)} strokeDasharray="26 22" /> : null}
    </g>
  );

  const fenceRun = (x0: number, x1: number, key: string) => {
    const posts: number[] = [];
    for (let x = x0 + 8; x <= x1 - 4; x += 46) posts.push(x);
    return (
      <g key={key} stroke={INK.struct} strokeLinecap="round" fill="none">
        <path d={`M ${x0} ${FENCE.top + 8} L ${x1} ${FENCE.top + 8} M ${x0} ${GROUND - 10} L ${x1} ${GROUND - 10}`} strokeWidth={thin} />
        {!icon ? (
          <path
            d={posts
              .slice(0, -1)
              .map((x) => `M ${x} ${FENCE.top + 8} L ${x + 46} ${GROUND - 10} M ${x + 46} ${FENCE.top + 8} L ${x} ${GROUND - 10}`)
              .join(' ')}
            strokeWidth={sw(1.2, 0.8)}
            opacity={0.4}
          />
        ) : null}
        {posts.map((x) => (
          <line key={x} x1={x} y1={GROUND} x2={x} y2={FENCE.top} strokeWidth={lw} />
        ))}
      </g>
    );
  };

  // ---- The gate (sliding panel between two pillars) ----------------------------------------------
  const panelW = GATE.r0 - GATE.l1;
  const bars: number[] = [];
  for (let x = GATE.l1 + 14; x < GATE.r0 - 6; x += icon ? 34 : 23) bars.push(x);
  const slide = -(panelW + 30) * op;
  const gatePanel = (
    <g clipPath={`url(#${id}-gateclip)`}>
      <g transform={`translate(${slide} 0)`} stroke={gateCol} strokeLinecap="round" strokeLinejoin="round">
        <rect x={GATE.l1 + 2} y={GATE.panelTop} width={panelW - 4} height={GATE.panelBottom - GATE.panelTop} rx={4} fill={alpha(C.ink900, 0.55)} strokeWidth={lw} />
        <line x1={GATE.l1 + 2} y1={(GATE.panelTop + GATE.panelBottom) / 2} x2={GATE.r0 - 2} y2={(GATE.panelTop + GATE.panelBottom) / 2} strokeWidth={thin} />
        {bars.map((x) => (
          <g key={x}>
            <line x1={x} y1={GATE.panelTop - 10} x2={x} y2={GATE.panelBottom} strokeWidth={thin * 1.2} />
            <path d={`M ${x - 6} ${GATE.panelTop - 6} L ${x} ${GATE.panelTop - 18} L ${x + 6} ${GATE.panelTop - 6}`} strokeWidth={thin} fill="none" />
          </g>
        ))}
        <circle cx={GATE.l1 + 26} cy={GATE.panelBottom + 4} r={7} fill={C.ink900} strokeWidth={thin} />
        <circle cx={GATE.r0 - 26} cy={GATE.panelBottom + 4} r={7} fill={C.ink900} strokeWidth={thin} />
      </g>
    </g>
  );
  const pillar = (x0: number, x1: number, key: string) => (
    <g key={key} stroke={gateCol} strokeLinejoin="round">
      <rect x={x0} y={GATE.top} width={x1 - x0} height={GROUND - GATE.top} rx={3} fill={C.ink800} strokeWidth={lw} />
      <rect x={x0 - 5} y={GATE.top - 10} width={x1 - x0 + 10} height={14} rx={3} fill={C.ink700} strokeWidth={lw} />
    </g>
  );

  // ---- The driver (truck cab, arm, card) -----------------------------------------------------------
  const cardPos = { x: mix(CARD.rest.x, CARD.x, cd), y: mix(CARD.rest.y, CARD.y, cd), scale: mix(CARD.rest.scale, CARD.scale, cd) };
  const hand = { x: cardPos.x - 30 * cardPos.scale, y: cardPos.y + 26 * cardPos.scale };
  const shoulder = { x: P.driver.x + 22, y: P.driver.y + 22 };
  const driver = (
    <g style={groupStyle('driver', C.cyan)}>
      <TruckSide x={TRUCK.front - 440 * TRUCK.scale} y={GROUND} scale={TRUCK.scale} cargo="none" plate={false} driver clipId={`${id}-truck`} strokeWidth={lw / TRUCK.scale} />
      {cd > 0.02 ? (
        <g opacity={Math.min(1, cd * 2)}>
          <path d={`M ${shoulder.x} ${shoulder.y} Q ${shoulder.x + 30} ${shoulder.y - 4} ${hand.x} ${hand.y}`} fill="none" stroke={INK.person} strokeWidth={sw(9, 3)} strokeLinecap="round" />
          <CardGlyph x={cardPos.x} y={cardPos.y} scale={cardPos.scale} color={C.cyan} rotate={-8 * cd} strokeWidth={lw / Math.max(0.4, cardPos.scale)} />
        </g>
      ) : null}
    </g>
  );

  // ---- The gatehouse and the guard -------------------------------------------------------------------
  const w = BOOTH.win;
  const handsetRest = { x: w.x + w.w - 26, y: w.y + w.h - 12, rot: 90 };
  const handsetEar = { x: P.guard.x - 27, y: P.guard.y + 2, rot: -28 };
  const hs = { x: mix(handsetRest.x, handsetEar.x, cl), y: mix(handsetRest.y, handsetEar.y, cl), rot: mix(handsetRest.rot, handsetEar.rot, cl) };
  const booth = (
    <g style={groupStyle('guard', C.cyan)} strokeLinejoin="round">
      <defs>
        <clipPath id={`${id}-win`}>
          <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={6} />
        </clipPath>
      </defs>
      {/* Walls */}
      <rect x={BOOTH.x0} y={BOOTH.top} width={BOOTH.x1 - BOOTH.x0} height={GROUND - BOOTH.top} rx={3} fill={C.ink800} stroke={C.cyan} strokeWidth={lw} />
      {/* Gabled roof (V16's hut has a flat slab: this one has a ridge) */}
      <path
        d={`M ${BOOTH.x0 - 18} ${BOOTH.top + 6} L ${BOOTH.apex.x} ${BOOTH.apex.y} L ${BOOTH.x1 + 18} ${BOOTH.top + 6} L ${BOOTH.x1 + 8} ${BOOTH.top + 14} L ${BOOTH.apex.x} ${BOOTH.apex.y + 14} L ${BOOTH.x0 - 8} ${BOOTH.top + 14} Z`}
        fill={C.ink700}
        stroke={C.cyan}
        strokeWidth={lw}
      />
      {/* Window: lit interior, the guard, the handset */}
      <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={6} fill="#050a14" />
      <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={6} fill={alpha(INK.lamp, 0.22)} />
      <g clipPath={`url(#${id}-win)`}>
        <PersonBust x={P.guard.x} y={P.guard.y} scale={GUARD_SCALE} color={C.cyan} strokeWidth={sw(3, 1.4)} />
      </g>
      <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={6} fill="none" stroke={C.cyan} strokeWidth={thin} />
      {/* Sill + phone base */}
      <rect x={w.x - 6} y={w.y + w.h} width={w.w + 12} height={8} rx={3} fill={C.ink700} stroke={C.cyan} strokeWidth={thin} />
      {!icon ? <rect x={handsetRest.x - 18} y={handsetRest.y + 2} width={36} height={10} rx={3} fill={C.ink900} stroke={alpha(C.cyan, 0.7)} strokeWidth={thin} /> : null}
      <HandsetGlyph x={hs.x} y={hs.y} size={icon ? 44 : 40} color={C.cyanSoft} rotate={hs.rot} strokeWidth={sw(2.2, 1.2)} />
      {/* Lower panel */}
      {!icon ? <line x1={BOOTH.x0 + 14} y1={GROUND - 22} x2={BOOTH.x1 - 14} y2={GROUND - 22} stroke={alpha(C.cyan, 0.4)} strokeWidth={thin} /> : null}
    </g>
  );

  // ---- The accreditation office (sign, clerk, list) -------------------------------------------------
  const ow = OFFICE.win;
  const ol = OFFICE.list;
  const rows = icon ? [0, 1, 2] : [0, 1, 2, 3];
  const rowY = (r: number) => ol.y + 26 + r * (icon ? 22 : 17);
  const target = icon ? 1 : 2;
  const sweepY = rowY(Math.min(target, ck * (target + 0.999)));
  const officeHandset = { x: P.clerk.x - 23, y: P.clerk.y + 2 };
  const ocPos = { x: ow.x + 26, y: ow.y + 44 };
  const office = (
    <g style={groupStyle('office', officeCol)} strokeLinejoin="round">
      <defs>
        <clipPath id={`${id}-owin`}>
          <rect x={ow.x} y={ow.y} width={ow.w} height={ow.h} rx={5} />
        </clipPath>
      </defs>
      <rect x={OFFICE.x0} y={OFFICE.top} width={OFFICE.x1 - OFFICE.x0} height={GROUND - OFFICE.top} rx={3} fill={C.ink800} stroke={officeCol} strokeWidth={lw} />
      <rect x={OFFICE.x0 - 6} y={OFFICE.top - 8} width={OFFICE.x1 - OFFICE.x0 + 12} height={12} rx={3} fill={C.ink700} stroke={officeCol} strokeWidth={lw} />
      {/* The sign's two posts on the roof */}
      <path d={`M ${OFFICE.x0 + 40} ${OFFICE.top - 8} L ${OFFICE.x0 + 40} ${SIGN_BOTTOM - 4} M ${OFFICE.x1 - 40} ${OFFICE.top - 8} L ${OFFICE.x1 - 40} ${SIGN_BOTTOM - 4}`} stroke={officeCol} strokeWidth={lw} strokeLinecap="round" />
      {/* Window with the clerk */}
      <rect x={ow.x} y={ow.y} width={ow.w} height={ow.h} rx={5} fill="#050a14" />
      <rect x={ow.x} y={ow.y} width={ow.w} height={ow.h} rx={5} fill={alpha(INK.lamp, 0.2)} />
      <g clipPath={`url(#${id}-owin)`}>
        <PersonBust x={P.clerk.x} y={P.clerk.y} scale={1.2} color={officeCol} strokeWidth={sw(3, 1.4)} />
      </g>
      <rect x={ow.x} y={ow.y} width={ow.w} height={ow.h} rx={5} fill="none" stroke={officeCol} strokeWidth={thin} />
      {cl > 0.05 ? <HandsetGlyph x={officeHandset.x} y={officeHandset.y} size={icon ? 34 : 28} color={alpha(officeCol, 1)} rotate={-28} strokeWidth={sw(2.2, 1.2)} /> : null}
      {/* The list on the wall (rows; the sweep finds one) */}
      <rect x={ol.x} y={ol.y} width={ol.w} height={ol.h} rx={6} fill={C.ink900} stroke={officeCol} strokeWidth={thin * 1.2} />
      <rect x={ol.x + ol.w / 2 - 14} y={ol.y - 6} width={28} height={12} rx={3} fill={C.ink700} stroke={officeCol} strokeWidth={thin} />
      {ck > 0.01 ? <rect x={ol.x + 5} y={sweepY - 7} width={ol.w - 10} height={14} rx={4} fill={alpha(an > 0.5 ? verdictCol : C.cyan, 0.4)} /> : null}
      {rows.map((r) => (
        <g key={r}>
          <rect x={ol.x + 10} y={rowY(r) - 4} width={8} height={8} rx={2} fill={alpha(officeCol, 0.6)} />
          <line x1={ol.x + 24} y1={rowY(r)} x2={ol.x + ol.w - (r % 2 ? 22 : 12)} y2={rowY(r)} stroke={alpha(officeCol, 0.8)} strokeWidth={sw(3.4, 1.4)} strokeLinecap="round" />
        </g>
      ))}
      {/* Lower panel */}
      {!icon ? <line x1={OFFICE.x0 + 14} y1={GROUND - 22} x2={OFFICE.x1 - 14} y2={GROUND - 22} stroke={alpha(officeCol, 0.4)} strokeWidth={thin} /> : null}
      {/* Icon detail: the sign as a board with two bars */}
      {icon ? (
        <g>
          <rect x={OFFICE.x0 + 10} y={SIGN_BOTTOM - 60} width={OFFICE.x1 - OFFICE.x0 - 20} height={54} rx={8} fill={C.ink900} stroke={officeCol} strokeWidth={lw} />
          <line x1={OFFICE.x0 + 34} y1={SIGN_BOTTOM - 42} x2={OFFICE.x1 - 50} y2={SIGN_BOTTOM - 42} stroke={officeCol} strokeWidth={sw(6, 2)} strokeLinecap="round" />
          <line x1={OFFICE.x0 + 34} y1={SIGN_BOTTOM - 24} x2={OFFICE.x1 - 34} y2={SIGN_BOTTOM - 24} stroke={alpha(officeCol, 0.6)} strokeWidth={sw(6, 2)} strokeLinecap="round" />
        </g>
      ) : null}
      {/* EAP-TLS: the clerk holds up the office's own accreditation */}
      {oc > 0.01 && ocs < 0.999 ? <CardGlyph x={ocPos.x} y={ocPos.y + (1 - oc) * 30} scale={0.95} color={officeCol} rotate={6} show={oc * (1 - ocs * 0.999)} strokeWidth={lw} /> : null}
    </g>
  );

  // ---- The call (arc gatehouse → office), the answer, the office card on its way -----------------------
  const flow = (frame / 30) * 1.2;
  const callLen = 900;
  const callEl = (
    <g style={{ opacity: Math.max(fx.guard.dim, fx.office.dim) > 0.01 ? 1 - 0.4 * Math.min(fx.guard.dim, fx.office.dim) : 1 }}>
      <path d={pathOf(curve)} fill="none" stroke={alpha(C.muted, 0.35)} strokeWidth={thin} strokeDasharray="5 12" opacity={icon ? 0.6 : 1} />
      {cl > 0.01 ? (
        <>
          <path d={pathOf(curve)} fill="none" stroke={alpha(C.cyan, 0.85)} strokeWidth={sw(4, 2)} strokeLinecap="round" pathLength={callLen} strokeDasharray={`${callLen} ${callLen}`} strokeDashoffset={callLen * (1 - cl)} />
          {cl > 0.98 && !icon ? <path d={pathOf(curve)} fill="none" stroke={C.cyanSoft} strokeWidth={sw(4, 2)} strokeLinecap="round" pathLength={callLen} strokeDasharray="22 60" strokeDashoffset={-flow * 82} opacity={1 - an} /> : null}
          {/* Ring marks at both ends while the line is lit */}
          <g stroke={alpha(C.cyanSoft, 0.9 * cl)} strokeWidth={thin} fill="none" strokeLinecap="round">
            <path d={`M ${curve[0].x - 16} ${curve[0].y - 10} q -6 8 0 16 M ${curve[0].x - 26} ${curve[0].y - 16} q -10 14 0 28`} />
          </g>
        </>
      ) : null}
      {an > 0.01 && an < 0.999 ? (
        (() => {
          const p = cubicPoint(curve, 1 - an);
          return <VerdictMark x={p.x} y={p.y} r={icon ? 30 : 22} kind={verdict} show={1} />;
        })()
      ) : null}
      {an >= 0.999 ? <VerdictMark x={curve[0].x + 2} y={curve[0].y - 30} r={icon ? 30 : 24} kind={verdict} show={1} /> : null}
      {ocs > 0.01 ? (
        (() => {
          const t = Math.min(1, ocs * 1.4);
          const onArc = cubicPoint(curve, 1 - t);
          const finalPt = { x: CARD.x + 92, y: CARD.y - 70 };
          const k = progress(ocs, 0.7, 0.3, EASE.inOut);
          return <CardGlyph x={mix(onArc.x, finalPt.x, k)} y={mix(onArc.y, finalPt.y, k)} scale={mix(0.7, 0.95, k)} color={officeCol} rotate={6} strokeWidth={lw} />;
        })()
      ) : null}
    </g>
  );

  // ---- Verdict on the gate ---------------------------------------------------------------------------
  const resultEl = rs > 0.01 ? <VerdictMark x={P.gate.x} y={P.gate.y - 8} r={icon ? 46 : 34} kind={verdict} show={rs} /> : null;
  const gateGroup = (
    <g style={groupStyle('gate', rs > 0.01 ? verdictCol : C.cyan)}>
      {gatePanel}
      {pillar(GATE.l0, GATE.l1, 'pl')}
      {pillar(GATE.r0, GATE.r1, 'pr')}
    </g>
  );

  // ---- Sign (HTML, px) ---------------------------------------------------------------------------------
  const signEl =
    !icon && sign ? (
      <div
        style={{
          position: 'absolute',
          right: width - OFFICE.x1 * s,
          bottom: h - SIGN_BOTTOM * s,
          padding: '8px 16px',
          borderRadius: 10,
          border: `3px solid ${officeCol}`,
          background: C.ink900,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 800,
          lineHeight: 1.12,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          boxShadow: `0 0 ${10 + 16 * fx.office.focus}px ${alpha(officeCol, 0.25 + 0.35 * fx.office.focus)}`,
          ...{ opacity: 1 - 0.6 * fx.office.dim },
        }}
      >
        {ENTRANCE_GATE_TEXT.office[0]}
        <br />
        {ENTRANCE_GATE_TEXT.office[1]}
      </div>
    ) : null;

  const d = clamp01(dimAll);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: pop * (1 - 0.6 * d),
        transform: pop < 1 ? `translateY(${(1 - pop) * 14}px)` : undefined,
        filter: joinFilters(dropGlow(C.cyan, clamp01(glow)), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${GATE_BASE.w} ${GATE_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={`${id}-gateclip`}>
            <rect x={0} y={0} width={GATE.r0} height={GATE_BASE.h} />
          </clipPath>
        </defs>
        {ground}
        {fenceRun(0, GATE.l0, 'fl')}
        {office}
        {fenceRun(GATE.r1, GATE_BASE.w, 'fr')}
        {gateGroup}
        {driver}
        {booth}
        {callEl}
        {resultEl}
      </svg>
      {signEl}
    </div>
  );
}

function pathOf([p0, p1, p2, p3]: [Point, Point, Point, Point]): string {
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
}
