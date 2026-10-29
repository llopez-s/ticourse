import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * A desk seen from above: a dark surface with faint grain, a keyboard, a mug
 * and a pen at its edges. Pure texture, nothing readable; it sits under the
 * content and fills `width` × `height`.
 */
export function Desk({ width, height, opacity = 1 }: { width: number; height: number; opacity?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 40,
        overflow: 'hidden',
        opacity,
        boxSizing: 'border-box',
        border: `2px solid ${C.ink700}`,
        background: `linear-gradient(150deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
      }}
    >
      {/* grain */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${alpha(C.ink700, 0.35)} 0px, ${alpha(C.ink700, 0.35)} 1px, transparent 1px, transparent 26px)`, opacity: 0.5 }} />
      {/* keyboard, cropped by the bottom-left corner */}
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: height - 118,
          width: 430,
          height: 150,
          borderRadius: 18,
          transform: 'rotate(-3deg)',
          background: alpha(C.ink800, 0.95),
          border: `2px solid ${C.ink600}`,
          backgroundImage: `linear-gradient(${C.ink900} 4px, transparent 4px), linear-gradient(90deg, ${C.ink900} 4px, transparent 4px)`,
          backgroundSize: '38px 30px',
          backgroundPosition: '10px 14px',
        }}
      />
      {/* mug, seen from above */}
      <svg width="130" height="130" viewBox="0 0 130 130" style={{ position: 'absolute', left: width - 190, top: height - 150, display: 'block' }} aria-hidden>
        <path d="M100 40 C128 40 128 80 100 80" fill="none" stroke={C.ink600} strokeWidth="9" strokeLinecap="round" />
        <circle cx="60" cy="60" r="48" fill={C.ink800} stroke={C.ink600} strokeWidth="4" />
        <circle cx="60" cy="60" r="36" fill={alpha(C.amberDeep, 0.8)} stroke={alpha(C.amber, 0.35)} strokeWidth="3" />
      </svg>
      {/* pen */}
      <div style={{ position: 'absolute', left: width - 520, top: height - 70, width: 190, height: 12, borderRadius: 6, transform: 'rotate(-14deg)', background: `linear-gradient(90deg, ${C.ink600}, ${alpha(C.cyan, 0.6)})` }} />
    </div>
  );
}
