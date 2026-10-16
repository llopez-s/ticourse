import type { CSSProperties } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * The airport (canon: out/scene-brief.md «Shared parts»): one object, one function.
 *   - `Scanner` (YARA): the baggage X-ray scanner. It only LOOKS INSIDE the suitcase; when it reacts it
 *     lights a lamp on top (`beep`). Never a camera, never a bell.
 *   - `Gate` (Sigma): the boarding gate writes a line in its logbook for each passenger (card + passport,
 *     no time). Sigma does not write it: `lens` draws a magnifying glass that READS the logbook.
 *   - `BoardingCard` = the file name on disk (`Image`): its name can change (`changed` turns it rose).
 *   - `Passport` = the original name inside the program (`OriginalFileName`): it does not change.
 *   - `Suitcase`: closed and small (s05/s06 icons); `contents` adds a small X-ray window with items.
 *   - `ItemGlyph`: one luggage item, `'bottle' | 'umbrella' | 'book' | 'rare'` (the first three are what
 *     everybody carries; `'rare'` is an engraved metal part almost nobody carries).
 *
 * Used in: s02 (Scanner + Gate), s03 (Suitcase with bottle + umbrella; Scanner/ItemGlyph 'rare' = the PDB),
 * s04 (BoardingCard / Passport icons next to `Image` / `OriginalFileName`), s05 (Suitcase, Passport),
 * s06 (rule icons: Scanner + Gate small, Suitcase with a bottle, Passport), the poster.
 *
 * Pure and presentational: no timeline reads, no frame reads; every animation is a 0–1 prop. Each piece
 * sizes from `width` (height follows its aspect, exported as `*_ASPECT`) — wrap it in an absolutely
 * positioned div. Tones default to sky (the airport); pass `tone` to recolour.
 *
 * Props:
 *   Scanner      width, items: ItemKind[] (≤ 4, left to right inside the suitcase), flag?: index into
 *                items (ringed), flagTone (default emerald), xray 0–1 (default 1: contents visible),
 *                travel?: 0–1 (suitcase rides the belt: 0 waiting left, 0.5 inside, 1 out right; omit =
 *                inside), beep 0–1 (lamp lights), beepTone (default amber; emerald for a correct hit),
 *                tone, dim 0–1, style
 *   Gate         width, pass 0–1 (passenger walks through: 0 before the gate, 1 past the desk), write 0–1
 *                (the new log line is written: card + passport + bar), lines (earlier log lines, default
 *                4), lens 0–1 (magnifying glass over the logbook), lensTone (default cyan), tone, dim, style
 *   BoardingCard width, name? (mono text slot, auto-shrinks), changed 0–1 (border + name turn rose),
 *                tone, glow 0–1, dim, style
 *   Passport     width, name? (mono text on the cover band, auto-shrinks), tone, glow 0–1, dim, style
 *   Suitcase     width, contents?: ItemKind[] (X-ray window), flag?: index, flagTone, tone, glow, dim, style
 *   ItemGlyph    kind, size, tone, glow 0–1, style
 */

export type ItemKind = 'bottle' | 'umbrella' | 'book' | 'rare';

/** Height / width of each piece. */
export const SCANNER_ASPECT = 360 / 640;
export const GATE_ASPECT = 400 / 680;
export const CARD_ASPECT = 110 / 220;
export const PASSPORT_ASPECT = 200 / 148;
export const SUITCASE_ASPECT = 104 / 130;

const SKY_SOFT = '#7dd3fc';
const STEEL = '#cbd5e1';
const XRAY_BG = '#06233a';

function dimmed(d: number | undefined): CSSProperties {
  const k = clamp01(d ?? 0);
  return k > 0.001 ? { opacity: 1 - 0.6 * k, filter: `saturate(${1 - 0.6 * k})` } : {};
}

