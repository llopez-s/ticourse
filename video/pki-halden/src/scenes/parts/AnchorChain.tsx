import { useId, type CSSProperties, type ReactElement } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/**
 * V12's image of the chain of trust (canon: out/scene-brief.md «Visual metaphors»), drawn ONE way in s02, s03
 * and s06 (rule 1's icon). Vertical, top to bottom:
 *
 *   - the ANCHOR = the root CA (a plain anchor glyph — never inside a rope ring: that is the CA's seal);
 *   - the DECK under it = «a bordo», the client's trust store (a ship's deck: plank, hull strip, a short rail at
 *     each end). It is wider than the chain: it overhangs the 240-unit box by 40 units on each side
 *     (≈ 17 % of the width), drawn with `overflow: visible` — leave that room around the box;
 *   - the MIDDLE LINK = the intermediate CA (a stud link);
 *   - the LAST LINK = the portal's certificate (the leaf).
 *
 * Every link is neutral steel (`STEEL`, V11's house-key silver); owners are shown by tags placed by the scene,
 * never by the metal. Each element has three looks, crossfaded by numbers:
 *
 *   - absent / undecided: dashed steel outline at ~40 % opacity        (`anchor`/`middle`/`leaf` = 0)
 *   - present: solid steel                                             (= 1)
 *   - validated: an emerald glow around it                             (`validated` > 0)
 *
 * Props (all optional except `height`; the DEFAULTS DRAW THE COMPLETE, VALIDATED-LESS CHAIN ON ITS DECK, so a
 * rule icon only needs `height`):
 *   - `height` px; width follows the 240×512 aspect (`anchorChainSize(height)`).
 *   - `anchor`, `middle`, `leaf`: 0–1 presence (0 dashed, 1 solid).
 *   - `deck`: 0–1, the deck slides in under the anchor.
 *   - `validated`: 0–1 for the whole chain, or per element `{ anchor, middle, leaf }`.
 *   - `blink`: per element 0–1 — the element brightens (a dashed one up to ~90 %) with a soft white halo.
 *     Drive it with `pulse(...)` (≤ 1 Hz); s02 blinks anchor and middle with the SAME value.
 *   - `middleShift`: `{ x, y }` px offset of the middle link (its arrival in s03); `middleTilt` degrees.
 *   - `show` 0–1 (fade in), `dim` 0–1 (step back), `style`.
 *
 * `anchorChainPoints(height)` gives each element's box in px from the component's top-left (centre `x`/`y`
 * and `left`/`right`/`top`/`bottom`) so a scene can place tags and leaders. Nothing reads the timeline and
 * nothing is positioned: wrap it in an absolutely positioned div.
 */

/** Neutral steel of every link (V11's HOUSE_KEY_SILVER). */
export const STEEL = '#cbd5e1';

export const ANCHOR_CHAIN_BASE = { w: 240, h: 512 } as const;

