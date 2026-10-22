import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';

/** A tool's icon: an engine icon, or the phone handset the engine does not have. */
export type ToolIcon = IconName | 'phone';

/** A phone handset, drawn like the engine's line icons (24-unit box, stroked). */
export function PhoneGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function ToolGlyph({ icon, size, color }: { icon: ToolIcon; size: number; color: string }) {
  return icon === 'phone' ? <PhoneGlyph size={size} color={color} /> : <Icon name={icon} size={size} color={color} />;
}

/**
 * One of the SOC's tools as a small application window: a title bar with three dots, the tool's icon and name (no
 * product names), and a body of grey bars that stand for data nobody needs to read. `on` 0–1 brightens it;
 * `paste` shows the value pasted in by hand as the first bar (its own width and tone: it never comes out the same).
 */
export function ToolWindow({
  w,
  h,
  label,
  icon,
  tone = C.sky,
  on = 1,
  paste,
  bars = 3,
  size = 32,
  style,
}: {
  w: number;
  h: number;
  label: string;
  icon: ToolIcon;
  tone?: string;
  on?: number;
  paste?: { on: number; width: number; tone: string };
  bars?: number;
  size?: number;
  style?: CSSProperties;
}) {
  const o = clamp01(on);
  const f = paste ? clamp01(paste.on) : 0;
  return (
    <div
      style={{
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(tone, 0.35 + 0.5 * o)}`,
        background: C.ink850,
        boxShadow: o > 0.02 ? `0 0 ${Math.round(24 * o)}px ${alpha(tone, 0.22 * o)}` : undefined,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ height: 22, background: alpha(tone, 0.12), display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px' }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ width: 8, height: 8, borderRadius: 4, background: alpha(C.text, 0.3) }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 4px' }}>
        <ToolGlyph icon={icon} size={Math.round(size * 1.05)} color={tone} />
        <div style={{ fontSize: size, fontWeight: 750, lineHeight: 1.08, color: C.textStrong }}>{label}</div>
      </div>
      <div style={{ padding: '6px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: bars }, (_, k) => (
          <div
            key={k}
            style={{
              height: 10,
              width: `${k === 0 && paste && f > 0.01 ? paste.width : [82, 58, 70, 46][k % 4]}%`,
              borderRadius: 5,
              background: k === 0 && paste && f > 0.01 ? alpha(paste.tone, 0.3 + 0.6 * f) : alpha(C.text, 0.16),
            }}
          />
        ))}
      </div>
    </div>
  );
}
