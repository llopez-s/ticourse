import { C, FONT, RADIUS, STAGE, alpha } from '../../../../engine/src/theme/tokens';
import { CONTEXT } from '../../data/shared';

const W = STAGE.width;
const H = STAGE.height;

/**
 * The analyst's desk seen from above (s01, s03, s05): a dark mat with a notebook and a mug at the edges. No text,
 * nothing readable, no date. The red pen is NOT part of it: it is the video's own object. `opacity` fades it.
 */
export function Desk({ opacity = 1 }: { opacity?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, opacity, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 30,
          border: `2px solid ${alpha(C.ink600, 0.55)}`,
          background: `radial-gradient(ellipse at 50% 40%, ${alpha(C.ink800, 0.9)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
          boxShadow: `inset 0 0 90px ${alpha('#000000', 0.35)}`,
        }}
      />
      {/* notebook, right edge */}
      <svg width={150} height={210} viewBox="0 0 150 210" style={{ position: 'absolute', right: 44, bottom: 14, opacity: 0.5, transform: 'rotate(6deg)' }} aria-hidden>
        <rect x={4} y={4} width={142} height={202} rx={12} fill={C.ink850} stroke={C.ink600} strokeWidth={3} />
        <path d="M32 4 V206" stroke={C.ink600} strokeWidth={3} />
        {[44, 74, 104, 134, 164].map((y) => (
          <path key={y} d={`M48 ${y} H128`} stroke={alpha(C.muted, 0.35)} strokeWidth={3} strokeLinecap="round" />
        ))}
      </svg>
      {/* mug, bottom left */}
      <svg width={130} height={110} viewBox="0 0 130 110" style={{ position: 'absolute', left: 30, bottom: 26, opacity: 0.5 }} aria-hidden>
        <circle cx={55} cy={55} r={46} fill={C.ink850} stroke={C.ink600} strokeWidth={3} />
        <circle cx={55} cy={55} r={32} fill={C.ink900} stroke={C.ink700} strokeWidth={3} />
        <path d="M100 38 Q126 38 126 56 Q126 74 100 74" fill="none" stroke={C.ink600} strokeWidth={9} strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * «Meridian Dynamics · aeroespacial · tú, su analista de inteligencia» (the strip of G02, V22, V23 and V27).
 * `top` is its y in the stage; `lit` (0-1) brightens it; `youLit` lights its last part.
 */
export function ContextStrip({ top = 8, opacity = 1, lit = 0, youLit = 0 }: { top?: number; opacity?: number; lit?: number; youLit?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top, width: W, display: 'flex', justifyContent: 'center', opacity }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 16,
          height: 58,
          boxSizing: 'border-box',
          padding: '8px 30px 0',
          borderRadius: RADIUS.pill,
          border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * lit)}`,
          background: `linear-gradient(180deg, ${alpha(C.cyan, 0.06 + 0.08 * lit)}, ${alpha(C.ink950, 0.9)})`,
          boxShadow: lit > 0.02 ? `0 0 ${Math.round(24 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
          fontFamily: FONT.sans,
          fontSize: 34,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontWeight: 850, color: C.textStrong }}>{CONTEXT[0]}</span>
        <span style={{ color: C.faint }}>·</span>
        <span style={{ fontWeight: 700, color: C.text }}>{CONTEXT[1]}</span>
        <span style={{ color: C.faint }}>·</span>
        <span style={{ fontWeight: 800, color: youLit > 0.5 ? C.cyanSoft : C.text, opacity: 0.7 + 0.3 * youLit }}>{CONTEXT[2]}</span>
      </div>
    </div>
  );
}
