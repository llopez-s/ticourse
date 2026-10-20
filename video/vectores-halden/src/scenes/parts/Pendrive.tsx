import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../engine/src/ui';

/** The pendrive's own units (viewBox). The plug points left. */
export const PENDRIVE = { w: 300, h: 110 } as const;

/** Its sticker, verbatim (canon). */
export const STICKER = 'Nóminas 2027';

/**
 * The pendrive found on the counter (s04; s05's background draws its own, without a sticker): a dark body, the metal
 * plug on the left and, when `sticker` is set, a paper sticker «Nóminas 2027» (the bait, amber when `bait` 0–1).
 * Text size follows `width` (≥ 32 px from width ≈ 370).
 */
export function Pendrive({ width, sticker = true, bait = 0, glow = 0 }: { width: number; sticker?: boolean; bait?: number; glow?: number }) {
  const h = (width * PENDRIVE.h) / PENDRIVE.w;
  const b = clamp01(bait);
  const g = clamp01(glow);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${PENDRIVE.w} ${PENDRIVE.h}`} style={{ display: 'block', overflow: 'visible' }}>
      {g > 0.02 ? <rect x={-10} y={5} width={320} height={100} rx={30} fill={alpha(C.cyan, 0.18 * g)} /> : null}
      {/* plug */}
      <rect x={0} y={34} width={64} height={42} rx={4} fill="#94a3b8" stroke="#cbd5e1" strokeWidth={2} />
      <rect x={12} y={44} width={14} height={9} fill="#475569" />
      <rect x={34} y={44} width={14} height={9} fill="#475569" />
      {/* body */}
      <rect x={56} y={14} width={244} height={82} rx={18} fill="#1f2a3d" stroke={alpha(C.text, 0.4)} strokeWidth={3} />
      <circle cx={282} cy={55} r={7} fill={C.ink950} stroke={alpha(C.text, 0.4)} strokeWidth={2} />
      {sticker ? (
        <g>
          <rect x={80} y={26} width={186} height={58} rx={6} fill="#f1ead8" stroke={b > 0.02 ? C.amber : '#d6cdb6'} strokeWidth={b > 0.02 ? 4 : 2} transform="rotate(-2 173 55)" />
          {b > 0.02 ? <rect x={74} y={20} width={198} height={70} rx={9} fill="none" stroke={alpha(C.amber, 0.4 * b)} strokeWidth={10} transform="rotate(-2 173 55)" /> : null}
          <text x={173} y={65} textAnchor="middle" fontFamily={FONT.sans} fontWeight={800} fontSize={24} fill="#1e293b" transform="rotate(-2 173 55)">
            {STICKER}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
