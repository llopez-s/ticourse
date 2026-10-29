import type { ReactNode } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The video's one image: the red pen (boli rojo) of whoever marks a maths problem. It is drawn along +x with its
 * TIP at (0, 0) and rotated about the tip, so the position you give is the point it touches.
 *   capped   the cap is on (s01: beside the draft, unused); off = ready to write
 *   hand     a plain grey hand holds it (s02 onwards); the arm fades out so it never reaches the chrome
 * <RedPen x y angle … /> is absolutely positioned in its parent's coordinates.
 */
const LEN = 340;

function PenBody({ capped }: { capped: boolean }) {
  return (
    <svg width={LEN + 20} height={64} viewBox={`-10 -32 ${LEN + 20} 64`} style={{ position: 'absolute', left: -10, top: -32, overflow: 'visible' }} aria-hidden>
      <defs>
        <linearGradient id="fc-pen-body" x1="0" y1="-11" x2="0" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.roseSoft} />
          <stop offset="0.45" stopColor={C.rose} />
          <stop offset="1" stopColor={C.roseDeep} />
        </linearGradient>
      </defs>
      {/* nib */}
      <path d="M 0 0 L 44 -9 L 44 9 Z" fill={C.ink700} stroke={C.ink500} strokeWidth={2.5} strokeLinejoin="round" />
      {!capped ? <circle cx={2} cy={0} r={3.4} fill={C.rose} /> : null}
      {/* barrel */}
      <rect x={44} y={-11} width={LEN - 44} height={22} rx={9} fill="url(#fc-pen-body)" stroke={C.roseDeep} strokeWidth={2.5} />
      <rect x={44} y={-11} width={12} height={22} fill={C.roseDeep} opacity={0.75} />
      <path d={`M ${LEN - 150} -11 H ${LEN - 36}`} stroke={C.roseSoft} strokeWidth={4} strokeLinecap="round" opacity={0.85} transform="translate(0 -3)" />
      <circle cx={LEN - 12} cy={0} r={5} fill={C.roseDeep} opacity={0.85} />
      {/* cap */}
      {capped ? (
        <g>
          <rect x={-4} y={-14} width={132} height={28} rx={14} fill={C.roseDeep} stroke={C.rose} strokeWidth={3} />
          <path d="M 14 -8 H 112" stroke={C.roseSoft} strokeWidth={4} strokeLinecap="round" opacity={0.55} />
          <rect x={92} y={-19} width={34} height={7} rx={3} fill={C.rose} />
        </g>
      ) : null}
    </svg>
  );
}

/** A plain grey hand, drawn in the pen's coordinates (behind the pen: arm and palm; in front: index and thumb). */
function HandBack() {
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
      <defs>
        <linearGradient id="fc-arm" x1="190" y1="0" x2="520" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C.muted} stopOpacity={0.95} />
          <stop offset="0.55" stopColor={C.muted} stopOpacity={0.8} />
          <stop offset="1" stopColor={C.muted} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d="M 200 -52 L 520 -44 L 520 44 L 200 56 Z" fill="url(#fc-arm)" />
      <ellipse cx={226} cy={2} rx={66} ry={58} fill={C.muted} stroke={C.ink500} strokeWidth={3} />
    </svg>
  );
}

function HandFront() {
  const finger = (x1: number, y1: number, x2: number, y2: number) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ink500} strokeWidth={34} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.muted} strokeWidth={27} strokeLinecap="round" />
    </g>
  );
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
      {finger(214, -38, 132, -8)}
      {finger(214, 44, 150, 12)}
    </svg>
  );
}

export function RedPen({ x, y, angle = -52, capped = false, hand = false, show = 1, glow = 0, children }: { x: number; y: number; angle?: number; capped?: boolean; hand?: boolean; show?: number; glow?: number; children?: ReactNode }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        opacity: show,
        filter: glow > 0.01 ? `drop-shadow(0 0 ${Math.round(14 * glow)}px ${alpha(C.rose, 0.6 * glow)})` : `drop-shadow(0 10px 14px ${alpha('#000000', 0.4)})`,
        pointerEvents: 'none',
      }}
    >
      {hand ? <HandBack /> : null}
      <PenBody capped={capped} />
      {hand ? <HandFront /> : null}
      {children}
    </div>
  );
}
