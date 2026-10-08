// Copied unchanged from V16 (video/zonas-halden/src/scenes/parts/ZoneRow.tsx, branch video-zonas-halden) so the zone
// plan V17 opens on looks exactly like the one V16 approved. Edit it in V16 first, then copy it here again.
import { useId, type CSSProperties, type ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { Checkpoint, checkpointSize } from './Checkpoint';

/**
 * «El plan nuevo» (canon: out/scene-brief.md «Visual metaphors»): the zones of
 * the new network drawn as a clean blueprint — crisp lines, a faint grid and a
 * small «plan» tag. Nothing of it runs yet, so it never looks like the napkin
 * and never like a live system.
 *
 *   - `ZONES` / `ZONE_ORDER` / `CONFIDENCE`: the six zones of s03, in order,
 *     with their confidence and its colour — ONE colour map everywhere:
 *     «ninguna» slate, «baja» amber, «media» sky, «crítica, pero frágil» rose,
 *     «máxima» emerald. No system names inside the zones (the lab places them).
 *   - `BlueprintPanel`: the blueprint paper (grid + «plan» tag). Put single
 *     zones on it (s04, s05, s07) so they sit on the same paper as s03's row.
 *   - `ZoneBox`: one zone in the shared style; custom name / confidence /
 *     tone allowed (s07's pumps network), `children` drawn inside (s04 portal,
 *     s05 interfaces).
 *   - `ZoneRow`: the six zones in a row on a panel, a planned checkpoint (the
 *     blueprint `Checkpoint`) on the road between each two, per-zone draw-in,
 *     focus and dim, and s03's laptop: its reach outline stays inside
 *     «interna», plus a dashed link through one gate (lo que una regla permita).
 *     `zoneRowLayout()` gives every box and gate in px.
 *
 * Frames are Sequence-relative; `frame` defaults to useCurrentFrame(). Nothing
 * is positioned: wrap each piece in an absolutely positioned div.
 */

export type ZoneId = 'internet' | 'dmz' | 'interna' | 'ot' | 'gestion' | 'invitados';
export type Confidence = 'ninguna' | 'baja' | 'media' | 'critica' | 'maxima';

/** Confidence → its canon label (lines) and colour. */
export const CONFIDENCE: Record<Confidence, { label: string; lines: readonly string[]; color: string; soft: string }> = {
  ninguna: { label: 'ninguna', lines: ['ninguna'], color: C.muted, soft: '#cbd5e1' },
  baja: { label: 'baja', lines: ['baja'], color: C.amber, soft: '#fcd34d' },
  media: { label: 'media', lines: ['media'], color: C.sky, soft: '#7dd3fc' },
  critica: { label: 'crítica, pero frágil', lines: ['crítica,', 'pero frágil'], color: C.rose, soft: C.roseSoft },
  maxima: { label: 'máxima', lines: ['máxima'], color: C.emerald, soft: '#6ee7b7' },
};

/** The six zones of the plan (canon strings, exactly). */
export const ZONES: Record<ZoneId, { name: string; confidence: Confidence }> = {
  internet: { name: 'Internet', confidence: 'ninguna' },
  dmz: { name: 'DMZ', confidence: 'baja' },
  interna: { name: 'interna', confidence: 'media' },
  ot: { name: 'OT', confidence: 'critica' },
  gestion: { name: 'gestión', confidence: 'maxima' },
  invitados: { name: 'invitados', confidence: 'ninguna' },
};

export const ZONE_ORDER: readonly ZoneId[] = ['internet', 'dmz', 'interna', 'ot', 'gestion', 'invitados'];

/** The colour of a zone (by its confidence). */
export function zoneColor(zone: ZoneId): string {
  return CONFIDENCE[ZONES[zone].confidence].color;
}

/** s03's laptop caption (canon). */
export const REACH_TEXT = { lead: 'alcanza: ', own: 'su zona', and: ' y ', rule: 'lo que una regla permita' } as const;

const PLAN_LINE = C.cyan;
const PANEL_BG = '#081427';

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(6 + 18 * g)}px ${alpha(color, 0.6 * g)})` : '');
const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/** Reveals its child left to right like a pen writing it (p 0–1). */
function Reveal({ p, children, style }: { p: number; children: ReactNode; style?: CSSProperties }) {
  const k = clamp01(p);
  if (k <= 0) return null;
  return <div style={{ clipPath: k < 1 ? `inset(-20px ${(1 - k) * 100}% -20px -20px)` : undefined, ...style }}>{children}</div>;
}

// ---------------------------------------------------------------------------
// BlueprintPanel

/**
 * The blueprint paper: dark navy, a faint cyan grid, registration ticks in the
 * corners and a «plan» tag at the top-left. `draw` 0–1 fades it in; children
 * are laid over it (positioned by the caller, panel-local px).
 */
export function BlueprintPanel({
  width,
  height,
  tag = 'plan',
  draw = 1,
  glow = 0,
  dim = 0,
  grid = 32,
  children,
  style,
}: {
  width: number;
  height: number;
  /** Text of the corner tag; false hides it. */
  tag?: string | false;
  draw?: number;
  glow?: number;
  dim?: number;
  /** Minor grid step in px (every 5th line is stronger). */
  grid?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const id = useSvgId('bp');
  const p = clamp01(draw);
  const d = clamp01(dim);
  if (p <= 0) return null;
  const tick = 22;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        opacity: p * (1 - 0.6 * d),
        filter: joinFilters(dropGlow(PLAN_LINE, clamp01(glow)), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
        <defs>
          <pattern id={`${id}-minor`} width={grid} height={grid} patternUnits="userSpaceOnUse">
            <path d={`M ${grid} 0 L 0 0 0 ${grid}`} fill="none" stroke={alpha(PLAN_LINE, 0.07)} strokeWidth={1} />
          </pattern>
          <pattern id={`${id}-major`} width={grid * 5} height={grid * 5} patternUnits="userSpaceOnUse">
            <rect width={grid * 5} height={grid * 5} fill={`url(#${id}-minor)`} />
            <path d={`M ${grid * 5} 0 L 0 0 0 ${grid * 5}`} fill="none" stroke={alpha(PLAN_LINE, 0.13)} strokeWidth={1.2} />
          </pattern>
        </defs>
        <rect x={0} y={0} width={width} height={height} rx={RADIUS.md} fill={PANEL_BG} />
        <rect x={0} y={0} width={width} height={height} rx={RADIUS.md} fill={`url(#${id}-major)`} />
        <rect x={1.5} y={1.5} width={width - 3} height={height - 3} rx={RADIUS.md} fill="none" stroke={alpha(PLAN_LINE, 0.38)} strokeWidth={2} />
        {/* Registration ticks */}
        <g stroke={alpha(PLAN_LINE, 0.7)} strokeWidth={2.5} fill="none" strokeLinecap="square">
          <path d={`M 10 ${10 + tick} L 10 10 L ${10 + tick} 10`} />
          <path d={`M ${width - 10 - tick} 10 L ${width - 10} 10 L ${width - 10} ${10 + tick}`} />
          <path d={`M 10 ${height - 10 - tick} L 10 ${height - 10} L ${10 + tick} ${height - 10}`} />
          <path d={`M ${width - 10 - tick} ${height - 10} L ${width - 10} ${height - 10} L ${width - 10} ${height - 10 - tick}`} />
        </g>
      </svg>
      {tag ? (
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 20,
            fontFamily: FONT.mono,
            fontSize: 26,
            fontWeight: 750,
            lineHeight: 1,
            letterSpacing: 1,
            color: C.cyanSoft,
            padding: '7px 14px',
            borderRadius: RADIUS.sm,
            border: `2px solid ${alpha(PLAN_LINE, 0.65)}`,
            background: alpha(PLAN_LINE, 0.1),
          }}
        >
          {tag}
        </div>
      ) : null}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ZoneBox

