import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { EXAMPLE_NOTE } from '../../data/shared';

/**
 * The fixed note of s03, s04 and s05, there from the first frame: the sentences on screen are the lesson's own
 * examples, not the campaign's. A pill centred on `width`, at the foot of the stage (top = 606 of 660), clear of the
 * band under the engine's cards (the first ~210 px).
 */
export function ExampleLabel({ width, top = 606 }: { width: number; top?: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top, width, display: 'flex', justifyContent: 'center', fontFamily: FONT.sans }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          height: 50,
          padding: '0 28px 0 20px',
          boxSizing: 'border-box',
          borderRadius: RADIUS.pill,
          background: alpha(C.ink900, 0.92),
          border: `2px solid ${alpha(C.muted, 0.55)}`,
          fontSize: 30,
          fontWeight: 650,
          color: C.text,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="file" size={30} color={C.muted} strokeWidth={2} />
        {EXAMPLE_NOTE}
      </div>
    </div>
  );
}
