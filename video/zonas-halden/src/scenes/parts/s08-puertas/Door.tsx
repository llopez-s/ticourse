import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';

/**
 * s08's doors (only s08 uses them), seen from the corridor: a frame, a leaf hinged on the left
 * and, behind it, what the door keeps. Two kinds:
 *   - 'exit'   the emergency exit: a push bar; when it opens (`open` 0–1, the leaf swings away in
 *              perspective) daylight shows through: people can get out.
 *   - 'server' the server-room door: a narrow window with the racks' lights behind, a handle and,
 *              beside the frame, a badge reader whose light dies with the power. `lock` 0–1 drops a
 *              padlock on the leaf: it stays locked.
 * `power` 0–1 dims the leaf with the corridor. Nothing positions itself; the reader of the
 * server door overflows the box on the right (≈ 40 px).
 */
export function Door({
  w,
  h,
  kind,
  open = 0,
  lock = 0,
  power = 1,
  glow = 0,
  glowTone = C.cyan,
  icon = false,
}: {
  w: number;
  h: number;
  kind: 'exit' | 'server';
  open?: number;
  lock?: number;
  power?: number;
  glow?: number;
  glowTone?: string;
  /** Icon size: thicker strokes, no reader, no window detail. */
  icon?: boolean;
}) {
  const o = clamp01(open);
  const l = clamp01(lock);
  const pw = clamp01(power);
  const g = clamp01(glow);
  const fw = icon ? 6 : 10; // frame thickness
  const leafW = w - 2 * fw;
  const leafH = h - fw;
  const shade = 0.55 + 0.45 * pw; // leaf brightness with the lights
  const leafFill = kind === 'exit' ? '#2a3b58' : '#1c2638';
  const leafEdge = kind === 'exit' ? '#7c93b8' : '#64748b';
  const sw = icon ? 3 : 2.5;
  return (
    <div style={{ position: 'relative', width: w, height: h, filter: g > 0.01 ? `drop-shadow(0 0 ${Math.round(8 + 18 * g)}px ${alpha(glowTone, 0.65 * g)})` : undefined }}>
      {/* What is behind the door */}
      <div
        style={{
          position: 'absolute',
          left: fw,
          top: fw,
          width: leafW,
          height: leafH,
          overflow: 'hidden',
          background:
            kind === 'exit'
              ? `linear-gradient(180deg, ${alpha('#7dd3fc', 0.55)} 0%, ${alpha('#a7f3d0', 0.5)} 62%, ${alpha('#065f46', 0.85)} 63%, ${alpha('#064e3b', 0.9)} 100%)`
              : '#05080f',
        }}
      >
        {kind === 'exit' && !icon ? (
          <svg width={leafW} height={leafH} style={{ position: 'absolute', left: 0, top: 0 }}>
            {/* A path out, in daylight */}
            <path d={`M ${leafW * 0.3} ${leafH} L ${leafW * 0.46} ${leafH * 0.63} L ${leafW * 0.54} ${leafH * 0.63} L ${leafW * 0.7} ${leafH}`} fill={alpha('#ecfdf5', 0.35)} />
          </svg>
        ) : null}
      </div>
      {/* Daylight spilling into the corridor */}
      {kind === 'exit' && o > 0.01 && !icon ? (
        <div
          style={{
            position: 'absolute',
            left: -w * 0.3,
            top: h - 6,
            width: w * 1.6,
            height: 60,
            background: `radial-gradient(ellipse at 50% 0%, ${alpha('#a7f3d0', 0.45 * o)} 0%, ${alpha('#a7f3d0', 0)} 70%)`,
          }}
        />
      ) : null}
      {/* The leaf, hinged on the left */}
      <div style={{ position: 'absolute', left: fw, top: fw, width: leafW, height: leafH, perspective: w * 3 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: 'left center',
            // Opens outwards, away from the corridor: the free edge swings into the doorway.
            transform: `rotateY(${74 * o}deg)`,
            filter: `brightness(${shade})`,
          }}
        >
          <svg width={leafW} height={leafH} style={{ display: 'block' }}>
            <rect x={sw / 2} y={sw / 2} width={leafW - sw} height={leafH - sw} rx={4} fill={leafFill} stroke={leafEdge} strokeWidth={sw} />
            {kind === 'exit' ? (
              <>
                {/* Push bar */}
                <rect x={leafW * 0.1} y={leafH * 0.47} width={leafW * 0.8} height={icon ? 10 : 16} rx={icon ? 5 : 8} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={sw * 0.6} />
                <rect x={leafW * 0.1} y={leafH * 0.84} width={leafW * 0.8} height={leafH * 0.1} rx={3} fill={alpha('#94a3b8', 0.25)} />
              </>
            ) : (
              <>
                {/* Narrow window with the racks' lights */}
                <rect x={leafW * 0.58} y={leafH * 0.1} width={leafW * 0.22} height={leafH * 0.34} rx={3} fill="#060b16" stroke={leafEdge} strokeWidth={sw * 0.8} />
                {!icon
                  ? Array.from({ length: 6 }, (_, i) => (
                      <g key={i}>
                        <rect x={leafW * 0.61} y={leafH * (0.13 + i * 0.05)} width={leafW * 0.05} height={3} fill={i % 3 === 1 ? C.emerald : C.cyan} opacity={0.9} />
                        <rect x={leafW * 0.7} y={leafH * (0.13 + i * 0.05)} width={leafW * 0.05} height={3} fill={i % 2 ? C.cyan : C.emerald} opacity={0.7} />
                      </g>
                    ))
                  : null}
                {/* Handle */}
                <rect x={leafW * 0.8} y={leafH * 0.52} width={leafW * 0.12} height={icon ? 7 : 10} rx={4} fill="#94a3b8" />
              </>
            )}
          </svg>
        </div>
      </div>
      {/* Frame */}
      <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={`M ${fw / 2} ${h} L ${fw / 2} ${fw / 2} L ${w - fw / 2} ${fw / 2} L ${w - fw / 2} ${h}`} fill="none" stroke={kind === 'exit' ? '#94a3b8' : '#64748b'} strokeWidth={fw} strokeLinejoin="round" />
        {kind === 'server' && !icon ? (
          <g>
            {/* Badge reader beside the frame */}
            <rect x={w + 12} y={h * 0.38} width={26} height={44} rx={5} fill="#0f172a" stroke="#64748b" strokeWidth={2.5} />
            <circle cx={w + 25} cy={h * 0.38 + 12} r={5} fill={pw > 0.5 ? C.emerald : l > 0.5 ? C.rose : '#334155'} />
          </g>
        ) : null}
      </svg>
      {/* The padlock: it stays locked */}
      {l > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: w / 2 - (icon ? 26 : 46),
            top: h * (icon ? 0.42 : 0.4) - (icon ? 26 : 46),
            width: icon ? 52 : 92,
            height: icon ? 52 : 92,
            borderRadius: icon ? 26 : 46,
            display: 'grid',
            placeItems: 'center',
            background: alpha(C.ink950, 0.92),
            border: `${icon ? 3 : 4}px solid ${C.amber}`,
            boxShadow: `0 0 ${icon ? 12 : 26}px ${alpha(C.amber, 0.5)}`,
            opacity: Math.min(1, l * 1.5),
            transform: `scale(${1.4 - 0.4 * l})`,
          }}
        >
          <Icon name="lock" size={icon ? 30 : 54} color={C.amber} strokeWidth={2.6} />
        </div>
      ) : null}
    </div>
  );
}
