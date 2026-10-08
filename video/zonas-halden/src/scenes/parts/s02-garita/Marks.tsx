import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { progress, springIn } from '../../../../../engine/src/theme/motion';
import { Icon } from '../../../../../engine/src/ui';

/**
 * The violet exam-term tag (idiom of cripto-halden / iam-halden): mortarboard
 * + the English term, optional line under it. Springs in at `at`
 * (Sequence-relative). Used by s02 (SECURITY ZONE) and s03 (ATTACK SURFACE).
 */
export function TermTag({
  frame,
  fps,
  at,
  term,
  sub,
  subAt,
  size = 56,
  subSize = 34,
  dim = 0,
  style,
}: {
  frame: number;
  fps: number;
  at: number;
  term: ReactNode;
  sub?: ReactNode;
  subAt?: number;
  size?: number;
  subSize?: number;
  /** 0–1: steps back (another element is in focus). */
  dim?: number;
  style?: CSSProperties;
}) {
  if (frame < at - 2) return null;
  const p = springIn(frame, fps, at, { damping: 16 });
  const sp = subAt === undefined ? 1 : progress(frame, subAt, 14);
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        padding: '16px 30px 18px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.75)}`,
        background: `linear-gradient(180deg, ${alpha(C.violet, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 0 36px ${alpha(C.violet, 0.25 * (1 - dim))}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, p * 1.3) * (1 - 0.5 * dim),
        transform: `translateY(${(1 - Math.min(1, p)) * 16}px) scale(${0.94 + 0.06 * Math.min(1, p)})`,
        transformOrigin: '0 50%',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
        <Icon name="mortarboard" size={Math.round(size * 0.85)} color={C.violet} />
        <span style={{ fontSize: size, fontWeight: 850, letterSpacing: 0.5, color: '#c4b5fd' }}>{term}</span>
      </div>
      {sub && sp > 0 ? (
        <div style={{ height: Math.round(subSize * 1.25 * sp), overflow: 'hidden' }}>
          <div style={{ fontSize: subSize, fontWeight: 700, lineHeight: 1.25, color: C.text, whiteSpace: 'nowrap', opacity: sp, transform: `translateY(${(1 - sp) * 6}px)` }}>{sub}</div>
        </div>
      ) : null}
    </div>
  );
}
