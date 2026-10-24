import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The evidence file that thickens (s04 and rule 2 of s11): a folder with loose sheets stacked in it.
 * `sheets` is the fractional number of sheets so far (thickness), `heavy` (0–1) turns it emerald and
 * sinks it a little: it «weighs». Never a balance: only thickness and shadow.
 */
export function Dossier({
  w,
  h,
  sheets,
  heavy = 0,
  label,
  labelSize = 34,
}: {
  w: number;
  h: number;
  sheets: number;
  heavy?: number;
  label?: string;
  labelSize?: number;
}) {
  const n = Math.max(0, Math.min(14, sheets));
  const full = Math.floor(n);
  const part = n - full;
  const step = Math.max(6, Math.round(h / 40));
  const edge = heavy > 0.5 ? C.emerald : C.cyan;
  const base = h * 0.34;
  return (
    <div style={{ position: 'relative', width: w, height: h + 24, fontFamily: FONT.sans, transform: `translateY(${heavy * 10}px)` }}>
      {/* shadow: deeper as it weighs */}
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 0, height: 22 + 14 * heavy, borderRadius: '50%', background: alpha('#000000', 0.35 + 0.25 * heavy), filter: 'blur(10px)' }} />
      {/* back cover + tab */}
      <div style={{ position: 'absolute', left: 0, top: 6, width: w * 0.36, height: 40, borderRadius: '14px 14px 0 0', background: alpha(edge, 0.3), border: `3px solid ${alpha(edge, 0.8)}`, borderBottom: 'none', boxSizing: 'border-box' }} />
      <div style={{ position: 'absolute', left: 0, top: 44, width: w, height: h - 36, borderRadius: '0 18px 18px 18px', background: alpha(edge, 0.14), border: `3px solid ${alpha(edge, 0.8)}`, boxSizing: 'border-box' }} />
      {/* the sheets: each one a step higher, slightly offset */}
      {Array.from({ length: full + (part > 0 ? 1 : 0) }).map((_, i) => {
        const k = i === full ? part : 1;
        const lift = (i + 1) * step;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 18 + (i % 3) * 6,
              top: base - lift * k + 40,
              width: w - 40 - (i % 2) * 8,
              height: h * 0.5,
              borderRadius: 8,
              background: '#1e2c47',
              border: `2px solid ${alpha('#e2e8f0', 0.4)}`,
              boxSizing: 'border-box',
              opacity: k,
              padding: '10px 14px',
            }}
          >
            <div style={{ height: 6, width: '70%', borderRadius: 3, background: alpha('#e2e8f0', 0.4) }} />
            <div style={{ height: 6, width: '50%', borderRadius: 3, background: alpha('#e2e8f0', 0.28), marginTop: 9 }} />
          </div>
        );
      })}
      {/* front cover */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: h * 0.46 + 40,
          width: w,
          height: h * 0.54 - 22,
          boxSizing: 'border-box',
          borderRadius: 18,
          border: `3px solid ${alpha(edge, 0.9)}`,
          background: `linear-gradient(180deg, ${alpha(edge, 0.22)} 0%, ${C.ink900} 100%)`,
          boxShadow: heavy > 0 ? `0 0 ${Math.round(34 * heavy)}px ${alpha(C.emerald, 0.4 * heavy)}` : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: labelSize,
          fontWeight: 850,
          color: C.textStrong,
          padding: '0 18px',
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
    </div>
  );
}
