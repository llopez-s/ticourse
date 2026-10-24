import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The video's three everyday images (registry §6, all tagged «imagen · no es del puerto» by the scene that shows them):
 * the community's lift, the new bridge with its certificate and its load test, and the escape room. Drawn here once so
 * the scenes and the resolution lines of the questions reuse the same pictures.
 */

// ---------------------------------------------------------------- the lift

/** The lift cabin: a box with two door leaves (`open` 0–1 slides them apart) and its cable. 100 × 130 units. */
export function LiftCabin({ width = 100, tone = C.sky, open = 0, glow = 0 }: { width?: number; tone?: string; open?: number; glow?: number }) {
  const o = Math.max(0, Math.min(1, open));
  const gap = 4 + 20 * o;
  return (
    <svg width={width} height={width * 1.3} viewBox="0 0 100 130" fill="none" style={{ display: 'block', overflow: 'visible', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(14 * glow)}px ${alpha(tone, 0.55 * glow)})` : undefined }} aria-hidden>
      <path d="M50 0 V 14" stroke={alpha(tone, 0.8)} strokeWidth={3} strokeLinecap="round" />
      <rect x={8} y={14} width={84} height={112} rx={10} fill={C.ink800} stroke={tone} strokeWidth={4} />
      {/* floor display */}
      <rect x={34} y={22} width={32} height={10} rx={3} fill={alpha(tone, 0.35)} />
      {/* door leaves */}
      <rect x={16} y={40} width={34 - gap / 2} height={78} rx={3} fill={alpha(tone, 0.16)} stroke={alpha(tone, 0.8)} strokeWidth={2.5} />
      <rect x={50 + gap / 2} y={40} width={34 - gap / 2} height={78} rx={3} fill={alpha(tone, 0.16)} stroke={alpha(tone, 0.8)} strokeWidth={2.5} />
    </svg>
  );
}

// ---------------------------------------------------------------- the bridge

/** The new bridge with a tied arch and three loaded trucks on its deck (`load` 0–1 presses the arrows onto it). 1000 × 320 units. */
export function BridgeArt({ width = 1000, load = 1, tone = C.cyan, truck = C.rose }: { width?: number; load?: number; tone?: string; truck?: string }) {
  const hangers = Array.from({ length: 11 }, (_, i) => 150 + i * 70);
  const arch = (x: number) => 120 - 100 * Math.sin(((x - 150) / 700) * Math.PI);
  const trucks = [250, 500, 750];
  const l = Math.max(0, Math.min(1, load));
  return (
    <svg width={width} height={(width * 320) / 1000} viewBox="0 0 1000 320" fill="none" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      {/* water */}
      <rect x={0} y={262} width={1000} height={58} rx={10} fill={alpha(C.sky, 0.1)} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${20 + k * 120} ${284 + k * 8} q 30 -14 60 0 t 60 0 t 60 0 t 60 0`} stroke={alpha(C.sky, 0.3)} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* piers */}
      {[140, 480, 820].map((x) => (
        <rect key={x} x={x} y={150} width={40} height={124} fill={C.ink600} stroke={alpha(C.cyan, 0.3)} strokeWidth={2} />
      ))}
      {/* deck */}
      <rect x={30} y={120} width={940} height={32} rx={6} fill={C.ink500} stroke={alpha(C.text, 0.35)} strokeWidth={2} />
      {/* arch and hangers */}
      <path d={`M 150 120 ${hangers.map((x) => `L ${x} ${arch(x)}`).join(' ')} L 850 120`} stroke={tone} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      {hangers.slice(1, -1).map((x) => (
        <line key={x} x1={x} y1={arch(x)} x2={x} y2={120} stroke={alpha(tone, 0.5)} strokeWidth={3} />
      ))}
      {/* trucks: cargo box, cab, wheels */}
      {trucks.map((x) => (
        <g key={x} transform={`translate(${x - 70} 56)`}>
          <rect x={0} y={0} width={104} height={50} rx={5} fill={alpha(truck, 0.2)} stroke={truck} strokeWidth={3.5} />
          <rect x={104} y={14} width={38} height={36} rx={5} fill={alpha(truck, 0.32)} stroke={truck} strokeWidth={3.5} />
          <circle cx={26} cy={58} r={9} fill={C.ink900} stroke={truck} strokeWidth={3.5} />
          <circle cx={78} cy={58} r={9} fill={C.ink900} stroke={truck} strokeWidth={3.5} />
          <circle cx={124} cy={58} r={9} fill={C.ink900} stroke={truck} strokeWidth={3.5} />
          <path d={`M 52 -34 v ${24 + 6 * l}`} stroke={alpha(truck, 0.9)} strokeWidth={5} strokeLinecap="round" opacity={l} />
          <path d="M 40 -14 l 12 14 l 12 -14" stroke={alpha(truck, 0.9)} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={l} transform={`translate(0 ${-4 + 4 * l})`} />
        </g>
      ))}
    </svg>
  );
}