const glowFilter = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 16 * g)}px ${alpha(color, 0.6 * g)})` : undefined);

// ---------------------------------------------------------------------------
// Items (drawn in a 60×60 box centred on 0,0)

function ItemShape({ kind, tone, lit = 0 }: { kind: ItemKind; tone: string; lit?: number }) {
  const sw = 2.6;
  const fill = alpha(tone, 0.16 + 0.2 * lit);
  switch (kind) {
    case 'bottle':
      return (
        <g>
          <rect x={-6} y={-28} width={12} height={7} rx={2} fill={alpha(tone, 0.5)} stroke={tone} strokeWidth={sw} />
          <path d="M -5 -21 L -5 -14 C -5 -10 -14 -8 -14 -1 L -14 24 C -14 27 -12 28 -9 28 L 9 28 C 12 28 14 27 14 24 L 14 -1 C 14 -8 5 -10 5 -14 L 5 -21 Z" fill={fill} stroke={tone} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -14 6 C -7 3 0 9 14 5 L 14 24 C 14 27 12 28 9 28 L -9 28 C -12 28 -14 27 -14 24 Z" fill={alpha(tone, 0.32 + 0.2 * lit)} />
        </g>
      );
    case 'umbrella':
      return (
        <g transform="rotate(-38)">
          <path d="M 0 -30 L 8 14 L -8 14 Z" fill={fill} stroke={tone} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -3 -14 L -5 10 M 3 -14 L 5 10" stroke={alpha(tone, 0.6)} strokeWidth={1.6} />
          <rect x={-5} y={2} width={10} height={4} rx={1.5} fill={alpha(tone, 0.6)} />
          <path d="M 0 14 L 0 24 C 0 31 -9 31 -9 25" fill="none" stroke={tone} strokeWidth={sw + 0.6} strokeLinecap="round" />
        </g>
      );
    case 'book':
      return (
        <g transform="rotate(-8)">
          <rect x={-20} y={-25} width={40} height={50} rx={3} fill={fill} stroke={tone} strokeWidth={sw} />
          <path d="M -13 -25 L -13 25" stroke={tone} strokeWidth={sw} />
          <path d="M -7 -14 L 13 -14 M -7 -7 L 13 -7 M -7 0 L 8 0" stroke={alpha(tone, 0.65)} strokeWidth={2} strokeLinecap="round" />
        </g>
      );
    case 'rare':
    default: {
      // An engraved metal part: a toothed disc with an offset bore and engraved marks — nothing common looks like it
      const teeth = 10;
      const pts: string[] = [];
      for (let i = 0; i < teeth * 2; i++) {
        const ang = (Math.PI * i) / teeth;
        const r = i % 2 === 0 ? 27 : 21;
        const a0 = ang - Math.PI / (teeth * 2.6);
        const a1 = ang + Math.PI / (teeth * 2.6);
        pts.push(`${(r * Math.cos(a0)).toFixed(1)} ${(r * Math.sin(a0)).toFixed(1)}`, `${(r * Math.cos(a1)).toFixed(1)} ${(r * Math.sin(a1)).toFixed(1)}`);
      }
      const metal = lit > 0.01 ? tone : STEEL;
      return (
        <g>
          <path d={`M ${pts.join(' L ')} Z`} fill={alpha(metal, 0.28 + 0.2 * lit)} stroke={metal} strokeWidth={sw} strokeLinejoin="round" />
          <circle r={14} fill="none" stroke={alpha(metal, 0.8)} strokeWidth={1.8} strokeDasharray="3 3" />
          <circle cx={4} cy={-3} r={5.5} fill={XRAY_BG} stroke={metal} strokeWidth={2.2} />
          <path d="M -10 5 L -3 5 M -10 9 L 0 9 M -8 -9 L -4 -12" stroke={metal} strokeWidth={2} strokeLinecap="round" />
        </g>
      );
    }
  }
}

/** One luggage item as a standalone icon. */
export function ItemGlyph({ kind, size, tone = SKY_SOFT, glow = 0, style }: { kind: ItemKind; size: number; tone?: string; glow?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="-32 -32 64 64" style={{ display: 'block', overflow: 'visible', filter: glowFilter(tone, glow), ...style }}>
      <ItemShape kind={kind} tone={tone} lit={glow} />
    </svg>
  );
}

/** Item slots inside a suitcase box of w×h (centres). */
function itemSlots(n: number, w: number, h: number): { x: number; y: number; s: number }[] {
  const count = Math.max(1, Math.min(4, n));
  const s = Math.min(h * 0.72, (w * 0.9) / count) / 60;
  return Array.from({ length: count }, (_, i) => ({ x: (w * (i + 0.5)) / count, y: h / 2 + (i % 2 === 0 ? -2 : 3), s }));
}

// ---------------------------------------------------------------------------
// Scanner (viewBox 640×360)

export function Scanner({
  width,
  items,
  flag,
  flagTone = C.emerald,
  xray = 1,
  travel,
  beep = 0,
  beepTone = C.amber,
  tone = C.sky,
  dim,
  style,
}: {
  width: number;
  items: readonly ItemKind[];
  flag?: number;
  flagTone?: string;
  xray?: number;
  travel?: number;
  beep?: number;
  beepTone?: string;
  tone?: string;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = `scn${Math.round(width)}${items.join('')}`;
  const b = clamp01(beep);
  // Housing and its X-ray window
  const H = { x: 170, y: 64, w: 300, h: 240 };
  const WIN = { x: 192, y: 96, w: 256, h: 176 };
  const beltY = 300;
  // Suitcase on the belt (closed outside the window, X-ray inside)
  const SW = 210;
  const SH = 130;
  const t = travel === undefined ? 0.5 : clamp01(travel);
  // 0 → off the left edge, 0.5 → centred in the window, 1 → off the right edge
  const centredX = -SW - 10 + t * (640 + 20 + SW);
  const sy = beltY - SH - 2;
  const slots = itemSlots(items.length, SW - 30, SH - 30);
  const xr = clamp01(xray);
  return (
    <svg width={width} height={width * SCANNER_ASPECT} viewBox="0 0 640 360" style={{ display: 'block', overflow: 'visible', ...dimmed(dim), ...style }}>
      <defs>
        <clipPath id={`${id}-in`}>
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={10} />
        </clipPath>
        <clipPath id={`${id}-out`}>
          <path d={`M -400 -100 H 1040 V 460 H -400 Z M ${H.x} ${H.y} V ${H.y + H.h} H ${H.x + H.w} V ${H.y} Z`} clipRule="evenodd" />
        </clipPath>
        <pattern id={`${id}-grid`} width={16} height={16} patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke={alpha(tone, 0.12)} strokeWidth={1} />
        </pattern>
      </defs>

      {/* belt */}
      <rect x={0} y={beltY} width={640} height={16} rx={8} fill={alpha(tone, 0.12)} stroke={alpha(tone, 0.6)} strokeWidth={2.4} />
      {Array.from({ length: 13 }, (_, i) => (
        <circle key={i} cx={24 + i * 49.3 - ((t * 400) % 49.3)} cy={beltY + 8} r={3} fill={alpha(tone, 0.55)} />
      ))}
      <path d={`M 40 ${beltY + 16} L 30 346 M 600 ${beltY + 16} L 610 346`} stroke={alpha(tone, 0.55)} strokeWidth={4} strokeLinecap="round" />

      {/* closed suitcase, seen only outside the housing */}
      <g clipPath={`url(#${id}-out)`}>
        <SuitcaseShape x={centredX} y={sy} w={SW} h={SH} tone={tone} />
      </g>

      {/* housing */}
      <rect x={H.x} y={H.y} width={H.w} height={H.h} rx={18} fill={C.ink850} stroke={tone} strokeWidth={3} />
      <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={10} fill={XRAY_BG} stroke={alpha(tone, 0.7)} strokeWidth={2} />
      <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={10} fill={`url(#${id}-grid)`} />
      {/* lead curtains at the mouths */}
      {[H.x + 4, H.x + H.w - 10].map((x, k) => (
        <g key={k}>
          {[0, 1, 2].map((j) => (
            <rect key={j} x={x + j * 2} y={WIN.y + WIN.h + 4} width={4} height={beltY - (WIN.y + WIN.h) - 6} rx={1} fill={alpha(tone, 0.25)} />
          ))}
        </g>
      ))}

      {/* inside: the X-ray view of the suitcase and what it carries */}
      <g clipPath={`url(#${id}-in)`} opacity={xr}>
        <rect x={centredX} y={WIN.y + (WIN.h - SH) / 2} width={SW} height={SH} rx={14} fill={alpha(SKY_SOFT, 0.06)} stroke={alpha(SKY_SOFT, 0.45)} strokeWidth={2} strokeDasharray="7 5" />
        {items.slice(0, 4).map((k, i) => {
          const s = slots[i];
          const x = centredX + 15 + s.x;
          const y = WIN.y + (WIN.h - SH) / 2 + 15 + s.y;
          const flagged = flag === i;
          const toneI = flagged ? flagTone : k === 'rare' ? STEEL : SKY_SOFT;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s.s})`}>
              {flagged ? <rect x={-36} y={-36} width={72} height={72} rx={14} fill={alpha(flagTone, 0.14)} stroke={flagTone} strokeWidth={3.2 / s.s} /> : null}
              <ItemShape kind={k} tone={toneI} lit={flagged ? 1 : 0} />
            </g>
          );
        })}
      </g>

      {/* the lamp on top: it lights when the scanner reacts */}
      <g>
        {b > 0.01 ? <circle cx={320} cy={44} r={20 + 26 * b} fill={alpha(beepTone, 0.22 * b)} /> : null}
        <path d="M 302 64 L 302 50 C 302 36 338 36 338 50 L 338 64 Z" fill={b > 0.01 ? alpha(beepTone, 0.35 + 0.6 * b) : alpha(tone, 0.14)} stroke={b > 0.01 ? beepTone : tone} strokeWidth={2.6} />
        <rect x={294} y={62} width={52} height={6} rx={3} fill={tone} />
        {b > 0.01
          ? [-60, -30, 0, 30, 60].map((deg) => {
              const r0 = 30;
              const r1 = 30 + 16 * b;
              const a = ((deg - 90) * Math.PI) / 180;
              return (
                <path
                  key={deg}
                  d={`M ${320 + r0 * Math.cos(a)} ${50 + r0 * Math.sin(a)} L ${320 + r1 * Math.cos(a)} ${50 + r1 * Math.sin(a)}`}
                  stroke={beepTone}
                  strokeWidth={3.4}
                  strokeLinecap="round"
                  opacity={b}
                />
              );
            })
          : null}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Suitcase

function SuitcaseShape({ x, y, w, h, tone, fill }: { x: number; y: number; w: number; h: number; tone: string; fill?: string }) {
  const hw = w * 0.3;
  return (
    <g>
      <path
        d={`M ${x + w / 2 - hw / 2} ${y} L ${x + w / 2 - hw / 2} ${y - h * 0.14} C ${x + w / 2 - hw / 2} ${y - h * 0.2} ${x + w / 2 + hw / 2} ${y - h * 0.2} ${x + w / 2 + hw / 2} ${y - h * 0.14} L ${x + w / 2 + hw / 2} ${y}`}
        fill="none"
        stroke={tone}
        strokeWidth={3}
      />
      <rect x={x} y={y} width={w} height={h} rx={Math.min(16, h * 0.16)} fill={fill ?? alpha(tone, 0.16)} stroke={tone} strokeWidth={3} />
      <path d={`M ${x + w * 0.24} ${y + 4} L ${x + w * 0.24} ${y + h - 4} M ${x + w * 0.76} ${y + 4} L ${x + w * 0.76} ${y + h - 4}`} stroke={alpha(tone, 0.6)} strokeWidth={3} />
    </g>
  );
}

export function Suitcase({
  width,
  contents,
  flag,
  flagTone = C.emerald,
  tone = C.sky,
  glow = 0,
  dim,
  style,
}: {
  width: number;
  contents?: readonly ItemKind[];
  flag?: number;
  flagTone?: string;
  tone?: string;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const W = 130;
  const top = 18;
  const bodyH = 104 - top - 3;
  const win = { x: 14, y: top + 12, w: W - 28, h: bodyH - 24 };
  const slots = contents ? itemSlots(contents.length, win.w, win.h) : [];
  return (
    <svg width={width} height={width * SUITCASE_ASPECT} viewBox="0 0 130 104" style={{ display: 'block', overflow: 'visible', filter: glowFilter(tone, glow), ...dimmed(dim), ...style }}>
      <SuitcaseShape x={1.5} y={top} w={W - 3} h={bodyH} tone={tone} />
      {contents ? (
        <g>
          <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={7} fill={XRAY_BG} stroke={alpha(SKY_SOFT, 0.7)} strokeWidth={1.8} />
          {contents.slice(0, 4).map((k, i) => {
            const s = slots[i];
            const flagged = flag === i;
            return (
              <g key={i} transform={`translate(${win.x + s.x} ${win.y + s.y}) scale(${s.s})`}>
                <ItemShape kind={k} tone={flagged ? flagTone : k === 'rare' ? STEEL : SKY_SOFT} lit={flagged ? 1 : 0} />
              </g>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Documents

const fitMono = (text: string, slotW: number, max: number) => Math.min(max, slotW / Math.max(1, text.length * 0.6));

export function BoardingCard({
  width,
  name,
  changed = 0,
  tone = C.sky,
  glow = 0,
  dim,
  style,
}: {
  width: number;
  name?: string;
  changed?: number;
  tone?: string;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const k = clamp01(changed);
  const edge = k > 0.5 ? C.rose : tone;
  const nameColor = k > 0.5 ? C.roseSoft : C.textStrong;
  const fs = name ? fitMono(name, 140, 24) : 0;
  return (
    <svg width={width} height={width * CARD_ASPECT} viewBox="0 0 220 110" style={{ display: 'block', overflow: 'visible', filter: glowFilter(edge, Math.max(glow, k * 0.6)), ...dimmed(dim), ...style }}>
      <rect x={1.5} y={1.5} width={217} height={107} rx={12} fill={alpha(edge, 0.12)} stroke={edge} strokeWidth={3} />
      <path d="M 166 6 L 166 104" stroke={alpha(edge, 0.7)} strokeWidth={2} strokeDasharray="5 5" />
      {/* plane glyph */}
      <g transform="translate(26 26) rotate(45) scale(0.9)">
        <path d="M 0 -15 C 2 -15 3 -12 3 -9 L 3 -3 L 15 4 L 15 8 L 3 4 L 3 10 L 7 13 L 7 16 L 0 14 L -7 16 L -7 13 L -3 10 L -3 4 L -15 8 L -15 4 L -3 -3 L -3 -9 C -3 -12 -2 -15 0 -15 Z" fill={edge} />
      </g>
      <rect x={48} y={18} width={70} height={9} rx={4.5} fill={alpha(edge, 0.45)} />
      {name ? (
        <text x={20} y={70} fontFamily={FONT.mono} fontSize={fs} fontWeight={700} fill={nameColor}>
          {name}
        </text>
      ) : (
        <rect x={20} y={56} width={120} height={14} rx={7} fill={alpha(edge, 0.55)} />
      )}
      <rect x={20} y={86} width={84} height={8} rx={4} fill={alpha(edge, 0.3)} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={178} y={22 + i * 18} width={28} height={8} rx={4} fill={alpha(edge, 0.35)} />
      ))}
    </svg>
  );
}

export function Passport({
  width,
  name,
  tone = C.sky,
  glow = 0,
  dim,
  style,
}: {
  width: number;
  name?: string;
  tone?: string;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const fs = name ? fitMono(name, 116, 22) : 0;
  return (
    <svg width={width} height={width * PASSPORT_ASPECT} viewBox="0 0 148 200" style={{ display: 'block', overflow: 'visible', filter: glowFilter(tone, glow), ...dimmed(dim), ...style }}>
      <rect x={1.5} y={1.5} width={145} height={197} rx={12} fill={alpha(tone, 0.16)} stroke={tone} strokeWidth={3} />
      <path d="M 14 4 L 14 196" stroke={alpha(tone, 0.45)} strokeWidth={2} />
      <rect x={44} y={22} width={74} height={9} rx={4.5} fill={alpha(tone, 0.55)} />
      {/* emblem: a globe */}
      <g transform="translate(81 82)">
        <circle r={30} fill="none" stroke={tone} strokeWidth={3} />
        <ellipse rx={13} ry={30} fill="none" stroke={tone} strokeWidth={2.2} />
        <path d="M -30 0 L 30 0 M -26 -15 L 26 -15 M -26 15 L 26 15" stroke={tone} strokeWidth={2} />
      </g>
      {name ? (
        <g>
          <rect x={20} y={134} width={122} height={36} rx={7} fill={alpha(C.ink950, 0.6)} stroke={alpha(tone, 0.6)} strokeWidth={1.6} />
          <text x={81} y={152} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={fs} fontWeight={700} fill={C.textStrong}>
            {name}
          </text>
        </g>
      ) : (
        <>
          <rect x={40} y={140} width={82} height={9} rx={4.5} fill={alpha(tone, 0.45)} />
          <rect x={52} y={158} width={58} height={8} rx={4} fill={alpha(tone, 0.3)} />
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Gate (viewBox 680×400): the gate on the left, the desk with its logbook on the right

export function Gate({
  width,
  pass = 0.5,
  write = 1,
  lines = 4,
  lens = 0,
  lensTone = C.cyan,
  tone = C.sky,
  dim,
  style,
}: {
  width: number;
  pass?: number;
  write?: number;
  lines?: number;
  lens?: number;
  lensTone?: string;
  tone?: string;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = `gate${Math.round(width)}`;
  const p = clamp01(pass);
  const w = clamp01(write);
  const l = clamp01(lens);
  const floor = 372;
  // logbook on a lectern, open, facing us
  const BOOK = { x: 344, y: 116, w: 300, h: 184 };
  const rowH = 30;
  const rows = Math.max(0, Math.min(4, lines));
  const rowY = (i: number) => BOOK.y + 28 + i * rowH;
  const newRow = rows; // the row being written
  // centre of the magnifying glass: over the card + passport of the rows
  const LX = BOOK.x + 88;
  const LY = BOOK.y + 96;
  // passenger walks from x 30 to x 290
  const px = 40 + p * 240;

  const gutter = BOOK.x + BOOK.w / 2;
  const leftBar = [52, 38, 46, 30, 50];
  const rightBar = [96, 70, 104, 60, 88];
  const grow = (from: number, to: number) => clamp01((w - from) / (to - from));
  const logRows = (scale = 1) => (
    <g>
      {Array.from({ length: rows }, (_, i) => (
        <g key={i}>
          <rect x={BOOK.x + 26} y={rowY(i) + 6} width={18} height={11} rx={2} fill={alpha(tone, 0.45)} />
          <rect x={BOOK.x + 50} y={rowY(i) + 4} width={11} height={15} rx={2} fill={alpha(tone, 0.45)} />
          <rect x={BOOK.x + 70} y={rowY(i) + 8} width={leftBar[i % 5]} height={7} rx={3.5} fill={alpha(C.muted, 0.55)} />
          <rect x={gutter + 18} y={rowY(i) + 8} width={rightBar[i % 5]} height={7} rx={3.5} fill={alpha(C.muted, 0.55)} />
        </g>
      ))}
      {w > 0.01 ? (
        <g>
          <rect x={BOOK.x + 24} y={rowY(newRow) + 4} width={22 * grow(0, 0.2)} height={14} rx={2.5} fill={alpha(tone, 0.25)} stroke={tone} strokeWidth={1.6 / scale} />
          {w > 0.2 ? <rect x={BOOK.x + 50} y={rowY(newRow) + 1} width={13} height={20 * grow(0.2, 0.35)} rx={2.5} fill={alpha(tone, 0.25)} stroke={tone} strokeWidth={1.6 / scale} /> : null}
          <rect x={BOOK.x + 72} y={rowY(newRow) + 8} width={56 * grow(0.35, 0.6)} height={7} rx={3.5} fill={C.text} />
          <rect x={gutter + 18} y={rowY(newRow) + 8} width={100 * grow(0.6, 1)} height={7} rx={3.5} fill={C.text} />
        </g>
      ) : null}
    </g>
  );
  // the open book: two pages whose top and bottom edges curve into the gutter
  const bx0 = BOOK.x;
  const bx1 = BOOK.x + BOOK.w;
  const by0 = BOOK.y;
  const by1 = BOOK.y + BOOK.h;
  const bookPath = `M ${bx0} ${by0 + 4} Q ${(bx0 + gutter) / 2} ${by0 - 10} ${gutter} ${by0 + 6} Q ${(gutter + bx1) / 2} ${by0 - 10} ${bx1} ${by0 + 4} L ${bx1} ${by1} Q ${(gutter + bx1) / 2} ${by1 - 12} ${gutter} ${by1 + 2} Q ${(bx0 + gutter) / 2} ${by1 - 12} ${bx0} ${by1} Z`;

  return (
    <svg width={width} height={width * GATE_ASPECT} viewBox="0 0 680 400" style={{ display: 'block', overflow: 'visible', ...dimmed(dim), ...style }}>
      <defs>
        <clipPath id={`${id}-lens`}>
          <circle cx={LX} cy={LY} r={78} />
        </clipPath>
      </defs>
      {/* floor */}
      <path d={`M 0 ${floor} L 680 ${floor}`} stroke={alpha(tone, 0.4)} strokeWidth={2} />

      {/* the gate: two posts and a header with a plane sign */}
      <rect x={110} y={88} width={14} height={floor - 88} rx={4} fill={alpha(tone, 0.2)} stroke={tone} strokeWidth={2.6} />
      <rect x={250} y={88} width={14} height={floor - 88} rx={4} fill={alpha(tone, 0.2)} stroke={tone} strokeWidth={2.6} />
      <rect x={96} y={50} width={182} height={44} rx={10} fill={C.ink850} stroke={tone} strokeWidth={2.6} />
      <g transform="translate(187 72) rotate(90) scale(1.05)">
        <path d="M 0 -15 C 2 -15 3 -12 3 -9 L 3 -3 L 15 4 L 15 8 L 3 4 L 3 10 L 7 13 L 7 16 L 0 14 L -7 16 L -7 13 L -3 10 L -3 4 L -15 8 L -15 4 L -3 -3 L -3 -9 C -3 -12 -2 -15 0 -15 Z" fill={tone} />
      </g>

      {/* the passenger, holding the card and the passport */}
      <g transform={`translate(${px} 0)`}>
        <circle cx={0} cy={188} r={22} fill={alpha(C.text, 0.2)} stroke={C.text} strokeWidth={2.6} />
        <path d={`M -30 ${floor} L -30 254 C -30 226 -18 216 0 216 C 18 216 30 226 30 254 L 30 ${floor} Z`} fill={alpha(C.text, 0.14)} stroke={C.text} strokeWidth={2.6} strokeLinejoin="round" />
        <g transform="translate(18 246) rotate(-8)">
          <rect x={0} y={0} width={36} height={20} rx={3} fill={alpha(tone, 0.35)} stroke={tone} strokeWidth={2} />
          <rect x={20} y={-10} width={20} height={28} rx={3} fill={alpha(tone, 0.35)} stroke={tone} strokeWidth={2} transform="translate(14 0)" />
        </g>
      </g>

      {/* lectern + logbook: a sloped board on one post, the open book on it */}
      <path d={`M ${gutter} ${by1 + 16} L ${gutter} ${floor} M ${gutter - 56} ${floor} L ${gutter + 56} ${floor}`} stroke={alpha(tone, 0.7)} strokeWidth={6} strokeLinecap="round" />
      <path d={`M ${bx0 - 18} ${by1 + 18} L ${bx1 + 18} ${by1 + 18}`} stroke={tone} strokeWidth={6} strokeLinecap="round" />
      <path d={`M ${bx0 - 6} ${by0 + 10} L ${bx0 - 6} ${by1 + 10} Q ${(bx0 + gutter) / 2} ${by1 - 2} ${gutter} ${by1 + 12} Q ${(gutter + bx1) / 2} ${by1 - 2} ${bx1 + 6} ${by1 + 10} L ${bx1 + 6} ${by0 + 10}`} fill={alpha(tone, 0.18)} stroke={tone} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={bookPath} fill={C.ink900} stroke={tone} strokeWidth={2.6} strokeLinejoin="round" />
      <path d={`M ${gutter} ${by0 + 6} L ${gutter} ${by1 + 2}`} stroke={alpha(tone, 0.55)} strokeWidth={2} />
      {logRows()}

      {/* the magnifying glass that READS the logbook */}
      {l > 0.01 ? (
        <g opacity={l} transform={`translate(${(1 - l) * 40} ${(1 - l) * 30})`}>
          <g clipPath={`url(#${id}-lens)`}>
            <circle cx={LX} cy={LY} r={78} fill={alpha(C.ink900, 0.96)} />
            <g transform={`translate(${LX} ${LY}) scale(1.3) translate(${-(LX)} ${-(LY)})`}>{logRows(1.3)}</g>
            <circle cx={LX} cy={LY} r={78} fill={alpha(lensTone, 0.08)} />
          </g>
          <circle cx={LX} cy={LY} r={78} fill="none" stroke={lensTone} strokeWidth={7} />
          <path d={`M ${LX + 55} ${LY + 55} L ${LX + 112} ${LY + 112}`} stroke={lensTone} strokeWidth={16} strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
}
