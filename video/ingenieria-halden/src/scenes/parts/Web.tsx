import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/*
 * The two webs of the video: the fake one that copies the port's look (s07, s08) and the real wave-forecast web that
 * someone poisons (s08, a «supuesto»). The address bars hold NO domain: bars only (s08 draws the address as a scheme).
 * No padlock anywhere («candado» is V21's).
 */

/** Browser chrome: three dots and an address bar of grey bars (no domain, no padlock). */
function Chrome({ tone, address }: { tone: string; address?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 54, padding: '0 20px', background: C.ink800, borderBottom: `2px solid ${C.ink700}` }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[C.roseSoft, C.amber, C.emerald].map((c) => (
          <span key={c} style={{ width: 14, height: 14, borderRadius: 999, background: alpha(c, 0.6) }} />
        ))}
      </div>
      <div style={{ flex: 1, height: 34, borderRadius: 999, background: C.ink900, border: `2px solid ${alpha(tone, 0.35)}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px' }}>
        {address ?? (
          <>
            <span style={{ width: 120, height: 10, borderRadius: 5, background: alpha(C.text, 0.35) }} />
            <span style={{ width: 70, height: 10, borderRadius: 5, background: alpha(C.text, 0.25) }} />
          </>
        )}
      </div>
    </div>
  );
}

/** The generic wave logo the fake web copies (no real emblem). */
export function WaveLogo({ size = 52, tone = C.cyan }: { size?: number; tone?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={26} cy={26} r={24} fill={alpha(tone, 0.18)} stroke={tone} strokeWidth={3} />
      <path d="M8 30 Q14 22 20 30 T32 30 T44 30" stroke={tone} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M10 38 Q16 32 22 38 T34 38 T44 38" stroke={alpha(tone, 0.6)} strokeWidth={3} fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const FAKE_WEB = {
  org: 'Autoridad Portuaria de Halden',
  title: 'Renueva tu acreditación de acceso',
  who: 'transportistas',
  card: 'tarjeta',
  button: 'Renovar',
} as const;

/**
 * The fake web with the port's logo, colours and tone, asking hauliers to renew their access accreditation with a
 * card. `form` 0–1 writes the form; `card` 0–1 lights the card field (rose). `rim` is the window's rim colour (cyan
 * while it looks real, rose once it is unmasked).
 */
export function FakeWeb({ width = 820, form = 1, card = 1, rim = C.cyan, address, style }: { width?: number; form?: number; card?: number; rim?: string; address?: ReactNode; style?: CSSProperties }) {
  const f = clamp01(form);
  const k = clamp01(card);
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(rim, 0.7)}`,
        background: C.ink900,
        boxShadow: `0 0 34px ${alpha(rim, 0.15)}, 0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Chrome tone={rim} address={address} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 92, padding: '0 30px', background: `linear-gradient(90deg, ${C.cyanDeep} 0%, ${alpha(C.cyanDeep, 0.55)} 100%)` }}>
        <WaveLogo size={56} tone={C.cyanSoft} />
        <span style={{ fontSize: 36, fontWeight: 850, color: C.textStrong }}>{FAKE_WEB.org}</span>
      </div>
      <div style={{ padding: '22px 30px 26px', opacity: 0.25 + 0.75 * f }}>
        <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong }}>{FAKE_WEB.title}</div>
        <div style={{ marginTop: 4, fontSize: 32, fontWeight: 700, color: C.cyanSoft }}>{FAKE_WEB.who}</div>
        <div style={{ display: 'flex', gap: 18, marginTop: 20 }}>
          {[260, 220].map((w, i) => (
            <div key={i} style={{ width: w, height: 44, borderRadius: 10, border: `2px solid ${C.ink600}`, background: C.ink850 }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
          <span style={{ fontSize: 32, fontWeight: 750, color: k > 0.4 ? C.roseSoft : C.text }}>{FAKE_WEB.card}</span>
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '8px 14px',
              borderRadius: 10,
              border: `2px solid ${alpha(k > 0.01 ? C.rose : C.ink600, 0.4 + 0.5 * k)}`,
              background: alpha(C.rose, 0.08 * k),
              boxShadow: k > 0.02 ? `0 0 22px ${alpha(C.rose, 0.3 * k)}` : undefined,
            }}
          >
            {[0, 1, 2, 3].map((g) => (
              <div key={g} style={{ width: 70, height: 28, borderRadius: 6, background: C.ink800, border: `2px solid ${C.ink600}` }} />
            ))}
          </div>
          <div style={{ marginLeft: 'auto', padding: '8px 26px', borderRadius: 10, background: C.cyanDeep, fontSize: 30, fontWeight: 800, color: C.textStrong }}>{FAKE_WEB.button}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * The real wave-forecast web («previsión del oleaje»): a wave chart, no name, no address. `poison` 0–1 slips a rose
 * block of code (bars) into the page and turns its rim rose.
 */
export function WaveWeb({ width = 700, poison = 0, style }: { width?: number; poison?: number; style?: CSSProperties }) {
  const p = clamp01(poison);
  const rim = p > 0.5 ? C.rose : C.sky;
  const W = width - 60;
  const pts = Array.from({ length: 13 }, (_, i) => {
    const x = (i / 12) * W;
    const y = 70 - Math.sin(i * 0.9) * 34 - (i % 3) * 6;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(rim, 0.6 + 0.2 * p)}`,
        background: C.ink900,
        boxShadow: `0 0 ${Math.round(20 + 20 * p)}px ${alpha(rim, 0.15 + 0.15 * p)}, 0 24px 60px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Chrome tone={C.sky} />
      <div style={{ padding: '18px 30px 22px', position: 'relative' }}>
        <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong }}>previsión del oleaje</div>
        <svg width={W} height={140} style={{ display: 'block', marginTop: 14 }}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={0} x2={W} y1={20 + i * 34} y2={20 + i * 34} stroke={C.ink700} strokeWidth={2} />
          ))}
          <path d={`${pts} L${W} 140 L0 140 Z`} fill={alpha(C.sky, 0.18)} />
          <path d={pts} stroke={C.sky} strokeWidth={4} fill="none" strokeLinejoin="round" />
        </svg>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ flex: 1, height: 40, borderRadius: 8, background: C.ink800, border: `2px solid ${C.ink700}` }} />
          ))}
        </div>
        {p > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              right: 30,
              top: 64,
              padding: '12px 16px',
              borderRadius: 10,
              border: `2px solid ${C.rose}`,
              background: alpha(C.roseDeep, 0.95),
              boxShadow: `0 0 26px ${alpha(C.rose, 0.4)}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              opacity: p,
              transform: `translateY(${(1 - p) * -24}px)`,
            }}
          >
            {[150, 110, 132].map((w, i) => (
              <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: alpha(C.roseSoft, 0.8) }} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
