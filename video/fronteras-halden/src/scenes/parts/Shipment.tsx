import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';
import { INK, LoadGlyph, SealTag, TRUCK_SIDE, TruckSide, dropGlow, joinFilters, strokeAt, useSvgId } from './glyphs';

/**
 * IPSec as a shipment (canon: out/scene-brief.md «Visual metaphors»): four objects in ONE drawing
 * language (side elevation, steel outlines, the port's seal in cyan), drawn the same way in s06, s07
 * and s10:
 *
 *   - `SealBag`  (AH)  a transparent bag with a seal: the load is visible inside; the seal shows if it
 *                      was opened (`broken`) — «integridad y origen · sin cifrar»;
 *   - `SealedBox` (ESP) the same load in a closed box with the same seal: nobody sees what it carries;
 *   - `TruckLoad` (transport mode) a truck with its load covered (`cover` pulls the tarp over it) and
 *                      its plate in plain view: the original header, drawn as device → device (never
 *                      letters or numbers);
 *   - `TunnelContainer` (tunnel mode) the whole truck inside a container whose placard says only
 *                      «pasarela de la sede · pasarela de la terminal» (`truckIn` drives it in,
 *                      `doors` close it, `label` shows the placard; `ghost` x-rays the truck inside).
 *
 * The load (`LoadGlyph`) and the seal (`SealTag`) are the shared objects from glyphs.tsx. Every state
 * is a 0–1 weight; each piece sizes from `width` (design units below, `*Size()` helpers give the box)
 * and thickens its strokes at icon sizes. Nothing reads the timeline and nothing is positioned.
 */

/** Canon strings (out/scene-brief.md), exactly. */
export const SHIPMENT_TEXT = {
  ah: 'integridad y origen · sin cifrar',
  esp: 'además, confidencialidad · el que se usa',
  transport: 'de equipo a equipo',
  tunnel: 'de pasarela a pasarela',
  container: 'pasarela de la sede · pasarela de la terminal',
  containerLines: ['pasarela de la sede', 'pasarela de la terminal'],
} as const;

type Common = {
  width: number;
  glow?: number;
  dim?: number;
  /** 0–1 fades the object in. Default 1. */
  show?: number;
  style?: CSSProperties;
};

function wrapStyle(width: number, h: number, { glow = 0, dim = 0, show = 1 }: { glow?: number; dim?: number; show?: number }, color: string, style?: CSSProperties): CSSProperties {
  const d = clamp01(dim);
  return {
    position: 'relative',
    width,
    height: h,
    opacity: clamp01(show) * (1 - 0.6 * d),
    filter: joinFilters(dropGlow(color, clamp01(glow)), d > 0.01 ? `saturate(${1 - 0.5 * d})` : ''),
    ...style,
  };
}

// ---------------------------------------------------------------------------
// AH: the transparent bag with a seal

export const SEAL_BAG_BASE = { w: 300, h: 360 } as const;
export function sealBagSize(width: number) {
  return { w: width, h: (SEAL_BAG_BASE.h * width) / SEAL_BAG_BASE.w, scale: width / SEAL_BAG_BASE.w };
}
/** Anchors in px: 'seal' (the seal's lock), 'load' (centre of the load inside), 'top' (above the neck: where the load drops from). */
export function sealBagPoint(width: number, which: 'seal' | 'load' | 'top') {
  const { scale } = sealBagSize(width);
  const P = { seal: { x: 150, y: 84 }, load: { x: 150, y: 272 }, top: { x: 150, y: 20 } }[which];
  return { x: P.x * scale, y: P.y * scale };
}

/**
 * AH: a transparent bag, the load visible inside, a seal at the neck. `load` 0–1 drops the load in
 * from above; `seal` 0–1 clicks the seal shut; `broken` 0–1 snaps it (rose: «se nota si la abren»).
 */
