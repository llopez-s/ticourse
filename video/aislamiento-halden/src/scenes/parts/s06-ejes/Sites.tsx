import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

export const SITES = { w: 250, h: 170 } as const;
const DOT_Y = 140;
const DOT_X = [30, 93, 156, 220];

/** A small console (a screen on a foot). */
function Console({ x, y, s, color, off = 0 }: { x: number; y: number; s: number; color: string; off?: number }) {
  return (
    <g>
      <rect x={x - 30 * s} y={y - 22 * s} width={60 * s} height={40 * s} rx={6 * s} fill={off > 0.5 ? C.ink900 : alpha(color, 0.22)} stroke={color} strokeWidth={3} />
      <rect x={x - 4 * s} y={y + 18 * s} width={8 * s} height={10 * s} fill={color} />
      <rect x={x - 16 * s} y={y + 27 * s} width={32 * s} height={5 * s} rx={2} fill={color} />
    </g>
  );
}

/**
 * CENTRALIZED: one console wired to four sites. On `down` (the error sound) the console blinks rose and goes dark, its
 * lines drop and the four sites go grey — «si cae la consola, todas a ciegas». `down` 0–1, `blink` 0/1 while flashing.
 */
export function CentralSites({ down, blink }: { down: number; blink: number }) {
  const d = clamp01(down);
  const consoleColor = blink > 0.5 ? C.rose : d > 0.5 ? C.faint : C.cyan;
  return (
    <svg width={SITES.w} height={SITES.h} viewBox={`0 0 ${SITES.w} ${SITES.h}`} style={{ overflow: 'visible' }}>
      {DOT_X.map((x, i) => (
        <line key={i} x1={125} y1={64} x2={x} y2={DOT_Y - 14} stroke={alpha(C.cyan, 0.7 * (1 - d))} strokeWidth={3} />
      ))}
      <Console x={125} y={30} s={1.2} color={consoleColor} off={d} />
      {d > 0.5 ? (
        <g>
          <line x1={103} y1={14} x2={147} y2={48} stroke={C.rose} strokeWidth={5} strokeLinecap="round" />
          <line x1={147} y1={14} x2={103} y2={48} stroke={C.rose} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : null}
      {DOT_X.map((x, i) => (
        <circle key={i} cx={x} cy={DOT_Y} r={14} fill={d > 0.5 ? C.ink700 : C.cyan} stroke={d > 0.5 ? C.faint : C.ink900} strokeWidth={3} />
      ))}
    </svg>
  );
}

/** DECENTRALIZED: four sites, each with its own console in its own colour (políticas distintas). `on` 0–1. */
export function LocalSites({ on }: { on: number }) {
  const o = clamp01(on);
  const colors = [C.cyan, C.amber, C.emerald, C.violet];
  return (
    <svg width={SITES.w} height={SITES.h} viewBox={`0 0 ${SITES.w} ${SITES.h}`} style={{ overflow: 'visible' }}>
      {DOT_X.map((x, i) => (
        <g key={i} opacity={0.4 + 0.6 * o}>
          <Console x={x} y={60 + (i % 2) * 10} s={0.62} color={colors[i]} />
          <line x1={x} y1={88 + (i % 2) * 10} x2={x} y2={DOT_Y - 14} stroke={alpha(colors[i], 0.7)} strokeWidth={3} />
          <circle cx={x} cy={DOT_Y} r={14} fill={colors[i]} stroke={C.ink900} strokeWidth={3} />
        </g>
      ))}
    </svg>
  );
}
