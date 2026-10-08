import type { CSSProperties, ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { INK, Label, PersonBust, dropGlow, joinFilters, polylinePoint, resolveFocus, strokeAt, useSvgId } from './glyphs';

/**
 * The two sites and the two tunnels (canon: out/scene-brief.md «Visual metaphors»), seen from above
 * like V16's port map, drawn ONE way in s05, s07, s08 and s10:
 *
 *   - «sede» (left) and «terminal de contenedores» (right): two buildings with their equipment inside
 *     («no instalan nada · no saben que existe», `transparent`);
 *   - between them, a street that is not yours: «Internet» (slate; `traffic` drives anonymous cars);
 *   - the COVERED CORRIDOR (SITE-TO-SITE VPN): a straight walkway with a ribbed glass roof crossing the
 *     street from «pasarela de la sede» to «pasarela de la terminal». Seen from above it has no arches,
 *     no piers and no cables: it can't read as a bridge. `corridor` draws it across; `packet` (0–1, or
 *     a list) moves something along it, sede → terminal; `cargo` replaces the default packet (s07 puts
 *     the container in it);
 *   - THE LAUNCH (REMOTE ACCESS VPN), `Launch`: a small boat on the water by the quay, one person with
 *     a laptop and its «cliente» tag, on its own route to the sede's jetty (`launch` 0–1 along it).
 *     It also works standalone (s08: no buildings).
 *
 * Design units 1728 × 660 (the whole stage) scaled to `width`; drawing scales, label text stays ≥ 32 px
 * and wraps inside its building. Below ~560 px it switches to `detail: 'icon'` (no labels, no equipment,
 * no traffic; thick lines) for s10. `sitesLayout()` / `sitesPoint()` / `corridorPoint()` / `launchPoint()`
 * give px anchors. Nothing reads the timeline except the optional `frame` (traffic).
 */

/** Canon strings (out/scene-brief.md), exactly. */
export const SITES_TEXT = {
  sede: 'sede',
  terminal: 'terminal de contenedores',
  street: 'Internet',
  gatewaySede: 'pasarela de la sede',
  gatewayTerminal: 'pasarela de la terminal',
  transparent: ['no instalan nada', 'no saben que existe'],
  transparentInline: 'no instalan nada · no saben que existe',
  client: 'cliente',
} as const;

export const SITES_BASE = { w: 1728, h: 660 } as const;
const D = {
  quay: 548,
  sede: { x0: 30, x1: 600, y0: 40, y1: 500 },
  terminal: { x0: 1128, x1: 1698, y0: 40, y1: 500 },
  street: { x0: 660, x1: 1068 },
  corridor: { x0: 600, x1: 1128, y0: 270, y1: 350 },
  pier: { x0: 236, x1: 284, y0: 524, y1: 600 },
  /** The launch's route on the water, right → the sede's jetty. */
  route: [
    { x: 1640, y: 616 },
    { x: 1040, y: 622 },
    { x: 400, y: 616 },
  ],
} as const;

export type SitesElement = 'sede' | 'terminal' | 'street' | 'corridor' | 'launch' | 'equipment';
const ELEMENTS: readonly SitesElement[] = ['sede', 'terminal', 'street', 'corridor', 'launch', 'equipment'];
export type SitesDetail = 'full' | 'icon';

export function sitesDetail(width: number): SitesDetail {
  return width < 560 ? 'icon' : 'full';
}

/** Every box and anchor in px from the Sites' top-left. */
export function sitesLayout(width: number = SITES_BASE.w) {
  const s = width / SITES_BASE.w;
  const box = (b: { x0: number; x1: number; y0: number; y1: number }) => ({ x: b.x0 * s, y: b.y0 * s, w: (b.x1 - b.x0) * s, h: (b.y1 - b.y0) * s });
  const cy = ((D.corridor.y0 + D.corridor.y1) / 2) * s;
  return {
    width,
    height: SITES_BASE.h * s,
    scale: s,
    sede: box(D.sede),
    terminal: box(D.terminal),
    street: { x: D.street.x0 * s, y: 0, w: (D.street.x1 - D.street.x0) * s, h: D.quay * s },
    corridor: { x0: D.corridor.x0 * s, x1: D.corridor.x1 * s, y0: D.corridor.y0 * s, y1: D.corridor.y1 * s, cy },
    /** The two gateway doors (corridor ends). */
    gateways: { sede: { x: D.corridor.x0 * s, y: cy }, terminal: { x: D.corridor.x1 * s, y: cy } },
    water: { y: D.quay * s, h: (SITES_BASE.h - D.quay) * s },
    pier: box(D.pier),
    /** Where the street's label sits (centre-top). */
    streetLabel: { x: ((D.street.x0 + D.street.x1) / 2) * s, y: 24 * s },
    /** Centre of the «no instalan nada · no saben que existe» caption. */
    caption: { x: ((D.street.x0 + D.street.x1) / 2) * s, y: 440 * s },
    /** Centres of the equipment groups. */
    equipment: { sede: { x: 285 * s, y: 430 * s }, terminal: { x: 1268 * s, y: 435 * s } },
  };
}

export type SitesLayout = ReturnType<typeof sitesLayout>;

/** A point on the corridor's centre line, 0 = sede's gateway … 1 = terminal's (px). */
export function corridorPoint(width: number, t: number) {
  const s = width / SITES_BASE.w;
  const x0 = D.corridor.x0 + 14;
  const x1 = D.corridor.x1 - 14;
  return { x: (x0 + (x1 - x0) * clamp01(t)) * s, y: ((D.corridor.y0 + D.corridor.y1) / 2) * s };
}

/** The launch's centre (its waterline middle) on its route, 0 = out on the water … 1 = at the sede's jetty (px). */
export function launchPoint(width: number, t: number) {
  const s = width / SITES_BASE.w;
  const p = polylinePoint(D.route, clamp01(t));
  return { x: p.x * s, y: p.y * s };
}

export type SitesPoint = 'sede' | 'terminal' | 'street' | 'corridor' | 'gatewaySede' | 'gatewayTerminal' | 'pier' | 'water' | 'caption';

/** Named anchors in px (centres). */
export function sitesPoint(width: number, which: SitesPoint): { x: number; y: number } {
  const L = sitesLayout(width);
  const c = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
  switch (which) {
    case 'sede':
      return c(L.sede);
    case 'terminal':
      return c(L.terminal);
    case 'street':
      return { x: L.street.x + L.street.w / 2, y: L.street.h / 2 };
    case 'corridor':
      return { x: (L.corridor.x0 + L.corridor.x1) / 2, y: L.corridor.cy };
    case 'gatewaySede':
      return L.gateways.sede;
    case 'gatewayTerminal':
      return L.gateways.terminal;
    case 'pier':
      return c(L.pier);
    case 'water':
      return { x: width / 2, y: L.water.y + L.water.h / 2 };
    case 'caption':
      return L.caption;
  }
}

// ---------------------------------------------------------------------------
// The launch («la lancha»), standalone

export const LAUNCH_BASE = { w: 280, h: 170 } as const;

export function launchSize(width: number) {
  return { w: width, h: (LAUNCH_BASE.h * width) / LAUNCH_BASE.w, scale: width / LAUNCH_BASE.w };
}

/**
 * Anchors in px from the Launch's top-left: 'laptop' (the screen), 'tag' (the «cliente» tag's centre),
 * 'person' (head), 'bow', 'stern', 'waterline' (middle of the hull's waterline: what `launchPoint` aims).
 */
export function launchAnchor(width: number, which: 'laptop' | 'tag' | 'person' | 'bow' | 'stern' | 'waterline', flip = false) {
  const { scale } = launchSize(width);
  const P = { laptop: { x: 104, y: 92 }, tag: { x: 104, y: 30 }, person: { x: 160, y: 72 }, bow: { x: 10, y: 118 }, stern: { x: 262, y: 120 }, waterline: { x: 140, y: 140 } }[which];
  const x = flip ? LAUNCH_BASE.w - P.x : P.x;
  return { x: x * scale, y: P.y * scale };
}

/**
 * The launch: a small motor boat (bow to the left; `flip` turns it), ONE person aboard with an open
 * laptop and a «cliente» tag over it (`client` 0–1). `wake` 0–1 draws its wake (it is moving). Design
 * 280 × 170 scaled to `width` (≥ ~220 px keeps the tag's 32 px text proportionate). People neutral,
 * laptop and tag cyan (the port's client program).
 */
export function Launch({
  width = 280,
  client = 1,
  wake = 0,
  flip = false,
  water = true,
  tag = true,
  glow = 0,
  dim = 0,
  show = 1,
  style,
}: {
  width?: number;
  client?: number;
  wake?: number;
  flip?: boolean;
  /** Draw a short strip of water under the hull. */
  water?: boolean;
  /** Show the «cliente» text tag (false: just the cyan laptop). */
  tag?: boolean;
  glow?: number;
  dim?: number;
  show?: number;
  style?: CSSProperties;
}) {
  const { h, scale: s } = launchSize(width);
  const sw = strokeAt(s);
  const lw = sw(3.4, 1.6);
  const thin = sw(2.2, 1.1);
  const c = clamp01(client);
  const wk = clamp01(wake);
  const d = clamp01(dim);
  const tagPt = launchAnchor(width, 'tag', flip);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: clamp01(show) * (1 - 0.6 * d),
        filter: joinFilters(dropGlow(C.cyan, clamp01(glow)), d > 0.01 ? `saturate(${1 - 0.5 * d})` : ''),
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${LAUNCH_BASE.w} ${LAUNCH_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <g transform={flip ? `translate(${LAUNCH_BASE.w} 0) scale(-1 1)` : undefined} strokeLinejoin="round" strokeLinecap="round">
          {water ? (
            <g stroke={INK.waterLine} strokeWidth={thin} fill="none" opacity={0.9}>
              <path d="M -6 148 q 14 -8 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0 t 28 0" />
            </g>
          ) : null}
          {wk > 0.01 ? (
            <g stroke={alpha('#e2e8f0', 0.7 * wk)} strokeWidth={thin} fill="none">
              <path d={`M 268 128 L ${268 + 60 * wk} 120 M 270 138 L ${270 + 80 * wk} 140 M 262 146 L ${262 + 46 * wk} 154`} />
            </g>
          ) : null}
          {/* Hull */}
          <path d="M 8 112 L 266 112 L 254 142 L 52 142 Q 22 132 8 112 Z" fill={C.ink800} stroke={INK.steel} strokeWidth={lw} />
          <path d="M 24 124 L 258 124" stroke={alpha(INK.steel, 0.5)} strokeWidth={thin} />
          {/* Motor at the stern */}
          <rect x={256} y={94} width={20} height={30} rx={5} fill={C.ink700} stroke={INK.steel} strokeWidth={thin} />
          {/* The one passenger, seated */}
          <PersonBust x={160} y={72} scale={1.05} color={INK.person} strokeWidth={lw * 0.9} />
          {/* Seat back */}
          <path d="M 182 112 L 196 82" stroke={INK.steel} strokeWidth={lw} />
          {/* The laptop on their knees, screen lit (cyan: the port's client) */}
          <g>
            <path d="M 88 110 L 132 110" stroke={C.cyan} strokeWidth={lw} />
            <path d="M 90 108 L 82 76 L 122 76 L 128 108 Z" fill={alpha(C.cyan, 0.18 + 0.3 * c)} stroke={C.cyan} strokeWidth={lw} />
            <path d="M 112 112 Q 132 112 146 102" stroke={INK.person} strokeWidth={lw * 1.4} fill="none" />
          </g>
          {/* The tag's string */}
          {c > 0.01 ? <path d={`M 104 78 L 104 ${30 + 22}`} stroke={alpha(C.cyan, 0.85 * c)} strokeWidth={thin} strokeDasharray="3 4" /> : null}
        </g>
      </svg>
      {c > 0.01 && tag ? (
        <div
          style={{
            position: 'absolute',
            left: tagPt.x,
            top: tagPt.y,
            transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * c})`,
            opacity: c,
            fontFamily: FONT.sans,
            fontWeight: 800,
            fontSize: 32,
            lineHeight: 1,
            color: C.cyanSoft,
            background: C.ink900,
            border: `3px solid ${C.cyan}`,
            borderRadius: 999,
            padding: '6px 16px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {SITES_TEXT.client}
        </div>
      ) : c > 0.01 ? (
        <div style={{ position: 'absolute', left: tagPt.x, top: tagPt.y, width: 30 * s, height: 16 * s, transform: 'translate(-50%, -50%)', borderRadius: 999, border: `${Math.max(2, 3 * s)}px solid ${C.cyan}`, opacity: c }} />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sites

export interface SitesProps {
  width?: number;
  /** 0–1 the two buildings and the street draw in. Default 1. */
  draw?: number;
  /** 0–1 the corridor grows across the street, sede → terminal. Default 1. */
  corridor?: number;
  /** 0–1 the two gateway labels. Default = corridor. */
  gateways?: number;
  /** 0–1 equipment inside both buildings. Default 1. */
  equipment?: number;
  /** 0–1 «no instalan nada · no saben que existe» (centred on the street, leaders to both groups). */
  transparent?: number;
  /** 0–1 anonymous cars on the street (texture; moves with `frame`). Default 0. */
  traffic?: number;
  /** Something travelling in the corridor: 0–1 (or several), 0 = sede's gateway … 1 = terminal's. */
  packet?: number | number[];
  /** Replace the default packet with your own drawing (px, centred on the packet's point). Receives the part's scale. */
  cargo?: ReactNode | ((scale: number) => ReactNode);
  /** 0–1 the launch shows (with its water). Default 0. */
  launch?: number;
  /** 0–1 the launch along its route to the sede's jetty. */
  launchT?: number;
  /** 0–1 the launch's «cliente» tag. Default 1. */
  launchClient?: number;
  /** 0–1 the water strip and the quay (default 1; the launch needs it). */
  water?: number;
  focus?: Partial<Record<SitesElement, number>>;
  dim?: Partial<Record<SitesElement, number>>;
  autoDim?: boolean;
  /** Show text labels (default true at full detail). */
  labels?: boolean;
  detail?: SitesDetail;
  frame?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Sites({
  width = SITES_BASE.w,
  draw = 1,
  corridor = 1,
  gateways,
  equipment = 1,
  transparent = 0,
  traffic = 0,
  packet,
  cargo,
  launch = 0,
  launchT = 0,
  launchClient = 1,
  water = 1,
  focus = {},
  dim = {},
  autoDim = true,
  labels = true,
  detail: detailProp,
  frame: frameProp,
  style,
  children,
}: SitesProps) {
  const id = useSvgId('sites');
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const L = sitesLayout(width);
  const s = L.scale;
  const detail = detailProp ?? sitesDetail(width);
  const icon = detail === 'icon';
  const sw = strokeAt(s);
  const lw = sw(3.6, icon ? 2 : 2);
  const thin = sw(2.2, icon ? 1.4 : 1.2);
  const fx = resolveFocus(ELEMENTS, focus, dim, autoDim);
  const dr = clamp01(draw);
  const co = clamp01(corridor);
  const gw = clamp01(gateways ?? co);
  const eq = icon ? 0 : clamp01(equipment);
  const tr = icon ? 0 : clamp01(traffic);
  const wa = clamp01(water);
  const la = clamp01(launch);
  const showLabels = labels && !icon;

  const gStyle = (k: SitesElement, color: string, show = 1): CSSProperties => ({
    opacity: show * (1 - 0.6 * fx[k].dim),
    filter: joinFilters(dropGlow(color, fx[k].focus), fx[k].dim > 0.01 ? `saturate(${1 - 0.5 * fx[k].dim})` : ''),
  });

  // ---- Water and quay ----------------------------------------------------------------------------
  const waterEl =
    wa > 0.01 ? (
      <g opacity={wa}>
        <defs>
          <clipPath id={`${id}-water`}>
            <rect x={0} y={D.quay} width={SITES_BASE.w} height={SITES_BASE.h - D.quay} />
          </clipPath>
        </defs>
        <rect x={0} y={D.quay} width={SITES_BASE.w} height={SITES_BASE.h - D.quay} fill={INK.water} />
        <line x1={0} y1={D.quay} x2={SITES_BASE.w} y2={D.quay} stroke={INK.struct} strokeWidth={lw} />
        {!icon ? (
          <g stroke={INK.waterLine} strokeWidth={thin} fill="none" strokeLinecap="round" clipPath={`url(#${id}-water)`}>
            {[0, 1, 2].map((r) =>
              Array.from({ length: 9 }, (_, i) => {
                const x = ((i * 197 + r * 83 + frame * 0.6) % (SITES_BASE.w + 120)) - 60;
                const y = D.quay + 30 + r * 34;
                return <path key={`${r}-${i}`} d={`M ${x} ${y} q 12 -7 24 0 t 24 0`} />;
              }),
            )}
          </g>
        ) : null}
        {/* The sede's jetty */}
        <rect x={D.pier.x0} y={D.pier.y0} width={D.pier.x1 - D.pier.x0} height={D.pier.y1 - D.pier.y0} rx={3} fill={C.ink800} stroke={INK.struct} strokeWidth={thin} />
        {!icon ? <path d={`M ${D.pier.x0 + 4} ${D.pier.y0 + 20} L ${D.pier.x1 - 4} ${D.pier.y0 + 20} M ${D.pier.x0 + 4} ${D.pier.y0 + 40} L ${D.pier.x1 - 4} ${D.pier.y0 + 40} M ${D.pier.x0 + 4} ${D.pier.y0 + 60} L ${D.pier.x1 - 4} ${D.pier.y0 + 60}`} stroke={alpha(INK.struct, 0.6)} strokeWidth={thin} /> : null}
      </g>
    ) : null;

  // ---- The street (Internet: not yours) ----------------------------------------------------------------
  const st = D.street;
  const lanes = [st.x0 + 100, st.x0 + 300];
  const cars =
    tr > 0.01
      ? [0, 1, 2, 3, 4, 5].map((i) => {
          const down = i % 2 === 0;
          const speed = 2.2 + (i % 3) * 0.6;
          const span = D.quay + 140;
          const off = (i * 233) % span;
          const y = down ? ((frame * speed + off) % span) - 90 : span - 90 - ((frame * speed + off) % span);
          const x = lanes[down ? 0 : 1] + ((i * 37) % 30) - 15;
          return (
            <g key={i} transform={`translate(${x} ${y})`} opacity={tr}>
              <rect x={-22} y={-40} width={44} height={80} rx={12} fill={C.ink700} stroke={INK.struct} strokeWidth={thin} />
              <rect x={-15} y={down ? 14 : -30} width={30} height={16} rx={4} fill={alpha(INK.steel, 0.25)} />
            </g>
          );
        })
      : null;
  const streetEl = (
    <g style={gStyle('street', INK.struct, dr)}>
      <rect x={st.x0} y={-10} width={st.x1 - st.x0} height={D.quay + 10} fill={C.ink900} />
      <path d={`M ${st.x0} -10 L ${st.x0} ${D.quay} M ${st.x1} -10 L ${st.x1} ${D.quay}`} stroke={INK.struct} strokeWidth={lw} />
      {!icon ? <line x1={(st.x0 + st.x1) / 2} y1={0} x2={(st.x0 + st.x1) / 2} y2={D.quay} stroke={INK.structSoft} strokeWidth={sw(4, 1.6)} strokeDasharray="34 28" /> : null}
      {/* Kerb hatching: a street, not a zone */}
      {!icon ? (
        <path
          d={Array.from({ length: 16 }, (_, i) => `M ${st.x0 - 22} ${i * 36 + 8} L ${st.x0 - 6} ${i * 36 + 20} M ${st.x1 + 6} ${i * 36 + 8} L ${st.x1 + 22} ${i * 36 + 20}`).join(' ')}
          stroke={alpha(INK.struct, 0.35)}
          strokeWidth={thin}
        />
      ) : null}
      {cars}
    </g>
  );

  // ---- Buildings ---------------------------------------------------------------------------------------
  const building = (b: { x0: number; x1: number; y0: number; y1: number }, k: SitesElement) => (
    <g style={gStyle(k, C.cyan, dr)} strokeLinejoin="round">
      {/* Front face (3/4: the wall facing the quay) */}
      <rect x={b.x0} y={b.y1 - 6} width={b.x1 - b.x0} height={30} rx={4} fill={C.ink700} stroke={alpha(C.cyan, 0.75)} strokeWidth={thin} />
      {!icon
        ? Array.from({ length: Math.floor((b.x1 - b.x0 - 40) / 46) }, (_, i) => (
            <rect key={i} x={b.x0 + 24 + i * 46} y={b.y1 + 4} width={26} height={10} rx={2} fill={alpha(INK.lamp, 0.35)} />
          ))
        : null}
      {/* Roof / footprint */}
      <rect x={b.x0} y={b.y0} width={b.x1 - b.x0} height={b.y1 - b.y0} rx={10} fill={C.ink850} stroke={C.cyan} strokeWidth={lw} />
      <rect x={b.x0 + 12} y={b.y0 + 12} width={b.x1 - b.x0 - 24} height={b.y1 - b.y0 - 24} rx={6} fill="none" stroke={alpha(C.cyan, 0.3)} strokeWidth={thin} />
    </g>
  );

  // Containers inside the terminal (top view, muted)
  const boxes = [
    [1456, 262],
    [1572, 262],
    [1456, 316],
    [1572, 316],
    [1456, 370],
    [1572, 370],
  ];
  const containerTint = [alpha(INK.skySoft, 0.22), alpha('#94a3b8', 0.25), alpha(INK.amberSoft, 0.14), alpha(INK.skySoft, 0.16), alpha('#94a3b8', 0.2), alpha(INK.skySoft, 0.1)];
  const containersEl = !icon ? (
    <g style={gStyle('terminal', C.cyan, dr)}>
      {boxes.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width={104} height={42} rx={3} fill={containerTint[i]} stroke={alpha(INK.steel, 0.55)} strokeWidth={thin} />
          <path d={`M ${x + 20} ${y + 4} L ${x + 20} ${y + 38} M ${x + 40} ${y + 4} L ${x + 40} ${y + 38} M ${x + 60} ${y + 4} L ${x + 60} ${y + 38} M ${x + 80} ${y + 4} L ${x + 80} ${y + 38}`} stroke={alpha(INK.steel, 0.25)} strokeWidth={thin * 0.8} />
        </g>
      ))}
    </g>
  ) : null;

  // Equipment: workstations inside each building
  const ws = (x: number, y: number, key: string, name: 'desktop' | 'laptop' | 'server' = 'desktop') => (
    <g key={key} transform={`translate(${x - 31} ${y - 31})`}>
      <rect x={0} y={0} width={62} height={62} rx={11} fill={alpha(C.cyan, 0.08)} stroke={alpha(C.cyan, 0.5)} strokeWidth={thin} />
      <g transform="translate(11 11)">
        <Icon name={name} size={40} color={C.cyanSoft} strokeWidth={1.9} />
      </g>
    </g>
  );
  const eqSede = [
    [150, 396, 'desktop'],
    [240, 396, 'desktop'],
    [330, 396, 'laptop'],
    [420, 396, 'desktop'],
    [195, 464, 'desktop'],
    [285, 464, 'server'],
    [375, 464, 'desktop'],
  ] as const;
  const eqTerm = [
    [1200, 404, 'desktop'],
    [1290, 404, 'laptop'],
    [1245, 466, 'desktop'],
    [1335, 466, 'desktop'],
  ] as const;
  const equipmentEl =
    eq > 0.01 ? (
      <g style={gStyle('equipment', C.cyan, eq)}>
        {eqSede.map(([x, y, n], i) => ws(x, y, `s${i}`, n))}
        {eqTerm.map(([x, y, n], i) => ws(x, y, `t${i}`, n))}
      </g>
    ) : null;

  // ---- The corridor (covered walkway, ribbed glass roof) ---------------------------------------------
  const cr = D.corridor;
  const crW = (cr.x1 - cr.x0) * co;
  const ribs: number[] = [];
  for (let x = cr.x0 + 26; x < cr.x1 - 10; x += icon ? 52 : 30) ribs.push(x);
  const corridorEl =
    co > 0.01 ? (
      <g style={gStyle('corridor', C.cyan)}>
        <defs>
          <clipPath id={`${id}-cor`}>
            <rect x={cr.x0 - 20} y={cr.y0 - 40} width={crW + 20} height={cr.y1 - cr.y0 + 80} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-cor)`} strokeLinecap="round">
          {/* Its shadow on the street */}
          <rect x={st.x0} y={cr.y0 + 16} width={st.x1 - st.x0} height={cr.y1 - cr.y0} fill={alpha('#000000', 0.38)} />
          {/* Body: glass roof */}
          <rect x={cr.x0} y={cr.y0} width={cr.x1 - cr.x0} height={cr.y1 - cr.y0} fill={alpha(C.cyan, 0.14)} />
          {ribs.map((x) => (
            <line key={x} x1={x} y1={cr.y0 + 4} x2={x} y2={cr.y1 - 4} stroke={alpha(C.cyan, 0.5)} strokeWidth={thin} />
          ))}
          {!icon ? <line x1={cr.x0 + 8} y1={(cr.y0 + cr.y1) / 2} x2={cr.x1 - 8} y2={(cr.y0 + cr.y1) / 2} stroke={alpha(C.cyanSoft, 0.4)} strokeWidth={thin} strokeDasharray="10 12" /> : null}
          {/* Side walls (straight, no arches, no piers) */}
          <line x1={cr.x0} y1={cr.y0} x2={cr.x1} y2={cr.y0} stroke={C.cyan} strokeWidth={lw * 1.4} />
          <line x1={cr.x0} y1={cr.y1} x2={cr.x1} y2={cr.y1} stroke={C.cyan} strokeWidth={lw * 1.4} />
        </g>
      </g>
    ) : null;

  // Gateway doors on the two walls (always drawn with the buildings; lit with the corridor)
  const door = (x: number, key: string) => (
    <g key={key}>
      <rect x={x - 12} y={cr.y0 - 6} width={24} height={cr.y1 - cr.y0 + 12} rx={5} fill={C.ink900} stroke={alpha(C.cyan, 0.5 + 0.5 * co)} strokeWidth={lw} />
      {co > 0.01 ? <rect x={x - 6} y={cr.y0 + 4} width={12} height={cr.y1 - cr.y0 - 8} rx={3} fill={alpha(C.cyan, 0.5 * co)} /> : null}
    </g>
  );

  // ---- Packets in the corridor ------------------------------------------------------------------------
  const packets = packet === undefined ? [] : Array.isArray(packet) ? packet : [packet];
  const live = packets.filter((t) => t > 0 && t < 1);
  const packetEls = cargo
    ? null
    : live.map((t, i) => {
        const p = corridorPoint(SITES_BASE.w, t);
        const fade = Math.min(1, t * 8, (1 - t) * 8);
        return (
          <g key={i} opacity={fade}>
            <rect x={p.x - 30} y={p.y - 30} width={60} height={60} rx={14} fill={alpha(C.cyan, 0.2)} />
            <rect x={p.x - 19} y={p.y - 19} width={38} height={38} rx={8} fill={C.ink900} stroke={C.cyanSoft} strokeWidth={lw} />
            <path d={`M ${p.x - 9} ${p.y - 5} L ${p.x + 9} ${p.y - 5} M ${p.x - 9} ${p.y + 5} L ${p.x + 4} ${p.y + 5}`} stroke={C.cyanSoft} strokeWidth={thin * 1.2} strokeLinecap="round" />
          </g>
        );
      });
  const cargoEls = cargo
    ? live.map((t, i) => {
        const p = corridorPoint(width, t);
        const fade = Math.min(1, t * 8, (1 - t) * 8);
        return (
          <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -50%)', opacity: fade }}>
            {typeof cargo === 'function' ? cargo(s) : cargo}
          </div>
        );
      })
    : null;

  // ---- Labels (HTML) --------------------------------------------------------------------------------------
  const lab = (k: SitesElement, show: number) => ({ opacity: show * (1 - 0.6 * fx[k].dim) });
  const nameSize = Math.max(34, 50 * s);
  const termSize = Math.max(32, 42 * s);
  const smallSize = 32;
  const labelsEl = showLabels ? (
    <>
      <Label x={(D.sede.x0 + 30) * s} y={(D.sede.y0 + 22) * s} size={nameSize} weight={850} color={C.textStrong} style={lab('sede', dr)}>
        {SITES_TEXT.sede}
      </Label>
      <Label x={(D.terminal.x0 + 30) * s} y={(D.terminal.y0 + 22) * s} size={termSize} weight={850} color={C.textStrong} maxWidth={(D.terminal.x1 - D.terminal.x0 - 50) * s} style={lab('terminal', dr)}>
        {SITES_TEXT.terminal}
      </Label>
      <Label x={L.streetLabel.x} y={L.streetLabel.y} anchor="center-top" size={Math.max(34, 46 * s)} weight={800} color={'#a3b1c6'} style={{ ...lab('street', dr), background: alpha(C.ink900, 0.85), padding: '2px 14px 6px', borderRadius: 10 }}>
        {SITES_TEXT.street}
      </Label>
      {gw > 0.01 ? (
        <>
          <Label x={(D.corridor.x0 - 24) * s} y={(D.corridor.y0 - 18) * s} anchor="right-bottom" size={smallSize} weight={800} color={C.cyanSoft} style={lab('corridor', gw)}>
            {SITES_TEXT.gatewaySede}
          </Label>
          <Label x={(D.corridor.x1 + 24) * s} y={(D.corridor.y0 - 18) * s} anchor="left-bottom" size={smallSize} weight={800} color={C.cyanSoft} style={lab('corridor', gw)}>
            {SITES_TEXT.gatewayTerminal}
          </Label>
        </>
      ) : null}
    </>
  ) : null;

  const tp = clamp01(transparent) * (icon ? 0 : 1);
  const capW = (D.street.x1 - D.street.x0 + 40) * s;
  const captionEl =
    tp > 0.01 ? (
      <Label
        x={L.caption.x}
        y={L.caption.y}
        anchor="center"
        size={Math.max(32, 36 * s)}
        weight={800}
        color={C.textStrong}
        style={{ ...lab('equipment', tp), background: C.ink900, border: `3px solid ${alpha(C.cyan, 0.7)}`, borderRadius: 16, padding: '8px 18px 10px', maxWidth: undefined, minWidth: capW * 0.6 }}
      >
        {SITES_TEXT.transparent[0]}
        <br />
        {SITES_TEXT.transparent[1]}
      </Label>
    ) : null;
  const leaders =
    tp > 0.01 ? (
      <g opacity={tp} stroke={alpha(C.cyanSoft, 0.7)} strokeWidth={thin} strokeDasharray="6 8" fill="none">
        <path d={`M ${D.street.x0 + 6} 440 L 462 440`} />
        <path d={`M ${D.street.x1 - 6} 440 L 1166 440`} />
      </g>
    ) : null;

  // ---- The launch (on the water) -----------------------------------------------------------------------
  const lp = launchPoint(width, launchT);
  const launchW = 280 * s * (icon ? 1.3 : 1);
  const lAnchor = launchAnchor(launchW, 'waterline');
  const moving = launchT > 0.001 && launchT < 0.999 ? 1 : 0;
  const launchEl =
    la > 0.01 ? (
      <div style={{ position: 'absolute', left: lp.x - lAnchor.x, top: lp.y - lAnchor.y, ...gStyle('launch', C.cyan, la) }}>
        <Launch width={launchW} client={launchClient} wake={moving} water={false} tag={!icon} />
      </div>
    ) : null;

  return (
    <div style={{ position: 'relative', width, height: L.height, ...style }}>
      <svg width={width} height={L.height} viewBox={`0 0 ${SITES_BASE.w} ${SITES_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        {waterEl}
        {streetEl}
        {building(D.sede, 'sede')}
        {building(D.terminal, 'terminal')}
        {containersEl}
        {equipmentEl}
        {leaders}
        {corridorEl}
        <g style={gStyle('corridor', C.cyan, dr)}>
          {door(D.corridor.x0, 'ds')}
          {door(D.corridor.x1, 'dt')}
        </g>
        {packetEls}
      </svg>
      {labelsEl}
      {captionEl}
      {cargoEls}
      {launchEl}
      {children}
    </div>
  );
}
