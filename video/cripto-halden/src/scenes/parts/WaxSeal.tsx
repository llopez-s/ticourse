import { useId, type CSSProperties, type ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * The signature image of V11 (canon: out/scene-brief.md «Visual metaphors»):
 * the port's wax seal, drawn ONE way in s07, s09 and s10.
 *
 *   - `SealRing`: the signet ring — the port's PRIVATE key (only the port has
 *     it). Its bezel carries the seal design, mirrored as on a real signet.
 *     Aspect 120×150; `ringFace()` is the bezel centre (where it presses).
 *   - `SealPattern`: the seal's design, an anchor inside a rope ring — the
 *     port's PUBLIC key (everyone knows it). `stencil` draws it as a dashed
 *     outline: the template laid over a seal to check it. Square.
 *   - `WaxSeal`: a blob of the port's wax with the design pressed into it.
 *     `press` 0–1 lands it (it drops a little larger and settles at 1);
 *     `verdict` + `check` 0–1 ring it in emerald with a tick («encaja») or in
 *     rose with a cross («no encaja»); `cracked` 0–1 splits it (optional).
 *     Square, `size` px.
 *   - `SealedPrint`: the offer's fingerprint on a tag, with the port's seal
 *     pressed over its right end (= the digital signature). `children` is the
 *     fingerprint line (pass Fingerprint.tsx's line, or text); `seal` 0–1
 *     lands the seal (same as WaxSeal `press`); `verdict`/`check` forward to
 *     the seal. Size: `sealedPrintSize(width)`; `sealedPrintSeal(width)` is
 *     the seal's centre for aiming the ring or a stencil at it.
 *
 * Colour: cyan = the port (its ring, its wax, its design); emerald / rose only
 * for the verdict. Nothing reads the timeline and nothing is positioned —
 * wrap each piece in an absolutely positioned div.
 */

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 16 * g)}px ${alpha(color, 0.6 * g)})` : '');
const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

/** The port's wax (deep cyan) and its lit edge. */
export const SEAL_WAX = { deep: '#0b4f63', mid: '#0e7490', light: '#22d3ee' } as const;

// ---------------------------------------------------------------------------
// The design: an anchor in a rope ring (100×100 units)

function AnchorPaths({ color, width = 6 }: { color: string; width?: number }) {
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={50} cy={22} r={7} />
      <path d="M 50 29 L 50 80" />
      <path d="M 35 38 L 65 38" />
      <path d="M 24 60 Q 27 81 50 81 Q 73 81 76 60" />
      <path d="M 18 66 L 24 56 L 30 66" />
      <path d="M 70 66 L 76 56 L 82 66" />
    </g>
  );
}

export function SealPattern({
  size,
  color = C.cyan,
  stencil = false,
  mirrored = false,
  rope = true,
  glow = 0,
  dim = 0,
  style,
}: {
  size: number;
  color?: string;
  /** Dashed outline only: the template laid over a seal to check it. */
  stencil?: boolean;
  /** Mirror image (as engraved on the ring). */
  mirrored?: boolean;
  /** Draw the rope ring around the anchor. */
  rope?: boolean;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const g = clamp01(glow);
  const d = clamp01(dim);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: 1 - 0.6 * d,
        filter: joinFilters(dropGlow(color, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <g transform={mirrored ? 'translate(100 0) scale(-1 1)' : undefined} strokeDasharray={stencil ? '5 4' : undefined}>
        {rope ? <circle cx={50} cy={50} r={46} fill="none" stroke={color} strokeWidth={stencil ? 3 : 4} strokeDasharray={stencil ? '5 4' : '2 4.5'} strokeLinecap="round" /> : null}
        {rope && !stencil ? <circle cx={50} cy={50} r={40.5} fill="none" stroke={alpha(color, 0.5)} strokeWidth={1.5} /> : null}
        <g transform="translate(14 13) scale(0.72)">
          <AnchorPaths color={color} width={stencil ? 5 : 7} />
        </g>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SealRing

export const SEAL_RING_BASE = { w: 120, h: 150 } as const;

/** Centre of the ring's bezel (the face that presses), px from its top-left, for a ring `width` px wide. */
export function ringFace(width: number): { x: number; y: number } {
  const s = width / SEAL_RING_BASE.w;
  return { x: 60 * s, y: 48 * s };
}

export function SealRing({
  width,
  color = C.cyan,
  glow = 0,
  dim = 0,
  style,
}: {
  width: number;
  /** Owner's colour (the port: cyan). */
  color?: string;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('ring');
  const h = (width * SEAL_RING_BASE.h) / SEAL_RING_BASE.w;
  const g = clamp01(glow);
  const d = clamp01(dim);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 120 150"
      style={{
        overflow: 'visible',
        display: 'block',
        opacity: 1 - 0.6 * d,
        filter: joinFilters(dropGlow(color, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="45%" stopColor={alpha(color, 0.9)} />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>
      </defs>
      {/* Band, seen from the front and a little above: back half behind the bezel, front half over it */}
      <ellipse cx={60} cy={108} rx={42} ry={26} fill="none" stroke="#155e75" strokeWidth={9} />
      {/* Shoulders */}
      <path d="M 24 70 Q 15 88 18 108 L 31 106 Q 30 88 38 78 Z" fill={`url(#${id}-metal)`} stroke={alpha('#020617', 0.4)} strokeWidth={1.4} />
      <path d="M 96 70 Q 105 88 102 108 L 89 106 Q 90 88 82 78 Z" fill={`url(#${id}-metal)`} stroke={alpha('#020617', 0.4)} strokeWidth={1.4} />
      <path d="M 18 108 A 42 26 0 0 0 102 108" fill="none" stroke={`url(#${id}-metal)`} strokeWidth={13} strokeLinecap="round" />
      <path d="M 18 108 A 42 26 0 0 0 102 108" fill="none" stroke={alpha('#020617', 0.35)} strokeWidth={1.4} />
      {/* Bezel with the engraved (mirrored) design */}
      <ellipse cx={60} cy={48} rx={46} ry={38} fill={`url(#${id}-metal)`} stroke={alpha('#020617', 0.45)} strokeWidth={2} />
      <ellipse cx={60} cy={48} rx={37} ry={30} fill="#0b3b4a" stroke={alpha('#ffffff', 0.35)} strokeWidth={1.5} />
      <g transform="translate(33 21) scale(0.54)">
        <g transform="translate(100 0) scale(-1 1)">
          <g transform="translate(14 13) scale(0.72)">
            <AnchorPaths color={alpha(C.cyanSoft, 0.95)} width={8} />
          </g>
        </g>
      </g>
      <ellipse cx={40} cy={28} rx={11} ry={5} fill={alpha('#ffffff', 0.35)} transform="rotate(-25 40 28)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// WaxSeal

/** Deterministic wobbly outline of the wax blob (100×100 units). */
const BLOB_PATH = (() => {
  const n = 28;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 46 + 2.6 * Math.sin(5 * a + 0.6) + 1.8 * Math.cos(3 * a + 1.3) + 1.2 * Math.sin(11 * a);
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  });
  const mid = (p: { x: number; y: number }, q: { x: number; y: number }) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
  const start = mid(pts[n - 1], pts[0]);
  let d = `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${m.x.toFixed(2)} ${m.y.toFixed(2)}`;
  }
  return `${d} Z`;
})();

