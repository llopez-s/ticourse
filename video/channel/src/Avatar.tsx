import { AbsoluteFill } from 'remotion';
import { C, alpha } from '../../engine/src/theme/tokens';

export const AVATAR = 800;

/* YouTube crops the avatar to a circle and shows it as small as ~98 px, so it
   is the app's diamond (◆, same shape as the favicon) plus one rose alert
   badge — nothing that needs reading. */
const CX = 392;
const CY = 410;
/** Half-diagonal of the diamond. */
const R = 214;
/** The badge sits on the diamond's upper-right edge. */
const BADGE = { x: CX + R * 0.53, y: CY - R * 0.53, r: 60 } as const;

export function Avatar() {
  const side = (R * 2) / Math.SQRT2;
  const corner = side * 0.16;
  return (
    <AbsoluteFill style={{ background: C.ink950 }}>
      <svg width={AVATAR} height={AVATAR} viewBox={`0 0 ${AVATAR} ${AVATAR}`} aria-hidden>
        <defs>
          <radialGradient id="av-bg" cx="49%" cy="51%" r="62%">
            <stop offset="0%" stopColor={C.ink800} />
            <stop offset="70%" stopColor={C.ink900} />
            <stop offset="100%" stopColor={C.ink950} />
          </radialGradient>
          <radialGradient id="av-glow">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.3} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="av-diamond" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.cyanSoft} />
            <stop offset="55%" stopColor={C.cyan} />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        <rect width={AVATAR} height={AVATAR} fill="url(#av-bg)" />
        <circle cx={CX} cy={CY} r={330} fill="url(#av-glow)" />

        {/* radar rings */}
        <circle cx={CX} cy={CY} r={272} fill="none" stroke={alpha(C.cyan, 0.3)} strokeWidth={5} />
        <circle cx={CX} cy={CY} r={332} fill="none" stroke={alpha(C.cyan, 0.16)} strokeWidth={4} />

        {/* the app's diamond */}
        <rect
          x={CX - side / 2}
          y={CY - side / 2}
          width={side}
          height={side}
          rx={corner}
          transform={`rotate(45 ${CX} ${CY})`}
          fill="url(#av-diamond)"
        />

        {/* alert badge, cut out of the diamond by an ink ring */}
        <circle cx={BADGE.x} cy={BADGE.y} r={BADGE.r + 16} fill={C.ink900} />
        <circle cx={BADGE.x} cy={BADGE.y} r={BADGE.r} fill={C.rose} />
        <circle cx={BADGE.x - 16} cy={BADGE.y - 16} r={12} fill={alpha(C.roseSoft, 0.55)} />
      </svg>
    </AbsoluteFill>
  );
}
