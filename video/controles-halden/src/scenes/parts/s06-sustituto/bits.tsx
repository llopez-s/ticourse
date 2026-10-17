import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { APP, CANNOT } from '../../../data/s06-sustituto';

/**
 * The old HR app's sign-in window (s06). No product name, no logo, no user name (a placeholder bar), no padlock
 * glyph and no phone for the second factor — just three plain rows. `lit` (0–1) brings the texts in over the bare
 * shell; `mfaFocus` (0–1) rings the «segundo factor» row in cyan; `cannot` (0–1) crosses that row out in amber and
 * writes the note under it.
 */
export const LOGIN_W = 620;
export const LOGIN_H = 640;
/** Where lines from outside meet the window's right edge (window-local y). */
export const LOGIN_PORT_Y = { measure: 330, other: 488 } as const;

const ROW_H = 68;
const ROW_X = 30;
const ROW_W = LOGIN_W - 2 * ROW_X;
const ROWS_TOP = 176;
const ROW_GAP = 16;

export function LoginWindow({ lit, mfaFocus, cannot, style }: { lit: number; mfaFocus: number; cannot: number; style?: CSSProperties }) {
  const rowTop = (i: number) => ROWS_TOP + i * (ROW_H + ROW_GAP);
  const text: CSSProperties = { fontFamily: FONT.sans, whiteSpace: 'nowrap' };
  return (
    <div
      style={{
        position: 'absolute',
        width: LOGIN_W,
        height: LOGIN_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        background: C.ink850,
        border: `3px solid ${alpha(C.cyan, 0.25 + 0.35 * lit)}`,
        boxShadow: `0 18px 50px ${alpha('#000000', 0.45)}`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* title bar of an old desktop app: three plain dots */}
      <div style={{ height: 44, background: C.ink800, borderBottom: `2px solid ${alpha(C.text, 0.12)}`, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: alpha(C.text, 0.25) }} />
        ))}
      </div>

      {/* header */}
      <div style={{ position: 'absolute', left: ROW_X, top: 66, opacity: lit }}>
        <div style={{ ...text, fontSize: 34, fontWeight: 800, color: C.textStrong, lineHeight: '42px' }}>{APP.title}</div>
        <div style={{ ...text, fontSize: 32, fontWeight: 600, color: C.cyanSoft, lineHeight: '40px' }}>{APP.sub}</div>
      </div>

      {/* row 1: user (a placeholder bar, never a name) */}
      <Row top={rowTop(0)} label={APP.user} lit={lit}>
        <div style={{ width: 210, height: 18, borderRadius: 9, background: alpha(C.text, 0.22) }} />
      </Row>
      {/* row 2: password (dots) */}
      <Row top={rowTop(1)} label={APP.password} lit={lit}>
        <div style={{ display: 'flex', gap: 10 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: alpha(C.text, 0.7) }} />
          ))}
        </div>
      </Row>
      {/* row 3: the second factor — an empty slot, later crossed out */}
      <Row top={rowTop(2)} label={APP.mfa} lit={lit} focus={mfaFocus} cannot={cannot}>
        <div style={{ width: 150, height: 34, borderRadius: 8, border: `2px dashed ${alpha(C.text, 0.4)}` }} />
      </Row>

      {/* the amber note under the crossed-out row */}
      {cannot > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: ROW_X,
            top: rowTop(3) + 4,
            width: ROW_W,
            boxSizing: 'border-box',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            padding: '12px 18px',
            borderRadius: RADIUS.md,
            borderLeft: `6px solid ${C.amber}`,
            background: alpha(C.amberDeep, 0.45),
            opacity: cannot,
            transform: `translateY(${(1 - cannot) * 10}px)`,
          }}
        >
          <Icon name="alert" size={36} color={C.amber} strokeWidth={2.4} style={{ marginTop: 2 }} />
          <div>
            <div style={{ ...text, fontSize: 32, fontWeight: 750, color: '#fde68a', lineHeight: '40px' }}>{CANNOT[0]}</div>
            <div style={{ ...text, fontSize: 32, fontWeight: 600, color: C.text, lineHeight: '40px' }}>{CANNOT[1]}</div>
          </div>
        </div>
      ) : null}

      {/* the sign-in button */}
      <div
        style={{
          position: 'absolute',
          right: ROW_X,
          bottom: 22,
          padding: '8px 34px',
          borderRadius: RADIUS.sm,
          background: alpha(C.cyanDeep, 0.6 * lit + 0.15),
          border: `2px solid ${alpha(C.cyan, 0.3 + 0.3 * lit)}`,
          ...text,
          fontSize: 32,
          fontWeight: 700,
          color: alpha(C.textStrong, 0.25 + 0.75 * lit),
        }}
      >
        {APP.enter}
      </div>
    </div>
  );
}

