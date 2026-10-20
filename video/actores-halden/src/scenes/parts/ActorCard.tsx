import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The six actors, in pairs: I fuera y con poco, II fuera y con mucho, III ya dentro. Names in English, as on the exam. */
export const ACTORS = [
  { name: ['Hacktivist'], pair: 0 },
  { name: ['Unskilled', 'attacker'], pair: 0 },
  { name: ['Organized', 'crime'], pair: 1 },
  { name: ['Nation-state'], pair: 1 },
  { name: ['Insider', 'threat'], pair: 2 },
  { name: ['Shadow IT'], pair: 2 },
] as const;

/** One colour per pair (amber · rose · sky), the same in s01, the end card and the poster. */
export const PAIR_TONES = [C.amber, C.rose, C.sky] as const;

/**
 * One actor card. `flip` 0 = face down (a «?» on the dark back), 1 = face up (a band in the pair's colour and the
 * name); the card turns around its vertical axis. `w`/`h` may be animated (a portrait card on the table, a landscape one
 * once the pairs line up); `size` is the name's font size. `glow` 0–1 lights the border (the voice is on its pair).
 */
export function ActorCard({
  index,
  w,
  h,
  flip = 1,
  glow = 0,
  size = 32,
  dim = 0,
}: {
  index: number;
  w: number;
  h: number;
  flip?: number;
  glow?: number;
  size?: number;
  /** 0–1: steps the card back (another pair is in focus). */
  dim?: number;
}) {
  const actor = ACTORS[index];
  const tone = PAIR_TONES[actor.pair];
  const f = clamp01(flip);
  const sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * f)));
  const front = f >= 0.5;
  const g = clamp01(glow);
  const landscape = w > h * 1.6;
  return (
    <div
      style={{
        width: w,
        height: h,
        transform: `scaleX(${sx})`,
        opacity: 1 - 0.55 * clamp01(dim),
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${front ? alpha(tone, 0.55 + 0.45 * g) : C.ink600}`,
        background: front ? `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)` : C.ink850,
        boxShadow: front && g > 0.02 ? `0 0 ${Math.round(28 * g)}px ${alpha(tone, 0.35 * g)}` : `0 10px 24px ${alpha('#000000', 0.35)}`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT.sans,
      }}
    >
      {front ? (
        <>
          {/* The pair's band: on top of a portrait card, on the left of a landscape one */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: landscape ? 14 : '100%',
              height: landscape ? '100%' : 14,
              background: tone,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              paddingLeft: landscape ? 14 : 0,
              display: 'flex',
              flexDirection: landscape ? 'row' : 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: landscape ? '0 0.3em' : 0,
              fontSize: size,
              fontWeight: 850,
              lineHeight: 1.12,
              color: C.textStrong,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {actor.name.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </>
      ) : (
        <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={10} y={10} width={w - 26} height={h - 26} rx={10} fill="none" stroke={alpha(C.muted, 0.25)} strokeWidth={2} strokeDasharray="6 8" />
          <text
            x={w / 2 - 3}
            y={h / 2 + Math.min(w, h) * 0.17}
            textAnchor="middle"
            fontFamily={FONT.sans}
            fontWeight={900}
            fontSize={Math.min(w, h) * 0.5}
            fill={alpha(C.muted, 0.45)}
          >
            ?
          </text>
        </svg>
      )}
    </div>
  );
}
