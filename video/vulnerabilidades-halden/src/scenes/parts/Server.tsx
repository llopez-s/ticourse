import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The server schematic in its own units: VM boxes over the hypervisor bar over the hardware base. */
export const SERVER = { w: 760, h: 250 } as const;
const VM_Y = 18;
const VM_H = 124;
const PAD = 28;
const GAP = 26;
export const HV = { x: 14, y: 158, w: SERVER.w - 28, h: 48 } as const;
const HW = { x: 0, y: 214, w: SERVER.w, h: 32 } as const;

/** Rectangle of VM `i` of `n` (server units). */
export function vmRect(i: number, n: number): { x: number; y: number; w: number; h: number } {
  const w = (SERVER.w - 2 * PAD - (n - 1) * GAP) / n;
  return { x: PAD + i * (w + GAP), y: VM_Y, w, h: VM_H };
}

export interface VmSpec {
  /** Box colour (cyan by default). */
  tone?: string;
  /** 0–1: how present the VM is (a retired VM fades to a dashed outline). */
  show?: number;
  dashed?: boolean;
  /** Small caption inside the box («de baja», «nueva»). */
  label?: string;
  /** 0–1 glow (the voice is on it). */
  glow?: number;
}

/**
 * A server in schematic: `vms` boxes (screen bars, no names) sitting on the hypervisor bar, labelled «hipervisor» in
 * sky (the wall between flats of the rental building), on a hardware base with status dots. `hvGlow` lights the bar;
 * `hvCrack` draws a rose crack across it; `hvFlicker` (0–1) shakes and flashes it once (the glitch on `cross`).
 * `children` are drawn on top in server units (arrows, disks).
 */
