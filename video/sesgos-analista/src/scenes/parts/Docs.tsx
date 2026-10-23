import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The vendor's report (a generic one: a coloured square for a logo, no name) as a sheet on the table.
 * A normal-flow box `width` × `width * 0.76`.
 *   claim = 1    0–1: the line «grupo X» is lit (the first thing the report says; never a real group)
 *   socket = 0   0–1: a socket is cut into the right edge — the place where the next piece has to fit
 *   glow = 0 · dim = 0 · text = true (false hides every small text: when the sheet is tiny)
 */
export function Report({ width, claim = 1, socket = 0, glow = 0, dim = 0, text = true }: { width: number; claim?: number; socket?: number; glow?: number; dim?: number; text?: boolean }) {
  const h = Math.round(width * 0.76);
  const u = width / 420;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 18 * u,
        background: `linear-gradient(180deg, #e8eef6 0%, #c9d4e2 100%)`,
        border: `${Math.max(2, 3 * u)}px solid ${alpha(C.cyan, 0.45 + 0.45 * glow)}`,
        boxShadow: `0 ${20 * u}px ${50 * u}px ${alpha('#000000', 0.45)}, 0 0 ${Math.round(36 * glow)}px ${alpha(C.cyan, 0.35 * glow)}`,
        opacity: 1 - 0.55 * dim,
        fontFamily: FONT.sans,
        overflow: 'visible',
      }}
    >
      {/* letterhead */}
      <div style={{ position: 'absolute', left: 28 * u, top: 24 * u, width: 40 * u, height: 40 * u, borderRadius: 10 * u, background: C.cyanDeep }} />
      {text ? (
        <div style={{ position: 'absolute', left: 84 * u, top: 30 * u, fontFamily: FONT.mono, fontSize: 24 * u, fontWeight: 800, letterSpacing: 3 * u, color: '#334155', whiteSpace: 'nowrap' }}>INFORME · PROVEEDOR</div>
      ) : (
        <div style={{ position: 'absolute', left: 84 * u, top: 36 * u, width: 200 * u, height: 14 * u, borderRadius: 7 * u, background: alpha('#334155', 0.7) }} />
      )}
      <div style={{ position: 'absolute', left: 28 * u, top: 84 * u, width: 364 * u, height: 3 * u, background: alpha('#64748b', 0.45) }} />
      {/* the claim (narrower than the sheet: the socket has the right edge to itself) */}
      <div
        style={{
          position: 'absolute',
          left: 28 * u,
          top: 102 * u,
          width: 296 * u,
          height: 96 * u,
          boxSizing: 'border-box',
          borderRadius: 12 * u,
          border: `${Math.max(2, 3 * u)}px solid ${alpha(C.amber, 0.4 + 0.5 * claim)}`,
          background: alpha(C.amber, 0.1 + 0.2 * claim),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: `0 ${22 * u}px`,
        }}
      >
        {text ? <span style={{ fontFamily: FONT.mono, fontSize: 22 * u, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap', lineHeight: 1 }}>atribución</span> : null}
        <span style={{ fontSize: 56 * u, fontWeight: 900, letterSpacing: -1, color: '#1e293b', whiteSpace: 'nowrap', lineHeight: 1.1 }}>grupo X</span>
      </div>
      {/* body text, as bars */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 28 * u, top: (222 + i * 28) * u, width: (364 - (i === 3 ? 150 : i * 22)) * u, height: 12 * u, borderRadius: 6 * u, background: alpha('#64748b', 0.42) }} />
      ))}
      {/* the socket: where the next piece has to fit */}
      {socket > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: -3 * u,
            top: h * 0.34,
            width: 62 * u * socket,
            height: 100 * u,
            borderRadius: `${12 * u}px 0 0 ${12 * u}px`,
            background: C.ink950,
            borderTop: `${Math.max(2, 3 * u)}px solid ${alpha(C.cyan, 0.45)}`,
            borderBottom: `${Math.max(2, 3 * u)}px solid ${alpha(C.cyan, 0.45)}`,
            borderLeft: `${Math.max(2, 3 * u)}px solid ${alpha(C.cyan, 0.45)}`,
            boxSizing: 'border-box',
          }}
        />
      ) : null}
    </div>
  );
}

