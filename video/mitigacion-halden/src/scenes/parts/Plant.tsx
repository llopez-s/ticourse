import { useCurrentFrame } from 'remotion';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/** The plant's own units (scaled by `width`). */
export const PLANT = { w: 260, h: 300 } as const;

/** Linear blend of two #rrggbb colours. */
export function mixHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

const GREEN = '#4ade80';
const WILTED = '#9a9a52';
const STEM_BASE: [number, number] = [150, 222];
/** Leaves: height along the stem (0 base – 1 top), side, healthy angle (deg, 0 = pointing out horizontally). */
const LEAVES: { t: number; side: 1 | -1; up: number; len: number }[] = [
  { t: 0.18, side: -1, up: 30, len: 78 },
  { t: 0.3, side: 1, up: 28, len: 80 },
  { t: 0.5, side: -1, up: 36, len: 70 },
  { t: 0.62, side: 1, up: 38, len: 68 },
  { t: 0.82, side: -1, up: 46, len: 56 },
  { t: 0.9, side: 1, up: 50, len: 52 },
];
/** Aphids: leaf index and position along it (0–1). */
const APHIDS: [number, number][] = [
  [0, 0.55], [0, 0.75], [1, 0.45], [1, 0.7], [2, 0.6], [3, 0.5], [3, 0.72], [4, 0.6], [5, 0.5],
];

/**
 * The living-room plant (concept 1, «imagen · no es del puerto»): a pot with a plant that droops («pocha»: `droop`
 * 0–1 bends the stem and wilts the leaves), a watering can that pours (`water` 0–1), aphids on the leaves (`aphids`
 * 0–1, the cause that water does not fix) and, optionally, a moisture sensor stuck in the soil (`sensor` 0–1; its
 * light blinks with `alarm`). Never called «maceta».
 */
export function Plant({
  width = PLANT.w,
  droop = 0,
  water = 0,
  aphids = 0,
  sensor = 0,
  alarm = 0,
  frame: frameProp,
}: {
  width?: number;
  droop?: number;
  water?: number;
  aphids?: number;
  sensor?: number;
  alarm?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const d = clamp01(droop);
  const s = width / PLANT.w;
  const leafColor = mixHex(GREEN, WILTED, d);
  const top: [number, number] = [STEM_BASE[0] + 34 * d, 52 + 50 * d];
  const ctrl: [number, number] = [STEM_BASE[0] - 6, 120];
  const stemAt = (t: number): [number, number] => {
    const u = 1 - t;
    return [u * u * STEM_BASE[0] + 2 * u * t * ctrl[0] + t * t * top[0], u * u * STEM_BASE[1] + 2 * u * t * ctrl[1] + t * t * top[1]];
  };
  const leafGeom = LEAVES.map((l) => {
    const [x, y] = stemAt(l.t);
    // healthy: pointing up-and-out; wilted: hanging down
    const ang = l.side === 1 ? -l.up + d * (l.up + 48) : 180 + l.up - d * (l.up + 48);
    return { x, y, ang, len: l.len };
  });
  const w = clamp01(water);
  const a = clamp01(aphids);
  const sn = clamp01(sensor);
  const blink = alarm > 0 ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;

  return (
    <svg width={PLANT.w * s} height={PLANT.h * s} viewBox={`0 0 ${PLANT.w} ${PLANT.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* stem and leaves */}
      <path d={`M ${STEM_BASE[0]} ${STEM_BASE[1]} Q ${ctrl[0]} ${ctrl[1]} ${top[0]} ${top[1]}`} fill="none" stroke={mixHex('#22c55e', '#7c7c3c', d)} strokeWidth={6} strokeLinecap="round" />
      {leafGeom.map((g, i) => (
        <g key={i} transform={`translate(${g.x} ${g.y}) rotate(${g.ang})`}>
          <path d={`M 0 0 Q ${g.len * 0.45} ${-g.len * 0.3} ${g.len} 0 Q ${g.len * 0.45} ${g.len * 0.3} 0 0 Z`} fill={leafColor} stroke={alpha('#052e16', 0.5)} strokeWidth={2} />
          <line x1={4} y1={0} x2={g.len - 8} y2={0} stroke={alpha('#052e16', 0.45)} strokeWidth={1.6} />
        </g>
      ))}
      {/* aphids: small rose ovals on the leaves */}
      {a > 0.01
        ? APHIDS.map(([li, t], k) => {
            const g = leafGeom[li];
            const r = (g.ang * Math.PI) / 180;
            const px = g.x + Math.cos(r) * g.len * t;
            const py = g.y + Math.sin(r) * g.len * t;
            const show = clamp01(a * APHIDS.length - k * 0.6);
            return (
              <g key={k} opacity={show}>
                <ellipse cx={px} cy={py - 3} rx={5.5} ry={4} fill={C.roseSoft} stroke={C.roseDeep} strokeWidth={1.5} />
                <circle cx={px + 4.5} cy={py - 4} r={1.8} fill={C.roseDeep} />
              </g>
            );
          })
        : null}
      {/* the pot */}
      <path d="M 92 222 L 208 222 L 196 292 L 104 292 Z" fill="#b45f3c" stroke="#7c3a1f" strokeWidth={4} strokeLinejoin="round" />
      <rect x={84} y={210} width={132} height={22} rx={6} fill="#c96f48" stroke="#7c3a1f" strokeWidth={4} />
      <ellipse cx={150} cy={212} rx={58} ry={6} fill="#3f2a1d" />
      {/* the moisture sensor */}
      {sn > 0.01 ? (
        <g opacity={sn}>
          <line x1={190} y1={214} x2={190} y2={160} stroke="#cbd5e1" strokeWidth={4} strokeLinecap="round" />
          <rect x={174} y={128} width={34} height={36} rx={8} fill={C.ink800} stroke="#cbd5e1" strokeWidth={3} />
          <circle cx={191} cy={146} r={7} fill={alarm > 0 ? alpha(C.amber, 0.35 + 0.65 * blink) : alpha(C.emerald, 0.8)} />
        </g>
      ) : null}
      {/* the watering can, tilted, pouring */}
      {w > 0.01 ? (
        <g opacity={w} transform={`translate(${mix(-30, 0, w)} 0)`}>
          <g transform="translate(14 46) rotate(22)">
            <rect x={0} y={0} width={70} height={52} rx={10} fill="#64748b" stroke="#cbd5e1" strokeWidth={3} />
            <path d="M 70 14 L 112 -6" stroke="#cbd5e1" strokeWidth={7} strokeLinecap="round" />
            <path d="M 4 10 Q -18 26 4 44" fill="none" stroke="#cbd5e1" strokeWidth={5} />
          </g>
          {[0, 1, 2, 3].map((k) => {
            const t = ((frame + k * 7) % 28) / 28;
            return <circle key={k} cx={mix(122, 136, t)} cy={mix(86, 206, t)} r={4} fill={alpha(C.sky, 0.85 * (1 - t * 0.4))} />;
          })}
        </g>
      ) : null}
    </svg>
  );
}
