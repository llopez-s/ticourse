import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The video's three everyday images, each tagged «imagen · no es del puerto» wherever it is shown: the cat that is
 * adopted (due diligence, then due care), the neighbourhood hair salon (what not complying costs) and the filing
 * cabinet at home (inventory and retention). Line drawings in the series' palette, no text, no brands, nothing readable.
 */

const sky = (a: number) => alpha(C.sky, a);

/** The cat sitting next to its bowl. `fed` 0–1 fills the bowl with kibble; `alert` 0–1 rims it amber (nobody fed it). */
export function Cat({ width = 340, fed = 0, alert = 0, glow = 0 }: { width?: number; fed?: number; alert?: number; glow?: number }) {
  const h = (width * 244) / 340;
  const f = clamp01(fed);
  const a = clamp01(alert);
  const kibble: ReadonlyArray<readonly [number, number]> = [
    [248, 198],
    [262, 192],
    [276, 196],
    [290, 192],
    [302, 198],
    [255, 184],
    [270, 182],
    [286, 183],
  ];
  return (
    <svg width={width} height={h} viewBox="0 0 340 244" fill="none" style={{ display: 'block', overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${sky(0.4 * glow)})` : undefined }}>
      {/* tail */}
      <path d="M94 216 C28 220 10 160 44 134" stroke={sky(0.85)} strokeWidth={9} strokeLinecap="round" />
      {/* body */}
      <path d="M92 124 C66 152 66 208 94 224 H186 C214 208 214 152 188 124" fill={sky(0.08)} stroke={sky(0.9)} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M140 150 V224" stroke={sky(0.25)} strokeWidth={3} />
      {/* paws */}
      <ellipse cx={116} cy={226} rx={20} ry={10} fill={C.ink900} stroke={sky(0.9)} strokeWidth={4} />
      <ellipse cx={164} cy={226} rx={20} ry={10} fill={C.ink900} stroke={sky(0.9)} strokeWidth={4} />
      {/* head */}
      <path d="M96 66 L92 20 L134 46 Z" fill={sky(0.1)} stroke={sky(0.9)} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M184 66 L188 20 L146 46 Z" fill={sky(0.1)} stroke={sky(0.9)} strokeWidth={4.5} strokeLinejoin="round" />
      <circle cx={140} cy={88} r={52} fill={C.ink900} stroke={sky(0.9)} strokeWidth={4.5} />
      <circle cx={140} cy={88} r={52} fill={sky(0.08)} />
      <ellipse cx={120} cy={84} rx={5.5} ry={8} fill={C.textStrong} />
      <ellipse cx={160} cy={84} rx={5.5} ry={8} fill={C.textStrong} />
      <path d="M134 98 H146 L140 106 Z" fill={C.roseSoft} />
      <path d="M140 106 q-8 9 -16 4 M140 106 q8 9 16 4" stroke={sky(0.9)} strokeWidth={3} strokeLinecap="round" />
      <path d="M96 96 L66 90 M96 104 L68 108 M184 96 L214 90 M184 104 L212 108" stroke={sky(0.6)} strokeWidth={3} strokeLinecap="round" />
      {/* bowl */}
      {kibble.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y - 6 * (1 - f)} r={9 * f} fill={C.emerald} opacity={f} />
      ))}
      <path d="M222 206 H322 q-6 32 -50 32 q-44 0 -50 -32 Z" fill={alpha(C.amber, 0.1 + 0.14 * a)} stroke={alpha(C.amber, 0.5 + 0.5 * a)} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M222 206 H322" stroke={alpha(C.amber, 0.6 + 0.4 * a)} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

/** The neighbourhood hair salon: awning, window with scissors, door and a blank sign. */
export function Salon({ width = 300, glow = 0 }: { width?: number; glow?: number }) {
  const h = (width * 232) / 300;
  const stripes = [0, 1, 2, 3, 4, 5];
  return (
    <svg width={width} height={h} viewBox="0 0 300 232" fill="none" style={{ display: 'block', overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${sky(0.4 * glow)})` : undefined }}>
      {/* blank sign */}
      <rect x={80} y={4} width={140} height={34} rx={10} fill={sky(0.08)} stroke={sky(0.8)} strokeWidth={4} />
      <path d="M104 21 H196" stroke={sky(0.3)} strokeWidth={5} strokeLinecap="round" />
      {/* shop front */}
      <rect x={30} y={78} width={240} height={150} rx={6} fill={sky(0.05)} stroke={sky(0.85)} strokeWidth={4.5} />
      {/* awning */}
      {stripes.map((i) => (
        <path
          key={i}
          d={`M${20 + i * 43.3} 52 H${20 + (i + 1) * 43.3} V86 a21.65 21.65 0 0 1 -43.3 0 Z`}
          fill={i % 2 === 0 ? alpha(C.amber, 0.28) : sky(0.1)}
          stroke={i % 2 === 0 ? alpha(C.amber, 0.8) : sky(0.7)}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
      ))}
      {/* window with scissors */}
      <rect x={52} y={116} width={118} height={92} rx={8} fill={C.ink900} stroke={sky(0.7)} strokeWidth={4} />
      <path d="M88 130 L136 192 M134 130 L86 192" stroke={C.textStrong} strokeWidth={5} strokeLinecap="round" />
      <circle cx={82} cy={196} r={10} stroke={C.textStrong} strokeWidth={4.5} />
      <circle cx={140} cy={196} r={10} stroke={C.textStrong} strokeWidth={4.5} />
      {/* door */}
      <rect x={196} y={116} width={52} height={112} rx={6} fill={sky(0.07)} stroke={sky(0.7)} strokeWidth={4} />
      <circle cx={236} cy={174} r={4} fill={sky(0.9)} />
    </svg>
  );
}

/** The filing cabinet at home: three drawers, the top one pulled out with its sheets showing, blank label slots. */
export function Drawer({ width = 240, glow = 0, open = 1 }: { width?: number; glow?: number; open?: number }) {
  const h = (width * 300) / 240;
  const o = clamp01(open);
  return (
    <svg width={width} height={h} viewBox="0 0 240 300" fill="none" style={{ display: 'block', overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(18 * glow)}px ${sky(0.4 * glow)})` : undefined }}>
      {/* sheets standing in the open top drawer */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={52 + i * 28} y={26 - o * (10 + (i % 2) * 8)} width={20} height={40 + o * (10 + (i % 2) * 8)} rx={3} fill={alpha(i % 2 ? C.amber : C.cyan, 0.14)} stroke={alpha(i % 2 ? C.amber : C.cyan, 0.65)} strokeWidth={3} />
      ))}
      {/* cabinet */}
      <rect x={30} y={60} width={180} height={232} rx={10} fill={C.ink900} stroke={sky(0.85)} strokeWidth={4.5} />
      <rect x={30} y={60} width={180} height={232} rx={10} fill={sky(0.06)} />
      {[0, 1, 2].map((i) => {
        const y = 72 + i * 74;
        const dy = i === 0 ? o * 6 : 0;
        return (
          <g key={i}>
            <rect x={44} y={y + dy} width={152} height={64} rx={6} fill={sky(0.07)} stroke={sky(0.75)} strokeWidth={3.5} />
            <rect x={88} y={y + 12 + dy} width={64} height={18} rx={4} stroke={sky(0.45)} strokeWidth={3} />
            <path d={`M104 ${y + 46 + dy} H136`} stroke={sky(0.9)} strokeWidth={5} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}
