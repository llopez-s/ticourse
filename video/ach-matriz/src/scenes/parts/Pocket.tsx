import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * Image «el bolsillo» (s03; one beat in s08): at the front door, before going
 * out, a hand pats a jacket pocket looking for the phone and the wallet —
 * what you take for granted, checked. NEVER keys (on this channel a key is
 * the certificate, V4, and persistence, V7): no key, no keyring, no keyhole.
 *
 * The door (panels, a round knob) stands on the right; the jacket (cropped,
 * shoulders to hips, no face) in front of it; the hand on the hip pocket. Two
 * bubbles above the shoulder: a phone «móvil» and a wallet «cartera», dashed
 * with a «?» while unchecked, solid emerald once found.
 *
 * Drawn in design units (POCKET_BASE, 720 × 620) scaled to `width`; frames are
 * Sequence-relative; `frame` defaults to useCurrentFrame().
 */

export const POCKET_TEXT = { phone: 'móvil', wallet: 'cartera' } as const;

export const POCKET_BASE = { w: 720, h: 620 } as const;

/** Size in px at `width` (default design width). */
export function pocketSize(width?: number): { w: number; h: number; scale: number } {
  const s = (width ?? POCKET_BASE.w) / POCKET_BASE.w;
  return { w: POCKET_BASE.w * s, h: POCKET_BASE.h * s, scale: s };
}

const JACKET = '#1d3a55';
const JACKET_DARK = '#152c42';
const LINE = '#9fb7cf';
const SKIN = '#c08f6e';
const SKIN_LINE = '#8a5f45';

/**
 * Pocket — props:
 *   width?      px (default 720)
 *   at?         frame it appears. Omitted: on screen.
 *   patAt?      frame the hand starts patting (`pats` taps, ~11 frames each). Omitted: the hand rests on the pocket.
 *   pats?       number of taps (default 3).
 *   itemsAt?    frame the two bubbles (phone, wallet) pop in, 8 frames apart. Omitted: shown.
 *   found?      false (default: dashed with «?»), true, or the frame they turn solid emerald (found).
 *   door?       draw the front door behind (default true).
 *   dim?, frame?, style?
 */
