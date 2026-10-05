import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, cubicPoint, curveBetween, mix, type Point } from '../../../../../engine/src/ui';
import { FLOW } from '../../../data/s05-amp';

export const STREET_W = 1728;
export const STREET_H = 270;

/** Restaurants (the open resolvers): two columns of three storefronts. */
const SHOP = { w: 92, h: 64 } as const;
const SHOPS: Point[] = [16, 124].flatMap((x) => [18, 106, 194].map((y) => ({ x, y })));
/** Far, faint storefronts: «hundreds» of them. */
const FAR: Point[] = [0, 1, 2, 3].map((k) => ({ x: 232, y: 26 + k * 62 }));
const AVENUE = { x: 276, y: 54, w: 884, h: 176 } as const;
const STREET = { x: AVENUE.x + AVENUE.w, y: 90, w: 334, h: 104 } as const;
const PORTAL = { x: STREET.x + STREET.w, y: 8, w: 200, h: 218 } as const;
/** Queue lanes inside the street. */
const LANES = [112, 142, 172];
const SLOT_W = 40;
const QUEUE_FRONT = PORTAL.x - 26;
/** The provider's cut: a gate across the avenue, before your street. */
export const GATE_X = AVENUE.x + 250;

const N_WAVE = 51;
const N_TRICKLE = 40;

