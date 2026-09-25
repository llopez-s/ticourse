import { useCurrentFrame } from 'remotion';
import { useTimeline } from '../timeline/context';
import type { ChapterNumber, SceneTiming } from '../timeline/types';
import { C, LAYOUT, alpha } from '../theme/tokens';

const Y = LAYOUT.progressY;
const H = 4;
const TICK_W = 4;
const TICK_H = 12;

/** First frame of each chapter present in `scenes`, in chapter order. */
function chapterStarts(scenes: SceneTiming[]): { chapter: ChapterNumber; from: number }[] {
  const starts: { chapter: ChapterNumber; from: number }[] = [];
  for (const scene of scenes) {
    if (!starts.some((s) => s.chapter === scene.chapter)) starts.push({ chapter: scene.chapter, from: scene.from });
  }
  return starts.sort((a, b) => a.from - b.from);
}

/**
 * Pure view. A 4 px track along the bottom edge: cyan fill proportional to
 * frame / total, the current chapter's stretch of track slightly lighter (and
 * its fill brighter than the chapters already done), and a tick where each
 * chapter after the first begins.
 */
export function ProgressBarView({ scenes, frame, total }: { scenes: SceneTiming[]; frame: number; total: number }) {
  if (total <= 0) return null;
  const W = LAYOUT.width;
  const x = (f: number) => (Math.max(0, Math.min(total, f)) / total) * W;
  const head = x(frame + 1);

  const starts = chapterStarts(scenes);
  let c = 0;
  for (let k = 0; k < starts.length; k++) if (frame >= starts[k].from) c = k;
  const segFrom = starts.length ? x(starts[c].from) : 0;
  const segTo = starts[c + 1] ? x(starts[c + 1].from) : W;

  return (
    <div style={{ position: 'absolute', left: 0, top: Y - 8, width: W, height: LAYOUT.height - (Y - 8), pointerEvents: 'none' }}>
      {/* track */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: W, height: H, background: C.ink800 }} />
      {/* current chapter's stretch of track */}
      <div style={{ position: 'absolute', left: segFrom, top: 8, width: segTo - segFrom, height: H, background: C.ink600 }} />
      {/* fill: chapters already done */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: Math.min(head, segFrom), height: H, background: alpha(C.cyan, 0.6) }} />
      {/* fill: current chapter */}
      {head > segFrom ? (
        <div
          style={{
            position: 'absolute',
            left: segFrom,
            top: 8,
            width: head - segFrom,
            height: H,
            background: C.cyan,
            boxShadow: `0 0 10px ${alpha(C.cyan, 0.55)}`,
          }}
        />
      ) : null}
      {/* chapter ticks (chapters 2–5) */}
      {starts.slice(1).map((s) => {
        const passed = frame >= s.from;
        return (
          <div
            key={s.chapter}
            style={{
              position: 'absolute',
              left: x(s.from) - TICK_W / 2,
              top: 8 + H / 2 - TICK_H / 2,
              width: TICK_W,
              height: TICK_H,
              borderRadius: 2,
              background: passed ? C.cyanSoft : C.ink500,
              boxShadow: `0 0 0 2px ${C.ink950}`,
            }}
          />
        );
      })}
    </div>
  );
}

/** Timeline-driven bar mounted by LessonVideo (absolute frame). */
export function ProgressBar() {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  return <ProgressBarView scenes={timeline.scenes} frame={frame} total={timeline.durationInFrames} />;
}
