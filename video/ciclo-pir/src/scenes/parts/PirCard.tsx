import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';

/**
 * The PIR card: «Priority Intelligence Requirement» (P, I and R lit as the voice spells them out) and the lesson's
 * five criteria, which come in one at a time. `letters` are 0–1 weights for P, I, R; `rows` 0–1 enter weights and
 * `lit` 0–1 «this is the one the voice is on» weights, one per criterion.
 */
export function PirCard({
  width,
  title,
  letters,
  criteria,
  rows,
  lit,
  show = 1,
  style,
}: {
  width: number;
  title: string;
  letters: readonly number[];
  criteria: readonly { title: string; sub: string | null }[];
  rows: readonly number[];
  lit: readonly number[];
  show?: number;
  style?: CSSProperties;
}) {
  const words = title.split(' ');
  return (
    <div style={{ width, boxSizing: 'border-box', padding: '22px 28px 26px', borderRadius: RADIUS.lg, border: `2px solid ${alpha(C.cyan, 0.6)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.09)} 0%, ${alpha(C.ink900, 0.97)} 60%)`, boxShadow: `0 24px 60px ${alpha('#000000', 0.45)}`, fontFamily: FONT.sans, opacity: show, transform: `translateY(${(1 - show) * 18}px)`, ...style }}>
      <div style={{ display: 'flex', gap: 14, fontSize: 40, fontWeight: 800, letterSpacing: -0.4, whiteSpace: 'nowrap' }}>
        {words.map((w, i) => (
          <span key={w} style={{ color: C.text }}>
            <span style={{ color: letters[i] > 0.4 ? C.cyan : C.text, fontWeight: 900, textShadow: letters[i] > 0.02 ? `0 0 ${Math.round(18 * letters[i])}px ${alpha(C.cyan, 0.7 * letters[i])}` : undefined }}>{w[0]}</span>
            {w.slice(1)}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 14, height: 2, background: alpha(C.cyan, 0.35) }} />
      <div style={{ marginTop: 10 }}>
        {criteria.map((c, i) => {
          const r = rows[i];
          const l = lit[i];
          return (
            <div key={c.title} style={{ position: 'relative' }}>
              {/* The empty slot waiting for its criterion */}
              {r < 0.99 ? (
                <div style={{ position: 'absolute', left: 12, top: 12, display: 'flex', alignItems: 'center', gap: 18, opacity: 0.9 * (1 - r) }}>
                  <div style={{ width: 42, height: 42, borderRadius: 21, boxSizing: 'border-box', border: `2px dashed ${C.ink600}` }} />
                  <div style={{ width: 300, height: 12, borderRadius: 6, background: alpha(C.ink700, 0.8) }} />
                </div>
              ) : null}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, padding: '8px 14px 9px 12px', margin: '4px 0', borderRadius: RADIUS.md, background: l > 0.02 ? alpha(C.cyan, 0.05 + 0.1 * l) : 'transparent', border: `2px solid ${alpha(C.cyan, l > 0.02 ? 0.25 + 0.55 * l : 0)}`, opacity: r * (0.62 + 0.38 * l), transform: `translateX(${(1 - r) * 26}px)`, minHeight: c.sub ? 92 : 62, boxSizing: 'border-box' }}>
              <div style={{ flexShrink: 0, width: 42, height: 42, marginTop: 2, borderRadius: 21, display: 'grid', placeItems: 'center', background: l > 0.5 ? C.cyan : alpha(C.cyan, 0.16), border: `2px solid ${alpha(C.cyan, 0.7)}`, fontSize: 26, fontWeight: 850, color: l > 0.5 ? C.ink950 : C.cyanSoft }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap' }}>{c.title}</div>
                {c.sub ? <div style={{ marginTop: 2, fontSize: 30, fontWeight: 650, lineHeight: 1.2, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{c.sub}</div> : null}
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** A person: a ring with the user icon, who they are and what they do. `check` stamps a tick on the ring. */
export function Person({ size, who, does, tone, show = 1, check = 0, glow = 0, style }: { size: number; who: string; does: string; tone: string; show?: number; check?: number; glow?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT.sans, opacity: show, transform: `translateY(${(1 - show) * 18}px)`, ...style }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: size / 2, display: 'grid', placeItems: 'center', background: alpha(tone, 0.1), border: `4px solid ${alpha(tone, 0.8)}`, boxShadow: `0 0 ${Math.round(40 * glow)}px ${alpha(tone, 0.4 * glow)}` }}>
          <Icon name="user" size={size * 0.56} color={tone} strokeWidth={2} />
        </div>
        {check > 0.01 ? (
          <div style={{ position: 'absolute', right: -6, bottom: -6, width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17, display: 'grid', placeItems: 'center', background: C.emerald, border: `4px solid ${C.ink950}`, transform: `scale(${0.4 + 0.6 * check})`, opacity: check }}>
            <Icon name="check" size={size * 0.2} color={C.ink950} strokeWidth={3.4} />
          </div>
        ) : null}
      </div>
      <div style={{ marginTop: 18, fontSize: 56, fontWeight: 850, letterSpacing: -0.8, color: C.textStrong, whiteSpace: 'nowrap' }}>{who}</div>
      <div style={{ marginTop: 4, fontSize: 40, fontWeight: 750, color: tone, whiteSpace: 'nowrap' }}>{does}</div>
    </div>
  );
}
