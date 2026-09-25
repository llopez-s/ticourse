import { useCurrentFrame } from 'remotion';
import { useTimeline } from '../timeline/context';
import type { ExamCue } from '../timeline/types';
import { EASE, progress } from '../theme/motion';
import { C, FONT, LAYOUT, RADIUS, TYPE, alpha } from '../theme/tokens';
import { Icon } from '../ui/Icon';
import { twoLines, useFontsReady } from './Captions';

/** Enter (slide from the right + fade) and exit lengths, in frames. */
const ENTER = 12;
const EXIT = 10;
const SLIDE_IN = 40;
const SLIDE_OUT = 24;

/** Violet-tinted ink behind the card (violetDeep mixed into ink), at 92 %. */
const CARD_BG = alpha('#1a1033', 0.92);
const MAX_WIDTH = 824;
const TOP = 24;
const PAD_L = 22;
const PAD_R = 26;
const BODY = { size: TYPE.label, weight: 650 } as const;
/** Widest the body text may be inside a max-width card. */
const BODY_MAX = MAX_WIDTH - PAD_L - PAD_R - 4;

/**
 * Where one exam cue is in its life at `frame`: null when it is not on screen,
 * otherwise its opacity and horizontal offset (px, positive = to the right).
 */
export function examCueState(cue: ExamCue, frame: number): { opacity: number; offsetX: number } | null {
  const end = cue.from + cue.durationInFrames;
  if (frame < cue.from || frame >= end) return null;
  const pin = progress(frame, cue.from, ENTER, EASE.out);
  const pout = progress(frame, end - EXIT, EXIT, EASE.inOut);
  return {
    opacity: Math.min(pin, 1 - pout),
    offsetX: (1 - pin) * SLIDE_IN + pout * SLIDE_OUT,
  };
}

/** 0–1 visibility of the exam card at `frame` (max over overlapping cues). */
export function examPresence(exam: ExamCue[], frame: number): number {
  let presence = 0;
  for (const cue of exam) {
    const state = examCueState(cue, frame);
    if (state) presence = Math.max(presence, state.opacity);
  }
  return presence;
}

/** Frames the simulation tag takes to step aside (quickly, as the card lands) and to come back. */
const TAG_AWAY = 4;
const TAG_BACK = 8;

/**
 * Opacity of the SimulationTag, which shares the top-right corner with the
 * card. The two never overlap: the tag clears out while the card slides in and
 * only returns once the card has fully left.
 */
export function simulationTagOpacity(exam: ExamCue[], frame: number): number {
  let hidden = 0;
  for (const cue of exam) {
    const end = cue.from + cue.durationInFrames;
    if (frame < cue.from || frame >= end + TAG_BACK) continue;
    const away = progress(frame, cue.from, TAG_AWAY, EASE.out);
    const back = progress(frame, end, TAG_BACK, EASE.inOut);
    hidden = Math.max(hidden, Math.min(away, 1 - back));
  }
  return 1 - hidden;
}

/** The violet card itself, top-right, right edge on the stage margin. */
export function ExamCard({ objective, text, opacity = 1, offsetX = 0 }: { objective: string; text: string; opacity?: number; offsetX?: number }) {
  const fontsReady = useFontsReady();
  // One line when it fits, otherwise the two most even lines, with the card hugging them.
  const body = twoLines(text, BODY, fontsReady, BODY_MAX);
  return (
    <div
      style={{
        position: 'absolute',
        top: TOP,
        right: LAYOUT.width - LAYOUT.stage.right,
        maxWidth: MAX_WIDTH,
        boxSizing: 'border-box',
        padding: `13px ${PAD_R}px 14px ${PAD_L}px`,
        borderRadius: RADIUS.md + 2,
        background: CARD_BG,
        border: `2px solid ${alpha(C.violet, 0.9)}`,
        boxShadow: `0 0 36px ${alpha(C.violetStrong, 0.34)}, 0 0 0 5px ${alpha(C.violet, 0.07)}, 0 18px 40px ${alpha('#000000', 0.45)}`,
        opacity,
        transform: `translateX(${offsetX}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: TYPE.micro + 2 }}>
        <Icon name="mortarboard" size={28} color={C.violet} strokeWidth={2} />
        <span
          style={{
            fontSize: TYPE.micro,
            fontWeight: 800,
            letterSpacing: 2,
            lineHeight: 1,
            color: C.violet,
            whiteSpace: 'nowrap',
          }}
        >
          {`EXAMEN · SY0-701 · ${objective}`}
        </span>
      </div>
      <div
        style={{
          marginTop: 10,
          width: body.width,
          fontSize: BODY.size,
          fontWeight: BODY.weight,
          lineHeight: 1.22,
          color: C.textStrong,
        }}
      >
        {body.lines.map((line) => (
          <div key={line} style={{ whiteSpace: 'nowrap' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Pure view: every exam cue that is on screen at `frame`. */
export function ExamCueView({ exam, frame }: { exam: ExamCue[]; frame: number }) {
  const visible = exam
    .map((cue) => ({ cue, state: examCueState(cue, frame) }))
    .filter((entry): entry is { cue: ExamCue; state: { opacity: number; offsetX: number } } => entry.state !== null);
  if (visible.length === 0) return null;
  return (
    <>
      {visible.map(({ cue, state }) => (
        <ExamCard
          key={`${cue.scene}-${cue.from}`}
          objective={cue.objective}
          text={cue.text}
          opacity={state.opacity}
          offsetX={state.offsetX}
        />
      ))}
    </>
  );
}

/** Timeline-driven layer mounted by LessonVideo (absolute frame). */
export function ExamCueLayer() {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  return <ExamCueView exam={timeline.exam} frame={frame} />;
}
