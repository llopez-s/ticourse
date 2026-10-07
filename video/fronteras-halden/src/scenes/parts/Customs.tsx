import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix, type IconName } from '../../../../engine/src/ui';
import { ArrowHead, INK, Label, SvgIcon, dropGlow, joinFilters, polylinePath, polylinePoint, resolveFocus, strokeAt } from './glyphs';

/**
 * «La aduana del puerto» = FULL TUNNEL; «un pie a cada lado de la valla» = SPLIT TUNNEL (canon:
 * out/scene-brief.md «Visual metaphors»), seen from above like the port map, drawn ONE way in s09 and
 * s10 (rule 3's icon):
 *
 *   - the FENCE runs top to bottom down the middle: outside on the left (Internet, slate), inside on
 *     the right («red interna», cyan, a few systems);
 *   - the CUSTOMS BOOTH («aduana») sits ON the fence; whatever goes through it is inspected (`inspect`:
 *     a scanning beam and «filtrado web · DLP · registros del SOC»);
 *   - the LAPTOP (the port's, cyan) stands on two legs. FULL (`split` 0): it stands outside and the
 *     tunnel takes EVERYTHING it sends (web, files, mail: `web` / `files` / `mail` tokens) through the
 *     booth — work traffic on to the internal network, web back out to the Internet after inspection.
 *     SPLIT (`split` 1): it walks onto the fence line and stands with ONE FOOT ON EACH SIDE; files and
 *     mail still go through the booth, but web goes straight out to the unwatched Internet
 *     («directo · sin inspección», `direct`), and `bridge` lights the rose link Internet → laptop →
 *     internal network (the scene's caption says «hace de puente…»).
 *
 * Design units 1600 × 600 scaled to `width`; label text stays ≥ 32 px. Below ~560 px it switches to
 * `detail: 'icon'` (no text, thick lines) for s10. `customsLayout()` / `customsPoint()` / `customsRoute()`
 * give px anchors. Nothing reads the timeline except the optional `frame` (the scanning beam).
 */

/** Canon strings (out/scene-brief.md), exactly — plus the part's own labels (see README). */
export const CUSTOMS_TEXT = {
  customs: 'aduana',
  inspect: 'filtrado web · DLP · registros del SOC',
  direct: 'directo · sin inspección',
  internet: 'Internet',
  inside: 'red interna',
} as const;

export const CUSTOMS_BASE = { w: 1600, h: 600 } as const;
const FENCE_X = 800;
const BOOTH = { x0: 680, x1: 920, y0: 70, y1: 250, lane: 170 } as const;
const GLOBE = { x: 230, y: 300 } as const;
const NET = { x0: 1150, x1: 1570, y0: 300, y1: 560 } as const;
const LAPTOP = { full: { x: 400, y: 470 }, split: { x: FENCE_X, y: 470 } } as const;

export type Flow = 'web' | 'files' | 'mail';
export type CustomsElement = 'customs' | 'laptop' | 'internet' | 'inside';
const ELEMENTS: readonly CustomsElement[] = ['customs', 'laptop', 'internet', 'inside'];
const FLOW_ICON: Record<Flow, IconName> = { web: 'globe', files: 'file', mail: 'mail' };
type Pt = { x: number; y: number };

export function customsDetail(width: number): 'full' | 'icon' {
  return width < 560 ? 'icon' : 'full';
}

export function customsSize(width: number) {
  return { w: width, h: (CUSTOMS_BASE.h * width) / CUSTOMS_BASE.w, scale: width / CUSTOMS_BASE.w };
}

