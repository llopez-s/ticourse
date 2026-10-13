import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { clamp01 } from '../../../../engine/src/ui';

/** A silhouette (head and shoulders), not an account: no name, no face. */
export function Person({ size = 96, tone = C.muted, glow = 0 }: { size?: number; tone?: string; glow?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(14 * glow)}px ${alpha(tone, 0.7 * glow)})` : undefined }} aria-hidden>
      <circle cx="50" cy="32" r="19" fill={alpha(tone, 0.28)} stroke={tone} strokeWidth="4" />
      <path d="M14 92c0-20 15-34 36-34s36 14 36 34" fill={alpha(tone, 0.28)} stroke={tone} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** A session cookie, drawn as a cookie (a disc with chips); amber. */
export function CookieIcon({ size = 80, glow = 0, dashed = false }: { size?: number; glow?: number; dashed?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', filter: glow > 0.02 ? `drop-shadow(0 0 ${Math.round(16 * glow)}px ${alpha(C.amber, 0.8 * glow)})` : undefined }} aria-hidden>
      <path
        d="M50 8a42 42 0 1 0 42 42 20 20 0 0 1-22-22 20 20 0 0 1-20-20Z"
        fill={alpha(C.amber, dashed ? 0.1 : 0.3)}
        stroke={C.amber}
        strokeWidth="5"
        strokeDasharray={dashed ? '9 8' : undefined}
        strokeLinejoin="round"
      />
      {[
        [34, 38],
        [60, 62],
        [32, 66],
        [52, 40],
        [74, 78],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={C.amber} opacity={dashed ? 0.5 : 0.9} />
      ))}
    </svg>
  );
}

/** The notice sign that repeats what you asked it: a board on two legs reading «Resultados para:» and your text. */
export function Cartel({ width = 520, show = 1, echo = 1 }: { width?: number; show?: number; echo?: number }) {
  const h = Math.round(width * 0.62);
  const boardH = Math.round(h * 0.7);
  return (
    <div style={{ position: 'relative', width, height: h, opacity: show, transform: `translateY(${(1 - show) * 16}px)` }}>
      {/* legs */}
      {[0.18, 0.78].map((x) => (
        <div key={x} style={{ position: 'absolute', left: width * x - 9, top: boardH - 6, width: 18, height: h - boardH + 6, background: `linear-gradient(180deg, ${C.ink600}, ${C.ink700})`, borderRadius: 4 }} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height: boardH,
          boxSizing: 'border-box',
          borderRadius: 18,
          background: `linear-gradient(180deg, ${C.ink800}, ${C.ink850})`,
          border: `4px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 20px 40px ${alpha('#000000', 0.45)}`,
          padding: '20px 26px',
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>Resultados para:</div>
        <div style={{ marginTop: 14, opacity: echo, fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.cyan, whiteSpace: 'nowrap' }}>{'« tu texto »'}</div>
      </div>
    </div>
  );
}

/**
 * The notice board where whatever one person pins is read by everyone who passes: ink board with pins, a few ordinary
 * notices, and one cyan notice carrying a script (`hot`, 0–1, pins it). `readers` (0–1) draws three silhouettes in
 * front, each with a dashed bolt (conditional: the script would run in their browsers).
 */
export function Tablon({ width = 560, hot, readers = 0, show = 1 }: { width?: number; hot: number; readers?: number; show?: number }) {
  const h = Math.round(width * 0.66);
  const boardH = Math.round(h * 0.7);
  const notes: { x: number; y: number; w: number; r: number }[] = [
    { x: 0.05, y: 0.12, w: 0.26, r: -3 },
    { x: 0.37, y: 0.08, w: 0.26, r: 2 },
    { x: 0.69, y: 0.14, w: 0.26, r: -2 },
    { x: 0.09, y: 0.52, w: 0.26, r: 2 },
    { x: 0.69, y: 0.5, w: 0.26, r: 3 },
  ];
  const k = clamp01(hot);
  const r = clamp01(readers);
  return (
    <div style={{ position: 'relative', width, height: h, opacity: show, transform: `translateY(${(1 - show) * 16}px)` }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height: boardH,
          boxSizing: 'border-box',
          borderRadius: 18,
          background: `repeating-linear-gradient(0deg, ${alpha(C.ink700, 0.35)} 0 2px, transparent 2px 28px), linear-gradient(180deg, ${C.ink800}, ${C.ink850})`,
          border: `4px solid ${alpha(C.amber, 0.55)}`,
          boxShadow: `0 20px 40px ${alpha('#000000', 0.45)}`,
        }}
      >
        {notes.map((n, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: n.x * width,
              top: n.y * boardH,
              width: n.w * width,
              height: boardH * 0.34,
              borderRadius: 8,
              background: alpha('#e2e8f0', 0.12),
              border: `2px solid ${alpha('#e2e8f0', 0.28)}`,
              transform: `rotate(${n.r}deg)`,
              padding: '10px 10px',
              boxSizing: 'border-box',
            }}
          >
            {[0, 1, 2].map((l) => (
              <div key={l} style={{ height: 6, borderRadius: 3, marginBottom: 9, width: `${92 - l * 22}%`, background: alpha('#e2e8f0', 0.28) }} />
            ))}
          </div>
        ))}
        {/* the notice somebody pinned: the script */}
        <div
          style={{
            position: 'absolute',
            left: 0.37 * width,
            top: 0.46 * boardH,
            width: 0.26 * width,
            height: boardH * 0.38,
            borderRadius: 8,
            background: alpha(C.cyan, 0.2),
            border: `3px solid ${C.cyan}`,
            boxShadow: `0 0 ${Math.round(26 * k)}px ${alpha(C.cyan, 0.5 * k)}`,
            opacity: k,
            transform: `translateY(${(1 - k) * -40}px) rotate(${-2 + 2 * (1 - k)}deg)`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="bolt" size={Math.round(width * 0.09)} color={C.cyan} strokeWidth={2.2} />
        </div>
      </div>
      {/* readers */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -4, display: 'flex', justifyContent: 'space-around', opacity: r }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'relative' }}>
            <Person size={Math.round(width * 0.17)} tone={C.muted} />
            <div style={{ position: 'absolute', right: -6, top: -10 }}>
              <svg width={Math.round(width * 0.075)} height={Math.round(width * 0.075)} viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3">
                <path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5l1-8Z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A tiny labelled arrow between two things (an `arrowRight` icon, optionally with a label above). */
export function Arrow({ label, tone = C.muted, size = 44, children }: { label?: string; tone?: string; size?: number; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: FONT.sans }}>
      {label ? <div style={{ fontSize: 32, fontWeight: 750, color: tone, whiteSpace: 'nowrap' }}>{label}</div> : null}
      <Icon name="arrowRight" size={size} color={tone} strokeWidth={2.4} />
      {children}
    </div>
  );
}
