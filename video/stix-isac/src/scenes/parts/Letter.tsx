import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * Image 3 of stix-isac: the letter and the mail (STIX vs TAXII).
 *
 *   Letter       a sheet of paper: date in the corner (the STIX `created`),
 *                a content box for the STIX JSON in miniature (children, or
 *                faux code lines), and the sharing mark (`tlp-amber-strict`)
 *                printed INSIDE the letter, which lights amber with `marking`
 *   Envelope     the mail (TAXII), sky: the flap opens and paper edges peek
 *                out (one envelope carries several letters)
 *   PoBoxes      the ISAC's row of PO boxes (TAXII collections), no names;
 *                one door can swing open showing the letters inside
 *   LetterMini   letter + envelope side by side, icon-sized (s06 rule-3)
 *
 * Animated inputs are 0–1 values computed by the scene. Each piece is drawn at
 * a base size and scaled to `width`.
 */

export const PAPER = { fill: '#efe9dc', edge: '#d8cfbd', ink: '#334155', faint: '#9aa3b0' } as const;

// ---------------------------------------------------------------------------
// Letter

export const LETTER = {
  w: 440,
  h: 560,
  /** Where the JSON mini goes (base units): scale it into this box. */
  content: { x: 26, y: 82, w: 388, h: 233 },
  /** The marking strip, inside the letter. */
  mark: { x: 26, y: 334, w: 388, h: 88 },
} as const;

export function letterHeight(width: number): number {
  return (LETTER.h * width) / LETTER.w;
}

/** Faux code lines (braces + bars) for letters whose JSON is not drawn. */
export function FauxJson({ w, h, color = PAPER.faint, rows = 11 }: { w: number; h: number; color?: string; rows?: number }) {
  const step = h / (rows + 1);
  const widths = [0.12, 0.62, 0.48, 0.86, 0.7, 0.7, 0.66, 0.78, 0.44, 0.9, 0.58, 0.62, 0.5, 0.82, 0.12];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x={0} y={0} width={w} height={h} rx={12} fill={C.ink900} />
      {Array.from({ length: rows }, (_, i) => {
        const first = i === 0;
        const last = i === rows - 1;
        const x = first || last ? 16 : 40;
        const lw = (w - x - 20) * widths[i % widths.length];
        return <rect key={i} x={x} y={step * (i + 0.6)} width={first || last ? 14 : lw} height={Math.max(4, step * 0.34)} rx={3} fill={alpha(i % 3 === 1 ? C.cyanSoft : color, 0.55)} />;
      })}
    </svg>
  );
}

/**
 * The letter. `children` is drawn in the content box (LETTER.content, base
 * units) — scale your JSON mini into it. `marking` (0–1) lights the sharing
 * mark inside the letter (unlit it is printed faint on the paper).
 */
