import { C, alpha } from '../../../../engine/src/theme/tokens';

/** The lock's box in its own units at width 1 (height = width × LOCK_RATIO). */
export const LOCK_RATIO = 1.5;
/** Where the tag's string ties on, as fractions of the lock's box (the lever handle's end). */
export const LOCK_TIE = { x: 0.9, y: 0.36 } as const;

/**
 * The video's lock (s01 opens on it, s04 brings it back with both boxes filled, the poster shows it): a door's
 * lever handle over an escutcheon with a keyhole, drawn flat in SVG. Physical and preventive — never a padlock
 * («candado» is an occupied image of the campaign) and never a card reader (that is s07's archive door).
 * `glow` (0–1) lights a soft cyan halo behind it.
 */
export function Lock({ width = 260, glow = 0 }: { width?: number; glow?: number }) {
  const w = width;
  const h = Math.round(width * LOCK_RATIO);
  const plateX = w * 0.22;
  const plateW = w * 0.36;
  const plateY = h * 0.08;
  const plateH = h * 0.84;
  const cx = plateX + plateW / 2;
  const hubY = h * 0.36;
  const keyY = h * 0.68;
  const stroke = Math.max(2, w * 0.012);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="lock-glow">
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.22} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="lock-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="55%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      {glow > 0.01 ? <circle cx={cx} cy={h * 0.5} r={w * 0.9} fill="url(#lock-glow)" opacity={glow} /> : null}
      {/* escutcheon plate */}
      <rect x={plateX} y={plateY} width={plateW} height={plateH} rx={plateW / 2} fill="url(#lock-metal)" stroke={alpha('#000000', 0.35)} strokeWidth={stroke} />
      <rect x={plateX + plateW * 0.14} y={plateY + plateH * 0.05} width={plateW * 0.72} height={plateH * 0.9} rx={plateW * 0.36} fill="none" stroke={alpha('#ffffff', 0.25)} strokeWidth={stroke} />
      {/* keyhole */}
      <circle cx={cx} cy={keyY} r={plateW * 0.14} fill={C.ink950} />
      <path d={`M ${cx - plateW * 0.07} ${keyY} L ${cx - plateW * 0.11} ${keyY + plateW * 0.42} L ${cx + plateW * 0.11} ${keyY + plateW * 0.42} L ${cx + plateW * 0.07} ${keyY} Z`} fill={C.ink950} />
      {/* lever handle: hub on the plate, lever to the right */}
      <rect x={cx - w * 0.04} y={hubY - w * 0.07} width={w * 0.72} height={w * 0.14} rx={w * 0.07} fill="url(#lock-metal)" stroke={alpha('#000000', 0.35)} strokeWidth={stroke} />
      <circle cx={cx} cy={hubY} r={plateW * 0.36} fill="url(#lock-metal)" stroke={alpha('#000000', 0.4)} strokeWidth={stroke} />
      <circle cx={cx} cy={hubY} r={plateW * 0.16} fill={alpha('#ffffff', 0.25)} />
    </svg>
  );
}
