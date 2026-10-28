import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { progress } from '../../../../engine/src/theme/motion';
import { SEAL_TEXT, STAGE_H } from './data';

/**
 * The permanent seal of s02–s12: «Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto».
 * The engine only draws «Simulación educativa · datos ficticios», so every scene draws this one itself, at the
 * bottom-left of the stage (stage-local y ≈ 616–656). s01 has none. Keep scene content above y ≈ 608.
 */
export const SEAL_TOP = STAGE_H - 44;

export function ImaginaSeal({ at = 0, style }: { at?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const p = progress(frame, at, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: SEAL_TOP,
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.amber, 0.45)}`,
        background: alpha(C.ink950, 0.85),
        fontFamily: FONT.sans,
        fontSize: TYPE.small - 2,
        fontWeight: 650,
        color: C.muted,
        whiteSpace: 'nowrap',
        opacity: p,
        ...style,
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.amber, flexShrink: 0 }} />
      {SEAL_TEXT}
    </div>
  );
}