export function Letter({
  width = LETTER.w,
  date,
  dateSize = 32,
  markingText = 'tlp-amber-strict',
  marking = 0,
  showMark = true,
  children,
  show = 1,
  glow = 0,
  dim = 0,
  style,
}: {
  width?: number;
  /** Corner date, e.g. «11-03» (the STIX `created`). */
  date?: string;
  /** Date font size in base units (the letter is 440 wide); raise it when the letter is drawn small. */
  dateSize?: number;
  markingText?: string;
  /** 0–1: the mark lights amber. */
  marking?: number;
  /** Print the mark strip at all (letters of the fan may omit it). */
  showMark?: boolean;
  children?: ReactNode;
  /** 0–1 appear. */
  show?: number;
  /** 0–1 halo (cyan). */
  glow?: number;
  /** 0–1 step back. */
  dim?: number;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const s = width / LETTER.w;
  const g = clamp01(glow);
  const d = clamp01(dim);
  const m = clamp01(marking);
  const fold = 54;
  return (
    <div style={{ position: 'relative', width, height: LETTER.h * s, opacity: sh * (1 - 0.6 * d), filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: LETTER.w,
          height: LETTER.h,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          filter: g > 0.02 ? `drop-shadow(0 0 ${Math.round(10 + 24 * g)}px ${alpha(C.cyan, 0.55 * g)})` : `drop-shadow(0 22px 34px ${alpha('#000000', 0.5)})`,
        }}
      >
        {/* Paper with a folded top-right corner. */}
        <svg width={LETTER.w} height={LETTER.h} viewBox={`0 0 ${LETTER.w} ${LETTER.h}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path
            d={`M 10 0 H ${LETTER.w - fold} L ${LETTER.w} ${fold} V ${LETTER.h - 10} Q ${LETTER.w} ${LETTER.h} ${LETTER.w - 10} ${LETTER.h} H 10 Q 0 ${LETTER.h} 0 ${LETTER.h - 10} V 10 Q 0 0 10 0 Z`}
            fill={PAPER.fill}
            stroke={g > 0.3 ? alpha(C.cyan, 0.5 + 0.5 * g) : PAPER.edge}
            strokeWidth={g > 0.3 ? 4 : 2}
          />
          <path d={`M ${LETTER.w - fold} 0 V ${fold - 8} Q ${LETTER.w - fold} ${fold} ${LETTER.w - fold + 8} ${fold} H ${LETTER.w} Z`} fill={PAPER.edge} />
          {/* sender lines, top-left (no text) */}
          <rect x={26} y={26} width={120} height={10} rx={5} fill={alpha(PAPER.ink, 0.45)} />
          <rect x={26} y={46} width={80} height={8} rx={4} fill={alpha(PAPER.ink, 0.25)} />
          {/* closing lines + signature under the mark (no text) */}
          <rect x={26} y={446} width={330} height={9} rx={4.5} fill={alpha(PAPER.ink, 0.22)} />
          <rect x={26} y={468} width={270} height={9} rx={4.5} fill={alpha(PAPER.ink, 0.22)} />
          <path d="M 250 520 C 270 498 286 530 304 510 S 336 500 352 516 S 384 506 400 512" fill="none" stroke={alpha(PAPER.ink, 0.45)} strokeWidth={3} strokeLinecap="round" />
        </svg>
        {date ? (
          <div
            style={{
              position: 'absolute',
              right: fold + 8,
              top: Math.max(8, 30 - dateSize / 2),
              fontFamily: FONT.mono,
              fontSize: dateSize,
              lineHeight: 1,
              fontWeight: 800,
              color: PAPER.ink,
              letterSpacing: -0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {date}
          </div>
        ) : null}
        {/* Content box: the JSON mini. */}
        <div style={{ position: 'absolute', left: LETTER.content.x, top: LETTER.content.y, width: LETTER.content.w, height: LETTER.content.h, overflow: 'hidden', borderRadius: 12 }}>
          {children ?? <FauxJson w={LETTER.content.w} h={LETTER.content.h} />}
        </div>
        {/* The sharing mark, inside the letter. */}
        {showMark ? (
          <div
            style={{
              position: 'absolute',
              left: LETTER.mark.x,
              top: LETTER.mark.y,
              width: LETTER.mark.w,
              height: LETTER.mark.h,
              boxSizing: 'border-box',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 14,
              border: `3px ${m > 0.5 ? 'solid' : 'dashed'} ${m > 0.02 ? alpha(C.amber, 0.4 + 0.6 * m) : alpha(PAPER.ink, 0.3)}`,
              background: m > 0.02 ? alpha('#3b1d06', 0.9 * m) : 'transparent',
              boxShadow: m > 0.02 ? `0 0 ${Math.round(30 * m)}px ${alpha(C.amber, 0.55 * m)}` : 'none',
              fontFamily: FONT.mono,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: -0.5,
              whiteSpace: 'nowrap',
              color: m > 0.4 ? '#fcd34d' : alpha(PAPER.ink, 0.55 + 0.3 * m),
            }}
          >
            {markingText}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Envelope

export const ENVELOPE = { w: 420, h: 270, flap: 150 } as const;

export function envelopeHeight(width: number): number {
  return (ENVELOPE.h * width) / ENVELOPE.w;
}

/**
 * The envelope (TAXII). `open` (0–1) flips the flap up; `letters` paper edges
 * peek out of the open envelope (`fill` 0–1 raises them). The flap opens above
 * the box (overflow visible: leave ~flap×scale px free above it).
 */
export function Envelope({
  width = ENVELOPE.w,
  open = 0,
  letters = 0,
  fill = 1,
  show = 1,
  glow = 0,
  dim = 0,
  color = C.sky,
  style,
}: {
  width?: number;
  open?: number;
  /** Paper edges peeking out (0 = empty). */
  letters?: number;
  /** 0–1: how far the paper edges rise. */
  fill?: number;
  show?: number;
  glow?: number;
  dim?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const s = width / ENVELOPE.w;
  const o = clamp01(open);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const W = ENVELOPE.w;
  const H = ENVELOPE.h;
  const F = ENVELOPE.flap;
  // Flap tip: below the top edge when closed, above it when open.
  const tipY = F * (1 - 2 * o) * 0.9;
  const rise = clamp01(fill) * o;
  return (
    <div style={{ position: 'relative', width, height: H * s, opacity: sh * (1 - 0.6 * d), filter: d > 0.01 ? `saturate(${1 - 0.5 * d})` : undefined, ...style }}>
      <svg
        width={W}
        height={H + F}
        viewBox={`0 ${-F} ${W} ${H + F}`}
        style={{
          position: 'absolute',
          left: 0,
          top: -F * s,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          overflow: 'visible',
          filter: g > 0.02 ? `drop-shadow(0 0 ${Math.round(10 + 22 * g)}px ${alpha(color, 0.6 * g)})` : `drop-shadow(0 22px 30px ${alpha('#000000', 0.45)})`,
        }}
      >
        {/* back */}
        <rect x={0} y={0} width={W} height={H} rx={18} fill={C.ink800} stroke={alpha(color, 0.9)} strokeWidth={4} />
        {/* open flap behind the letters */}
        {o > 0.5 ? <path d={`M 4 4 L ${W / 2} ${tipY} L ${W - 4} 4 Z`} fill={alpha(color, 0.22)} stroke={alpha(color, 0.9)} strokeWidth={4} strokeLinejoin="round" /> : null}
        {/* letters peeking out */}
        {Array.from({ length: Math.max(0, Math.round(letters)) }, (_, i) => {
          const n = Math.max(1, Math.round(letters));
          const lx = 40 + i * ((W - 80 - 250) / Math.max(1, n - 1));
          const top = 40 - rise * (60 + (i % 2) * 16);
          return <rect key={i} x={n === 1 ? (W - 250) / 2 : lx} y={top} width={250} height={H - 60} rx={8} fill={PAPER.fill} stroke={PAPER.edge} strokeWidth={2} />;
        })}
        {/* front pocket */}
        <path
          d={`M 2 ${H * 0.34} L ${W / 2} ${H * 0.7} L ${W - 2} ${H * 0.34} V ${H - 18} Q ${W - 2} ${H - 2} ${W - 18} ${H - 2} H 18 Q 2 ${H - 2} 2 ${H - 18} Z`}
          fill={`${C.ink850}`}
          stroke={alpha(color, 0.9)}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path d={`M 2 ${H - 18} L ${W * 0.38} ${H * 0.56} M ${W - 2} ${H - 18} L ${W * 0.62} ${H * 0.56}`} stroke={alpha(color, 0.5)} strokeWidth={3} fill="none" />
        {/* closed flap in front */}
        {o <= 0.5 ? <path d={`M 4 4 L ${W / 2} ${tipY} L ${W - 4} 4 Z`} fill={C.ink700} stroke={alpha(color, 0.9)} strokeWidth={4} strokeLinejoin="round" /> : null}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PO boxes

export const POBOX = { box: 104, boxH: 136, gap: 18, pad: 26 } as const;

/** Width of a row of `count` PO boxes at scale 1. */
export function poBoxesWidth(count: number): number {
  return POBOX.pad * 2 + count * POBOX.box + (count - 1) * POBOX.gap;
}

/** Centre x (at scale 1, from the row's left edge) of box `i`. */
export function poBoxCenterX(i: number): number {
  return POBOX.pad + i * (POBOX.box + POBOX.gap) + POBOX.box / 2;
}

/**
 * A row of PO boxes (no names). Box `active` can glow, receive a letter
 * (`drop` 0–1: a paper edge slides into its slot) and swing open (`open` 0–1),
 * showing a stack of letters inside.
 */
export function PoBoxes({
  count = 5,
  width,
  active = -1,
  glow = 0,
  open = 0,
  drop = 0,
  contents = 1,
  show = 1,
  dim = 0,
  color = C.sky,
  style,
}: {
  count?: number;
  width?: number;
  active?: number;
  glow?: number;
  open?: number;
  drop?: number;
  /** 0–1: the letters inside the open box (fade them as they leave). */
  contents?: number;
  show?: number;
  dim?: number;
  color?: string;
  style?: CSSProperties;
}) {
  const sh = clamp01(show);
  if (sh <= 0) return null;
  const ct = clamp01(contents);
  const baseW = poBoxesWidth(count);
  const baseH = POBOX.boxH + POBOX.pad * 2;
  const s = (width ?? baseW) / baseW;
  const g = clamp01(glow);
  const o = clamp01(open);
  const dr = clamp01(drop);
  const d = clamp01(dim);
  return (
    <div style={{ position: 'relative', width: baseW * s, height: baseH * s, opacity: sh * (1 - 0.6 * d), ...style }}>
      <svg width={baseW} height={baseH} viewBox={`0 0 ${baseW} ${baseH}`} style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${s})`, transformOrigin: '0 0', overflow: 'visible' }}>
        <rect x={0} y={0} width={baseW} height={baseH} rx={20} fill={C.ink850} stroke={alpha(color, 0.55)} strokeWidth={3} />
        {Array.from({ length: count }, (_, i) => {
          const x = POBOX.pad + i * (POBOX.box + POBOX.gap);
          const y = POBOX.pad;
          const isActive = i === active;
          const gg = isActive ? g : 0;
          const oo = isActive ? o : 0;
          const doorW = POBOX.box * (1 - 0.86 * oo);
          return (
            <g key={i}>
              {/* interior: a stack of letters */}
              <rect x={x} y={y} width={POBOX.box} height={POBOX.boxH} rx={8} fill={C.ink950} stroke={alpha(color, 0.35)} strokeWidth={2} />
              {oo > 0.02
                ? [0, 1, 2, 3].map((k) => <rect key={k} x={x + 14 + k * 3} y={y + 36 + k * 18} width={POBOX.box - 28} height={14} rx={3} fill={PAPER.fill} stroke={PAPER.edge} strokeWidth={1.5} opacity={oo * ct} />)
                : null}
              {/* a letter going in through the slot */}
              {isActive && dr > 0.02 && dr < 0.999 ? (
                <rect x={x + 20} y={y + 26 - 60 * (1 - dr)} width={POBOX.box - 40} height={70 * (1 - dr) + 6} rx={4} fill={PAPER.fill} stroke={PAPER.edge} strokeWidth={2} />
              ) : null}
              {/* door (swings to the left) */}
              <g>
                <rect
                  x={x}
                  y={y}
                  width={doorW}
                  height={POBOX.boxH}
                  rx={8}
                  fill={isActive ? alpha(color, 0.12 + 0.18 * gg) : C.ink800}
                  stroke={isActive && gg > 0.02 ? color : alpha(color, 0.6)}
                  strokeWidth={isActive && gg > 0.3 ? 4 : 3}
                  style={{ filter: gg > 0.02 ? `drop-shadow(0 0 ${Math.round(16 * gg)}px ${alpha(color, 0.7 * gg)})` : undefined }}
                />
                {oo < 0.6 ? (
                  <>
                    {/* slot */}
                    <rect x={x + 18 * (doorW / POBOX.box)} y={y + 22} width={(POBOX.box - 36) * (doorW / POBOX.box)} height={10} rx={5} fill={C.ink950} />
                    {/* glass window */}
                    <rect x={x + 18 * (doorW / POBOX.box)} y={y + 50} width={(POBOX.box - 36) * (doorW / POBOX.box)} height={44} rx={6} fill={alpha(color, 0.12)} stroke={alpha(color, 0.4)} strokeWidth={2} />
                    {/* lock */}
                    <circle cx={x + doorW - 20 * (doorW / POBOX.box)} cy={y + POBOX.boxH - 22} r={7} fill="none" stroke={alpha(color, 0.8)} strokeWidth={3} />
                  </>
                ) : null}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini

export const LETTER_MINI = { w: 300, h: 170 } as const;

/** Letter (with its amber mark inside) beside an envelope — icon-sized, for s06 rule-3. */
export function LetterMini({ width = LETTER_MINI.w, glow = 0 }: { width?: number; glow?: number }) {
  const s = width / LETTER_MINI.w;
  const g = clamp01(glow);
  return (
    <div style={{ position: 'relative', width, height: LETTER_MINI.h * s }}>
      <svg
        width={LETTER_MINI.w}
        height={LETTER_MINI.h}
        viewBox={`0 0 ${LETTER_MINI.w} ${LETTER_MINI.h}`}
        style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${s})`, transformOrigin: '0 0', overflow: 'visible' }}
      >
        {/* letter */}
        <g style={{ filter: g > 0.02 ? `drop-shadow(0 0 ${Math.round(12 * g)}px ${alpha(C.cyan, 0.6 * g)})` : undefined }}>
          <path d="M 12 4 H 98 L 120 26 V 160 Q 120 166 114 166 H 12 Q 6 166 6 160 V 10 Q 6 4 12 4 Z" fill={PAPER.fill} stroke={PAPER.edge} strokeWidth={2} />
          <path d="M 98 4 V 22 Q 98 26 102 26 H 120 Z" fill={PAPER.edge} />
          <rect x={18} y={34} width={90} height={74} rx={6} fill={C.ink900} />
          {[0, 1, 2, 3, 4].map((k) => (
            <rect key={k} x={k === 0 || k === 4 ? 24 : 32} y={42 + k * 13} width={k === 0 || k === 4 ? 6 : 40 + ((k * 23) % 34)} height={5} rx={2.5} fill={alpha(k % 2 ? C.cyanSoft : PAPER.faint, 0.6)} />
          ))}
          <rect x={18} y={120} width={90} height={30} rx={7} fill="#3b1d06" stroke={C.amber} strokeWidth={3} />
          <rect x={30} y={131} width={66} height={8} rx={4} fill="#fcd34d" />
        </g>
        {/* envelope */}
        <g>
          <rect x={150} y={52} width={144} height={96} rx={10} fill={C.ink800} stroke={C.sky} strokeWidth={4} />
          <path d="M 152 56 L 222 104 L 292 56" fill="none" stroke={C.sky} strokeWidth={4} strokeLinejoin="round" />
          <path d="M 152 144 L 202 98 M 292 144 L 242 98" stroke={alpha(C.sky, 0.5)} strokeWidth={3} fill="none" />
        </g>
      </svg>
    </div>
  );
}
