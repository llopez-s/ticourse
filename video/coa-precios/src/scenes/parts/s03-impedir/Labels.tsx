import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { S03 } from '../../../data/s03-impedir';

const SOFT = { cyan: C.cyanSoft, emerald: '#6ee7b7' } as const;

/**
 * A verb and what it means, as one pill: «DENY · no llega a funcionar». `show` 0–1 brings it in, `lit`
 * 0–1 makes it glow (the voice is on it), `dim` 0–1 steps it back.
 */
export function VerbPill({ name, sub, show, lit = 0, dim = 0, height = 60 }: { name: string; sub: string; show: number; lit?: number; dim?: number; height?: number }) {
  if (show <= 0.004) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 18,
        height,
        boxSizing: 'border-box',
        padding: '4px 26px 0',
        borderRadius: 16,
        border: `3px solid ${alpha(C.emerald, 0.55 + 0.45 * lit)}`,
        background: alpha('#04241b', 0.92),
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(28 * lit)}px ${alpha(C.emerald, 0.4 * lit)}` : undefined,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show * (1 - 0.5 * dim),
        transform: `translateY(${(1 - show) * 12}px)`,
      }}
    >
      <span style={{ fontSize: 46, lineHeight: `${height - 10}px`, fontWeight: 900, letterSpacing: 1, color: C.emerald }}>{name}</span>
      <span style={{ fontSize: 38, fontWeight: 750, color: C.textStrong }}>{sub}</span>
    </div>
  );
}

/** «una alarma sola / no para nada», beside the ringing alarm. */
export function AlonePhrase({ show, stress }: { show: number; stress: number }) {
  if (show <= 0.004) return null;
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: 64, lineHeight: 1.14, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap', opacity: show, transform: `translateX(${(1 - show) * 18}px)` }}>
      <div>
        una <span style={{ color: C.cyanSoft }}>alarma</span> sola
      </div>
      <div style={{ color: alpha(C.textStrong, 0.55 + 0.45 * stress) }}>no para nada</div>
    </div>
  );
}

/** Chapter close on one line: «Discover y Detect miran · Deny y Disrupt paran». `said[i]` 0–1 lights each half. */
export function WrapLine({ show, said }: { show: number; said: [number, number] }) {
  if (show <= 0.004) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 22,
        padding: '5px 36px 9px',
        borderRadius: 16,
        border: `2px solid ${alpha(C.violet, 0.55)}`,
        background: alpha('#1a1033', 0.92),
        fontFamily: FONT.sans,
        fontSize: 40,
        lineHeight: 1.1,
        fontWeight: 850,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 10}px)`,
      }}
    >
      {S03.wrap.map((half, i) => (
        <span key={half.verb} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 22 }}>
          {i > 0 ? <span style={{ color: C.faint }}>·</span> : null}
          <span style={{ opacity: 0.5 + 0.5 * said[i] }}>
            <span style={{ color: SOFT[half.tone] }}>{half.a}</span>
            <span style={{ color: C.text, fontWeight: 700 }}> y </span>
            <span style={{ color: SOFT[half.tone] }}>{half.b}</span>
            <span style={{ color: C.textStrong }}> {half.verb}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
