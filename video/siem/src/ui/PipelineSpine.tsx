import type { CSSProperties } from 'react';
import { C, FONT, TYPE, alpha } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

export const PIPELINE_STAGES: { label: string; icon: IconName }[] = [
  { label: 'Recoger', icon: 'funnel' },
  { label: 'Normalizar', icon: 'layers' },
  { label: 'Enriquecer', icon: 'plug' },
  { label: 'Correlacionar', icon: 'link' },
  { label: 'Alertar', icon: 'bell' },
];

/**
 * Continuity device for the "Cómo funciona" chapter (S02–S05) and the recap:
 * the five SIEM stages in a row. Stages before `active` read as done, `active`
 * is lit (its `intensity` 0–1 fades the highlight in), later ones are dim.
 * Pass active = 5 to light everything (recap).
 * Default width fits the stage (1728 px); height is 76 px.
 */
export function PipelineSpine({
  active,
  intensity = 1,
  width = 1728,
  style,
}: {
  active: number;
  intensity?: number;
  width?: number;
  style?: CSSProperties;
}) {
  const gap = 14;
  const itemWidth = (width - gap * (PIPELINE_STAGES.length - 1)) / PIPELINE_STAGES.length;
  return (
    <div style={{ display: 'flex', gap, width, ...style }}>
      {PIPELINE_STAGES.map((stage, index) => {
        const all = active >= PIPELINE_STAGES.length;
        const isActive = index === active || all;
        const done = index < active && !all;
        const lit = isActive ? intensity : 0;
        const color = isActive ? C.cyan : done ? C.cyanSoft : C.faint;
        return (
          <div
            key={stage.label}
            style={{
              width: itemWidth,
              height: 76,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              borderRadius: 18,
              background: isActive ? alpha(C.cyan, 0.08 + 0.1 * lit) : done ? alpha(C.cyan, 0.05) : alpha(C.ink850, 0.8),
              border: `2px solid ${isActive ? alpha(C.cyan, 0.35 + 0.55 * lit) : done ? alpha(C.cyan, 0.3) : C.ink700}`,
              boxShadow: isActive ? `0 0 ${30 * lit}px ${alpha(C.cyan, 0.3 * lit)}` : 'none',
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: isActive ? 750 : 600,
              color: isActive ? C.textStrong : done ? C.text : C.faint,
            }}
          >
            <Icon name={done ? 'check' : stage.icon} size={30} color={color} />
            {stage.label}
          </div>
        );
      })}
    </div>
  );
}
