import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';

export const PLAN_CARD = { w: 860, h: 370 } as const;

/**
 * The plan Meridian passes to Orbital (s09 `plan`): a hand-over strip «Meridian» to «Orbital» (cyan · cyanSoft, both
 * victims), «esta noche:» and the check's two actions. No date, no result, nothing ticked: the actions carry a search
 * and an eye glyph, never a check. With `tonight` an emerald padlock closes on the card's edge: the plan is set, not
 * proven.
 *
 * - `show`  0–1 the card arrives (slides in from the hand-over side).
 * - `lines` 0–1 per action, as the voice names it.
 * - `lock`  0–1 the padlock drops in and its shackle closes; the card's frame turns emerald.
 */
export function PlanCard({
  from,
  to,
  head,
  actions,
  show,
  lines,
  lock,
  glow = 0,
}: {
  from: string;
  to: string;
  head: string;
  actions: readonly (readonly string[])[];
  show: number;
  lines: readonly number[];
  lock: number;
  glow?: number;
}) {
  const s = clamp01(show);
  if (s <= 0) return null;
  const l = clamp01(lock);
  const g = clamp01(glow);
  const edge = l > 0.5 ? C.emerald : C.cyan;
  const icons = ['search', 'eye'] as const;
  return (
    <div style={{ position: 'relative', width: PLAN_CARD.w, height: PLAN_CARD.h, fontFamily: FONT.sans, opacity: Math.min(1, s * 1.3), transform: `translateX(${(1 - s) * -40}px)` }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          padding: '22px 34px 26px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(edge, 0.45 + 0.4 * Math.max(l, g))}`,
          background: `linear-gradient(180deg, ${alpha(edge, 0.07)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
          boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}${Math.max(l, g) > 0.02 ? `, 0 0 ${Math.round(34 * Math.max(l, g))}px ${alpha(edge, 0.25 * Math.max(l, g))}` : ''}`,
        }}
      >
        {/* Hand-over: Meridian passes Orbital what to look for. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Tag text={from} color={C.cyan} />
          <svg width={70} height={24} style={{ overflow: 'visible' }}>
            <line x1={4} y1={12} x2={56} y2={12} stroke={alpha(C.cyanSoft, 0.8)} strokeWidth={4} strokeLinecap="round" />
            <path d="M 50 4 L 62 12 L 50 20" fill="none" stroke={alpha(C.cyanSoft, 0.8)} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Tag text={to} color={C.cyanSoft} />
        </div>
        <div style={{ marginTop: 18, fontSize: 52, fontWeight: 850, letterSpacing: -1, color: C.textStrong, lineHeight: 1 }}>{head}</div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {actions.map((a, i) => {
            const p = clamp01(lines[i] ?? 0);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, opacity: mix(0.0, 1, p), transform: `translateY(${(1 - p) * 12}px)` }}>
                <div
                  style={{
                    flexShrink: 0,
                    marginTop: 2,
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    display: 'grid',
                    placeItems: 'center',
                    background: alpha(C.cyan, 0.12),
                    border: `2px solid ${alpha(C.cyan, 0.6)}`,
                  }}
                >
                  <Icon name={icons[i % icons.length]} size={28} color={C.cyanSoft} strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.22, color: C.text }}>
                  {a.map((t, k) => (
                    <div key={k} style={{ whiteSpace: 'nowrap' }}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Padlock lock={l} style={{ position: 'absolute', right: -26, top: -40 }} />
    </div>
  );
}

function Tag({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        padding: '4px 16px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, 0.6)}`,
        background: alpha(color, 0.1),
        fontSize: 30,
        fontWeight: 750,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

/**
 * Emerald padlock, drawn in SVG: it drops in open (`lock` 0–0.5) and its shackle closes (0.5–1). Only the shackle
 * moves; no tick, no badge text.
 */
export function Padlock({ lock, size = 96, style }: { lock: number; size?: number; style?: CSSProperties }) {
  const l = clamp01(lock);
  if (l <= 0) return null;
  const drop = clamp01(l / 0.5);
  const close = clamp01((l - 0.5) / 0.5);
  const lift = (1 - close) * 16;
  return (
    <div style={{ width: size, height: size * 1.15, opacity: drop, transform: `translateY(${(1 - drop) * -30}px)`, ...style }}>
      <svg width={size} height={size * 1.15} viewBox="0 0 96 110" style={{ overflow: 'visible', filter: `drop-shadow(0 0 ${Math.round(6 + 14 * close)}px ${alpha(C.emerald, 0.35 + 0.35 * close)})` }}>
        {/* Shackle: lifted and turned open until it closes. */}
        <g transform={`translate(0 ${-lift}) rotate(${(1 - close) * -18} 70 48)`}>
          <path d="M 26 50 L 26 32 A 22 22 0 0 1 70 32 L 70 50" fill="none" stroke={C.emerald} strokeWidth={10} strokeLinecap="round" />
        </g>
        <rect x={12} y={46} width={72} height={56} rx={12} fill={C.emeraldDeep} stroke={C.emerald} strokeWidth={5} />
        <circle cx={48} cy={70} r={7} fill={C.emerald} />
        <rect x={45} y={72} width={6} height={16} rx={3} fill={C.emerald} />
      </svg>
    </div>
  );
}
