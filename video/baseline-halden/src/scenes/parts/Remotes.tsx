import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * Concept 2's everyday image: the living room's remotes. A TV on its stand and an air-conditioning unit on the wall,
 * each with its own remote aimed at it (emerald beam: it obeys). `cross` 0–1 draws the AC remote's beam aimed at the
 * TV, dashed amber and crossed out: the TV does not obey it. Never «sala de mandos».
 */
export const REMOTES_W = 640;
export const REMOTES_H = 270;

const TV = { x: 20, y: 30, w: 230, h: 140 } as const;
const AC = { x: 380, y: 22, w: 240, h: 74 } as const;
const TV_REMOTE = { x: 270, y: 196 } as const;
const AC_REMOTE = { x: 520, y: 196 } as const;

function Remote({ x, y, tone }: { x: number; y: number; tone: string }) {
  // A remote lying slanted, its tip (IR window) at (x, y) pointing up-left/up.
  return (
    <g transform={`translate(${x} ${y}) rotate(-28)`}>
      <rect x={-14} y={0} width={28} height={74} rx={10} fill={C.ink800} stroke={tone} strokeWidth={3} />
      <rect x={-7} y={4} width={14} height={6} rx={3} fill={tone} />
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => <circle key={`${r}${c}`} cx={-5 + c * 10} cy={26 + r * 13} r={3} fill={alpha(C.text, 0.5)} />),
      )}
    </g>
  );
}

function Beam({ from, to, color, draw, dashed = true }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; draw: number; dashed?: boolean }) {
  const d = clamp01(draw);
  if (d <= 0.01) return null;
  const x = from.x + (to.x - from.x) * d;
  const y = from.y + (to.y - from.y) * d;
  return <line x1={from.x} y1={from.y} x2={x} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={dashed ? '4 10' : undefined} />;
}

export function Remotes({
  width = REMOTES_W,
  tvIn = 1,
  acIn = 1,
  tvBeam = 1,
  acBeam = 1,
  cross = 0,
}: {
  width?: number;
  tvIn?: number;
  acIn?: number;
  tvBeam?: number;
  acBeam?: number;
  cross?: number;
}) {
  const tvTip = { x: TV_REMOTE.x - 2, y: TV_REMOTE.y - 2 };
  const acTip = { x: AC_REMOTE.x - 2, y: AC_REMOTE.y - 2 };
  const tvTarget = { x: TV.x + TV.w - 30, y: TV.y + TV.h - 24 };
  const acTarget = { x: AC.x + AC.w / 2 + 30, y: AC.y + AC.h + 4 };
  const crossTarget = { x: TV.x + TV.w - 6, y: TV.y + 54 };
  const c = clamp01(cross);
  const mid = { x: acTip.x + (crossTarget.x - acTip.x) * 0.55, y: acTip.y + (crossTarget.y - acTip.y) * 0.55 };
  return (
    <svg width={width} height={(width * REMOTES_H) / REMOTES_W} viewBox={`0 0 ${REMOTES_W} ${REMOTES_H}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* the TV */}
      <g opacity={clamp01(tvIn)}>
        <rect x={TV.x} y={TV.y} width={TV.w} height={TV.h} rx={10} fill={C.ink900} stroke={alpha(C.text, 0.75)} strokeWidth={4} />
        <rect x={TV.x + 12} y={TV.y + 12} width={TV.w - 24} height={TV.h - 24} rx={4} fill={alpha(C.cyan, 0.14)} />
        <rect x={TV.x + TV.w / 2 - 8} y={TV.y + TV.h} width={16} height={20} fill={alpha(C.text, 0.5)} />
        <rect x={TV.x + TV.w / 2 - 50} y={TV.y + TV.h + 18} width={100} height={8} rx={4} fill={alpha(C.text, 0.5)} />
      </g>
      {/* the air-conditioning unit */}
      <g opacity={clamp01(acIn)}>
        <rect x={AC.x} y={AC.y} width={AC.w} height={AC.h} rx={16} fill={C.ink850} stroke={alpha(C.text, 0.75)} strokeWidth={4} />
        {[0, 1, 2].map((i) => (
          <line key={i} x1={AC.x + 26} y1={AC.y + 46 + i * 8} x2={AC.x + AC.w - 26} y2={AC.y + 46 + i * 8} stroke={alpha(C.text, 0.35)} strokeWidth={3} strokeLinecap="round" />
        ))}
        <circle cx={AC.x + AC.w - 28} cy={AC.y + 20} r={5} fill={C.emerald} />
      </g>

      {/* each remote obeyed by its own device */}
      <Beam from={tvTip} to={tvTarget} color={C.emerald} draw={tvBeam} />
      <Beam from={acTip} to={acTarget} color={C.emerald} draw={acBeam} />
      {/* the AC remote aimed at the TV: no */}
      {c > 0.01 ? (
        <g opacity={c}>
          <Beam from={acTip} to={crossTarget} color={C.amber} draw={c} />
          <g transform={`translate(${mid.x} ${mid.y})`}>
            <circle r={22} fill={C.ink950} stroke={C.amber} strokeWidth={4} />
            <path d="M -9 -9 L 9 9 M 9 -9 L -9 9" stroke={C.amber} strokeWidth={5} strokeLinecap="round" />
          </g>
        </g>
      ) : null}
      <g opacity={clamp01(tvIn)}>
        <Remote x={TV_REMOTE.x} y={TV_REMOTE.y} tone={C.cyan} />
      </g>
      <g opacity={clamp01(acIn)}>
        <Remote x={AC_REMOTE.x} y={AC_REMOTE.y} tone={C.sky} />
      </g>
    </svg>
  );
}
