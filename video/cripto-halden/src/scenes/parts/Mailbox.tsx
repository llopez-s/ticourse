import { useId, type CSSProperties } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01, tone as toneOf, type Tone } from '../../../../engine/src/ui';

/**
 * The two key images of V11 (canon: out/scene-brief.md «Visual metaphors»),
 * drawn ONE way wherever they come back (s02, s03, s06, s07, s09, s10):
 *
 * SYMMETRIC — «la llave de casa, una copia para cada lado»
 *   - `HouseKey`: the shared key (silver by default: it belongs to both
 *     sides; pass `color` to tint it, e.g. s08's final paint colour). Tip
 *     points left; `flip` points it right. `dashed` draws a ghost outline
 *     (the copy whose journey is the open question). Aspect 120×48.
 *   - `HouseLock`: the padlock it closes and opens (`closed` 0–1). Aspect 100×120.
 *
 * ASYMMETRIC — «el buzón de la naviera»
 *   - `Mailbox`: the shipping company's mailbox on its post (emerald by
 *     default). The SLOT is the public key (anyone drops letters through it:
 *     `letters`, `slotGlow`); the DOOR'S KEYHOLE takes the mailbox's own key,
 *     the private key (`keyIn`, `keyTurn`, `doorOpen`, `keyholeGlow`). `inside`
 *     shows how many letters lie inside when the door is open. `mini` thickens
 *     the strokes for icon sizes (≤ ~120 px wide). Design units MAILBOX_BASE
 *     (240×360) scaled to `width`; `mailboxPoint()` gives px anchors to aim
 *     flights and labels at.
 *   - `PrivateKey`: the mailbox's own key (never leaves home). Different bow
 *     from HouseKey (square bow + a ring) so the two never read as the same
 *     key. Aspect 120×56; tip points left (`flip` for right).
 *   - `SlotGlyph`: a public key drawn as what it is in this video — the slot
 *     plate of a mailbox (used for «la pública de la naviera / del puerto»
 *     tiles). Aspect 120×64.
 *   - `Letter`: an envelope (the thing that goes through the slot). Aspect 120×80.
 *
 * Voice says «clave»; «llave» is only the drawing. Colour by owner: cyan = the
 * port, emerald = the shipping company. NEVER give NULL CIPHER a key or a door.
 * Everything takes 0–1 weights and nothing reads the timeline; nothing is
 * positioned — wrap each piece in an absolutely positioned div.
 */

