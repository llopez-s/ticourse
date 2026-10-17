import { C, alpha } from '../../../../../engine/src/theme/tokens';

const W = 1728;
const H = 660;
const FLOOR_Y = 512;
const DESK_TOP = 404;
const DESK_W = 400;
const DESKS = [104, 664, 1224];

// Distant lights seen through the windows: deterministic, sparse, dim (amber = a lit window, cyan = the port).
const LIGHTS: { x: number; y: number; c: string }[] = [
  { x: 40, y: 150, c: C.amber },
  { x: 72, y: 186, c: C.cyan },
  { x: 128, y: 170, c: C.amber },
  { x: 214, y: 204, c: C.amber },
  { x: 262, y: 160, c: C.cyan },
  { x: 300, y: 214, c: C.amber },
  { x: 54, y: 120, c: C.cyan },
  { x: 176, y: 140, c: C.amber },
];

/**
 * s03's still background: the office at night, half-lit and textless — a back wall with two windows onto the
 * dark port, three desks with their monitors off and papers left out in view, one desk lamp glowing low. Nothing
 * moves: the exam question panel covers it from the scene's first second, so it is texture behind the card.
 */
export function NightOffice() {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="s03-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.ink850} />
          <stop offset="100%" stopColor={C.ink900} />
        </linearGradient>
        <linearGradient id="s03-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1630" />
          <stop offset="100%" stopColor="#13284a" />
        </linearGradient>
        <radialGradient id="s03-lamp" cx="0.5" cy="0" r="1">
          <stop offset="0%" stopColor={C.amber} stopOpacity={0.32} />
          <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="s03-pool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={C.amber} stopOpacity={0.14} />
          <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* back wall and floor */}
      <rect x={0} y={0} width={W} height={FLOOR_Y} rx={18} fill="url(#s03-wall)" />
      <rect x={0} y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill={C.ink950} />
      <line x1={0} y1={FLOOR_Y} x2={W} y2={FLOOR_Y} stroke={alpha(C.muted, 0.25)} strokeWidth={3} />

      {/* two windows onto the night */}
      {[200, 1148].map((x) => (
        <g key={x} transform={`translate(${x} 56)`}>
          <rect x={0} y={0} width={380} height={270} rx={8} fill="url(#s03-sky)" stroke={alpha(C.muted, 0.4)} strokeWidth={5} />
          {/* skyline silhouettes */}
          <path d="M 0 270 V 200 H 50 V 170 H 96 V 210 H 150 V 150 H 196 V 196 H 250 V 176 H 300 V 214 H 340 V 186 H 380 V 270 Z" fill={alpha(C.ink950, 0.9)} />
          {LIGHTS.map((l, i) => (
            <rect key={i} x={l.x + (x > 600 ? 30 : 0)} y={l.y + 12} width={8} height={6} rx={1} fill={alpha(l.c, 0.45)} />
          ))}
          <line x1={190} y1={0} x2={190} y2={270} stroke={alpha(C.muted, 0.35)} strokeWidth={4} />
          <line x1={0} y1={135} x2={380} y2={135} stroke={alpha(C.muted, 0.2)} strokeWidth={3} />
        </g>
      ))}
      {/* a crescent moon in the left window */}
      <circle cx={262} cy={110} r={20} fill={alpha(C.text, 0.5)} />
      <circle cx={272} cy={104} r={18} fill="#0b1832" />

      {/* the lamp's pool of light on the middle desk */}
      <ellipse cx={DESKS[1] + 250} cy={DESK_TOP} rx={260} ry={70} fill="url(#s03-pool)" />

      {DESKS.map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          {/* monitor, off */}
          <rect x={60} y={DESK_TOP - 150} width={190} height={120} rx={8} fill={C.ink950} stroke={alpha(C.muted, 0.45)} strokeWidth={4} />
          <line x1={150} y1={DESK_TOP - 140} x2={110} y2={DESK_TOP - 40} stroke={alpha(C.text, 0.06)} strokeWidth={14} />
          <rect x={146} y={DESK_TOP - 30} width={18} height={30} fill={alpha(C.muted, 0.4)} />
          <rect x={116} y={DESK_TOP - 6} width={78} height={6} rx={3} fill={alpha(C.muted, 0.4)} />
          {/* papers left in view */}
          <rect x={262} y={DESK_TOP - 10} width={100} height={10} rx={2} fill={alpha(C.text, 0.5)} transform={`rotate(${i === 1 ? -4 : 3} 310 ${DESK_TOP})`} />
          <rect x={280} y={DESK_TOP - 19} width={92} height={9} rx={2} fill={alpha(C.text, 0.38)} transform={`rotate(${i === 1 ? 6 : -5} 326 ${DESK_TOP})`} />
          {i !== 1 ? <rect x={14} y={DESK_TOP - 8} width={70} height={8} rx={2} fill={alpha(C.text, 0.28)} transform={`rotate(-3 50 ${DESK_TOP})`} /> : null}
          {/* desk top, legs */}
          <rect x={0} y={DESK_TOP} width={DESK_W} height={18} rx={4} fill={C.ink700} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
          <rect x={18} y={DESK_TOP + 18} width={12} height={FLOOR_Y - DESK_TOP - 14} fill={C.ink800} />
          <rect x={DESK_W - 30} y={DESK_TOP + 18} width={12} height={FLOOR_Y - DESK_TOP - 14} fill={C.ink800} />
          {/* chair, pushed in */}
          <path d={`M 150 ${DESK_TOP + 40} H 250 V ${DESK_TOP + 92} H 150 Z`} fill={C.ink800} stroke={alpha(C.muted, 0.3)} strokeWidth={3} />
          <rect x={196} y={DESK_TOP + 92} width={8} height={FLOOR_Y - DESK_TOP - 104} fill={C.ink700} />
          <path d={`M 160 ${FLOOR_Y - 4} H 240`} stroke={alpha(C.muted, 0.35)} strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}

      {/* the desk lamp, on low */}
      <g transform={`translate(${DESKS[1] + 300} 0)`}>
        <path d={`M -70 ${DESK_TOP} L 0 ${DESK_TOP - 120} L 70 ${DESK_TOP} Z`} fill="url(#s03-lamp)" />
        <path d={`M 40 ${DESK_TOP} L 40 ${DESK_TOP - 90} L 6 ${DESK_TOP - 124}`} fill="none" stroke={alpha(C.muted, 0.55)} strokeWidth={5} strokeLinecap="round" />
        <path d={`M -22 ${DESK_TOP - 112} L 22 ${DESK_TOP - 140} L 30 ${DESK_TOP - 122} L -10 ${DESK_TOP - 100} Z`} fill={alpha(C.muted, 0.55)} />
        <rect x={22} y={DESK_TOP - 6} width={36} height={6} rx={3} fill={alpha(C.muted, 0.55)} />
      </g>
    </svg>
  );
}