function Row({
  top,
  label,
  lit,
  focus = 0,
  cannot = 0,
  children,
}: {
  top: number;
  label: string;
  lit: number;
  focus?: number;
  cannot?: number;
  children: ReactNode;
}) {
  const border = cannot > 0.01 ? alpha(C.amber, 0.5 + 0.4 * cannot) : alpha(C.cyan, 0.2 + 0.6 * focus);
  return (
    <div
      style={{
        position: 'absolute',
        left: ROW_X,
        top,
        width: ROW_W,
        height: ROW_H,
        boxSizing: 'border-box',
        borderRadius: 12,
        border: `${focus > 0.01 || cannot > 0.01 ? 3 : 2}px solid ${border}`,
        background: cannot > 0.01 ? alpha(C.amberDeep, 0.18 * cannot) : alpha(C.cyan, 0.03 + 0.07 * focus),
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 20px',
        boxShadow: focus > 0.01 && cannot < 0.99 ? `0 0 ${24 * focus}px ${alpha(C.cyan, 0.3 * focus * (1 - cannot))}` : undefined,
      }}
    >
      <div
        style={{
          width: 236,
          flexShrink: 0,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 650,
          whiteSpace: 'nowrap',
          color: cannot > 0.01 ? alpha('#fde68a', 0.6 + 0.4 * cannot) : alpha(C.muted, lit),
        }}
      >
        {label}
      </div>
      <div style={{ opacity: (0.35 + 0.65 * lit) * (1 - 0.6 * cannot) }}>{children}</div>
      {/* the strike: an amber line drawn left to right across the whole row */}
      {cannot > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: ROW_H / 2 - 4,
            width: (ROW_W - 30) * cannot,
            height: 5,
            borderRadius: 3,
            background: C.amber,
            boxShadow: `0 0 10px ${alpha(C.amber, 0.6)}`,
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * A generic desktop PC (monitor on a stand), flat SVG, no brand and no screen content beyond a few dim lines.
 * `tone` colours the frame and the screen's glow; `lit` (0–1) turns the screen on.
 */
export const PC_W = 170;
export const PC_H = 150;
export function Pc({ tone, lit, dashed = false, style }: { tone: string; lit: number; dashed?: boolean; style?: CSSProperties }) {
  const w = PC_W;
  const sh = 112; // screen box height
  return (
    <svg width={w} height={PC_H} viewBox={`0 0 ${w} ${PC_H}`} style={{ position: 'absolute', overflow: 'visible', ...style }}>
      {lit > 0.01 ? <rect x={-10} y={-10} width={w + 20} height={sh + 20} rx={20} fill={alpha(tone, 0.12 * lit)} /> : null}
      <rect
        x={3}
        y={3}
        width={w - 6}
        height={sh - 6}
        rx={12}
        fill={C.ink900}
        stroke={alpha(tone, 0.35 + 0.6 * lit)}
        strokeWidth={4}
        strokeDasharray={dashed ? '10 8' : undefined}
      />
      <rect x={14} y={14} width={w - 28} height={sh - 28} rx={6} fill={alpha(tone, 0.06 + 0.16 * lit)} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={28} y={30 + i * 18} width={(w - 56) * [0.8, 0.55, 0.68][i]} height={7} rx={3.5} fill={alpha(tone, 0.15 + 0.4 * lit)} />
      ))}
      {/* stand */}
      <rect x={w / 2 - 9} y={sh} width={18} height={22} fill={alpha(C.text, 0.3)} />
      <rect x={w / 2 - 46} y={sh + 22} width={92} height={10} rx={5} fill={alpha(C.text, 0.3)} />
    </svg>
  );
}
