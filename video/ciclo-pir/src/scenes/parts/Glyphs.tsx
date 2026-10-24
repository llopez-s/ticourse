import type { CSSProperties, ReactElement } from 'react';
import { C, alpha } from '../../../../engine/src/theme/tokens';

/**
 * The restaurant's glyphs, drawn as strokes on a 64-unit grid (no emoji, no font glyphs): one per station of the
 * intelligence cycle, plus the cloche/plate of the finished dish and EMBER FOX's mark. Same stroke family as the
 * engine's `Icon`, so they sit well beside it.
 */
export type StationKind = 'ticket' | 'basket' | 'board' | 'stove' | 'tray' | 'notebook';

export const STATION_KINDS: readonly StationKind[] = ['ticket', 'basket', 'board', 'stove', 'tray', 'notebook'];

const SHAPES: Record<StationKind, ReactElement> = {
  // Planning & Direction: the comanda hanging on the order rail.
  ticket: (
    <>
      <path d="M8 9 H56" />
      <path d="M32 9 V13" />
      <path d="M18 13 H46 V55 L42 51 L38 55 L34 51 L30 55 L26 51 L22 55 L18 51 Z" />
      <path d="M24 23 H40 M24 31 H40 M24 39 H33" />
    </>
  ),
  // Collection: the market basket.
  basket: (
    <>
      <path d="M8 28 H56 L50 54 H14 Z" />
      <path d="M19 28 C19 9 45 9 45 28" />
      <path d="M24 35 V47 M32 35 V47 M40 35 V47" />
    </>
  ),
  // Processing & Exploitation: the chopping board and its knife.
  board: (
    <>
      <rect x="6" y="36" width="52" height="18" rx="4" />
      <circle cx="49" cy="45" r="2.6" />
      <path d="M12 31 L37 12 L42 18 L22 33 Z" />
      <path d="M37 12 L50 6 L54 12 L42 18" />
    </>
  ),
  // Analysis & Production: the pan on the burner.
  stove: (
    <>
      <path d="M8 33 H44 V38 Q44 48 34 48 H18 Q8 48 8 38 Z" />
      <path d="M44 35 H58" />
      <path d="M17 26 q-3 -4 0 -8 M26 26 q-3 -4 0 -8 M35 26 q-3 -4 0 -8" />
      <path d="M14 58 C10 54 16 52 14 49 C20 52 18 56 14 58 Z M26 58 C22 54 28 52 26 49 C32 52 30 56 26 58 Z" />
    </>
  ),
  // Dissemination: the tray with its cloche.
  tray: (
    <>
      <path d="M5 50 H59" />
      <path d="M12 56 H52" />
      <path d="M12 48 C12 28 52 28 52 48" />
      <circle cx="32" cy="24" r="3.4" />
    </>
  ),
  // Feedback: the guest book with its pencil.
  notebook: (
    <>
      <rect x="14" y="8" width="34" height="48" rx="4" />
      <path d="M14 18 H9 M14 30 H9 M14 42 H9" />
      <path d="M22 20 H40 M22 29 H40" />
      <path d="M40 46 L52 34 L57 39 L45 51 L38 52 Z" />
    </>
  ),
};

export function StationGlyph({
  kind,
  size = 80,
  color = C.cyan,
  strokeWidth = 3.2,
  style,
}: {
  kind: StationKind;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }}
      aria-hidden
    >
      {SHAPES[kind]}
    </svg>
  );
}

