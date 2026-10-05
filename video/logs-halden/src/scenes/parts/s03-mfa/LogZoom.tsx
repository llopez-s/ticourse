import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { ASKS, LOGOUT_LINE, OK_LINE } from '../../../data/s03-mfa';

/**
 * s03: the OK line, enlarged out of the IdP log, «IdP de Halden · pide:
 * contraseña» next to it (the IdP asked only for a password that night) and
 * the new LOGOUT line, read as a fact. Design size LOG_ZOOM (scale it with a
 * transform). The `ok` row can be hidden (the scene draws it while it grows
 * out of the log). Not positioned.
 */

export const LOG_ZOOM = {
  width: 1600,
  height: 212,
  size: 44,
  rowH: 68,
  padX: 24,
  okY: 0,
  chipY: 80,
  logoutY: 144,
} as const;

const GAP = '  ';

export function OkRow({ glow = 1, style }: { glow?: number; style?: CSSProperties }) {
  const g = clamp01(glow);
  return (
    <Row tone={C.rose} glow={g} style={style}>
      <span style={{ color: C.textStrong }}>{OK_LINE.time}</span>
      {GAP}
      <span style={{ color: '#fda4af', fontWeight: 850 }}>{OK_LINE.result}</span>
      {GAP}
      <span style={{ color: '#a5f3fc' }}>{OK_LINE.user}</span>
      {GAP}
      <span style={{ color: C.roseSoft }}>{OK_LINE.src}</span>
    </Row>
  );
}

export function LogoutRow({ glow = 0, zeroGlow = 0, style }: { glow?: number; zeroGlow?: number; style?: CSSProperties }) {
  const z = clamp01(zeroGlow);
  const [label, value] = LOGOUT_LINE.apps.split(': ');
  return (
    <Row tone={C.rose} glow={clamp01(glow)} style={style}>
      <span style={{ color: C.textStrong }}>{LOGOUT_LINE.time}</span>
      {GAP}
      <span style={{ color: '#fda4af', fontWeight: 850 }}>{LOGOUT_LINE.result}</span>
      {GAP}
      <span style={{ color: '#a5f3fc' }}>{LOGOUT_LINE.user}</span>
      <span style={{ color: C.faint }}>{' · '}</span>
      <span style={{ color: C.text }}>{label}: </span>
      <span style={{ color: '#fde68a', fontWeight: 850, textShadow: z > 0.02 ? `0 0 ${Math.round(16 * z)}px ${alpha(C.amber, 0.7 * z)}` : undefined }}>{value}</span>
    </Row>
  );
}

function Row({ tone, glow, children, style }: { tone: string; glow: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: LOG_ZOOM.rowH,
        boxSizing: 'border-box',
        padding: `0 ${LOG_ZOOM.padX}px`,
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.4 + 0.5 * glow)}`,
        background: `linear-gradient(90deg, ${alpha(tone, 0.08 + 0.08 * glow)} 0%, ${alpha(C.ink900, 0.97)} 60%)`,
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(30 * glow)}px ${alpha(tone, 0.28 * glow)}` : `0 16px 40px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.mono,
        fontSize: LOG_ZOOM.size,
        fontWeight: 700,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {/* One inline run, so the spaces between the coloured parts survive the flex box. */}
      <span style={{ whiteSpace: 'pre' }}>{children}</span>
    </div>
  );
}

/** «IdP de Halden · pide: contraseña» (cyan: Halden's system), with a leader up to the OK row. */
export function AsksChip({ p }: { p: number }) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', opacity: v, transform: `translateX(${(1 - v) * -16}px)` }}>
      <svg width={46} height={52} style={{ overflow: 'visible', flexShrink: 0 }}>
        <path d="M 14 -12 L 14 26 L 40 26" fill="none" stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeLinecap="round" />
      </svg>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          height: 52,
          padding: '0 22px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(C.cyan, 0.7)}`,
          background: `linear-gradient(180deg, ${alpha(C.cyan, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 750,
          color: C.textStrong,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="shield" size={34} color={C.cyan} />
        <span>{ASKS.idp}</span>
        <span style={{ color: C.faint }}>·</span>
        <span style={{ color: C.cyanSoft }}>{ASKS.asks}</span>
      </div>
    </div>
  );
}

/** The whole block at design size: OK row (optional), chip, LOGOUT row. */
export function LogZoom({
  showOk = true,
  okGlow = 1,
  chip = 1,
  logout = 1,
  logoutGlow = 0,
  zeroGlow = 0,
}: {
  showOk?: boolean;
  okGlow?: number;
  chip?: number;
  logout?: number;
  logoutGlow?: number;
  zeroGlow?: number;
}) {
  const lo = clamp01(logout);
  return (
    <div style={{ position: 'relative', width: LOG_ZOOM.width, height: LOG_ZOOM.height }}>
      {showOk ? (
        <div style={{ position: 'absolute', left: 0, top: LOG_ZOOM.okY }}>
          <OkRow glow={okGlow} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 12, top: LOG_ZOOM.chipY }}>
        <AsksChip p={chip} />
      </div>
      {lo > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: LOG_ZOOM.logoutY, opacity: lo, transform: `translateY(${(1 - lo) * 14}px)` }}>
          <LogoutRow glow={logoutGlow} zeroGlow={zeroGlow} />
        </div>
      ) : null}
    </div>
  );
}
