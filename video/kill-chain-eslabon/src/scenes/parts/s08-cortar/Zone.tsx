import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../../engine/src/ui';

/**
 * One of s08's two places to cut: a framed zone with an icon tile and its name (36 px) in the header, and a body
 * slot for what happens there. No position label of its own: the scene adds «en la red · antes del equipo» only
 * with the answer. `show` (0–1) fades/slides it in; `glow` (0–1) lights it; `dim` steps it back.
 */
export function Zone({
  icon,
  title,
  tone,
  width,
  height,
  show = 1,
  glow = 0,
  dim = 0,
  children,
  style,
}: {
  icon: IconName;
  title: string;
  tone: string;
  width: number;
  height: number;
  show?: number;
  glow?: number;
  dim?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  if (show <= 0) return null;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.4 + 0.45 * glow)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.08 + 0.06 * glow)} 0%, ${alpha(C.ink900, 0.95)} 60%)`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(36 * glow)}px ${alpha(tone, 0.25 * glow)}` : `0 20px 50px ${alpha('#000000', 0.3)}`,
        opacity: show * (1 - 0.55 * dim),
        filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim})` : undefined,
        transform: `translateY(${(1 - show) * 18}px)`,
        fontFamily: FONT.sans,
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: 22, top: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 14,
            display: 'grid',
            placeItems: 'center',
            background: alpha(tone, 0.14),
            border: `2px solid ${alpha(tone, 0.45)}`,
          }}
        >
          <Icon name={icon} size={34} color={tone} />
        </div>
        <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.4 }}>{title}</span>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 92, right: 0, bottom: 0 }}>{children}</div>
    </div>
  );
}