export type SealVerdict = 'ok' | 'bad';

export function WaxSeal({
  size,
  press = 1,
  verdict,
  check = 0,
  cracked = 0,
  glow = 0,
  dim = 0,
  style,
}: {
  size: number;
  /** 0–1: the seal lands (drops in a little larger, settles at 1). */
  press?: number;
  /** What the check found: 'ok' = it fits (emerald tick), 'bad' = it does not (rose cross). */
  verdict?: SealVerdict;
  /** 0–1: the verdict ring and badge. */
  check?: number;
  /** 0–1: a crack across the seal. */
  cracked?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('wax');
  const p = clamp01(press);
  if (p <= 0) return null;
  const ck = clamp01(check);
  const cr = clamp01(cracked);
  const g = clamp01(glow);
  const d = clamp01(dim);
  const vColor = verdict === 'bad' ? C.rose : C.emerald;
  const scale = 1.35 - 0.35 * p;
  const badge = Math.round(size * 0.36);
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        opacity: Math.min(1, p * 2) * (1 - 0.6 * d),
        transform: `scale(${scale})`,
        filter: joinFilters(dropGlow(C.cyan, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <radialGradient id={`${id}-wax`} cx="0.38" cy="0.34" r="0.75">
            <stop offset="0%" stopColor={SEAL_WAX.light} stopOpacity={0.85} />
            <stop offset="45%" stopColor={SEAL_WAX.mid} />
            <stop offset="100%" stopColor={SEAL_WAX.deep} />
          </radialGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx={52} cy={56} rx={46} ry={44} fill={alpha('#000000', 0.35)} />
        {/* Blob */}
        <path d={BLOB_PATH} fill={`url(#${id}-wax)`} stroke={alpha('#020617', 0.35)} strokeWidth={1} />
        {/* Pressed disc with the design (embossed: light edge + dark edge) */}
        <circle cx={50} cy={50} r={33} fill={alpha('#03303d', 0.55)} stroke={alpha('#ffffff', 0.18)} strokeWidth={1.4} />
        <g transform="translate(19.5 19.5) scale(0.61)">
          <g transform="translate(1.2 1.2)">
            <SealPatternInline color={alpha('#020617', 0.55)} />
          </g>
          <SealPatternInline color={alpha(C.cyanSoft, 0.95)} />
        </g>
        {/* Gloss */}
        <ellipse cx={34} cy={24} rx={12} ry={5} fill={alpha('#ffffff', 0.3)} transform="rotate(-28 34 24)" />
        {/* Crack */}
        {cr > 0.01 ? (
          <path
            d="M 18 30 L 34 42 L 30 52 L 48 60 L 46 70 L 66 82"
            fill="none"
            stroke="#020617"
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="120"
            strokeDashoffset={120 * (1 - cr)}
          />
        ) : null}
        {/* Verdict ring */}
        {verdict && ck > 0.01 ? <circle cx={50} cy={50} r={52} fill="none" stroke={vColor} strokeWidth={4.5} opacity={ck} /> : null}
      </svg>
      {verdict && ck > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: -badge * 0.18,
            bottom: -badge * 0.18,
            width: badge,
            height: badge,
            borderRadius: RADIUS.pill,
            background: vColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${Math.round(18 * ck)}px ${alpha(vColor, 0.7)}`,
            opacity: ck,
            transform: `scale(${0.6 + 0.4 * ck})`,
          }}
        >
          <Icon name={verdict === 'bad' ? 'x' : 'check'} size={Math.round(badge * 0.7)} color={C.ink950} strokeWidth={3.4} />
        </div>
      ) : null}
    </div>
  );
}

/** The design drawn inside another SVG (no own <svg>). */
function SealPatternInline({ color }: { color: string }) {
  return (
    <g>
      <circle cx={50} cy={50} r={46} fill="none" stroke={color} strokeWidth={4} strokeDasharray="2 4.5" strokeLinecap="round" />
      <g transform="translate(14 13) scale(0.72)">
        <AnchorPaths color={color} width={7} />
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// SealedPrint

/** Tag height relative to its width, and the seal's diameter. */
const TAG = { hRatio: 0.2, sealRatio: 0.3, padRatio: 0.05 } as const;

export function sealedPrintSize(width: number): { width: number; height: number; seal: number } {
  const seal = Math.round(width * TAG.sealRatio);
  return { width, height: Math.max(Math.round(width * TAG.hRatio), seal), seal };
}

/** Centre of the seal on a SealedPrint `width` px wide, px from its top-left. */
export function sealedPrintSeal(width: number): { x: number; y: number } {
  const { height, seal } = sealedPrintSize(width);
  return { x: width - seal / 2 - width * 0.02, y: height / 2 };
}

export function SealedPrint({
  width,
  children,
  seal = 1,
  verdict,
  check = 0,
  tone = C.cyan,
  label,
  glow = 0,
  dim = 0,
  style,
}: {
  width: number;
  /** The fingerprint line (Fingerprint.tsx's line, or mono text). */
  children: ReactNode;
  /** 0–1: the port's seal lands on the tag. */
  seal?: number;
  verdict?: SealVerdict;
  check?: number;
  /** Tag border colour. */
  tone?: string;
  /** Small caption above the print, inside the tag (optional). */
  label?: ReactNode;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const { height, seal: sealD } = sealedPrintSize(width);
  const c = sealedPrintSeal(width);
  const tagH = Math.round(width * TAG.hRatio * 0.78);
  const g = clamp01(glow);
  const d = clamp01(dim);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        opacity: 1 - 0.6 * d,
        filter: d > 0.01 ? `saturate(${1 - 0.6 * d})` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: (height - tagH) / 2,
          width: width - sealD * 0.45,
          height: tagH,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px solid ${alpha(tone, 0.75 + 0.25 * g)}`,
          background: `linear-gradient(180deg, ${alpha(tone, 0.1 + 0.08 * g)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          boxShadow: g > 0.01 ? `0 0 ${Math.round(26 * g)}px ${alpha(tone, 0.4 * g)}` : `0 12px 28px ${alpha('#000000', 0.4)}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: Math.round(width * TAG.padRatio),
          paddingRight: sealD * 0.7,
          fontFamily: FONT.sans,
          overflow: 'hidden',
        }}
      >
        {label ? <div style={{ fontSize: Math.round(tagH * 0.2), fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', marginBottom: 2 }}>{label}</div> : null}
        <div style={{ whiteSpace: 'nowrap' }}>{children}</div>
      </div>
      <div style={{ position: 'absolute', left: c.x - sealD / 2, top: c.y - sealD / 2 }}>
        <WaxSeal size={sealD} press={seal} verdict={verdict} check={check} glow={g} />
      </div>
    </div>
  );
}
