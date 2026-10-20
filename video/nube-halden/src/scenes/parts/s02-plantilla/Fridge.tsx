import { C, alpha } from '../../../../../engine/src/theme/tokens';

/** The fridge drawing's own units (the fridge stands on the floor line, against a plain office wall). */
export const FRIDGE = { w: 420, h: 600 } as const;
/** Where the post-it sits on the main door (centre, fridge units). */
export const POSTIT_SPOT: [number, number] = [214, 318];

/**
 * An office fridge standing alone against a plain wall: a floor line and a skirting board, nothing else (no tiles,
 * stove or cupboards: V35's kitchen is not this). Freezer door on top, main door below, two handles. Fridge units.
 */
export function Fridge({ width = FRIDGE.w }: { width?: number }) {
  const h = (width * FRIDGE.h) / FRIDGE.w;
  const body = C.ink800;
  const edge = alpha(C.muted, 0.7);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${FRIDGE.w} ${FRIDGE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* The office wall: a skirting board and the floor. */}
      <rect x={0} y={560} width={FRIDGE.w} height={14} fill={alpha(C.muted, 0.12)} />
      <line x1={0} y1={584} x2={FRIDGE.w} y2={584} stroke={alpha(C.muted, 0.35)} strokeWidth={3} />
      {/* Body */}
      <rect x={90} y={36} width={250} height={544} rx={22} fill={body} stroke={edge} strokeWidth={4} />
      <line x1={92} y1={196} x2={338} y2={196} stroke={edge} strokeWidth={4} />
      {/* Handles */}
      <rect x={306} y={92} width={12} height={70} rx={6} fill={alpha(C.muted, 0.6)} />
      <rect x={306} y={224} width={12} height={130} rx={6} fill={alpha(C.muted, 0.6)} />
      {/* Feet */}
      <rect x={112} y={578} width={30} height={8} rx={3} fill={alpha(C.muted, 0.5)} />
      <rect x={288} y={578} width={30} height={8} rx={3} fill={alpha(C.muted, 0.5)} />
      {/* A soft sheen */}
      <rect x={112} y={60} width={14} height={110} rx={7} fill={alpha('#ffffff', 0.05)} />
      <rect x={112} y={222} width={14} height={300} rx={7} fill={alpha('#ffffff', 0.05)} />
    </svg>
  );
}

/**
 * A neutral hand (cyan outline, never rose: the rose hand in a pocket is V36's pickpocket) pinching something at its
 * fingertips, which sit at the top-left of its 200×150 box.
 */
export function Hand({ width = 200 }: { width?: number }) {
  const h = (width * 150) / 200;
  return (
    <svg width={width} height={h} viewBox="0 0 200 150" style={{ display: 'block', overflow: 'visible' }}>
      <g fill={C.ink850} stroke={C.cyanSoft} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        {/* Forearm leaving to the right */}
        <path d="M 120 70 L 200 92 L 200 140 L 108 116 Z" />
        {/* Palm */}
        <path d="M 40 46 Q 70 24 116 48 Q 140 64 128 104 Q 116 130 70 118 Q 40 108 36 82 Z" />
        {/* Index finger reaching to the tip */}
        <path d="M 52 50 Q 30 34 8 18 Q 2 12 10 8 Q 34 14 66 36" />
        {/* Thumb meeting it */}
        <path d="M 46 82 Q 22 60 12 30 Q 10 22 18 22 Q 34 42 60 64" />
      </g>
    </svg>
  );
}