export interface ChainBox {
  x: number;
  y: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type ChainPart = 'anchor' | 'deck' | 'middle' | 'leaf';

/** Boxes in base units (240×512). */
const BOXES: Record<ChainPart, ChainBox> = {
  anchor: { x: 120, y: 88, left: 26, right: 214, top: 4, bottom: 166 },
  deck: { x: 120, y: 191, left: -40, right: 280, top: 146, bottom: 218 },
  middle: { x: 120, y: 288, left: 76, right: 164, top: 208, bottom: 368 },
  leaf: { x: 120, y: 420, left: 76, right: 164, top: 340, bottom: 500 },
};

export function anchorChainSize(height: number): { width: number; height: number; scale: number } {
  const scale = height / ANCHOR_CHAIN_BASE.h;
  return { width: ANCHOR_CHAIN_BASE.w * scale, height, scale };
}

/** Each element's box in px from the chain's top-left, for a chain `height` px tall. */
export function anchorChainPoints(height: number): Record<ChainPart, ChainBox> {
  const s = height / ANCHOR_CHAIN_BASE.h;
  const map = (b: ChainBox): ChainBox => ({
    x: b.x * s,
    y: b.y * s,
    left: b.left * s,
    right: b.right * s,
    top: b.top * s,
    bottom: b.bottom * s,
  });
  return { anchor: map(BOXES.anchor), deck: map(BOXES.deck), middle: map(BOXES.middle), leaf: map(BOXES.leaf) };
}

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

type PerPart = { anchor?: number; middle?: number; leaf?: number };

const per = (v: number | PerPart | undefined, k: 'anchor' | 'middle' | 'leaf'): number =>
  clamp01(typeof v === 'number' ? v : (v?.[k] ?? 0));

// ---------------------------------------------------------------------------
// Geometry (base units)

/** The anchor's stroked parts: ring, shank, stock, arms. */
const ANCHOR_STROKES = [
  'M 120 33 L 120 160',
  'M 82 56 L 158 56',
  'M 40 106 Q 48 160 120 162 Q 192 160 200 106',
] as const;
const ANCHOR_RING = { cx: 120, cy: 20, r: 13 } as const;
/** Stock ends and flukes (filled when solid). */
const ANCHOR_BALLS = [
  { cx: 76, cy: 56, r: 7 },
  { cx: 164, cy: 56, r: 7 },
] as const;
const FLUKES = ['M 40 90 L 27 118 L 55 113 Z', 'M 200 90 L 213 118 L 185 113 Z'] as const;
/** The shackle from the crown down through the deck to the middle link (belongs to the anchor). */
const SHACKLE = { cx: 120, cy: 190, rx: 9, ry: 24 } as const;

/** A stud link: an oval ring with a bar across. */
function linkPaths(cy: number) {
  return { ring: { cx: 120, cy, rx: 44, ry: 80 }, stud: `M 84 ${cy} L 156 ${cy}` };
}
const MIDDLE = linkPaths(288);
const LEAF = linkPaths(420);
/** The leaf's upper-right arc (top to 30° above its right side), redrawn over the middle link. */
const LEAF_OVER = 'M 120 340 A 44 80 0 0 1 158.1 380';

// ---------------------------------------------------------------------------

export function AnchorChain({
  height,
  anchor = 1,
  middle = 1,
  leaf = 1,
  deck = 1,
  validated = 0,
  blink,
  middleShift,
  middleTilt = 0,
  show = 1,
  dim = 0,
  style,
}: {
  height: number;
  anchor?: number;
  middle?: number;
  leaf?: number;
  deck?: number;
  validated?: number | PerPart;
  blink?: PerPart;
  middleShift?: { x: number; y: number };
  middleTilt?: number;
  show?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('chain');
  const sh = clamp01(show);
  if (sh <= 0.001) return null;
  const { width, scale } = anchorChainSize(height);
  const d = clamp01(dim);
  const dk = clamp01(deck);
  const p = { anchor: clamp01(anchor), middle: clamp01(middle), leaf: clamp01(leaf) };
  const v = { anchor: per(validated, 'anchor'), middle: per(validated, 'middle'), leaf: per(validated, 'leaf') };
  const b = { anchor: per(blink, 'anchor'), middle: per(blink, 'middle'), leaf: per(blink, 'leaf') };
  const shift = middleShift ? `translate(${middleShift.x / scale} ${middleShift.y / scale})` : '';
  const tilt = middleTilt ? `rotate(${middleTilt} 120 288)` : '';
  const metal = `url(#${id}-metal)`;

  /** One element in its three looks: halo (validated / blink), dashed outline, solid steel. */
  const layers = (k: 'anchor' | 'middle' | 'leaf', draw: (look: Look) => ReactElement) => {
    const present = p[k];
    const dashedOpacity = Math.min(1, (0.42 + 0.48 * b[k]) * (1 - present));
    const solidOpacity = present;
    return (
      <g>
        {v[k] > 0.001 ? (
          <g opacity={v[k]} filter={`url(#${id}-blur)`}>
            {draw('halo-emerald')}
          </g>
        ) : null}
        {b[k] > 0.001 ? (
          <g opacity={0.75 * b[k]} filter={`url(#${id}-blur)`}>
            {draw('halo-white')}
          </g>
        ) : null}
        {dashedOpacity > 0.001 ? <g opacity={dashedOpacity}>{draw('dashed')}</g> : null}
        {present > 0.001 ? <g opacity={Math.min(1, solidOpacity)}>{draw('solid')}</g> : null}
        {present > 0.001 && v[k] > 0.001 ? <g opacity={v[k] * present}>{draw('validated-edge')}</g> : null}
      </g>
    );
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${ANCHOR_CHAIN_BASE.w} ${ANCHOR_CHAIN_BASE.h}`}
      style={{
        display: 'block',
        overflow: 'visible',
        opacity: sh * (1 - 0.6 * d),
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`${id}-metal`} gradientUnits="userSpaceOnUse" x1={30} y1={0} x2={210} y2={0}>
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="30%" stopColor="#f1f5f9" />
          <stop offset="55%" stopColor={STEEL} />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id={`${id}-plank`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#273449" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
      </defs>

      {/* The deck (your trust store): under the anchor, behind the shackle; it overhangs the box */}
      {dk > 0.001 ? (
        <g opacity={dk} transform={`translate(0 ${(1 - dk) * 18})`}>
          {/* Hull strip, with a bow on the right */}
          <path d="M -36 192 L 278 192 Q 276 206 260 218 L -22 218 Q -33 210 -36 192 Z" fill={C.ink800} stroke={alpha(C.muted, 0.6)} strokeWidth={2} />
          <path d="M -26 205 L 266 205" stroke={alpha(C.muted, 0.25)} strokeWidth={1.5} />
          {/* Rails at both ends (clear of the anchor's arms) */}
          <g stroke={alpha('#e2e8f0', 0.6)} strokeWidth={3} strokeLinecap="round">
            <path d="M -34 148 L 26 148 M 214 148 L 274 148" />
            <path d="M -30 148 L -30 168 M -2 148 L -2 168 M 22 148 L 22 168 M 218 148 L 218 168 M 246 148 L 246 168 M 270 148 L 270 168" strokeWidth={2.5} />
          </g>
          {/* Plank */}
          <rect x={-40} y={168} width={320} height={26} rx={5} fill={`url(#${id}-plank)`} stroke={alpha('#e2e8f0', 0.55)} strokeWidth={2} />
          <path d="M 24 170 L 24 192 M 88 170 L 88 192 M 152 170 L 152 192 M 216 170 L 216 192" stroke={alpha('#0f172a', 0.55)} strokeWidth={2} />
          <path d="M -38 172 L 278 172" stroke={alpha('#ffffff', 0.25)} strokeWidth={2} />
          {/* Hawse hole the chain runs through */}
          <ellipse cx={120} cy={205} rx={16} ry={6} fill="#020617" stroke={alpha(C.muted, 0.5)} strokeWidth={1.5} />
        </g>
      ) : null}

      {/* The leaf (drawn first: the middle link's lower arc passes in front of its upper arc) */}
      {layers('leaf', (look) => <LinkShape link={LEAF} look={look} metal={metal} />)}

      {/* The middle link */}
      <g transform={`${shift} ${tilt}`.trim() || undefined}>{layers('middle', (look) => <LinkShape link={MIDDLE} look={look} metal={metal} />)}</g>

      {/* The leaf's upper-right arc again, over the middle link: the two links interlock */}
      {p.leaf > 0.001 ? (
        <g opacity={p.leaf} fill="none" strokeLinecap="butt">
          <path d={LEAF_OVER} stroke="#1e293b" strokeWidth={22} />
          <path d={LEAF_OVER} stroke={metal} strokeWidth={16} />
        </g>
      ) : null}

      {/* The anchor and its shackle */}
      {layers('anchor', (look) => <AnchorShape look={look} metal={metal} />)}
    </svg>
  );
}

// ---------------------------------------------------------------------------

type Look = 'solid' | 'dashed' | 'halo-emerald' | 'halo-white' | 'validated-edge';

function lookStroke(look: Look, metal: string): { color: string; width: (w: number) => number; dash?: string } {
  switch (look) {
    case 'solid':
      return { color: metal, width: (w) => w };
    case 'dashed':
      return { color: STEEL, width: () => 4.5, dash: '10 8' };
    case 'halo-emerald':
      return { color: C.emerald, width: (w) => w + 14 };
    case 'halo-white':
      return { color: '#e2e8f0', width: (w) => w + 12 };
    case 'validated-edge':
      return { color: alpha('#a7f3d0', 0.9), width: () => 3 };
  }
}

function LinkShape({ link, look, metal }: { link: ReturnType<typeof linkPaths>; look: Look; metal: string }) {
  const s = lookStroke(look, metal);
  const { cx, cy, rx, ry } = link.ring;
  if (look === 'solid') {
    return (
      <g>
        {/* Dark outline under the steel, for depth */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#1e293b" strokeWidth={22} />
        <path d={link.stud} stroke="#1e293b" strokeWidth={16} strokeLinecap="round" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={metal} strokeWidth={16} />
        <path d={link.stud} stroke={metal} strokeWidth={10} strokeLinecap="round" />
        {/* Highlight */}
        <path d={`M ${cx - rx + 8} ${cy - 20} Q ${cx - rx + 6} ${cy - ry + 18} ${cx - 8} ${cy - ry + 6}`} fill="none" stroke={alpha('#ffffff', 0.55)} strokeWidth={3} strokeLinecap="round" />
      </g>
    );
  }
  if (look === 'validated-edge') {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx + 9} ry={ry + 9} fill="none" stroke={s.color} strokeWidth={s.width(0)} />
        <ellipse cx={cx} cy={cy} rx={rx - 9} ry={ry - 9} fill="none" stroke={alpha(s.color, 0.6)} strokeWidth={2} />
      </g>
    );
  }
  if (look === 'dashed') {
    return (
      <g fill="none" stroke={s.color} strokeWidth={s.width(0)} strokeDasharray={s.dash} strokeLinecap="round">
        <ellipse cx={cx} cy={cy} rx={rx + 8} ry={ry + 8} />
        <ellipse cx={cx} cy={cy} rx={rx - 8} ry={ry - 8} />
        <path d={link.stud} strokeDasharray="8 7" />
      </g>
    );
  }
  // Halo
  return (
    <g fill="none" stroke={s.color} strokeWidth={s.width(16)} strokeLinecap="round">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
    </g>
  );
}

