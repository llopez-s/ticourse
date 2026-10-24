import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { PAPER } from './Paper';

/**
 * The municipal pool: the video's everyday picture. Boards are dark enamel with white letters and screws, not paper —
 * sheets stay the paper objects of the port. Every picture of the pool is tagged «imagen · no es del puerto» by the
 * scene that shows it. The pool has no lockers and no keys (the locker padlock is another video's).
 */

const SKY = C.sky;
const NAVY_A = '#0f4c75';
const NAVY_B = '#0a3556';

/** Natural sizes of the boards (px at 1920×1080). */
export const BANNER = { w: 640, h: 124 } as const;
export const CAPSIGN = { w: 480, h: 152 } as const;
export const LIFEGUARD = { w: 548, h: 252 } as const;
export const SUNSIGN = { w: 548, h: 112 } as const;
export const OLDSIGN = { w: 440, h: 226 } as const;

type GlyphProps = { size?: number; color?: string; style?: CSSProperties };

/** Three waves. */
export function WaveGlyph({ size = 56, color = '#ffffff', style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round">
      <path d="M 4 14 q 5 -6 10 0 t 10 0 t 10 0 t 10 0" />
      <path d="M 4 26 q 5 -6 10 0 t 10 0 t 10 0 t 10 0" />
      <path d="M 4 38 q 5 -6 10 0 t 10 0 t 10 0 t 10 0" />
    </svg>
  );
}

/** A swim cap: dome and band. */
export function CapGlyph({ size = 56, color = '#ffffff', style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
      <path d="M 7 31 A 17 17 0 0 1 41 31 Z" fill={color} />
      <rect x={5} y={31} width={38} height={6} rx={3} fill={color} opacity={0.75} />
      <path d="M 14 37 q 10 8 20 0" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </svg>
  );
}

/** A whistle. */
export function WhistleGlyph({ size = 44, color = PAPER.ink, style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} fill="none" stroke={color} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round">
      <circle cx={19} cy={30} r={11} />
      <path d="M 28 22 L 44 14 L 44 24 L 31 34" />
      <circle cx={19} cy={30} r={3} fill={color} stroke="none" />
      <circle cx={19} cy={10} r={4} />
    </svg>
  );
}

/** Someone going into the water. */
export function SwimGlyph({ size = 44, color = PAPER.ink, style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={30} cy={13} r={5.5} fill={color} stroke="none" />
      <path d="M 8 24 L 22 19 L 33 24" />
      <path d="M 4 35 q 5 -6 10 0 t 10 0 t 10 0 t 10 0" />
    </svg>
  );
}

/** A phone. */
export function PhoneGlyph({ size = 44, color = PAPER.ink, style }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x={14} y={4} width={20} height={40} rx={5} />
      <circle cx={24} cy={37} r={2} fill={color} stroke="none" />
      <path d="M 20 10 L 28 10" />
    </svg>
  );
}

/** A sunscreen bottle with its number. */
export function SunBottle({ size = 64, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
      <rect x={20} y={3} width={9} height={7} rx={2} fill="#fbbf24" />
      <rect x={22} y={9} width={5} height={5} fill="#cbd5e1" />
      <rect x={13} y={13} width={23} height={32} rx={6} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} />
      <rect x={13} y={22} width={23} height={14} fill="#fbbf24" opacity={0.9} />
      <text x={24.5} y={33.4} fontSize={11} fontWeight={900} textAnchor="middle" fill="#16213a" fontFamily={FONT.sans}>
        50
      </text>
    </svg>
  );
}

/** A screw head in a board's corner. */
function Screw({ x, y }: { x: number | string; y: number | string }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 12, height: 12, borderRadius: 6, background: 'radial-gradient(circle at 35% 30%, #cbd5e1, #64748b)', boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'absolute', left: 2, top: 5, width: 8, height: 2, background: '#334155', transform: 'rotate(-30deg)' }} />
    </div>
  );
}

