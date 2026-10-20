import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, mix } from '../../../../engine/src/ui';

/** A magnetic hard drive's own units (top view). */
export const HDD = { w: 200, h: 260 } as const;

const STRIPS = 6;

/** The drive's insides (case, platter, arm); drawn once and clipped into strips when shredded. */
function HddBody({ tone, broken, wipe }: { tone: string; broken: number; wipe: number }) {
  const w = clamp01(wipe);
  return (
    <>
      <rect x={4} y={4} width={HDD.w - 8} height={HDD.h - 8} rx={14} fill={C.ink700} stroke={tone} strokeWidth={4} />
      {[18, HDD.w - 18].map((x) => [18, HDD.h - 18].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={5} fill={alpha(C.text, 0.4)} />))}
      {/* platter */}
      <circle cx={100} cy={104} r={78} fill={C.ink800} stroke={alpha(C.text, 0.35)} strokeWidth={3} />
      {[60, 44, 28].map((r) => (
        <circle key={r} cx={100} cy={104} r={r} fill="none" stroke={alpha(C.text, 0.12)} strokeWidth={2} />
      ))}
      {/* the overwrite: rings fill the platter, emerald */}
      {w > 0.01 ? (
        <circle cx={100} cy={104} r={78 * w} fill={alpha(C.emerald, 0.28)} stroke={alpha(C.emerald, 0.9)} strokeWidth={3} />
      ) : null}
      <circle cx={100} cy={104} r={14} fill={C.ink600} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      {/* actuator arm */}
      <path d={`M 160 222 L ${mix(118, 150, w)} ${mix(130, 70, w)}`} stroke={alpha(C.text, 0.6)} strokeWidth={8} strokeLinecap="round" />
      <circle cx={160} cy={222} r={14} fill={C.ink600} stroke={alpha(C.text, 0.5)} strokeWidth={3} />
      <rect x={24} y={206} width={70} height={30} rx={5} fill={alpha(C.text, 0.12)} />
      {/* the crack of the broken one */}
      {broken > 0.01 ? (
        <path
          d="M 52 30 L 78 72 L 66 96 L 104 128 L 92 160 L 128 196"
          fill="none"
          stroke={C.rose}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={clamp01(broken)}
        />
      ) : null}
    </>
  );
}

/**
 * A magnetic hard drive from above (s06: the two inside the network disk). `broken` 0–1 draws a rose crack; `wipe` 0–1
 * fills the platter with the verified overwrite (emerald); `shred` 0–1 cuts it into strips that fall and spread
 * (destruction). No brand, no label, no serial.
 */
export function HardDrive({
  width = HDD.w,
  tone = alpha(C.sky, 0.8),
  broken = 0,
  wipe = 0,
  shred = 0,
  id,
}: {
  width?: number;
  tone?: string;
  broken?: number;
  wipe?: number;
  shred?: number;
  /** Unique per instance (clip ids). */
  id: string;
}) {
  const s = clamp01(shred);
  const sw = HDD.w / STRIPS;
  return (
    <svg width={width} height={(width * HDD.h) / HDD.w} viewBox={`0 0 ${HDD.w} ${HDD.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {s < 0.01 ? (
        <HddBody tone={tone} broken={broken} wipe={wipe} />
      ) : (
        <>
          <defs>
            {Array.from({ length: STRIPS }, (_, k) => (
              <clipPath key={k} id={`${id}-strip-${k}`}>
                <rect x={k * sw} y={-10} width={sw - 2} height={HDD.h + 20} />
              </clipPath>
            ))}
          </defs>
          {Array.from({ length: STRIPS }, (_, k) => {
            const dx = (k - (STRIPS - 1) / 2) * 12 * s;
            const dy = s * (8 + ((k * 7) % 18));
            const rot = s * ((k % 2 === 0 ? -1 : 1) * (3 + ((k * 13) % 5)));
            return (
              <g key={k} transform={`translate(${dx} ${dy}) rotate(${rot} ${k * sw + sw / 2} 0)`} opacity={1 - 0.35 * s}>
                <g clipPath={`url(#${id}-strip-${k})`}>
                  <HddBody tone={tone} broken={broken} wipe={0} />
                </g>
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

/** A solid-state disk from above: a flat case with chips and no label (s07's box). */
export function Ssd({ width = 150 }: { width?: number }) {
  return (
    <svg width={width} height={width * 0.7} viewBox="0 0 150 105" style={{ display: 'block', overflow: 'visible' }}>
      <rect x={3} y={3} width={144} height={99} rx={10} fill={C.ink700} stroke={alpha(C.sky, 0.6)} strokeWidth={3} />
      <rect x={26} y={24} width={98} height={40} rx={6} fill={alpha(C.text, 0.1)} stroke={alpha(C.text, 0.2)} strokeWidth={2} />
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <rect key={k} x={36 + k * 12} y={82} width={6} height={14} rx={1} fill={alpha(C.amber, 0.45)} />
      ))}
    </svg>
  );
}
