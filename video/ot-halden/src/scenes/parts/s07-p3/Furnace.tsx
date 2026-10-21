import { C, alpha } from '../../../../../engine/src/theme/tokens';

/**
 * The still background of question 3: the silhouette of a lit glass furnace (a brick body with a glowing mouth, a
 * chimney, a batch hopper feeding it and a row of bottles on a belt). No text, no names, no manufacturer. Drawn at the
 * stage size (1728×660) and never animated.
 */
const W = 1728;
const H = 660;
const CX = 864;

export function Furnace() {
  const bricks: number[] = [];
  for (let y = 290; y < 540; y += 26) bricks.push(y);
  const bottle = (x: number, i: number) => {
    const tall = 56 + (i % 3) * 8;
    return (
      <g key={i} transform={`translate(${x} ${548 - tall})`}>
        <path
          d={`M0 ${tall} V${tall * 0.42} Q0 ${tall * 0.3} 8 ${tall * 0.22} V8 H24 V${tall * 0.22} Q32 ${tall * 0.3} 32 ${tall * 0.42} V${tall} Z`}
          fill={alpha(C.amber, 0.12)}
          stroke={alpha(C.amber, 0.55)}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </g>
    );
  };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
      <defs>
        <radialGradient id="furnace-bloom" cx="50%" cy="62%" r="52%">
          <stop offset="0%" stopColor={C.amber} stopOpacity={0.4} />
          <stop offset="45%" stopColor={C.rose} stopOpacity={0.14} />
          <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="furnace-mouth" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={C.amber} stopOpacity={0.95} />
          <stop offset="55%" stopColor="#fb923c" stopOpacity={0.85} />
          <stop offset="100%" stopColor={C.rose} stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <rect x={0} y={20} width={W} height={H - 40} rx={18} fill={C.ink900} />
      <ellipse cx={CX} cy={420} rx={640} ry={300} fill="url(#furnace-bloom)" />

      {/* floor */}
      <line x1={90} y1={548} x2={W - 90} y2={548} stroke={alpha(C.muted, 0.4)} strokeWidth={5} strokeLinecap="round" />

      {/* chimney */}
      <path d="M818 270 V96 H910 V270 Z" fill={C.ink800} stroke={alpha(C.muted, 0.7)} strokeWidth={5} strokeLinejoin="round" />
      <rect x={804} y={78} width={120} height={26} rx={5} fill={C.ink800} stroke={alpha(C.muted, 0.7)} strokeWidth={5} />
      {[128, 164, 200, 236].map((y) => (
        <line key={y} x1={826} y1={y} x2={902} y2={y} stroke={alpha(C.muted, 0.22)} strokeWidth={3} />
      ))}

      {/* body */}
      <rect x={604} y={262} width={520} height={286} rx={22} fill={C.ink800} stroke={alpha(C.muted, 0.75)} strokeWidth={6} />
      <path d="M604 262 H1124" stroke={alpha(C.muted, 0.85)} strokeWidth={10} strokeLinecap="round" />
      {bricks.map((y, i) => (
        <g key={y} stroke={alpha(C.muted, 0.2)} strokeWidth={3}>
          <line x1={618} y1={y} x2={1110} y2={y} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => {
            const x = 644 + k * 52 + (i % 2) * 26;
            return x < 1100 ? <line key={k} x1={x} y1={y} x2={x} y2={y + 26} /> : null;
          })}
        </g>
      ))}

      {/* the mouth: a glowing arch */}
      <path d="M744 548 V424 A120 120 0 0 1 984 424 V548 Z" fill="url(#furnace-mouth)" stroke={alpha(C.amber, 0.9)} strokeWidth={6} strokeLinejoin="round" />
      <path d="M790 548 V440 A74 74 0 0 1 938 440 V548 Z" fill={alpha('#fff7d6', 0.55)} />
      <path d="M744 548 V424 A120 120 0 0 1 984 424 V548" fill="none" stroke={alpha(C.ink950, 0.55)} strokeWidth={14} />

      {/* heat shimmer above the roof */}
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${676 + k * 190} 232 q14 -22 0 -44 q-14 -22 0 -44`} fill="none" stroke={alpha(C.amber, 0.4)} strokeWidth={5} strokeLinecap="round" />
      ))}

      {/* batch hopper feeding the furnace from the left */}
      <path d="M362 222 H532 L498 330 H396 Z" fill={C.ink800} stroke={alpha(C.muted, 0.7)} strokeWidth={5} strokeLinejoin="round" />
      <line x1={447} y1={330} x2={447} y2={372} stroke={alpha(C.muted, 0.7)} strokeWidth={14} />
      <path d="M447 372 V430 H604" fill="none" stroke={alpha(C.muted, 0.7)} strokeWidth={14} strokeLinejoin="round" />
      <rect x={414} y={440} width={66} height={108} rx={6} fill={C.ink800} stroke={alpha(C.muted, 0.5)} strokeWidth={4} />

      {/* belt with bottles on the right */}
      <rect x={1160} y={548} width={470} height={16} rx={8} fill={C.ink800} stroke={alpha(C.muted, 0.6)} strokeWidth={4} />
      {[1200, 1290, 1380, 1470, 1560].map((x, i) => bottle(x, i))}
      {[1190, 1380, 1570].map((x) => (
        <circle key={x} cx={x} cy={590} r={10} fill={C.ink800} stroke={alpha(C.muted, 0.55)} strokeWidth={4} />
      ))}
    </svg>
  );
}
