import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { ADVERSARY, STAMP } from '../../../data/s01-hook';
import { INK } from '../glyphs';
import { WallSocket } from '../s02-toma/Socket';

/**
 * s01-hook's own pieces: the plan's approval stamp, the promise chip, the three path tiles (with their
 * glyphs: a wall socket, the container terminal, a laptop in front of a hotel), the fence the paths cross,
 * and BLIND ARCHITECT's tag. Nothing positions itself.
 */

// ---------------------------------------------------------------------------
// «aprobado · 20-11»

/**
 * The plan's approval stamp (same ink as V16's PlanStamp: emerald, double border, slightly rotated), one
 * line. It lands at `at` (scale 1.35 → 1). Not the engine `Stamp`: that one uppercases.
 */
export function ApprovedStamp({ frame, at, rotate = -4, size = 38 }: { frame: number; at: number; rotate?: number; size?: number }) {
  if (frame < at) return null;
  const p = progress(frame, at, 10, EASE.out);
  const ink = '#6ee7b7';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 30px 15px 24px',
        borderRadius: 16,
        border: `5px solid ${C.emerald}`,
        outline: `2px solid ${alpha(C.emerald, 0.55)}`,
        outlineOffset: 6,
        background: alpha(C.ink950, 0.88),
        boxShadow: `0 0 ${Math.round(40 * p)}px ${alpha(C.emerald, 0.3 * p)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 820,
        color: ink,
        opacity: p,
        transform: `rotate(${rotate}deg) scale(${1.35 - 0.35 * p})`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="check" size={size + 2} color={C.emerald} strokeWidth={3} />
      <span>{STAMP.what}</span>
      <span style={{ color: alpha(ink, 0.6), fontWeight: 700 }}>·</span>
      <span style={{ fontFamily: FONT.mono, fontWeight: 800 }}>{STAMP.day}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Promise chip

/** One promise chip (V16's look): icon + text in a pill; `lit` 0–1 brightens the border and glows. */
export function PromiseChip({ text, icon, lit = 0, style }: { text: string; icon: IconName; lit?: number; style?: CSSProperties }) {
  const l = clamp01(lit);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 58,
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * l)}`,
        background: alpha(C.ink900, 0.9),
        backgroundImage: `linear-gradient(0deg, ${alpha(C.cyan, 0.06 + 0.12 * l)}, ${alpha(C.cyan, 0.06 + 0.12 * l)})`,
        boxShadow: l > 0.02 ? `0 0 ${Math.round(22 * l)}px ${alpha(C.cyan, 0.3 * l)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Icon name={icon} size={32} color={C.cyan} />
      {text}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Path tiles

export const PATH_TILE = { w: 230, h: 176 } as const;
export type PathKind = 'socket' | 'terminal' | 'hotel';

/** The container terminal (another site of the port): a gantry crane over container stacks. 160 × 120 units. */
function TerminalGlyph({ color }: { color: string }) {
  const box = (x: number, y: number, w: number, key: string) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={16} rx={2} fill={alpha(color, 0.16)} stroke={color} strokeWidth={3} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={x + (w * i) / 4} y1={y + 3} x2={x + (w * i) / 4} y2={y + 13} stroke={alpha(color, 0.55)} strokeWidth={2} />
      ))}
    </g>
  );
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* Ground */}
      <line x1={4} y1={110} x2={156} y2={110} stroke={INK.struct} strokeWidth={3} />
      {/* Gantry crane */}
      <path d="M 16 110 L 16 20 M 58 110 L 58 20 M 6 20 L 100 20 M 16 46 L 58 46" fill="none" stroke={color} strokeWidth={4} />
      <rect x={70} y={15} width={16} height={10} rx={2} fill={color} />
      <line x1={78} y1={25} x2={78} y2={44} stroke={color} strokeWidth={2.6} />
      {box(62, 44, 32, 'hang')}
      {/* Stacks */}
      {box(20, 94, 34, 'a')}
      {box(104, 94, 50, 'b1')}
      {box(104, 78, 50, 'b2')}
      {box(104, 62, 50, 'b3')}
    </g>
  );
}

/** A laptop in front of a hotel (somebody away from the port): the hotel is slate (not ours), the laptop cyan. 160 × 120 units. */
function HotelGlyph({ color }: { color: string }) {
  const hotel = INK.steel;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <line x1={4} y1={110} x2={156} y2={110} stroke={INK.struct} strokeWidth={3} />
      {/* The hotel: a tall block with its windows and a bed sign on the facade */}
      <rect x={14} y={16} width={74} height={94} rx={3} fill={INK.fillSoft} stroke={hotel} strokeWidth={3} />
      <rect x={30} y={4} width={42} height={18} rx={4} fill={C.ink900} stroke={hotel} strokeWidth={2.6} />
      <path d="M 37 17 L 37 9 M 37 14 L 65 14 L 65 17 M 41 13 L 41 10.5 L 50 10.5 L 50 13" fill="none" stroke={hotel} strokeWidth={2} />
      {[0, 1, 2].map((c) =>
        [0, 1, 2, 3].map((r) => (
          <rect key={`${c}-${r}`} x={22 + c * 22} y={30 + r * 18} width={14} height={10} rx={1.5} fill={(c + r) % 3 === 0 ? alpha(INK.lamp, 0.55) : alpha(hotel, 0.18)} />
        )),
      )}
      <rect x={42} y={96} width={18} height={14} fill={C.ink950} stroke={hotel} strokeWidth={2.2} />
      {/* The laptop, in front */}
      <rect x={92} y={70} width={52} height={34} rx={3} fill={C.ink900} stroke={color} strokeWidth={3.4} />
      <rect x={98} y={76} width={40} height={22} rx={1.5} fill={alpha(color, 0.25)} />
      <path d="M 84 106 L 152 106 L 148 112 L 88 112 Z" fill={C.ink800} stroke={color} strokeWidth={3} />
    </g>
  );
}

/**
 * One path's tile: a dark card with its glyph. `lit` 0–1 lights the border cyan and glows; `dim` steps it
 * back. The socket path uses the shared WallSocket with its cable plugged in.
 */
export function PathTile({ kind, lit = 0, dim = 0, show = 1 }: { kind: PathKind; lit?: number; dim?: number; show?: number }) {
  const l = clamp01(lit);
  const s = clamp01(show);
  if (s <= 0.001) return null;
  const col = C.cyan;
  const d = clamp01(dim) * (1 - l);
  let glyph: ReactNode;
  if (kind === 'socket') {
    glyph = (
      <div style={{ width: 160, height: 120, display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
        <WallSocket size={108} color={INK.steel} plugged={1} cable={14} cableColor={col} strokeMin={2.4} />
      </div>
    );
  } else {
    glyph = (
      <svg width={160} height={120} viewBox="0 0 160 120" style={{ display: 'block', overflow: 'visible' }}>
        {kind === 'terminal' ? <TerminalGlyph color={col} /> : <HotelGlyph color={col} />}
      </svg>
    );
  }
  return (
    <div
      style={{
        width: PATH_TILE.w,
        height: PATH_TILE.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(col, 0.35 + 0.55 * l)}`,
        background: `linear-gradient(180deg, ${alpha(col, 0.05 + 0.1 * l)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: l > 0.02 ? `0 0 ${Math.round(30 * l)}px ${alpha(col, 0.32 * l)}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: s * (1 - 0.55 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined,
        transform: `translateY(${(1 - s) * 16}px) scale(${1 + 0.04 * l})`,
      }}
    >
      {glyph}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The fence

