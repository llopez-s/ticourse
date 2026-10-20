import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';

/** One 1U server, drawn as a slab with drive bays and a status light (no name). */
export const SLAB_W = 260;
export const SLAB_H = 46;

export function ServerSlab({ tone = C.cyan, light = alpha(C.cyan, 0.6), lit = 0 }: { tone?: string; light?: string; lit?: number }) {
  const l = clamp01(lit);
  return (
    <svg width={SLAB_W} height={SLAB_H} viewBox={`0 0 ${SLAB_W} ${SLAB_H}`} style={{ display: 'block', overflow: 'visible' }}>
      <rect x={2} y={2} width={SLAB_W - 4} height={SLAB_H - 4} rx={7} fill={C.ink800} stroke={tone} strokeWidth={3} />
      {l > 0.01 ? <rect x={2} y={2} width={SLAB_W - 4} height={SLAB_H - 4} rx={7} fill={alpha(tone, 0.16 * l)} /> : null}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={18 + i * 26} y={14} width={18} height={18} rx={3} fill={alpha(C.text, 0.1)} stroke={alpha(C.text, 0.3)} strokeWidth={1.5} />
      ))}
      <rect x={186} y={20} width={38} height={6} rx={3} fill={alpha(C.text, 0.25)} />
      <circle cx={238} cy={23} r={6} fill={light} />
    </svg>
  );
}

/** A miniature of the baseline sheet beside a server, with its verdict: emerald tick (matches) or amber alert. */
export const MINI_W = 46;
export function MiniPage({ verdict, show }: { verdict: 'ok' | 'drift'; show: number }) {
  const o = clamp01(show);
  const tone = verdict === 'ok' ? C.emerald : C.amber;
  return (
    <div style={{ position: 'relative', width: MINI_W, height: SLAB_H, opacity: o, transform: `translateX(${(1 - o) * -10}px)` }}>
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 2,
          width: 32,
          height: 42,
          borderRadius: 4,
          background: '#dbe4f0',
          border: `2px solid ${alpha(C.cyan, 0.6)}`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 5, top: 9 + i * 9, width: 20 - (i % 2) * 6, height: 3, borderRadius: 2, background: alpha('#1e293b', 0.45) }} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 18,
          width: 28,
          height: 28,
          borderRadius: 14,
          display: 'grid',
          placeItems: 'center',
          background: tone,
          boxShadow: `0 0 12px ${alpha(tone, 0.5)}`,
        }}
      >
        <Icon name={verdict === 'ok' ? 'check' : 'alert'} size={18} color={C.ink950} strokeWidth={3} />
      </div>
    </div>
  );
}

/** The guide the Systems team starts from: a public, generic document with many grey lines and its two names. */
export const GUIDE_W = 250;
export const GUIDE_H = 324;
export function GuideCard({ title, chips, chipsIn, dim }: { title: string; chips: readonly string[]; chipsIn: number; dim: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: GUIDE_W,
        height: GUIDE_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        background: C.ink850,
        border: `2px solid ${alpha(C.sky, 0.55)}`,
        padding: '16px 18px',
        fontFamily: FONT.sans,
        opacity: 1 - 0.45 * clamp01(dim),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <Icon name="globe" size={30} color={C.sky} />
        {title}
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ marginTop: i === 0 ? 16 : 10, height: 10, width: [190, 160, 200, 140, 180, 120][i], borderRadius: 5, background: alpha(C.text, 0.18) }} />
      ))}
      <div style={{ position: 'absolute', left: 18, bottom: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
        {chips.map((c, i) => {
          const o = clamp01(chipsIn * 2 - i * 0.6);
          return (
            <div
              key={c}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 42,
                padding: '0 16px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.sky, 0.7)}`,
                background: alpha(C.sky, 0.12),
                fontSize: 30,
                fontWeight: 750,
                color: C.textStrong,
                whiteSpace: 'nowrap',
                opacity: o,
                transform: `translateY(${(1 - o) * 8}px)`,
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
    </div>
  );
}
