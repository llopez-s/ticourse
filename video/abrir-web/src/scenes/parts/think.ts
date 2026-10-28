import { enterFramesFor, sceneTiming } from '../../../../engine/src/timeline/load';
import { TIMELINE } from '../../timeline/load';

/**
 * Scene-local [from, to) of the scene's think prompt (the engine draws the card in the top band, stage-local
 * y ≈ 10–175, x ≈ 164–1564). Same origin as `wordFrame` in kit.tsx. Keep that band free between these frames.
 */
export function thinkWindow(sceneId: string): { from: number; to: number } {
  const t = TIMELINE.think.find((x) => x.scene === sceneId);
  if (!t) throw new Error(`no think prompt in ${sceneId}`);
  const origin = sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
  return { from: t.from - origin, to: t.from + t.durationInFrames - origin };
}
