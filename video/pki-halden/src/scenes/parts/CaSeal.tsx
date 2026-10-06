import { useId, type CSSProperties } from 'react';
import { C, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * A CA's signature = the CA's wax seal (canon: out/scene-brief.md «Visual metaphors»). V11's `WaxSeal`
 * redrawn in the CA's colour (sky: Confianza Global) with the CA's own pressed design: a compass rose in a
 * rope ring — never V11's anchor (in V12 the anchor is the root of the chain) and never letters. It is the
 * voice's «sellado / selló / se sella»: on the root card (s03), on the CRL (s04), on the justificante and the
 * stapled OCSP response (s05). The REVOKE stamp is a different object (a rectangular rose ink stamp), not this.
 *
 *   - `CaSeal`: a blob of sky wax with the design pressed into it. Square, `size` px.
 *       `press` 0–1 lands it (it drops in 35 % larger and settles at 1; 0 renders nothing);
 *       `verdict` 'ok' | 'bad' + `check` 0–1 ring it in emerald with a tick (the client checked the seal:
 *       it holds) or in rose with a cross; `glow` 0–1 sky halo; `dim` 0–1 steps it back.
 *   - `CaSealPattern`: the design alone (rope ring + compass rose), e.g. a dashed `stencil` laid over a
 *       seal, or a small mark on a card. Square, `size` px.
 *   - `CA_WAX`: the wax colours (deep / mid / light).
 *
 * Nothing reads the timeline and nothing is positioned — wrap each piece in an absolutely positioned div.
 */

export const CA_WAX = { deep: '#0c4a6e', mid: '#0369a1', light: '#38bdf8' } as const;

function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

const dropGlow = (color: string, g: number) => (g > 0.01 ? `drop-shadow(0 0 ${Math.round(4 + 16 * g)}px ${alpha(color, 0.6 * g)})` : '');
const joinFilters = (...f: string[]) => f.filter(Boolean).join(' ') || undefined;

// ---------------------------------------------------------------------------
// The design: a compass rose (4 long + 4 short points) in a rope ring, 100×100 units

/** Eight-point compass rose centred on (50, 50). */
const ROSE_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    // Even = a point (long on the cardinals, short on the diagonals); odd = the notch between points.
    const r = i % 2 === 1 ? 7.5 : i % 4 === 0 ? 31 : 19;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(' L ')} Z`;
})();

function PatternInline({ color, width = 4, stencil = false }: { color: string; width?: number; stencil?: boolean }) {
  return (
    <g>
      <circle cx={50} cy={50} r={46} fill="none" stroke={color} strokeWidth={stencil ? 3 : 4} strokeDasharray={stencil ? '5 4' : '2 4.5'} strokeLinecap="round" />
      {stencil ? null : <circle cx={50} cy={50} r={40.5} fill="none" stroke={alpha(color, 0.5)} strokeWidth={1.5} />}
      <path d={ROSE_PATH} fill={stencil ? 'none' : alpha(color, 0.18)} stroke={color} strokeWidth={width} strokeLinejoin="round" strokeDasharray={stencil ? '5 4' : undefined} />
      {/* The rose's centre */}
      <circle cx={50} cy={50} r={4.5} fill={stencil ? 'none' : color} stroke={color} strokeWidth={stencil ? 2.5 : 0} />
      {/* The rose's spine: a fine line on each cardinal point */}
      {stencil ? null : <path d="M 50 22 L 50 78 M 22 50 L 78 50" stroke={alpha(color, 0.55)} strokeWidth={1.4} />}
    </g>
  );
}

export function CaSealPattern({
  size,
  color = C.sky,
  stencil = false,
  glow = 0,
  dim = 0,
  style,
}: {
  size: number;
  color?: string;
  /** Dashed outline only: the template laid over a seal to check it. */
  stencil?: boolean;
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
      <PatternInline color={color} width={stencil ? 2.5 : 3.5} stencil={stencil} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// The seal

/** Deterministic wobbly outline of the wax blob (100×100 units) — the same blob as V11's seal. */
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

export type CaSealVerdict = 'ok' | 'bad';

export function CaSeal({
  size,
  press = 1,
  verdict,
  check = 0,
  glow = 0,
  dim = 0,
  style,
}: {
  size: number;
  /** 0–1: the seal lands (drops in a little larger, settles at 1). 0 renders nothing. */
  press?: number;
  /** What the check found: 'ok' = the seal holds (emerald tick), 'bad' = it does not (rose cross). */
  verdict?: CaSealVerdict;
  /** 0–1: the verdict ring and badge. */
  check?: number;
  glow?: number;
  dim?: number;
  style?: CSSProperties;
}) {
  const id = useSvgId('caseal');
  const p = clamp01(press);
  if (p <= 0) return null;
  const ck = clamp01(check);
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
        filter: joinFilters(dropGlow(C.sky, g), d > 0.01 ? `saturate(${1 - 0.6 * d})` : ''),
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <radialGradient id={`${id}-wax`} cx="0.38" cy="0.34" r="0.75">
            <stop offset="0%" stopColor={CA_WAX.light} stopOpacity={0.85} />
            <stop offset="45%" stopColor={CA_WAX.mid} />
            <stop offset="100%" stopColor={CA_WAX.deep} />
          </radialGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx={52} cy={56} rx={46} ry={44} fill={alpha('#000000', 0.35)} />
        {/* Blob */}
        <path d={BLOB_PATH} fill={`url(#${id}-wax)`} stroke={alpha('#020617', 0.35)} strokeWidth={1} />
        {/* Pressed disc with the design (embossed: dark offset copy under a light one) */}
        <circle cx={50} cy={50} r={33} fill={alpha('#082f49', 0.55)} stroke={alpha('#ffffff', 0.18)} strokeWidth={1.4} />
        <g transform="translate(19.5 19.5) scale(0.61)">
          <g transform="translate(1.2 1.2)">
            <PatternInline color={alpha('#020617', 0.55)} />
          </g>
          <PatternInline color={alpha('#bae6fd', 0.95)} />
        </g>
        {/* Gloss */}
        <ellipse cx={34} cy={24} rx={12} ry={5} fill={alpha('#ffffff', 0.3)} transform="rotate(-28 34 24)" />
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
