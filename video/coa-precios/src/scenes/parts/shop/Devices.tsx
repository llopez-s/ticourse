import { FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { G, INK, clamp01 } from './geom';

/** 0→1→0 at ≤ 1 Hz; `t` in seconds. */
const beat = (t: number, hz = 0.9) => 0.5 - 0.5 * Math.cos(2 * Math.PI * Math.min(1, hz) * t);

/**
 * The alarm: a siren box centred on (cx, cy), `size` wide. `on` 0–1 lights it cyan (0 = a dim outline),
 * `ring` 0–1 makes it sound: arcs on both sides and a halo, animated by `phase` (seconds). It warns
 * and does nothing else: no prop of this part stops anybody.
 */
export function AlarmBox({ cx, cy, size = 92, on = 1, ring = 0, phase = 0, opacity = 1 }: { cx: number; cy: number; size?: number; on?: number; ring?: number; phase?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const s = size / 92;
  const k = clamp01(on);
  const r = clamp01(ring);
  const edge = k > 0.5 ? INK.cyan : INK.line;
  const arcs = [0, 1, 2].map((i) => r * (0.3 + 0.7 * beat(phase - i * 0.16)));
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} opacity={opacity}>
      {r > 0.01 ? <circle cx={0} cy={0} r={52 + 10 * beat(phase)} fill={alpha(INK.cyan, 0.14 * r)} /> : null}
      {/* ring arcs */}
      <g fill="none" stroke={INK.cyan} strokeWidth={5} strokeLinecap="round">
        {arcs.map((a, i) => (
          <g key={i} opacity={a}>
            <path d={`M${-56 - i * 15} ${-20 - i * 6} Q${-66 - i * 17} 0 ${-56 - i * 15} ${20 + i * 6}`} />
            <path d={`M${56 + i * 15} ${-20 - i * 6} Q${66 + i * 17} 0 ${56 + i * 15} ${20 + i * 6}`} />
          </g>
        ))}
      </g>
      {/* box */}
      <rect x={-40} y={-30} width={80} height={62} rx={10} fill={k > 0.5 ? '#0b2a36' : INK.wallHi} stroke={edge} strokeWidth={4} />
      {/* beacon dome */}
      <path d="M-17 -30 A17 17 0 0 1 17 -30 Z" fill={alpha(INK.cyan, 0.25 + 0.75 * Math.max(r * beat(phase), 0.25 * k))} stroke={edge} strokeWidth={3.5} />
      {/* horn grille */}
      <circle cx={0} cy={4} r={17} fill={alpha(INK.cyan, 0.08 + 0.2 * r)} stroke={edge} strokeWidth={3.5} />
      <circle cx={0} cy={4} r={7} fill={k > 0.5 ? INK.cyan : INK.line} />
    </g>
  );
}

/** A camera on its own, lens at the origin looking down-left. Used by Camera and as a standalone glyph. */
export function CameraGlyph({ x, y, size = 96, on = 1, live = 0, phase = 0, opacity = 1 }: { x: number; y: number; size?: number; on?: number; live?: number; phase?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const s = size / 96;
  const k = clamp01(on);
  const edge = k > 0.5 ? INK.cyan : INK.line;
  const l = clamp01(live);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <g transform="rotate(-28)">
        <rect x={6} y={-20} width={84} height={40} rx={9} fill={k > 0.5 ? '#0b2a36' : INK.wallHi} stroke={edge} strokeWidth={4} />
        <rect x={-10} y={-14} width={20} height={28} rx={5} fill={INK.dark} stroke={edge} strokeWidth={4} />
        <circle cx={-2} cy={0} r={6} fill={k > 0.5 ? INK.cyan : INK.line} />
        {/* the «en directo» light */}
        {l > 0.01 ? <circle cx={72} cy={-6} r={7 + 2 * beat(phase)} fill={alpha(INK.cyan, 0.35 * l)} /> : null}
        <circle cx={72} cy={-6} r={4.5} fill={l > 0.5 ? '#a5f3fc' : INK.line} />
      </g>
    </g>
  );
}

/**
 * The live camera on the building's corner, watching the door. `on` 0–1 lights it cyan, `cone` 0–1
 * draws what it sees, `live` 0–1 turns on its small light, `label` 0–1 writes «en directo» beside it
 * (one of the two texts the shop may carry; the other is the tape's «ayer»).
 */
export function Camera({ on = 1, cone = 0, live = 0, label = 0, phase = 0, opacity = 1 }: { on?: number; cone?: number; live?: number; label?: number; phase?: number; opacity?: number }) {
  if (opacity <= 0.001) return null;
  const c = G.camera;
  const d = G.door;
  const v = clamp01(cone);
  const t = clamp01(label);
  return (
    <g opacity={opacity}>
      {v > 0.01 ? (
        <path d={`M${c.lens.x} ${c.lens.y} L${d.x - 6} ${G.ground} L${d.x + d.w + 60} ${G.ground} Z`} fill={alpha(INK.cyan, 0.1 * v)} stroke={alpha(INK.cyan, 0.4 * v)} strokeWidth={2} strokeDasharray="8 10" />
      ) : null}
      {/* bracket */}
      <path d={`M${c.x} ${c.y - 14} h26 v20`} fill="none" stroke={INK.line} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <CameraGlyph x={c.lens.x} y={c.lens.y} on={on} live={live} phase={phase} />
      {t > 0.01 ? (
        <g opacity={t}>
          <circle cx={G.live.x - 78} cy={G.live.y - 9} r={7} fill={INK.cyan} opacity={0.55 + 0.45 * beat(phase)} />
          <text x={G.live.x - 62} y={G.live.y} fontFamily={FONT.sans} fontSize={27} fontWeight={800} fill="#a5f3fc">
            en directo
          </text>
        </g>
      ) : null}
    </g>
  );
}
