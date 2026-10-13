import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * «El acta del armador»: the signed paper of rule 2's miniature (the exception record, drawn small): a sheet with lines
 * of text as bars (never letters), a signature stroke, a round seal and a clock for the expiry. Design 100 × 128 → `width`.
 * `show` is the whole sheet, `sign` (0–1) draws the signature and lands the seal. Not positioned.
 */
export function Acta({ width = 110, show = 1, sign = 1 }: { width?: number; show?: number; sign?: number }) {
  const k = width / 100;
  const s = clamp01(sign);
  return (
    <div style={{ position: 'relative', width, height: 128 * k, opacity: clamp01(show), transform: `translateY(${(1 - clamp01(show)) * 10}px) rotate(-3deg)` }}>
      <svg width={width} height={128 * k} viewBox="0 0 100 128" style={{ display: 'block', overflow: 'visible', filter: `drop-shadow(0 6px 10px ${alpha('#000000', 0.5)})` }}>
        <rect x={2} y={2} width={96} height={124} rx={6} fill="#e8edf3" stroke="#94a3b8" strokeWidth={3} />
        <rect x={14} y={14} width={44} height={8} rx={3} fill="#64748b" />
        {[34, 46, 58].map((y, i) => (
          <rect key={y} x={14} y={y} width={72 - i * 10} height={6} rx={3} fill="#94a3b8" />
        ))}
        <path d="M 16 100 q 8 -16 14 -2 t 14 -4 t 12 0" fill="none" stroke="#1e3a8a" strokeWidth={3.4} strokeLinecap="round" strokeDasharray="120" strokeDashoffset={120 * (1 - s)} />
        <circle cx={76} cy={94} r={15} fill={alpha(C.violet, 0.9 * s)} stroke="#6d28d9" strokeWidth={3} opacity={s} />
        <path d="M 69 94 l 5 5 l 9 -11" fill="none" stroke="#f5f3ff" strokeWidth={4} strokeLinecap="round" opacity={s} />
      </svg>
      <div style={{ position: 'absolute', right: -10, top: -12, width: 36 * k, height: 36 * k, borderRadius: 18 * k, background: C.ink900, border: `3px solid ${C.amber}`, display: 'grid', placeItems: 'center' }}>
        <Icon name="clock" size={22 * k} color={C.amber} strokeWidth={2.4} />
      </div>
    </div>
  );
}
