import { C, alpha } from '../../../../engine/src/theme/tokens';

export type PersonKind = 'grandma' | 'kid' | 'aunt' | 'you' | 'mover';

/** The pictogram's own box: 160 wide, 270 high. */
export const PERSON = { w: 160, h: 270 } as const;

/**
 * A faceless pictogram (head, shoulders, one detail that tells who it is): the grandmother (hair bun, glasses, shawl),
 * the grandson (cap), the aunt (long hair), «you» (plain) and the mover (cap and vest). Drawn at `height` px with its
 * feet on the bottom edge; `tone` is the outline colour (the role it stands for).
 */
export function Person({ kind, tone, height = PERSON.h, x = 0, y = 0, opacity = 1 }: { kind: PersonKind; tone: string; height?: number; x?: number; y?: number; opacity?: number }) {
  const k = height / PERSON.h;
  const small = kind === 'kid';
  const body = 'M26 266 Q26 130 80 124 Q134 130 134 266 Z';
  const hair = alpha(C.muted, 0.55);
  return (
    <svg width={PERSON.w * k} height={height} viewBox={`0 0 ${PERSON.w} ${PERSON.h}`} style={{ position: 'absolute', left: x, top: y, overflow: 'visible', opacity }}>
      <g transform={small ? 'translate(80 266) scale(0.82) translate(-80 -266)' : undefined}>
        {kind === 'aunt' ? (
          <>
            <rect x={42} y={46} width={20} height={104} rx={10} fill={hair} />
            <rect x={98} y={46} width={20} height={104} rx={10} fill={hair} />
          </>
        ) : null}
        <path d={body} fill={C.ink800} stroke={alpha(tone, 0.9)} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={80} cy={72} r={34} fill={C.ink800} stroke={alpha(tone, 0.9)} strokeWidth={5} />
        {kind === 'grandma' ? (
          <>
            <circle cx={80} cy={32} r={17} fill={hair} />
            <path d="M46 70 Q46 36 80 36 Q114 36 114 70 Q100 54 80 54 Q60 54 46 70 Z" fill={hair} />
            <circle cx={66} cy={74} r={9} fill="none" stroke={C.text} strokeWidth={3} />
            <circle cx={94} cy={74} r={9} fill="none" stroke={C.text} strokeWidth={3} />
            <path d="M75 74 H85" stroke={C.text} strokeWidth={3} />
            <path d="M32 168 Q80 204 128 168" fill="none" stroke={alpha(tone, 0.8)} strokeWidth={9} strokeLinecap="round" />
          </>
        ) : null}
        {kind === 'kid' ? (
          <>
            <path d="M46 64 Q80 18 114 64 Z" fill={alpha(tone, 0.45)} stroke={alpha(tone, 0.9)} strokeWidth={4} strokeLinejoin="round" />
            <path d="M80 64 H132" stroke={alpha(tone, 0.9)} strokeWidth={6} strokeLinecap="round" />
          </>
        ) : null}
        {kind === 'aunt' ? <path d="M48 62 Q80 30 112 62 Q96 52 80 52 Q64 52 48 62 Z" fill={hair} /> : null}
        {kind === 'mover' ? (
          <>
            <path d="M46 64 Q80 18 114 64 Z" fill={alpha(C.amber, 0.45)} stroke={alpha(C.amber, 0.9)} strokeWidth={4} strokeLinejoin="round" />
            <path d="M60 140 V262 M100 140 V262" stroke={alpha(C.amber, 0.7)} strokeWidth={9} />
          </>
        ) : null}
        {kind === 'you' ? <path d="M60 128 L80 156 L100 128" fill="none" stroke={alpha(tone, 0.7)} strokeWidth={5} strokeLinejoin="round" /> : null}
      </g>
    </svg>
  );
}
