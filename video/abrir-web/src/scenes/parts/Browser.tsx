import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { PORTAL } from './data';

/**
 * The laptop's browser. Designed ONCE at BROWSER_BASE (1000×560) and scaled with `scale`, so it looks identical
 * wherever it sits (s01 big, then docked in a corner; s08 and s10 draw it again and the look-alike site must be
 * indistinguishable from the real one).
 *
 * The secure-connection indicator (`SiteIndicator`) is NEUTRAL: the «site controls» icon (two sliders) in cyan.
 * NO padlock (the padlock is V21's image; browsers no longer show it that way), no brand, no colour change
 * between sites. That sameness IS the point of s10.
 *
 *   - `url`       what the address field shows (string or ReactNode, e.g. typed text, or the look-alike domain with
 *                 the zero wrapped in a span). `caret` draws the typing caret after it.
 *   - `children`  the page (see `PortalPage`); pass `loading` (0–1) for the thin progress bar under the bar.
 *   - `glow`      0–1 cyan halo.   `urlZoom` 0–1 grows the address bar (s10 «la barra de direcciones se amplía»).
 *   - `outline`   draws only the frame (no page), for a docked/inactive browser.
 *
 * `browserSize(scale)` gives the outer box. Nothing reads the timeline; wrap it in an absolutely positioned div.
 */

export const BROWSER_BASE = { w: 1000, h: 560 } as const;
const BAR_H = 76;

export function browserSize(scale: number) {
  return { width: BROWSER_BASE.w * scale, height: BROWSER_BASE.h * scale };
}

/** The neutral site indicator: two sliders in a pill. Never a padlock. */
export function SiteIndicator({ size = 52, color = C.cyanSoft, style }: { size?: number; color?: string; style?: CSSProperties }) {
  const w = Math.round(size * 1.5);
  return (
    <svg width={w} height={size} viewBox="0 0 78 52" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      <rect x={2} y={2} width={74} height={48} rx={24} fill={alpha(color, 0.1)} stroke={alpha(color, 0.7)} strokeWidth={3} />
      <path d="M 18 19 H 60 M 18 33 H 60" stroke={color} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={48} cy={19} r={6.5} fill={C.ink900} stroke={color} strokeWidth={3.5} />
      <circle cx={30} cy={33} r={6.5} fill={C.ink900} stroke={color} strokeWidth={3.5} />
    </svg>
  );
}

export function BrowserWindow({
  scale = 1,
  url,
  caret = false,
  loading = 0,
  glow = 0,
  urlZoom = 0,
  outline = false,
  children,
  style,
}: {
  scale?: number;
  url?: ReactNode;
  caret?: boolean;
  loading?: number;
  glow?: number;
  urlZoom?: number;
  outline?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const { width, height } = browserSize(scale);
  const g = clamp01(glow);
  const z = clamp01(urlZoom);
  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BROWSER_BASE.w,
          height: BROWSER_BASE.h,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          boxSizing: 'border-box',
          borderRadius: 26,
          border: `3px solid ${alpha(C.cyan, 0.4 + 0.4 * g)}`,
          background: C.ink900,
          boxShadow: `0 30px 70px ${alpha('#000000', 0.45)}${g > 0 ? `, 0 0 ${Math.round(40 * g)}px ${alpha(C.cyan, 0.35 * g)}` : ''}`,
          overflow: 'hidden',
          fontFamily: FONT.sans,
        }}
      >
        {/* bar */}
        <div
          style={{
            height: BAR_H,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 18px',
            background: C.ink800,
            borderBottom: `3px solid ${C.ink700}`,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: C.ink500 }} />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              height: 52 + 14 * z,
              borderRadius: RADIUS.pill,
              background: C.ink950,
              border: `2px solid ${alpha(C.cyan, 0.25 + 0.5 * z)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 14px',
              boxShadow: z > 0 ? `0 0 ${Math.round(24 * z)}px ${alpha(C.amber, 0.25 * z)}` : undefined,
            }}
          >
            <SiteIndicator size={34} />
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 31 + 5 * z,
                fontWeight: 500,
                color: C.textStrong,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                flex: 1,
              }}
            >
              {url}
              {caret ? <span style={{ display: 'inline-block', width: 3, height: 34, background: C.cyan, marginLeft: 2, verticalAlign: 'text-bottom' }} /> : null}
            </div>
          </div>
        </div>
        {/* progress */}
        <div style={{ height: 5, background: alpha(C.cyan, 0.08) }}>
          <div style={{ width: `${clamp01(loading) * 100}%`, height: 5, background: C.cyan }} />
        </div>
        {/* page */}
        <div style={{ position: 'relative', height: BROWSER_BASE.h - BAR_H - 8 }}>{outline ? null : children}</div>
      </div>
    </div>
  );
}

/**
 * The portal's page, drawn at BROWSER_BASE page size (about 1000×470): header with the port's name, a form of
 * grey bars and the button «Reservar atraque»; `confirmed` (0–1) swaps the button for «Reserva confirmada»
 * (F1's strings). s10's look-alike uses the SAME page.
 */
export function PortalPage({ confirmed = 0, show = 1 }: { confirmed?: number; show?: number }) {
  const s = clamp01(show);
  const c = clamp01(confirmed);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: s, background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)` }}>
      <div style={{ height: 84, display: 'flex', alignItems: 'center', gap: 18, padding: '0 36px', background: alpha(C.sky, 0.16), borderBottom: `3px solid ${alpha(C.sky, 0.45)}` }}>
        <Icon name="flag" size={44} color={C.sky} />
        <span style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, letterSpacing: 0.2 }}>{PORTAL.name}</span>
      </div>
      <div style={{ padding: '34px 36px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {[0.62, 0.48, 0.55].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 150, height: 18, borderRadius: 9, background: alpha(C.muted, 0.35) }} />
            <div style={{ width: `${w * 100}%`, height: 40, borderRadius: 10, border: `2px solid ${C.ink600}`, background: C.ink950 }} />
          </div>
        ))}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              padding: '12px 34px',
              borderRadius: RADIUS.md,
              background: alpha(C.cyan, 0.9 * (1 - c)),
              border: `2px solid ${alpha(C.cyan, 1 - c)}`,
              color: C.ink950,
              fontSize: 34,
              fontWeight: 800,
              opacity: 1 - c,
              display: c >= 1 ? 'none' : undefined,
            }}
          >
            {PORTAL.button}
          </div>
          {c > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: c }}>
              <Icon name="check" size={46} color={C.emerald} strokeWidth={3} />
              <span style={{ fontSize: 36, fontWeight: 800, color: '#6ee7b7' }}>{PORTAL.done}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
