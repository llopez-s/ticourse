import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';
import { CloudShape } from './Cloud';
import { Phone } from './Phone';

/** Each silhouette lives in a square box of this many units. */
export const SIL = 300;
export type SilKind = 'server' | 'cloud' | 'phone';
export const SIL_KINDS: readonly SilKind[] = ['server', 'cloud', 'phone'];

/** The rose crack of each silhouette, in box units (drawn with `crack` 0–1). */
const CRACKS: Record<SilKind, string> = {
  server: 'M 236 34 L 206 92 L 228 118 L 186 176 L 204 200 L 170 262',
  cloud: 'M 190 66 L 172 110 L 196 132 L 160 178 L 178 196 L 150 236',
  phone: 'M 196 38 L 162 104 L 186 128 L 140 192 L 160 214 L 124 268',
};

/** The shared server: a rack with three machines inside (no names), as a silhouette. */
function RackGlyph({ tone }: { tone: string }) {
  const slabs = [44, 116, 188];
  return (
    <g>
      <rect x={60} y={20} width={180} height={262} rx={18} fill={C.ink850} stroke={alpha(tone, 0.75)} strokeWidth={5} />
      {slabs.map((y, k) => (
        <g key={y}>
          <rect x={80} y={y} width={140} height={56} rx={10} fill={alpha(tone, 0.12)} stroke={alpha(tone, 0.6)} strokeWidth={3} />
          <rect x={94} y={y + 14} width={60} height={10} rx={5} fill={alpha(tone, 0.45)} />
          <rect x={94} y={y + 32} width={40} height={8} rx={4} fill={alpha(tone, 0.28)} />
          <circle cx={202} cy={y + 28} r={6} fill={alpha(k === 1 ? C.emerald : tone, 0.75)} />
        </g>
      ))}
      <rect x={60} y={258} width={180} height={10} fill={alpha(C.sky, 0.5)} />
    </g>
  );
}

/**
 * One of the video's three silhouettes — the shared server, the cloud, the phone — in a SIL×SIL box, drawn at `size`
 * px. `crack` 0–1 draws its rose crack (where the failure was born); `glow` lights it.
 */
export function Silhouette({ kind, size, crack = 0, glow = 0 }: { kind: SilKind; size: number; crack?: number; glow?: number }) {
  const s = size / SIL;
  const cr = clamp01(crack);
  const tone = kind === 'cloud' ? C.sky : C.cyan;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {kind === 'cloud' ? (
        <div style={{ position: 'absolute', left: 10 * s, top: 64 * s }}>
          <CloudShape width={280 * s} glow={glow} />
        </div>
      ) : null}
      {kind === 'phone' ? (
        <div style={{ position: 'absolute', left: 75 * s, top: 12 * s }}>
          <Phone width={150 * s} glow={glow} />
        </div>
      ) : null}
      <svg width={size} height={size} viewBox={`0 0 ${SIL} ${SIL}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {kind === 'server' ? (
          <>
            {glow > 0.02 ? <rect x={48} y={8} width={204} height={286} rx={24} fill={alpha(tone, 0.12 * glow)} /> : null}
            <RackGlyph tone={tone} />
          </>
        ) : null}
        {cr > 0.01 ? (
          <>
            <path d={CRACKS[kind]} fill="none" stroke={alpha(C.rose, 0.35)} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${cr} 1`} />
            <path d={CRACKS[kind]} fill="none" stroke={C.rose} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${cr} 1`} />
          </>
        ) : null}
      </svg>
    </div>
  );
}
