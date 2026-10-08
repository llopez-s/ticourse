import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { SAMPLE } from '../../data/report';

/**
 * The thread of the whole video: the sample card and the sandbox box (s01, s02, s03). Owner: builder A.
 *
 *   <SampleCard width={460} />                       // «muestra» · SHA-256 9f3a2c...e1 (amber hash, mono)
 *   <SandboxBox width={320} lit={0} />                // s01: closed, OFF (dim, no label, door shut)
 *   <SandboxBox width={320} lit={1} holding={1} />    // s02: lit (cyan glow), the card seen through the window
 *   <SandboxBox width={320} lit={1} report={p} />     // s03: the report rises out of the top slot
 *
 * A closed cabinet seen from the front: a slot on top (the card goes in, the report comes out), a door with a
 * window and a handle, a lamp, feet. Never a cable, a globe, a laptop or a rack: nothing that talks to the outside.
 * Captions («sandbox interno de Meridian · …») are scene text, never drawn here. Nothing reads the timeline; wrap
 * each part in an absolutely positioned div. Geometry helpers (`sandboxSlot`, `sandboxWindow`) let a scene fly the
 * card into the slot.
 */

// ---------------------------------------------------------------------------------------------- the card

const CARD_BASE = { w: 500, h: 128 } as const;

/** Height in px of a SampleCard `width` px wide. */
export function sampleCardHeight(width: number): number {
  return (CARD_BASE.h * width) / CARD_BASE.w;
}

