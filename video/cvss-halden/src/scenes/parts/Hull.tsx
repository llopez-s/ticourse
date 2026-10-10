import { useId, type CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, dimStyle } from '../../../../engine/src/ui';

/**
 * THE image of V18: a cargo ship with a hole in her hull. One drawing, used everywhere (s02 two ships, s04 the same
 * hull with bulkheads and pumps, s05 the patched hull with the painted sign and the dry bilge, s06 three miniatures,
 * the poster), so the viewer meets the same ship each time. The hole is the CVSS score (its size, in the abstract);
 * the sea is the context.
 *
 * Design 1000 × 520 (full) — see `hullSize`. Everything animates through 0–1 weights the scene computes; the waves,
 * rain and rocking read the Sequence frame (deterministic). Nothing positions itself: wrap in an absolute div.
 *
 * Layers, back to front: dock (walls, ground, keel blocks, shores) · storm clouds + rain · back sea · hull (rocks in
 * a storm) · front sea (translucent, over the lower hull) · inside of the hull (cutaway: bulkheads, pump, bilge) ·
 * the hole (or its weld patch) · the painted sign.
 */

const WL = 372; // waterline
const HOLE = { x: 640, y: 350, r: 44 } as const;
const HULL_PATH = 'M 70 292 L 935 292 L 992 258 L 936 408 Q 926 430 902 430 L 172 430 Q 140 430 126 404 Z';
const INNER_PATH = 'M 100 306 L 925 306 L 958 290 L 916 404 Q 910 416 894 416 L 176 416 Q 160 416 152 400 Z';
const BULK = { l: 516, r: 748 } as const;
const PUMP = { x: 596, y: 380, w: 48, h: 32 } as const;
const BILGE = { x: 190, y: 394, w: 690, h: 20 } as const;
const SIGN = { x: 776, y: 316, w: 156, h: 46 } as const;

export type HullCrop = 'full' | 'lower';
const CROPS: Record<HullCrop, { x: number; y: number; w: number; h: number }> = {
  full: { x: 0, y: 0, w: 1000, h: 520 },
  lower: { x: 40, y: 270, w: 960, h: 250 },
};

/** Px size of the drawing at `width`: `k` is px per design unit. */
export function hullSize(width: number, crop: HullCrop = 'full'): { w: number; h: number; k: number } {
  const c = CROPS[crop];
  const k = width / c.w;
  return { w: width, h: Math.round(c.h * k), k };
}

export type HullAnchor = 'hole' | 'label' | 'bulkheadL' | 'bulkheadR' | 'pump' | 'bilge' | 'sign' | 'waterline' | 'keel' | 'bow' | 'stern' | 'deck';

const ANCHORS: Record<HullAnchor, { x: number; y: number }> = {
  hole: { x: HOLE.x, y: HOLE.y },
  label: { x: HOLE.x, y: 486 },
  bulkheadL: { x: BULK.l, y: 360 },
  bulkheadR: { x: BULK.r, y: 360 },
  pump: { x: PUMP.x + PUMP.w / 2, y: PUMP.y + PUMP.h / 2 },
  bilge: { x: BILGE.x + BILGE.w / 2, y: BILGE.y + BILGE.h / 2 },
  sign: { x: SIGN.x + SIGN.w / 2, y: SIGN.y + SIGN.h / 2 },
  waterline: { x: 500, y: WL },
  keel: { x: 500, y: 430 },
  bow: { x: 985, y: 300 },
  stern: { x: 80, y: 330 },
  deck: { x: 500, y: 292 },
};

/** Where a feature of the ship is, in px from the top-left of the drawing at `width`. */
export function hullPoint(width: number, which: HullAnchor, crop: HullCrop = 'full'): { x: number; y: number } {
  const c = CROPS[crop];
  const k = width / c.w;
  const a = ANCHORS[which];
  return { x: (a.x - c.x) * k, y: (a.y - c.y) * k };
}

