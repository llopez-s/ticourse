import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

export type Mood = 'knowing' | 'puzzled' | 'oops' | 'calm';

/**
 * A face with no name and no marked gender: a round head, two eyes, a mouth and a plain pair of shoulders. The mood
 * is carried by the eyes, the brows and the mouth only — `knowing` (looks aside, a flat half-smile: it knows),
 * `puzzled` (brows up, a small uneven mouth: it does not fit), `oops` (wide eyes, a round mouth, a drop: it did not
 * notice) and `calm`. `tone` is the ring colour; `glow` 0–1 adds a soft halo.
 */
export function Face({ size = 120, tone = C.cyan, mood = 'calm', glow = 0, idSuffix = '' }: { size?: number; tone?: string; mood?: Mood; glow?: number; idSuffix?: string }) {
  const stroke = 4;
  const eyeY = 54;
  const look = mood === 'knowing' ? 3.5 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <radialGradient id={`face-glow${idSuffix}`}>
          <stop offset="0%" stopColor={tone} stopOpacity={0.35 * glow} />
          <stop offset="100%" stopColor={tone} stopOpacity={0} />
        </radialGradient>
      </defs>
      {glow > 0.01 ? <circle cx={60} cy={62} r={78} fill={`url(#face-glow${idSuffix})`} /> : null}
      {/* shoulders */}
      <path d="M14 118 C14 96 34 90 60 90 C86 90 106 96 106 118 Z" fill={C.ink850} stroke={alpha(tone, 0.55)} strokeWidth={stroke - 1} strokeLinejoin="round" />
      {/* head */}
      <circle cx={60} cy={54} r={40} fill={C.ink800} stroke={tone} strokeWidth={stroke} />
      {/* eyes */}
      {mood === 'oops' ? (
        <>
          <circle cx={45} cy={eyeY} r={9} fill={C.textStrong} />
          <circle cx={75} cy={eyeY} r={9} fill={C.textStrong} />
          <circle cx={45} cy={eyeY} r={3.6} fill={C.ink950} />
          <circle cx={75} cy={eyeY} r={3.6} fill={C.ink950} />
        </>
      ) : (
        <>
          <circle cx={45} cy={eyeY} r={mood === 'puzzled' ? 6 : 5.5} fill={C.textStrong} />
          <circle cx={75} cy={eyeY} r={mood === 'puzzled' ? 6 : 5.5} fill={C.textStrong} />
          <circle cx={45 + look} cy={eyeY} r={2.6} fill={C.ink950} />
          <circle cx={75 + look} cy={eyeY} r={2.6} fill={C.ink950} />
        </>
      )}
      {/* brows */}
      {mood === 'knowing' ? (
        <>
          <path d="M36 42 L54 44" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" />
          <path d="M66 41 L84 36" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" />
        </>
      ) : mood === 'puzzled' ? (
        <>
          <path d="M36 40 L54 35" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" />
          <path d="M66 35 L84 40" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" />
        </>
      ) : mood === 'oops' ? (
        <>
          <path d="M36 37 Q45 31 54 37" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" fill="none" />
          <path d="M66 37 Q75 31 84 37" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M36 41 L54 41" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" />
          <path d="M66 41 L84 41" stroke={C.text} strokeWidth={3.4} strokeLinecap="round" />
        </>
      )}
      {/* mouth */}
      {mood === 'knowing' ? (
        <path d="M44 72 Q58 74 78 66" stroke={C.text} strokeWidth={3.6} strokeLinecap="round" fill="none" />
      ) : mood === 'puzzled' ? (
        <path d="M46 72 Q54 66 62 72 T78 70" stroke={C.text} strokeWidth={3.6} strokeLinecap="round" fill="none" />
      ) : mood === 'oops' ? (
        <ellipse cx={60} cy={71} rx={7} ry={8.5} fill={C.ink950} stroke={C.text} strokeWidth={3} />
      ) : (
        <path d="M46 70 Q60 78 74 70" stroke={C.text} strokeWidth={3.6} strokeLinecap="round" fill="none" />
      )}
      {mood === 'oops' ? <path d="M96 30 q7 11 0 17 q-7 -6 0 -17 Z" fill={C.sky} opacity={0.85} /> : null}
      {mood === 'puzzled' ? (
        <text x={92} y={30} fontSize={30} fontWeight={800} fill={alpha(C.text, 0.9)} fontFamily={FONT.sans}>
          ?
        </text>
      ) : null}
    </svg>
  );
}
