import { C, alpha } from '../../../../engine/src/theme/tokens';
import { ENVELOPES, type EnvelopeId } from '../../data/niveles';

/**
 * What shows on the card that peeks out of each envelope (natural envelope coordinates, 432 px of
 * text width). The ask is the reader's question (s01): a question, not a decision.
 */
export function EnvelopeAsk({ id, smallIn = 1 }: { id: EnvelopeId; smallIn?: number }) {
  const e = ENVELOPES[id];
  return (
    <div>
      <div style={{ fontSize: 50, fontWeight: 850, lineHeight: 1.12, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {e.askLines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {e.small ? (
        <div style={{ marginTop: 12, fontSize: 40, fontWeight: 700, color: alpha(e.tone, 1), opacity: smallIn, whiteSpace: 'nowrap' }}>{e.small}</div>
      ) : null}
    </div>
  );
}

/** What the analyst prepares for that reader (s05): the product's name, not a delivery. */
export function EnvelopeProduct({ id }: { id: EnvelopeId }) {
  const lines = id === 'board' ? (['evaluación', 'de tendencias', 'del sector'] as const) : (['indicadores', 'y reglas de', 'detección'] as const);
  return (
    <div>
      <div style={{ fontSize: 46, fontWeight: 850, lineHeight: 1.12, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    </div>
  );
}