/** The hole's rim: a ragged ring, the same everywhere. */
function holePath(cx: number, cy: number, r: number): string {
  const n = 12;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.2;
    const rr = i % 2 === 0 ? r * (1 + 0.1 * ((i * 7) % 3)) : r * (0.7 + 0.04 * ((i * 5) % 3));
    d += `${i === 0 ? 'M' : 'L'} ${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr * 0.92).toFixed(1)} `;
  }
  return d + 'Z';
}
const HOLE_PATH = holePath(HOLE.x, HOLE.y, HOLE.r);
const HOLE_RIM = holePath(HOLE.x, HOLE.y, HOLE.r + 9);

function wavePath(y0: number, amp: number, wl: number, phase: number, bottom = 560): string {
  let d = `M -20 ${bottom} L -20 ${(y0 + amp * Math.sin(phase)).toFixed(1)}`;
  for (let x = -20; x <= 1020; x += 20) d += ` L ${x} ${(y0 + amp * Math.sin((x / wl) * Math.PI * 2 + phase)).toFixed(1)}`;
  return d + ` L 1020 ${bottom} Z`;
}
function crestPath(y0: number, amp: number, wl: number, phase: number): string {
  let d = '';
  for (let x = -20; x <= 1020; x += 20) d += `${x === -20 ? 'M' : 'L'} ${x} ${(y0 + amp * Math.sin((x / wl) * Math.PI * 2 + phase)).toFixed(1)} `;
  return d;
}

const CONTAINER_COLORS = ['#0e7490', '#b45309', '#0f766e', '#9f1239', '#1d4ed8', '#4d7c0f'] as const;
const CONTAINERS: { x: number; y: number; c: string }[] = (() => {
  const out: { x: number; y: number; c: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const x = 372 + i * 52;
    if (x + 46 > 590 && x < 700) continue; // the gap for the pump's pipe
    out.push({ x, y: 258, c: CONTAINER_COLORS[(i * 5) % CONTAINER_COLORS.length] });
    if (i % 3 !== 1) out.push({ x, y: 224, c: CONTAINER_COLORS[(i * 5 + 2) % CONTAINER_COLORS.length] });
  }
  return out;
})();

export interface HullProps {
  /** Px width of the drawing. */
  width: number;
  crop?: HullCrop;
  /** 0–1: open water around the ship. */
  sea?: number;
  /** 0–1: a storm on that water (waves, clouds, rain, the ship rocks). */
  storm?: number;
  /** 0–1: dry dock (basin walls, ground, keel blocks, shores). Drain the sea first. */
  dock?: number;
  /** 0–1: the hole draws in. Default 1. */
  hole?: number;
  /** Text on the pill under the hull, tied to the hole by a leader (the CVSS score). */
  holeLabel?: string | null;
  /** Font size of that pill (px). Default 46. */
  labelSize?: number;
  /** 0–1: a welded steel plate over the hole (the fix). */
  patch?: number;
  /** 0–1: the hull opens to show its inside (forced on by the weights below). */
  cutaway?: number;
  /** 0–1: the two bulkheads (mamparos) around the hole; the water stays between them. */
  bulkheads?: number;
  /** 0–1: the bilge pump with its pipe and the water it throws. */
  pumps?: number;
  /** 0–1: the bilge (sentina) highlighted. */
  bilge?: number;
  /** 0–1: water level in the bilge (0 = dry). */
  bilgeWater?: number;
  /** 0–1: the green check on a dry bilge. */
  bilgeOk?: number;
  /** Text painted on a board at the bow (the sign). */
  sign?: string | null;
  signShow?: number;
  glow?: number;
  dim?: number;
  show?: number;
  frame?: number;
  style?: CSSProperties;
}