/** «muestra · SHA-256 9f3a2c...e1» — the sample as a small card. `glow` (0–1) = the voice is on it. */
export function SampleCard({
  width = CARD_BASE.w,
  show = 1,
  glow = 0,
  style,
}: {
  width?: number;
  show?: number;
  glow?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const g = clamp01(glow);
  const s = width / CARD_BASE.w;
  return (
    <div style={{ position: 'relative', width, height: sampleCardHeight(width), opacity: sh, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: CARD_BASE.w,
          height: CARD_BASE.h,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '0 26px 0 22px',
          borderRadius: 18,
          background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink900} 100%)`,
          border: `2px solid ${alpha(C.amber, 0.45 + 0.45 * g)}`,
          boxShadow: `0 18px 40px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.06)}${
            g > 0 ? `, 0 0 ${Math.round(18 + 26 * g)}px ${alpha(C.amber, 0.35 * g)}` : ''
          }`,
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            width: 68,
            height: 80,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 12,
            background: alpha(C.amber, 0.1),
            border: `2px solid ${alpha(C.amber, 0.4)}`,
          }}
        >
          <Icon name="file" size={46} color={C.amber} strokeWidth={2} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.05, color: C.textStrong }}>{SAMPLE.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: C.muted }}>{SAMPLE.algo}</span>
            <span style={{ fontFamily: FONT.mono, fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0', fontSize: 34, fontWeight: 700, color: '#fcd34d' }}>{SAMPLE.hash}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------------------------- the box

export const SANDBOX_BASE = { w: 360, h: 400 } as const;

const BODY = { x: 20, y: 56, w: 320, h: 316 } as const;
const SLOT = { x: 128, y: 48, w: 104, h: 10 } as const;
const DOOR = { x: 44, y: 124, w: 272, h: 228 } as const;
const WIN = { x: 84, y: 148, w: 192, h: 122 } as const;
const SHEET = { x: 140, w: 80, rise: 150 } as const;

/** Height in px of a SandboxBox `width` px wide. */
export function sandboxBoxHeight(width: number): number {
  return (SANDBOX_BASE.h * width) / SANDBOX_BASE.w;
}

/** The top slot in box-local px: centre x, the slot's top y, its opening width. */
export function sandboxSlot(width: number): { x: number; y: number; w: number } {
  const s = width / SANDBOX_BASE.w;
  return { x: (SLOT.x + SLOT.w / 2) * s, y: SLOT.y * s, w: (SLOT.w - 12) * s };
}

/** The door window in box-local px. */
export function sandboxWindow(width: number): { x: number; y: number; w: number; h: number } {
  const s = width / SANDBOX_BASE.w;
  return { x: WIN.x * s, y: WIN.y * s, w: WIN.w * s, h: WIN.h * s };
}

/** Top of the report sheet (box-local px) when `report` = p: it rises out of the slot. */
export function sandboxSheetTop(width: number, p: number): number {
  const s = width / SANDBOX_BASE.w;
  return (SLOT.y + 4 - SHEET.rise * clamp01(p)) * s;
}

function lerpHex(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * The sandbox: a closed cabinet. `lit` 0 = off (dim outline, dark window, lamp off); 1 = on (cyan outline and halo,
 * lit window, lamp on). `holding` shows the card inside the window (faint while off). `report` raises the report
 * sheet out of the top slot. `pulse` (0–1, optional) breathes the halo.
 */
export function SandboxBox({
  width,
  lit = 0,
  holding = 0,
  report = 0,
  pulse = 0,
  show = 1,
  style,
}: {
  width: number;
  lit?: number;
  holding?: number;
  report?: number;
  pulse?: number;
  show?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const L = clamp01(lit);
  const hold = clamp01(holding);
  const rep = clamp01(report);
  const h = sandboxBoxHeight(width);
  const edge = lerpHex(C.ink600, C.cyan, L);
  const doorEdge = lerpHex(C.ink700, C.cyanDeep, L);
  const halo = L * (0.8 + 0.2 * clamp01(pulse));
  const sheetH = SHEET.rise * rep;
  // Gradient ids carry the lit level, so two boxes in different states never share a definition.
  const gid = `sbx${Math.round(L * 1000)}`;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: sh,
        filter: halo > 0.01 ? `drop-shadow(0 0 ${Math.round(10 + 22 * halo)}px ${alpha(C.cyan, 0.45 * halo)})` : undefined,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox={`0 0 ${SANDBOX_BASE.w} ${SANDBOX_BASE.h}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`${gid}-win`} cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor={lerpHex(C.ink950, '#a5f3fc', L)} stopOpacity={0.25 + 0.6 * L} />
            <stop offset="55%" stopColor={lerpHex(C.ink950, C.cyan, L)} stopOpacity={0.15 + 0.35 * L} />
            <stop offset="100%" stopColor={C.ink950} stopOpacity={1} />
          </radialGradient>
          <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lerpHex(C.ink800, '#123047', L)} />
            <stop offset="100%" stopColor={C.ink900} />
          </linearGradient>
        </defs>

        {/* The report sheet, behind the body: it seems to come out of the slot */}
        {rep > 0.001 ? (
          <g>
            <rect x={SHEET.x} y={SLOT.y + 4 - sheetH} width={SHEET.w} height={sheetH + 6} rx={4} fill="#e8eef6" stroke={alpha(C.cyan, 0.6)} strokeWidth={1.5} />
            {Array.from({ length: 7 }, (_, i) => {
              const y = SLOT.y + 4 - sheetH + 14 + i * 18;
              if (y > SLOT.y - 6) return null;
              return <rect key={i} x={SHEET.x + 10} y={y} width={i % 3 === 2 ? 36 : 58} height={5} rx={2.5} fill={i < 3 ? '#94a3b8' : '#64748b'} />;
            })}
          </g>
        ) : null}

        {/* Feet */}
        <rect x={52} y={BODY.y + BODY.h - 4} width={40} height={20} rx={5} fill={C.ink800} stroke={edge} strokeWidth={2} />
        <rect x={268} y={BODY.y + BODY.h - 4} width={40} height={20} rx={5} fill={C.ink800} stroke={edge} strokeWidth={2} />

        {/* Body */}
        <rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} rx={22} fill={`url(#${gid}-body)`} stroke={edge} strokeWidth={3.5} />
        {/* Lid seam */}
        <path d={`M ${BODY.x + 12} 108 L ${BODY.x + BODY.w - 12} 108`} stroke={doorEdge} strokeWidth={2} />

        {/* Slot on top: a rim and the dark opening */}
        <rect x={SLOT.x - 8} y={SLOT.y - 4} width={SLOT.w + 16} height={SLOT.h + 10} rx={6} fill={C.ink800} stroke={edge} strokeWidth={2.5} />
        <rect x={SLOT.x + 4} y={SLOT.y + 2} width={SLOT.w - 8} height={6} rx={3} fill={C.ink950} />

        {/* Lamp */}
        <circle cx={64} cy={82} r={10} fill={L > 0.05 ? lerpHex(C.ink700, C.cyanSoft, L) : C.ink700} stroke={edge} strokeWidth={2} />
        {L > 0.05 ? <circle cx={64} cy={82} r={18} fill={alpha(C.cyan, 0.22 * L)} /> : null}
        {/* Two status ticks on the lid (texture, no text) */}
        <rect x={250} y={77} width={46} height={10} rx={5} fill={lerpHex(C.ink700, C.cyanDeep, L)} />

        {/* Door */}
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} rx={14} fill={alpha(C.ink900, 0.6)} stroke={doorEdge} strokeWidth={2.5} />
        {/* Hinges */}
        <rect x={DOOR.x - 6} y={DOOR.y + 22} width={10} height={26} rx={3} fill={doorEdge} />
        <rect x={DOOR.x - 6} y={DOOR.y + DOOR.h - 48} width={10} height={26} rx={3} fill={doorEdge} />
        {/* Handle */}
        <rect x={290} y={192} width={12} height={74} rx={6} fill={C.ink800} stroke={edge} strokeWidth={2.5} />

        {/* Window */}
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={16} fill={`url(#${gid}-win)`} stroke={edge} strokeWidth={3} />
        {/* The card inside */}
        {hold > 0.01 ? (
          <g opacity={hold * (0.3 + 0.7 * L)}>
            <rect x={WIN.x + 28} y={WIN.y + 34} width={WIN.w - 56} height={54} rx={7} fill={C.ink900} stroke={alpha(C.amber, 0.8)} strokeWidth={2} />
            <rect x={WIN.x + 40} y={WIN.y + 46} width={22} height={28} rx={3} fill="none" stroke={C.amber} strokeWidth={2} />
            <rect x={WIN.x + 72} y={WIN.y + 48} width={50} height={8} rx={4} fill={C.text} />
            <rect x={WIN.x + 72} y={WIN.y + 64} width={76} height={7} rx={3.5} fill={C.amber} />
          </g>
        ) : null}
        {/* Glass reflection */}
        <path d={`M ${WIN.x + 18} ${WIN.y + WIN.h - 20} L ${WIN.x + 64} ${WIN.y + 14}`} stroke={alpha('#ffffff', 0.08 + 0.1 * L)} strokeWidth={6} strokeLinecap="round" />

        {/* The lock dial: the door stays shut */}
        <circle cx={180} cy={314} r={20} fill={C.ink800} stroke={edge} strokeWidth={2.5} />
        <path d="M 180 314 L 180 299" stroke={edge} strokeWidth={3} strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i * Math.PI) / 4;
          return <circle key={i} cx={180 + Math.cos(a) * 28} cy={314 + Math.sin(a) * 28} r={2} fill={doorEdge} />;
        })}
      </svg>
    </div>
  );
}