/** A fox's head in flat facets with a spark on its brow: EMBER FOX's mark (rose, the adversary). 64-unit viewBox. */
export function FoxGlyph({ size = 120, color = C.rose, style }: { size?: number; color?: string; style?: CSSProperties }) {
  const light = alpha(color, 0.5);
  const mid = alpha(color, 0.3);
  const dark = alpha(color, 0.16);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ display: 'block', overflow: 'visible', ...style }} aria-hidden>
      {/* Ears */}
      <path d="M8 6 L26 20 L12 32 Z" fill={mid} stroke={color} strokeWidth={1.8} />
      <path d="M56 6 L38 20 L52 32 Z" fill={mid} stroke={color} strokeWidth={1.8} />
      {/* Forehead and cheeks */}
      <path d="M26 20 H38 L32 38 Z" fill={light} stroke={color} strokeWidth={1.6} />
      <path d="M12 32 L26 20 L32 38 L8 38 Z" fill={dark} stroke={color} strokeWidth={1.6} />
      <path d="M52 32 L38 20 L32 38 L56 38 Z" fill={dark} stroke={color} strokeWidth={1.6} />
      {/* Muzzle */}
      <path d="M8 38 L32 38 L56 38 L32 60 Z" fill={mid} stroke={color} strokeWidth={1.8} />
      <path d="M27 52 L37 52 L32 58 Z" fill={color} stroke={color} strokeWidth={1.2} />
      {/* Eyes */}
      <path d="M17 33 L25 36" stroke={color} strokeWidth={2.2} />
      <path d="M47 33 L39 36" stroke={color} strokeWidth={2.2} />
      {/* The ember: a small spark on the brow */}
      <path d="M32 4 L35 10 L32 16 L29 10 Z" fill={C.amber} stroke={C.amber} strokeWidth={1.2} />
    </svg>
  );
}

/** A plate with its dish, tidy: the «impeccable» plate of the analysis nobody asked for. 96×64 viewBox. */
export function PlateGlyph({ width = 220, color = C.cyan, style }: { width?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={width} height={(width * 64) / 96} viewBox="0 0 96 64" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', overflow: 'visible', ...style }} aria-hidden>
      <ellipse cx="48" cy="44" rx="42" ry="13" fill={alpha(color, 0.1)} stroke={color} strokeWidth={2.4} />
      <ellipse cx="48" cy="42" rx="28" ry="8" stroke={alpha(color, 0.55)} strokeWidth={1.6} />
      {/* The dish: a neat fillet, a sprig and a dot of sauce */}
      <path d="M32 38 C36 26 60 26 64 38 C58 43 38 43 32 38 Z" fill={alpha(color, 0.28)} stroke={color} strokeWidth={2.2} />
      <path d="M42 30 C46 33 52 33 56 30" stroke={alpha(color, 0.8)} strokeWidth={1.6} />
      <path d="M68 38 q4 -8 8 -4 M68 38 q6 0 8 -4" stroke={C.emerald} strokeWidth={2} />
      <circle cx="26" cy="42" r="2.2" fill={color} />
      {/* A shine */}
      <path d="M44 6 L46 12 L52 14 L46 16 L44 22 L42 16 L36 14 L42 12 Z" fill={C.amber} stroke={C.amber} strokeWidth={1} />
    </svg>
  );
}

/** A chair seen from the side, for the table of the board (consejo). 64-unit viewBox. */
export function ChairGlyph({ size = 90, color = C.muted, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden>
      <path d="M18 6 V34 H46" />
      <path d="M18 6 H26 V34" />
      <path d="M14 34 H50 V42 H14 Z" />
      <path d="M18 42 V58 M46 42 V58" />
    </svg>
  );
}

/** A gear outline: `teeth` teeth between `rIn` (root) and `rOut` (tip), centred on (0, 0), the first tooth centred up. */
export function gearPath(teeth: number, rOut: number, rIn: number): string {
  const step = (2 * Math.PI) / teeth;
  // Each tooth: a flat top about 38 % of the pitch, flanks 20 % each, the root the rest.
  const top = step * 0.19;
  const flank = step * 0.1;
  const pts: [number, number][] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2;
    pts.push(
      [rIn * Math.cos(a - top - flank), rIn * Math.sin(a - top - flank)],
      [rOut * Math.cos(a - top), rOut * Math.sin(a - top)],
      [rOut * Math.cos(a + top), rOut * Math.sin(a + top)],
      [rIn * Math.cos(a + top + flank), rIn * Math.sin(a + top + flank)],
    );
  }
  return `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`;
}