function Board({ width, height, children, dashed = false, style }: { width: number; height: number; children: ReactNode; dashed?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: 18,
        background: dashed ? `linear-gradient(180deg, ${C.ink800}, ${C.ink850})` : `linear-gradient(180deg, ${NAVY_A}, ${NAVY_B})`,
        border: `4px ${dashed ? 'dashed' : 'solid'} ${alpha(SKY, dashed ? 0.7 : 0.85)}`,
        boxShadow: `0 12px 28px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <Screw x={10} y={10} />
      <Screw x="calc(100% - 22px)" y={10} />
      <Screw x={10} y="calc(100% - 22px)" />
      <Screw x="calc(100% - 22px)" y="calc(100% - 22px)" />
      {children}
    </div>
  );
}

/** s02 · the big board at the entrance: «En esta piscina, la seguridad de los bañistas va primero». */
export function Banner({ style }: { style?: CSSProperties }) {
  return (
    <Board width={BANNER.w} height={BANNER.h} style={style}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px' }}>
        <WaveGlyph size={72} color={C.cyanSoft} />
        <div style={{ fontSize: 30, fontWeight: 850, lineHeight: 1.22, color: '#ffffff', whiteSpace: 'nowrap' }}>
          <div>En esta piscina, la seguridad</div>
          <div>de los bañistas va primero</div>
        </div>
      </div>
    </Board>
  );
}

/** s02 · the smaller board beside it: «Gorro obligatorio · menores de 10 años, siempre con un adulto». */
export function CapSign({ style }: { style?: CSSProperties }) {
  return (
    <Board width={CAPSIGN.w} height={CAPSIGN.h} style={style}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px' }}>
        <div style={{ flexShrink: 0, width: 84, height: 84, borderRadius: 42, background: '#1d6fb8', border: '4px solid #ffffff', display: 'grid', placeItems: 'center' }}>
          <CapGlyph size={56} />
        </div>
        <div style={{ whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 34, fontWeight: 850, color: '#ffffff', lineHeight: 1.15 }}>Gorro obligatorio</div>
          <div style={{ marginTop: 4, fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: C.cyanSoft }}>
            <div>menores de 10 años,</div>
            <div>siempre con un adulto</div>
          </div>
        </div>
      </div>
    </Board>
  );
}

/** s04 · the lifeguard's laminated sheet: «Si alguien se hunde: 1, silbato; 2, al agua; 3, avisar al 112». */
export function LifeguardSheet({ style }: { style?: CSSProperties }) {
  const rows = [
    { n: 1, text: 'silbato', glyph: <WhistleGlyph size={40} /> },
    { n: 2, text: 'al agua', glyph: <SwimGlyph size={40} /> },
    { n: 3, text: 'avisar al 112', glyph: <PhoneGlyph size={40} /> },
  ];
  return (
    <div
      style={{
        position: 'relative',
        width: LIFEGUARD.w,
        height: LIFEGUARD.h,
        boxSizing: 'border-box',
        padding: '16px 28px',
        borderRadius: 12,
        background: 'linear-gradient(180deg, #eef6fc 0%, #d2e3f1 100%)',
        border: '5px solid #1d6fb8',
        boxShadow: `0 12px 28px ${alpha('#000000', 0.45)}`,
        fontFamily: FONT.sans,
        color: PAPER.ink,
        ...style,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 850, lineHeight: 1.2, whiteSpace: 'nowrap' }}>Si alguien se hunde:</div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((r) => (
          <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 50 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: '#1d6fb8', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 850 }}>{r.n}</div>
            {r.glyph}
            <span style={{ fontSize: 32, fontWeight: 800, whiteSpace: 'nowrap' }}>{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** s04 · the small advisory board: «Te recomendamos crema de factor 50» (dashed: nobody is bound by it). */
export function SunSign({ style }: { style?: CSSProperties }) {
  return (
    <Board width={SUNSIGN.w} height={SUNSIGN.h} dashed style={style}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px' }}>
        <SunBottle size={74} />
        <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2, color: '#ffffff', whiteSpace: 'nowrap' }}>
          <div style={{ color: C.cyanSoft }}>Te recomendamos</div>
          <div>crema de factor 50</div>
        </div>
      </div>
    </Board>
  );
}

/**
 * s06 · the yellowed board of the small pool, which no longer exists: its schedule is unreadable bars, one screw has
 * given way and it hangs a little crooked.
 */
export function OldSign({ style }: { style?: CSSProperties }) {
  const bars = [0.9, 0.7, 0.8];
  return (
    <div style={{ position: 'relative', width: OLDSIGN.w, height: OLDSIGN.h, fontFamily: FONT.sans, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: OLDSIGN.w,
          height: OLDSIGN.h - 30,
          boxSizing: 'border-box',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #b99a3c 0%, #8d6f26 55%, #6e5519 100%)',
          border: '4px solid #d6b95c',
          boxShadow: `0 12px 26px ${alpha('#000000', 0.5)}`,
          padding: '20px 28px',
          transform: 'rotate(-2.5deg)',
          transformOrigin: '10% 0%',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 850, color: '#fdf0c4', whiteSpace: 'nowrap' }}>Piscina pequeña</div>
        <div style={{ marginTop: 2, fontSize: 28, fontWeight: 750, color: '#f1dc9a' }}>horario</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bars.map((w, i) => (
            <div key={i} style={{ width: `${w * 100}%`, height: 12, borderRadius: 6, background: 'rgba(253, 240, 196, 0.45)' }} />
          ))}
        </div>
        <svg width="100%" height="100%" viewBox="0 0 440 200" style={{ position: 'absolute', left: 0, top: 0 }} fill="none" stroke="rgba(60, 40, 10, 0.55)" strokeWidth={2.2} strokeLinecap="round">
          <path d="M 330 0 L 318 34 L 342 60 L 326 92" />
          <path d="M 318 34 L 296 40" />
          <path d="M 0 150 L 40 160 L 62 150" />
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 14, top: 12, width: 12, height: 12, borderRadius: 6, background: 'radial-gradient(circle at 35% 30%, #e7d9a6, #8d6f26)' }} />
      {/* the screw that gave way */}
      <div style={{ position: 'absolute', left: OLDSIGN.w - 54, top: 4, width: 12, height: 12, borderRadius: 6, background: 'rgba(60, 40, 10, 0.6)' }} />
    </div>
  );
}

/** The ghost of the small pool that is gone: a dashed outline with a faint wave and its caption. */
export function GhostPool({ width = 440, height = 96 }: { width?: number; height?: number }) {
  return (
    <div style={{ position: 'relative', width, height, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: `3px dashed ${alpha(C.muted, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <WaveGlyph size={44} color={alpha(C.muted, 0.6)} />
        <span style={{ fontSize: 30, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>ya no existe</span>
      </div>
    </div>
  );
}

/**
 * The pool's wall: pale tiles over the series' dark, a strip of water along the bottom. `t` (0–1) drifts the wave
 * lines. Children (boards, tags) are positioned inside, in wall-local coordinates.
 */
export function PoolWall({ width, height, t = 0, water = 54, children }: { width: number; height: number; t?: number; water?: number; children?: ReactNode }) {
  const dx = -((t * 80) % 80);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: 24,
        border: `2px solid ${alpha(SKY, 0.35)}`,
        background: `linear-gradient(180deg, ${alpha(SKY, 0.1)} 0%, ${alpha(C.ink900, 0.92)} 100%)`,
        backgroundImage: `repeating-linear-gradient(0deg, ${alpha(SKY, 0.1)} 0px, ${alpha(SKY, 0.1)} 2px, transparent 2px, transparent 56px), repeating-linear-gradient(90deg, ${alpha(SKY, 0.1)} 0px, ${alpha(SKY, 0.1)} 2px, transparent 2px, transparent 56px)`,
        overflow: 'hidden',
      }}
    >
      {children}
      <svg width={width} height={water} viewBox={`0 0 ${width} ${water}`} style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="pool-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY} stopOpacity={0.55} />
            <stop offset="1" stopColor={C.cyanDeep} stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={width} height={water} fill="url(#pool-water)" />
        {[14, 32].map((y, i) => {
          let d = `M ${dx - 80} ${y}`;
          for (let x = dx - 80; x < width + 80; x += 40) d += ` q 10 ${i % 2 ? 8 : -8} 20 0 t 20 0`;
          return <path key={y} d={d} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />;
        })}
      </svg>
    </div>
  );
}

/** A tiny pictogram per board for the closing card (no text; ~120×84). */
export function BoardMini({ kind, width = 120 }: { kind: 'wave' | 'cap' | 'lifeguard' | 'sun' | 'old'; width?: number }) {
  const h = (width * 84) / 120;
  if (kind === 'lifeguard') {
    return (
      <svg width={width} height={h} viewBox="0 0 120 84">
        <rect x={6} y={4} width={108} height={76} rx={10} fill="#e4f0f9" stroke="#1d6fb8" strokeWidth={5} />
        {[22, 40, 58].map((y, i) => (
          <g key={y}>
            <circle cx={24} cy={y} r={7} fill="#1d6fb8" />
            <rect x={40} y={y - 4} width={[52, 40, 58][i]} height={8} rx={4} fill={PAPER.ink} opacity={0.55} />
          </g>
        ))}
      </svg>
    );
  }
  if (kind === 'sun') {
    return (
      <svg width={width} height={h} viewBox="0 0 120 84">
        <rect x={6} y={10} width={108} height={64} rx={12} fill={C.ink850} stroke={SKY} strokeWidth={5} strokeDasharray="10 7" />
        <SunBottle size={52} style={{ transform: 'translate(10px, 14px)' }} />
        <rect x={64} y={30} width={38} height={8} rx={4} fill="#ffffff" opacity={0.85} />
        <rect x={64} y={46} width={30} height={8} rx={4} fill={C.cyanSoft} opacity={0.85} />
      </svg>
    );
  }
  if (kind === 'old') {
    return (
      <svg width={width} height={h} viewBox="0 0 120 84">
        <g transform="rotate(-4 20 10)">
          <rect x={8} y={8} width={104} height={62} rx={10} fill="#a98b33" stroke="#d6b95c" strokeWidth={4} />
          <rect x={22} y={22} width={58} height={9} rx={4.5} fill="#fdf0c4" opacity={0.9} />
          {[40, 54].map((y, i) => (
            <rect key={y} x={22} y={y} width={[70, 52][i]} height={7} rx={3.5} fill="#fdf0c4" opacity={0.45} />
          ))}
          <path d="M 84 8 L 78 26 L 90 40 L 82 56" fill="none" stroke="rgba(60,40,10,0.6)" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      </svg>
    );
  }
  if (kind === 'cap') {
    return (
      <svg width={width} height={h} viewBox="0 0 120 84">
        <rect x={6} y={8} width={108} height={64} rx={12} fill={NAVY_A} stroke={SKY} strokeWidth={5} />
        <circle cx={36} cy={40} r={20} fill="#1d6fb8" stroke="#ffffff" strokeWidth={4} />
        <g transform="translate(20 24) scale(0.66)">
          <path d="M 7 31 A 17 17 0 0 1 41 31 Z" fill="#ffffff" />
          <rect x={5} y={31} width={38} height={6} rx={3} fill="#ffffff" opacity={0.75} />
        </g>
        <rect x={66} y={30} width={40} height={8} rx={4} fill="#ffffff" opacity={0.9} />
        <rect x={66} y={46} width={30} height={8} rx={4} fill={C.cyanSoft} opacity={0.85} />
      </svg>
    );
  }
  return (
    <svg width={width} height={h} viewBox="0 0 120 84">
      <rect x={6} y={14} width={108} height={56} rx={12} fill={NAVY_A} stroke={SKY} strokeWidth={5} />
      <g transform="translate(14 22) scale(0.8)">
        <WaveGlyphPaths />
      </g>
      <rect x={66} y={30} width={40} height={8} rx={4} fill="#ffffff" opacity={0.9} />
      <rect x={66} y={46} width={30} height={8} rx={4} fill="#ffffff" opacity={0.6} />
    </svg>
  );
}

function WaveGlyphPaths() {
  return (
    <g fill="none" stroke={C.cyanSoft} strokeWidth={3.4} strokeLinecap="round">
      <path d="M 4 14 q 5 -6 10 0 t 10 0 t 10 0" />
      <path d="M 4 26 q 5 -6 10 0 t 10 0 t 10 0" />
      <path d="M 4 38 q 5 -6 10 0 t 10 0 t 10 0" />
    </g>
  );
}

