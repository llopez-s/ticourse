import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../../engine/src/timeline/load';
import { simulationTagOpacity } from '../../../../engine/src/overlay/ExamCueLayer';
import { CHROME_ROW_Y } from '../../../../engine/src/overlay/SimulationTag';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../../../../engine/src/theme/tokens';
import { TIMELINE } from '../../timeline/load';
import { CASE_STAMP, IMAGE_TAG, TRAINING_TAG } from './data';

/**
 * Case stamp «Imagina · caso de entrenamiento · sin fecha · la oficina no es del puerto». Drawn by every
 * scene from s02 on, in the top chrome row under the engine's «Simulación educativa» pill. It steps aside
 * while an exam card owns that corner (same rule as the pill), so mount it OUTSIDE <Stage>:
 *   <CaseStamp scene={S} />
 */
export function CaseStamp({ scene }: { scene: string }) {
  const frame = useCurrentFrame();
  const origin = sceneTiming(TIMELINE, scene).from - enterFramesFor(TIMELINE, scene);
  const away = simulationTagOpacity(TIMELINE.exam, frame + origin);
  const opacity = progress(frame, 4, 14, EASE.out) * away;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: CHROME_ROW_Y + 28,
          right: LAYOUT.width - LAYOUT.stage.right,
          height: 40,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 18px 0 14px',
          borderRadius: RADIUS.pill,
          background: C.ink850,
          border: `2px solid ${alpha(C.sky, 0.55)}`,
          fontFamily: FONT.sans,
          fontSize: TYPE.micro,
          fontWeight: 650,
          lineHeight: 1,
          color: C.text,
          whiteSpace: 'nowrap',
          opacity,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 4, background: C.sky, flexShrink: 0 }} />
        {CASE_STAMP}
      </div>
    </AbsoluteFill>
  );
}

/** Small grey pill under every borrowed picture: «imagen · no es del puerto». */
export function ImageTag({ opacity = 1, style }: { opacity?: number; style?: CSSProperties }) {
  return <Tag opacity={opacity} style={style}>{IMAGE_TAG}</Tag>;
}

/** «ejemplo de entrenamiento»: marks a value that is new in this video (not port canon). */
export function TrainingTag({ opacity = 1, style }: { opacity?: number; style?: CSSProperties }) {
  return <Tag opacity={opacity} style={style}>{TRAINING_TAG}</Tag>;
}

function Tag({ children, opacity, style }: { children: ReactNode; opacity: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 16px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${C.ink600}`,
        background: alpha(C.ink900, 0.9),
        fontFamily: FONT.sans,
        fontSize: TYPE.small,
        fontWeight: 600,
        lineHeight: 1.1,
        color: C.muted,
        whiteSpace: 'nowrap',
        opacity,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** A big caption line used by the scenes (weight/size defaults for the text the voice points at). */
export function Line({ children, size = 44, color = C.textStrong, weight = 750, style }: { children: ReactNode; size?: number; color?: string; weight?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: weight, color, lineHeight: 1.2, whiteSpace: 'nowrap', ...style }}>{children}</div>
  );
}
