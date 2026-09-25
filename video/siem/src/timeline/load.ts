import raw from '../timeline.json';
import type { SceneId, SceneTiming, Timeline } from './types';

/** Transition overlap between consecutive scenes, in frames. */
export const TRANSITION_FRAMES = 15;

export const TIMELINE = raw as unknown as Timeline;

if (!TIMELINE.scenes?.length || !TIMELINE.durationInFrames) {
  throw new Error('timeline.json is empty — run scripts/build-timeline.mjs');
}

export function sceneTiming(id: SceneId): SceneTiming {
  const scene = TIMELINE.scenes.find((s) => s.id === id);
  if (!scene) throw new Error(`Scene ${id} is missing from timeline.json`);
  return scene;
}

/** Frames of visual overlap before a scene's nominal start. */
export function enterFramesFor(id: SceneId): number {
  return TIMELINE.scenes[0].id === id ? 0 : TRANSITION_FRAMES;
}
