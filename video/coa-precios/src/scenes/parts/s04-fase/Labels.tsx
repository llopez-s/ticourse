import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { S04 } from '../../../data/s04-fase';

const SOFT = { cyan: C.cyanSoft, emerald: '#6ee7b7', amber: '#fcd34d' } as const;
const VIOLET_SOFT = '#c4b5fd';

/** «cada fila es una fase»: the reading rule, big, over the shop. */
export function RowNote({ show }: { show: number }) {
  if (show <= 0.004) return null;
  const [head, tail] = S04.note.split(' es ');
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: 60, lineHeight: 1.1, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 14}px)` }}>
      <span style={{ color: C.cyanSoft }}>{head}</span> es <span style={{ color: VIOLET_SOFT }}>{tail}</span>
    </div>
  );
}

/** «la fase, desprotegida»: an amber dashed tag hung under the row left with one cell. */
export function UnopposedTag({ show }: { show: number }) {
  if (show <= 0.004) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '4px 26px 8px',
        borderRadius: 14,
        border: `3px dashed ${alpha(C.amber, 0.95)}`,
        background: alpha('#1c1203', 0.96),
        boxShadow: `0 14px 30px ${alpha('#000000', 0.55)}, 0 0 ${Math.round(24 * show)}px ${alpha(C.amber, 0.3)}`,
        fontFamily: FONT.sans,
        fontSize: 42,
        lineHeight: 1.15,
        fontWeight: 850,
        color: SOFT.amber,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * -10}px)`,
      }}
    >
      {S04.unopposed}
    </div>
  );
}

/** «si una falla, otra avisa o atrapa»: one line; `said[i]` 0–1 lights each of its three parts. */
export function FallbackLine({ show, said }: { show: number; said: [number, number, number] }) {
  if (show <= 0.004) return null;
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: 43, lineHeight: 1.15, fontWeight: 850, letterSpacing: -0.4, whiteSpace: 'nowrap', opacity: show, transform: `translateY(${(1 - show) * 10}px)` }}>
      {S04.fallback.map((part, i) => (
        <span key={part.text} style={{ color: said[i] > 0.5 ? SOFT[part.tone] : C.text, opacity: 0.5 + 0.5 * said[i] }}>
          {i ? ' ' : ''}
          {part.text}
        </span>
      ))}
    </div>
  );
}

/** «varias celdas por fase · pasivas y activas»: the scene's rule, on two lines. */
export function ManyBlock({ show, passive, active }: { show: number; passive: number; active: number }) {
  if (show <= 0.004) return null;
  const m = S04.many;
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '6px 30px 10px',
        borderRadius: 18,
        border: `2px solid ${alpha(C.violet, 0.6)}`,
        background: alpha('#1a1033', 0.92),
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show,
        transform: `translateY(${(1 - show) * 12}px)`,
      }}
    >
      <div style={{ fontSize: 46, lineHeight: 1.14, fontWeight: 900, letterSpacing: -0.5, color: C.textStrong }}>{m.main}</div>
      <div style={{ fontSize: 38, lineHeight: 1.16, fontWeight: 800 }}>
        <span style={{ color: SOFT.cyan, opacity: 0.55 + 0.45 * passive }}>{m.passive}</span>
        <span style={{ color: C.text, fontWeight: 650 }}>{m.join}</span>
        <span style={{ color: SOFT.emerald, opacity: 0.55 + 0.45 * active }}>{m.active}</span>
      </div>
    </div>
  );
}
