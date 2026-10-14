import { alpha } from '../../../../../engine/src/theme/tokens';
import { G, INK, clamp01, lerp } from './geom';

/**
 * The roller shutter («la persiana»): `down` 0 = rolled up under the awning, 1 = on the ground, covering
 * window and door. `lit` 0–1 turns it emerald (DENY: it stopped the attempt before it started).
 */
export function Shutter({ down, lit = 0, opacity = 1 }: { down: number; lit?: number; opacity?: number }) {
  const d = clamp01(down);
  if (d <= 0.004 || opacity <= 0.001) return null;
  const s = G.shutter;
  const h = s.h * d;
  const k = clamp01(lit);
  const slat = k > 0.5 ? alpha(INK.emerald, 0.55) : alpha(INK.line, 0.9);
  const rows = Math.floor(h / 22);
  return (
    <g opacity={opacity}>
      <rect x={s.x} y={s.y} width={s.w} height={h} fill={k > 0.01 ? '#12332c' : '#1f2c44'} fillOpacity={0.97} />
      {k > 0.01 ? <rect x={s.x} y={s.y} width={s.w} height={h} fill={alpha(INK.emerald, 0.1 * k)} /> : null}
      <g stroke={slat} strokeWidth={2.5}>
        {Array.from({ length: rows }, (_, i) => (
          <line key={i} x1={s.x} x2={s.x + s.w} y1={s.y + h - 22 * (i + 1)} y2={s.y + h - 22 * (i + 1)} />
        ))}
      </g>
      {/* bottom bar and handle */}
      <rect x={s.x - 4} y={s.y + h - 14} width={s.w + 8} height={14} rx={4} fill={k > 0.5 ? INK.emerald : INK.line} />
      <rect x={s.x + s.w / 2 - 30} y={s.y + h - 30} width={60} height={9} rx={4} fill={k > 0.5 ? INK.emeraldSoft : INK.steel} opacity={d > 0.2 ? 1 : 0} />
      <rect x={s.x} y={s.y} width={s.w} height={h} fill="none" stroke={k > 0.01 ? alpha(INK.emerald, 0.4 + 0.6 * k) : INK.edge} strokeWidth={3 + 2 * k} />
    </g>
  );
}

/** A padlock, centred on (x, y), `size` wide. `fail` 0–1 swings the shackle open and turns it amber. */
export function LockGlyph({ x, y, size = 40, fail = 0, opacity = 1, tone = INK.emerald }: { x: number; y: number; size?: number; fail?: number; opacity?: number; tone?: string }) {
  if (opacity <= 0.001) return null;
  const f = clamp01(fail);
  const s = size / 40;
  const c = f > 0.5 ? INK.amber : tone;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <g transform={`rotate(${-38 * f} 11 -6)`}>
        <path d="M-11 -6 V-16 A11 11 0 0 1 11 -16 V-6" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" />
      </g>
      <rect x={-20} y={-8} width={40} height={32} rx={6} fill={f > 0.5 ? '#3a2606' : '#0c2b22'} stroke={c} strokeWidth={4} />
      <circle cx={0} cy={5} r={4.5} fill={c} />
      <rect x={-2} y={6} width={4} height={10} rx={2} fill={c} />
    </g>
  );
}

/**
 * The shop's door. `open` 0–1 swings the leaf on its right-hand hinges (1 = it stands open: a dark
 * doorway). `lock` 0–1 shows its padlock; `lockFail` 0–1 breaks it (amber, shackle open). `warn` 0–1
 * outlines the open doorway in amber (the single lock failed: nothing else is there).
 */
export function Door({ open = 0, lock = 0, lockFail = 0, warn = 0, lit = 0 }: { open?: number; lock?: number; lockFail?: number; warn?: number; lit?: number }) {
  const d = G.door;
  const o = clamp01(open);
  const inX = d.x + 6;
  const fullW = d.w - 12;
  const w = lerp(fullW, fullW * 0.2, o);
  const x = inX + fullW - w;
  const top = d.y + 6;
  const h = d.h - 6;
  const wn = clamp01(warn);
  return (
    <g>
      {wn > 0.01 ? <rect x={d.x} y={d.y} width={d.w} height={d.h} fill={alpha(INK.amber, 0.08 * wn)} stroke={alpha(INK.amber, 0.9 * wn)} strokeWidth={5} strokeDasharray="14 10" /> : null}
      {/* the leaf */}
      <rect x={x} y={top} width={w} height={h} rx={3} fill="#22324e" stroke={lit > 0.01 ? alpha(INK.emerald, 0.5 + 0.5 * lit) : INK.line} strokeWidth={3} />
      <rect x={x + w * 0.16} y={top + 22} width={w * 0.68} height={h * 0.42} rx={3} fill={alpha('#0a1322', 0.85)} stroke={alpha(INK.line, 0.7)} strokeWidth={2} />
      <rect x={x + w * 0.16} y={top + h * 0.56} width={w * 0.68} height={h * 0.34} rx={3} fill="none" stroke={alpha(INK.line, 0.5)} strokeWidth={2} />
      {/* handle */}
      <rect x={x + w * 0.08 - 3} y={top + h * 0.5 - 16} width={6} height={32} rx={3} fill={INK.steel} />
      <LockGlyph x={x + Math.max(18, w * 0.2)} y={top + h * 0.5 + 44} size={lerp(42, 34, o)} fail={lockFail} opacity={clamp01(lock)} />
    </g>
  );
}
