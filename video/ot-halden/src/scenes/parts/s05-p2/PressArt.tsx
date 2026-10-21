import { C, alpha } from '../../../../../engine/src/theme/tokens';

const W = 1728;
const H = 660;
const CX = W / 2;

/**
 * Background of s05: the silhouette of a press with a light curtain in front of it (an emitter post on the left, a
 * receiver post on the right and a plane of thin beams between them). No factory, name or text. Still.
 */
export function PressArt() {
  const beams = Array.from({ length: 11 }, (_, i) => 150 + i * 40);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
      <circle cx={CX} cy={330} r={290} fill={alpha(C.sky, 0.05)} />

      {/* the press: bed, two uprights, crown and the ram hanging from it */}
      <rect x={CX - 280} y={500} width={560} height={64} rx={8} fill={alpha(C.ink800, 0.95)} stroke={alpha(C.muted, 0.5)} strokeWidth={5} />
      <rect x={CX - 190} y={470} width={380} height={30} rx={4} fill={alpha(C.ink700, 0.95)} stroke={alpha(C.muted, 0.4)} strokeWidth={4} />
      {[-250, 190].map((dx) => (
        <rect key={dx} x={CX + dx} y={110} width={60} height={392} rx={6} fill={alpha(C.ink800, 0.95)} stroke={alpha(C.muted, 0.5)} strokeWidth={5} />
      ))}
      <rect x={CX - 280} y={64} width={560} height={90} rx={10} fill={alpha(C.ink800, 0.95)} stroke={alpha(C.muted, 0.5)} strokeWidth={5} />
      <rect x={CX - 40} y={154} width={80} height={110} fill={alpha(C.ink700, 0.95)} stroke={alpha(C.muted, 0.4)} strokeWidth={4} />
      <rect x={CX - 150} y={264} width={300} height={56} rx={6} fill={alpha(C.ink700, 0.95)} stroke={alpha(C.muted, 0.5)} strokeWidth={5} />

      {/* the light curtain: two posts and the plane of beams between them */}
      {[CX - 560, CX + 560].map((x, i) => (
        <g key={x}>
          <rect x={x - 22} y={110} width={44} height={462} rx={10} fill={alpha(C.ink700, 0.98)} stroke={alpha(C.cyan, 0.6)} strokeWidth={5} />
          {beams.map((y) => (
            <circle key={y} cx={x} cy={y + 40} r={7} fill={alpha(i === 0 ? C.amber : C.cyan, 0.8)} />
          ))}
        </g>
      ))}
      {beams.map((y) => (
        <line key={y} x1={CX - 534} y1={y + 40} x2={CX + 534} y2={y + 40} stroke={alpha(C.amber, 0.28)} strokeWidth={3} strokeDasharray="4 14" strokeLinecap="round" />
      ))}
    </svg>
  );
}