export type ZoneBoxLayout = 'stack' | 'header';

/** Height of the label block of a ZoneBox (what `children` must stay below). */
function headerHeight(layout: ZoneBoxLayout, nameSize: number, confSize: number, confLines: number, caption: boolean): number {
  if (layout === 'header') return Math.round(nameSize * 1.1 + 30);
  return Math.round(18 + nameSize * 1.1 + 14 + (caption ? 26 : 0) + confLines * confSize * 1.12 + 12);
}

/**
 * Where `children` go inside a ZoneBox (px from its top-left): below the label
 * block, inset 14 px. Use it to size what you put inside.
 */
export function zoneBoxContent(
  width: number,
  height: number,
  {
    layout = 'header',
    zone,
    confidence,
    nameSize = 44,
    confSize = 32,
    caption = true,
  }: { layout?: ZoneBoxLayout; zone?: ZoneId; confidence?: Confidence | null; nameSize?: number; confSize?: number; caption?: boolean } = {},
): { x: number; y: number; w: number; h: number } {
  const conf = confidence === undefined ? (zone ? ZONES[zone].confidence : null) : confidence;
  const top = headerHeight(layout, nameSize, confSize, conf ? CONFIDENCE[conf].lines.length : 0, caption && layout === 'stack');
  return { x: 14, y: top, w: width - 28, h: Math.max(0, height - top - 14) };
}