/** Deterministic 0–1 hash. */
function rnd(i: number, salt: number): number {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/** One storefront: awning, window, door. */
export function Storefront({ x, y, w = SHOP.w, h = SHOP.h, tone = C.sky, glow = 0, opacity = 1 }: { x: number; y: number; w?: number; h?: number; tone?: string; glow?: number; opacity?: number }) {
  const aw = h * 0.28;
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      {glow > 0 ? <rect x={-6} y={-6} width={w + 12} height={h + 12} rx={12} fill={alpha(tone, 0.18 * glow)} /> : null}
      <rect x={0} y={aw * 0.6} width={w} height={h - aw * 0.6} rx={6} fill={alpha(tone, 0.08)} stroke={alpha(tone, 0.7)} strokeWidth={2.5} />
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M${(k * w) / 4} 0 h${w / 4} v${aw} q${-w / 8} 8 ${-w / 4} 0 Z`} fill={alpha(tone, k % 2 ? 0.25 : 0.55)} stroke={alpha(tone, 0.8)} strokeWidth={1.5} />
      ))}
      <rect x={w * 0.1} y={aw + 8} width={w * 0.42} height={h - aw - 16} rx={3} fill={alpha(tone, 0.16)} stroke={alpha(tone, 0.5)} strokeWidth={1.5} />
      <rect x={w * 0.62} y={aw + 8} width={w * 0.26} height={h - aw - 8} rx={3} fill={alpha(tone, 0.3)} />
    </g>
  );
}

/** A delivery rider with an order box; `box` scales the box (the order is enormous). */
function Rider({ x, y, box, opacity = 1 }: { x: number; y: number; box: number; opacity?: number }) {
  const bw = 20 * box;
  const bh = 16 * box;
  return (
    <g transform={`translate(${x} ${y}) scale(1.22)`} opacity={opacity}>
      <circle cx={-9} cy={9} r={5} fill="none" stroke={C.roseSoft} strokeWidth={2.5} />
      <circle cx={10} cy={9} r={5} fill="none" stroke={C.roseSoft} strokeWidth={2.5} />
      <path d="M-9 9 L-2 2 L10 2 L10 9" fill="none" stroke={C.rose} strokeWidth={3} strokeLinejoin="round" />
      <rect x={-6 - bw / 2} y={1 - bh} width={bw} height={bh} rx={3} fill={alpha(C.rose, 0.85)} stroke={'#fecdd3'} strokeWidth={1.2} />
    </g>
  );
}

type RiderState = { x: number; y: number; o: number };

/** Where rider `i` of the wave is at `frame`: from a restaurant door to its slot in the queue. */
function waveRider(i: number, frame: number, from: number, spread: number): RiderState | null {
  const depart = from + (i * spread) / N_WAVE + rnd(i, 1) * 6;
  if (frame < depart) return null;
  const shop = SHOPS[i % SHOPS.length];
  const start: Point = { x: shop.x + SHOP.w * 0.75, y: shop.y + SHOP.h - 6 };
  const col = Math.floor(i / LANES.length);
  const lane = LANES[i % LANES.length];
  const end: Point = { x: QUEUE_FRONT - col * SLOT_W, y: lane };
  const travel = 46 + rnd(i, 2) * 22;
  const t = progress(frame, depart, travel, EASE.inOut);
  const p = cubicPoint(curveBetween(start, end, 0.55), t);
  return { x: p.x, y: p.y, o: Math.min(1, (frame - depart) / 6) };
}

/** Trickle riders: keep coming to the tail of the jam and merge into it (they stop spawning at `stopAt`). */
function trickleRider(i: number, frame: number, from: number, stopAt: number): RiderState | null {
  const depart = from + i * 9 + rnd(i, 3) * 5;
  if (frame < depart || depart > stopAt) return null;
  const shop = SHOPS[(i * 5) % SHOPS.length];
  const start: Point = { x: shop.x + SHOP.w * 0.75, y: shop.y + SHOP.h - 6 };
  const tailX = QUEUE_FRONT - Math.ceil(N_WAVE / LANES.length) * SLOT_W + 6;
  const end: Point = { x: tailX, y: LANES[i % LANES.length] };
  const travel = 50 + rnd(i, 4) * 16;
  const t = progress(frame, depart, travel, EASE.inOut);
  if (t >= 1) return null;
  const p = cubicPoint(curveBetween(start, end, 0.55), t);
  return { x: p.x, y: p.y, o: Math.min(1, (frame - depart) / 6, (1 - t) * 8) };
}

/**
 * The street of s05: restaurants on the left (third-party open resolvers; faint ones behind for
 * «hundreds»), the provider's avenue, your narrow street and the portal (`hpa-portal-web-01`, cyan).
 * Riders leave every restaurant at `wave` and jam the street before the portal's door; more keep coming
 * until `stopAt`. `box` (0–1) makes the orders enormous; `jam` lights the jam; `third` lights the
 * restaurants; `gate` (0–1) draws the provider's cut across the avenue. Frames are Sequence-relative.
 */
export function Street({
  frame,
  scene,
  shops,
  wave,
  stopAt,
  box,
  jam,
  third,
  gate,
}: {
  frame: number;
  scene: number;
  shops: number;
  wave: number;
  stopAt: number;
  box: number;
  jam: number;
  third: number;
  gate: number;
}) {
  const boxScale = mix(1, 1.7, box);
  const riders: RiderState[] = [];
  for (let i = 0; i < N_WAVE; i++) {
    const r = waveRider(i, frame, wave, 150);
    if (r) riders.push(r);
  }
  for (let i = 0; i < N_TRICKLE; i++) {
    const r = trickleRider(i, frame, wave + 150, stopAt);
    if (r) riders.push(r);
  }
  const jamW = (Math.ceil(N_WAVE / LANES.length) + 0.4) * SLOT_W;
  const doorGlow = clamp01(riders.length / 12);

  return (
    <div style={{ position: 'relative', width: STREET_W, height: STREET_H, opacity: scene, fontFamily: FONT.sans }}>
      <svg width={STREET_W} height={STREET_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* Avenue (the provider's road) */}
        <rect x={AVENUE.x} y={AVENUE.y} width={AVENUE.w} height={AVENUE.h} rx={14} fill={alpha(C.ink800, 0.9)} stroke={C.ink700} strokeWidth={2} />
        {[AVENUE.y + AVENUE.h / 3, AVENUE.y + (2 * AVENUE.h) / 3].map((y) => (
          <line key={y} x1={AVENUE.x + 16} y1={y} x2={AVENUE.x + AVENUE.w - 8} y2={y} stroke={alpha(C.muted, 0.25)} strokeWidth={3} strokeDasharray="22 18" />
        ))}
        {/* Your street, narrower */}
        <rect x={STREET.x - 4} y={STREET.y} width={STREET.w + 8} height={STREET.h} fill={alpha(C.ink850, 0.95)} stroke={C.ink700} strokeWidth={2} />
        <line x1={STREET.x + 6} y1={STREET.y + STREET.h / 2} x2={STREET.x + STREET.w - 6} y2={STREET.y + STREET.h / 2} stroke={alpha(C.muted, 0.18)} strokeWidth={3} strokeDasharray="14 14" />

        {/* The jam, lit */}
        {jam > 0 ? (
          <rect
            x={QUEUE_FRONT - jamW + 8}
            y={STREET.y - 10}
            width={jamW + 14}
            height={STREET.h + 20}
            rx={18}
            fill={alpha(C.rose, 0.08 * jam)}
            stroke={alpha(C.rose, 0.8 * jam)}
            strokeWidth={3}
            strokeDasharray="12 8"
          />
        ) : null}

        {/* Restaurants */}
        {FAR.map((p, k) => (
          <Storefront key={`f${k}`} x={p.x} y={p.y} w={44} h={32} opacity={0.3 * shops} glow={0} />
        ))}
        {SHOPS.map((p, k) => (
          <Storefront key={k} x={p.x} y={p.y} opacity={clamp01(shops * 1.6 - k * 0.1)} glow={third} />
        ))}

        {/* The portal: your building, its door on the street */}
        <g>
          <rect x={PORTAL.x} y={PORTAL.y} width={PORTAL.w} height={PORTAL.h} rx={12} fill={alpha(C.cyan, 0.08)} stroke={C.cyan} strokeWidth={3} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={PORTAL.x + 70 + c * 40} y={PORTAL.y + 22 + r * 46} width={26} height={30} rx={4} fill={alpha(C.cyan, 0.22)} />
            )),
          )}
          <rect x={PORTAL.x + 8} y={STREET.y + 16} width={40} height={STREET.h - 16} rx={5} fill={alpha(doorGlow > 0.5 ? C.rose : C.cyan, 0.3)} stroke={doorGlow > 0.5 ? C.rose : C.cyan} strokeWidth={3} />
        </g>

        {/* Riders */}
        {riders.map((r, k) => (
          <Rider key={k} x={r.x} y={r.y} box={boxScale} opacity={r.o} />
        ))}

        {/* The provider's cut, across the avenue */}
        {gate > 0 ? (
          <g opacity={gate}>
            <rect x={GATE_X - 9} y={AVENUE.y - 12} width={18} height={(AVENUE.h + 24) * gate} rx={6} fill={alpha(C.emerald, 0.85)} />
            {Array.from({ length: 6 }, (_, k) => (
              <rect key={k} x={GATE_X - 9} y={AVENUE.y - 12 + k * 34 + 10} width={18} height={12} fill={alpha(C.emeraldDeep, 0.9)} opacity={gate > 0.9 ? 1 : 0} />
            ))}
            <rect x={GATE_X - 40} y={AVENUE.y - 16} width={80} height={AVENUE.h + 32} rx={14} fill={alpha(C.emerald, 0.08)} stroke={alpha(C.emerald, 0.5)} strokeWidth={2} strokeDasharray="8 8" />
          </g>
        ) : null}
      </svg>
      {gate > 0 ? (
        <div style={{ position: 'absolute', left: GATE_X + 48, top: AVENUE.y + 10, opacity: gate }}>
          <Icon name="shield" size={52} color={C.emerald} strokeWidth={2.2} />
        </div>
      ) : null}

      {/* The portal's name */}
      <div style={{ position: 'absolute', left: PORTAL.x - 30, top: PORTAL.y + PORTAL.h + 10, width: PORTAL.w + 60, textAlign: 'center', fontFamily: FONT.mono, fontSize: 25, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
        {FLOW.host}
      </div>
    </div>
  );
}