export function Pocket({
  width,
  at,
  patAt,
  pats = 3,
  itemsAt,
  found = false,
  door = true,
  dim = 0,
  frame: frameProp,
  style,
}: {
  width?: number;
  at?: number;
  patAt?: number;
  pats?: number;
  itemsAt?: number;
  found?: boolean | number;
  door?: boolean;
  dim?: number;
  frame?: number;
  style?: CSSProperties;
}) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const size = pocketSize(width);
  const s = size.scale;
  const show = at === undefined ? 1 : progress(frame, at, 16);
  if (show <= 0) return null;

  // Patting: the hand lifts and lands `pats` times.
  const TAP = 11;
  let lift = 0;
  if (patAt !== undefined && frame >= patAt && frame < patAt + pats * TAP) {
    const t = ((frame - patAt) % TAP) / TAP;
    lift = Math.sin(t * Math.PI);
  }
  const patting = patAt !== undefined && frame >= patAt - 4 && frame < patAt + pats * TAP + 6;
  const item = (k: number) => (itemsAt === undefined ? 1 : frame < itemsAt + k * 8 ? 0 : springIn(frame, fps, itemsAt + k * 8, { damping: 13 }));
  const foundP = found === false ? 0 : found === true ? 1 : progress(frame, found, 14, EASE.out);
  const d = clamp01(dim);

  const W = POCKET_BASE.w;
  const H = POCKET_BASE.h;
  const pocket = { x: 300, y: 470, w: 120, h: 70 };

  return (
    <div style={{ position: 'relative', width: size.w, height: size.h, opacity: show * (1 - 0.6 * d), filter: d > 0.001 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0', fontFamily: FONT.sans }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {door ? (
            <g>
              {/* Front door: frame, two panels, a round knob (no keyhole) */}
              <rect x={440} y={70} width={250} height={550} rx={6} fill="#2a3446" stroke="#64748b" strokeWidth={5} />
              <rect x={472} y={110} width={186} height={200} rx={8} fill="none" stroke={alpha('#94a3b8', 0.55)} strokeWidth={4} />
              <rect x={472} y={340} width={186} height={240} rx={8} fill="none" stroke={alpha('#94a3b8', 0.55)} strokeWidth={4} />
              <circle cx={474} cy={330} r={15} fill={C.amber} stroke="#92400e" strokeWidth={3} />
              {/* Doormat */}
              <rect x={150} y={600} width={420} height={20} rx={6} fill="#3b3326" stroke={alpha('#a8a29e', 0.5)} strokeWidth={2} />
            </g>
          ) : null}
          {/* Jacket (cropped torso, no face): shoulders, collar, zip, hip pockets */}
          <path d="M100 620 L96 330 C96 250 140 214 210 200 L250 192 L330 192 L370 200 C440 214 484 250 484 330 L480 620 Z" fill={JACKET} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
          {/* Collar */}
          <path d="M250 192 L290 262 L330 192" fill="none" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M226 198 L272 300 L290 262" fill={JACKET_DARK} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
          <path d="M354 198 L308 300 L290 262" fill={JACKET_DARK} stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
          {/* Zip */}
          <path d="M290 262 L290 620" stroke={alpha(LINE, 0.8)} strokeWidth={4} />
          <rect x={282} y={300} width={16} height={26} rx={4} fill={LINE} />
          {/* Left hip pocket (the one the hand pats) */}
          <rect x={pocket.x - 150} y={pocket.y} width={pocket.w} height={pocket.h} rx={8} fill={JACKET_DARK} stroke={LINE} strokeWidth={3} />
          <path d={`M ${pocket.x - 150} ${pocket.y + 14} h ${pocket.w}`} stroke={alpha(LINE, 0.7)} strokeWidth={3} />
          {/* Right hip pocket */}
          <rect x={pocket.x + 40} y={pocket.y} width={pocket.w} height={pocket.h} rx={8} fill={JACKET_DARK} stroke={LINE} strokeWidth={3} />
          <path d={`M ${pocket.x + 40} ${pocket.y + 14} h ${pocket.w}`} stroke={alpha(LINE, 0.7)} strokeWidth={3} />
          {/* Pat lines (motion marks) while patting */}
          {patting ? (
            <g stroke={alpha(C.cyanSoft, 0.85)} strokeWidth={4} strokeLinecap="round" opacity={0.4 + 0.6 * (1 - lift)}>
              <path d="M284 470 l 22 -10" />
              <path d="M288 496 l 26 0" />
              <path d="M284 522 l 22 10" />
            </g>
          ) : null}
          {/* The arm: the sleeve bends from the shoulder down to the hip pocket (its end follows the pat) */}
          <path d={`M 118 336 C 76 392 70 ${452 - lift * 18} 136 ${490 - lift * 26}`} stroke={LINE} strokeWidth={72} fill="none" strokeLinecap="round" />
          <path d={`M 118 336 C 76 392 70 ${452 - lift * 18} 136 ${490 - lift * 26}`} stroke={JACKET_DARK} strokeWidth={64} fill="none" strokeLinecap="round" />
          {/* The hand, flat on the pocket (back of the hand to us, fingers together pointing in), patting it */}
          <g transform={`translate(0 ${-lift * 26})`} stroke={SKIN_LINE} strokeWidth={3.5} strokeLinejoin="round">
            {/* Thumb, along the top edge */}
            <rect x={178} y={436} width={50} height={20} rx={10} fill={SKIN} transform="rotate(-20 178 456)" />
            {/* Fingers */}
            <rect x={200} y={458} width={62} height={20} rx={10} fill={SKIN} />
            <rect x={200} y={476} width={68} height={20} rx={10} fill={SKIN} />
            <rect x={200} y={494} width={64} height={20} rx={10} fill={SKIN} />
            <rect x={200} y={512} width={54} height={19} rx={9.5} fill={SKIN} />
            {/* Back of the hand */}
            <rect x={150} y={452} width={70} height={82} rx={20} fill={SKIN} />
            <path d="M170 476 l 24 -4 M170 494 l 26 0 M170 512 l 22 4" stroke={alpha(SKIN_LINE, 0.55)} strokeWidth={3} strokeLinecap="round" fill="none" />
            {/* Cuff */}
            <rect x={124} y={448} width={32} height={90} rx={10} fill={JACKET_DARK} stroke={LINE} strokeWidth={3} />
          </g>
        </svg>

        {/* Bubbles: phone and wallet (never keys) */}
        <ItemBubble x={40} y={16} label={POCKET_TEXT.phone} kind="phone" p={item(0)} found={foundP} />
        <ItemBubble x={236} y={16} label={POCKET_TEXT.wallet} kind="wallet" p={item(1)} found={foundP} />
      </div>
    </div>
  );
}

function ItemBubble({ x, y, label, kind, p, found }: { x: number; y: number; label: string; kind: 'phone' | 'wallet'; p: number; found: number }) {
  if (p <= 0.001) return null;
  const f = clamp01(found);
  const stroke = f > 0.5 ? C.emerald : C.cyanSoft;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 176,
        height: 168,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px ${f > 0.5 ? 'solid' : 'dashed'} ${alpha(stroke, 0.85)}`,
        background: alpha(f > 0.5 ? C.emeraldDeep : C.ink900, 0.85),
        boxShadow: f > 0.02 ? `0 0 ${Math.round(26 * f)}px ${alpha(C.emerald, 0.4 * f)}` : `0 14px 28px ${alpha('#000000', 0.4)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: Math.min(1, p * 1.5),
        transform: `scale(${0.6 + 0.4 * p})`,
        transformOrigin: '50% 100%',
      }}
    >
      <svg width={74} height={74} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
        {kind === 'phone' ? (
          <>
            <rect x="7" y="2.5" width="10" height="19" rx="2" />
            <path d="M10.5 18.5h3" />
          </>
        ) : (
          <>
            <path d="M3.5 7.5h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11Z" />
            <path d="M3.5 7.5 15 4l1.2 3.5" />
            <path d="M15.5 12h5v4h-5a2 2 0 0 1 0-4Z" />
          </>
        )}
      </svg>
      <span style={{ fontSize: 34, fontWeight: 800, color: f > 0.5 ? '#6ee7b7' : C.textStrong, whiteSpace: 'nowrap', lineHeight: 1 }}>{label}</span>
      {f < 0.5 ? (
        <div style={{ position: 'absolute', right: -14, top: -14, width: 44, height: 44, borderRadius: 22, display: 'grid', placeItems: 'center', background: C.amber, color: C.ink950, fontSize: 30, fontWeight: 900, lineHeight: 1 }}>?</div>
      ) : null}
    </div>
  );
}
