import { useId } from 'react';
import type { ReactNode } from 'react';
import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { Camera } from '../Camera';

/** The entrance picture's own units (every child drawn into it uses them). */
export const DEPOT_W = 600;
export const DEPOT_H = 480;
/** Ground line where the figure walks (front of the picture). */
export const DEPOT_GROUND = 452;
/** The camera on the entrance post, in picture units (variant 'a'). */
export const DEPOT_CAMERA = { x: 296, y: 146, width: 140 } as const;
/** The camera's lens in picture units (variant 'a'), to aim a sight line at it. */
export const DEPOT_LENS = { x: DEPOT_CAMERA.x + DEPOT_CAMERA.width * 0.917, y: DEPOT_CAMERA.y + DEPOT_CAMERA.width * 0.62 * 0.737 } as const;

type Mode = 'night' | 'day';

const PALETTE: Record<Mode, { skyTop: string; skyBottom: string; ground: string; mark: string; box: [string, string, string]; line: string; far: string }> = {
  night: {
    skyTop: '#050913',
    skyBottom: '#0f1a30',
    ground: '#0b1220',
    mark: alpha('#94a3b8', 0.28),
    box: ['#123447', '#0f2a3d', '#16405a'],
    line: alpha('#67e8f9', 0.16),
    far: '#0c1d2e',
  },
  day: {
    skyTop: '#3b5585',
    skyBottom: '#8aa4c8',
    ground: '#334155',
    mark: alpha('#e2e8f0', 0.45),
    box: ['#1f6f8b', '#17597a', '#2a85a3'],
    line: alpha('#e0f7ff', 0.22),
    far: '#4a6a8c',
  },
};

/** One container seen from the side: corrugated wall, top and bottom rails. */
function Container({ x, y, w, h, fill, line }: { x: number; y: number; w: number; h: number; fill: string; line: string }) {
  const ribs: number[] = [];
  for (let rx = x + 14; rx < x + w - 10; rx += 14) ribs.push(rx);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={alpha('#000000', 0.45)} strokeWidth={2} />
      {ribs.map((rx) => (
        <line key={rx} x1={rx} x2={rx} y1={y + 8} y2={y + h - 8} stroke={line} strokeWidth={3} />
      ))}
      <rect x={x} y={y} width={w} height={7} fill={alpha('#000000', 0.25)} />
      <rect x={x} y={y + h - 7} width={w} height={7} fill={alpha('#000000', 0.3)} />
    </g>
  );
}

/**
 * A plain silhouette (no face, no clothing details) standing on `ground` at `x`, in picture units. `walk` is the
 * walking phase in cycles (0 = standing still); `facing` only tilts the head and the swing, so the turn reads.
 */
export function Figure({
  x,
  ground = DEPOT_GROUND,
  facing,
  walk = 0,
  height = 132,
  tone = '#a3b1c4',
  opacity = 1,
}: {
  x: number;
  ground?: number;
  facing: 'left' | 'right';
  walk?: number;
  height?: number;
  tone?: string;
  opacity?: number;
}) {
  if (opacity < 0.01) return null;
  const s = height / 132;
  const dir = facing === 'left' ? -1 : 1;
  const swing = walk === 0 ? 0 : Math.sin(walk * 2 * Math.PI) * 20;
  const bob = walk === 0 ? 0 : Math.abs(Math.sin(walk * 2 * Math.PI)) * 2.5;
  return (
    <g transform={`translate(${x} ${ground - bob * s}) scale(${dir * s} ${s})`} opacity={opacity}>
      {/* legs */}
      <g transform="translate(0 -58)">
        <rect x={-6} y={0} width={12} height={58} rx={6} fill={tone} transform={`rotate(${swing})`} />
        <rect x={-6} y={0} width={12} height={58} rx={6} fill={alpha(tone, 0.8)} transform={`rotate(${-swing})`} />
      </g>
      {/* torso, arm, head with a small forward nose so the facing reads */}
      <rect x={-15} y={-112} width={30} height={60} rx={14} fill={tone} />
      <rect x={-5} y={-106} width={10} height={46} rx={5} fill={alpha('#000000', 0.18)} transform={`rotate(${-swing * 0.8} 0 -104)`} />
      <circle cx={2} cy={-123} r={12} fill={tone} />
      <path d="M 12 -126 L 17 -121 L 12 -118 Z" fill={tone} />
    </g>
  );
}

/**
 * The entrance of the empty-container depot: two stacks of containers with the lane between them, the camera on
 * a post at the lane's side, a far row inside the yard. No fence, no booth, no floodlight (occupied images).
 * `variant` 'b' is ANOTHER entrance (s05): mirrored, a three-high stack, the camera's housing passed through.
 * `children` are drawn on top in picture units (a figure, a sight line…). Night has a moon and a few stars.
 */
