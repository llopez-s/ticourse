import { useId } from 'react';
import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * s02-02 «Tu acreditación te abre las oficinas, pero no el muelle»: the
 * accreditation card on the street, a dashed «try» towards each gate, and the
 * outcome at each gate (an emerald tick where the barrier opens, a rose cross
 * where it stays down). An SVG overlay in stage px over the PortMap.
 */

type Pt = { x: number; y: number };

export function BadgeCard({ x, y, show, scale = 1 }: { x: number; y: number; show: number; scale?: number }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  const w = 84;
  const h = 58;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * (0.8 + 0.2 * s)})`} opacity={s}>
      <rect x={-w / 2 - 10} y={-h / 2 - 10} width={w + 20} height={h + 20} rx={16} fill={alpha(C.cyan, 0.14)} />
      {/* Lanyard clip */}
      <rect x={-10} y={-h / 2 - 8} width={20} height={10} rx={3} fill={C.ink700} stroke={C.cyan} strokeWidth={2.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={9} fill={C.ink800} stroke={C.cyan} strokeWidth={3.4} />
      {/* Photo square and two text lines */}
      <rect x={-w / 2 + 10} y={-h / 2 + 12} width={22} height={28} rx={3} fill={alpha(C.cyan, 0.35)} />
      <line x1={-w / 2 + 40} y1={-6} x2={w / 2 - 10} y2={-6} stroke={C.cyanSoft} strokeWidth={4} strokeLinecap="round" />
      <line x1={-w / 2 + 40} y1={8} x2={w / 2 - 22} y2={8} stroke={alpha(C.cyanSoft, 0.6)} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** A dashed path drawn from its start (p 0–1), revealed through a mask so the dashes keep their spacing. */
export function TryPath({ pts, p, color = C.cyan }: { pts: Pt[]; p: number; color?: string }) {
  const id = `try-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const k = clamp01(p);
  if (k <= 0.01) return null;
  const d = pts.map((pt, i) => `${i ? 'L' : 'M'} ${pt.x} ${pt.y}`).join(' ');
  return (
    <g>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={1728} height={660}>
          <path d={d} fill="none" stroke="#ffffff" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={alpha(color, 0.9)} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 10" mask={`url(#${id})`} />
    </g>
  );
}

/** Outcome marker: an emerald tick (passes) or a rose cross (refused) in a ring. */
export function Outcome({ x, y, kind, show }: { x: number; y: number; kind: 'pass' | 'refuse'; show: number }) {
  const s = clamp01(show);
  if (s <= 0.01) return null;
  const col = kind === 'pass' ? C.emerald : C.rose;
  const r = 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * s})`} opacity={Math.min(1, s * 1.4)}>
      <circle r={r + 10} fill={alpha(col, 0.18)} />
      <circle r={r} fill={C.ink900} stroke={col} strokeWidth={4} />
      {kind === 'pass' ? (
        <path d="M -13 1 L -4 11 L 14 -10" fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" />
      )}
    </g>
  );
}