/** Routes in design units for one mode. Every flow starts at the laptop. */
function routes(mode: 'full' | 'split') {
  const booth = { x: FENCE_X, y: BOOTH.lane };
  const toNet = (x: number): Pt[] => [
    { x: BOOTH.x1 + 6, y: BOOTH.lane },
    { x: 1060, y: BOOTH.lane },
    { x, y: NET.y0 + 70 },
  ];
  const webOut: Pt[] = [
    { x: BOOTH.x0 - 6, y: BOOTH.lane - 50 },
    { x: 420, y: BOOTH.lane - 50 },
    { x: GLOBE.x + 20, y: GLOBE.y - 64 },
  ];
  if (mode === 'full') {
    const l = LAPTOP.full;
    const tunnel: Pt[] = [
      { x: l.x + 40, y: l.y - 62 },
      { x: l.x + 40, y: BOOTH.lane },
      { x: BOOTH.x0 - 6, y: BOOTH.lane },
      booth,
    ];
    return { tunnel, web: [...tunnel, ...webOut], files: [...tunnel, ...toNet(1260)], mail: [...tunnel, ...toNet(1440)] };
  }
  const l = LAPTOP.split;
  const tunnel: Pt[] = [
    { x: l.x + 34, y: l.y - 66 },
    { x: FENCE_X + 60, y: 330 },
    { x: FENCE_X + 60, y: BOOTH.y1 + 6 },
    booth,
  ];
  const direct: Pt[] = [
    { x: l.x - 40, y: l.y - 20 },
    { x: 420, y: l.y - 20 },
    { x: GLOBE.x + 30, y: GLOBE.y + 70 },
  ];
  return { tunnel, web: direct, files: [...tunnel, ...toNet(1260)], mail: [...tunnel, ...toNet(1440)] };
}

/** The bridge: Internet → laptop → internal network (design units). */
const BRIDGE: Pt[] = [
  { x: GLOBE.x + 70, y: GLOBE.y + 40 },
  { x: LAPTOP.split.x - 50, y: LAPTOP.split.y + 10 },
  { x: LAPTOP.split.x + 50, y: LAPTOP.split.y + 10 },
  { x: NET.x0 - 4, y: NET.y0 + 150 },
];

/** A flow's route in px for a mode ('tunnel' = the tube from the laptop to the booth). */
export function customsRoute(width: number, mode: 'full' | 'split', which: Flow | 'tunnel'): Pt[] {
  const s = width / CUSTOMS_BASE.w;
  return routes(mode)[which].map((p) => ({ x: p.x * s, y: p.y * s }));
}

/** Every box and anchor in px. */
export function customsLayout(width: number = CUSTOMS_BASE.w) {
  const s = width / CUSTOMS_BASE.w;
  return {
    width,
    height: CUSTOMS_BASE.h * s,
    scale: s,
    fenceX: FENCE_X * s,
    booth: { x: BOOTH.x0 * s, y: BOOTH.y0 * s, w: (BOOTH.x1 - BOOTH.x0) * s, h: (BOOTH.y1 - BOOTH.y0) * s },
    globe: { x: GLOBE.x * s, y: GLOBE.y * s },
    net: { x: NET.x0 * s, y: NET.y0 * s, w: (NET.x1 - NET.x0) * s, h: (NET.y1 - NET.y0) * s },
    laptop: { full: { x: LAPTOP.full.x * s, y: LAPTOP.full.y * s }, split: { x: LAPTOP.split.x * s, y: LAPTOP.split.y * s } },
    /** Centre-top of the inspection caption (under the booth). */
    inspectLabel: { x: FENCE_X * s, y: (BOOTH.y1 + 34) * s },
    /** Centre-top of the «directo · sin inspección» label (under the direct route). */
    directLabel: { x: 480 * s, y: (LAPTOP.split.y - 4) * s },
  };
}

export type CustomsPoint = 'booth' | 'globe' | 'net' | 'laptopFull' | 'laptopSplit' | 'fenceTop' | 'fenceBottom';

export function customsPoint(width: number, which: CustomsPoint): Pt {
  const s = width / CUSTOMS_BASE.w;
  const P: Record<CustomsPoint, Pt> = {
    booth: { x: FENCE_X, y: (BOOTH.y0 + BOOTH.y1) / 2 },
    globe: GLOBE,
    net: { x: (NET.x0 + NET.x1) / 2, y: (NET.y0 + NET.y1) / 2 },
    laptopFull: LAPTOP.full,
    laptopSplit: LAPTOP.split,
    fenceTop: { x: FENCE_X, y: 0 },
    fenceBottom: { x: FENCE_X, y: CUSTOMS_BASE.h },
  };
  return { x: P[which].x * s, y: P[which].y * s };
}

// ---------------------------------------------------------------------------
// The laptop on two legs

/**
 * The laptop standing on two legs, drawn inside your <svg> (design units): (x, y) = middle of its base, feet
 * ~78 units below; `straddle` 0–1 spreads the legs (one foot each side of a line through x); `lw` stroke width.
 */
