import { C, alpha } from '../../../../../engine/src/theme/tokens';

const W = 1728;
const H = 660;
const CX = W / 2;
const BASE = 604;
const VANISH = { x: CX, y: 330 };

/** Arch outline of half-width `hw` and total height `h` standing on `BASE`. */
function arch(cx: number, base: number, hw: number, h: number): string {
  const top = base - h + hw;
  return `M ${cx - hw} ${base} V ${top} A ${hw} ${hw} 0 0 1 ${cx + hw} ${top} V ${base}`;
}

/**
 * Background of s03: the mouth of a road tunnel seen head-on (rings receding to a dark centre, a road with a dashed
 * lane line, two jet fans hung under the crown). A silhouette: no text, no name, no city, no manufacturer. Still.
 */
export function TunnelArt() {
  const rings = [0, 1, 2, 3, 4, 5].map((k) => {
    const s = Math.pow(0.7, k);
    return { hw: 420 * s, h: 520 * s, base: BASE - (BASE - VANISH.y - 40) * (1 - s) * 0.55, k };
  });
  const lane = [0, 1, 2, 3, 4, 5].map((k) => {
    const t = Math.pow(0.7, k);
    const y = BASE + 24 - (BASE - VANISH.y + 24) * (1 - t);
    return { y, w: 10 * t + 2, h: 56 * t };
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
      {/* the wall around the mouth */}
      <path d={`${arch(CX, BASE, 520, 600)} Z`} fill={alpha(C.ink800, 0.9)} />
      {/* the receding rings */}
      {rings.map((r) => (
        <path
          key={r.k}
          d={arch(CX, r.base, r.hw, r.h)}
          fill={r.k === rings.length - 1 ? C.ink950 : 'none'}
          stroke={alpha(C.sky, 0.55 - 0.07 * r.k)}
          strokeWidth={Math.max(3, 9 - 1.4 * r.k)}
          strokeLinecap="round"
        />
      ))}
      {/* road surface */}
      <path d={`M ${CX - 440} ${BASE + 18} L ${CX - 40} ${VANISH.y + 70} L ${CX + 40} ${VANISH.y + 70} L ${CX + 440} ${BASE + 18} Z`} fill={alpha(C.ink850, 0.95)} stroke={alpha(C.muted, 0.25)} strokeWidth={3} />
      {lane.map((l, i) => (
        <rect key={i} x={CX - l.w / 2} y={l.y - l.h} width={l.w} height={l.h} rx={2} fill={alpha(C.amber, 0.45)} />
      ))}
      {/* two jet fans under the crown (ventilation) */}
      {[-150, 150].map((dx) => (
        <g key={dx} transform={`translate(${CX + dx} 150)`}>
          <line x1={0} y1={-46} x2={0} y2={-18} stroke={alpha(C.muted, 0.5)} strokeWidth={5} />
          <rect x={-54} y={-18} width={108} height={50} rx={25} fill={alpha(C.ink700, 0.95)} stroke={alpha(C.cyan, 0.55)} strokeWidth={5} />
          <ellipse cx={-54} cy={7} rx={10} ry={25} fill={alpha(C.cyan, 0.2)} stroke={alpha(C.cyan, 0.55)} strokeWidth={4} />
          <line x1={-30} y1={7} x2={34} y2={7} stroke={alpha(C.cyan, 0.4)} strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
