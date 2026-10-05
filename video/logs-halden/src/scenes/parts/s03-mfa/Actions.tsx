import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../../../engine/src/ui';
import { ACTIONS } from '../../../data/s03-mfa';

/**
 * s03: the morning's three actions, each lit when said: the account (new
 * password, sessions closed), the source blocked (not the accounts), and MFA +
 * banned-password list with owner and date. Cyan = the analyst's action,
 * emerald = what holds. Not positioned; returns its own height via ACTIONS_LAYOUT.
 */

export const ACTIONS_LAYOUT = {
  rowH: 78,
  twoLineH: 122,
  gap: 16,
} as const;

export function actionsHeight(): number {
  return 2 * ACTIONS_LAYOUT.rowH + ACTIONS_LAYOUT.twoLineH + 2 * ACTIONS_LAYOUT.gap;
}

export function Actions({ width, frame, at }: { width: number; frame: number; at: readonly [number, number, number] }) {
  const rows: { icon: IconName; tone: string; body: ReactNode; h: number }[] = [
    { icon: 'user', tone: C.cyan, body: <span>{ACTIONS.reset}</span>, h: ACTIONS_LAYOUT.rowH },
    { icon: 'firewall', tone: C.cyan, body: <span>{ACTIONS.blockSrc}</span>, h: ACTIONS_LAYOUT.rowH },
    {
      icon: 'shield',
      tone: C.emerald,
      h: ACTIONS_LAYOUT.twoLineH,
      body: (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.15 }}>
          <span>
            <span style={{ color: '#c4b5fd', fontWeight: 850 }}>{ACTIONS.mfa[0].slice(0, 3)}</span>
            {ACTIONS.mfa[0].slice(3)}
          </span>
          <span style={{ color: C.text }}>{ACTIONS.mfa[1]}</span>
        </span>
      ),
    },
  ];
  let y = 0;
  return (
    <div style={{ position: 'relative', width, height: actionsHeight(), fontFamily: FONT.sans }}>
      {rows.map((r, i) => {
        const top = y;
        y += r.h + ACTIONS_LAYOUT.gap;
        const p = progress(frame, at[i] - 4, 14);
        if (p <= 0.001) return null;
        // Freshly lit: full glow; it settles once the next one lights.
        const glow = i < 2 ? 1 - 0.6 * progress(frame, at[i + 1] - 4, 14, EASE.inOut) : 1;
        const flash = 1 - progress(frame, at[i] + 4, 24, EASE.inOut);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width,
              height: r.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 26px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(r.tone, 0.35 + 0.55 * glow)}`,
              background: `linear-gradient(90deg, ${alpha(r.tone, 0.1 + 0.1 * glow)} 0%, ${alpha(C.ink900, 0.96)} 55%)`,
              boxShadow: `0 0 ${Math.round(10 + 26 * clamp01(glow * 0.6 + flash * 0.4))}px ${alpha(r.tone, 0.12 + 0.25 * glow)}`,
              fontSize: 34,
              fontWeight: 780,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              opacity: p,
              transform: `translateX(${(1 - p) * -24}px)`,
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                flexShrink: 0,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                background: alpha(r.tone, 0.16),
                border: `2px solid ${alpha(r.tone, 0.6)}`,
              }}
            >
              <Icon name={r.icon} size={34} color={r.tone} />
            </span>
            {r.body}
          </div>
        );
      })}
    </div>
  );
}