/** Ids for SVG defs, unique per instance and safe inside url(#…). */
function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 14 * g)}px ${alpha(color, 0.65 * g)})` : '');

const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

/** Silver of the shared key: it is neither side's own. */
export const HOUSE_KEY_SILVER = '#cbd5e1';

// ---------------------------------------------------------------------------
// HouseKey

export const HOUSE_KEY_BASE = { w: 120, h: 48 } as const;

/** Where the tip of a HouseKey `width` px wide sits, from its top-left (tip left; mirror x when `flip`). */
export function houseKeyTip(width: number, flip = false): { x: number; y: number } {
  const s = width / HOUSE_KEY_BASE.w;
  return { x: (flip ? 116 : 4) * s, y: 24 * s };
}

export function HouseKey({
  width,
  color = HOUSE_KEY_SILVER,
  glow = 0,
  glowColor,
  dashed = false,
  flip = false,
  dim = 0,
  style,
}: {
  width: number;
  color?: string;
  /** 0–1 halo. */
  glow?: number;
  glowColor?: string;
  /** Ghost outline: the copy that still has to travel. */
  dashed?: boolean;
  flip?: boolean;
  dim?: number;
  style?: CSSProperties;
}) {
  const h = (width * HOUSE_KEY_BASE.h) / HOUSE_KEY_BASE.w;
  const g = clamp01(glow);
  const d = clamp01(dim);
  const fill = dashed ? 'none' : color;
  const stroke = dashed ? color : alpha('#020617', 0.55);
  const sw = dashed ? 4.5 : 1.4;
  const dash = dashed ? '8 5' : undefined;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 120 48"
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: 1 - 0.6 * d,
        filter: joinFilters(dropGlow(glowColor ?? color, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <g transform={flip ? 'translate(120 0) scale(-1 1)' : undefined}>
        {/* Bow with its hole */}
        <path
          d="M 96 5 A 19 19 0 1 1 95.99 5 Z M 96 17 A 7 7 0 1 0 96.01 17 Z"
          fill={fill}
          fillRule="evenodd"
          stroke={stroke}
          strokeWidth={sw}
          strokeDasharray={dash}
        />
        {/* Collar */}
        <rect x={72} y={17} width={8} height={14} rx={2} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
        {/* Shaft with the tip */}
        <path d="M 78 20 L 12 20 L 4 24 L 12 28 L 78 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinejoin="round" />
        {/* Bit: the teeth */}
        <path
          d="M 14 28 L 14 39 L 20 39 L 20 34 L 26 34 L 26 41 L 34 41 L 34 35 L 40 35 L 40 39 L 48 39 L 48 28 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeDasharray={dash}
          strokeLinejoin="round"
        />
        {!dashed ? <rect x={14} y={22} width={60} height={2} rx={1} fill={alpha('#ffffff', 0.35)} /> : null}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// HouseLock

export const HOUSE_LOCK_BASE = { w: 100, h: 120 } as const;

/** Centre of the padlock's keyhole, px from its top-left, for a lock `width` px wide. */
export function houseLockKeyhole(width: number): { x: number; y: number } {
  const s = width / HOUSE_LOCK_BASE.w;
  return { x: 50 * s, y: 82 * s };
}

export function HouseLock({
  width,
  color = HOUSE_KEY_SILVER,
  closed = 1,
  glow = 0,
  glowColor,
  dim = 0,
  style,
}: {
  width: number;
  color?: string;
  /** 0 = shackle up (open), 1 = shackle down (closed). */
  closed?: number;
  glow?: number;
  glowColor?: string;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('hlock');
  const h = (width * HOUSE_LOCK_BASE.h) / HOUSE_LOCK_BASE.w;
  const c = clamp01(closed);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const lift = (1 - c) * 16;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 100 120"
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: 1 - 0.6 * d,
        filter: joinFilters(dropGlow(glowColor ?? color, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      {/* Shackle: the right leg leaves the body as it lifts */}
      <path
        d={`M 29 ${56 - lift} L 29 ${36 - lift} A 21 21 0 0 1 71 ${36 - lift} L 71 ${56 - lift * 0.15}`}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
      />
      {/* Body */}
      <rect x={12} y={50} width={76} height={64} rx={12} fill={`url(#${id}-body)`} stroke={color} strokeWidth={3.5} />
      <rect x={18} y={56} width={64} height={6} rx={3} fill={alpha('#ffffff', 0.08)} />
      {/* Keyhole */}
      <circle cx={50} cy={78} r={7} fill="#020617" stroke={alpha(color, 0.6)} strokeWidth={1.5} />
      <path d="M 46.5 80 L 53.5 80 L 55.5 97 L 44.5 97 Z" fill="#020617" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// PrivateKey

export const PRIVATE_KEY_BASE = { w: 120, h: 56 } as const;

/** Where the tip of a PrivateKey `width` px wide sits, from its top-left (tip left; mirror x when `flip`). */
export function privateKeyTip(width: number, flip = false): { x: number; y: number } {
  const s = width / PRIVATE_KEY_BASE.w;
  return { x: (flip ? 116 : 4) * s, y: 22 * s };
}

export function PrivateKey({
  width,
  color = C.emerald,
  glow = 0,
  flip = false,
  dim = 0,
  style,
}: {
  width: number;
  /** Owner's colour: emerald = the shipping company, cyan = the port. */
  color?: string;
  glow?: number;
  flip?: boolean;
  dim?: number;
  style?: CSSProperties;
}) {
  const h = (width * PRIVATE_KEY_BASE.h) / PRIVATE_KEY_BASE.w;
  const g = clamp01(glow);
  const d = clamp01(dim);
  const edge = alpha('#020617', 0.55);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 120 56"
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: 1 - 0.6 * d,
        filter: joinFilters(dropGlow(color, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <g transform={flip ? 'translate(120 0) scale(-1 1)' : undefined}>
        {/* Key ring through the bow */}
        <circle cx={108} cy={38} r={10} fill="none" stroke={alpha(color, 0.75)} strokeWidth={3} />
        {/* Square bow with its hole */}
        <path
          d="M 74 6 L 102 6 Q 108 6 108 12 L 108 32 Q 108 38 102 38 L 74 38 Q 68 38 68 32 L 68 12 Q 68 6 74 6 Z M 82 16 L 94 16 L 94 28 L 82 28 Z"
          fill={color}
          fillRule="evenodd"
          stroke={edge}
          strokeWidth={1.4}
        />
        {/* Shaft with the tip */}
        <path d="M 70 18 L 12 18 L 4 22 L 12 26 L 70 26 Z" fill={color} stroke={edge} strokeWidth={1.4} strokeLinejoin="round" />
        {/* Bit: a different cut from the house key */}
        <path d="M 16 26 L 16 36 L 24 36 L 24 31 L 32 31 L 32 38 L 40 38 L 40 26 Z" fill={color} stroke={edge} strokeWidth={1.4} strokeLinejoin="round" />
        <rect x={14} y={20} width={52} height={2} rx={1} fill={alpha('#ffffff', 0.35)} />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SlotGlyph

export const SLOT_GLYPH_BASE = { w: 120, h: 64 } as const;

export function SlotGlyph({
  width,
  color = C.emerald,
  glow = 0,
  letter = true,
  dim = 0,
  style,
}: {
  width: number;
  /** Owner's colour: emerald = the shipping company, cyan = the port. */
  color?: string;
  glow?: number;
  /** A letter half-way into the slot (reads as «you can drop things here»). */
  letter?: boolean;
  dim?: number;
  style?: CSSProperties;
}) {
  const h = (width * SLOT_GLYPH_BASE.h) / SLOT_GLYPH_BASE.w;
  const g = clamp01(glow);
  const d = clamp01(dim);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 120 64"
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: 1 - 0.6 * d,
        filter: joinFilters(dropGlow(color, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      {/* Plate */}
      <rect x={4} y={20} width={112} height={40} rx={10} fill={alpha(color, 0.18)} stroke={color} strokeWidth={4} />
      {/* Screws */}
      <circle cx={14} cy={40} r={2.6} fill={alpha(color, 0.8)} />
      <circle cx={106} cy={40} r={2.6} fill={alpha(color, 0.8)} />
      {/* Letter going in */}
      {letter ? (
        <g>
          <rect x={36} y={2} width={48} height={36} rx={3} fill="#f1f5f9" stroke={alpha('#020617', 0.5)} strokeWidth={1.2} />
          <path d="M 36 4 L 60 22 L 84 4" fill="none" stroke={alpha('#64748b', 0.9)} strokeWidth={2} />
        </g>
      ) : null}
      {/* The slot (drawn over the letter's lower half: it is going in) */}
      <rect x={24} y={34} width={72} height={11} rx={5.5} fill="#020617" stroke={alpha(color, 0.6)} strokeWidth={1.5} />
      {letter ? <rect x={36} y={45.5} width={48} height={14} fill={alpha(color, 0.18)} /> : null}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Letter

export const LETTER_BASE = { w: 120, h: 80 } as const;

export function Letter({
  width,
  color = '#f1f5f9',
  edge = '#64748b',
  glow = 0,
  glowColor = C.emerald,
  style,
}: {
  width: number;
  /** Paper colour. */
  color?: string;
  /** Flap and border colour (a tone marks who sent it). */
  edge?: string;
  glow?: number;
  glowColor?: string;
  style?: CSSProperties;
}) {
  const h = (width * LETTER_BASE.h) / LETTER_BASE.w;
  const g = clamp01(glow);
  return (
    <svg width={width} height={h} viewBox="0 0 120 80" style={{ overflow: 'visible', display: 'block', filter: joinFilters(dropGlow(glowColor, g)), ...style }}>
      <rect x={3} y={3} width={114} height={74} rx={6} fill={color} stroke={edge} strokeWidth={3} />
      <path d="M 5 7 L 60 46 L 115 7" fill="none" stroke={edge} strokeWidth={3} strokeLinejoin="round" />
      <path d="M 5 75 L 46 37 M 115 75 L 74 37" fill="none" stroke={alpha(edge, 0.5)} strokeWidth={2} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Mailbox

export const MAILBOX_BASE = { w: 240, h: 360 } as const;

/** Anchors in design units (240×360). */
const MB = {
  slot: { x: 120, y: 57 },
  keyhole: { x: 172, y: 166 },
  door: { x: 120, y: 164 },
  top: { x: 120, y: 8 },
  base: { x: 120, y: 356 },
  left: { x: 22, y: 136 },
  right: { x: 218, y: 136 },
} as const;

export type MailboxPoint = keyof typeof MB;

export function mailboxHeight(width: number): number {
  return (MAILBOX_BASE.h * width) / MAILBOX_BASE.w;
}

/**
 * An anchor of a Mailbox `width` px wide, in px from its top-left: 'slot'
 * (centre of the slot: the public key), 'keyhole' (the private key's lock),
 * 'door' (centre of the door), 'top', 'base' (foot of the post), 'left',
 * 'right' (middle of the box's sides).
 */
export function mailboxPoint(width: number, which: MailboxPoint): { x: number; y: number } {
  const s = width / MAILBOX_BASE.w;
  return { x: MB[which].x * s, y: MB[which].y * s };
}

/**
 * One letter dropping through the slot: `p` 0 = held above the slot, 1 = all
 * the way in (then it is no longer drawn); `opacity` 0 hides it (default 1);
 * `dx` (design units) offsets where it starts; `tilt` (deg) its start angle.
 */
export type MailboxLetter = { p: number; edge?: string; tilt?: number; dx?: number; opacity?: number };

export function Mailbox({
  width,
  tone = 'emerald',
  show = 1,
  slotGlow = 0,
  keyholeGlow = 0,
  doorOpen = 0,
  keyIn = 0,
  keyTurn = 0,
  keyColor,
  letters = [],
  inside = 0,
  glow = 0,
  dim = 0,
  mini = false,
  post = true,
  style,
}: {
  width: number;
  /** Owner's colour: emerald = the shipping company (canon), cyan = the port. */
  tone?: Tone;
  show?: number;
  /** 0–1: the slot plate lights (the public key). */
  slotGlow?: number;
  /** 0–1: the keyhole lights (where the private key goes). */
  keyholeGlow?: number;
  /** 0–1: the door swings open on its left hinge. */
  doorOpen?: number;
  /** 0–1: the owner's key slides into the keyhole (from the right). */
  keyIn?: number;
  /** 0–1: the key turns (a quarter turn, drawn as a squash). */
  keyTurn?: number;
  keyColor?: string;
  /** Letters dropping through the slot (each clipped at the slot as it goes in). */
  letters?: MailboxLetter[];
  /** Letters lying inside, seen when the door is open (0–3). */
  inside?: number;
  glow?: number;
  dim?: number;
  /** Icon size: thicker strokes, no name plate. */
  mini?: boolean;
  /** Draw the post and its foot (false for a box-only icon). */
  post?: boolean;
  style?: CSSProperties;
}) {
  const id = useSvgId('mbox');
  const sh = clamp01(show);
  const t = toneOf(tone);
  if (sh <= 0) return null;
  const s = width / MAILBOX_BASE.w;
  const h = mailboxHeight(width);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const sg = clamp01(slotGlow);
  const kg = clamp01(keyholeGlow);
  const o = clamp01(doorOpen);
  const ki = clamp01(keyIn);
  const kt = clamp01(keyTurn);
  const sw = mini ? 1.7 : 1;
  const leafScale = 1 - 0.8 * o;
  const nInside = Math.max(0, Math.min(3, Math.round(inside)));
  const kColor = keyColor ?? t.fg;
  // The key: tip on the keyhole when keyIn = 1, sliding in from the right.
  const keyW = 120;
  const keyX = MB.keyhole.x - 4 * (keyW / PRIVATE_KEY_BASE.w) + (1 - ki) * 70;
  const keyY = MB.keyhole.y - 22 * (keyW / PRIVATE_KEY_BASE.w);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        opacity: sh * (1 - 0.6 * d),
        filter: joinFilters(dropGlow(t.fg, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox="0 0 240 360" style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={alpha(t.fg, 0.32)} />
            <stop offset="55%" stopColor={alpha(t.deep, 0.9)} />
            <stop offset="100%" stopColor="#0b1220" />
          </linearGradient>
          <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={alpha(t.fg, 0.22)} />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <clipPath id={`${id}-above-slot`}>
            <rect x={-200} y={-400} width={640} height={400 + MB.slot.y} />
          </clipPath>
        </defs>

        {/* Post */}
        {post ? (
          <>
            <rect x={108} y={250} width={24} height={98} rx={4} fill="#1e293b" stroke={alpha(t.fg, 0.45)} strokeWidth={2 * sw} />
            <rect x={74} y={344} width={92} height={13} rx={6} fill="#1e293b" stroke={alpha(t.fg, 0.45)} strokeWidth={2 * sw} />
          </>
        ) : null}

        {/* Body */}
        <rect x={22} y={18} width={196} height={234} rx={18} fill={`url(#${id}-body)`} stroke={t.fg} strokeWidth={4 * sw} />
        {/* Top lip */}
        <rect x={12} y={6} width={216} height={22} rx={9} fill={t.deep} stroke={t.fg} strokeWidth={3.5 * sw} />

        {/* Slot plate: the public key */}
        {sg > 0.01 ? <rect x={38} y={30} width={164} height={54} rx={14} fill={alpha(t.fg, 0.22 * sg)} /> : null}
        <rect x={48} y={38} width={144} height={38} rx={10} fill={alpha('#020617', 0.55)} stroke={alpha(t.fg, 0.7 + 0.3 * sg)} strokeWidth={(3 + 2 * sg) * sw} />
        <rect x={62} y={52} width={116} height={11} rx={5.5} fill="#020617" />

        {/* Door opening: inside first, then the leaf over it */}
        <rect x={44} y={94} width={152} height={142} rx={10} fill="#050a14" stroke={alpha(t.fg, 0.55)} strokeWidth={2.5 * sw} />
        {o > 0.01 && nInside > 0
          ? Array.from({ length: nInside }, (_, i) => (
              <g key={i} transform={`translate(${62 + i * 10} ${196 - i * 16}) rotate(${-6 + i * 5})`} opacity={o}>
                <rect x={0} y={0} width={96} height={30} rx={3} fill="#e2e8f0" stroke="#64748b" strokeWidth={1.5} />
                <path d="M 1 2 L 48 18 L 95 2" fill="none" stroke="#64748b" strokeWidth={1.5} />
              </g>
            ))
          : null}
        <g transform={`translate(44 0) scale(${leafScale} 1) translate(-44 0)`}>
          <rect x={44} y={94} width={152} height={142} rx={10} fill={`url(#${id}-leaf)`} stroke={alpha(t.fg, 0.8)} strokeWidth={3 * sw} />
          {!mini ? <rect x={82} y={108} width={76} height={16} rx={4} fill={alpha(t.fg, 0.25)} stroke={alpha(t.fg, 0.5)} strokeWidth={1.5} /> : null}
          {/* Keyhole: where the private key goes */}
          {kg > 0.01 ? <circle cx={MB.keyhole.x} cy={MB.keyhole.y} r={20} fill={alpha(t.fg, 0.25 * kg)} /> : null}
          <circle cx={MB.keyhole.x} cy={MB.keyhole.y - 3} r={6.5 * sw} fill="#020617" stroke={alpha(t.fg, 0.75 + 0.25 * kg)} strokeWidth={(1.6 + 1.6 * kg) * sw} />
          <path d={`M ${MB.keyhole.x - 3.5} ${MB.keyhole.y} L ${MB.keyhole.x + 3.5} ${MB.keyhole.y} L ${MB.keyhole.x + 5} ${MB.keyhole.y + 13} L ${MB.keyhole.x - 5} ${MB.keyhole.y + 13} Z`} fill="#020617" />
        </g>

        {/* Letters going in through the slot (clipped at the slot) */}
        <g clipPath={`url(#${id}-above-slot)`}>
          {letters.map((l, i) => {
            const p = clamp01(l.p);
            const op = clamp01(l.opacity ?? 1);
            if (p >= 0.999 || op <= 0.001) return null;
            const y = -96 + p * (96 + 8);
            const edge = l.edge ?? '#64748b';
            return (
              <g key={i} opacity={op} transform={`translate(${120 + (l.dx ?? 0) * (1 - p)} ${y}) rotate(${(l.tilt ?? 0) * (1 - p)})`}>
                <rect x={-46} y={0} width={92} height={62} rx={4} fill="#f1f5f9" stroke={edge} strokeWidth={2.5} />
                <path d="M -44 3 L 0 34 L 44 3" fill="none" stroke={edge} strokeWidth={2.5} strokeLinejoin="round" />
              </g>
            );
          })}
        </g>
      </svg>

      {/* The owner's key in the keyhole */}
      {ki > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: keyX * s,
            top: keyY * s,
            opacity: Math.min(1, ki * 2.2),
            transform: `scaleY(${1 - 0.55 * kt})`,
            transformOrigin: `0 ${22 * (keyW / PRIVATE_KEY_BASE.w) * s}px`,
          }}
        >
          <PrivateKey width={keyW * s} color={kColor} glow={0.4 * kg} />
        </div>
      ) : null}
    </div>
  );
}
