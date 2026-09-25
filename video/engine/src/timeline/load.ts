import type { SceneId, SceneTiming, Timeline } from './types';

/** Transition overlap between consecutive scenes, in frames (build-timeline TIMING.transitionFrames). */
export const TRANSITION_FRAMES = 15;

/** Types a video's imported timeline.json and fails fast when it was never built. */
export function checkTimeline(raw: unknown): Timeline {
  const timeline = raw as Timeline;
  if (!timeline?.scenes?.length || !timeline.durationInFrames) {
    throw new Error('timeline.json is empty — run video/engine/scripts/build-timeline.mjs');
  }
  return timeline;
}

export function sceneTiming(timeline: Timeline, id: SceneId): SceneTiming {
  const scene = timeline.scenes.find((s) => s.id === id);
  if (!scene) throw new Error(`Scene ${id} is missing from timeline.json`);
  return scene;
}

/** Frames of visual overlap before a scene's nominal start. */
export function enterFramesFor(timeline: Timeline, id: SceneId): number {
  return timeline.scenes[0].id === id ? 0 : TRANSITION_FRAMES;
}
