import { useCurrentFrame } from 'remotion';
import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { PORT_AREAS, STREET, type PortAreaId } from '../../../data/s02-garita';
import { Checkpoint, checkpointPoint, checkpointSize } from '../Checkpoint';

/**
 * s02's port seen from above: the street along the bottom and four fenced
 * areas above it (passenger terminal, offices, dock, Operations' control room
 * — the control room is just one more area). Each area's fence is two rails
 * with posts; its gate onto the street is the shared `Checkpoint` (scene look,
 * staffed), whose fence stubs line up with the area's bottom rails. Drawn in
 * stage px (1728 wide, 0–590 tall); nothing reads the timeline: the scene
 * passes every weight.
 */

export const PORT = {
  areaW: 380,
  gap: 36,
  top: 28,
  ckW: 320,
  ckTop: 369,
  street: { y: 498, h: 80 },
} as const;

const CK = checkpointSize(PORT.ckW);
/** The checkpoint's two rails (design y 182 and 226 in its 22-based gate crop). */
const RAIL_IN = PORT.ckTop + (182 - 22) * CK.scale;
const RAIL_OUT = PORT.ckTop + (226 - 22) * CK.scale;
const RAIL_GAP = RAIL_OUT - RAIL_IN;
const X0 = (1728 - (PORT_AREAS.length * PORT.areaW + (PORT_AREAS.length - 1) * PORT.gap)) / 2;
const FENCE = '#64748b';

/** Geometry of area `i` in stage px: box, checkpoint's left edge, and its road centre (where badges aim). */
export function portArea(i: number) {
  const x = X0 + i * (PORT.areaW + PORT.gap);
  const ckLeft = x + (PORT.areaW - PORT.ckW) / 2;
  const road = ckLeft + checkpointPoint(PORT.ckW, 'gate').x;
  const barrierY = PORT.ckTop + checkpointPoint(PORT.ckW, 'gate').y;
  return { x, y: PORT.top, w: PORT.areaW, bottom: RAIL_OUT, ckLeft, road, barrierY };
}

export function portAreaIndex(id: PortAreaId): number {
  return PORT_AREAS.findIndex((a) => a.id === id);
}

/** Fence as two rails with posts across them; the bottom side is broken where the checkpoint sits. */
function fencePath(i: number): { rails: string; posts: string; len: number } {
  const a = portArea(i);
  const g = RAIL_GAP;
  const L = a.x;
  const R = a.x + a.w;
  const T = a.y;
  const B = a.bottom;
  const cL = a.ckLeft + 4;
  const cR = a.ckLeft + PORT.ckW - 4;
  const outer = `M ${cL} ${B} L ${L} ${B} L ${L} ${T} L ${R} ${T} L ${R} ${B} L ${cR} ${B}`;
  const inner = `M ${cL} ${B - g} L ${L + g} ${B - g} L ${L + g} ${T + g} L ${R - g} ${T + g} L ${R - g} ${B - g} L ${cR} ${B - g}`;
  const posts: string[] = [];
  const step = 34;
  for (let x = L + step; x < R - step / 2; x += step) posts.push(`M ${x} ${T - 4} L ${x} ${T + g + 4}`);
  for (let y = T + step; y < B - step / 2; y += step) {
    posts.push(`M ${L - 4} ${y} L ${L + g + 4} ${y}`);
    posts.push(`M ${R + 4} ${y} L ${R - g - 4} ${y}`);
  }
  for (let x = L + step; x < cL - 6; x += step) posts.push(`M ${x} ${B + 4} L ${x} ${B - g - 4}`);
  for (let x = R - step; x > cR + 6; x -= step) posts.push(`M ${x} ${B + 4} L ${x} ${B - g - 4}`);
  const len = 2 * (B - T) + (R - L) + (cL - L) + (R - cR);
  return { rails: `${outer} ${inner}`, posts: posts.join(' '), len };
}

/** The dock: a strip of water at the far edge and two rows of containers (pictogram, no labels). */
function Containers({ cx, cy }: { cx: number; cy: number }) {
  const cw = 78;
  const ch = 36;
  const tones = ['#334155', '#3b4a63', '#2b3b55'];
  return (
    <g>
      {[0, 1].map((r) =>
        [0, 1, 2].map((c) => {
          const x = cx - (3 * cw + 2 * 8) / 2 + c * (cw + 8);
          const y = cy - ch - 4 + r * (ch + 8);
          return (
            <g key={`${r}${c}`}>
              <rect x={x} y={y} width={cw} height={ch} rx={3} fill={tones[(r + c) % 3]} stroke={C.muted} strokeWidth={2.4} />
              {[1, 2, 3, 4].map((k) => (
                <line key={k} x1={x + (k * cw) / 5} y1={y + 6} x2={x + (k * cw) / 5} y2={y + ch - 6} stroke={alpha(C.muted, 0.5)} strokeWidth={1.6} />
              ))}
            </g>
          );
        }),
      )}
    </g>
  );
}