/** The certificate that the bridge was built to the standard: a sheet with a seal and a tick. 150 × 190 units. */
export function CertificateArt({ width = 150, tone = C.cyan, lit = 1 }: { width?: number; tone?: string; lit?: number }) {
  const o = Math.max(0, Math.min(1, lit));
  return (
    <svg width={width} height={(width * 190) / 150} viewBox="0 0 150 190" fill="none" aria-hidden style={{ display: 'block', overflow: 'visible', filter: o > 0.02 ? `drop-shadow(0 0 ${Math.round(16 * o)}px ${alpha(tone, 0.4 * o)})` : undefined }}>
      <rect x={6} y={6} width={138} height={176} rx={12} fill={C.ink800} stroke={tone} strokeWidth={5} />
      <rect x={28} y={28} width={94} height={10} rx={5} fill={alpha(C.text, 0.35)} />
      <rect x={28} y={52} width={72} height={10} rx={5} fill={alpha(C.text, 0.25)} />
      <circle cx={75} cy={112} r={30} fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={5} />
      <path d="M 60 112 l 11 11 l 21 -23" stroke={tone} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={34} y={154} width={82} height={8} rx={4} fill={alpha(C.text, 0.25)} />
    </svg>
  );
}

// ---------------------------------------------------------------- the escape room

export type RoomKind = 'none' | 'hint' | 'plan';

/**
 * The escape room: a back wall with three game doors, each with a keyhole plate (cerradura; never a padlock or a key).
 * `none` = just the doors; `hint` = one note pinned beside the doors; `plan` = the floor plan unrolled, every door
 * ticked. `lit` 0–1 brightens the frame. 360 × 240 units.
 */
export function EscapeRoom({ kind, width = 360, lit = 1 }: { kind: RoomKind; width?: number; lit?: number }) {
  const tone = kind === 'none' ? C.rose : kind === 'hint' ? C.cyan : C.emerald;
  const o = Math.max(0, Math.min(1, lit));
  return (
    <svg width={width} height={(width * 240) / 360} viewBox="0 0 360 240" fill="none" aria-hidden style={{ display: 'block', overflow: 'visible', filter: o > 0.3 ? `drop-shadow(0 0 ${Math.round(14 * o)}px ${alpha(tone, 0.3 * o)})` : undefined }}>
      {/* room */}
      <rect x={4} y={4} width={352} height={232} rx={16} fill={C.ink850} stroke={alpha(tone, 0.4 + 0.5 * o)} strokeWidth={4} />
      <rect x={4} y={166} width={352} height={70} rx={16} fill={alpha(C.ink700, 0.7)} />
      {/* three doors with their keyhole plates */}
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 104;
        return (
          <g key={i}>
            <rect x={x} y={44} width={74} height={122} rx={8} fill={C.ink800} stroke={alpha(C.text, 0.5)} strokeWidth={3.5} />
            <circle cx={x + 58} cy={110} r={9} fill={alpha(C.text, 0.12)} stroke={alpha(C.text, 0.55)} strokeWidth={3} />
            <path d={`M ${x + 58} 112 v 10`} stroke={alpha(C.text, 0.55)} strokeWidth={4} strokeLinecap="round" />
            {kind === 'plan' ? <path d={`M ${x + 20} 70 l 9 9 l 18 -20`} stroke={C.emerald} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
          </g>
        );
      })}
      {kind === 'hint' ? (
        <g transform="translate(150 186) rotate(-4)">
          <rect x={0} y={0} width={62} height={44} rx={6} fill={alpha(C.cyan, 0.2)} stroke={C.cyan} strokeWidth={3.5} />
          <path d="M 12 16 h 38 M 12 28 h 26" stroke={alpha(C.cyanSoft, 0.8)} strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
      {kind === 'plan' ? (
        <g transform="translate(40 178)">
          <rect x={0} y={0} width={280} height={44} rx={6} fill={alpha(C.emerald, 0.14)} stroke={C.emerald} strokeWidth={3.5} />
          <path d="M 70 0 v 44 M 140 0 v 44 M 210 0 v 44" stroke={alpha(C.emerald, 0.6)} strokeWidth={2.5} />
          <path d="M 0 22 h 280" stroke={alpha(C.emerald, 0.4)} strokeWidth={2.5} />
        </g>
      ) : null}
    </svg>
  );
}

/** A small round figure used by the recap: icon art glow ring. */
export function Ring({ children, tone, size = 150 }: { children: ReactNode; tone: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 999, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(tone, 0.7)}`, background: alpha(tone, 0.1), fontFamily: FONT.sans }}>
      {children}
    </div>
  );
}
