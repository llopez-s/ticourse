import { enterFramesFor, sceneTiming } from '../../../../engine/src/timeline/load';
import { TIMELINE } from '../../timeline/load';

/**
 * Local frame (in the scene's Sequence) at which the engine's exam card of `sceneId` starts: the end of the sentence that
 * holds the card's cue. Mirrors kit.tsx's `wordFrame` origin maths, so it moves with the recording.
 */
export function examStart(sceneId: string): number {
  const exam = TIMELINE.exam.find((e) => e.scene === sceneId);
  if (!exam) throw new Error(`scene ${sceneId} has no exam card`);
  const origin = sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
  return exam.from - origin;
}

/** Local frame at which the think prompt that follows segment `segmentId` starts, or throws. */
export function thinkStart(sceneId: string): number {
  const think = TIMELINE.think.find((t) => t.scene === sceneId);
  if (!think) throw new Error(`scene ${sceneId} has no think prompt`);
  const origin = sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
  return think.from - origin;
}