export function ZoneBox({
  zone,
  name: nameProp,
  confidence: confProp,
  color: colorProp,
  width,
  height,
  layout = 'stack',
  caption = 'confianza',
  nameSize = 44,
  confSize = 32,
  draw = 1,
  focus = 0,
  dim = 0,
  dashed = false,
  children,
  style,
}: {
  /** One of the six zones (name, confidence and colour come from ZONES). */
  zone?: ZoneId;
  /** Override / custom zone name. */
  name?: ReactNode;
  /** Override / custom confidence; null hides it. */
  confidence?: Confidence | null;
  /** Override the outline colour (default: the confidence colour, or cyan). */
  color?: string;
  width: number;
  height: number;
  /** 'stack': name, caption and confidence centred (s03); 'header': name left, confidence pill right, room for children below. */
  layout?: ZoneBoxLayout;
  /** Small caption over the confidence (stack layout); false hides it. */
  caption?: string | false;
  nameSize?: number;
  confSize?: number;
  /** 0–1: outline draws, the fill and the labels follow. */
  draw?: number;
  /** 0–1: glow, brighter fill (the voice is on it). */
  focus?: number;
  dim?: number;
  /** Dashed outline (e.g. a zone that is only proposed). */
  dashed?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const id = useSvgId('zb');
  const base = zone ? ZONES[zone] : undefined;
  const conf = confProp === undefined ? (base?.confidence ?? null) : confProp;
  const confInfo = conf ? CONFIDENCE[conf] : null;
  const color = colorProp ?? confInfo?.color ?? PLAN_LINE;
  const name = nameProp ?? base?.name ?? '';
  const p = clamp01(draw);
  const f = clamp01(focus);
  const d = clamp01(dim);
  if (p <= 0) return null;
  const outlineP = clamp01(p / 0.6);
  const fillP = clamp01((p - 0.25) / 0.5);
  const nameP = clamp01((p - 0.35) / 0.45);
  const confP = clamp01((p - 0.55) / 0.45);
  const r = 14;
  const showCaption = layout === 'stack' && caption !== false && !!confInfo;
  const content = zoneBoxContent(width, height, { layout, confidence: conf, nameSize, confSize, caption: showCaption });

  const confBlock = confInfo ? (
    <div style={{ opacity: confP }}>
      {showCaption ? (
        <div style={{ fontSize: 24, fontWeight: 650, color: alpha(C.muted, 0.9), lineHeight: 1, marginBottom: 6, letterSpacing: 0.3 }}>{caption}</div>
      ) : null}
      <div
        style={{
          fontSize: confSize,
          fontWeight: 800,
          lineHeight: 1.12,
          color: confInfo.soft,
          ...(layout === 'header'
            ? {
                padding: '4px 14px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(confInfo.color, 0.7)}`,
                background: alpha(confInfo.color, 0.14),
                whiteSpace: 'nowrap',
                fontSize: Math.round(confSize * 0.85),
              }
            : {}),
        }}
      >
        {layout === 'header' ? confInfo.label : confInfo.lines.map((l) => <div key={l}>{l}</div>)}
      </div>
    </div>
  ) : null;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        fontFamily: FONT.sans,
        opacity: 1 - 0.6 * d,
        filter: joinFilters(dropGlow(color, f), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity={0.16 + 0.12 * f} />
            <stop offset="1" stopColor={color} stopOpacity={0.04 + 0.06 * f} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={width} height={height} rx={r} fill={`url(#${id}-fill)`} opacity={fillP} />
        <rect
          x={1.5}
          y={1.5}
          width={width - 3}
          height={height - 3}
          rx={r}
          fill="none"
          stroke={alpha(color, 0.85 + 0.15 * f)}
          strokeWidth={3 + 1.5 * f}
          pathLength={1}
          strokeDasharray={dashed && outlineP >= 1 ? '0.018 0.012' : '1 1'}
          strokeDashoffset={dashed && outlineP >= 1 ? 0 : 1 - outlineP}
        />
        {/* Blueprint corner ticks, just outside the box */}
        <g stroke={alpha(PLAN_LINE, 0.75)} strokeWidth={2} fill="none" opacity={fillP}>
          <path d={`M -8 18 L -8 -8 L 18 -8`} />
          <path d={`M ${width - 18} -8 L ${width + 8} -8 L ${width + 8} 18`} />
          <path d={`M -8 ${height - 18} L -8 ${height + 8} L 18 ${height + 8}`} />
          <path d={`M ${width - 18} ${height + 8} L ${width + 8} ${height + 8} L ${width + 8} ${height - 18}`} />
        </g>
      </svg>
      {layout === 'stack' ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Reveal p={nameP}>
            <div style={{ fontSize: nameSize, fontWeight: 850, lineHeight: 1.1, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>{name}</div>
          </Reveal>
          <div style={{ width: width * 0.62, height: 2, background: alpha(color, 0.45), margin: '12px 0 12px', opacity: confP }} />
          {confBlock}
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 18, right: 14, top: 14, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: 12, rowGap: 6 }}>
          <Reveal p={nameP}>
            <div style={{ fontSize: nameSize, fontWeight: 850, lineHeight: 1.1, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>{name}</div>
          </Reveal>
          {confBlock}
        </div>
      )}
      {children ? (
        <div style={{ position: 'absolute', left: content.x, top: content.y, width: content.w, height: content.h, opacity: fillP }}>{children}</div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ZoneRow

export const ZONE_ROW_BASE = { w: 1728, h: 400 } as const;

const ROW = {
  boxW: 204,
  gap: 82,
  top: 76,
  boxH: 248,
  gateW: 76,
  labelY: 364,
} as const;

/**
 * Layout of a ZoneRow `width` px wide (design 1728 × 400, scaled): every zone
 * box, every gate (between zone i and i + 1: its centre on the road), the
 * laptop's spot inside «interna» and the reach caption's centre, in px from
 * the row's top-left.
 */
export function zoneRowLayout(width: number = ZONE_ROW_BASE.w) {
  const s = width / ZONE_ROW_BASE.w;
  const total = ZONE_ORDER.length * ROW.boxW + (ZONE_ORDER.length - 1) * ROW.gap;
  const x0 = (ZONE_ROW_BASE.w - total) / 2;
  const roadY = ROW.top + ROW.boxH * 0.62;
  const zones = Object.fromEntries(
    ZONE_ORDER.map((z, i) => [z, { x: (x0 + i * (ROW.boxW + ROW.gap)) * s, y: ROW.top * s, w: ROW.boxW * s, h: ROW.boxH * s }]),
  ) as Record<ZoneId, { x: number; y: number; w: number; h: number }>;
  const gates = ZONE_ORDER.slice(0, -1).map((_, i) => ({
    x: (x0 + (i + 1) * ROW.boxW + i * ROW.gap + ROW.gap / 2) * s,
    y: roadY * s,
    w: ROW.gateW * s,
  }));
  const interna = zones.interna;
  return {
    w: width,
    h: ZONE_ROW_BASE.h * s,
    scale: s,
    zones,
    gates,
    /** Road (passage) height between the boxes. */
    roadY: roadY * s,
    laptop: { x: interna.x + interna.w / 2, y: interna.y + interna.h - 46 * s },
    caption: { x: interna.x + interna.w / 2, y: ROW.labelY * s },
  };
}

export function ZoneRow({
  width = ZONE_ROW_BASE.w,
  at,
  stagger = 9,
  zoneAt,
  draw,
  focus = {},
  dim = {},
  autoDim = true,
  gates = true,
  gateFocus = 0,
  laptop = 0,
  reach = 0,
  ruleLink = 0,
  reachCaption,
  panel = true,
  tag = 'plan',
  frame: frameProp,
  style,
}: {
  width?: number;
  /** Frame the row starts drawing (zones left to right, `stagger` frames apart). Omitted with no zoneAt/draw: drawn. */
  at?: number;
  stagger?: number;
  /** Per-zone start frames (override `at` + stagger). */
  zoneAt?: Partial<Record<ZoneId, number>>;
  /** Or drive the whole draw-in yourself, 0–1 (zones fill in order). */
  draw?: number;
  /** 0–1 weight per zone (glow; with autoDim the others step back). */
  focus?: Partial<Record<ZoneId, number>>;
  /** Extra dim per zone, 0–1. */
  dim?: Partial<Record<ZoneId, number>>;
  /** Dim every other zone by the strongest focus (default true). */
  autoDim?: boolean;
  /** Draw the planned checkpoints between zones. */
  gates?: boolean;
  /** 0–1: the checkpoints between zones grow ×1.45 and glow («una garita en cada frontera»). */
  gateFocus?: number;
  /** 0–1: s03's laptop inside «interna» (rose: in the wrong hands). */
  laptop?: number;
  /** 0–1: its reach outline — «interna» only. */
  reach?: number;
  /** 0–1: the dashed link through the DMZ gate — what a rule allows. */
  ruleLink?: number;
  /** 0–1: the caption «alcanza: su zona y lo que una regla permita» under «interna» (default: follows ruleLink). */
  reachCaption?: number;
  /** Draw the blueprint panel behind (false: zones on the caller's own panel). */
  panel?: boolean;
  tag?: string | false;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const L = zoneRowLayout(width);
  const s = L.scale;
  const n = ZONE_ORDER.length;

  const zoneDraw = (z: ZoneId, i: number): number => {
    if (draw !== undefined) return clamp01(draw * n - i * 0.8);
    const f = zoneAt?.[z] ?? (at === undefined ? undefined : at + i * stagger);
    return f === undefined ? 1 : progress(frame, f, 24, EASE.inOut);
  };
  const draws = ZONE_ORDER.map(zoneDraw);
  const panelP =
    draw !== undefined ? clamp01(draw * 4) : at === undefined && !zoneAt ? 1 : progress(frame, Math.min(...ZONE_ORDER.map((z, i) => zoneAt?.[z] ?? (at ?? 0) + i * stagger)) - 8, 16);
  const maxFocus = Math.max(0, ...ZONE_ORDER.map((z) => clamp01(focus[z] ?? 0)));
  const dimOf = (z: ZoneId) => Math.max(clamp01(dim[z] ?? 0), autoDim ? maxFocus * (1 - clamp01(focus[z] ?? 0)) : 0);

  const lp = clamp01(laptop);
  const rp = clamp01(reach);
  const kp = clamp01(ruleLink);
  const cp = clamp01(reachCaption ?? ruleLink);

  // Gate geometry: blueprint checkpoints without fence stubs, their ground line on the road.
  const gw = ROW.gateW * s;
  const gSize = checkpointSize(gw, { fence: false });
  const gBase = 240; // fence ground line, design units of the checkpoint
  const gGround = ((gBase - 22) / 258) * gSize.h;

  // The dashed link: from the laptop, left along the road, through the DMZ gate, into the DMZ.
  const dmz = L.zones.dmz;
  const interna = L.zones.interna;
  const g1 = L.gates[1]; // between DMZ and interna
  const linkPts = [
    { x: L.laptop.x - 30 * s, y: L.laptop.y },
    { x: interna.x + 22 * s, y: L.laptop.y },
    { x: interna.x + 22 * s, y: L.roadY },
    { x: g1.x, y: L.roadY },
    { x: dmz.x + dmz.w - 40 * s, y: L.roadY },
  ];
  const linkD = linkPts.map((pt, i) => `${i ? 'L' : 'M'} ${pt.x} ${pt.y}`).join(' ');

  const content = (
    <div style={{ position: 'absolute', left: 0, top: 0, width: L.w, height: L.h }}>
      {/* Roads between neighbouring zones */}
      <svg width={L.w} height={L.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {gates
          ? L.gates.map((_g, i) => {
              const a = L.zones[ZONE_ORDER[i]];
              const b = L.zones[ZONE_ORDER[i + 1]];
              const p = Math.min(draws[i], draws[i + 1]);
              if (p <= 0) return null;
              return (
                <line
                  key={i}
                  x1={a.x + a.w}
                  y1={L.roadY}
                  x2={b.x}
                  y2={L.roadY}
                  stroke={alpha(C.cyan, 0.55)}
                  strokeWidth={Math.max(2, 3 * s)}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - p}
                  opacity={Math.max(1 - dimOf(ZONE_ORDER[i]) * 0.5, 1 - dimOf(ZONE_ORDER[i + 1]) * 0.5)}
                />
              );
            })
          : null}
      </svg>
      {/* Zones */}
      {ZONE_ORDER.map((z, i) => {
        const b = L.zones[z];
        return (
          <div key={z} style={{ position: 'absolute', left: b.x, top: b.y }}>
            <ZoneBox
              zone={z}
              width={b.w}
              height={b.h}
              draw={draws[i]}
              focus={clamp01(focus[z] ?? 0)}
              dim={dimOf(z)}
              nameSize={Math.round(44 * Math.max(0.86, Math.min(1, s)))}
              confSize={32}
            />
          </div>
        );
      })}
      {/* Planned checkpoints */}
      {gates
        ? L.gates.map((g, i) => {
            const p = Math.min(draws[i], draws[i + 1]);
            if (p <= 0.01) return null;
            const k = clamp01((p - 0.6) / 0.4);
            const gf = clamp01(gateFocus);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  // Centred in the gap (the hut sits left of the road, so centring the road would push it into the box).
                  left: g.x - gw / 2,
                  top: L.roadY - gGround,
                  opacity: k,
                  transform: gf > 0.001 ? `scale(${1 + 0.45 * gf})` : undefined,
                  transformOrigin: `${gw / 2}px ${gGround}px`,
                }}
              >
                <Checkpoint width={gw} look="plan" fence={false} state="powered" detail="icon" glow={gf} />
              </div>
            );
          })
        : null}
      {/* s03: the laptop's reach */}
      {rp > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: interna.x - 10 * s,
            top: interna.y - 10 * s,
            width: interna.w + 20 * s,
            height: interna.h + 20 * s,
            borderRadius: 20 * s,
            border: `${Math.max(3, 4 * s)}px solid ${alpha(C.rose, 0.9)}`,
            background: alpha(C.rose, 0.1),
            boxShadow: `0 0 ${Math.round(26 * s)}px ${alpha(C.rose, 0.45)}`,
            opacity: rp,
            transform: `scale(${1.06 - 0.06 * rp})`,
          }}
        />
      ) : null}
      {kp > 0.01 ? (
        <svg width={L.w} height={L.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path
            d={linkD}
            fill="none"
            stroke={C.roseSoft}
            strokeWidth={Math.max(3, 4 * s)}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${12 * s} ${10 * s}`}
            style={{ clipPath: `inset(0 0 0 ${(1 - kp) * 100}%)` }}
          />
          {kp > 0.95 ? <circle cx={linkPts[4].x} cy={linkPts[4].y} r={Math.max(6, 8 * s)} fill={C.roseSoft} /> : null}
        </svg>
      ) : null}
      {lp > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: L.laptop.x - 34 * s,
            top: L.laptop.y - 34 * s,
            width: 68 * s,
            height: 68 * s,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 14 * s,
            background: alpha(C.roseDeep, 0.9),
            border: `${Math.max(2, 3 * s)}px solid ${C.rose}`,
            boxShadow: `0 0 ${Math.round(18 * s)}px ${alpha(C.rose, 0.55)}`,
            opacity: lp,
            transform: `scale(${0.8 + 0.2 * lp})`,
          }}
        >
          <Icon name="laptop" size={Math.round(46 * s)} color={C.roseSoft} strokeWidth={2.2} />
        </div>
      ) : null}
      {cp > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: L.caption.x,
            top: L.caption.y,
            transform: `translate(-50%, -50%) translateY(${(1 - cp) * 10}px)`,
            opacity: cp,
            whiteSpace: 'nowrap',
            fontFamily: FONT.sans,
            fontSize: Math.round(34 * Math.max(0.94, s)),
            fontWeight: 700,
            color: C.text,
          }}
        >
          {REACH_TEXT.lead}
          <span style={{ color: C.roseSoft, fontWeight: 850 }}>{REACH_TEXT.own}</span>
          {REACH_TEXT.and}
          <span style={{ color: C.roseSoft, fontWeight: 850, borderBottom: `3px dashed ${alpha(C.roseSoft, 0.85)}`, paddingBottom: 2 }}>{REACH_TEXT.rule}</span>
        </div>
      ) : null}
    </div>
  );

  return (
    <div style={{ position: 'relative', width: L.w, height: L.h, ...style }}>
      {panel ? (
        <BlueprintPanel width={L.w} height={L.h} tag={tag} draw={panelP}>
          {content}
        </BlueprintPanel>
      ) : (
        content
      )}
    </div>
  );
}
