import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, dimStyle } from '../../../../engine/src/ui';
import { ACL } from './FolderAcl';
import { Pencil } from './People';

/**
 * A generic security window (no product chrome, no real UI): title bar with three neutral dots, a title and an optional
 * tab label. s08 puts the folder's list (FolderAcl, naming="windows") inside it. `glow` 0–1 lights the border.
 */
export function WinFrame({
  width,
  height,
  title,
  tab,
  glow = 0,
  children,
  style,
}: {
  width: number;
  height: number;
  title: string;
  tab?: string;
  glow?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.cyan, 0.3 + 0.5 * g)}`,
        background: alpha(C.ink900, 0.96),
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(C.cyan, 0.28 * g)}` : `0 22px 50px ${alpha('#000000', 0.4)}`,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', background: alpha(C.ink700, 0.7), borderBottom: `2px solid ${C.ink600}` }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: alpha(C.muted, 0.55) }} />
        ))}
        <span style={{ marginLeft: 12, fontSize: 30, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>{title}</span>
        <span style={{ flex: 1 }} />
        {tab ? <span style={{ fontSize: 28, fontWeight: 800, color: C.cyanSoft, padding: '2px 16px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.6)}`, background: alpha(C.cyan, 0.1) }}>{tab}</span> : null}
      </div>
      <div style={{ position: 'absolute', left: 20, top: 56 + 12, right: 20, bottom: 12 }}>{children}</div>
    </div>
  );
}

/** One chip of an entry: text + optional icon, in a tone. */
export interface EntryChip {
  text: string;
  tone?: string;
  icon?: 'eye' | 'pencil' | 'x';
}

/**
 * A free-form entry row (same size and look as FolderAcl's rows) for the s08 examples that FolderAcl's canonical list
 * cannot draw: «un grupo · Lectura», «otro grupo · Escritura», «Denegar · escribir». `struck` 0–1 draws a rose line through it.
 */
export function EntryRow({
  who,
  kind = 'group',
  chips,
  width = 700,
  tone = C.emerald,
  focus = 0,
  dim = 0,
  show = 1,
  struck = 0,
}: {
  who: string;
  kind?: 'group' | 'service';
  chips: EntryChip[];
  width?: number;
  tone?: string;
  focus?: number;
  dim?: number;
  show?: number;
  struck?: number;
}) {
  const f = clamp01(focus);
  const s = clamp01(show);
  const st = clamp01(struck);
  return (
    <div style={{ position: 'relative', width, height: ACL.rowH, ...dimStyle(dim, s), transform: `translateY(${(1 - s) * 12}px) scale(${1 + 0.03 * f})`, transformOrigin: 'left center' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 18px 0 16px',
          borderRadius: RADIUS.md,
          border: `${f > 0.3 ? 3 : 2}px solid ${alpha(tone, 0.45 + 0.5 * f)}`,
          background: `linear-gradient(90deg, ${alpha(tone, 0.07 + 0.1 * f)}, ${alpha(C.ink850, 0.95)} 75%)`,
          boxShadow: f > 0.02 ? `0 0 ${Math.round(30 * f)}px ${alpha(tone, 0.3 * f)}` : undefined,
          fontFamily: FONT.sans,
        }}
      >
        <Icon name={kind === 'service' ? 'gear' : 'users'} size={44} color={kind === 'service' ? C.sky : C.cyan} />
        <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.3 }}>{who}</span>
        <span style={{ flex: 1 }} />
        {chips.map((c) => {
          const col = c.tone ?? tone;
          return (
            <span
              key={c.text}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                height: 52,
                padding: '0 20px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(col, 0.7)}`,
                background: alpha(col, 0.16),
                fontSize: 32,
                fontWeight: 800,
                color: col === C.rose ? C.roseSoft : col === C.emerald ? '#6ee7b7' : C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {c.icon === 'eye' ? <Icon name="eye" size={32} color={col} /> : null}
              {c.icon === 'pencil' ? <Pencil size={32} color={col} strokeWidth={2} /> : null}
              {c.icon === 'x' ? <Icon name="x" size={32} color={col} strokeWidth={2.6} /> : null}
              {c.text}
            </span>
          );
        })}
      </div>
      {st > 0.01 ? <div style={{ position: 'absolute', left: -6, top: '50%', height: 5, width: `calc(${st * 100}% + 12px)`, borderRadius: 3, background: C.rose, boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}` }} /> : null}
    </div>
  );
}