/** A small sheet of data (gray bars), with a pointer tab on its top edge that shows which way it is facing. */
export function Paper({ w = 118, tone = 'muted', lit = 0 }: { w?: number; tone?: 'muted' | 'cyan' | 'amber'; lit?: number }) {
  const h = Math.round(w * 0.76);
  const u = w / 118;
  const col = tone === 'cyan' ? C.cyan : tone === 'amber' ? C.amber : C.muted;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 10,
        background: `linear-gradient(180deg, ${alpha('#e8eef6', 0.92)} 0%, ${alpha('#b6c3d4', 0.9)} 100%)`,
        border: `3px solid ${alpha(col, 0.55 + 0.4 * lit)}`,
        boxShadow: `0 8px 18px ${alpha('#000000', 0.4)}`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 12 * u, top: (18 + i * 17) * u, width: w - 24 * u - i * 18 * u, height: 8 * u, borderRadius: 4 * u, background: alpha(col === C.muted ? '#64748b' : col, 0.55) }} />
      ))}
      {/* pointer: a little triangle on the top edge */}
      <svg width={26} height={18} viewBox="0 0 26 18" style={{ position: 'absolute', left: w / 2 - 13, top: -20 }}>
        <path d="M 13 1 L 25 17 L 1 17 Z" fill={alpha(C.cyanSoft, 0.4 + 0.55 * lit)} stroke={alpha(C.cyanSoft, 0.8)} strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/**
 * The log line: a gray block (no hour, no host, no domain — only bars) with a tab on its LEFT end hinged to it.
 * `tab` is the tab's angle in degrees (0 = straight; positive raises its tip). A normal-flow box
 * `bodyW + tabW` wide and `h` tall; the hinge is at x = tabW. Glitch: `glitch` 0–1 shifts a cyan and a rose
 * copy of the outline apart.
 */
export function LogStrip({ bodyW = 560, tabW = 150, h = 100, tab = 0, glitch = 0, label }: { bodyW?: number; tabW?: number; h?: number; tab?: number; glitch?: number; label?: boolean }) {
  const piece = (extra: { dx?: number; col?: string }) => ({
    position: 'absolute' as const,
    top: 0,
    height: h,
    boxSizing: 'border-box' as const,
    borderRadius: 14,
    border: `3px solid ${extra.col ?? '#94a3b8'}`,
    background: `linear-gradient(180deg, #8a99ad 0%, #64748b 100%)`,
    ...(extra.dx ? { transform: `translateX(${extra.dx}px)` } : {}),
  });
  return (
    <div style={{ position: 'relative', width: tabW + bodyW, height: h, fontFamily: FONT.sans }}>
      {glitch > 0.02 ? (
        <>
          <div style={{ ...piece({ dx: -10 * glitch, col: alpha(C.cyan, 0.8) }), left: tabW, width: bodyW, background: 'none' }} />
          <div style={{ ...piece({ dx: 10 * glitch, col: alpha(C.rose, 0.8) }), left: tabW, width: bodyW, background: 'none' }} />
        </>
      ) : null}
      <div style={{ ...piece({}), left: tabW, width: bodyW }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 26 + i * 120, top: h / 2 - 7, width: 90, height: 14, borderRadius: 7, background: alpha('#1e293b', 0.55) }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: tabW + 14, height: h, transform: `rotate(${tab}deg)`, transformOrigin: `${tabW}px 50%` }}>
        <div style={{ ...piece({}), left: 0, width: tabW + 14, borderRadius: '14px 6px 6px 14px', background: `linear-gradient(180deg, #a3b1c4 0%, #7a8ba2 100%)` }}>
          <div style={{ position: 'absolute', left: 24, top: h / 2 - 7, width: 60, height: 14, borderRadius: 7, background: alpha('#1e293b', 0.5) }} />
        </div>
      </div>
      {label ? (
        <div style={{ position: 'absolute', left: tabW + 190, top: -46, fontSize: 32, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>
          registro <span style={{ color: C.muted, fontWeight: 600 }}>(log)</span>
        </div>
      ) : null}
    </div>
  );
}
