import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * A serverless function: a rounded cyan block with a bolt (code that runs when something calls it). No λ, no product
 * mark, nothing that reads as a box of machines. `label` under the bolt; `warn` 0–1 adds an amber warning badge (s05).
 */
export function FunctionBlock({
  size = 200,
  label,
  glow = 0,
  warn = 0,
  ghost = false,
  children,
}: {
  size?: number;
  label?: string;
  glow?: number;
  warn?: number;
  /** A faint extra instance (the provider scales it). */
  ghost?: boolean;
  children?: ReactNode;
}) {
  const g = clamp01(glow);
  const wv = clamp01(warn);
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `${ghost ? 2 : 4}px ${ghost ? 'dashed' : 'solid'} ${alpha(C.cyan, ghost ? 0.4 : 0.6 + 0.35 * g)}`,
        background: ghost ? alpha(C.cyan, 0.03) : `linear-gradient(180deg, ${alpha(C.cyan, 0.1 + 0.08 * g)} 0%, ${C.ink850} 70%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(C.cyan, 0.3 * g)}` : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: FONT.sans,
      }}
    >
      <Icon name="bolt" size={Math.round(size * 0.42)} color={ghost ? alpha(C.cyan, 0.45) : C.cyan} strokeWidth={2.2} />
      {label ? <div style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{label}</div> : null}
      {wv > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: -Math.round(size * 0.14),
            top: -Math.round(size * 0.14),
            width: Math.round(size * 0.36),
            height: Math.round(size * 0.36),
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: C.ink900,
            border: `4px solid ${C.amber}`,
            opacity: wv,
          }}
        >
          <Icon name="alert" size={Math.round(size * 0.2)} color={C.amber} strokeWidth={2.4} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
