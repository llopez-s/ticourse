import { enterFramesFor, sceneTiming } from '../../../../engine/src/timeline/load';
import { EASE, progress } from '../../../../engine/src/theme/motion';
import { TIMELINE } from '../../timeline/load';

/** Absolute frame at which a scene's Sequence (and its local frame 0) starts: the nominal start minus the enter overlap. */
export function sceneOrigin(sceneId: string): number {
  return sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
}

/**
 * The window of the scene's think prompt in LOCAL frames (the engine draws the card at the top centre of the stage from
 * `from` to `to`; keep that band free), or null when the scene has none.
 */
export function thinkWindow(sceneId: string): { from: number; to: number } | null {
  const t = TIMELINE.think.find((x) => x.scene === sceneId);
  if (!t) return null;
  const o = sceneOrigin(sceneId);
  return { from: t.from - o, to: t.from - o + t.durationInFrames };
}

/**
 * 0–1 weight of an element that lives in [from, to): eases in over `ramp` frames from `from` and out over `ramp` frames
 * before `to`. `to` may be Infinity.
 */
export function win(frame: number, from: number, to = Number.POSITIVE_INFINITY, ramp = 12): number {
  const i = progress(frame, from, ramp, EASE.out);
  const o = Number.isFinite(to) ? progress(frame, to - ramp, ramp, EASE.inOut) : 0;
  return i * (1 - o);
}
