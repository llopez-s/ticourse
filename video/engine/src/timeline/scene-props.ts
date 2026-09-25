import { enterFramesFor, sceneTiming } from './load';
import type { SceneId, SceneProps, Timeline } from './types';

/**
 * Converts the absolute timeline into the local frame space of one scene's
 * Sequence, which starts `enterFrames` before the scene's nominal start.
 */
export function buildSceneProps(timeline: Timeline, id: SceneId): SceneProps {
  const scene = sceneTiming(timeline, id);
  const enterFrames = enterFramesFor(timeline, id);
  const origin = scene.from - enterFrames;
  const cues = new Map(
    timeline.cues.filter((c) => c.scene === id).map((c) => [c.id, c.frame - origin] as const),
  );

  return {
    durationInFrames: scene.durationInFrames + enterFrames,
    enterFrames,
    cue: (cueId: string) => {
      const frame = cues.get(cueId);
      if (frame === undefined) {
        throw new Error(`Unknown cue "${cueId}" in ${id}. Known: ${[...cues.keys()].join(', ')}`);
      }
      return frame;
    },
    segments: timeline.segments
      .filter((s) => s.scene === id)
      .map((s) => ({ id: s.id, from: s.from - origin, to: s.from - origin + s.durationInFrames })),
  };
}