export function Server({
  width = SERVER.w,
  vms,
  hvLabel = true,
  hvGlow = 0,
  hvCrack = 0,
  hvFlicker = 0,
  children,
}: {
  width?: number;
  vms: VmSpec[];
  hvLabel?: boolean;
  hvGlow?: number;
  hvCrack?: number;
  hvFlicker?: number;
  children?: ReactNode;
}) {
  const h = (width * SERVER.h) / SERVER.w;
  const g = clamp01(hvGlow);
  const fl = clamp01(hvFlicker);
  // One sharp jolt and a fading flash; never a strobe.
  const shake = fl > 0 && fl < 1 ? Math.sin(fl * Math.PI * 3) * 7 * (1 - fl) : 0;
  const flash = fl > 0 && fl < 1 ? (1 - fl) * 0.8 : 0;
  const crack = clamp01(hvCrack);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${SERVER.w} ${SERVER.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* hardware base */}
      <rect x={HW.x} y={HW.y} width={HW.w} height={HW.h} rx={8} fill={C.ink800} stroke={alpha(C.muted, 0.35)} strokeWidth={2} />
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} cx={HW.w - 40 - k * 26} cy={HW.y + HW.h / 2} r={5} fill={alpha(k === 0 ? C.emerald : C.sky, 0.7)} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <rect key={k} x={24 + k * 34} y={HW.y + 10} width={22} height={12} rx={3} fill={alpha(C.muted, 0.25)} />
      ))}
      {/* the hypervisor bar */}
      <g transform={`translate(${shake} 0)`}>
        {g > 0.02 ? <rect x={HV.x - 6} y={HV.y - 6} width={HV.w + 12} height={HV.h + 12} rx={14} fill={alpha(C.sky, 0.12 * g)} /> : null}
        <rect x={HV.x} y={HV.y} width={HV.w} height={HV.h} rx={10} fill={alpha(C.sky, 0.16 + 0.14 * g + flash * 0.4)} stroke={alpha(C.sky, 0.55 + 0.4 * g)} strokeWidth={3} />
        {hvLabel ? (
          <text x={HV.x + HV.w - 24} y={HV.y + HV.h / 2 + 11} textAnchor="end" fontFamily={FONT.sans} fontSize={32} fontWeight={800} fill={alpha('#bae6fd', 0.75 + 0.25 * g)}>
            hipervisor
          </text>
        ) : null}
        {crack > 0.01 ? (
          <path
            d={`M ${HV.x + HV.w * 0.3} ${HV.y - 4} L ${HV.x + HV.w * 0.33} ${HV.y + 16} L ${HV.x + HV.w * 0.3} ${HV.y + 28} L ${HV.x + HV.w * 0.34} ${HV.y + HV.h + 4}`}
            fill="none"
            stroke={C.rose}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${crack} 1`}
          />
        ) : null}
      </g>
      {/* the virtual machines */}
      {vms.map((vm, i) => {
        const r = vmRect(i, vms.length);
        const tone = vm.tone ?? C.cyan;
        const show = clamp01(vm.show ?? 1);
        const glow = clamp01(vm.glow ?? 0);
        return (
          <g key={i} opacity={show}>
            {glow > 0.02 ? <rect x={r.x - 6} y={r.y - 6} width={r.w + 12} height={r.h + 12} rx={16} fill={alpha(tone, 0.14 * glow)} /> : null}
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={12} fill={alpha(tone, vm.dashed ? 0.04 : 0.1)} stroke={alpha(tone, 0.55 + 0.4 * glow)} strokeWidth={3} strokeDasharray={vm.dashed ? '12 9' : undefined} />
            <rect x={r.x} y={r.y} width={r.w} height={20} rx={10} fill={alpha(tone, vm.dashed ? 0.08 : 0.22)} />
            <circle cx={r.x + 14} cy={r.y + 10} r={4} fill={alpha(tone, 0.8)} />
            {vm.label ? (
              <text x={r.x + r.w / 2} y={r.y + r.h - 22} textAnchor="middle" fontFamily={FONT.sans} fontSize={30} fontWeight={800} fill={alpha(tone === C.cyan ? C.cyanSoft : tone, 0.95)}>
                {vm.label}
              </text>
            ) : (
              <>
                <rect x={r.x + 18} y={r.y + 38} width={r.w * 0.55} height={12} rx={6} fill={alpha(tone, 0.35)} />
                <rect x={r.x + 18} y={r.y + 60} width={r.w * 0.38} height={10} rx={5} fill={alpha(tone, 0.22)} />
                <rect x={r.x + 18} y={r.y + 80} width={r.w * 0.46} height={10} rx={5} fill={alpha(tone, 0.22)} />
              </>
            )}
          </g>
        );
      })}
      {children}
    </svg>
  );
}

/**
 * A small disk (cylinder) in server units centred on (cx, cy); `residue` 0–1 draws the amber lines the previous
 * machine left on it (resource reuse).
 */
export function Disk({ cx, cy, residue = 0, tone = C.sky, scale = 1 }: { cx: number; cy: number; residue?: number; tone?: string; scale?: number }) {
  const w = 74 * scale;
  const h = 56 * scale;
  const e = 10 * scale;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const r = clamp01(residue);
  return (
    <g>
      <path d={`M ${x} ${y + e} L ${x} ${y + h - e} A ${w / 2} ${e} 0 0 0 ${x + w} ${y + h - e} L ${x + w} ${y + e}`} fill={C.ink800} stroke={alpha(tone, 0.85)} strokeWidth={3} />
      <ellipse cx={cx} cy={y + e} rx={w / 2} ry={e} fill={C.ink700} stroke={alpha(tone, 0.85)} strokeWidth={3} />
      {r > 0.01
        ? [0, 1, 2].map((k) => (
            <rect key={k} x={x + 10 * scale} y={y + e + 10 * scale + k * 11 * scale} width={(w - 20 * scale) * (k === 1 ? 0.6 : 0.85)} height={6 * scale} rx={3 * scale} fill={alpha(C.amber, 0.85 * r)} />
          ))
        : null}
    </g>
  );
}
