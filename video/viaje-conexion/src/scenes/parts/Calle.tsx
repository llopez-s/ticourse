import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../engine/src/theme/motion';

/**
 * The street with numbered houses (address and prefix metaphor, s02 and s03): network = the street,
 * host = the number. `split` 0-1 turns it into two streets (192.168.20 and 192.168.30) as s03's answer says.
 * Native size 600 x 380; the scene adds the «imagen · no es del puerto» tag.
 */
export const CALLE_W = 600;
export const CALLE_H = 380;

const ABOVE = ['2', '4', '6', '8', '10'];
const BELOW = ['1', '3', '5', '7', '9'];

function House({ x, y, n, color, glow, num }: { x: number; y: number; n: string; color: string; glow: number; num: number }) {
  const w = 92;
  const h = 70;
  return (
    <g style={{ filter: glow > 0.05 ? `drop-shadow(0 0 ${Math.round(10 * glow)}px ${alpha(color, 0.8 * glow)})` : undefined }}>
      <polygon points={`${x - 6},${y + 22} ${x + w / 2},${y - 4} ${x + w + 6},${y + 22}`} fill={alpha(color, 0.25 + 0.3 * glow)} stroke={color} strokeWidth={3} strokeLinejoin="round" />
      <rect x={x} y={y + 22} width={w} height={h - 22} fill={alpha(color, 0.1 + 0.15 * glow)} stroke={color} strokeWidth={3} />
      <text x={x + w / 2} y={y + 62} textAnchor="middle" fontFamily={FONT.mono} fontWeight={800} fontSize={num} fill={glow > 0.05 ? C.textStrong : C.text}>
        {n}
      </text>
    </g>
  );
}

export function Calle({
  split = 0,
  streetLit = 0,
  houseLit = 0,
  width = CALLE_W,
  opacity = 1,
}: {
  split?: number;
  /** 0-1: the street name lights cyan (the network). */
  streetLit?: number;
  /** 0-1: the laptop's house (number 10) lights amber (the host). */
  houseLit?: number;
  width?: number;
  opacity?: number;
}) {
  const p = progress(split, 0, 1, EASE.inOut);
  const scale = width / CALLE_W;
  const roadH = 50 - 10 * p;
  const aTop = 165 - 53 * p;
  const bTop = 165 + 65 * p;
  const upperY = 70 - 50 * p;
  const lowerY = 230 + 50 * p;
  const base = C.ink500;
  const name = (x: number, y: number, text: string, lit: number, color: string) => (
    <text x={x} y={y} fontFamily={FONT.mono} fontWeight={800} fontSize={27} fill={lit > 0.05 ? color : C.muted}>
      {text}
    </text>
  );
  return (
    <svg width={CALLE_W * scale} height={CALLE_H * scale} viewBox={`0 0 ${CALLE_W} ${CALLE_H}`} style={{ display: 'block', opacity, overflow: 'visible' }} aria-hidden>
      {/* roads */}
      <rect x="0" y={aTop} width={CALLE_W} height={roadH} rx="8" fill={C.ink800} stroke={alpha(C.cyan, 0.15 + 0.5 * streetLit)} strokeWidth={2} />
      <rect x="0" y={bTop} width={CALLE_W} height={roadH} rx="8" fill={C.ink800} stroke={C.ink600} strokeWidth={2} opacity={p > 0.01 ? 1 : 0} />
      <path d={`M16,${aTop + roadH / 2} H${CALLE_W - 16}`} stroke={C.ink600} strokeWidth={3} strokeDasharray="22 18" />
      {p > 0.01 ? <path d={`M16,${bTop + roadH / 2} H${CALLE_W - 16}`} stroke={C.ink600} strokeWidth={3} strokeDasharray="22 18" /> : null}
      {/* street names painted on the roads */}
      <rect x="14" y={aTop + 6} width="176" height={roadH - 12} rx="6" fill={C.ink900} />
      {name(24, aTop + roadH / 2 + 9, '192.168.20', streetLit, C.cyan)}
      {p > 0.01 ? (
        <g opacity={p}>
          <rect x="14" y={bTop + 6} width="176" height={roadH - 12} rx="6" fill={C.ink900} />
          {name(24, bTop + roadH / 2 + 9, '192.168.30', 0, C.cyan)}
        </g>
      ) : null}
      {/* houses */}
      {ABOVE.map((n, i) => (
        <House key={`a${n}`} x={20 + i * 112} y={upperY} n={n} color={i === 4 ? (houseLit > 0.05 ? C.amber : base) : base} glow={i === 4 ? houseLit : 0} num={i === 4 ? 30 : 28} />
      ))}
      {BELOW.map((n, i) => (
        <House key={`b${n}`} x={20 + i * 112} y={lowerY} n={n} color={base} glow={0} num={28} />
      ))}
    </svg>
  );
}