function AnchorShape({ look, metal }: { look: Look; metal: string }) {
  const s = lookStroke(look, metal);
  if (look === 'solid') {
    return (
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Shackle */}
        <ellipse cx={SHACKLE.cx} cy={SHACKLE.cy} rx={SHACKLE.rx} ry={SHACKLE.ry} fill="none" stroke="#1e293b" strokeWidth={14} />
        <ellipse cx={SHACKLE.cx} cy={SHACKLE.cy} rx={SHACKLE.rx} ry={SHACKLE.ry} fill="none" stroke={metal} strokeWidth={9} />
        {/* Outline */}
        <g fill="none" stroke="#1e293b" strokeWidth={20}>
          {ANCHOR_STROKES.map((d) => (
            <path key={d} d={d} />
          ))}
          <circle cx={ANCHOR_RING.cx} cy={ANCHOR_RING.cy} r={ANCHOR_RING.r} />
        </g>
        {FLUKES.map((d) => (
          <path key={d} d={d} fill={metal} stroke="#1e293b" strokeWidth={5} />
        ))}
        {ANCHOR_BALLS.map((c) => (
          <circle key={c.cx} cx={c.cx} cy={c.cy} r={c.r + 2} fill={metal} stroke="#1e293b" strokeWidth={4} />
        ))}
        {/* Steel */}
        <g fill="none" stroke={metal} strokeWidth={13}>
          {ANCHOR_STROKES.map((d) => (
            <path key={d} d={d} />
          ))}
          <circle cx={ANCHOR_RING.cx} cy={ANCHOR_RING.cy} r={ANCHOR_RING.r} />
        </g>
        {/* Highlight on the shank */}
        <path d="M 116 40 L 116 150" stroke={alpha('#ffffff', 0.5)} strokeWidth={3} />
      </g>
    );
  }
  if (look === 'validated-edge') {
    return (
      <g fill="none" stroke={s.color} strokeWidth={s.width(0)} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={ANCHOR_RING.cx} cy={ANCHOR_RING.cy} r={ANCHOR_RING.r + 9} />
        <path d="M 30 100 Q 40 172 120 174 Q 200 172 210 100" />
      </g>
    );
  }
  if (look === 'dashed') {
    return (
      <g fill="none" stroke={s.color} strokeWidth={s.width(0)} strokeDasharray={s.dash} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={SHACKLE.cx} cy={SHACKLE.cy} rx={SHACKLE.rx + 2} ry={SHACKLE.ry + 2} strokeDasharray="7 6" />
        <circle cx={ANCHOR_RING.cx} cy={ANCHOR_RING.cy} r={ANCHOR_RING.r + 5} strokeDasharray="7 6" />
        {/* Shank and stock as double outlines */}
        <path d="M 114 40 L 114 156 M 126 40 L 126 156" />
        <path d="M 80 50 L 160 50 M 80 62 L 160 62" />
        <path d="M 34 106 Q 42 168 120 170 Q 198 168 206 106 M 47 108 Q 56 153 120 155 Q 184 153 193 108" />
        {FLUKES.map((d) => (
          <path key={d} d={d} />
        ))}
        {ANCHOR_BALLS.map((c) => (
          <circle key={c.cx} cx={c.cx} cy={c.cy} r={c.r + 2} strokeDasharray="5 5" />
        ))}
      </g>
    );
  }
  // Halo
  return (
    <g fill="none" stroke={s.color} strokeWidth={s.width(13)} strokeLinecap="round" strokeLinejoin="round">
      {ANCHOR_STROKES.map((d) => (
        <path key={d} d={d} />
      ))}
      <circle cx={ANCHOR_RING.cx} cy={ANCHOR_RING.cy} r={ANCHOR_RING.r} />
      <ellipse cx={SHACKLE.cx} cy={SHACKLE.cy} rx={SHACKLE.rx} ry={SHACKLE.ry} />
      {FLUKES.map((d) => (
        <path key={d} d={d} fill={s.color} />
      ))}
    </g>
  );
}
