import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { clamp01 } from '../../../../../engine/src/ui';

/**
 * The shelf's plate («ERP»: the resource), centred on (x, y) in the nave's own px. The Warehouse can
 * write one itself (`shelfLabel`), at the shelf's top; in the simulator that corner belongs to the
 * DATA PLANE chip, so s04/s05 draw the plate on the shelf's lowest tier instead.
 */
export function ResourcePlate({ x, y, text, dim = 0, show = 1 }: { x: number; y: number; text: string; dim?: number; show?: number }) {
  const d = clamp01(dim);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        padding: '1px 16px 3px',
        borderRadius: 8,
        border: '2px solid #cbd5e1',
        background: C.ink900,
        boxShadow: `0 4px 10px ${alpha('#000000', 0.5)}`,
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 850,
        lineHeight: 1.16,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: clamp01(show) * (1 - 0.6 * d),
      }}
    >
      {text}
    </div>
  );
}