export function SealBag({ width, load = 1, seal = 1, broken = 0, ...rest }: Common & { load?: number; seal?: number; broken?: number }) {
  const { h, scale: s } = sealBagSize(width);
  const sw = strokeAt(s);
  const lw = sw(3.6, s < 0.6 ? 1.8 : 2);
  const thin = sw(2.2, 1.2);
  const ld = clamp01(load);
  const body = 'M 128 96 C 70 108 40 160 40 230 L 40 318 Q 40 350 72 350 L 228 350 Q 260 350 260 318 L 260 230 C 260 160 230 108 172 96 Z';
  const neck = 'M 128 96 L 132 70 L 168 70 L 172 96';
  const ruffle = 'M 132 70 L 110 44 Q 122 50 130 40 Q 140 50 150 38 Q 160 50 170 40 Q 178 50 190 44 L 168 70';
  const outline = alpha(INK.skySoft, 0.95);
  return (
    <div style={wrapStyle(width, h, rest, C.cyan, rest.style)}>
      <svg width={width} height={h} viewBox={`0 0 ${SEAL_BAG_BASE.w} ${SEAL_BAG_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* Plastic: a faint fill behind the load */}
          <path d={body} fill={alpha(INK.skySoft, 0.07)} />
          {/* The load (visible: it is a transparent bag) */}
          {ld > 0.01 ? <LoadGlyph x={150} y={336 - (1 - ld) * 290} scale={1.18} strokeWidth={lw * 0.85} opacity={Math.min(1, ld * 3)} /> : null}
          {/* Plastic: outline, neck, sheen */}
          <path d={body} fill="none" stroke={outline} strokeWidth={lw} />
          <path d={neck} fill={alpha(INK.skySoft, 0.1)} stroke={outline} strokeWidth={lw} />
          <path d={ruffle} fill={alpha(INK.skySoft, 0.1)} stroke={outline} strokeWidth={thin} />
          <path d="M 64 214 C 64 176 80 146 104 128" fill="none" stroke={alpha('#ffffff', 0.35)} strokeWidth={sw(5, 2)} />
          <path d="M 62 250 L 62 296" fill="none" stroke={alpha('#ffffff', 0.22)} strokeWidth={sw(5, 2)} />
          {/* The seal at the neck */}
          <SealTag x={150} y={84} scale={1.4} band="ring" ringW={36} seal={seal} broken={broken} strokeWidth={lw} />
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ESP: the same load in a closed, sealed box

export const SEALED_BOX_BASE = { w: 320, h: 360 } as const;
export function sealedBoxSize(width: number) {
  return { w: width, h: (SEALED_BOX_BASE.h * width) / SEALED_BOX_BASE.w, scale: width / SEALED_BOX_BASE.w };
}
/** Anchors in px: 'seal', 'lid' (centre of the closed lid), 'top' (where the load drops from), 'front' (centre of the front face). */
export function sealedBoxPoint(width: number, which: 'seal' | 'lid' | 'top' | 'front') {
  const { scale } = sealedBoxSize(width);
  const P = { seal: { x: 160, y: 158 }, lid: { x: 160, y: 146 }, top: { x: 160, y: 20 }, front: { x: 160, y: 256 } }[which];
  return { x: P.x * scale, y: P.y * scale };
}

/**
 * ESP: a closed box with the same seal. `load` 0–1 drops the load in from above (it disappears behind
 * the front); `lid` 0–1 closes the two flaps (0 open); `seal` 0–1 clicks the seal on; `broken` snaps it.
 */
export function SealedBox({ width, load = 1, lid = 1, seal = 1, broken = 0, ...rest }: Common & { load?: number; lid?: number; seal?: number; broken?: number }) {
  const id = useSvgId('box');
  const { h, scale: s } = sealedBoxSize(width);
  const sw = strokeAt(s);
  const lw = sw(3.6, s < 0.6 ? 1.8 : 2);
  const thin = sw(2.2, 1.2);
  const ld = clamp01(load);
  const li = clamp01(lid);
  const top = 156;
  const x0 = 34;
  const x1 = 286;
  // Flaps: hinged on the front and back top edges; at 0 they stand open (tilted out), at 1 they lie flat.
  const flapL = (k: number) => {
    const ang = (1 - k) * 118; // degrees open
    const r = (Math.PI / 180) * ang;
    const len = (x1 - x0) / 2;
    const ex = x0 + len * Math.cos(r);
    const ey = top - len * Math.sin(r) * 0.95;
    return `M ${x0} ${top} L ${ex} ${ey} L ${ex} ${ey - 14} L ${x0} ${top - 14} Z`;
  };
  const flapR = (k: number) => {
    const ang = (1 - k) * 118;
    const r = (Math.PI / 180) * ang;
    const len = (x1 - x0) / 2;
    const ex = x1 - len * Math.cos(r);
    const ey = top - len * Math.sin(r) * 0.95;
    return `M ${x1} ${top} L ${ex} ${ey} L ${ex} ${ey - 14} L ${x1} ${top - 14} Z`;
  };
  const loadY = mix(top - 150, 346, ld);
  return (
    <div style={wrapStyle(width, h, rest, C.cyan, rest.style)}>
      <svg width={width} height={h} viewBox={`0 0 ${SEALED_BOX_BASE.w} ${SEALED_BOX_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={`${id}-above`}>
            <rect x={-200} y={-400} width={SEALED_BOX_BASE.w + 400} height={top - 6 + 400} />
          </clipPath>
        </defs>
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* The load, visible only above the box's mouth while it drops in */}
          {ld > 0.01 && ld < 0.999 ? (
            <g clipPath={`url(#${id}-above)`}>
              <LoadGlyph x={160} y={loadY} scale={1.18} strokeWidth={lw * 0.85} opacity={Math.min(1, ld * 3)} />
            </g>
          ) : null}
          {/* Box front */}
          <rect x={x0} y={top} width={x1 - x0} height={346 - top} rx={6} fill={C.ink800} stroke={INK.steel} strokeWidth={lw} />
          <path d={`M ${x0 + 14} ${top + 64} L ${x1 - 14} ${top + 64} M ${x0 + 14} ${top + 128} L ${x1 - 14} ${top + 128}`} stroke={alpha(INK.steel, 0.3)} strokeWidth={thin} />
          {/* Lid flaps */}
          <path d={flapL(li)} fill={C.ink700} stroke={INK.steel} strokeWidth={lw} />
          <path d={flapR(li)} fill={C.ink700} stroke={INK.steel} strokeWidth={lw} />
          {li > 0.98 ? <line x1={160} y1={top - 14} x2={160} y2={top} stroke={INK.steel} strokeWidth={thin} /> : null}
          {/* Seal across the seam */}
          <SealTag x={160} y={top - 2} scale={1.45} band="strap" seal={seal * (li > 0.95 ? 1 : 0)} broken={broken} strokeWidth={lw} />
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transport mode: the truck with its load covered and its plate in view

const TRUCK_VB = { x: -40, y: 0, w: 490, h: 214 } as const;
export const TRUCK_LOAD_BASE = { w: TRUCK_VB.w, h: TRUCK_VB.h } as const;
export function truckLoadSize(width: number) {
  return { w: width, h: (TRUCK_VB.h * width) / TRUCK_VB.w, scale: width / TRUCK_VB.w };
}
/** Anchors in px: 'plate' (its centre), 'load' (centre of the bed), 'cab', 'rear', 'front'. */
export function truckLoadPoint(width: number, which: 'plate' | 'load' | 'cab' | 'rear' | 'front') {
  const { scale } = truckLoadSize(width);
  const P = {
    plate: { x: TRUCK_SIDE.plateX + TRUCK_SIDE.plateW / 2, y: TRUCK_SIDE.plateY + (TRUCK_SIDE.plateW * 0.38) / 2 },
    load: { x: 154, y: 100 },
    cab: { x: 368, y: 100 },
    rear: { x: 0, y: 120 },
    front: { x: 440, y: 120 },
  }[which];
  return { x: (P.x - TRUCK_VB.x) * scale, y: (P.y - TRUCK_VB.y) * scale };
}

/**
 * Transport mode: the truck (nose right) with its load under a tarp and its plate at the back in plain
 * view. `cover` 0–1 pulls the tarp over the load (0 = load in the open); `plateGlow` 0–1 lights the
 * plate («se le ve la matrícula»). `plate` false hides it.
 */
export function TruckLoad({ width, cover = 1, plateGlow = 0, plate = true, ...rest }: Common & { cover?: number; plateGlow?: number; plate?: boolean }) {
  const id = useSvgId('truck');
  const { h, scale: s } = truckLoadSize(width);
  const sw = strokeAt(s);
  const lw = sw(3.2, s < 0.6 ? 1.8 : 1.8);
  return (
    <div style={wrapStyle(width, h, rest, C.cyan, rest.style)}>
      <svg width={width} height={h} viewBox={`${TRUCK_VB.x} ${TRUCK_VB.y} ${TRUCK_VB.w} ${TRUCK_VB.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <line x1={TRUCK_VB.x} y1={200} x2={TRUCK_VB.x + TRUCK_VB.w} y2={200} stroke={INK.structSoft} strokeWidth={lw} />
        <TruckSide x={0} y={200} cargo="load" cover={cover} plate={plate} plateGlow={plateGlow} clipId={id} strokeWidth={lw} />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tunnel mode: the whole truck inside a container

const CONT = { x0: 20, x1: 630, y0: 34, y1: 236, vb: { x: -560, y: 0, w: 1220, h: 250 } } as const;
export const TUNNEL_CONTAINER_BASE = { w: 660, h: 250 } as const;
const PLACARD = { x0: 96, x1: 560, y0: 82, y1: 190 } as const;

/** Box of the container alone (the truck waiting outside, at `truckIn` < 1, sticks out to the left: see `outside`). */
export function tunnelContainerSize(width: number) {
  return { w: width, h: (TUNNEL_CONTAINER_BASE.h * width) / TUNNEL_CONTAINER_BASE.w, scale: width / TUNNEL_CONTAINER_BASE.w };
}
/** Anchors in px from the container's top-left: 'placard' (its centre), 'doors' (the rear end), 'front', 'roof' (top centre). */
export function tunnelContainerPoint(width: number, which: 'placard' | 'doors' | 'front' | 'roof') {
  const { scale } = tunnelContainerSize(width);
  const P = {
    placard: { x: (PLACARD.x0 + PLACARD.x1) / 2, y: (PLACARD.y0 + PLACARD.y1) / 2 },
    doors: { x: CONT.x0, y: (CONT.y0 + CONT.y1) / 2 },
    front: { x: CONT.x1, y: (CONT.y0 + CONT.y1) / 2 },
    roof: { x: (CONT.x0 + CONT.x1) / 2, y: CONT.y0 },
  }[which];
  return { x: P.x * scale, y: P.y * scale };
}

/**
 * Tunnel mode: a shipping container (doors at the left end) with the whole truck inside. `truckIn` 0–1
 * drives the truck in from the left (at 0 it waits outside, to the LEFT of the box: leave ~1 container
 * width of room there); `doors` 0–1 closes the doors; `label` 0–1 shows the placard with the canon
 * string (two lines, split at « · »); `ghost` 0–1 x-rays the truck inside as a dashed outline;
 * `labelGlow` lights the placard. Below ~360 px wide the placard shows two bars instead of text (icon).
 */
export function TunnelContainer({
  width,
  truckIn = 1,
  doors = 1,
  label = 1,
  ghost = 0,
  labelGlow = 0,
  truck = true,
  ...rest
}: Common & { truckIn?: number; doors?: number; label?: number; ghost?: number; labelGlow?: number; truck?: boolean }) {
  const id = useSvgId('cont');
  const { h, scale: s } = tunnelContainerSize(width);
  const icon = width < 360;
  const sw = strokeAt(s);
  const lw = sw(3.6, icon ? 1.8 : 2);
  const thin = sw(2.2, icon ? 1.1 : 1.2);
  const ti = clamp01(truckIn);
  const dc = clamp01(doors);
  const lb = clamp01(label);
  const gh = clamp01(ghost);
  const tScale = 1.18;
  const insideRear = CONT.x0 + 44;
  const truckX = insideRear - (1 - ti) * (440 * tScale + 120);
  const ground = CONT.y1 - 6;
  const ribs: number[] = [];
  for (let x = CONT.x0 + 70; x < CONT.x1 - 10; x += icon ? 36 : 18) ribs.push(x);
  const placardW = (PLACARD.x1 - PLACARD.x0) * s;
  const fontSize = Math.max(22, Math.min(36, placardW / 13));
  return (
    <div style={wrapStyle(width, h, rest, C.cyan, rest.style)}>
      <svg width={width} height={h} viewBox={`0 0 ${TUNNEL_CONTAINER_BASE.w} ${TUNNEL_CONTAINER_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={`${id}-out`}>
            <rect x={-1400} y={-200} width={1400 + CONT.x0} height={800} />
          </clipPath>
        </defs>
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* The truck: only the part still outside the container is visible */}
          {truck && ti < 0.999 ? (
            <g clipPath={`url(#${id}-out)`}>
              <TruckSide x={truckX} y={ground} scale={tScale} cargo="load" cover={1} plate clipId={`${id}-t`} strokeWidth={lw} />
            </g>
          ) : null}
          {/* Container body */}
          <rect x={CONT.x0} y={CONT.y0} width={CONT.x1 - CONT.x0} height={CONT.y1 - CONT.y0} rx={4} fill={'#13314a'} stroke={C.cyan} strokeWidth={lw} />
          {ribs.map((x) => (
            <line key={x} x1={x} y1={CONT.y0 + 12} x2={x} y2={CONT.y1 - 12} stroke={alpha(C.cyan, 0.42)} strokeWidth={thin} />
          ))}
          <path d={`M ${CONT.x0} ${CONT.y0 + 12} L ${CONT.x1} ${CONT.y0 + 12} M ${CONT.x0} ${CONT.y1 - 12} L ${CONT.x1} ${CONT.y1 - 12}`} stroke={alpha(C.cyan, 0.6)} strokeWidth={thin} />
          {/* Corner castings */}
          {[
            [CONT.x0, CONT.y0],
            [CONT.x1 - 22, CONT.y0],
            [CONT.x0, CONT.y1 - 16],
            [CONT.x1 - 22, CONT.y1 - 16],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={22} height={16} rx={2} fill={C.ink700} stroke={C.cyan} strokeWidth={thin} />
          ))}
          {/* Rear doors: a dark opening while open, door panels with locking bars when closed */}
          <rect x={CONT.x0 + 4} y={CONT.y0 + 16} width={48} height={CONT.y1 - CONT.y0 - 32} fill={C.ink950} opacity={1 - dc} />
          <g opacity={0.25 + 0.75 * dc}>
            <rect x={CONT.x0 + 4} y={CONT.y0 + 16} width={48 * dc + 4} height={CONT.y1 - CONT.y0 - 32} fill={'#17405e'} stroke={C.cyan} strokeWidth={thin} />
            <path d={`M ${CONT.x0 + 16} ${CONT.y0 + 20} L ${CONT.x0 + 16} ${CONT.y1 - 20} M ${CONT.x0 + 38} ${CONT.y0 + 20} L ${CONT.x0 + 38} ${CONT.y1 - 20}`} stroke={C.cyanSoft} strokeWidth={thin * 1.2} opacity={dc} />
          </g>
          {/* X-ray of the truck inside */}
          {gh > 0.01 ? (
            <g opacity={gh} style={{ mixBlendMode: 'screen' }}>
              <g transform={`translate(${insideRear} ${ground - 200 * tScale}) scale(${tScale})`} fill="none" stroke={C.cyanSoft} strokeWidth={lw / tScale} strokeDasharray="8 8">
                <path d="M 8 148 L 8 70 Q 10 48 38 46 L 270 46 Q 298 48 300 70 L 300 148 Z" />
                <path d="M 304 170 L 304 62 Q 304 48 318 48 L 372 48 Q 388 48 394 62 L 422 112 Q 432 124 432 140 L 432 170 Z" />
                <circle cx={100} cy={176} r={24} />
                <circle cx={156} cy={176} r={24} />
                <circle cx={372} cy={176} r={24} />
              </g>
            </g>
          ) : null}
          {/* Placard frame */}
          {lb > 0.01 ? (
            <g opacity={lb}>
              <rect x={PLACARD.x0} y={PLACARD.y0} width={PLACARD.x1 - PLACARD.x0} height={PLACARD.y1 - PLACARD.y0} rx={10} fill={C.ink900} stroke={C.cyan} strokeWidth={lw} />
              {labelGlow > 0.01 ? <rect x={PLACARD.x0 - 8} y={PLACARD.y0 - 8} width={PLACARD.x1 - PLACARD.x0 + 16} height={PLACARD.y1 - PLACARD.y0 + 16} rx={14} fill="none" stroke={alpha(C.cyanSoft, 0.7 * labelGlow)} strokeWidth={lw} /> : null}
              {icon ? (
                <>
                  <line x1={PLACARD.x0 + 40} y1={PLACARD.y0 + 36} x2={PLACARD.x1 - 60} y2={PLACARD.y0 + 36} stroke={C.cyanSoft} strokeWidth={sw(10, 2.4)} />
                  <line x1={PLACARD.x0 + 40} y1={PLACARD.y1 - 34} x2={PLACARD.x1 - 40} y2={PLACARD.y1 - 34} stroke={alpha(C.cyanSoft, 0.6)} strokeWidth={sw(10, 2.4)} />
                </>
              ) : null}
            </g>
          ) : null}
        </g>
      </svg>
      {lb > 0.01 && !icon ? (
        <div
          style={{
            position: 'absolute',
            left: PLACARD.x0 * s,
            top: PLACARD.y0 * s,
            width: (PLACARD.x1 - PLACARD.x0) * s,
            height: (PLACARD.y1 - PLACARD.y0) * s,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize,
            lineHeight: 1.15,
            color: C.textStrong,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: lb,
          }}
        >
          <div>{SHIPMENT_TEXT.containerLines[0]}</div>
          <div>{SHIPMENT_TEXT.containerLines[1]}</div>
        </div>
      ) : null}
    </div>
  );
}

/** The container as s10's rule-2 icon: truck inside, doors shut, placard as bars. */
export function ContainerIcon({ width = 220, ...rest }: Partial<Common> & { width?: number }) {
  return <TunnelContainer width={width} truckIn={1} doors={1} label={1} {...rest} />;
}
