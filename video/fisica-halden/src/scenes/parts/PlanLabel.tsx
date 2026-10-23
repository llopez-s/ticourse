import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { PLAN_LABEL } from '../../data/canon';

/**
 * «plano de ejemplo · sobre el papel» / «no es un edificio del puerto»: the floor plan's label, every time the plan is
 * the main image. Two lines (or one, `inline`), muted, with a dashed sky border: it is a drawing, not a place.
 */
export function PlanLabel({ size = 28, inline = false, style }: { size?: number; inline?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '8px 22px 8px 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px dashed ${alpha(C.sky, 0.55)}`,
        background: alpha(C.ink900, 0.85),
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 650,
        lineHeight: 1.2,
        color: C.muted,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <Icon name="layers" size={Math.round(size * 1.1)} color={C.sky} />
      {inline ? (
        <span>{`${PLAN_LABEL[0]} · ${PLAN_LABEL[1]}`}</span>
      ) : (
        <div>
          <div style={{ color: C.text }}>{PLAN_LABEL[0]}</div>
          <div>{PLAN_LABEL[1]}</div>
        </div>
      )}
    </div>
  );
}