export function DepotEntrance({
  width,
  mode,
  variant = 'a',
  cameraEmpty = false,
  cameraGlow = 0,
  cameraLight = 1,
  children,
}: {
  width: number;
  mode: Mode;
  variant?: 'a' | 'b';
  cameraEmpty?: boolean;
  cameraGlow?: number;
  cameraLight?: number;
  children?: ReactNode;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const p = PALETTE[mode];
  const h = (width * DEPOT_H) / DEPOT_W;
  const mirror = variant === 'b';
  return (
    <svg width={width} height={h} viewBox={`0 0 ${DEPOT_W} ${DEPOT_H}`} style={{ display: 'block', overflow: 'hidden' }}>
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="100%" stopColor={p.skyBottom} />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <rect x={0} y={0} width={DEPOT_W} height={DEPOT_H} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${uid})`}>
        <rect x={0} y={0} width={DEPOT_W} height={DEPOT_H} fill={`url(#sky-${uid})`} />
        {mode === 'night' ? (
          <g>
            {[
              [60, 40],
              [150, 78],
              [232, 30],
              [420, 52],
              [520, 92],
              [560, 26],
              [350, 96],
            ].map(([sx, sy]) => (
              <circle key={`${sx}-${sy}`} cx={sx} cy={sy} r={1.8} fill={alpha('#e2e8f0', 0.6)} />
            ))}
            <circle cx={mirror ? 120 : 480} cy={70} r={22} fill={alpha('#e2e8f0', 0.85)} />
            <circle cx={mirror ? 131 : 491} cy={63} r={20} fill={p.skyTop} />
          </g>
        ) : null}
        <g transform={mirror ? `translate(${DEPOT_W} 0) scale(-1 1)` : undefined}>
          {/* the yard behind the lane: a far, lower row */}
          <rect x={250} y={318} width={190} height={56} fill={p.far} stroke={alpha('#000000', 0.35)} strokeWidth={2} />
          <rect x={250} y={270} width={120} height={48} fill={p.far} stroke={alpha('#000000', 0.35)} strokeWidth={2} />
          {/* ground and the lane's markings */}
          <rect x={0} y={374} width={DEPOT_W} height={DEPOT_H - 374} fill={p.ground} />
          <path d="M 312 374 L 300 480 M 378 374 L 400 480" stroke={p.mark} strokeWidth={4} fill="none" />
          <path d="M 345 380 L 346 400 M 347 416 L 348 440 M 349 456 L 350 480" stroke={p.mark} strokeWidth={4} fill="none" />
          {/* left stack */}
          <Container x={-20} y={286} w={300} h={90} fill={p.box[0]} line={p.line} />
          <Container x={-40} y={196} w={300} h={90} fill={p.box[1]} line={p.line} />
          {mirror ? <Container x={-10} y={106} w={270} h={90} fill={p.box[2]} line={p.line} /> : null}
          {/* right stack */}
          <Container x={410} y={286} w={230} h={90} fill={p.box[2]} line={p.line} />
          <Container x={430} y={196} w={210} h={90} fill={p.box[0]} line={p.line} />
          {/* the open, empty container at the lane's mouth */}
          <g transform="translate(410 286)">
            <rect x={0} y={9} width={44} height={72} fill="#03060c" />
            <path d="M 0 6 L -22 14 L -22 76 L 0 84 Z" fill={p.box[2]} stroke={alpha('#000000', 0.45)} strokeWidth={2} />
            <line x1={-11} x2={-11} y1={18} y2={72} stroke={p.line} strokeWidth={3} />
          </g>
          {/* the camera's post at the lane's side */}
          <rect x={286} y={DEPOT_CAMERA.y + 6} width={12} height={374 - DEPOT_CAMERA.y + 4} rx={3} fill={mode === 'night' ? '#2b3647' : '#475569'} stroke={alpha('#000000', 0.4)} strokeWidth={2} />
          <g transform={`translate(${DEPOT_CAMERA.x} ${DEPOT_CAMERA.y})`}>
            <Camera width={DEPOT_CAMERA.width} empty={cameraEmpty} glow={cameraGlow} light={cameraLight} />
          </g>
        </g>
        {children}
      </g>
    </svg>
  );
}

/**
 * «La grabación cuenta qué pasó», with no recorder: a playback frame (a picture of last night's entrance with the
 * figure, a play mark and a progress bar). No timestamp, no date. `t` (0–1) is the playback position: the
 * figure approaches and turns back as it runs.
 */
export function Playback({ width, t }: { width: number; t: number }) {
  const h = width * 0.66;
  const pad = width * 0.04;
  const picW = width - 2 * pad;
  const picH = (picW * DEPOT_H) / DEPOT_W;
  const fig = playbackFigure(t);
  return (
    <div
      style={{
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: width * 0.05,
        background: C.ink950,
        border: `3px solid ${alpha(C.cyan, 0.7)}`,
        boxShadow: `0 10px 30px ${alpha('#000000', 0.5)}, 0 0 0 6px ${alpha(C.cyan, 0.08)}`,
        padding: pad,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: picW, height: Math.min(picH, h - 2 * pad - width * 0.1), overflow: 'hidden', borderRadius: width * 0.02 }}>
        <DepotEntrance width={picW} mode="night">
          <Figure x={fig.x} facing={fig.facing} walk={fig.walk} />
        </DepotEntrance>
      </div>
      {/* play mark + progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: width * 0.04, marginTop: width * 0.025 }}>
        <svg width={width * 0.06} height={width * 0.06} viewBox="0 0 10 10" style={{ flex: 'none' }}>
          <path d="M 1.5 1 L 9 5 L 1.5 9 Z" fill={C.cyanSoft} />
        </svg>
        <div style={{ position: 'relative', flex: 1, height: width * 0.022, borderRadius: 99, background: alpha(C.muted, 0.3) }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, t)) * 100}%`, borderRadius: 99, background: C.cyan }} />
        </div>
      </div>
    </div>
  );
}

/** Where the figure is at playback position t: in from the right, a pause under the camera, and back out. */
export function playbackFigure(t: number): { x: number; facing: 'left' | 'right'; walk: number } {
  const k = Math.max(0, Math.min(1, t));
  const FAR = 660;
  const NEAR = 470;
  if (k < 0.42) {
    const u = k / 0.42;
    return { x: FAR - (FAR - NEAR) * u, facing: 'left', walk: u * 3 };
  }
  if (k < 0.58) return { x: NEAR, facing: k < 0.52 ? 'left' : 'right', walk: 0 };
  const u = (k - 0.58) / 0.42;
  return { x: NEAR + (FAR - NEAR) * u, facing: 'right', walk: u * 3 };
}