export function Hull({
  width,
  crop = 'full',
  sea = 0,
  storm = 0,
  dock = 0,
  hole = 1,
  holeLabel = null,
  labelSize = 46,
  patch = 0,
  cutaway = 0,
  bulkheads = 0,
  pumps = 0,
  bilge = 0,
  bilgeWater = 0,
  bilgeOk = 0,
  sign = null,
  signShow = 1,
  glow = 0,
  dim = 0,
  show = 1,
  frame: frameProp,
  style,
}: HullProps) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const { w, h } = hullSize(width, crop);
  const c = CROPS[crop];
  const seaW = clamp01(sea);
  const stormW = clamp01(storm) * seaW;
  const dockW = clamp01(dock);
  const holeW = clamp01(hole);
  const patchW = clamp01(patch);
  const open = Math.max(clamp01(cutaway), clamp01(bulkheads), clamp01(pumps), clamp01(bilge), clamp01(bilgeOk), clamp01(bilgeWater));

  const phase = frame * (0.045 + 0.06 * stormW);
  const rock = Math.sin(frame * 0.055) * 2.2 * stormW + Math.sin(frame * 0.021) * 0.5 * seaW;
  const bob = Math.sin(frame * 0.04) * (2 + 5 * stormW) * seaW;
  const hullTransform = `translate(0 ${bob.toFixed(2)}) rotate(${rock.toFixed(2)} 500 400)`;
  const amp = 5 + 15 * stormW;
  const wl = 170 - 40 * stormW;

  const holeScale = 0.15 + 0.85 * holeW;
  const holePivot = `translate(${HOLE.x} ${HOLE.y}) scale(${holeScale}) translate(${-HOLE.x} ${-HOLE.y})`;
  const labelPx = hullPoint(width, 'label', crop);
  const labelOn = holeLabel && holeW > 0.5 ? clamp01((holeW - 0.5) * 2) : 0;

  const bulkH = 106 * clamp01(bulkheads);
  const rain = Array.from({ length: 26 }, (_, i) => {
    const y = ((i * 83 + frame * 16) % 340) + 10;
    const x = (i * 137 + y * 0.35) % 1000;
    return { x, y };
  });

  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        opacity: show,
        filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(8 + 22 * glow)}px ${alpha(C.rose, 0.5 * glow)})` : undefined,
        ...dimStyle(dim, show),
        ...style,
      }}
    >
      <svg width={w} height={h} viewBox={`${c.x} ${c.y} ${c.w} ${c.h}`} style={{ display: 'block', overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
        <defs>
          <linearGradient id={`${uid}-hull`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c4366" />
            <stop offset="1" stopColor="#16233b" />
          </linearGradient>
          <linearGradient id={`${uid}-sea`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={alpha(C.sky, 0.55)} />
            <stop offset="1" stopColor={alpha('#0b2a44', 0.92)} />
          </linearGradient>
          <linearGradient id={`${uid}-seaf`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={alpha(C.sky, 0.42)} />
            <stop offset="1" stopColor={alpha('#0b2a44', 0.6)} />
          </linearGradient>
          <linearGradient id={`${uid}-fx`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.08" stopColor="#fff" />
            <stop offset="0.92" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <linearGradient id={`${uid}-fy`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.8" stopColor="#fff" />
            <stop offset="0.93" stopColor="#000" />
          </linearGradient>
          <mask id={`${uid}-mx`} maskUnits="userSpaceOnUse" x={-20} y={0} width={1040} height={560}>
            <rect x={-20} y={0} width={1040} height={560} fill={`url(#${uid}-fx)`} />
          </mask>
          <mask id={`${uid}-my`} maskUnits="userSpaceOnUse" x={-20} y={0} width={1040} height={560}>
            <rect x={-20} y={0} width={1040} height={560} fill={`url(#${uid}-fy)`} />
          </mask>
          <clipPath id={`${uid}-clip`}>
            <path d={HULL_PATH} />
          </clipPath>
          <clipPath id={`${uid}-inner`}>
            <path d={INNER_PATH} />
          </clipPath>
        </defs>

        {/* ---- dry dock ---- */}
        {dockW > 0.01 ? (
          <g opacity={dockW}>
            <path d="M -20 300 L 38 300 L 38 540 L -20 540 Z" fill="#17233a" stroke="#475569" strokeWidth={3} />
            <path d="M 984 340 L 1020 340 L 1020 540 L 984 540 Z" fill="#17233a" stroke="#475569" strokeWidth={3} />
            <rect x={-20} y={452} width={1040} height={90} fill="#1b2a44" stroke="#475569" strokeWidth={3} />
            {Array.from({ length: 15 }, (_, i) => (
              <path key={i} d={`M ${i * 72 - 10} 540 L ${i * 72 + 44} 458`} stroke="#334155" strokeWidth={2} />
            ))}
            {[250, 500, 760].map((x) => (
              <rect key={x} x={x - 34} y={430} width={68} height={24} rx={3} fill="#5b4a2f" stroke="#a16207" strokeWidth={3} />
            ))}
            <path d="M 70 452 L 126 340" stroke="#94a3b8" strokeWidth={7} />
            <path d="M 905 452 L 868 340" stroke="#94a3b8" strokeWidth={7} />
          </g>
        ) : null}

        {/* ---- storm: clouds and rain ---- */}
        {stormW > 0.01 ? (
          <g opacity={stormW}>
            <g fill="#1e293b" opacity={0.95}>
              {[
                [250, 84, 56],
                [330, 62, 70],
                [420, 86, 56],
                [560, 70, 68],
                [650, 56, 60],
                [740, 88, 54],
                [830, 66, 58],
              ].map(([x, y, r]) => (
                <circle key={x} cx={x} cy={y} r={r} />
              ))}
              <rect x={220} y={86} width={650} height={40} rx={20} />
            </g>
            {rain.map((p, i) => (
              <path key={i} d={`M ${p.x.toFixed(0)} ${p.y.toFixed(0)} l -8 24`} stroke={alpha(C.sky, 0.55)} strokeWidth={3} />
            ))}
          </g>
        ) : null}

        {/* ---- back sea ---- */}
        {seaW > 0.01 ? (
          <g opacity={seaW} mask={`url(#${uid}-mx)`}>
            <g mask={`url(#${uid}-my)`}>
            <path d={wavePath(WL + 8, amp * 0.8, wl * 1.3, phase * 0.8 + 1.7)} fill={`url(#${uid}-sea)`} />
            <path d={crestPath(WL + 8, amp * 0.8, wl * 1.3, phase * 0.8 + 1.7)} fill="none" stroke={alpha('#ffffff', 0.35)} strokeWidth={3} />
            </g>
          </g>
        ) : null}

        {/* ---- the hull (rocks in a storm) ---- */}
        <g transform={hullTransform}>
          {/* deck cargo and bridge */}
          {CONTAINERS.map((ct, i) => (
            <g key={i}>
              <rect x={ct.x} y={ct.y} width={46} height={34} fill={alpha(ct.c, 0.9)} stroke={alpha('#ffffff', 0.25)} strokeWidth={2} />
              <path d={`M ${ct.x + 12} ${ct.y + 5} V ${ct.y + 29} M ${ct.x + 23} ${ct.y + 5} V ${ct.y + 29} M ${ct.x + 34} ${ct.y + 5} V ${ct.y + 29}`} stroke={alpha('#000000', 0.25)} strokeWidth={2} />
            </g>
          ))}
          <rect x={150} y={212} width={170} height={80} rx={6} fill="#cbd5e1" stroke="#64748b" strokeWidth={3} />
          <rect x={138} y={198} width={194} height={16} rx={4} fill="#94a3b8" stroke="#64748b" strokeWidth={3} />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={164 + i * 25} y={228} width={17} height={14} rx={2} fill={C.amber} opacity={0.85} />
          ))}
          <rect x={236} y={152} width={48} height={48} fill={C.rose} stroke="#64748b" strokeWidth={3} />
          <rect x={236} y={166} width={48} height={10} fill="#e2e8f0" />
          <path d="M 190 198 V 150" stroke="#94a3b8" strokeWidth={4} />
          <circle cx={190} cy={148} r={5} fill={C.rose} />

          {/* the hull itself */}
          <path d={HULL_PATH} fill={`url(#${uid}-hull)`} stroke="#6f8fbf" strokeWidth={4} />
          <g clipPath={`url(#${uid}-clip)`}>
            <rect x={60} y={WL + 10} width={950} height={70} fill={alpha(C.roseDeep, 0.85)} />
            <path d="M 60 300 H 1000" stroke={alpha('#ffffff', 0.18)} strokeWidth={3} />
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx={150 + i * 90} cy={322} r={4} fill={alpha('#ffffff', 0.18)} />
            ))}
          </g>
        </g>

        {/* ---- front sea: over the lower hull ---- */}
        {seaW > 0.01 ? (
          <g opacity={seaW} mask={`url(#${uid}-mx)`}>
            <g mask={`url(#${uid}-my)`}>
            <path d={wavePath(WL + 2, amp, wl, phase)} fill={`url(#${uid}-seaf)`} />
            <path d={crestPath(WL + 2, amp, wl, phase)} fill="none" stroke={alpha('#ffffff', 0.55)} strokeWidth={4} />
            </g>
          </g>
        ) : null}

        {/* ---- inside of the hull ---- */}
        <g transform={hullTransform}>
          {open > 0.01 ? (
            <g opacity={open}>
              <path d={INNER_PATH} fill={alpha(C.ink950, 0.9)} stroke="#4b6a99" strokeWidth={3} />
              <g clipPath={`url(#${uid}-inner)`}>
                {Array.from({ length: 12 }, (_, i) => (
                  <path key={i} d={`M ${170 + i * 66} 306 V 416`} stroke={alpha('#4b6a99', 0.45)} strokeWidth={3} />
                ))}
                <path d="M 90 322 H 960" stroke={alpha('#4b6a99', 0.55)} strokeWidth={3} />
              </g>
            </g>
          ) : null}

          {/* bilge (sentina) */}
          {open > 0.01 ? (
            <g opacity={open}>
              <rect
                x={BILGE.x}
                y={BILGE.y}
                width={BILGE.w}
                height={BILGE.h}
                rx={5}
                fill={alpha(C.cyan, 0.05 + 0.1 * clamp01(bilge))}
                stroke={alpha(C.cyan, 0.3 + 0.7 * clamp01(bilge))}
                strokeWidth={3 + 2 * clamp01(bilge)}
              />
              {bilgeWater > 0.01 ? (
                <rect x={BILGE.x + 3} y={BILGE.y + BILGE.h - 3 - (BILGE.h - 6) * clamp01(bilgeWater)} width={BILGE.w - 6} height={(BILGE.h - 6) * clamp01(bilgeWater)} fill={alpha(C.sky, 0.7)} />
              ) : null}
            </g>
          ) : null}

          {/* bulkheads (mamparos) and the flooded compartment between them */}
          {bulkheads > 0.01 ? (
            <g>
              <rect x={BULK.l + 14} y={340} width={BULK.r - BULK.l - 14} height={74} fill={alpha(C.sky, 0.3 * bulkheads)} />
              {[BULK.l, BULK.r].map((x) => (
                <g key={x}>
                  <rect x={x} y={308} width={14} height={bulkH} rx={3} fill={alpha(C.emerald, 0.92)} stroke="#a7f3d0" strokeWidth={3} />
                  {[326, 354, 382].map((yy) => (
                    <circle key={yy} cx={x + 7} cy={yy} r={2.6} fill={alpha('#064e3b', 0.9)} opacity={bulkheads} />
                  ))}
                </g>
              ))}
            </g>
          ) : null}

          {/* bilge pump with its pipe */}
          {pumps > 0.01 ? (
            <g opacity={clamp01(pumps)}>
              <path d={`M ${PUMP.x + PUMP.w / 2} ${PUMP.y} V 262 Q ${PUMP.x + PUMP.w / 2} 242 ${PUMP.x + PUMP.w / 2 + 22} 242`} fill="none" stroke={C.amber} strokeWidth={9} />
              <path d={`M ${PUMP.x + PUMP.w / 2} ${PUMP.y} V 262 Q ${PUMP.x + PUMP.w / 2} 242 ${PUMP.x + PUMP.w / 2 + 22} 242`} fill="none" stroke="#78350f" strokeWidth={3} />
              {[0, 1, 2, 3].map((i) => {
                const t = ((frame * 0.05 + i * 0.25) % 1);
                const x0 = PUMP.x + PUMP.w / 2 + 28;
                return <circle key={i} cx={x0 + t * 70} cy={240 + 90 * t * t - 40 * t} r={5.5 - 2 * t} fill={alpha(C.sky, 0.9 * (1 - t))} />;
              })}
              <rect x={PUMP.x} y={PUMP.y} width={PUMP.w} height={PUMP.h} rx={7} fill="#78350f" stroke={C.amber} strokeWidth={4} />
              <circle cx={PUMP.x + PUMP.w / 2} cy={PUMP.y + PUMP.h / 2} r={9} fill="none" stroke={C.amber} strokeWidth={3} />
            </g>
          ) : null}

          {/* the dry bilge's check */}
          {bilgeOk > 0.01 ? (
            <g opacity={clamp01(bilgeOk)} transform={`translate(0 ${-6 * (1 - clamp01(bilgeOk))})`}>
              <circle cx={430} cy={366} r={30} fill={alpha(C.emeraldDeep, 0.95)} stroke={C.emerald} strokeWidth={5} />
              <path d="M 414 366 L 427 380 L 448 352" fill="none" stroke={C.emerald} strokeWidth={7} />
            </g>
          ) : null}

          {/* the hole, or the weld that closes it */}
          <g transform={holePivot} opacity={holeW * (1 - 0.92 * patchW)}>
            <path d={HOLE_RIM} fill={alpha(C.rose, 0.28)} stroke={alpha(C.rose, 0.9)} strokeWidth={4} />
            <path d={HOLE_PATH} fill="#03060c" stroke={C.rose} strokeWidth={4} />
          </g>
          {patchW > 0.01 ? (
            <g opacity={patchW} transform={`translate(${HOLE.x} ${HOLE.y}) scale(${0.7 + 0.3 * patchW}) translate(${-HOLE.x} ${-HOLE.y})`}>
              <circle cx={HOLE.x} cy={HOLE.y} r={HOLE.r + 16} fill="#64748b" stroke="#cbd5e1" strokeWidth={4} />
              <circle cx={HOLE.x} cy={HOLE.y} r={HOLE.r + 16} fill="none" stroke={C.emerald} strokeWidth={4} strokeDasharray="4 9" />
              <path d="M 622 352 L 636 366 L 660 334" fill="none" stroke={alpha('#e2e8f0', 0.9)} strokeWidth={6} />
            </g>
          ) : null}

          {/* the painted sign on the bow */}
          {sign ? (
            <g opacity={clamp01(signShow)}>
              <rect x={SIGN.x} y={SIGN.y} width={SIGN.w} height={SIGN.h} rx={5} fill="#f1f5f9" stroke="#64748b" strokeWidth={3} />
              <text x={SIGN.x + SIGN.w / 2} y={SIGN.y + SIGN.h / 2 + 8} textAnchor="middle" fontFamily={FONT.mono} fontSize={24} fontWeight={800} fill="#0f172a">
                {sign}
              </text>
            </g>
          ) : null}
        </g>

        {/* leader from the hole to the label */}
        {holeLabel && labelOn > 0.01 ? (
          <path d={`M ${HOLE.x} ${HOLE.y + HOLE.r + 14} V 462`} stroke={alpha(C.rose, 0.8 * labelOn)} strokeWidth={4} strokeDasharray="2 9" />
        ) : null}
      </svg>

      {holeLabel && labelOn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: labelPx.x,
            top: labelPx.y,
            transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * labelOn})`,
            opacity: labelOn,
            padding: `2px ${Math.round(labelSize * 0.4)}px`,
            borderRadius: RADIUS.md,
            border: `3px solid ${C.rose}`,
            background: alpha(C.roseDeep, 0.95),
            boxShadow: `0 0 ${Math.round(18 * labelOn)}px ${alpha(C.rose, 0.45)}`,
            fontFamily: FONT.mono,
            fontSize: labelSize,
            fontWeight: 850,
            lineHeight: 1.15,
            color: '#fecdd3',
            whiteSpace: 'nowrap',
          }}
        >
          {holeLabel}
        </div>
      ) : null}
    </div>
  );
}
