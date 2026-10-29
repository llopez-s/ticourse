import { enterFramesFor, sceneTiming } from '../../../../engine/src/timeline/load';
import { TIMELINE } from '../../timeline/load';

/**
 * Local [from, to) of the scene's think-pause hold (the silent frames after the question's last word).
 * Same origin as `wordFrame`: the scene's Sequence starts `enterFrames` before its nominal start.
 */
export function thinkWindow(scene: string): { from: number; to: number } {
  const t = TIMELINE.think.find((x) => x.scene === scene);
  if (!t) throw new Error(`scene ${scene} has no think prompt in timeline.json`);
  const origin = sceneTiming(TIMELINE, scene).from - enterFramesFor(TIMELINE, scene);
  return { from: t.from - origin, to: t.from + t.durationInFrames - origin };
}