export function LeggedLaptop({ x, y, straddle, lw, color = C.cyan }: { x: number; y: number; straddle: number; lw: number; color?: string }) {
  const sp = mix(22, 64, straddle);
  const hip = 18;
  return (
    <g transform={`translate(${x} ${y})`} strokeLinecap="round" strokeLinejoin="round">
      {/* Legs and feet */}
      <path d={`M ${-hip} 6 L ${-sp} 74 M ${hip} 6 L ${sp} 74`} stroke={INK.person} strokeWidth={lw * 2.2} fill="none" />
      <path d={`M ${-sp - 22} 78 L ${-sp + 4} 78 M ${sp - 4} 78 L ${sp + 22} 78`} stroke={INK.person} strokeWidth={lw * 3} fill="none" />
      {/* Screen */}
      <rect x={-62} y={-92} width={124} height={84} rx={8} fill={alpha(color, 0.16)} stroke={color} strokeWidth={lw} />
      <rect x={-50} y={-80} width={100} height={60} rx={4} fill={alpha(color, 0.12)} />
      {/* Eyes: it's a character */}
      <circle cx={-18} cy={-54} r={5} fill={color} />
      <circle cx={18} cy={-54} r={5} fill={color} />
      {/* Base */}
      <path d="M -78 -6 L 78 -6 L 68 8 L -68 8 Z" fill={C.ink800} stroke={color} strokeWidth={lw} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Customs

export interface CustomsProps {
  width?: number;
  /** 0 = FULL TUNNEL (laptop outside, everything through the booth) … 1 = SPLIT (laptop on the fence). */
  split?: number;
  /** 0–1 fence, regions and booth draw in. Default 1. */
  draw?: number;
  /** 0–1 the tunnel tube (laptop → booth) draws in. Default 1. */
  tunnel?: number;
  /** 0–1 the laptop shows. Default 1. */
  laptop?: number;
  /** Token progress (0–1, or several) along each flow's route in the current mode. */
  web?: number | number[];
  files?: number | number[];
  mail?: number | number[];
  /** 0–1 the booth inspects: scanning beam + «filtrado web · DLP · registros del SOC». */
  inspect?: number;
  /** 0–1 split only: the direct web route + «directo · sin inspección». */
  direct?: number;
  /** 0–1 split only: the rose «puente» link Internet → laptop → internal network. */
  bridge?: number;
  focus?: Partial<Record<CustomsElement, number>>;
  dim?: Partial<Record<CustomsElement, number>>;
  autoDim?: boolean;
  /** Show the region and booth labels (default true at full detail). */
  labels?: boolean;
  detail?: 'full' | 'icon';
  frame?: number;
  style?: CSSProperties;
}

export function Customs({
  width = CUSTOMS_BASE.w,
  split = 0,
  draw = 1,
  tunnel = 1,
  laptop = 1,
  web,
  files,
  mail,
  inspect = 0,
  direct = 0,
  bridge = 0,
  focus = {},
  dim = {},
  autoDim = true,
  labels = true,
  detail: detailProp,
  frame: frameProp,
  style,
}: CustomsProps) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const { h, scale: s } = customsSize(width);
  const detail = detailProp ?? customsDetail(width);
  const icon = detail === 'icon';
  const sw = strokeAt(s);
  const lw = sw(3.6, icon ? 2 : 2);
  const thin = sw(2.2, icon ? 1.4 : 1.2);
  const fx = resolveFocus(ELEMENTS, focus, dim, autoDim);
  const sp = clamp01(split);
  const dr = clamp01(draw);
  const tn = clamp01(tunnel);
  const ins = clamp01(inspect);
  const dir = clamp01(direct) * sp;
  const br = clamp01(bridge) * sp;
  const full = routes('full');
  const spl = routes('split');
  const mode = sp < 0.5 ? full : spl;
  const showLabels = labels && !icon;

  const gStyle = (k: CustomsElement, color: string, show = 1): CSSProperties => ({
    opacity: show * (1 - 0.6 * fx[k].dim),
    filter: joinFilters(dropGlow(color, fx[k].focus), fx[k].dim > 0.01 ? `saturate(${1 - 0.5 * fx[k].dim})` : ''),
  });

  // ---- Regions ----------------------------------------------------------------------------------
  const outside = (
    <g style={gStyle('internet', INK.struct, dr)}>
      <rect x={0} y={0} width={FENCE_X - 12} height={CUSTOMS_BASE.h} rx={20} fill={alpha(INK.structFaint, 0.18)} />
      <circle cx={GLOBE.x} cy={GLOBE.y} r={78} fill={C.ink900} stroke={INK.struct} strokeWidth={lw} />
      <SvgIcon name="globe" x={GLOBE.x} y={GLOBE.y} size={100} color={'#a3b1c6'} strokeWidth={1.6} />
      {/* Unwatched: an eye-off badge once the laptop straddles */}
      {sp > 0.01 ? (
        <g opacity={sp}>
          <circle cx={GLOBE.x + 62} cy={GLOBE.y - 58} r={26} fill={C.ink900} stroke={C.amber} strokeWidth={thin * 1.2} />
          <SvgIcon name="eyeOff" x={GLOBE.x + 62} y={GLOBE.y - 58} size={30} color={C.amber} strokeWidth={2} />
        </g>
      ) : null}
    </g>
  );
  const inside = (
    <g style={gStyle('inside', C.cyan, dr)}>
      <rect x={FENCE_X + 12} y={0} width={CUSTOMS_BASE.w - FENCE_X - 12} height={CUSTOMS_BASE.h} rx={20} fill={alpha(C.cyan, 0.05)} />
      <rect x={NET.x0} y={NET.y0} width={NET.x1 - NET.x0} height={NET.y1 - NET.y0} rx={18} fill={C.ink850} stroke={alpha(C.cyan, 0.8)} strokeWidth={lw} />
      {(['server', 'desktop', 'database'] as const).map((n, i) => (
        <g key={n}>
          <rect x={NET.x0 + 34 + i * 130} y={NET.y0 + 120} width={92} height={92} rx={16} fill={alpha(C.cyan, 0.1)} stroke={alpha(C.cyan, 0.6)} strokeWidth={thin} />
          <SvgIcon name={n} x={NET.x0 + 80 + i * 130} y={NET.y0 + 166} size={54} color={C.cyanSoft} strokeWidth={1.9} />
        </g>
      ))}
    </g>
  );

  // ---- Fence (top view: double rail + crosshatch + posts) -------------------------------------------
  const fence = (
    <g stroke={INK.struct} strokeLinecap="round" opacity={dr}>
      <path d={`M ${FENCE_X - 9} 0 L ${FENCE_X - 9} ${CUSTOMS_BASE.h} M ${FENCE_X + 9} 0 L ${FENCE_X + 9} ${CUSTOMS_BASE.h}`} strokeWidth={thin} />
      {!icon ? (
        <path
          d={Array.from({ length: 30 }, (_, i) => `M ${FENCE_X - 9} ${i * 20} L ${FENCE_X + 9} ${i * 20 + 20} M ${FENCE_X + 9} ${i * 20} L ${FENCE_X - 9} ${i * 20 + 20}`).join(' ')}
          strokeWidth={sw(1.2, 0.8)}
          opacity={0.45}
        />
      ) : null}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={FENCE_X - 7} y={i * 40 - 7} width={14} height={14} rx={3} fill={C.ink800} strokeWidth={thin} />
      ))}
    </g>
  );

  // ---- Routes ------------------------------------------------------------------------------------------
  const tube = (pts: Pt[], o: number, key: string) =>
    o > 0.01 ? (
      <g key={key} opacity={o}>
        <path d={polylinePath(pts)} fill="none" stroke={alpha(C.cyan, 0.18)} strokeWidth={sw(34, 10)} strokeLinejoin="round" strokeLinecap="round" />
        <path d={polylinePath(pts)} fill="none" stroke={alpha(C.cyan, 0.85)} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round" pathLength={1000} strokeDasharray={`${1000 * tn} 1000`} />
      </g>
    ) : null;
  const branch = (pts: Pt[], o: number, color: string, key: string, dashed = true) =>
    o > 0.01 ? (
      <g key={key} opacity={o}>
        <path d={polylinePath(pts)} fill="none" stroke={color} strokeWidth={thin * 1.4} strokeDasharray={dashed ? '10 10' : undefined} strokeLinejoin="round" strokeLinecap="round" />
        <ArrowHead x={pts[pts.length - 1].x} y={pts[pts.length - 1].y} angle={Math.atan2(pts[pts.length - 1].y - pts[pts.length - 2].y, pts[pts.length - 1].x - pts[pts.length - 2].x)} size={sw(18, 7)} color={color} />
      </g>
    ) : null;
  const after = (r: ReturnType<typeof routes>, f: Flow) => r[f].slice(r.tunnel.length - 1);
  const routesEl = (
    <g>
      {tube(full.tunnel, (1 - sp) * dr, 'tf')}
      {tube(spl.tunnel, sp * dr, 'ts')}
      {branch(after(full, 'web'), (1 - sp) * dr * tn * 0.85, alpha(C.cyanSoft, 0.7), 'bw')}
      {branch(after(full, 'files'), (1 - sp) * dr * tn * 0.85, alpha(C.cyanSoft, 0.7), 'bf')}
      {branch(after(full, 'mail'), (1 - sp) * dr * tn * 0.85, alpha(C.cyanSoft, 0.7), 'bm')}
      {branch(after(spl, 'files'), sp * dr * tn * 0.85, alpha(C.cyanSoft, 0.7), 'sf')}
      {branch(after(spl, 'mail'), sp * dr * tn * 0.85, alpha(C.cyanSoft, 0.7), 'sm')}
      {branch(spl.web, dir, C.amber, 'sd', false)}
    </g>
  );

  // ---- Bridge -------------------------------------------------------------------------------------------
  const bridgeEl =
    br > 0.01 ? (
      <g opacity={br}>
        <path d={polylinePath(BRIDGE)} fill="none" stroke={alpha(C.rose, 0.25)} strokeWidth={sw(30, 10)} strokeLinejoin="round" strokeLinecap="round" />
        <path d={polylinePath(BRIDGE)} fill="none" stroke={C.rose} strokeWidth={lw * 1.2} strokeDasharray="16 12" strokeDashoffset={-frame * 1.2} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    ) : null;

  // ---- The booth on the fence -----------------------------------------------------------------------------
  // The beam sweeps across the inspection lane only, so it never runs over the «aduana» label above it.
  const scanX = BOOTH.x0 + 24 + ((Math.sin((frame / 30) * Math.PI * 0.8) + 1) / 2) * (BOOTH.x1 - BOOTH.x0 - 48);
  const booth = (
    <g style={gStyle('customs', C.cyan, dr)} strokeLinejoin="round">
      {/* Front face (3/4) */}
      <rect x={BOOTH.x0} y={BOOTH.y1 - 8} width={BOOTH.x1 - BOOTH.x0} height={28} rx={4} fill={C.ink700} stroke={alpha(C.cyan, 0.75)} strokeWidth={thin} />
      {/* Roof */}
      <rect x={BOOTH.x0} y={BOOTH.y0} width={BOOTH.x1 - BOOTH.x0} height={BOOTH.y1 - BOOTH.y0} rx={14} fill={C.ink850} stroke={C.cyan} strokeWidth={lw} />
      {/* The inspection lane through it */}
      <rect x={BOOTH.x0 - 4} y={BOOTH.lane - 26} width={BOOTH.x1 - BOOTH.x0 + 8} height={52} rx={6} fill={C.ink950} stroke={alpha(C.cyan, 0.6)} strokeWidth={thin} />
      {/* Scanner arch over the lane */}
      <rect x={FENCE_X - 16} y={BOOTH.lane - 44} width={32} height={88} rx={8} fill={C.ink800} stroke={C.cyan} strokeWidth={thin * 1.2} />
      {ins > 0.01 ? (
        <g opacity={ins}>
          <rect x={scanX - 14} y={BOOTH.lane - 24} width={28} height={48} rx={8} fill={alpha(C.cyan, 0.14)} />
          <rect x={scanX - 3} y={BOOTH.lane - 24} width={6} height={48} rx={3} fill={alpha(C.cyanSoft, 0.8)} />
        </g>
      ) : null}
      <SvgIcon name="search" x={BOOTH.x1 - 36} y={BOOTH.y1 - 26} size={38} color={ins > 0.01 ? C.cyanSoft : alpha(C.cyan, 0.7)} strokeWidth={2.2} />
    </g>
  );

  // ---- Tokens ---------------------------------------------------------------------------------------------
  const list = (v: number | number[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]).filter((t) => t > 0 && t < 1);
  const tokenEls = (['web', 'files', 'mail'] as const).flatMap((f) =>
    list(f === 'web' ? web : f === 'files' ? files : mail).map((t, i) => {
      const p = polylinePoint(mode[f], t);
      const fade = Math.min(1, t * 10, (1 - t) * 10);
      const r = icon ? 34 : 28;
      const directWeb = f === 'web' && sp >= 0.5;
      const ring = directWeb ? C.amber : C.cyan;
      return (
        <g key={`${f}-${i}`} opacity={fade}>
          <circle cx={p.x} cy={p.y} r={r + 8} fill={alpha(ring, 0.2)} />
          <circle cx={p.x} cy={p.y} r={r} fill={C.ink900} stroke={ring} strokeWidth={lw} />
          <SvgIcon name={FLOW_ICON[f]} x={p.x} y={p.y} size={r * 1.15} color={directWeb ? INK.amberSoft : C.cyanSoft} strokeWidth={2.2} />
        </g>
      );
    }),
  );

  // ---- The laptop ------------------------------------------------------------------------------------------
  const lp = { x: mix(LAPTOP.full.x, LAPTOP.split.x, sp), y: mix(LAPTOP.full.y, LAPTOP.split.y, sp) };
  const laptopEl =
    laptop > 0.01 ? (
      <g style={gStyle('laptop', C.cyan, clamp01(laptop))}>
        <LeggedLaptop x={lp.x} y={lp.y} straddle={sp} lw={lw} />
      </g>
    ) : null;

  // ---- Labels ----------------------------------------------------------------------------------------------
  const lab = (k: CustomsElement, show: number): CSSProperties => ({ opacity: show * (1 - 0.6 * fx[k].dim) });
  const L = customsLayout(width);
  const labelsEl = showLabels ? (
    <>
      <Label x={30 * s} y={22 * s} size={Math.max(34, 46 * s)} weight={800} color={'#a3b1c6'} style={lab('internet', dr)}>
        {CUSTOMS_TEXT.internet}
      </Label>
      <Label x={(CUSTOMS_BASE.w - 30) * s} y={22 * s} anchor="right-top" size={Math.max(34, 46 * s)} weight={800} color={C.cyanSoft} style={lab('inside', dr)}>
        {CUSTOMS_TEXT.inside}
      </Label>
      <Label x={(BOOTH.x0 + 16) * s} y={(BOOTH.y0 + 10) * s} anchor="left-top" size={Math.max(32, 38 * s)} weight={850} color={C.textStrong} style={lab('customs', dr)}>
        {CUSTOMS_TEXT.customs}
      </Label>
    </>
  ) : null;
  const inspectEl =
    showLabels && ins > 0.01 ? (
      <Label
        x={L.inspectLabel.x}
        y={L.inspectLabel.y}
        anchor="center-top"
        size={Math.max(32, 36 * s)}
        weight={800}
        color={C.textStrong}
        align="center"
        style={{ ...lab('customs', ins), background: C.ink900, border: `3px solid ${alpha(C.cyan, 0.8)}`, borderRadius: 14, padding: '6px 18px 8px', whiteSpace: 'pre-line' }}
      >
        {/* Two lines: one line was wide enough to cover the full-tunnel tube on the left. */}
        {CUSTOMS_TEXT.inspect.replace(' · registros', '\nregistros')}
      </Label>
    ) : null;
  const directEl =
    showLabels && dir > 0.01 ? (
      <Label x={L.directLabel.x} y={L.directLabel.y} anchor="center-top" size={Math.max(32, 36 * s)} weight={800} color={INK.amberSoft} style={{ opacity: dir, background: alpha(C.ink900, 0.9), padding: '2px 12px 4px', borderRadius: 10 }}>
        {CUSTOMS_TEXT.direct}
      </Label>
    ) : null;

  return (
    <div style={{ position: 'relative', width, height: h, ...style }}>
      <svg width={width} height={h} viewBox={`0 0 ${CUSTOMS_BASE.w} ${CUSTOMS_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        {outside}
        {inside}
        {fence}
        {routesEl}
        {bridgeEl}
        {booth}
        {laptopEl}
        {tokenEls}
      </svg>
      {labelsEl}
      {inspectEl}
      {directEl}
    </div>
  );
}
