import { enterFramesFor, sceneTiming } from '../../../../engine/src/timeline/load';
import { TIMELINE } from '../../timeline/load';

/** Local frame 0 of a scene's Sequence, in absolute timeline frames (same origin as wordFrame). */
function origin(sceneId: string): number {
  return sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
}

/** Local [from, to) of the intercepted-message card in a scene (its top band must stay clear), or null. */
export function interceptWindow(sceneId: string): { from: number; to: number } | null {
  const hit = (TIMELINE.intercept ?? []).find((i) => i.scene === sceneId);
  if (!hit) return null;
  const o = origin(sceneId);
  return { from: hit.from - o, to: hit.from + hit.durationInFrames - o };
}

/** Local [from, to) of the exam card of a scene (the card draws in the top band, outside the stage), or null. */
export function examWindow(sceneId: string): { from: number; to: number } | null {
  const hit = TIMELINE.exam.find((e) => e.scene === sceneId);
  if (!hit) return null;
  const o = origin(sceneId);
  return { from: hit.from - o, to: hit.from + hit.durationInFrames - o };
}

/** Local [from, to) of the think prompt of a scene, or null. */
export function thinkWindow(sceneId: string): { from: number; to: number } | null {
  const hit = TIMELINE.think.find((t) => t.scene === sceneId);
  if (!hit) return null;
  const o = origin(sceneId);
  return { from: hit.from - o, to: hit.from + hit.durationInFrames - o };
}

/** Deterministic pseudo-random 0–1 from an integer seed (no Math.random). */
export function hash01(n: number): number {
  let x = Math.imul(n + 0x9e3779b9, 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}
