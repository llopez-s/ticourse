import type { CSSProperties } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter } from '../../../../engine/src/theme/motion';
import { Icon } from '../../../../engine/src/ui';
import { STAMP_PARTS } from './data';

/** Stage-local top of the stamp. It lives in the stage's bottom-left corner so it never meets the exam card or the think prompt. */
export const STAMP_TOP = 612;
export const STAMP_H = 48;

/**
 * The case stamp «Autoridad Portuaria de Halden · imagina · caso de entrenamiento · sin fecha · no ha pasado», fixed in
 * the stage's bottom-left corner from s02 to s11. Amber = «supuesto». The engine's own «Simulación educativa · datos
 * ficticios» tag is not drawn here. Content above it must end by y ≈ 600 (STAMP_TOP − 12).
 */
export function CaseStamp({ frame, from = -6, style }: { frame: number; from?: number; style?: CSSProperties }) {
  const e = enter(frame, from, { distance: 10, duration: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: STAMP_TOP,
        height: STAMP_H,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 22px 0 14px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.amber, 0.55)}`,
        background: alpha(C.amber, 0.08),
        fontFamily: FONT.sans,
        fontSize: 26,
        whiteSpace: 'nowrap',
        ...e,
        ...style,
      }}
    >
      <Icon name="flag" size={26} color={C.amber} />
      {STAMP_PARTS.map((part, i) => (
        <span key={part} style={{ display: 'inline-flex', gap: 12 }}>
          {i > 0 ? <span style={{ fontWeight: 700, color: C.faint }}>·</span> : null}
          <span
            style={{
              fontWeight: part === 'imagina' ? 800 : i === 0 ? 700 : 600,
              color: part === 'imagina' ? C.amber : i === 0 ? C.textStrong : C.muted,
            }}
          >
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}
