import { useCurrentFrame } from 'remotion';
import { useTimeline } from '../timeline/context';
import type { ExamCue } from '../timeline/types';
import { C, FONT, LAYOUT, RADIUS, TYPE } from '../theme/tokens';
import { simulationTagOpacity } from './ExamCueLayer';

export const SIMULATION_LABEL = 'Simulación educativa · datos ficticios';

/** Vertical centre of the top chrome row (shared with the ChapterRail label). */
export const CHROME_ROW_Y = 56;
const HEIGHT = 40;

/** The pill on its own, top-right, centred on the chrome row. */
export function SimulationPill({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: CHROME_ROW_Y - HEIGHT / 2,
        right: LAYOUT.width - LAYOUT.stage.right,
        height: HEIGHT,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 18px 0 14px',
        borderRadius: RADIUS.pill,
        background: C.ink850,
        border: `2px solid ${C.ink700}`,
        fontFamily: FONT.sans,
        fontSize: TYPE.micro,
        fontWeight: 600,
        lineHeight: 1,
        color: C.muted,
        whiteSpace: 'nowrap',
        opacity,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 4, background: C.faint, flexShrink: 0 }} />
      {SIMULATION_LABEL}
    </div>
  );
}

/** Pure view: the tag steps aside while an exam card owns the top-right corner. */
export function SimulationTagView({ exam, frame }: { exam: ExamCue[]; frame: number }) {
  const opacity = simulationTagOpacity(exam, frame);
  if (opacity <= 0.001) return null;
  return <SimulationPill opacity={opacity} />;
}

/** Timeline-driven tag mounted by LessonVideo (absolute frame). */
export function SimulationTag() {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  return <SimulationTagView exam={timeline.exam} frame={frame} />;
}
