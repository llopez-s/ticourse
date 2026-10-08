import { C, FONT, RADIUS, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';

/**
 * s06's tunnel configuration: a console panel (the engine Terminal's look: title bar with an icon,
 * mono lines) holding «key: value» lines that type in. `collapse` 0–1 folds the title bar and every
 * line but the first away and narrows the panel to `compactWidth`, leaving the protocol line alone
 * as the head of the protocol menu (with a drawn dropdown caret, `caret`).
 */
export function ConfigConsole({
  title,
  lines,
  appear,
  focus = [],
  collapse = 0,
  caret = 0,
  width = 1260,
  compactWidth = 440,
  size = 38,
  glow = 0,
  valueGlow = 0,
}: {
  title: string;
  lines: readonly { key: string; value: string }[];
  /** 0–1 per line: the line types in. */
  appear: number[];
  /** 0–1 per line: highlight (the others dim). */
  focus?: number[];
  collapse?: number;
  caret?: number;
  width?: number;
  compactWidth?: number;
  size?: number;
  glow?: number;
  /** 0–1: the first line's value lights (cyan halo). */
  valueGlow?: number;
}) {
  const k = clamp01(collapse);
  const headH = 64 * (1 - k);
  const padY = mix(18, 10, k);
  const lineH = Math.round(size * 1.5);
  const w = mix(width, compactWidth, k);
  const maxF = focus.reduce((m, f) => Math.max(m, clamp01(f)), 0);
  const g = clamp01(glow);
  const vg = clamp01(valueGlow);
  return (
    <div
      style={{
        width: w,
        boxSizing: 'border-box',
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${g > 0.01 ? alpha(C.cyan, 0.35 + 0.5 * g) : C.ink700}`,
        borderRadius: RADIUS.lg,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}${g > 0.01 ? `, 0 0 ${Math.round(24 + 36 * g)}px ${alpha(C.cyan, 0.35 * g)}` : ''}`,
        overflow: 'hidden',
      }}
    >
      {/* Title bar (folds away with `collapse`) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          height: headH,
          padding: '0 26px',
          borderBottom: headH > 1 ? `2px solid ${C.ink700}` : 'none',
          background: alpha(C.ink800, 0.9),
          overflow: 'hidden',
          opacity: 1 - k,
        }}
      >
        <Icon name="terminal" size={30} color={C.cyan} />
        <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>{title}</div>
      </div>
      <div style={{ padding: `${padY}px 28px` }}>
        {lines.map((l, i) => {
          const full = `${l.key}: ${l.value}`;
          const a = clamp01(appear[i] ?? 0);
          const n = Math.round(a * full.length);
          const fold = i === 0 ? 1 : 1 - k;
          const f = clamp01(focus[i] ?? 0);
          const d = Math.max(0, maxF - f);
          const keyPart = full.slice(0, Math.min(n, l.key.length + 1));
          const valuePart = n > l.key.length + 2 ? full.slice(l.key.length + 2, n) : '';
          const typing = a > 0.001 && a < 0.999;
          return (
            <div
              key={l.key}
              style={{
                height: lineH * fold,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                opacity: fold * (a > 0.001 ? 1 : 0) * (1 - 0.6 * d),
                fontFamily: FONT.mono,
                fontSize: size,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                filter: f > 0.01 ? `drop-shadow(0 0 ${Math.round(10 * f)}px ${alpha(C.cyan, 0.5 * f)})` : undefined,
              }}
            >
              <span style={{ color: C.cyanSoft }}>{keyPart}</span>
              {n > l.key.length + 1 ? <span style={{ whiteSpace: 'pre' }}> </span> : null}
              <span
                style={{
                  color: C.textStrong,
                  fontWeight: 750,
                  padding: i === 0 && vg > 0.01 ? '0 8px' : undefined,
                  borderRadius: 8,
                  background: i === 0 && vg > 0.01 ? alpha(C.cyan, 0.16 * vg) : undefined,
                  boxShadow: i === 0 && vg > 0.01 ? `0 0 ${Math.round(18 * vg)}px ${alpha(C.cyan, 0.45 * vg)}` : undefined,
                }}
              >
                {valuePart}
              </span>
              {typing ? <span style={{ display: 'inline-block', width: size * 0.5, height: size * 0.95, marginLeft: 4, background: C.cyan }} /> : null}
              {i === 0 && caret > 0.01 ? (
                <svg width={size * 0.9} height={size * 0.7} viewBox="0 0 24 18" style={{ marginLeft: 14, opacity: clamp01(caret), flexShrink: 0 }}>
                  <path d="M 3 4 L 12 14 L 21 4" fill="none" stroke={C.cyan} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
