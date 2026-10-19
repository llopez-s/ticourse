import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../engine/src/ui/Icon';
import { tone as toneOf, type Tone } from '../../../../engine/src/ui/tone';
import { FEED, type FeedId } from './bits';

/** Feed name with its icon tile (the same lockup in every scene). */
export function FeedName({ id, size = 38, dim = 0 }: { id: FeedId; size?: number; dim?: number }) {
  const f = FEED[id];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.34), opacity: 1 - 0.55 * dim, fontFamily: FONT.sans }}>
      <span style={{ width: size * 1.45, height: size * 1.45, borderRadius: size * 0.36, display: 'grid', placeItems: 'center', background: alpha(f.color, 0.14), border: `2px solid ${alpha(f.color, 0.55)}` }}>
        <Icon name={f.icon} size={size * 0.9} color={f.color} />
      </span>
      <span style={{ fontSize: size, fontWeight: 800, color: C.textStrong }}>{f.name}</span>
    </span>
  );
}

/** Bordered card with a titled header; children are the rows. */
export function Panel({
  icon,
  title,
  tone = 'cyan',
  w,
  h,
  opacity = 1,
  children,
  style,
}: {
  icon: IconName;
  title: string;
  tone?: Tone;
  w: number;
  h?: number;
  opacity?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const t = toneOf(tone);
  return (
    <div style={{ boxSizing: 'border-box', width: w, height: h, borderRadius: RADIUS.lg, border: `2px solid ${alpha(t.fg, 0.6)}`, background: C.ink900, overflow: 'hidden', opacity, fontFamily: FONT.sans, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 66, padding: '0 24px', background: alpha(t.fg, 0.1), borderBottom: `2px solid ${C.ink700}` }}>
        <Icon name={icon} size={36} color={t.fg} />
        <span style={{ fontSize: 32, fontWeight: 800, color: t.soft }}>{title}</span>
      </div>
      <div style={{ padding: '10px 22px 12px', display: 'grid', gap: 4 }}>{children}</div>
    </div>
  );
}

/** A row inside a Panel: icon + label, entering at `at`; `litAt` brightens it when the voice names it. */
export function PanelRow({
  frame,
  at,
  litAt,
  icon,
  label,
  tone = 'cyan',
  size = 36,
}: {
  frame: number;
  at: number;
  litAt?: number;
  icon: IconName;
  label: ReactNode;
  tone?: Tone;
  size?: number;
}) {
  const t = toneOf(tone);
  const p = progress(frame, at, 16);
  const lit = litAt === undefined ? 0 : progress(frame, litAt, 12);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 62, padding: '0 14px', borderRadius: RADIUS.sm, background: alpha(t.fg, 0.04 + 0.12 * lit), opacity: p, transform: `translateX(${(1 - p) * 18}px)` }}>
      <Icon name={icon} size={size + 2} color={t.fg} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: size, fontWeight: 700, color: lit > 0 ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

/** A sealed envelope: closed flap, seal with the requirement id, one line of what it asks. */
export function Envelope({ id, text, tone, w = 700, h = 230 }: { id: string; text: string; tone: Tone; w?: number; h?: number }) {
  const t = toneOf(tone);
  const tipY = h * 0.5;
  return (
    <div style={{ position: 'relative', width: w, height: h, fontFamily: FONT.sans }}>
      <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
        <rect x={2} y={2} width={w - 4} height={h - 4} rx={RADIUS.md} fill={C.ink850} stroke={alpha(t.fg, 0.7)} strokeWidth={3} />
        <polyline points={`4,6 ${w / 2},${tipY} ${w - 4},6`} fill={alpha(t.fg, 0.08)} stroke={alpha(t.fg, 0.55)} strokeWidth={3} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', left: w / 2 - 44, top: tipY - 44, width: 88, height: 88, borderRadius: 44, display: 'grid', placeItems: 'center', background: alpha(t.fg, 0.2), border: `3px solid ${alpha(t.fg, 0.9)}`, boxShadow: `0 0 26px ${alpha(t.fg, 0.3)}`, fontSize: 40, fontWeight: 850, color: C.textStrong }}>{id}</div>
      <div style={{ position: 'absolute', left: 0, top: tipY + 56, width: w, textAlign: 'center', fontSize: 33, fontWeight: 650, color: C.text }}>{text}</div>
    </div>
  );
}

/** Horizontal value bar: `value` of `max`, filled in `tone`, with an optional ghost fill behind it. */
export function Meter({ value, max, w, h = 22, tone = 'cyan', ghost = 0, grow = 1 }: { value: number; max: number; w: number; h?: number; tone?: Tone; ghost?: number; grow?: number }) {
  const t = toneOf(tone);
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: h / 2, background: alpha(C.ink600, 0.35), overflow: 'hidden' }}>
      {ghost > 0 ? <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (ghost / max) * w * grow, background: alpha(C.sky, 0.45), borderRadius: h / 2 }} /> : null}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (value / max) * w * grow, background: t.fg, borderRadius: h / 2 }} />
    </div>
  );
}

/** Comparison signs drawn as strokes: the bundled Inter subset has no ≠ ≥ ≤ →. */
export function Sym({ kind, size = 40, color = 'currentColor', strokeWidth = 2.8 }: { kind: 'ge' | 'le' | 'lt' | 'ne' | 'arrow'; size?: number; color?: string; strokeWidth?: number }) {
  const lines: Record<string, ReactNode> = {
    ge: (<><polyline points="6,3 18,9 6,15" /><line x1={6} y1={20} x2={18} y2={20} /></>),
    le: (<><polyline points="18,3 6,9 18,15" /><line x1={6} y1={20} x2={18} y2={20} /></>),
    lt: <polyline points="18,5 6,12 18,19" />,
    ne: (<><line x1={4} y1={9} x2={20} y2={9} /><line x1={4} y1={16} x2={20} y2={16} /><line x1={9} y1={21} x2={15} y2={4} /></>),
    arrow: (<><line x1={3} y1={12} x2={20} y2={12} /><polyline points="13,5 20,12 13,19" /></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, verticalAlign: 'middle' }}>
      {lines[kind]}
    </svg>
  );
}
