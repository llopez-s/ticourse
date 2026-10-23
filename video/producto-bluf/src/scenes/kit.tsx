import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { enterFramesFor, sceneTiming } from '../../../engine/src/timeline/load';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { STAGE } from '../../../engine/src/theme/tokens';
import { TIMELINE } from '../timeline/load';

/** The drawable stage (1728×660 at y 190). Children use stage-local coordinates. */
export function Stage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height, ...style }}>
        {children}
      </div>
    </AbsoluteFill>
  );
}

/** Local [from, to) of a narration segment in the scene's Sequence. */
export function segment(props: SceneProps, id: string): { from: number; to: number } {
  const seg = props.segments.find((s) => s.id === id);
  if (!seg) throw new Error(`segment ${id} is not in this scene (have ${props.segments.map((s) => s.id).join(', ')})`);
  return seg;
}

const norm = (s: string) =>
  s
    .toLocaleLowerCase('es-ES')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '');

/**
 * Local frame at which the narration starts saying `word` inside segment
 * `segmentId` (the `nth` match, 0-based). Lets a scene sync a beat to a word
 * that has no cue of its own. Throws when the word is missing, so a script
 * edit that drops it fails loudly instead of drifting.
 */
export function wordFrame(sceneId: string, segmentId: string, word: string, nth = 0): number {
  const seg = TIMELINE.segments.find((s) => s.id === segmentId);
  if (!seg) throw new Error(`segment ${segmentId} is missing from timeline.json`);
  const want = norm(word);
  const hits = seg.words.filter((w) => norm(w.text) === want);
  const hit = hits[nth];
  if (!hit) throw new Error(`"${word}" (#${nth}) is not spoken in ${segmentId}: ${seg.text}`);
  const origin = sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
  return hit.from - origin;
}

/** Local frame of a scene's Sequence origin in absolute frames (where local 0 sits). */
function originOf(sceneId: string): number {
  return sceneTiming(TIMELINE, sceneId).from - enterFramesFor(TIMELINE, sceneId);
}

/**
 * Local [from, to) of the intercepted message that opens `segmentId`'s answer: from the start of the
 * silent lead (the card enters) to the end of the answering segment. Throws when the scene has none.
 */
export function interceptWindow(sceneId: string, segmentId: string): { from: number; to: number } {
  const seg = TIMELINE.segments.find((s) => s.id === segmentId);
  const hit = (TIMELINE.intercept ?? []).find((i) => i.scene === sceneId && seg && i.from + i.durationInFrames >= seg.from && i.from <= seg.from);
  if (!seg || !hit) throw new Error(`no intercepted message before ${segmentId}`);
  const o = originOf(sceneId);
  return { from: hit.from - o, to: hit.from - o + hit.durationInFrames };
}

/** Local [from, to) of the think prompt's silent hold in a scene (the free band is needed throughout). */
export function thinkWindow(sceneId: string): { from: number; to: number } {
  const hit = TIMELINE.think.find((t) => t.scene === sceneId);
  if (!hit) throw new Error(`no think prompt in ${sceneId}`);
  const o = originOf(sceneId);
  return { from: hit.from - o, to: hit.from - o + hit.durationInFrames };
}