/** A horizontal fence `width` px long (posts, two rails, a faint mesh), slate: it belongs to nobody. */
export function Fence({ width, height = 40, draw = 1 }: { width: number; height?: number; draw?: number }) {
  const p = clamp01(draw);
  if (p <= 0.001) return null;
  const posts = Math.floor(width / 64);
  const step = width / posts;
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible', clipPath: `inset(-10px ${(1 - p) * 100}% -10px -10px)` }}>
      <defs>
        <pattern id="s01-fence-mesh" width={14} height={14} patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 14 14 M 14 0 L 0 14" stroke={alpha(INK.struct, 0.45)} strokeWidth={1.4} />
        </pattern>
      </defs>
      <rect x={0} y={6} width={width} height={height - 10} fill="url(#s01-fence-mesh)" />
      <line x1={0} y1={6} x2={width} y2={6} stroke={INK.struct} strokeWidth={4} />
      <line x1={0} y1={height - 4} x2={width} y2={height - 4} stroke={INK.struct} strokeWidth={3} />
      {Array.from({ length: posts + 1 }, (_, i) => (
        <line key={i} x1={i * step} y1={0} x2={i * step} y2={height} stroke={INK.struct} strokeWidth={5} strokeLinecap="round" />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// BLIND ARCHITECT

/**
 * BLIND ARCHITECT's tag (same as V16's s01): a label, never a portrait — an eye-off badge, the name with its
 * section on one line and what it lives on below. Rose, no gender mark. ≈ 640 px wide.
 */
export function AdversaryTag({ glow = 0 }: { glow?: number }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 14,
        padding: '24px 30px 26px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.rose, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.14)} 0%, ${alpha(C.ink900, 0.94)} 100%)`,
        boxShadow: `0 0 ${Math.round(28 + 22 * glow)}px ${alpha(C.rose, 0.2 + 0.2 * glow)}`,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(C.rose, 0.8)}`,
          background: alpha(C.roseDeep, 0.8),
        }}
      >
        <Icon name="eyeOff" size={42} color={C.roseSoft} strokeWidth={2.2} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 800, letterSpacing: 1, color: C.roseSoft }}>{ADVERSARY.name}</span>
        <span style={{ fontSize: 34, fontWeight: 700, color: C.faint }}>·</span>
        <span style={{ fontSize: 34, fontWeight: 750, color: C.text }}>{ADVERSARY.section}</span>
      </div>
      <div style={{ fontSize: 36, fontWeight: 650, color: C.text }}>{ADVERSARY.line}</div>
    </div>
  );
}
