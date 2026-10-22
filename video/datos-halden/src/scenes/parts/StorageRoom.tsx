import { C, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The storage room's own units. */
export const STORE = { w: 220, h: 150 } as const;

/**
 * The image of concept 3 (labelled «imagen · no es del puerto» where it is the main image): a storage unit with a
 * roll-up door, standing beyond a dashed border line. What matters is WHERE it is, not how it closes: no padlock, key,
 * lock or boxes. `border` 0–1 draws the border line; `rules` 0–1 lights the unit with the other side's colour (amber:
 * «allí mandan sus normas»).
 */
export function StorageRoom({ width = STORE.w, tone = C.sky, border = 1, rules = 0 }: { width?: number; tone?: string; border?: number; rules?: number }) {
  const b = clamp01(border);
  const r = clamp01(rules);
  const unit = r > 0.01 ? C.amber : tone;
  return (
    <svg width={width} height={(width * STORE.h) / STORE.w} viewBox={`0 0 ${STORE.w} ${STORE.h}`} style={{ overflow: 'visible' }}>
      {/* ground */}
      <line x1={0} y1={136} x2={220} y2={136} stroke={C.ink600} strokeWidth={3} />
      {/* the border: a dashed line with two posts */}
      <g opacity={b}>
        <line x1={58} y1={14} x2={58} y2={140} stroke={C.textStrong} strokeWidth={4} strokeDasharray="12 9" strokeLinecap="round" />
        <rect x={52} y={112} width={12} height={26} rx={3} fill={C.ink700} stroke={C.text} strokeWidth={2} />
      </g>
      {/* this side: a small house (yours) */}
      <path d="M 8 136 L 8 100 L 26 84 L 44 100 L 44 136 Z" fill={alpha(C.cyan, 0.12)} stroke={C.cyan} strokeWidth={3} strokeLinejoin="round" />
      <rect x={20} y={112} width={12} height={24} fill={alpha(C.cyan, 0.3)} />
      {/* the other side: the storage unit */}
      <rect x={84} y={56} width={124} height={80} rx={4} fill={alpha(unit, 0.1 + 0.08 * r)} stroke={unit} strokeWidth={4} />
      <path d="M 78 58 L 146 30 L 214 58" fill="none" stroke={unit} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      {/* roll-up door slats */}
      <rect x={104} y={74} width={84} height={62} fill={C.ink900} stroke={alpha(unit, 0.8)} strokeWidth={3} />
      {[86, 98, 110, 122].map((y) => (
        <line key={y} x1={106} y1={y} x2={186} y2={y} stroke={alpha(unit, 0.55)} strokeWidth={2.5} />
      ))}
    </svg>
  );
}
