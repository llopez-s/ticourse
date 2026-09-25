import raw from '../timeline.json';
import * as engine from '../../../engine/src/timeline/load';
import type { SceneId, SceneTiming } from '../../../engine/src/timeline/types';

export { TRANSITION_FRAMES } from '../../../engine/src/timeline/load';

/** This video's timeline (built by video/engine/scripts/build-timeline.mjs --video siem). */
export const TIMELINE = engine.checkTimeline(raw);

export function sceneTiming(id: SceneId): SceneTiming {
  return engine.sceneTiming(TIMELINE, id);
}

/** Frames of visual overlap before a scene's nominal start. */
export function enterFramesFor(id: SceneId): number {
  return engine.enterFramesFor(TIMELINE, id);
}