export function PortMap({
  settle = 1,
  fence = [1, 1, 1, 1],
  gates = [1, 1, 1, 1],
  barrier = [0, 0, 0, 0],
  gateGlow = [0, 0, 0, 0],
  tint = 0,
  focus = {},
  frame: frameProp,
}: {
  /** 0–1: the ground plan (street, area tiles, names, pictograms). */
  settle?: number;
  /** 0–1 per area: its fence draws. */
  fence?: number[];
  /** 0–1 per area: its checkpoint pops in. */
  gates?: number[];
  /** 0–1 per area: barrier raised. */
  barrier?: number[];
  gateGlow?: number[];
  /** 0–1: every area's inside takes one even tint («misma confianza dentro»). */
  tint?: number;
  /** 0–1 per area: its name lights (the voice names it). */
  focus?: Partial<Record<PortAreaId, number>>;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameProp ?? current;
  const st = clamp01(settle);
  const tn = clamp01(tint);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 600, opacity: st }}>
      <svg width={1728} height={600} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* The street */}
        <rect x={0} y={PORT.street.y} width={1728} height={PORT.street.h} fill={C.ink850} />
        <path d={`M 0 ${PORT.street.y} L 1728 ${PORT.street.y} M 0 ${PORT.street.y + PORT.street.h} L 1728 ${PORT.street.y + PORT.street.h}`} stroke="#334155" strokeWidth={3} />
        <line x1={160} y1={PORT.street.y + PORT.street.h / 2} x2={1728} y2={PORT.street.y + PORT.street.h / 2} stroke="#334155" strokeWidth={3} strokeDasharray="26 22" />
        {PORT_AREAS.map((area, i) => {
          const a = portArea(i);
          const g = RAIL_GAP;
          const f = fencePath(i);
          const fp = clamp01(fence[i] ?? 1);
          return (
            <g key={area.id}>
              {/* Ground inside the fence (and the even tint) */}
              <rect x={a.x + g} y={a.y + g} width={a.w - 2 * g} height={a.bottom - a.y - 2 * g} rx={6} fill={alpha(C.ink800, 0.55)} />
              {tn > 0.01 ? (
                <rect x={a.x + g} y={a.y + g} width={a.w - 2 * g} height={a.bottom - a.y - 2 * g} rx={6} fill={alpha(C.sky, 0.13 * tn)} stroke={alpha(C.sky, 0.55 * tn)} strokeWidth={2} />
              ) : null}
              {/* Fence */}
              {fp > 0.01 ? (
                <g fill="none" stroke={FENCE} strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.rails} strokeWidth={2.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - fp} />
                  <path d={f.posts} strokeWidth={3.4} opacity={clamp01((fp - 0.4) / 0.6)} />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      {/* «calle» on the street */}
      <div style={{ position: 'absolute', left: 22, top: PORT.street.y, height: PORT.street.h, display: 'flex', alignItems: 'center', fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.muted, letterSpacing: 0.5 }}>{STREET}</div>
      {/* Names and pictograms */}
      {PORT_AREAS.map((area, i) => {
        const a = portArea(i);
        const lit = clamp01(focus[area.id] ?? 0);
        const midY = a.y + 228;
        return (
          <div key={area.id}>
            <div
              style={{
                position: 'absolute',
                left: a.x,
                top: a.y + RAIL_GAP + 18,
                width: a.w,
                textAlign: 'center',
                fontFamily: FONT.sans,
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.1,
                color: lit > 0.05 ? C.textStrong : C.text,
                textShadow: lit > 0.05 ? `0 0 ${Math.round(18 * lit)}px ${alpha(C.cyan, 0.6 * lit)}` : undefined,
              }}
            >
              {area.name.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            {area.icon === 'containers' ? (
              <svg width={1728} height={600} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <Containers cx={a.x + a.w / 2} cy={midY} />
              </svg>
            ) : (
              <div style={{ position: 'absolute', left: a.x + a.w / 2 - 48, top: midY - 48 }}>
                <Icon name={area.icon} size={96} color={alpha(C.muted, 0.9)} strokeWidth={1.8} />
              </div>
            )}
          </div>
        );
      })}
      {/* Checkpoints at each gate */}
      {PORT_AREAS.map((area, i) => {
        const a = portArea(i);
        const gp = clamp01(gates[i] ?? 1);
        if (gp <= 0.01) return null;
        return (
          <div key={area.id} style={{ position: 'absolute', left: a.ckLeft, top: PORT.ckTop, opacity: Math.min(1, gp * 1.5), transform: `scale(${0.86 + 0.14 * gp})`, transformOrigin: '50% 70%' }}>
            <Checkpoint width={PORT.ckW} state="powered" barrier={clamp01(barrier[i] ?? 0)} glow={clamp01(gateGlow[i] ?? 0)} frame={frame} />
          </div>
        );
      })}
    </div>
  );
}

export const PORT_CK_H = CK.h;
